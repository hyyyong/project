using Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manager
{
    public class M_UserInfo
    {

        //获取单个用户资料
        public static bool GetUser(int userID, out UserInfo model)
        {

            model = new UserInfo();
            DBHelp dbhelp = new DBHelp();
            DataTable table;

            string sqlCmd = @"select a.*,b.sMemo as parentMemo,b.UserName as parentName,b.code as parentCode from [UserMain] a 
  left join [UserMain] b on  a.parentId=b.UserID where a.UserID=@UserID";

            if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("UserID", userID) }, false, out table))
                return false;
            if (table.Rows.Count == 0)
                return true;

            model.userId = Convert.ToInt32(table.Rows[0]["UserID"]);
            model.userName = table.Rows[0]["UserName"].ToString();
            model.passWord = table.Rows[0]["Password"].ToString();
            model.accountType = Convert.ToInt32(table.Rows[0]["UserTypeID"]);

            model.signLimit = Convert.ToInt32(table.Rows[0]["SignLimit"]);
            model.delFlags = Convert.ToInt32(table.Rows[0]["DelFlags"]);
            model.roleid = table.Rows[0]["roleid"] != DBNull.Value ? Convert.ToInt32(table.Rows[0]["roleid"]) : 0;
            model.serviceType = Convert.ToInt32(table.Rows[0]["serviceType"]);
            model.payType = Convert.ToInt32(table.Rows[0]["payType"]);

            model.ownerName = table.Rows[0]["OwnerName"].ToString();
            model.phone = table.Rows[0]["Phone"].ToString();
            model.memo = table.Rows[0]["sMemo"].ToString();
            model.code = table.Rows[0]["code"].ToString();
            model.icon = "";

            model.timelimit = table.Rows[0]["timelimit"].ToString();
            model.createTime = table.Rows[0]["CreateTime"].ToString();
            model.birthday = table.Rows[0]["birthday"].ToString();
            model.updateTime = table.Rows[0]["UpdateTime"].ToString();
            model.email = "";/// table.Rows[i]["email"].ToString();


            model.parentId = Convert.ToInt32(table.Rows[0]["parentId"]);
            model.parentMemo = table.Rows[0]["parentMemo"] != DBNull.Value ? table.Rows[0]["parentMemo"].ToString() : "";
            model.parentName = table.Rows[0]["parentName"] != DBNull.Value ? table.Rows[0]["parentName"].ToString() : "";
            model.parentCode = table.Rows[0]["parentCode"] != DBNull.Value ? table.Rows[0]["parentCode"].ToString() : "";

            if (model.accountType == 0 || model.accountType == 1)
            {
                model.parentMemo = model.memo;
                model.parentName = model.userName;
                model.parentCode = model.code;
            }

            return true;
        }

        //获取用户下所有用户信息
        public static bool GetUserList(int userID, out List<UserInfo> userList)
        {

            userList = null;
            DBHelp dbhelp = new DBHelp();
            DataTable table;

            string sqlCmd = "";
                sqlCmd = @"declare @table table(UserID int,parentID int)  insert into @table exec [RetAllUserByUserID] " + userID + @" select a.*,b.sMemo as parentMemo,b.UserName as parentName,b.code as parentCode from [UserMain] a  left join [UserMain] b on  a.parentId=b.UserID where a.UserID  in (select UserID from @table)";

            if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("UserID", userID) }, false, out table))
                return false;
            if (table.Rows.Count == 0)
                return true;
            userList = new List<UserInfo>();
            for (int i = 0; i < table.Rows.Count; i++)
            {
                UserInfo model = new UserInfo();
                model.userId = Convert.ToInt32(table.Rows[i]["UserID"]);
                model.userName = table.Rows[i]["UserName"].ToString();
                model.passWord = table.Rows[i]["Password"].ToString();
                model.accountType = Convert.ToInt32(table.Rows[i]["UserTypeID"]);

                model.signLimit = Convert.ToInt32(table.Rows[i]["SignLimit"]);
                model.delFlags = Convert.ToInt32(table.Rows[i]["DelFlags"]);
                model.roleid = table.Rows[i]["roleid"] != DBNull.Value ? Convert.ToInt32(table.Rows[i]["roleid"]) : 0;
                model.serviceType = Convert.ToInt32(table.Rows[i]["serviceType"]);
                model.payType = Convert.ToInt32(table.Rows[i]["payType"]);

                model.ownerName = table.Rows[i]["OwnerName"].ToString();
                model.phone = table.Rows[i]["Phone"].ToString();
                model.memo = table.Rows[i]["sMemo"].ToString();
                model.code = table.Rows[i]["code"].ToString();
                model.icon = "";

                model.timelimit = table.Rows[i]["timelimit"].ToString();
                model.createTime = table.Rows[i]["CreateTime"].ToString();
                model.birthday = table.Rows[i]["birthday"].ToString();
                model.updateTime = table.Rows[i]["UpdateTime"].ToString();
                model.email = "";/// table.Rows[i]["email"].ToString();


                model.parentId = Convert.ToInt32(table.Rows[i]["parentId"]);
                model.parentMemo = table.Rows[i]["parentMemo"] != DBNull.Value ? table.Rows[i]["parentMemo"].ToString() : "";
                model.parentName = table.Rows[i]["parentName"] != DBNull.Value ? table.Rows[i]["parentName"].ToString() : "";
                model.parentCode = table.Rows[i]["parentCode"] != DBNull.Value ? table.Rows[i]["parentCode"].ToString() : "";
                userList.Add(model);
            }

            return true;
        }

        //添加用户
        public static int AddUser(string userId,string userName, string passWord, string code, string meno, string ownerName, string phone, int accountType, int fGroupID, string vehGroupID, string funcID ,out int UserID)
        {
            DBHelp dbhelp = new DBHelp();
            DataTable datatb;
            UserID = 0;
            string sqlCmd = "";

            sqlCmd = "select username from usermain where username='" + userName + "'";
            if (dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { }, false, out datatb))
                if (datatb.Rows.Count > 0)
                    return -1;


            sqlCmd = "INSERT INTO VehGroupMain (VehGroupName, Contact, phone, Mark,CreateTime,UpdateTime) " +
                        " VALUES('" + userName + "' ,'" + (ownerName == null ? "" : ownerName) + "' , '" + (phone == null ? "" : phone) + "','', getdate(),getdate()) select @@IDENTITY";

            if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { }, false, out datatb))
            {
             
                return 0;
            }

            vehGroupID = datatb.Rows[0][0].ToString();


            DataTable dt;
            sqlCmd = "Add_User";
            if (dbhelp.ReadData(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("@UserName", userName), 
                new SqlParameter("Password", passWord), new SqlParameter("UserTypeID", accountType), new SqlParameter("OwnerName", ownerName == null ? "" : ownerName), 
                new SqlParameter("Phone", phone == null ? "" : phone), new SqlParameter("sMemo", meno == null ? "" : meno),new SqlParameter("code", code == null ? "" : code), new SqlParameter("timelimit", DateTime.Now),
                new SqlParameter("birthday", DateTime.Now), new SqlParameter("SignLimit", "0"), new SqlParameter("FunList", funcID == null ? "" : funcID), 
                new SqlParameter("VGrouPIDList", vehGroupID == null ? "" : vehGroupID), new SqlParameter("parentid", fGroupID), new SqlParameter("opUid", userId)
                }, true, out dt))
            {
                if (Convert.ToInt32(dt.Rows[0][0]) > 0)
                {
                    UserID = Convert.ToInt32(dt.Rows[0][0]);                 
                    return 1;
                }
                else
                    return 0;

            }
            else
                return 0;

        }


        //编辑用户
        public static int EditUser(int UserID, string UserName, string passWord, string code, string memo,string OwnerName, string phone, string accountType, out string info)
        {

            info = "";
            DBHelp dbhelp = new DBHelp();
            DataTable datatb;
            string sqlCmd = "if not exists(select UserID from UserMain where (UserName='" + UserName + "' or sMemo='" + memo + "' or code='" + code + "') and UserID!= " + UserID + ")" +
                            "begin UPDATE UserMain SET UserName='" + UserName + "',sMemo='" + memo + "',code='" + code + "',OwnerName='" + OwnerName + "' ,Phone='" + phone + "', Password='" + passWord + "',UserTypeID=" + accountType + ",UpdateTime=getdate() where     UserID=" + UserID + " select '1' end else begin declare @Return varchar(200) set @Return=''" +
   "if exists(select UserID from UserMain where UserName='" + UserName + "' and UserID!=" + UserID + ") set @Return=@Return+'用户名 '" +
   "if exists(select UserID from UserMain where sMemo='" + memo + "' and UserID!=" + UserID + ") set @Return=@Return+'公司名称 ' " +
   "if exists(select UserID from UserMain where sMemo='" + code + "' and UserID!=" + UserID + ") set @Return=@Return+'客户代码 'select @Return end";

            if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { }, false, out datatb))
            {
                info = "数据编辑错误";
                return 0;
            }

            string result = datatb.Rows[0][0].ToString();
            if (result == "1")
            {
                info = "修改成功";
                return 1;
            }
            else
            {
                info = result;
                return 0;
            }

        }



        //删除用户
        public static int DelUser(string UserID, string uid)
        {
            DBHelp dbhelp = new DBHelp();
            DataTable table;
            string sqlCmd = "SELECT * FROM usermain where UserID=" + UserID + " and UserName='system'";
            if (dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { }, false, out table))
            {
                if (table.Rows.Count > 0)
                    return 0;
            }
            sqlCmd = "Del_User";
            DataTable dt;
            if (dbhelp.ReadData(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("UserID", UserID), new SqlParameter("@uid", uid) }, true, out dt))
            {
                if (Convert.ToInt32(dt.Rows[0][0]) == 0)
                {
                    return 2;
                }
            }
            else
            {
                return 2;
            }
            return 1;
        }

        //修改密码

        public static bool MChangePWD(int userId, string oldpwd, string newpwd,out string info )
        {
            info = "";
            DBHelp dbhelp = new DBHelp();
            DataTable table;
            string sqlCmd = " update UserMain set paddword='" + newpwd + "' where userid=" + userId;
            
           int count=dbhelp.ExecuteNonQueryError(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { }, false,false,out info);
            if (count > 0)
                return true;
            else
                return false;            
           
        }
    }
}
