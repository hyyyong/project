using GpsWebApI;
using Manager;
using Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Serialization;

namespace Senparc.Weixin.MP.Sample.Controllers
{
    public class AppLoginController : ApiController
    {

        [HttpGet]
        [System.Web.Http.ActionName("getRegistered")]
        public object SimCode(string phone, string type)
        {
            //获取验证码
            string info = "";

            if (M_AppLogin.MSimCode(phone, type, out  info))
            {
                return new Ret { code = 0, msg = "下发成功", obj = DBNull.Value };

            }
            else
            {
                return new Ret { code = 1, msg = "下发失败", obj = DBNull.Value };
            }
        }

        [HttpGet]
        [System.Web.Http.ActionName("registered")]
        public object Register(string phone, string pass, string verification)
        {
            //注册
            string info = "";
            if (M_AppLogin.MRegister(phone, pass, verification, out info))
            {
                return new Ret { code = 0, msg = "注册成功", obj = DBNull.Value };
            }
            else
            {
                return new Ret { code = 1, msg = "注册失败", obj = DBNull.Value };
            }
        }

        [HttpGet]
        [System.Web.Http.ActionName("forgotPass")]
        public object ForgetPassWord(string phone, string newPass, string verification)
        {
            //忘记密码
            string info = "";
            if (M_AppLogin.MForgetPassWord(phone, newPass, verification, out info))
            {
                return new Ret { code = 0, msg = "修改成功", obj = DBNull.Value };
            }
            else
            {
                return new Ret { code = 1, msg = "修改失败", obj = DBNull.Value };
            }
        }


        [HttpGet]
        [System.Web.Http.ActionName("login")]
        public object AppLogin(string user, string pass, string loginType)
        {
            //登录
            int userID = -1;
            string info = "";
            if (M_AppLogin.MAppLogin(user, pass, loginType, out userID, out info))
            {

                return new Ret { code = 0, msg = info, obj = new { userId = userID } };
            }
            else
            {
                return new Ret { code = 1, msg = info, obj = DBNull.Value };
            }
        }

        [HttpGet]
        [System.Web.Http.ActionName("getBinding")]
        public object ThreeParties(string threePartiesID, string type)
        {
            //第三方登录
            int userID = -1;
            string info = "";
            if (M_AppLogin.MThreeParties(threePartiesID, type, out userID, out info))
            {
                 return new Ret { code = 0, msg = "绑定成功", obj =new { userId=userID }};
            }
            else
            {
                if (userID == -2)
                {
                    return new Ret { code = 2, msg = info, obj = new { threePartiesID = threePartiesID, type = type } };
                }
                return new Ret { code = 1, msg = "登录失败", obj = DBNull.Value };
            }
        }


        [HttpGet]
        [System.Web.Http.ActionName("bindingPhone")]
        public object ThreePartiesPhone(string phone, string threePartiesID, string type)
        {
            //第三方登录绑定手机号
            string info = "";
            if (M_AppLogin.MThreePartiesPhone(phone, threePartiesID, type, out  info))
            {
                 return new Ret { code = 0, msg = info, obj = DBNull.Value };
            }
            else
            {
                 return new Ret { code = 1, msg = info, obj = DBNull.Value };
            }
        }


    }
}