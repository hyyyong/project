/*----------------------------------------------------------------
    Copyright (C) 2017 Senparc
    
    文件名：WeixinAsyncController.cs
    文件功能描述：此Controller为异步Controller（Action），使用异步线程处理并发请求。
    
    
    创建标识：Senparc - 20150312
----------------------------------------------------------------*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using Senparc.Weixin.MP.Entities.Request;
using Senparc.Weixin.MP.MvcExtension;
using Senparc.Weixin.MP.Sample.CommonService.CustomMessageHandler;
using System.Text;
using System.Web.Script.Serialization;
using Senparc.Weixin.MP.Containers;
using System.Net;
using System.IO;
using Senparc.Weixin.MP.Sample.CommonService;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using Model;

namespace Senparc.Weixin.MP.Sample.Controllers
{
    /// <summary>
    /// 此Controller为异步Controller（Action），使用异步线程处理并发请求。
    /// 为了方便演示，此Controller中没有加入多余的日志记录等示例，保持了最简单的Controller写法。日志等其他操作可以参考WeixinController.cs。
    /// 提示：异步Controller并不是在任何情况下都能提升效率（响应时间），当请求量非常小的时候反而会增加一定的开销。
    /// </summary>
    public class WeixinAsyncController : AsyncController
    {
        public static readonly string Token = WebConfigurationManager.AppSettings["WeixinToken"];//与微信公众账号后台的Token设置保持一致，区分大小写。
        public static readonly string EncodingAESKey = WebConfigurationManager.AppSettings["WeixinEncodingAESKey"];//与微信公众账号后台的EncodingAESKey设置保持一致，区分大小写。
        public static readonly string AppId = WebConfigurationManager.AppSettings["WeixinAppId"];//与微信公众账号后台的AppId设置保持一致，区分大小写。        
        public static readonly string secret = WebConfigurationManager.AppSettings["WeixinAppSecret"];

        public WeixinAsyncController()
        {
        }


        [HttpGet]
        [ActionName("Index")]
        public Task<ActionResult> Index(string signature, string timestamp, string nonce, string echostr)
        {
            return Task.Factory.StartNew(() =>
                 {
                     if (CheckSignature.Check(signature, timestamp, nonce, Token))
                     {
                         return echostr; //返回随机字符串则表示验证通过
                     }
                     else
                     {
                         return "failed:" + signature + "," + MP.CheckSignature.GetSignature(timestamp, nonce, Token) + "。" +
                             "如果你在浏览器中看到这句话，说明此地址可以被作为微信公众账号后台的Url，请注意保持Token一致。";
                     }
                 }).ContinueWith<ActionResult>(task => Content(task.Result));
        }


        /// <summary>
        /// 最简化的处理流程
        /// </summary>
        [HttpPost]
        [ActionName("Index")]
        public Task<ActionResult> MiniPost(PostModel postModel)
        {
            return Task.Factory.StartNew<ActionResult>(() =>
            {
                if (!CheckSignature.Check(postModel.Signature, postModel.Timestamp, postModel.Nonce, Token))
                {
                    return new WeixinResult("参数错误！");
                }

                postModel.Token = Token;
                postModel.EncodingAESKey = EncodingAESKey; //根据自己后台的设置保持一致
                postModel.AppId = AppId; //根据自己后台的设置保持一致

                var messageHandler = new CustomMessageHandler(Request.InputStream, postModel, 10);

                messageHandler.Execute(); //执行微信处理过程

                return new FixWeixinBugWeixinResult(messageHandler);

            }).ContinueWith<ActionResult>(task => task.Result);
        }

        /// <summary>
        /// 为测试并发性能而建
        /// </summary>
        /// <returns></returns>
        public Task<ActionResult> ForTest()
        {
            //异步并发测试（提供给单元测试使用）
            return Task.Factory.StartNew<ActionResult>(() =>
            {
                DateTime begin = DateTime.Now;
                int t1, t2, t3;
                System.Threading.ThreadPool.GetAvailableThreads(out t1, out t3);
                System.Threading.ThreadPool.GetMaxThreads(out t2, out t3);
                System.Threading.Thread.Sleep(TimeSpan.FromSeconds(0.1));
                DateTime end = DateTime.Now;
                var thread = System.Threading.Thread.CurrentThread;
                var result = string.Format("TId:{0}\tApp:{1}\tBegin:{2:mm:ss,ffff}\tEnd:{3:mm:ss,ffff}\tTPool：{4}",
                    thread.ManagedThreadId,
                    HttpContext.ApplicationInstance.GetHashCode(),
                    begin,
                    end,
                    t2 - t1
                    );
                return Content(result);
            });
        }

        [HttpGet]
        [ActionName("alarm")]
        public Task<ActionResult> GetAlarm(string wxid, string alarm)
        {

            //vehid:141,plate:刘平先,angle:0,lat:22.53061,lon:114.03106,speed:0,state:停车,time:2017-11-07 00:26:52,alarm:超速报警
            return Task.Factory.StartNew(() =>
            {

                //Newtonsoft.Json.Linq.JObject objj = (Newtonsoft.Json.Linq.JObject)JsonConvert.DeserializeObject(alarm);
                string[] alarmInfo = alarm.Split(',');

                double dLon = Convert.ToDouble(alarmInfo[4].Split(':')[1]);//116.47359;经度
                double dLat = Convert.ToDouble(alarmInfo[3].Split(':')[1]);// 39.92437; 
                GpsConvent.transform(ref dLat, ref dLon);
                string addInfo = getLocation(0 + "," + dLon + "," + dLat);
                if (addInfo != "" && addInfo.IndexOf(":\"") >= 0)// && markersList.Y != 0 && markersList.X != 0
                {
                    addInfo = Regex.Split(addInfo, ":\"", RegexOptions.IgnoreCase)[2];
                    addInfo = Regex.Split(addInfo, "\"}", RegexOptions.IgnoreCase)[0];
                }
                else
                {
                    addInfo = "未获取位置数据...";
                }
                Alarm sendDate = new Alarm();
                // sendDate.touser = "oIsOPvwHB15dCy0WM_7sFNJADESw";
                sendDate.touser = wxid;
                sendDate.url = WebConfigurationManager.AppSettings["LoginAppHtml"] + "#/alarmMap/alarm=" + alarm + "&address=" + System.Web.HttpUtility.UrlEncode(addInfo, System.Text.Encoding.GetEncoding("UTF-8"));
                //sendDate.template_id = "0oMPYsSVIJf7int6qFwj17bImr13-wMWcH3a30-_PUs";
                sendDate.miniprogram = new Miniprogram();
                // sendDate.miniprogram.appid = "wx042ca543e90fa431";
                // sendDate.miniprogram.pagepath = "page/tool/index";
                // sendDate.template_id = "kUBIAnN4iNQHYIz5AvWQJzgOH0X-xLrml9DkTSVfE_M";
                //sendDate.template_id = "VtDePRUfMUKXnTLzqAK1WCyTPvcFeROFkVScFzXLOpg";
                // sendDate.template_id = "7vEQwyGFLVV-iu2sDeVDHpYtOfnJ13PQQgwZ9GaaNGg";
                sendDate.template_id = "Bfqa3Pcaiacnc3k6ZqTt7rHjpVg1rJJQhKopC-BV2Xg";
                sendDate.data = new Data();
                sendDate.data.first = new First();
                sendDate.data.keyword1 = new Keyword1();
                sendDate.data.keyword2 = new Keyword2();
                sendDate.data.keyword3 = new Keyword3();
                sendDate.data.keyword4 = new Keyword4();
                // sendDate.data.keyword5 = new Keyword5();
                sendDate.data.remark = new Remark();

                sendDate.data.first.value = "车辆报警提醒";
                sendDate.data.first.color = "#173177";

                sendDate.data.keyword1.value = alarmInfo[1].Split(':')[1];// "车牌号码";
                sendDate.data.keyword1.color = "#173177";

                sendDate.data.keyword2.value = alarmInfo[8].Split(':')[1];// "报警类型";
                sendDate.data.keyword2.color = "#ff0000";

                sendDate.data.keyword3.value = alarmInfo[7].Split(':')[1]; ;//报警时间 
                sendDate.data.keyword3.color = "#173177";

                sendDate.data.keyword4.value = addInfo;// "报警地址";
                sendDate.data.keyword4.color = "#173177";

                //sendDate.data.keyword5.value = addInfo;
                //sendDate.data.keyword5.color = "#173177";

                sendDate.data.remark.value = "点击查看详细信息...";
                sendDate.data.remark.color = "#173177";

                string strData = GetJson(sendDate);
                string op = SendMsg(strData);

                return "ok";

            }).ContinueWith<ActionResult>(task => Content(task.Result));
            // string userid="oCPhuwGzsJRLf-AqySiL0QB6uTJA";      





        }

        #region GetJson
        //获取位置
        public string getLocation(string Location)
        {
            try
            {
                string str = "";
                string url = "http://120.24.239.98:8080/?Location=" + Location;
                HttpWebRequest wReq = (HttpWebRequest)WebRequest.Create(new Uri(url, true));

                wReq.Method = "Get";
                wReq.KeepAlive = false;
                wReq.Timeout = 15000;
                HttpWebResponse wResp = (HttpWebResponse)wReq.GetResponse();
                System.IO.Stream respStream = wResp.GetResponseStream();
                //  using (System.IO.StreamReader reader = new System.IO.StreamReader(respStream, Encoding.UTF8))
                using (System.IO.StreamReader reader = new System.IO.StreamReader(respStream, Encoding.GetEncoding("GBK")))
                {
                    str = reader.ReadToEnd();
                }

                return str;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        public static string GetJson(Alarm myInfo)
        {
            StringBuilder stringBuilder = new StringBuilder();
            JavaScriptSerializer json = new JavaScriptSerializer();
            json.Serialize(myInfo, stringBuilder);
            return stringBuilder.ToString();

            // 和下面的代码有同样的效果  
            //JavaScriptSerializer json = new JavaScriptSerializer();  
            //return json.Serialize(myInfo);  
        }

        public static string SendMsg(string data)
        {
            //string appidstr = "wxa1f6eba184ca48f6";
            //string appSecret = "69001401b2e2bfa3af23f7e53c3bb9f1";
            string accessToken = AccessTokenContainer.TryGetAccessToken(AppId, secret);
            // accessToken = "1Lap3wGGicQQNi11DjGmPZKlkZSJqrUG33DtHL9uKM_fIfWsEfQvtgLENyQ5jXw4zrtPxLB3zacKHzK2rH_e50lz5kmncJpK_6U5npYsn6fewWy9g46KfmA34grBTMFwTQAdAAABYI";
            //var resultappid = Senparc.Weixin.MP.AdvancedAPIs.UserApi.Get(accessToken, null);
            string url = string.Format("https://api.weixin.qq.com/cgi-bin/message/template/send?access_token={0}", accessToken);
            HttpWebRequest hwr = WebRequest.Create(url) as HttpWebRequest;
            hwr.Method = "POST";
            hwr.ContentType = "application/x-www-form-urlencoded";
            byte[] payload;
            payload = System.Text.Encoding.UTF8.GetBytes(data); //通过UTF-8编码  
            hwr.ContentLength = payload.Length;
            Stream writer = hwr.GetRequestStream();
            writer.Write(payload, 0, payload.Length);
            writer.Close();
            var result = hwr.GetResponse() as HttpWebResponse; //此句是获得上面URl返回的数据  
            string strMsg = WebResponseGet(result);
            return strMsg;
        }

        public static string WebResponseGet(HttpWebResponse webResponse)
        {
            StreamReader responseReader = null;
            string responseData = "";
            try
            {
                responseReader = new StreamReader(webResponse.GetResponseStream());
                responseData = responseReader.ReadToEnd();
            }
            catch
            {
                throw;
            }
            finally
            {
                webResponse.GetResponseStream().Close();
                responseReader.Close();
                responseReader = null;
            }
            return responseData;
        }
        #endregion

       

    }
}
