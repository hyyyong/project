using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using Model;
using System.Configuration;

namespace GpsWebApI
{
    public class TokenManager
    {
        //static string KEY = Convert.ToInt64((DateTime.Now.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, 0)).TotalSeconds).ToString();  
        static string KEY = ConfigurationManager.AppSettings["tokenKey"].ToString();


        //public static bool CheckToken(string uid, string lastTime, string token, ref Error error)
        //{
        //    try
        //    {
        //        if (uid + "," + lastTime != token)
        //        {
        //            double tMinutes = (DateTime.Parse(DecryptToken(lastTime)) - DateTime.Now).TotalMinutes;
        //            if (tMinutes > -15 & tMinutes < 15)
        //            {
        //                error = null;
        //                return true;
        //            }
        //            else
        //            {
        //                error = new Error()
        //                {
        //                    ErrorCode = 0001,
        //                    Detail = "令牌已过期!",
        //                    Exception = ""

        //                };
        //                return false;
        //            }
        //        }
        //        else
        //        {
        //            error = new Error()
        //            {
        //                ErrorCode = 0002,
        //                Detail = "token验证失败!",
        //                Exception = ""
        //            };
        //            return false;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        error = new Error()
        //        {
        //            ErrorCode = 0003,
        //            Detail = "无效请求!",
        //            Exception = ex.Message
        //        };
        //        return false;
        //    }
        //}

        public static string EncryptToken(string str)
        {
            try
            {

                CspParameters param = new CspParameters();
                param.Flags = CspProviderFlags.UseMachineKeyStore;
                param.KeyContainerName = KEY;
                string result = "";
                using (RSACryptoServiceProvider rsa = new RSACryptoServiceProvider(1024,param))
                {

                    byte[] plaindata = Encoding.Default.GetBytes(str);//将要加密的字符串转换为字节数组

                    byte[] encryptdata = rsa.Encrypt(plaindata, false);//将加密后的字节数据转换为新的加密字节数组

                    result = Convert.ToBase64String(encryptdata);//将加密后的字节数组转换为字符串

                }
                return result;
            }
            catch (Exception ex)
            {
                return "";
               // return ex.ToString();
            }
        }

        public static string DecryptToken(string str)
        {
            try
            {

                CspParameters param = new CspParameters();
                param.KeyContainerName = KEY;
                param.Flags = CspProviderFlags.UseMachineKeyStore;
                string result = "";
                using (RSACryptoServiceProvider rsa = new RSACryptoServiceProvider(1024,param))
                {

                    byte[] encryptdata = Convert.FromBase64String(str);

                    byte[] decryptdata = rsa.Decrypt(encryptdata, false);

                    result = Encoding.Default.GetString(decryptdata);

                }
                return result;

            }
            catch (Exception)
            {

                return "";
            }
        }
    }
}