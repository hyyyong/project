using Aliyun.Acs.Core;
using Aliyun.Acs.Core.Exceptions;
using Aliyun.Acs.Core.Profile;
using Aliyun.Acs.Dysmsapi.Model.V20170525;
using Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manager
{
    public class M_AppBase
    {

        public static bool MGetCheck(string codeString, out string info)
        {
            try
            {
                info = "";
                if (codeString.Trim().Length != 19)
                {
                    info = "扫描的数据格式不正确";
                    return false;

                }
                string deviceId = codeString.Substring(codeString.Length - 11, 11);// "13100001122";
                DBHelp dbhelp = new DBHelp();
                DataTable table;
                string sqlCmd = @"select * from Vehicle where deviceId=" + deviceId;
                if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { }, false, out table))
                    return false;
                if (table.Rows.Count == 0)
                {
                    info = "数据库中不存在该设备";
                    return false;
                }
                else
                {
                    info = "存在该设备";
                    return true;
                }
            }
            catch (Exception ex)
            {
                info = "处理错误";
                return false;
            }
        }

        public static bool MGetUpgradeApp(string appType, out string info)
        {
            try
            {
              
                info = "";       
                return true;
             
            }
            catch (Exception ex)
            {
                info = "处理错误";
                return false;
            }
        }
        

        public static bool MAppAddVehicel(int userId, string brand, string frameNo, string codeString, string engineNo, string image, string nickName, string mark, string phone, string plate, string deviceType, string venderPhone,string filePath, out string info)
        {
            try
            {
                info = "";
                if (image == null||image.Trim() == "")
                {
                    image = "";
                }
                else
                {
                    byte[] imgByte = Convert.FromBase64String(image);
                    FileStream ms = new FileStream(filePath, FileMode.OpenOrCreate);
                    ms.Write(imgByte, 0, imgByte.Length);
                    ms.Flush();
                    ms.Close();
                    image = filePath;
                }


                string sqlCmd = "";
                SqlConnection sqlconn = new SqlConnection(SqlConfig.CONNECTION_STRING);
                sqlconn.Open();
                SqlCommand sqlcomm = new SqlCommand();
                SqlTransaction sqlts;
                sqlts = sqlconn.BeginTransaction();
                sqlcomm.Connection = sqlconn;
                sqlcomm.Transaction = sqlts;
                if (codeString == null || codeString.Trim() == "" || codeString.Trim().Length != 19)
                {
                    //不带设备编号的
                    sqlCmd = "INSERT INTO Vehicle_AppTemp" +
                    "(appUserId,brand,frameNo,codeString,engineNo,image,nickName,mark,OwnerPhone,plate,vehicleType,InstallPhone) Values  (" + userId + ",'" + brand + "','" + frameNo + "','" + codeString + "','" + engineNo + "','" + image + "','" + nickName + "','" + mark + "','" + phone + "','" + plate + "','" + deviceType + "','" + venderPhone + "') select @@IDENTITY";
                    sqlcomm.CommandText = sqlCmd;
                    //sqlcomm.Parameters.AddWithValue("用户ID", userId);
                    //sqlcomm.Parameters.AddWithValue("车辆种类", brand);
                    //sqlcomm.Parameters.AddWithValue("车架编号", frameNo);
                    //sqlcomm.Parameters.AddWithValue("ICCID", codeString);
                    //sqlcomm.Parameters.AddWithValue("发动机编号", engineNo);

                    //sqlcomm.Parameters.AddWithValue("图片", image);
                    //sqlcomm.Parameters.AddWithValue("昵称", nickName);
                    //sqlcomm.Parameters.AddWithValue("备注", mark);
                    //sqlcomm.Parameters.AddWithValue("车主电话", phone);
                    //sqlcomm.Parameters.AddWithValue("车牌号码", plate);

                    //sqlcomm.Parameters.AddWithValue("车辆类型", deviceType);
                    //sqlcomm.Parameters.AddWithValue("安装人电话", venderPhone);

                    using (SqlDataReader da = sqlcomm.ExecuteReader())
                    {
                        while (da.Read())
                        {
                            try
                            {
                                int appVehID = Convert.ToInt32(da[0].ToString());
                                da.Close();
                                sqlts.Commit();
                                sqlconn.Close();
                                info = "添加资料成功";
                                return true;
                            }
                            catch (Exception EX)
                            {
                                info = "添加资料失败";
                                da.Close();
                                sqlts.Rollback();
                                return false;
                            }
                        }
                    }


                }
                else
                {
                    //存在设备编号
                    string deviceId = codeString.Substring(codeString.Length - 11, 11);// "13100001122";
                    sqlCmd = @"if not exists(select id from vehicle where plate='" + plate + "'  and deviceId!='" + deviceId + "' ) begin update Vehicle set brand='" + brand + "',frameNo='" + frameNo + "',engineNo='" + engineNo + "',nickName='" + nickName + "',Marks='" + mark + "',OwnerPhone='" + phone + "',plate='" + plate + "',vehicleType='" + deviceType + "',installPhone='" + venderPhone + "',UpdateTime=getdate()   where deviceId='" + deviceId + "' and IsStore=1  select id from vehicle where deviceId='" + deviceId + "' end else begin  select '有相同的车牌号' end";
                    sqlcomm.CommandText = sqlCmd;
                    //sqlcomm.Parameters.AddWithValue("车辆种类", brand);
                    //sqlcomm.Parameters.AddWithValue("车架编号", frameNo);
                    //sqlcomm.Parameters.AddWithValue("发动机编号", engineNo);
                    //sqlcomm.Parameters.AddWithValue("昵称", nickName);
                    //sqlcomm.Parameters.AddWithValue("备注", mark);

                    //sqlcomm.Parameters.AddWithValue("车主电话", phone);
                    //sqlcomm.Parameters.AddWithValue("车牌号码", plate);
                    //sqlcomm.Parameters.AddWithValue("车辆类型", deviceType);
                    //sqlcomm.Parameters.AddWithValue("安装人电话", venderPhone);
                    try
                    {
                        int ivehid = 0;
                        using (SqlDataReader da = sqlcomm.ExecuteReader())
                        {
                            while (da.Read())
                            {
                                try
                                {
                                    ivehid = Convert.ToInt32(da[0].ToString());
                                    //da.Close();
                                }
                                catch (Exception EX)
                                {
                                    info = "数据库中存在相同的车牌号";
                                    da.Close();
                                    sqlts.Rollback();

                                    return false;
                                }
                            }
                        }
                        if (ivehid > 0)
                        {
                            sqlCmd = "INSERT INTO AppBindVeh (appUserId,vehid,image) VALUES (" + userId + "," + ivehid + ",'" + image + "') ";
                            sqlcomm.CommandText = sqlCmd;
                            sqlcomm.ExecuteNonQuery();

                            sqlts.Commit();
                            sqlconn.Close();
                            info = "编辑车辆成功";
                            return true;
                        }
                        else
                        {
                            info = "添加失败";
                            sqlts.Rollback();
                            return false;
                        }
                    }
                    catch (Exception ex)
                    {
                        sqlts.Rollback();
                        info = "处理错误";
                        return false;
                    }


                }
                return true;

            }
            catch (Exception ex)
            {
                info = "处理错误";
                return false;
            }
        }

        public static bool MBindVehicle(int userId, int vehicleId, string codeString, out string info)
        {
            info = "";
            try
            {

                DBHelp dbhelp = new DBHelp();
                DataTable table;
                string sqlCmd = @"select * from Vehicle_AppTemp where appUserId=" + userId + "and id=" + vehicleId;
                if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { }, false, out table))
                    return false;
                if (table.Rows.Count == 0)
                {
                    info = "数据库中没有改车辆id";
                    return false;
                }
                var plate = table.Rows[0]["plate"].ToString();
                var nickName = table.Rows[0]["nickName"].ToString();
                var image = table.Rows[0]["image"].ToString();
                var phone = table.Rows[0]["OwnerPhone"].ToString();
                var vehicleType = table.Rows[0]["vehicleType"].ToString();

                var venderPhone = table.Rows[0]["InstallPhone"].ToString();
                var brand = Convert.ToInt32(table.Rows[0]["brand"]);
                var frameNo = table.Rows[0]["frameNo"].ToString();
                var engineNo = table.Rows[0]["engineNo"].ToString();
                var mark = table.Rows[0]["mark"].ToString();

                SqlConnection sqlconn = new SqlConnection(SqlConfig.CONNECTION_STRING);
                sqlconn.Open();
                SqlCommand sqlcomm = new SqlCommand();
                SqlTransaction sqlts;
                sqlts = sqlconn.BeginTransaction();
                sqlcomm.Connection = sqlconn;
                sqlcomm.Transaction = sqlts;

                string deviceId = codeString.Substring(codeString.Length - 11, 11);// "13100001122";
                sqlCmd = @"if not exists(select id from vehicle where plate='" + plate + "'  and deviceId!='" + deviceId + "' ) begin update Vehicle set brand='" + brand + "',frameNo='" + frameNo + "',engineNo='" + engineNo + "',nickName='" + nickName + "',Marks='" + mark + "',OwnerPhone='" + phone + "',plate='" + plate + "',vehicleType='" + vehicleType + "',installPhone='" + venderPhone + "',UpdateTime=getdate()   where deviceId='" + deviceId + "' and IsStore=1  select id from vehicle where deviceId='" + deviceId + "' end else begin  select '有相同的车牌号' end";
                sqlcomm.CommandText = sqlCmd;

                try
                {
                    int ivehid = 0;
                    using (SqlDataReader da = sqlcomm.ExecuteReader())
                    {
                        while (da.Read())
                        {
                            try
                            {
                                ivehid = Convert.ToInt32(da[0].ToString());
                                da.Close();
                            }
                            catch (Exception EX)
                            {
                                info = "数据库中存在相同的车牌号";
                                da.Close();
                                sqlts.Rollback();

                                return false;
                            }
                        }
                    }
                    if (ivehid > 0)
                    {
                        sqlCmd = "delete from Vehicle_AppTemp where id=vehicleId  INSERT INTO AppBindVeh (appUserId,vehid,image) VALUES (" + userId + "," + ivehid + ",'" + image + "') ";
                        sqlcomm.CommandText = sqlCmd;
                        sqlcomm.ExecuteNonQuery();

                        sqlts.Commit();
                        sqlconn.Close();
                        info = "编辑车辆成功";
                        return true;
                    }
                    else
                    {
                        info = "添加失败";
                        sqlts.Rollback();
                        return false;
                    }
                }
                catch (Exception ex)
                {
                    sqlts.Rollback();
                    info = "处理错误";
                    return false;
                }


                return true;
            }
            catch (Exception ex)
            {
                info = "处理错误";
                return false;
            }
        }


        public static bool MGetVehicle(int userId, out List<APPVehList> vehicleList)
        {

            vehicleList = null;
            DBHelp dbhelp = new DBHelp();
            DataTable table;
            string sqlCmd = @"select * from Vehicle_AppTemp where appUserId=" + userId;
            if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { }, false, out table))
                return false;

            vehicleList = new List<APPVehList>();
            for (int i = 0; i < table.Rows.Count; i++)
            {
                APPVehList veh = new APPVehList();
                veh.vehicelId = Convert.ToInt32(table.Rows[i]["Id"]);
                veh.plate = table.Rows[i]["plate"].ToString();
                veh.nickName = table.Rows[i]["nickName"].ToString();
                veh.image = table.Rows[i]["image"].ToString();
                veh.phone = table.Rows[i]["OwnerPhone"].ToString();
                veh.venderPhone = table.Rows[i]["InstallPhone"].ToString();
                veh.isEquipment = 0;

                veh.voltage = "";
                veh.electricity = "";
                veh.charging = 0;
                veh.dueDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                vehicleList.Add(veh);
            }
            table = new DataTable();
            sqlCmd = @"  select b.*,a.plate,a.OwnerPhone,a.installPhone,a.ServerEndTime,a.nickname from AppBindVeh b inner join Vehicle a on b.vehid=a.Id where appUserId=" + userId;
            if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { }, false, out table))
                return false;

            for (int i = 0; i < table.Rows.Count; i++)
            {
                APPVehList veh = new APPVehList();
                veh.vehicelId = Convert.ToInt32(table.Rows[i]["id"]);
                veh.plate = table.Rows[i]["plate"].ToString();
                veh.nickName = table.Rows[i]["nickName"].ToString();
                veh.image = table.Rows[i]["image"].ToString();
                veh.phone = table.Rows[i]["OwnerPhone"].ToString();
                veh.venderPhone = table.Rows[i]["InstallPhone"].ToString();
                veh.isEquipment = 1;

                veh.voltage = "";
                veh.electricity = "";
                veh.charging = 0;
                veh.dueDate = table.Rows[i]["ServerEndTime"].ToString();
                vehicleList.Add(veh);
            }


            return true;
        }


    }
}
