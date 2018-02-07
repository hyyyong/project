using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Manager;
using Model;

namespace GpsWebApI
{
    public class MessageHandler : System.Net.Http.DelegatingHandler
    {
        const string Origin = "Origin";

        const string AccessControlRequestMethod = "Access-Control-Request-Method";

        const string AccessControlRequestHeaders = "Access-Control-Request-Headers";

        const string AccessControlAllowOrigin = "Access-Control-Allow-Origin";


        const string AccessControlAllowMethods = "Access-Control-Allow-Methods";

        const string AccessControlAllowHeaders = "Access-Control-Allow-Headers";

        int CycleTime = Convert.ToInt32(ConfigurationManager.AppSettings["CycleTime"].ToString()); //时间周期
        int HttpRequestTimes = Convert.ToInt32(ConfigurationManager.AppSettings["HttpRequestTimes"].ToString()); //请求次数

        public static string GetIP()
        {
            //如果客户端使用了代理服务器，则利用HTTP_X_FORWARDED_FOR找到客户端IP地址
            string userHostAddress = "";
            //HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"].ToString().Split(',')[0].Trim();
            //否则直接读取REMOTE_ADDR获取客户端IP地址
            if (string.IsNullOrEmpty(userHostAddress))
            {
                userHostAddress = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
            }
            //前两者均失败，则利用Request.UserHostAddress属性获取IP地址，但此时无法确定该IP是客户端IP还是代理IP
            if (string.IsNullOrEmpty(userHostAddress))
            {
                userHostAddress = HttpContext.Current.Request.UserHostAddress;
            }
            //最后判断获取是否成功，并检查IP地址的格式（检查其格式非常重要）
            if (!string.IsNullOrEmpty(userHostAddress) && IsIP(userHostAddress))
            {
                return userHostAddress;
            }
            return "127.0.0.1";
        }

        //<summary>
        //检查IP地址格式
        //</summary>
        //<param name="ip"></param>
        //<returns></returns>
        public static bool IsIP(string ip)
        {
            return System.Text.RegularExpressions.Regex.IsMatch(ip, @"^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$");
        }

        #region LastRequest
        public class LastRequest
        {
            private string key;

            public string Key
            {
                get { return key; }
                set { key = value; }
            }

            private int count = 0;

            public int Count
            {
                get { return count; }
                set { count = value; }
            }
            private DateTime dtLastTime;

            public DateTime DtLastTime
            {
                get { return dtLastTime; }
                set { dtLastTime = value; }
            }
        }
        #endregion

        public bool check(string key, int times)
        {

            List<LastRequest> lsList;
            if (HttpContext.Current.Application["LRlist"] == null)
            {
                lsList = new List<LastRequest>();
                LastRequest ls = new LastRequest();
                ls.Key = key;
                ls.Count++;
                ls.DtLastTime = DateTime.Now;
                lsList.Add(ls);
                HttpContext.Current.Application.Add("LRlist", lsList);
                return true;
            }
            else
            {
                lsList = (List<LastRequest>)HttpContext.Current.Application["LRlist"];
                bool isAdd = true;

                for (int i = 0; i < lsList.Count; i++)
                {
                    if (lsList[i].Key == key)
                    {
                        isAdd = false;
                        if ((DateTime.Now - lsList[i].DtLastTime).TotalMinutes < CycleTime & lsList[i].Count > times)
                        {
                            return false;
                        }
                        else if ((DateTime.Now - lsList[i].DtLastTime).TotalMinutes > CycleTime)
                        {
                            lsList[i].DtLastTime = DateTime.Now;
                            lsList[i].Count = 1;
                            HttpContext.Current.Application.Set("LRlist", lsList);
                            return true;
                        }
                        else
                        {
                            lsList[i].Count++;
                            HttpContext.Current.Application.Set("LRlist", lsList);
                            return true;
                        }
                    }
                }
                if (isAdd)
                {
                    LastRequest ls = new LastRequest();
                    ls.Key = key;
                    ls.Count++;
                    ls.DtLastTime = DateTime.Now;
                    lsList.Add(ls);
                    HttpContext.Current.Application.Set("LRlist", lsList);
                    return true;
                }



            }
            return true;
        }

        public bool GetQueryString(string key, string queryString, out string value)
        {
            try
            {
                value = "";
                string[] strs = queryString.Substring(1, queryString.Length - 1).Split('&');
                for (int i = 0; i < strs.Length; i++)
                {
                    if (strs[i].Contains(key))
                    {
                        value = strs[i].Replace(key + "=", "");
                        if (value.Trim() != "")
                            return true;
                        else
                            return false;
                    }
                }
                return false;
            }
            catch (Exception)
            {
                value = "";
                return false;
            }

        }

        /// <summary>
        /// 重写MessageHandler的SendAsync方法来解决通过post跨域访问的问题.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {

            try
            {
                #region 验证http请求
                bool isRightRequest = false;
                string strValue = "";
                string strUid = "";
                string strMsg = "请求过于频繁";
                string strToken = "";

                if (GetQueryString("uid", request.RequestUri.Query, out strUid) && GetQueryString("token", request.RequestUri.Query, out strValue)) //判断是否包含token
                {
                    string value = TokenManager.DecryptToken(strValue);  //验证token是否合法
                    strToken = value;
                    if (value.Trim() != "" & strUid.Trim() != "")
                    {
                        string[] strPar = value.ToString().Split(',');
                        if (Convert.ToDateTime(strPar[1]).ToString("yyy-MM-dd") == DateTime.Now.ToString("yyy-MM-dd")
                           && strPar[0].Trim() == strUid)
                        {
                            isRightRequest = check(value, HttpRequestTimes); //验证该token持有者是否超过请求限制
                        }
                        else
                        {
                            isRightRequest = false;
                            strMsg = "非法请求";
                        }

                    }
                    else { strMsg = "非法请求"; }
                    isRightRequest = true;
                }
                else if (request.RequestUri.AbsolutePath.Contains("validate") | request.RequestUri.AbsolutePath.ToLower().Contains("baiduconvert") | request.RequestUri.AbsolutePath.ToLower().Contains("vehicle") | request.RequestUri.AbsolutePath.ToLower().Contains("appbase") | request.RequestUri.AbsolutePath.ToLower().Contains("applogin") | request.RequestUri.AbsolutePath.ToLower().Contains("appset") | request.RequestUri.AbsolutePath.ToLower().Contains("appcmd"))//判断是否包含是登录请求
                {
                    isRightRequest = true;
                }

                //else if (GetQueryString("token", request.RequestUri.Query, out strValue))      //  防止'token='
                //{
                //    isRightRequest = true;
                //    mail.mai_CodeLink = "http://" + request.RequestUri.Authority + "/Validate.html";
                //}

                else
                {
                    strMsg = "非法请求";
                }

                isRightRequest = true;//测试加的

                if (!isRightRequest)
                {
                    Uri uri = new Uri("http://" + request.RequestUri.Authority + request.RequestUri.AbsolutePath + "?Detail=" + strMsg + ",token=" + strToken);
                    request.RequestUri = uri;
                    return base.SendAsync(request, cancellationToken).ContinueWith<HttpResponseMessage>(t =>
                    {
                        HttpResponseMessage resp = t.Result;
                        if (!request.Headers.Contains(Origin))
                            request.Headers.Add(Origin, request.RequestUri.Authority);
                        resp.Headers.Add(AccessControlAllowOrigin, request.Headers.GetValues(Origin).First());
                        return resp;
                    });
                }
                #endregion

                bool isCorsRequest = request.Headers.Contains(Origin);
                bool isPreflightRequest = request.Method == HttpMethod.Options;

                if (isCorsRequest)
                {

                    if (isPreflightRequest)
                    {

                        return Task.Factory.StartNew<HttpResponseMessage>(() =>
                        {

                            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                            response.Headers.Add(AccessControlAllowOrigin, request.Headers.GetValues(Origin).First());
                            string accessControlRequestMethod = request.Headers.GetValues(AccessControlRequestMethod).FirstOrDefault();
                            if (accessControlRequestMethod != null)
                            {
                                response.Headers.Add(AccessControlAllowMethods, accessControlRequestMethod);
                            }

                            string requestedHeaders = string.Join(", ", request.Headers.GetValues(AccessControlRequestHeaders));
                            if (!string.IsNullOrEmpty(requestedHeaders))
                            {
                                response.Headers.Add(AccessControlAllowHeaders, requestedHeaders);
                            }
                            return response;
                        }, cancellationToken);
                    }
                    else
                    {
                        return base.SendAsync(request, cancellationToken).ContinueWith<HttpResponseMessage>(t =>
                        {
                            HttpResponseMessage resp = t.Result;
                            resp.Headers.Add(AccessControlAllowOrigin, request.Headers.GetValues(Origin).First());
                            return resp;
                        });
                    }
                }
                else
                {
                    return base.SendAsync(request, cancellationToken);
                }
            }
            catch (Exception ex)
            {

                Uri uri = new Uri("http://" + request.RequestUri.Authority + request.RequestUri.AbsolutePath + "?Detail=" + ex.Message);
                request.RequestUri = uri;
                return base.SendAsync(request, cancellationToken).ContinueWith<HttpResponseMessage>(t =>
                {
                    HttpResponseMessage resp = t.Result;
                    if (!request.Headers.Contains(Origin))
                        request.Headers.Add(Origin, request.RequestUri.Authority);
                    resp.Headers.Add(AccessControlAllowOrigin, request.Headers.GetValues(Origin).First());
                    return resp;
                });
            }
        }
    }
}