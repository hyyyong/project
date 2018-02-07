using Aliyun.Acs.Core;
using Aliyun.Acs.Core.Exceptions;
using Aliyun.Acs.Core.Profile;
using Aliyun.Acs.Dysmsapi.Model.V20170525;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Manager
{
   public class M_AppLogin
    {

        static String product = "Dysmsapi";//短信API产品名称
        static String domain = "dysmsapi.aliyuncs.com";//短信API产品域名
        static String accessId = "LTAI9YgikuO361kP";
        static String accessSecret = "TaZA6j7ki0bj80Cn9D5CSAqOdtWDFB";
        static String regionIdForPop = "cn-hangzhou";
        public static bool MSimCode(string phone, string type, out string info)
        {
            info = "542585";
            info = random();

            IClientProfile profile = DefaultProfile.GetProfile(regionIdForPop, accessId, accessSecret);
            DefaultProfile.AddEndpoint(regionIdForPop, regionIdForPop, product, domain);
            IAcsClient acsClient = new DefaultAcsClient(profile);
            SendSmsRequest request = new SendSmsRequest();
            try
            {
                //request.SignName = "上云预发测试";//"管理控制台中配置的短信签名（状态必须是验证通过）"
                //request.TemplateCode = "SMS_71130001";//管理控制台中配置的审核通过的短信模板的模板CODE（状态必须是验证通过）"
                //request.RecNum = "13567939485";//"接收号码，多个号码可以逗号分隔"
                //request.ParamString = "{\"name\":\"123\"}";//短信模板中的变量；数字需要转换为字符串；个人用户每个变量长度必须小于15个字符。"
                //SingleSendSmsResponse httpResponse = client.GetAcsResponse(request);
                request.PhoneNumbers = phone;//必填:待发送手机号。支持以逗号分隔的形式进行批量调用，批量上限为1000个手机号码
                request.SignName = "源谷科技";////必填:短信签名-可在短信控制台中找到
                request.TemplateCode = "SMS_121907082"; //必填:短信模板-可在短信控制台中找到
                request.TemplateParam = "{\"code\":\"" + info + "\"}"; //可选:模板中的变量替换JSON串,如模板内容为"亲爱的${name},您的验证码为${code}"时,此处的值为"{\"name\":\"Tom\"， \"code\":\"123\"}"
                request.OutId = "xxxxxxxx";
                //请求失败这里会抛ClientException异常
                SendSmsResponse sendSmsResponse = acsClient.GetAcsResponse(request);
                System.Console.WriteLine(sendSmsResponse.Message);
                var redis =Wdj.Redis.Helper.RedisHelper.StringService;
                TimeSpan ts = new TimeSpan(0, 5, 0);
                redis.StringSet("Phone" + phone, info, ts);
                return true;

            }
            catch (ServerException e)
            {
                System.Console.WriteLine("ServerException");
                return false;
            }
            catch (ClientException e)
            {
                return false;
                System.Console.WriteLine("ClientException");
            }

        }

        public static string random()
        {
            Random rm = new Random();
            string s = Convert.ToString(rm.Next(100000, 999999));
            return s;
        }

        public static bool MRegister(string phone, string pass, string code, out string info)
        {
            try
            {
                info = "";
                var redis = Wdj.Redis.Helper.RedisHelper.StringService;
                string cacheCode=  redis.StringGet("Phone" + phone);
                if (cacheCode==null||cacheCode!=code)
                {
                    info = "验证码已过期。请重新获取验证码";
                }
                redis.KeyDelete("Phone" + phone);
                DBHelp dbhelp = new DBHelp();
                DataTable table;
                DataTable dt;
                string sqlCmd = @"if not exists(select phone from AppRegister where phone='" + phone.Trim() + "') begin INSERT INTO AppRegister" +
                    "(phone,password) Values " +
                    "('" + phone.Trim() + "','" + pass + "') end  else begin update AppRegister set password='" + pass + "' where  phone='" + phone.Trim() + "' end";
                DataSet ds;
                string errinfo = "";
                if (!dbhelp.ExecuteNonQuery(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { }))
                {
                    info = "注册失败";
                    return false;
                }

                info = "注册成功";
                return true;

            }
            catch (Exception ex)
            {
                info = "处理错误";
                return false;
            }
        }
        public static bool MForgetPassWord(string phone, string newPass, string code, out string info)
        {
            try
            {
                info = "";
                var redis = Wdj.Redis.Helper.RedisHelper.StringService;
                string cacheCode = redis.StringGet("Phone" + phone);
                if (cacheCode == null || cacheCode != code)
                {
                    info = "验证码已过期。请重新获取验证码";
                }
                redis.KeyDelete("Phone" + phone);
                DBHelp dbhelp = new DBHelp();
                DataTable table;
                DataTable dt;
                string sqlCmd = @"if not exists(select phone from AppRegister where phone='" + phone + "') begin INSERT INTO AppRegister" +
                    "(phone,password) Values " +
                    "('" + phone + "','" + newPass + "') end  else begin update AppRegister set password='" + newPass + "' where  phone='" + phone + "' end";
                DataSet ds;
                string errinfo = "";
                if (!dbhelp.ExecuteNonQuery(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { }))
                {
                    info = "注册失败";
                    return false;
                }

                info = "注册成功";
                return true;
                return false;
            }
            catch (Exception ex)
            {
                info = "处理错误";
                return false;
            }
        }

        public static bool MAppLogin(string user, string pass, string loginType, out int userID, out string info)
        {
            userID = -1;
            try
            {
                info = "";
                DBHelp dbhelp = new DBHelp();
                string sqlCmd = "select * from AppRegister where phone=@user";
                DataTable table;
                if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("user", user.Trim()) }, false, out table))
                {
                    info = "查询数据库失败";
                    return false;
                }
                if (table.Rows.Count == 0)
                {
                    info = "用户名不存在";
                    return false;
                }
                if (table.Rows[0]["passWord"].ToString() == pass)
                {

                    userID = Convert.ToInt32(table.Rows[0]["id"].ToString());
                    return true;
                }
                else
                {
                    info = "密码错误";
                    return false;
                }


            }
            catch (Exception ex)
            {
                info = "服务器错误";
                return false;
            }
        }

        public static bool MThreeParties(string threePartiesID, string type, out int userID, out string info)
        {
            userID = -1;
            try
            {
                info = "";
                DBHelp dbhelp = new DBHelp();
                string sqlCmd = "";
                if (type == "1")
                {
                    sqlCmd = "select * from AppRegister where qqCode=@threePartiesID";
                }
                else
                {
                    sqlCmd = "select * from AppRegister where weixinCode=@threePartiesID";
                }


                DataTable table;
                if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("threePartiesID", threePartiesID.Trim()) }, false, out table))
                {
                    info = "查询失败";
                    return false;
                }
                if (table.Rows.Count == 0)
                {
                    info = "用户名没有绑定手机号";
                    userID = -2;
                    return false;
                }

                userID = Convert.ToInt32(table.Rows[0]["id"].ToString());
                return true;

            }
            catch (Exception ex)
            {
                info = "服务器错误";
                return false;
            }
        }

        public static bool MThreePartiesPhone(string phone, string threePartiesID, string type, out string info)
        {
            try
            {
                info = "";
                DBHelp dbhelp = new DBHelp();
                DataTable table;
                DataTable dt;
                string sqlCmd = "";
                if (type == "1")
                {
                    sqlCmd = @"if not exists(select phone from AppRegister where phone='" + phone + "') begin INSERT INTO AppRegister" +
                  "(phone,qqCode,password) Values " +
                  "('" + phone + "','" + threePartiesID + "','123456') end  else begin update AppRegister set qqCode='" + threePartiesID + "' where  phone='" + phone + "' end";
                }
                else
                {
                    sqlCmd = @"if not exists(select phone from AppRegister where phone='" + phone + "') begin INSERT INTO AppRegister" +
                  "(phone,weixinCode,password) Values " +
                  "('" + phone + "','" + threePartiesID + "','123456') end  else begin update AppRegister set weixinCode='" + threePartiesID + "' where  phone='" + phone + "' end";
                }
                DataSet ds;
                string errinfo = "";
                if (!dbhelp.ExecuteNonQuery(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { }))
                {
                    info = "绑定失败";
                    return false;
                }

                info = "绑定成功";
                return true;

            }
            catch (Exception ex)
            {
                info = "处理错误";
                return false;
            }
        }

        public static bool MScanCode(string codeString)
        {
            try
            {

                return false;
            }
            catch (Exception ex)
            {

                return false;
            }
        }
    }
}
