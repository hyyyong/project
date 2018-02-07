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
    public class RealTimeAsyncController : AsyncController
    {
       // public static readonly string Token = WebConfigurationManager.AppSettings["WeixinToken"];

        public RealTimeAsyncController()
        {
        }


        [HttpGet]
        [ActionName("Index")]
        public Task<ActionResult> Index(string signature, string timestamp, string nonce, string echostr)
        {
            return Task.Factory.StartNew(() =>
                 {
                   
                         return ""; //返回随机字符串则表示验证通过
                
                 }).ContinueWith<ActionResult>(task => Content(task.Result));
        }


        /// <summary>
        /// 最简化的处理流程
        /// </summary>
        //[HttpPost]
        //[ActionName("Index")]
        //public Task<ActionResult> MiniPost(PostModel postModel)
        //{
        //    return Task.Factory.StartNew<ActionResult>(() =>
        //    {
        //        if (!CheckSignature.Check(postModel.Signature, postModel.Timestamp, postModel.Nonce, Token))
        //        {
        //            return new WeixinResult("参数错误！");
        //        }

        //        postModel.Token = Token;
        //        postModel.EncodingAESKey = EncodingAESKey; //根据自己后台的设置保持一致
        //        postModel.AppId = AppId; //根据自己后台的设置保持一致

        //        var messageHandler = new CustomMessageHandler(Request.InputStream, postModel, 10);

        //        messageHandler.Execute(); //执行微信处理过程

        //        return new FixWeixinBugWeixinResult(messageHandler);

        //    }).ContinueWith<ActionResult>(task => task.Result);
        //}

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
        [ActionName("realtime")]
        public Task<ActionResult> RealTime(string vehId)
        {           
            return Task.Factory.StartNew(() =>
            {
                var redis = Wdj.Redis.Helper.RedisHelper.HashService;
                var cacheCode = redis.HashGet<object>("VehId_" + vehId, "RealTimeData").ToString();
                if (cacheCode == null || cacheCode == "" || cacheCode == "[]")
                {
                    return "获取实时数据失败..";
                }

                return cacheCode;

            }).ContinueWith<ActionResult>(task => Content(task.Result));

        }



        

        

       

    }
}
