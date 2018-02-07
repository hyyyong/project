using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class LoginUserInfo : RestResponse
    {

        public string userId { get; set; }
        public string userName { get; set; }
        public string passWord { get; set; }
        public int accountType { get; set; }
        public string phone { get; set; }
        public string ownerName { get; set; }
        public string funcID { get; set; }
        public int parentId { get; set; }

    }

    public class RestResponse
    {
        public RestResponse()
        {
            lRTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        }
        //最后请求时间
        public string lRTime { get; set; }
        public string token { get; set; }

    }


    public class AppUser : RestResponse
    {
        public string username { get; set; }
        public string userId { get; set; }
        public string phone { get; set; }

    
    }


    public class UserInfo
    {

        public int userId { get;set;}
        public string userName { get;set;}
        public string passWord { get;set;}       
        public int accountType { get;set;}

        public int signLimit { get; set; }
        public int delFlags { get; set; }
        public int roleid { get; set; }
        public int serviceType { get; set; }
        public int payType { get; set; }

        public string ownerName { get;set;}
        public string phone { get;set;}
        public string memo { get;set;} //公司名称
        public string code{get;set;}//客户代码
        public string icon { get; set; }

        public string timelimit { get;set;}//时间限制  暂时未用
        public string createTime { get;set;}
        public string birthday { get;set;} //
        public string updateTime { get; set; }
        public string email { get; set; }

        public int    parentId { get; set; }
        public string parentMemo{get;set;}
        public string parentName{get;set;}
        public string parentCode{get;set;}
       
    }
}
