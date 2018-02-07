/*----------------------------------------------------------------
    Copyright (C) 2017 Senparc
    
    文件名：HomeController.cs
    文件功能描述：首页Controller
    
    
    创建标识：Senparc - 20150312
----------------------------------------------------------------*/

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
//using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;
using Newtonsoft.Json.Linq;
using Senparc.Weixin.Cache;
using Senparc.Weixin.MP.CommonAPIs;
using Senparc.Weixin.MP.Sample.CommonService.Download;
using Senparc.Weixin.Open.CommonAPIs;
using GpsWebApI;
using Manager;
using Model;
using System.Drawing;

namespace Senparc.Weixin.MP.Sample.Controllers
{
    public class LoginController : BaseController
    {


        public JsonResult Login(string username, string password)
        {
            LoginUserInfo loginUserInfo = null;
            string info = "";
            if (M_Login.UserLogin(username, password, out loginUserInfo, out info))
            {
                loginUserInfo.token = TokenManager.EncryptToken(loginUserInfo.userId + "," + loginUserInfo.lRTime);
                return Json(new { flag = 1, msg = "查询成功", obj = loginUserInfo }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { flag = 0, msg = info, obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
        }



        // 负责生成验证码图片,并且将验证码字符串存入session["vcode"]



        public ActionResult Vcode()
        {
            //1.0 创建一个验证码字符串
            string vcode = GetVcode(4);

            //2.0 将vcode值存入session中
            Session["vcode"] = vcode;

            //3.0 画图
            byte[] imgbuffer;
            using (Image img = new Bitmap(60, 25))
            {
                //4.0 定义画家
                using (Graphics g = Graphics.FromImage(img))
                {
                    //5.0 使用白色背景填充位图
                    g.Clear(Color.White);
                    //6.0 将验证码字符串画到图片上
                    g.DrawString(vcode, new Font("黑体", 16, FontStyle.Bold | FontStyle.Strikeout)
                        , new SolidBrush(Color.Red), 0, 0);
                }

                //7.0 将图片流转换成byte[]
                using (System.IO.MemoryStream ms = new System.IO.MemoryStream())
                {
                    //将图片流存入到ms 内存流对象中
                    img.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);

                    //将内存流对象ms中的数据转换成byte[] 
                    imgbuffer = ms.ToArray();
                }
            }
            //将图片响应回浏览器,并且解析格式为图片格式
            return File(imgbuffer, "image/jpeg");
        }

        Random r = new Random();
        private string GetVcode(int num)
        {
            string vcodeStr = "23456789abcdefghjknmpqrstuvwxyzABCDEFGHJKNMPQRSTUVWXYZ";
            string res = "";
            int maxleng = vcodeStr.Length;
            for (int i = 0; i < num; i++)
            {
                res += vcodeStr[r.Next(maxleng)];
            }

            return res;
        }
    }


}
