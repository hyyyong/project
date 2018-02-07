using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;

namespace Senparc.Weixin.MP.Sample.Controllers
{
    public class MainController : Controller
    {
     //登录获取微信id
        //[HttpPost]
        //[ActionName("Login")]
        public ActionResult Main()
        {
            return View();
        }
    }
}