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
    public class M_AppSet
    {
        public static bool MGetFance(int vehicleId, out Fence m_fance, out string info)
        {
            m_fance = new Fence();
            try
            {
                info = "";
                DBHelp dbhelp = new DBHelp();
                string sqlCmd = "select * from tab_vehicle_fence where vehid=@vehicleId";
                DataTable table;
                if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("vehicleId", vehicleId) }, false, out table))
                {
                    info = "查询数据库失败";
                    return false;
                }
                if (table.Rows.Count == 0)
                {
                    info = "车辆未绑定围栏";
                    return false;
                }
                if (table.Rows.Count > 0)
                {
                    m_fance.vehicleId = Convert.ToInt32(table.Rows[0]["vehid"].ToString());
                    m_fance.type = Convert.ToInt32(table.Rows[0]["type"].ToString());
                    m_fance.radius = Convert.ToInt32(table.Rows[0]["Radius"].ToString());
                    m_fance.name = table.Rows[0]["name"].ToString();
                    m_fance.lon = Convert.ToDouble(table.Rows[0]["Lon"].ToString());
                    m_fance.lat = Convert.ToDouble(table.Rows[0]["Lat"].ToString());
                    m_fance.oriLon = Convert.ToDouble(table.Rows[0]["OriLon"].ToString());
                    m_fance.oriLat = Convert.ToDouble(table.Rows[0]["OriLat"].ToString());
                    return true;
                }
                else
                {
                    info = "车辆未绑定围栏";
                    return false;
                }

            }
            catch (Exception ex)
            {
                info = "服务器错误";
                return false;
            }
        }

        public static bool  MSetFance(int vehicleID, string radius, string lon, string lat,string type, string name)
        {
           
            try
            {               
                DBHelp dbhelp = new DBHelp();           
                string sqlCmd = @"if not exists(select vehid from tab_vehicle_fence where vehid='" + vehicleID + "') begin INSERT INTO tab_vehicle_fence" +
                    "(vehid,name,type,radius,oriLon,oriLat,lon,lat,CreateTime,UpdateTime) Values " +
                    "('" + vehicleID + "','" + name + "','" + type + "','" + radius + "','" + lon + "','" + lat + "','" + lon + "','" + lat + "',getdate(),getdate()) end  else begin update tab_vehicle_fence set lon='" + lon + "',lat='" + lat + "',oriLon='" + lon + "',oriLat='" + lat + "',name='" + name + "',radius='" + radius + "',type='" + type + "' where  vehid='" + vehicleID + "' end";   
                if (!dbhelp.ExecuteNonQuery(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { }))
                {
                   
                    return false;
                }

               
                return true;
            }
            catch (Exception ex)
            {
               
                return false;
            }
        }


        public static bool MDeleteFence(int vehicleId)
        {           
            try
            {               
                DBHelp dbhelp = new DBHelp();             
                string sqlCmd = @"delete from tab_vehicle_fence where vehid=" + vehicleId ; 
                if (!dbhelp.ExecuteNonQuery(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { }))
                {                   
                    return false;
                }               
                return true;
            }
            catch (Exception ex)
            {
               
                return false;
            }
        }

        public static bool MPushWarnSet(int vehicleId, string alarmtype)
        {           
            try
            {
                var redis = Wdj.Redis.Helper.RedisHelper.StringService;
                redis.StringSet("AlarmGradeSet_" + vehicleId, "{\"vehId\":" + vehicleId + ",\"alarmtype\":" + alarmtype + ",\"isSet\":" + 0 + "}");
                return true;
            }
            catch (Exception ex)
            {
               
                return false;
            }
        }

        public static bool MPushWarnType(int vehicleId, string alarmtype, string isopen)
        {           
            try
            {               
                           
                return true;
            }
            catch (Exception ex)
            {
               
                return false;
            }
        }

        public static bool MGetPushWarnSet(int vehicleId, string alarmtype)
        {           
            try
            {               
                         
                return true;
            }
            catch (Exception ex)
            {
               
                return false;
            }
        }

        
        
    }
}
