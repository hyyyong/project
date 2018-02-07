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
    public class M_Login
    {
        public static bool UserLogin(string userName, string passWord, out LoginUserInfo loginUserInfo, out string info)
        {
            loginUserInfo = null;
            info = "";
            DBHelp dbhelp = new DBHelp();
            DataTable table;
            string sqlCmd = @"select u.UserName,u.userid,u.password,u.userTypeID,u.phone,u.OwnerName,u.parentId,UserPermission.funcid
  from userMain u left join UserPermission  on u.userid=UserPermission.userid  where UserName=@username and (Delflags!=1 or Delflags is null)";
            DataSet ds;
            string errinfo = "";
            if (!dbhelp.QueryDataSet1(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("userName", userName) }, false, out ds, out errinfo))
            {
                info = "数据库连接失败";
                return false;
            }
            table = ds.Tables[0];

            if (table.Rows.Count == 0)
            {
                info = "用户名不存在";
                return false;
            }
            else
            {
                if (table.Rows[0]["password"].ToString() == passWord)
                {
                    loginUserInfo = new LoginUserInfo();
                 
                    loginUserInfo.userId= table.Rows[0]["userid"].ToString();
                    loginUserInfo.userName = table.Rows[0]["username"].ToString();
                    loginUserInfo.passWord = table.Rows[0]["password"].ToString();
                    loginUserInfo.accountType =  Convert.ToInt32(table.Rows[0]["userTypeID"].ToString());
                    loginUserInfo.phone = table.Rows[0]["phone"].ToString();
                    loginUserInfo.ownerName = table.Rows[0]["ownerName"].ToString();
                    loginUserInfo.parentId = table.Rows[0]["parentId"] == DBNull.Value ? 1 : Convert.ToInt32(table.Rows[0]["parentId"]);                  
                    loginUserInfo.funcID = table.Rows[0]["funcID"].ToString();
                   
                }
                else
                {
                    info = "密码错误";
                    return false;
                }
            }

            return true;

        }



        //获取用户下 和子用户下的所有的车组
        public static bool GetVehGroupList(string uid, out List<VehGroup> vehGroupList)
        {
            vehGroupList = null;
            string strGroupList = "";
            DBHelp dbhelp = new DBHelp();
            DataTable table;
            // string sqlCmd = "RetAllVehGroupByUserID";
            string sqlCmd = "";  //获取账号及子账户的车组
            if (uid != "0" & uid != "1")
            {
                //if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("UserID", uid) }, true, out table))
                //    return false;
                //else
                //{
                //    if (table.Rows.Count == 0)
                //        return true;

                //    for (int i = 0; i < table.Rows.Count; i++)
                //    {
                //        if (i == 0)
                //            strGroupList = "'" + table.Rows[i][0].ToString() + "'";
                //        else
                //            strGroupList += ",'" + table.Rows[i][0].ToString() + "'";
                //    }

                //}

                strGroupList = dbhelp.GetVehGroupIDByUserID(uid);

                sqlCmd = "SELECT VehGroupMain.VehGroupID, VehGroupMain.VehGroupName, " +
                          "VehGroupDetail.fVehGroupID,delflag,c.count " +
                          "FROM VehGroupMain left JOIN VehGroupDetail ON " +
                          "VehGroupMain.VehGroupID = VehGroupDetail.VehGroupID " +
                            "  left join  (select VehGroupID,COUNT(1)count from VehicleDetail " +
                " inner join Vehicle on VehicleDetail.VehID=Vehicle.Id " +
                "  where Vehicle.DelFlag is null or Vehicle.DelFlag=0  " +
                " group by VehGroupID)c on VehGroupMain.VehGroupID =c.VehGroupID  " +
                          "WHERE (VehGroupMain.VehGroupID IN (" + strGroupList + ") and (delflag!=1 or delflag is null))   order by VehGroupName";
            }
            else
            {
                sqlCmd = "SELECT VehGroupMain.VehGroupID, VehGroupMain.VehGroupName, " +
                          "VehGroupDetail.fVehGroupID,delflag,c.count  " +
                              "FROM VehGroupMain left JOIN VehGroupDetail ON " +
                              "VehGroupMain.VehGroupID = VehGroupDetail.VehGroupID  " +
               "  left join  (select VehGroupID,COUNT(1)count from VehicleDetail " +
                " inner join Vehicle on VehicleDetail.VehID=Vehicle.Id " +
                "  where Vehicle.DelFlag is null or Vehicle.DelFlag=0  " +
                " group by VehGroupID)c on VehGroupMain.VehGroupID =c.VehGroupID  " +
               " where (delflag!=1 or delflag is null)  order by VehGroupName ";
            }
            if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { }, false, out table))
                return false;

            if (table.Rows.Count == 0)
                return true;

            vehGroupList = new List<VehGroup>();
            for (int i = 0; i < table.Rows.Count; i++)
            {
                VehGroup group = new VehGroup();
                group.VehGroupID = Convert.ToInt32(table.Rows[i]["VehGroupID"]);
                group.VehGroupName = table.Rows[i]["VehGroupName"].ToString();
                group.FVehGroupID = table.Rows[i]["fVehGroupID"] == DBNull.Value ? -1 : Convert.ToInt32(table.Rows[i]["fVehGroupID"]);
                group.DelFlag = table.Rows[i]["delflag"] != DBNull.Value ? Convert.ToInt32(table.Rows[i]["delflag"]) : 0;
                group.Count = table.Rows[i]["count"] != DBNull.Value ? Convert.ToInt32(table.Rows[i]["count"]) : 0;
                group.icon = "";
                vehGroupList.Add(group);
            }

            //UserShaft ts = usershaftList.Where(sss => sss.Uid == uid).FirstOrDefault();
            //if (ts != null)
            //{
            //    ts.Groupdt = table;
            //}
            return true;
        }


        //获取用户下绑定的车组
        public static bool GetVehGroupListSingle(string uid, out List<VehGroup> vehGroupList)
        {
            vehGroupList = null;
            string strGroupList = "";
            DBHelp dbhelp = new DBHelp();
            DataTable table;
            // string sqlCmd = "RetAllVehGroupByUserID";
            string sqlCmd = "";  //获取账号及子账户的车组
            if (uid != "0" & uid != "1")
            {
                //if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("UserID", uid) }, true, out table))
                //    return false;
                //else
                //{
                //    if (table.Rows.Count == 0)
                //        return true;

                //    for (int i = 0; i < table.Rows.Count; i++)
                //    {
                //        if (i == 0)
                //            strGroupList = "'" + table.Rows[i][0].ToString() + "'";
                //        else
                //            strGroupList += ",'" + table.Rows[i][0].ToString() + "'";
                //    }

                //}

                strGroupList = dbhelp.GetVehGroupIDByUserID(uid);

                sqlCmd = "SELECT VehGroupMain.VehGroupID, VehGroupMain.VehGroupName, " +
                          "VehGroupDetail.fVehGroupID,delflag,c.count " +
                          "FROM VehGroupMain left JOIN VehGroupDetail ON " +
                          "VehGroupMain.VehGroupID = VehGroupDetail.VehGroupID " +
                            "  left join  (select VehGroupID,COUNT(1)count from VehicleDetail " +
                " inner join Vehicle on VehicleDetail.VehID=Vehicle.Id " +
                "  where Vehicle.DelFlag is null or Vehicle.DelFlag=0  " +
                " group by VehGroupID)c on VehGroupMain.VehGroupID =c.VehGroupID  " +
                          "WHERE (VehGroupMain.VehGroupID IN (" + strGroupList + ") and (delflag!=1 or delflag is null))   order by VehGroupName";
            }
            else
            {
                sqlCmd = "SELECT VehGroupMain.VehGroupID, VehGroupMain.VehGroupName, " +
                          "VehGroupDetail.fVehGroupID,delflag,c.count  " +
                              "FROM VehGroupMain left JOIN VehGroupDetail ON " +
                              "VehGroupMain.VehGroupID = VehGroupDetail.VehGroupID  " +
               "  left join  (select VehGroupID,COUNT(1)count from VehicleDetail " +
                " inner join Vehicle on VehicleDetail.VehID=Vehicle.Id " +
                "  where Vehicle.DelFlag is null or Vehicle.DelFlag=0  " +
                " group by VehGroupID)c on VehGroupMain.VehGroupID =c.VehGroupID  " +
               " where (delflag!=1 or delflag is null)  order by VehGroupName ";
            }
            if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { }, false, out table))
                return false;

            if (table.Rows.Count == 0)
                return true;

            vehGroupList = new List<VehGroup>();
            for (int i = 0; i < table.Rows.Count; i++)
            {
                VehGroup group = new VehGroup();
                group.VehGroupID = Convert.ToInt32(table.Rows[i]["VehGroupID"]);
                group.VehGroupName = table.Rows[i]["VehGroupName"].ToString();
                group.FVehGroupID = table.Rows[i]["fVehGroupID"] == DBNull.Value ? -1 : Convert.ToInt32(table.Rows[i]["fVehGroupID"]);
                group.DelFlag = table.Rows[i]["delflag"] != DBNull.Value ? Convert.ToInt32(table.Rows[i]["delflag"]) : 0;
                group.Count = table.Rows[i]["count"] != DBNull.Value ? Convert.ToInt32(table.Rows[i]["count"]) : 0;
                group.icon = "";
                vehGroupList.Add(group);
            }

            //UserShaft ts = usershaftList.Where(sss => sss.Uid == uid).FirstOrDefault();
            //if (ts != null)
            //{
            //    ts.Groupdt = table;
            //}
            return true;
        }

        

    }
}
