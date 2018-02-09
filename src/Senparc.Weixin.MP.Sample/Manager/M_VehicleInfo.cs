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
    public class M_VehicleInfo
    {

        public static bool GetVehGroupDetail(string vehgroupID, out VehGroupDetail vehGroup)
        {
            vehGroup = null;
            DBHelp dbhelp = new DBHelp();
            DataTable table;

            string sqlCmd = "SELECT VehGroupMain.VehGroupID, VehGroupMain.VehGroupName, " +
                               " VehGroupMain.Contact, VehGroupMain.Phone, VehGroupMain.Mark,  " +
                               "  VehGroupDetail.fVehGroupID " +
                               " FROM VehGroupMain LEFT OUTER JOIN VehGroupDetail ON VehGroupMain.VehGroupID = VehGroupDetail.VehGroupID " +
                                "Where VehGroupMain.VehGroupID = @vehgroupID";
            if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("vehgroupID", vehgroupID) }, false, out table))
                return false;

            if (table.Rows.Count == 0)
                return true;

            vehGroup = new VehGroupDetail();
            vehGroup.VehGroupID = Convert.ToInt32(table.Rows[0]["VehGroupID"]);
            vehGroup.VehGroupName = table.Rows[0]["VehGroupName"].ToString();
            vehGroup.Contact = table.Rows[0]["Contact"].ToString();
            vehGroup.Phone = table.Rows[0]["phone"].ToString();
            vehGroup.Mark = table.Rows[0]["Mark"].ToString();
            vehGroup.fVehGroupID = table.Rows[0]["fVehGroupID"] == DBNull.Value ? -1 : Convert.ToInt32(table.Rows[0]["fVehGroupID"]);
            return true;
        }


        public static int AddVehGroup(string userId, string VehGroupName, string Contact, string phone, string mark, int fVehGroupID, out int vehGroupID, out string info)
        {
            info = "";
            DBHelp dbhelp = new DBHelp();
            DataTable datatb;
            vehGroupID = 0;
            string sql = "select vehgroupid from VehGroupMain where vehgroupname='" + VehGroupName + "'";
            if (dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sql, new SqlParameter[] { }, false, out datatb))
                if (datatb.Rows.Count > 0)
                {
                    info = "添加失败，该车组己存在！";
                    return 0;
                }
            using (SqlConnection sqlconn = new SqlConnection(SqlConfig.CONNECTION_STRING))
            {
                sqlconn.Open();
                SqlCommand myComm = new SqlCommand();
                SqlTransaction myTran;
                myTran = sqlconn.BeginTransaction();

                myComm.Connection = sqlconn;
                myComm.Transaction = myTran;
                try
                {
                    myComm.CommandText = "INSERT INTO VehGroupMain (VehGroupName, Contact, phone, Mark,CreateTime,UpdateTime) " +
                        " VALUES('" + VehGroupName + "' ,'" + (Contact == null ? "" : Contact) + "' , '" + (phone == null ? "" : phone) + "','" + (mark == null ? "" : mark) + "' , getdate(),getdate()) select @@IDENTITY";


                    using (SqlDataReader da = myComm.ExecuteReader())
                    {
                        while (da.Read())
                            vehGroupID = Convert.ToInt32(da[0].ToString());
                    }

                    string strSQL = "INSERT INTO VehGroupDetail(VehGroupID, fVehGroupID) " +
                                     " VALUES(" + vehGroupID + "," + fVehGroupID + " )";

                    if (fVehGroupID < 1)
                        strSQL = strSQL + " insert into User_VehGroup(UserID,VehGroupID) values(" + userId + "," + vehGroupID + ")";



                    myComm.CommandText = strSQL;
                    myComm.ExecuteNonQuery();
                    myTran.Commit();
                    sqlconn.Close();
                    info = "添加成功";
                    return 1;
                }
                catch (Exception ex)
                {
                    myTran.Rollback();
                    info = "登录失败";
                    return 2;
                }
            }

        }

        public static int EditVehGroup(string VehGroupID, string VehGroupName, string Contact, string phone, string Mark, int fVehGroupID, out string info)
        {
            info = "";
            DBHelp dbhelp = new DBHelp();
            DataTable datatb;
            string sql = "select vehgroupid from VehGroupMain where vehgroupid!=" + VehGroupID + " vehgroupname='" + VehGroupName + "'";
            if (dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sql, new SqlParameter[] { }, false, out datatb))
                if (datatb.Rows.Count > 0)
                {
                    info = "添加失败，该车组己存在！";
                    return 0;
                }

            using (SqlConnection sqlconn = new SqlConnection(SqlConfig.CONNECTION_STRING))
            {
                sqlconn.Open();
                SqlCommand myComm = new SqlCommand();
                SqlTransaction myTran;
                myTran = sqlconn.BeginTransaction();

                myComm.Connection = sqlconn;
                myComm.Transaction = myTran;
                try
                {
                    myComm.CommandText = "UPDATE VehGroupMain SET VehGroupName ='" + VehGroupName +
                        "', Contact ='" + (Contact == null ? "" : Contact) +
                        "', phone ='" + (phone == null ? "" : phone) +
                        "', Mark ='" + (Mark == null ? "" : Mark) +
                        "',UpdateTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where  VehGroupID =" + VehGroupID;

                    int vehGroupID = 0;
                    using (SqlDataReader da = myComm.ExecuteReader())
                    {
                        while (da.Read())
                            vehGroupID = Convert.ToInt32(da[0].ToString());
                    }

                    myComm.CommandText = "DELETE FROM VehGroupDetail WHERE (VehGroupID = " + VehGroupID + ")";
                    myComm.ExecuteNonQuery();
                    myComm.CommandText = "INSERT INTO VehGroupDetail(VehGroupID, fVehGroupID) " +
                                      " VALUES(" + VehGroupID + "," + fVehGroupID + " )";
                    myComm.ExecuteNonQuery();





                    myTran.Commit();
                    sqlconn.Close();
                    info = "编辑成功";
                    return 1;
                }
                catch (Exception ex)
                {
                    myTran.Rollback();
                    info = "登录失败";
                    return 2;
                }
            }

        }

        public static int DelVehGroup(string VehGroupID, string userId, out string info)
        {
            info = "";
            //string strGroupList = "";
            //RecursiveVehGroup(VehGroupID, ref strGroupList);

            //if (strGroupList.Length > 0)
            //    strGroupList = strGroupList + "," + VehGroupID.ToString();
            //else
            //    strGroupList = VehGroupID.ToString();



            //DataTable dt1;
            //DBHelp dbhelp = new DBHelp();
            //int OpUid = -1;
            //string OpUserName = "";
            //string sqlCmd = "select UserMain.UserID,UserName  from  usermain where UserID in(" + userId + ") ";
            //if (dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { }, false, out dt1))
            //{
            //    if (dt1.Rows.Count > 0)
            //    {
            //        OpUid = Convert.ToInt32(dt1.Rows[0]["UserID"]);
            //        OpUserName = dt1.Rows[0]["UserName"].ToString();
            //    }
            //}


            using (SqlConnection sqlconn = new SqlConnection(SqlConfig.CONNECTION_STRING))
            {
                sqlconn.Open();
                SqlCommand sqlcomm = new SqlCommand();
                SqlTransaction sqlts;
                sqlts = sqlconn.BeginTransaction();
                sqlcomm.Connection = sqlconn;
                sqlcomm.Transaction = sqlts;
                try
                {
                    //sqlcomm.CommandText = "UPDATE Vehicle SET DelFlag = 1,UpdateTime='" + DateTime.Now.ToString() + "' WHERE ID In(select VehID  from VehicleDetail where VehGroupID in(" + strGroupList + "))";
                    //sqlcomm.ExecuteNonQuery();

                    sqlcomm.CommandText = "UPDATE VehGroupMain SET DelFlag = 1,UpdateTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' Where Vehgroupid in(select VehGroupID from  dbo.GetChildVehGroup(" + VehGroupID + ")) UPDATE VehGroupMain SET DelFlag = 1,UpdateTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' Where Vehgroupid =" + VehGroupID;
                    int count = sqlcomm.ExecuteNonQuery();

                    //                    sqlcomm.CommandText = @" insert into Tab_Operate(TheID,OpType,OpTime,OpUser,UserName,TheName,GroupID,GroupName,Type) 
                    // select id,'删除','" + DateTime.Now.ToString() + @"'," + OpUid + ",'" + OpUserName + @"',cph,VehGroupMain.VehGroupID,VehGroupMain.VehGroupName,1
                    // from vehicle left join VehicleDetail on vehicle.id=VehicleDetail.VehID left join
                    // VehGroupMain on VehicleDetail.VehGroupID=VehGroupMain.VehGroupID
                    //  WHERE ID In(select VehID  from VehicleDetail where VehGroupID in(" + strGroupList + "))";
                    //                    sqlcomm.ExecuteNonQuery();

                    //sqlcomm.CommandText = "UPDATE VehGroupMain SET DelFlag = 1,UpdateTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' Where Vehgroupid =" + VehGroupID ;
                    //int count1 = sqlcomm.ExecuteNonQuery();


                    if (count < 1)
                    {
                        sqlts.Rollback();
                        info = "删除车组失败";
                        return 2;
                    }
                    else
                    {
                        sqlts.Commit();
                        sqlconn.Close();
                        info = "删除车组成功";
                        return 1;
                    }
                }
                catch (Exception ex)
                {
                    sqlts.Rollback();
                    return 2;
                }

            }

        }




        public static bool GetVehFromGroupID(int GroupID, out List<VehList> vehicleList)
        {

            vehicleList = null;
            vehicleList = new List<VehList>();
            var redis = Wdj.Redis.Helper.RedisHelper.HashService;
            if (redis.KeyExists("SQL_Group_" + GroupID))
            {
                Dictionary<string, VehList> m_value = redis.HashGetAll<VehList>("SQL_Group_" + GroupID);
                foreach (var item in m_value)
                {
                    vehicleList.Add(item.Value);
                }
                return true;
            }
            else
            {
                DBHelp dbhelp = new DBHelp();
                DataTable table;
                string sqlCmd = @"select Vehicle.id,Vehicle.plate,Vehicle.simNo,Vehicle.deviceId,Vehicle.deviceType,webpass,Vehicle.ownerName,Vehicle.ownerPhone,Vehicle.serverEndTime,VehGroupMain.vehGroupId,VehGroupMain.vehGroupName,Vehicle.ipAddress from Vehicle INNER JOIN VehicleDetail ON Vehicle.Id = VehicleDetail.VehID  INNER join VehGroupMain on VehGroupMain.VehGroupID=VehicleDetail.VehGroupID  where VehicleDetail.VehGroupID=" + GroupID + "  and (Vehicle.delflag=0 or Vehicle.DelFlag=null)";
                if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { }, false, out table))
                    return false;


                if (table.Rows.Count == 0)
                    return true;

                for (int i = 0; i < table.Rows.Count; i++)
                {
                    VehList veh = new VehList();
                    veh.vehicleId = Convert.ToInt32(table.Rows[i]["Id"]);
                    veh.plate = table.Rows[i]["plate"].ToString();
                    veh.simNo = table.Rows[i]["simNo"].ToString();
                    veh.deviceId = table.Rows[i]["deviceId"].ToString();
                    veh.deviceType = table.Rows[i]["deviceType"].ToString();
                    veh.webpass = table.Rows[i]["webpass"].ToString();
                    veh.ownerName = table.Rows[i]["ownerName"].ToString();

                    veh.ownerPhone = table.Rows[i]["ownerPhone"].ToString();
                    veh.serverEndTime = table.Rows[i]["serverEndTime"].ToString();
                    veh.vehGroupId = Convert.ToInt32(table.Rows[i]["vehGroupId"]);
                    veh.vehGroupName = table.Rows[i]["vehGroupName"].ToString();
                    veh.ipAddress = table.Rows[i]["ipAddress"].ToString();

                    redis.HashSet("SQL_Group_" + GroupID, "SQL_Vehid_" + veh.vehicleId, veh);
                    vehicleList.Add(veh);
                }
                return true;

            }
        }

        public static bool GetVehDetail(int id, int groupID, out VehDetail veh)
        {
            veh = null;
            veh = new VehDetail();
            var redis = Wdj.Redis.Helper.RedisHelper.HashService;
            if (redis.HashExists("SQL_Group_" + groupID, "SQL_Vehid_" + id))
            {
                veh = redis.HashGet<VehDetail>("SQL_Group_" + groupID, "SQL_Vehid_" + id);
                return true;
            }
            else
            {
                DBHelp dbhelp = new DBHelp();
                DataTable table;
                string sqlCmd = @"SELECT Vehicle.*, VehicleDetail.VehGroupID,VehGroupMain.VehGroupName, FROM Vehicle left JOIN VehicleDetail ON Vehicle.Id = VehicleDetail.VehID left join VehGroupMain   on VehGroupMain.VehGroupID=VehicleDetail.VehGroupID WHERE(VehicleDetail.VehID = @vehid)  and ((Vehicle.delflag!=1) or(Vehicle.delflag is null))  ";

                if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("vehid", id) }, false, out table))
                    return false;

                if (table.Rows.Count == 0)
                    return true;

                veh.vehicleId = Convert.ToInt32(table.Rows[0]["Id"]);
                veh.plate = table.Rows[0]["plate"].ToString();
                veh.simNo = table.Rows[0]["simNo"].ToString();
                veh.deviceId = table.Rows[0]["deviceId"].ToString();
                veh.deviceType = table.Rows[0]["deviceType"].ToString();

                veh.webpass = table.Rows[0]["webpass"].ToString();
                veh.frameNo = table.Rows[0]["frameNo"].ToString();
                veh.engineNo = table.Rows[0]["engineNo"].ToString();
                veh.plateColor = table.Rows[0]["plateColor"].ToString();
                veh.vehicleColor = table.Rows[0]["vehicleColor"].ToString();

                veh.ownerName = table.Rows[0]["ownerName"].ToString().Trim();
                veh.ownerPhone = table.Rows[0]["ownerPhone"].ToString();
                veh.ownerAddress = table.Rows[0]["ownerAddress"].ToString();
                veh.vehicleType = table.Rows[0]["vehicleType"].ToString().Trim();
                veh.certificateNo = table.Rows[0]["certificateNo"].ToString();

                veh.ICCID = table.Rows[0]["ICCID"].ToString();
                veh.installTime = table.Rows[0]["installTime"] == DBNull.Value ? "" : Convert.ToDateTime(table.Rows[0]["installTime"]).ToString("yyyy-MM-dd HH:mm:ss");
                veh.installPhone = table.Rows[0]["installPhone"].ToString();
                veh.installPerson = table.Rows[0]["installPerson"].ToString();
                veh.installAddress = table.Rows[0]["installAddress"].ToString();

                veh.contactName = table.Rows[0]["contactName"].ToString();
                veh.contactPhone = table.Rows[0]["contactPhone"].ToString();
                veh.marks = table.Rows[0]["marks"].ToString();
                veh.activeTime = table.Rows[0]["activeTime"] == DBNull.Value ? "" : Convert.ToDateTime(table.Rows[0]["activeTime"]).ToString("yyyy-MM-dd HH:mm:ss");
                veh.serverEndTime = table.Rows[0]["serverEndTime"] == DBNull.Value ? "" : Convert.ToDateTime(table.Rows[0]["serverEndTime"]).ToString("yyyy-MM-dd HH:mm:ss");

                veh.vehGroupId = Convert.ToInt32(table.Rows[0]["vehGroupId"].ToString());
                veh.vehGroupName = table.Rows[0]["vehGroupName"].ToString();
                veh.ipAddress = table.Rows[0]["ipAddress"].ToString();
                veh.delFlag = Convert.ToInt32(table.Rows[0]["delFlag"].ToString());
                veh.isStore = Convert.ToInt32(table.Rows[0]["isStore"].ToString());
                veh.storeUserID = Convert.ToInt32(table.Rows[0]["storeUserID"].ToString());

                redis.HashSet("SQL_Group_" + groupID, "SQL_Vehid_" + veh.vehicleId, veh);
                return true;
            }
        }


        public static int AddVehicle(string userId, string plate, string simNo, string deviceId, string deviceType, string webpass, string frameNo, string engineNo, string plateColor, string vehicleColor, string ownerName, string ownerPhone, string ownerAddress, string vehicleType, string certificateNo, string ICCID, string installTime, string installPhone, string installPerson, string installAddress, string contactName, string contactPhone, string marks, string activeTime, string serverEndTime, string vehGroupId, out string info, out string result)
        {
            result = "";
            int vehID = 0;
            info = "";
            DBHelp dbhelp = new DBHelp();

            string strVehIP = "";  //伪IP
            #region 生成IP
            if (deviceType == "GPRS_TQ型" | deviceType == "GPRS_TZ型" | deviceType == "TQ_BXG型" | deviceType == "TQ_规格型" | deviceType == "GB_YC型" | deviceType == "GPRS_MLG型" | deviceType == "GPRS_TK型" | deviceType == "GPRS_QDWT型")
                strVehIP = IpAddress.ConvertMobileIPAddress(simNo);          //伪IP
            else if (deviceType == "GPRS_HB型")
                strVehIP = IpAddress.ConvertDB44HBIPAddress(deviceId);
            else if (deviceType == "DB44_YT型" | deviceType == "DB44_GM型" | deviceType == "DB44_YW型" | deviceType == "GPRS_YW型" | deviceType == "GB_YW型" | deviceType == "GB_XMJL型" | deviceType == "GB_HQ型" | deviceType == "DB44_SG型")
                strVehIP = IpAddress.ConvertDB44YTIPAddress(Convert.ToDouble(deviceId.Trim()));
            else if (deviceType == "GT02D" || deviceType == "KM-01" || deviceType == "KM-02")
            {
                strVehIP = IpAddress.ConvertMobileIPAddressKM(deviceId.Substring(8, 8));       //伪IP
            }
            else if (deviceType == "安安出行")
            {
                strVehIP = IpAddress.ConvertMobileIPAddressDD(deviceId.Substring(10, 8));       //伪IP
            }
            else
                strVehIP = IpAddress.ConvertMobileIPAddress(deviceId);       //伪IP

            //验证伪IP
            if (Convert.ToInt32(strVehIP.Trim().Split('.')[0]) > 255 | Convert.ToInt32(strVehIP.Trim().Split('.')[1]) > 255 | Convert.ToInt32(strVehIP.Trim().Split('.')[2]) > 255 | Convert.ToInt32(strVehIP.Trim().Split('.')[3]) > 255)
            {
                info = "伪IP非法";
                return 2;
            }
            #endregion

            SqlConnection sqlconn = new SqlConnection(SqlConfig.CONNECTION_STRING);
            sqlconn.Open();
            SqlCommand sqlcomm = new SqlCommand();
            SqlTransaction sqlts;
            sqlts = sqlconn.BeginTransaction();
            sqlcomm.Connection = sqlconn;
            sqlcomm.Transaction = sqlts;
            try
            {
                string sqlCmd = "";
                #region
                sqlCmd = @"if not exists(select id from vehicle where plate='" + plate + "' or deviceId='" + deviceId + "' or simNo='" + simNo + "' or " +
                    "ipaddress='" + strVehIP + "') begin INSERT INTO Vehicle" +
                    "(plate,simNo,deviceid,deviceType,ipaddress,webpass,frameNo,engineNo,plateColor,vehicleColor,ownerName,ownerPhone,ownerAddress," +
                    "vehicleType,certificateNo,ICCID,installTime,installPhone,installPerson,installAddress,contactName,contactPhone,activeTime,serverEndTime,marks," +
                    "isStore,delFlag,CreateTime,UpdateTime,StoreUserID) Values " +
                    "(@车牌号码,@SIM卡号,@终端编号,@终端类型,@伪IP,@服务密码,@车架编号,@发动机编号,@车牌颜色,@车主姓名,@车主电话,@车主地址," +
                    "@车主地址,@车辆种类,@证件号,@ICCID,@安装日期,@安装人电话,@安装人员,@安装地点,@联系人,@联系人电话,@激活时间,@服务结束时间,@备注," +
                    "@isStore,@delFlag,getDate(),getDate(),@StoreUserID) select @@IDENTITY end " +
                    " else begin declare @Return varchar(200) set @Return='' if exists(select id from vehicle where plate='" + plate + "') set @Return=@Return+' 车牌' " +
                    " if exists(select id from vehicle where simNo='" + simNo + "') set @Return=@Return+' SIM卡号' " +
                    " if exists(select id from vehicle where deviceId='" + deviceId + "') set @Return=@Return+' 终端编号' " +
                    " if exists(select id from vehicle where ipaddress='" + strVehIP + "') set @Return=@Return+' 伪IP' " +
                    " select @Return end";
                sqlcomm.CommandText = sqlCmd;
                sqlcomm.Parameters.AddWithValue("车牌号码", plate);
                sqlcomm.Parameters.AddWithValue("SIM卡号", simNo);
                sqlcomm.Parameters.AddWithValue("终端编号", deviceId);
                sqlcomm.Parameters.AddWithValue("终端类型", deviceType);
                sqlcomm.Parameters.AddWithValue("服务密码", webpass == null ? "123456" : webpass);

                sqlcomm.Parameters.AddWithValue("车架编号", frameNo == null ? "" : frameNo);
                sqlcomm.Parameters.AddWithValue("发动机编号", engineNo == null ? "" : engineNo);
                sqlcomm.Parameters.AddWithValue("车牌颜色", plateColor == null ? "" : plateColor);
                sqlcomm.Parameters.AddWithValue("车辆颜色", vehicleColor == null ? "" : vehicleColor);
                sqlcomm.Parameters.AddWithValue("车主姓名", ownerName == null ? "" : ownerName);

                sqlcomm.Parameters.AddWithValue("车主电话", ownerPhone == null ? "" : ownerPhone);
                sqlcomm.Parameters.AddWithValue("车主地址", ownerAddress == null ? "" : ownerAddress);
                sqlcomm.Parameters.AddWithValue("车辆种类", vehicleType);
                sqlcomm.Parameters.AddWithValue("证件号", certificateNo == null ? "" : certificateNo);
                sqlcomm.Parameters.AddWithValue("ICCID", ICCID == null ? "" : ICCID);

                sqlcomm.Parameters.AddWithValue("安装日期", installTime == null ? "2000-01-01" : installTime);
                sqlcomm.Parameters.AddWithValue("安装人电话", installPhone == null ? "" : installPhone);
                sqlcomm.Parameters.AddWithValue("安装人员", installPerson == null ? "" : installPerson);
                sqlcomm.Parameters.AddWithValue("安装地点", installAddress);
                sqlcomm.Parameters.AddWithValue("联系人", contactName == null ? "" : contactName);
                sqlcomm.Parameters.AddWithValue("联系人电话", contactPhone == null ? "" : contactPhone);

                sqlcomm.Parameters.AddWithValue("激活时间", activeTime == null ? "2000-01-01" : activeTime);
                sqlcomm.Parameters.AddWithValue("服务结束时间", serverEndTime == null ? "2000-01-01" : serverEndTime);
                sqlcomm.Parameters.AddWithValue("备注", marks == null ? "" : marks);
                sqlcomm.Parameters.AddWithValue("伪IP", strVehIP);
                sqlcomm.Parameters.AddWithValue("VideoChanel", 4);

                sqlcomm.Parameters.AddWithValue("isStore", 0);
                sqlcomm.Parameters.AddWithValue("delFlag", 0);
                //sqlcomm.Parameters.AddWithValue("CreateTime", "getDate()");
                //sqlcomm.Parameters.AddWithValue("UpdateTime", "getDate()");
                sqlcomm.Parameters.AddWithValue("StoreUserID", 0);




                #endregion
                using (SqlDataReader da = sqlcomm.ExecuteReader())
                {
                    while (da.Read())
                    {
                        try
                        {
                            vehID = Convert.ToInt32(da[0].ToString());
                        }
                        catch (Exception EX)
                        {
                            info = "数据库或回收站中存在相同的" + da[0].ToString();
                            da.Close();
                            sqlts.Rollback();
                            return 0;
                        }
                    }
                }
                if (vehID > 0)
                {
                    sqlCmd = "DELETE FROM VehicleDetail where VehID=" + vehID;
                    sqlcomm.CommandText = sqlCmd;
                    sqlcomm.ExecuteNonQuery();

                    sqlCmd = "INSERT INTO VehicleDetail (VehID, VehGroupID) VALUES (@VehID,@VehGroupID)";
                    sqlcomm.Parameters.AddWithValue("VehID", vehID);
                    sqlcomm.Parameters.AddWithValue("VehGroupID", vehGroupId);
                    sqlcomm.CommandText = sqlCmd;
                    if (sqlcomm.ExecuteNonQuery() == 0)
                    {
                        sqlts.Rollback();
                        return 0;
                    }

                    //添加操作记录
                    //string editInfo = "";
                    //editInfo += "车牌号:" + plate + ";";
                    //editInfo += "终端编号:" + simNo + ";";
                    //editInfo += "SIM号:" + deviceId + ";";
                    //editInfo += "终端类型:" + deviceType ;

                    //sqlcomm.CommandText = "insert into Tab_Operate(TheID,OpType,OpTime,OpUser,UserName,TheName,Remark,GroupName,Type) values(" + vehID + ",'新增','" + DateTime.Now.ToString() + "'," + userId + ",,'" + plate + "','" + editInfo + "'," + vehGroupId + ",1)";
                    //sqlcomm.ExecuteNonQuery();
                    sqlts.Commit();
                    sqlconn.Close();
                    result = vehID + "/" + vehGroupId + "," + vehGroupId;
                    info = "添加车辆成功";
                    UpdateVehRedis(vehID);  
                    return 1;
                }
                else
                {
                    sqlts.Rollback();
                    info = "添加车辆失败";
                    return 0;
                }
            }
            catch (Exception ex)
            {
                sqlts.Rollback();
                info = ex.ToString();
                return 2;
            }
        }



        public static int EditVehicle(int vehicleId, string userId, string plate, string simNo, string deviceId, string deviceType, string webpass, string frameNo, string engineNo, string plateColor, string vehicleColor, string ownerName, string ownerPhone, string ownerAddress, string vehicleType, string certificateNo, string ICCID, string installTime, string installPhone, string installPerson, string installAddress, string contactName, string contactPhone, string marks, string activeTime, string serverEndTime, string vehGroupId, out string info)
        {
            info = "";
            string strVehIP = "";  //伪IP
            #region 生成IP
            if (deviceType == "GPRS_TQ型" | deviceType == "GPRS_TZ型" | deviceType == "TQ_BXG型" | deviceType == "TQ_规格型" | deviceType == "GB_YC型" | deviceType == "GPRS_MLG型" | deviceType == "GPRS_TK型" | deviceType == "GPRS_QDWT型")
                strVehIP = IpAddress.ConvertMobileIPAddress(simNo);          //伪IP
            else if (deviceType == "GPRS_HB型")
                strVehIP = IpAddress.ConvertDB44HBIPAddress(deviceId);
            else if (deviceType == "DB44_YT型" | deviceType == "DB44_GM型" | deviceType == "DB44_YW型" | deviceType == "GPRS_YW型" | deviceType == "GB_YW型" | deviceType == "GB_XMJL型" | deviceType == "GB_HQ型" | deviceType == "DB44_SG型")
                strVehIP = IpAddress.ConvertDB44YTIPAddress(Convert.ToDouble(deviceId.Trim()));
            else if (deviceType == "GT02D" || deviceType == "KM-01" || deviceType == "KM-02")
            {
                strVehIP = IpAddress.ConvertMobileIPAddressKM(deviceId.Substring(8, 8));       //伪IP
            }
            else if (deviceType == "安安出行")
            {
                strVehIP = IpAddress.ConvertMobileIPAddressDD(deviceId.Substring(10, 8));       //伪IP
            }
            else
                strVehIP = IpAddress.ConvertMobileIPAddress(deviceId);       //伪IP

            //验证伪IP
            if (Convert.ToInt32(strVehIP.Trim().Split('.')[0]) > 255 | Convert.ToInt32(strVehIP.Trim().Split('.')[1]) > 255 | Convert.ToInt32(strVehIP.Trim().Split('.')[2]) > 255 | Convert.ToInt32(strVehIP.Trim().Split('.')[3]) > 255)
            {
                info = "伪IP非法";
                return 2;
            }
            #endregion


            SqlConnection sqlconn = new SqlConnection(SqlConfig.CONNECTION_STRING);
            sqlconn.Open();
            SqlCommand sqlcomm = new SqlCommand();
            SqlTransaction sqlts;
            sqlts = sqlconn.BeginTransaction();
            sqlcomm.Connection = sqlconn;
            sqlcomm.Transaction = sqlts;
            try
            {
                string sqlCmd = "";
                sqlCmd = @"select plate,VehGroupID,simNo,deviceId,deviceType,UserName  from UserMain,Vehicle left join VehicleDetail on Vehicle.Id=VehicleDetail.VehID where Id=" + vehicleId + "and UserMain.UserID=" + userId;
                sqlcomm.CommandText = sqlCmd;
                string iPlate = "";
                string iSimNo = "";
                string ideviceid = "";

                string iUserName = "";
                string ideviceType = "";
                using (SqlDataReader da = sqlcomm.ExecuteReader())
                {
                    while (da.Read())
                    {
                        try
                        {
                            iPlate = da["plate"].ToString();
                            iSimNo = da["simNo"].ToString();
                            ideviceid = da["deviceid"].ToString();
                            iUserName = da["UserName"].ToString();
                            ideviceType = da["deviceType"].ToString();
                        }
                        catch (Exception EX)
                        {
                        }
                    }
                }


                sqlCmd = @"if not exists(select id from vehicle where (plate='" + plate + "' or deviceid='" + deviceId + "' or simNo='" + simNo + "' or ipaddress='" + strVehIP + "'" + ") and id!=" + vehicleId + " ) begin update Vehicle set " + "plate=@车牌号码,simNo==@SIM卡号,deviceId=@终端编号,ipaddress=@伪IP,deviceType=@终端类型,webpass=@服务密码," +
                    "engineNo=@发动机编号,frameNo=@车架编号,plateColor=@车牌颜色,vehicleColor=@车牌颜色,ownerName=@车主姓名,ownerPhone=@车主电话" +
                     "ownerAddress=@车主地址,vehicleType=@车辆种类,certificateNo=@证件号,ICCID=@ICCID,installTime=@安装日期,installPhone=@安装人电话" +
                      "installPerson=@安装人员,installAddress=@安装地点,contactName=@联系人,contactPhone=@联系人电话,activeTime=@激活时间,serverEndTime=@服务结束时间" +
                      "marks=@备注,ipaddress=@伪IP,UpdateTime=getdate()" +
                                     "  where id=@ID select '1' end else begin declare @Return varchar(200) set @Return=''" +
                                    "if exists(select id from vehicle where cph='" + plate + "' and id!=" + vehicleId.ToString() + " ) set @Return=@Return+' 车牌' " +
                                    " if exists(select id from vehicle where simNo='" + simNo + "' and id!=" + vehicleId.ToString() + " ) set @Return=@Return+' SIM卡号' " +
                                    " if exists(select id from vehicle where deviceId='" + deviceId + "' and id!=" + vehicleId.ToString() + " ) set @Return=@Return+' 终端编号' " +
                                    " if exists(select id from vehicle where ipaddress='" + strVehIP + "' and id!=" + vehicleId.ToString() + " ) set @Return=@Return+' 伪IP' " +
                                    " select @Return end";

                sqlcomm.CommandText = sqlCmd;
                sqlcomm.Parameters.AddWithValue("ID", vehicleId);
                sqlcomm.Parameters.AddWithValue("车牌号码", plate);
                sqlcomm.Parameters.AddWithValue("SIM卡号", simNo);
                sqlcomm.Parameters.AddWithValue("终端编号", deviceId);
                sqlcomm.Parameters.AddWithValue("伪IP", strVehIP);
                sqlcomm.Parameters.AddWithValue("终端类型", deviceType);
                sqlcomm.Parameters.AddWithValue("服务密码", webpass == null ? "" : webpass);
                sqlcomm.Parameters.AddWithValue("车架编号", frameNo == null ? "" : frameNo);
                sqlcomm.Parameters.AddWithValue("发动机编号", engineNo == null ? "" : engineNo);
                sqlcomm.Parameters.AddWithValue("车牌颜色", plateColor == null ? "" : plateColor);
                sqlcomm.Parameters.AddWithValue("车辆颜色", vehicleColor == null ? "" : vehicleColor);
                sqlcomm.Parameters.AddWithValue("车主姓名", ownerName == null ? "" : ownerName);

                sqlcomm.Parameters.AddWithValue("车主电话", ownerPhone == null ? "" : ownerPhone);
                sqlcomm.Parameters.AddWithValue("车主地址", ownerAddress == null ? "" : ownerAddress);
                sqlcomm.Parameters.AddWithValue("车辆种类", vehicleType);
                sqlcomm.Parameters.AddWithValue("证件号", certificateNo == null ? "" : certificateNo);
                sqlcomm.Parameters.AddWithValue("ICCID", ICCID == null ? "" : ICCID);

                sqlcomm.Parameters.AddWithValue("安装日期", installTime == null ? "2000-01-01" : installTime);
                sqlcomm.Parameters.AddWithValue("安装人电话", installPhone == null ? "" : installPhone);
                sqlcomm.Parameters.AddWithValue("安装人员", installPerson == null ? "" : installPerson);
                sqlcomm.Parameters.AddWithValue("安装地点", installAddress);
                sqlcomm.Parameters.AddWithValue("联系人", contactName == null ? "" : contactName);
                sqlcomm.Parameters.AddWithValue("联系人电话", contactPhone == null ? "" : contactPhone);

                sqlcomm.Parameters.AddWithValue("激活时间", activeTime == null ? "2000-01-01" : activeTime);
                sqlcomm.Parameters.AddWithValue("服务结束时间", serverEndTime == null ? "2000-01-01" : serverEndTime);
                sqlcomm.Parameters.AddWithValue("备注", marks == null ? "" : marks);
                sqlcomm.Parameters.AddWithValue("伪IP", strVehIP);
                sqlcomm.Parameters.AddWithValue("VideoChanel", 4);

                sqlcomm.Parameters.AddWithValue("isStore", 0);
                sqlcomm.Parameters.AddWithValue("delFlag", 0);
                sqlcomm.Parameters.AddWithValue("CreateTime", "getDate()");
                sqlcomm.Parameters.AddWithValue("UpdateTime", "getDate()");
                sqlcomm.Parameters.AddWithValue("StoreUserID", 0);
                int iResult = 0;
                using (SqlDataReader da = sqlcomm.ExecuteReader())
                {
                    while (da.Read())
                    {
                        try
                        {
                            iResult = Convert.ToInt32(da[0].ToString());
                        }
                        catch (Exception EX)
                        {
                            info = "数据库或回收站中存在相同的" + da[0].ToString();
                            return 0;
                        }
                    }
                }
                if (iResult == 1)
                {
                    sqlCmd = "DELETE FROM VehicleDetail where VehID=" + vehicleId;
                    sqlcomm.CommandText = sqlCmd;
                    sqlcomm.ExecuteNonQuery();

                    sqlCmd = "INSERT INTO VehicleDetail (VehID, VehGroupID) VALUES (@VehID,@VehGroupID) ";
                    sqlcomm.Parameters.AddWithValue("VehID", vehicleId);
                    sqlcomm.Parameters.AddWithValue("VehGroupID", vehGroupId);
                    sqlcomm.CommandText = sqlCmd;
                    sqlcomm.ExecuteNonQuery();

                    string editInfo = "";
                    if (iPlate.Trim() != plate.Trim())// | iownno != ownno | ideviceid != deviceid )
                    {
                        editInfo += "车牌号从" + iPlate + "修改为" + plate + ";";
                    }
                    if (ideviceid.Trim() != deviceId.Trim())
                    {
                        editInfo += "终端编号从" + ideviceid + "修改为" + deviceId + ";";
                    }
                    if (iSimNo.Trim() != simNo.Trim())
                    {
                        editInfo += "SIM号从" + iSimNo + "修改为" + simNo + ";";
                    }
                    if (ideviceType.Trim() != deviceType.Trim())
                    {
                        editInfo += "终端类型从" + ideviceType + "修改为" + deviceType + ";";
                    }
                    if (editInfo.Trim() != "")
                    {
                        sqlcomm.CommandText = "select VehGroupName from VehGroupMain where VehGroupID=" + vehGroupId;
                        string GroupName = "";
                        using (SqlDataReader da = sqlcomm.ExecuteReader())
                        {
                            while (da.Read())
                            {
                                try
                                {
                                    GroupName = da[0].ToString();
                                }
                                catch (Exception EX)
                                {
                                }
                            }
                        }

                        sqlcomm.CommandText = "insert into Tab_Operate(TheID,OpType,OpTime,OpUser,UserName,TheName,Remark,GroupName,Type) values(" + vehicleId + ",'修改','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "'," + userId + "," + iUserName + ",'" + iPlate + "','" + editInfo + "'," + vehGroupId + ",1)";
                        sqlcomm.ExecuteNonQuery();
                    }

                    sqlts.Commit();
                    sqlconn.Close();
                    info = "编辑车辆成功";
                    UpdateVehRedis(vehicleId);          
                    return 1;

                }
                else
                {
                    sqlts.Rollback();
                    info = "编辑车辆失败";
                    return 2;
                }

            }
            catch (Exception ex)
            {
                sqlts.Rollback();
                info = "编辑车辆失败";
                return 2;
            }
        }
        public static bool delVehicle(string userId, int vehicleId)
        {
            SqlConnection sqlconn = new SqlConnection(SqlConfig.CONNECTION_STRING);
            sqlconn.Open();
            SqlCommand sqlcomm = new SqlCommand();
            SqlTransaction sqlts;
            sqlts = sqlconn.BeginTransaction();
            sqlcomm.Connection = sqlconn;
            sqlcomm.Transaction = sqlts;
            try
            {
                sqlcomm.CommandText = "UPDATE Vehicle SET DelFlag =1,State=" + userId + ", UpdateTime='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "' where Id =" + vehicleId;
                int result = sqlcomm.ExecuteNonQuery();

                if (result > 0)
                {
                    sqlcomm.CommandText = @"select plate,UserName ,VehicleDetail.VehGroupID,VehGroupMain.VehGroupName from UserMain,Vehicle left join VehicleDetail on Vehicle.Id=VehicleDetail.VehID
left join VehGroupMain on VehicleDetail.VehGroupID=VehGroupMain.VehGroupID where Vehicle.Id=" + vehicleId + " and UserMain.UserID=" + userId;
                    string plate = "";
                    string UserName = "";
                    int vehGroupID = -1;
                    string groupName = "";
                    using (SqlDataReader da = sqlcomm.ExecuteReader())
                    {
                        while (da.Read())
                        {
                            try
                            {
                                plate = da[0].ToString();
                                UserName = da[1].ToString();
                                vehGroupID = Convert.ToInt32(da[2]);
                                groupName = da[3].ToString();
                            }
                            catch (Exception EX)
                            {
                            }
                        }
                    }

                    sqlcomm.CommandText = "insert into Tab_Operate(TheID,OpType,OpTime,OpUser,UserName,TheName,Remark,GroupName,Type) values(" + vehicleId + ",'删除','" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "'," + userId + ",,'" + plate + "','删除车辆" + plate + "'," + vehGroupID + ",1)";
                    int index = sqlcomm.ExecuteNonQuery();
                    if (index > 0)
                    {
                        sqlts.Commit();
                        sqlconn.Close();
                        var redis = Wdj.Redis.Helper.RedisHelper.HashService;
                        redis.HashDelete("SQL_Group_" + vehGroupID, "SQL_Vehid_" + vehicleId);
                        return true;
                    }
                    else
                    {
                        sqlts.Rollback();
                        return false;
                    }
                }
                else
                {
                    sqlts.Rollback();
                    return false;
                }
            }
            catch (Exception e)
            {
                sqlts.Rollback();
                return false;
            }


        }
        #region 获取下级相关
        public static void RecursiveVehGroup(string iGroupID, ref string strGroupID)
        {
            string strSQL;
            DBHelp dbhelp = new DBHelp();
            DataTable table;
            List<FRelation> db = new List<FRelation>();
            try
            {
                strSQL = "SELECT VehGroupID,fVehGroupID FROM VehGroupDetail";
                if (dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, strSQL, new SqlParameter[] { }, false, out table))
                {
                    if (table.Rows.Count > 0)
                    {
                        int id; int pid;
                        for (int i = 0; i < table.Rows.Count; i++)
                        {
                            id = Convert.ToInt32(table.Rows[i]["VehGroupID"]);
                            pid = table.Rows[i]["fVehGroupID"] == DBNull.Value ? 0 : Convert.ToInt32(table.Rows[i]["fVehGroupID"]);
                            db.Add(new FRelation(id, pid));
                        }
                        for (int i = 0; i < db.Count; i++)
                        {
                            if (db[i].pID.ToString() == iGroupID)
                            {
                                strGroupID += db[i].ID + ",";
                                getChileUserGroup(db, db[i].ID, ref strGroupID);

                            }
                        }
                        if (strGroupID.Length > 0)
                            if (strGroupID.Substring(strGroupID.Length - 1, 1) == ",")
                                strGroupID = strGroupID.Substring(0, strGroupID.Length - 1);
                    }
                }



            }
            catch (Exception ex) { }


        }

        public static void getChileUserGroup(List<FRelation> db, int iID, ref string s)
        {
            for (int i = 0; i < db.Count; i++)
            {
                if (db[i].pID == iID)
                    if (CheckHaveChild(iID, s) == true)
                    {
                        s += db[i].ID.ToString() + ",";
                        getChileUserGroup(db, db[i].ID, ref s);
                    }
            }
        }

        public static bool CheckHaveChild(int id, string s)
        {
            bool blnResult = false;
            string[] astrTemp = s.Split(',');
            for (int i = 0; i < astrTemp.Length; i++)
            {
                if ((astrTemp[i] == id.ToString()))
                {
                    blnResult = true;
                    break;
                }
            }
            return blnResult;
        }
        #endregion

        #region 车辆资料更新Redis
        public static bool UpdateVehRedis(int id)
        {

            VehDetail veh = new VehDetail();
            var redis = Wdj.Redis.Helper.RedisHelper.HashService;

            DBHelp dbhelp = new DBHelp();
            DataTable table;
            string sqlCmd = @"SELECT Vehicle.*, VehicleDetail.VehGroupID,VehGroupMain.VehGroupName, FROM Vehicle left JOIN VehicleDetail ON Vehicle.Id = VehicleDetail.VehID left join VehGroupMain   on VehGroupMain.VehGroupID=VehicleDetail.VehGroupID WHERE(VehicleDetail.VehID = @vehid)  and ((Vehicle.delflag!=1) or(Vehicle.delflag is null))  ";

            if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("vehid", id) }, false, out table))
                return false;

            if (table.Rows.Count == 0)
                return true;

            veh.vehicleId = Convert.ToInt32(table.Rows[0]["Id"]);
            veh.plate = table.Rows[0]["plate"].ToString();
            veh.simNo = table.Rows[0]["simNo"].ToString();
            veh.deviceId = table.Rows[0]["deviceId"].ToString();
            veh.deviceType = table.Rows[0]["deviceType"].ToString();

            veh.webpass = table.Rows[0]["webpass"].ToString();
            veh.frameNo = table.Rows[0]["frameNo"].ToString();
            veh.engineNo = table.Rows[0]["engineNo"].ToString();
            veh.plateColor = table.Rows[0]["plateColor"].ToString();
            veh.vehicleColor = table.Rows[0]["vehicleColor"].ToString();

            veh.ownerName = table.Rows[0]["ownerName"].ToString().Trim();
            veh.ownerPhone = table.Rows[0]["ownerPhone"].ToString();
            veh.ownerAddress = table.Rows[0]["ownerAddress"].ToString();
            veh.vehicleType = table.Rows[0]["vehicleType"].ToString().Trim();
            veh.certificateNo = table.Rows[0]["certificateNo"].ToString();

            veh.ICCID = table.Rows[0]["ICCID"].ToString();
            veh.installTime = table.Rows[0]["installTime"] == DBNull.Value ? "" : Convert.ToDateTime(table.Rows[0]["installTime"]).ToString("yyyy-MM-dd HH:mm:ss");
            veh.installPhone = table.Rows[0]["installPhone"].ToString();
            veh.installPerson = table.Rows[0]["installPerson"].ToString();
            veh.installAddress = table.Rows[0]["installAddress"].ToString();

            veh.contactName = table.Rows[0]["contactName"].ToString();
            veh.contactPhone = table.Rows[0]["contactPhone"].ToString();
            veh.marks = table.Rows[0]["marks"].ToString();
            veh.activeTime = table.Rows[0]["activeTime"] == DBNull.Value ? "" : Convert.ToDateTime(table.Rows[0]["activeTime"]).ToString("yyyy-MM-dd HH:mm:ss");
            veh.serverEndTime = table.Rows[0]["serverEndTime"] == DBNull.Value ? "" : Convert.ToDateTime(table.Rows[0]["serverEndTime"]).ToString("yyyy-MM-dd HH:mm:ss");

            veh.vehGroupId = Convert.ToInt32(table.Rows[0]["vehGroupId"].ToString());
            veh.vehGroupName = table.Rows[0]["vehGroupName"].ToString();
            veh.ipAddress = table.Rows[0]["ipAddress"].ToString();
            veh.delFlag = Convert.ToInt32(table.Rows[0]["delFlag"].ToString());
            veh.isStore = Convert.ToInt32(table.Rows[0]["isStore"].ToString());
            veh.storeUserID = Convert.ToInt32(table.Rows[0]["storeUserID"].ToString());

            redis.HashSet("SQL_Group_" + veh.vehGroupId, "SQL_Vehid_" + veh.vehicleId, veh);
            return true;

        }

        #endregion
    }
    public class FRelation
    {
        public int ID;
        public int pID;
        public FRelation(int iID, int iPID)
        {
            ID = iID;
            pID = iPID;
        }
    }
    public class IpAddress
    {
        #region 生成伪IP

        public static string ConvertMobileIPAddressKM(string sSim)
        {
            try
            {
                int[] sTemp = new int[4];
                string[] sIp = new string[4];
                int iHigt;
                if (sSim.Length == 11)
                {
                    sTemp[0] = Convert.ToInt32(sSim.Substring(3, 2));
                    sTemp[1] = Convert.ToInt32(sSim.Substring(5, 2));
                    sTemp[2] = Convert.ToInt32(sSim.Substring(7, 2));
                    sTemp[3] = Convert.ToInt32(sSim.Substring(9, 2));
                    iHigt = Convert.ToInt32(sSim.Substring(1, 2)) - 30;
                }
                else if (sSim.Length == 10)
                {
                    sTemp[0] = Convert.ToInt32(sSim.Substring(2, 2));
                    sTemp[1] = Convert.ToInt32(sSim.Substring(4, 2));
                    sTemp[2] = Convert.ToInt32(sSim.Substring(6, 2));
                    sTemp[3] = Convert.ToInt32(sSim.Substring(8, 2));
                    iHigt = Convert.ToInt32(sSim.Substring(0, 2)) - 30;
                }
                else if (sSim.Length == 9)
                {
                    sTemp[0] = Convert.ToInt32(sSim.Substring(1, 2));
                    sTemp[1] = Convert.ToInt32(sSim.Substring(3, 2));
                    sTemp[2] = Convert.ToInt32(sSim.Substring(5, 2));
                    sTemp[3] = Convert.ToInt32(sSim.Substring(7, 2));
                    iHigt = Convert.ToInt32(sSim.Substring(0, 1));
                }
                else if (sSim.Length < 9)
                {
                    switch (sSim.Length)
                    {
                        case 8:
                            sSim = "145" + sSim;
                            break;
                        case 7:
                            sSim = "1450" + sSim;
                            break;
                        case 6:
                            sSim = "14500" + sSim;
                            break;
                        case 5:
                            sSim = "145000" + sSim;
                            break;
                        case 4:
                            sSim = "1450000" + sSim;
                            break;
                        case 3:
                            sSim = "14500000" + sSim;
                            break;
                        case 2:
                            sSim = "145000000" + sSim;
                            break;
                        case 1:
                            sSim = "1450000000" + sSim;
                            break;
                    }
                    sTemp[0] = Convert.ToInt32(sSim.Substring(3, 2));
                    sTemp[1] = Convert.ToInt32(sSim.Substring(5, 2));
                    sTemp[2] = Convert.ToInt32(sSim.Substring(7, 2));
                    sTemp[3] = Convert.ToInt32(sSim.Substring(9, 2));
                    iHigt = Convert.ToInt32(sSim.Substring(1, 2)) - 30;
                }
                else
                    return "";
                if ((iHigt & 0x8) != 0)
                    sIp[0] = (sTemp[0] | 128).ToString();
                else
                    sIp[0] = sTemp[0].ToString();
                if ((iHigt & 0x4) != 0)
                    sIp[1] = (sTemp[1] | 128).ToString();
                else
                    sIp[1] = sTemp[1].ToString();
                if ((iHigt & 0x2) != 0)
                    sIp[2] = (sTemp[2] | 128).ToString();
                else
                    sIp[2] = sTemp[2].ToString();
                if ((iHigt & 0x1) != 0)
                    sIp[3] = (sTemp[3] | 128).ToString();
                else
                    sIp[3] = sTemp[3].ToString();
                return sIp[0] + "." + sIp[1] + "." + sIp[2] + "." + sIp[3];
            }
            catch (Exception ex)
            {
                return "";
            }
        }
        public static string ConvertMobileIPAddress(string sSim)
        {
            try
            {
                int[] sTemp = new int[4];
                string[] sIp = new string[4];
                int iHigt;
                if (sSim.Length == 11)
                {
                    sTemp[0] = Convert.ToInt32(sSim.Substring(3, 2));
                    sTemp[1] = Convert.ToInt32(sSim.Substring(5, 2));
                    sTemp[2] = Convert.ToInt32(sSim.Substring(7, 2));
                    sTemp[3] = Convert.ToInt32(sSim.Substring(9, 2));
                    iHigt = Convert.ToInt32(sSim.Substring(1, 2)) - 30;
                }
                else if (sSim.Length == 10)
                {
                    sTemp[0] = Convert.ToInt32(sSim.Substring(2, 2));
                    sTemp[1] = Convert.ToInt32(sSim.Substring(4, 2));
                    sTemp[2] = Convert.ToInt32(sSim.Substring(6, 2));
                    sTemp[3] = Convert.ToInt32(sSim.Substring(8, 2));
                    iHigt = Convert.ToInt32(sSim.Substring(0, 2)) - 30;
                }
                else if (sSim.Length == 9)
                {
                    sTemp[0] = Convert.ToInt32(sSim.Substring(1, 2));
                    sTemp[1] = Convert.ToInt32(sSim.Substring(3, 2));
                    sTemp[2] = Convert.ToInt32(sSim.Substring(5, 2));
                    sTemp[3] = Convert.ToInt32(sSim.Substring(7, 2));
                    iHigt = Convert.ToInt32(sSim.Substring(0, 1));
                }
                else if (sSim.Length < 9)
                {
                    switch (sSim.Length)
                    {
                        case 8:
                            sSim = "140" + sSim;
                            break;
                        case 7:
                            sSim = "1400" + sSim;
                            break;
                        case 6:
                            sSim = "14000" + sSim;
                            break;
                        case 5:
                            sSim = "140000" + sSim;
                            break;
                        case 4:
                            sSim = "1400000" + sSim;
                            break;
                        case 3:
                            sSim = "14000000" + sSim;
                            break;
                        case 2:
                            sSim = "140000000" + sSim;
                            break;
                        case 1:
                            sSim = "1400000000" + sSim;
                            break;
                    }
                    sTemp[0] = Convert.ToInt32(sSim.Substring(3, 2));
                    sTemp[1] = Convert.ToInt32(sSim.Substring(5, 2));
                    sTemp[2] = Convert.ToInt32(sSim.Substring(7, 2));
                    sTemp[3] = Convert.ToInt32(sSim.Substring(9, 2));
                    iHigt = Convert.ToInt32(sSim.Substring(1, 2)) - 30;
                }
                else
                    return "";
                if ((iHigt & 0x8) != 0)
                    sIp[0] = (sTemp[0] | 128).ToString();
                else
                    sIp[0] = sTemp[0].ToString();
                if ((iHigt & 0x4) != 0)
                    sIp[1] = (sTemp[1] | 128).ToString();
                else
                    sIp[1] = sTemp[1].ToString();
                if ((iHigt & 0x2) != 0)
                    sIp[2] = (sTemp[2] | 128).ToString();
                else
                    sIp[2] = sTemp[2].ToString();
                if ((iHigt & 0x1) != 0)
                    sIp[3] = (sTemp[3] | 128).ToString();
                else
                    sIp[3] = sTemp[3].ToString();
                return sIp[0] + "." + sIp[1] + "." + sIp[2] + "." + sIp[3];
            }
            catch (Exception ex)
            {
                return "";
            }
        }




        public static string ConvertMobileIPAddressDD(string sSim)
        {
            try
            {
                int[] sTemp = new int[4];
                string[] sIp = new string[4];
                int iHigt;

                sSim = "130" + sSim;
                sTemp[0] = Convert.ToInt32(sSim.Substring(3, 2));
                sTemp[1] = Convert.ToInt32(sSim.Substring(5, 2));
                sTemp[2] = Convert.ToInt32(sSim.Substring(7, 2));
                sTemp[3] = Convert.ToInt32(sSim.Substring(9, 2));
                iHigt = Convert.ToInt32(sSim.Substring(1, 2)) - 30;

                if ((iHigt & 0x8) != 0)
                    sIp[0] = (sTemp[0] | 128).ToString();
                else
                    sIp[0] = sTemp[0].ToString();
                if ((iHigt & 0x4) != 0)
                    sIp[1] = (sTemp[1] | 128).ToString();
                else
                    sIp[1] = sTemp[1].ToString();
                if ((iHigt & 0x2) != 0)
                    sIp[2] = (sTemp[2] | 128).ToString();
                else
                    sIp[2] = sTemp[2].ToString();
                if ((iHigt & 0x1) != 0)
                    sIp[3] = (sTemp[3] | 128).ToString();
                else
                    sIp[3] = sTemp[3].ToString();
                return sIp[0] + "." + sIp[1] + "." + sIp[2] + "." + sIp[3];
            }
            catch (Exception ex)
            {
                return "";
            }
        }


        public static string ConvertDB44YTIPAddress(double sSim)
        {
            try
            {
                int a, b, c, d;
                a = Convert.ToInt32(Math.Truncate(sSim / 16777216));
                b = Convert.ToInt32(Math.Truncate((sSim % 16777216) / 65536));
                c = Convert.ToInt32(Math.Truncate(((sSim % 16777216) % 65536) / 256));
                d = Convert.ToInt32(((sSim % 16777216) % 65536) % 256);
                return a.ToString() + "." + b.ToString() + "." + c.ToString() + d.ToString();
            }
            catch (Exception ex)
            {
                return "";
            }
        }

        public static string ConvertDB44HBIPAddress(string sSim)
        {
            try
            {
                int a, b, c, d, f;
                a = Convert.ToInt32(sSim.Substring(0, 3).Trim());
                b = Convert.ToInt32(sSim.Substring(3, 3).Trim());
                f = Convert.ToInt32(sSim.Substring(6, 5).Trim());
                c = Convert.ToInt32(Math.Truncate(Convert.ToDouble(f / 256)));
                d = f % 256;
                return a.ToString() + "." + b.ToString() + "." + c.ToString() + "." + d.ToString();
            }
            catch (Exception ex) { return ""; }
        }
        #endregion
    }

}
