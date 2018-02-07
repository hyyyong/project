using Manager;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http.Formatting;
using System.Web.Http;

namespace Senparc.Weixin.MP.Sample
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            //清除其他所有的 Formatters
            config.Formatters.Clear();
            //只添加json格式的返回         
            config.Formatters.Add(new JsonMediaTypeFormatter());
            //config.Formatters.Add(new FormUrlEncodedMediaTypeFormatter());
            config.Routes.MapHttpRoute(
               name: "WeixinApi",
               routeTemplate: "api/{controller}/{action}/{id}",
               defaults: new { controller = "WeixinService", action = "Get", id = RouteParameter.Optional }
           );

            config.Routes.MapHttpRoute(
              name: "DefaultApi",
              routeTemplate: "gps/{controller}/{action}/{id}",
              defaults: new { id = RouteParameter.Optional }
          );

           
           

            //config.Routes.MapHttpRoute(
            //    name: "DefaultApi",
            //    routeTemplate: "api/{controller}/{id}",
            //    defaults: new { id = RouteParameter.Optional }
            //);


            SqlConfig.CONNECTION_STRING = String.Format(ConfigurationManager.ConnectionStrings["strConn"].ConnectionString , ConfigurationManager.AppSettings["DBName"].ToString());
            SqlConfig.CONNECTION_MAINDB = ConfigurationManager.AppSettings["DBName"].ToString();         
            
           
        }
    }
}
