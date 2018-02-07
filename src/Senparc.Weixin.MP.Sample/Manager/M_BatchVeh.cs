using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manager
{
    public class M_BatchVeh
    {
        public static bool ReadAndInsert(int userId,int vehGroupID, string filename, out int ID, out string info)
        {
            info = "";
            ID = -1;
            DBHelp dbhelp = new DBHelp();
            string sqlCmd = "";
            DataTable dtContent = new DataTable();
            string errorInfo = "";
            DataSet ds = ExcelToDataSet(filename, out errorInfo);
            if (ds == null)
            {
                ID = -1;
                info = errorInfo;
                return false;
            }
            else
                dtContent = ds.Tables[0];

            if (dtContent.Rows.Count > 0)
            {
                DataTable dstDt = HisTableSchema();                
                List<string> deviceidList = new List<string>();
                #region 导入Table  
                for (int i = 0; i < dtContent.Rows.Count; i++)
                {
                    try
                    {
                        DataRow drSrc = dtContent.Rows[i];
                        DataRow drDst = dstDt.NewRow();
                      
                        string deviceId = drSrc["终端编号"].ToString().Trim();
                        string deviceType = drSrc["终端类型"].ToString().Trim();

                        if (deviceId == "" | deviceType == "")
                            continue;
                        if (deviceidList.Contains(deviceId))  //终端编号是否重复
                            continue;
                      
                        string strVehIP = "";  //伪IP

                        if (deviceType == "GT02D" || deviceType == "KM-01" || deviceType == "KM-02")
                        {
                            strVehIP = IpAddress.ConvertMobileIPAddressKM(deviceId.Substring(8, 8));       //伪IP
                        }
                        else
                            strVehIP = IpAddress.ConvertMobileIPAddress(deviceId);       //伪IP

                        //验证伪IP
                        if (Convert.ToInt32(strVehIP.Trim().Split('.')[0]) > 255 | Convert.ToInt32(strVehIP.Trim().Split('.')[1]) > 255 | Convert.ToInt32(strVehIP.Trim().Split('.')[2]) > 255 | Convert.ToInt32(strVehIP.Trim().Split('.')[3]) > 255)
                        {
                            continue;
                        }
                        else
                        {
                            drDst["Plate"] = "";
                            drDst["SimNo"] = deviceId;
                            drDst["Deviceid"] = deviceId;
                            drDst["DeviceType"] = deviceType;

                            drDst["IpAddress"] = strVehIP;
                            drDst["WebPass"] = "123456";
                            drDst["FrameNo"] = "";                       
                            drDst["EngineNo"] ="";
                            drDst["VehicleColor"] = "白色"; 
                     
                            drDst["OwnerName"] = "";
                            drDst["OwnerPhone"] = "";
                            drDst["OwnerAddress"] = "";
                            drDst["VehicleType"] = "电动车";
                            drDst["CertificateNo"] = "";                        

                            drDst["ICCID"] = "";
                            drDst["InstallTime"] = DateTime.Now.ToString("yyyy-MM-dd");
                            drDst["InstallPerson"] = "";
                            drDst["InstallPhone"] = "";
                            drDst["InstallAddress"] = "";
                           
                            drDst["ContactName"] = "";
                            drDst["ContactPhone"] = "";
                            drDst["ActiveTime"] = DateTime.Now.ToString("yyyy-MM-dd");
                            drDst["ServerEndTime"] = DateTime.Now.AddYears(1).ToString("yyyy-MM-dd");
                            drDst["Marks"] = "";
 
                            drDst["IsStore"] = "1";
                            drDst["StoreUserID"] = userId;
                            drDst["DelFlag"] = "0";
                            drDst["State"] = "0";
                            drDst["CreateTime"] = DateTime.Now.ToString("yyyy-MM-dd");

                            drDst["UpdateTime"] = DateTime.Now.ToString("yyyy-MM-dd");
                            drDst["plateColor"] = "蓝色";
                            drDst["VehicleGroupID"] = vehGroupID;
                            deviceidList.Add(deviceId); 
                            dstDt.Rows.Add(drDst);
                        }
                    }
                    catch (Exception e)
                    { }
                }
                #endregion
                if (dstDt.Rows.Count > 0)
                {

                    //批量导入前 车辆数
                    DataTable table1, table2,table3;
                    int count1, count2;
                    sqlCmd = @"select COUNT(1) count from Vehicle where StoreUserID=@StoreUserID and IsStore=1";
                    dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("StoreUserID", userId) }, false, out table1);
                    count1 = Convert.ToInt32(table1.Rows[0][0]);


                    bool result = dbhelp.ExecuteTable(SqlConfig.CONNECTION_STRING, "Vehicle", dstDt);
                    if (result)
                    {
                        sqlCmd = @" SELECT Deviceid from Vehicle where Id in( select MAX(id) id  from Vehicle where Plate='' and StoreUserID=@StoreUserID and (SimNo in(select SimNo 
from Vehicle group by SimNo having COUNT(1)>1) or Deviceid in(select Deviceid from Vehicle group by Deviceid having COUNT(1)>1)) group by Deviceid) ";

                        if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("StoreUserID", userId) }, false, out table3))
                        {
                            ID = -1;
                            return false;
                        }
                        string sdevicedid = "";
                        for (int ihave = 0; ihave < table3.Rows.Count; ihave++)
                        {
                            sdevicedid+= table3.Rows[ihave][0].ToString();
                        }


                        //删除重复
                        sqlCmd = @" delete from Vehicle where Id in( select MAX(id) id  from Vehicle where Plate='' and StoreUserID=@StoreUserID and (SimNo in(select SimNo "+
                            " from Vehicle group by SimNo having COUNT(1)>1) or Deviceid in(select Deviceid from Vehicle group by Deviceid having COUNT(1)>1)) group by Deviceid) " +
                            " insert into VehicleDetail select Id,VehicleGroupID from Vehicle where StoreUserID=@StoreUserID " +
                       "and IsStore=1 and Id not in(select VehID from vehicledetail ) select COUNT(1) count from Vehicle where StoreUserID=@StoreUserID and IsStore=1";

                        if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("StoreUserID", userId) }, false, out table2))
                        {
                            ID = -1;
                            return false;
                        }
                        count2 = Convert.ToInt32(table2.Rows[0][0]);
                        info = (count2 - count1).ToString() + "|" + sdevicedid;
                        ID = 1;
                        return true;
                    }
                    else
                    {
                        info = "导入车辆表失败.";
                        ID = -1;
                        return false;
                    }
                }
                else
                {
                    info = "导入车辆为空.";
                    ID = -2;
                    return false;
                }
            }
            else
            {
                info = "导入车辆为空.";
                ID = -2;
                return false;
            }
        }



        //读execl
        public static DataSet ExcelToDataSet(string Path, out string errorInfo)
        {
            try
            {
                string strConn = "Provider=Microsoft.Jet.OLEDB.4.0;" + "Data Source=" + Path + ";" + "Extended Properties=Excel 8.0;";
                OleDbConnection conn = new OleDbConnection(strConn);
                conn.Open();

                DataTable schemaTable = conn.GetOleDbSchemaTable(System.Data.OleDb.OleDbSchemaGuid.Tables, null);
                string tableName = schemaTable.Rows[0][2].ToString().Trim();    //获取表名


                string strExcelSql = "";
                OleDbDataAdapter myCommand = null;
                DataSet ds = null;
                strExcelSql = "select * from [" + tableName + "]";     //strExcel="select * from [sheet1$]"; 
                myCommand = new OleDbDataAdapter(strExcelSql, strConn);
                ds = new DataSet();
                myCommand.Fill(ds, "table1");
                conn.Close();
                conn.Dispose();
                errorInfo = "";
                return ds;
            }
            catch (Exception ex)
            {
                errorInfo = ex.ToString();
                return null;
            }
        }

        static DataTable HisTableSchema()
        {
            DataTable dt = new DataTable();
            dt.Columns.AddRange(
                new DataColumn[]
                {
                    new DataColumn("Id",typeof(int)),
                    new DataColumn("Plate",typeof(string)),
                    new DataColumn("SimNo",typeof(string)),
                    new DataColumn("Deviceid",typeof(string)),
                    new DataColumn("DeviceType",typeof(string)),

                    new DataColumn("IpAddress",typeof(string)),
                    new DataColumn("WebPass",typeof(string)),
                    new DataColumn("FrameNo",typeof(string)),
                    new DataColumn("EngineNo",typeof(string)),
                    new DataColumn("VehicleColor",typeof(string)),
   
                    new DataColumn("OwnerName",typeof(string)),
                    new DataColumn("OwnerPhone",typeof(string)),
                    new DataColumn("OwnerAddress",typeof(string)),
                    new DataColumn("VehicleType",typeof(string)),
                    new DataColumn("CertificateNo",typeof(string)),
     
                    new DataColumn("ICCID",typeof(string)),
                    new DataColumn("InstallTime",typeof(string)),
                    new DataColumn("InstallPerson",typeof(string)),
                    new DataColumn("InstallPhone",typeof(string)),
                    new DataColumn("InstallAddress",typeof(string)),
   
                    new DataColumn("ContactName",typeof(string)),
                    new DataColumn("ContactPhone",typeof(string)),
                    new DataColumn("ActiveTime",typeof(string)),
                    new DataColumn("ServerEndTime",typeof(string)),
                    new DataColumn("Marks",typeof(string)),
   
                    new DataColumn("IsStore",typeof(string)),
                    new DataColumn("StoreUserID",typeof(string)),
                    new DataColumn("DelFlag",typeof(string)),
                    new DataColumn("State",typeof(string)),
                    new DataColumn("CreateTime",typeof(string)),

                    new DataColumn("UpdateTime",typeof(string)),
                    new DataColumn("plateColor",typeof(string)),
                    new DataColumn("VehicleGroupID",typeof(string))
    
                  
                });

            return dt;
        }
    }
}
