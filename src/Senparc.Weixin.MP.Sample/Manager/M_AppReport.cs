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
    public class M_AppReport
    {

        public static bool MGetMileage(int vehicleId, out Mileage mileage, out string info)
        {
            mileage = new Mileage();
            try
            {
                info = "";
                //DBHelp dbhelp = new DBHelp();
                //string sqlCmd = "select * from tab_vehicle_fence where vehid=@vehicleId";
                //DataTable table;
                //if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("vehicleId", vehicleId) }, false, out table))
                //{
                //    info = "查询数据库失败";
                //    return false;
                //}
                //if (table.Rows.Count == 0)
                //{
                //    info = "车辆未绑定围栏";
                //    return false;
                //}
                //if (table.Rows.Count > 0)
                //{

                //    return true;
                //}
                //else
                //{
                //    info = "车辆未绑定围栏";
                //    return false;
                //}

                mileage = new Mileage();
                mileage.alarm = new List<Alarmobject>();
                mileage.histoty = new List<Histotyobject>();
                mileage.nums = 4;
                for (int m = 0; m < 4; m++)
                {
                    Alarmobject alarmobj = new Alarmobject();
                    List<DayA> listdaya = new List<DayA>();                 
                    for (int i = 0; i < 4; i++)
                    {
                        DayA daya = new DayA();
                        daya.a1 = new Am() { num = i + 1, alarmtime = DateTime.Now.AddDays(m).ToString("yyyy-MM-dd HH:mm:ss"), alarmtype = "报警类型" };
                        daya.a2 = new Am() { num = i + 2, alarmtime = DateTime.Now.AddDays(m).ToString("yyyy-MM-dd HH:mm:ss"), alarmtype = "报警类型" };
                        daya.a3 = new Am() { num = i + 3, alarmtime = DateTime.Now.AddDays(m).ToString("yyyy-MM-dd HH:mm:ss"), alarmtype = "报警类型" };
                        daya.a4 = new Am() { num = i + 4, alarmtime = DateTime.Now.AddDays(m).ToString("yyyy-MM-dd HH:mm:ss"), alarmtype = "报警类型" };
                        daya.a5= new Am() { num = i + 5, alarmtime = DateTime.Now.AddDays(m).ToString("yyyy-MM-dd HH:mm:ss"), alarmtype = "报警类型" };
                        listdaya.Add(daya);
                    }
                    alarmobj.daya = listdaya;
                    alarmobj.title = DateTime.Now.AddDays(m).ToString("yyyy-MM-dd");
                    mileage.alarm.Add(alarmobj);
                }
                for (int n = 0; n < 4; n++)
                {
                    Histotyobject historyobj = new Histotyobject();
                    List<DayH> listdayh = new List<DayH>();                  
                    for (int j = 0; j < 4; j++)
                    {
                        DayH dayh = new DayH();
                        dayh.speed = 60;
                        dayh.mileage = 20.3;
                        dayh.lat = 23.45678;
                        dayh.lon = 114.1234;
                        dayh.stime = DateTime.Now.AddDays(n).ToString("yyyy-MM-dd 08:00:00");
                        dayh.etime = DateTime.Now.AddDays(n).ToString("yyyy-MM-dd 20:00:00");
                        listdayh.Add(dayh);
                    }
                    historyobj.dayh = listdayh;
                    historyobj.title = DateTime.Now.AddDays(n).ToString("yyyy-MM-dd");
                    mileage.histoty.Add(historyobj);
                }



               
                return true;

            }
            catch (Exception ex)
            {
                info = "服务器错误";
                return false;
            }
        }

        public static bool MGetAlarmDetail(int vehicleId,string time, out List<APPAlarmDetail> appAlarmDetail, out string info)
        {
            appAlarmDetail = new List<APPAlarmDetail>();
            try
            {
                info = "";
                //DBHelp dbhelp = new DBHelp();
                //string sqlCmd = "select * from tab_vehicle_fence where vehid=@vehicleId";
                //DataTable table;
                //if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { new SqlParameter("vehicleId", vehicleId) }, false, out table))
                //{
                //    info = "查询数据库失败";
                //    return false;
                //}
                //if (table.Rows.Count == 0)
                //{
                //    info = "车辆未绑定围栏";
                //    return false;
                //}
                //if (table.Rows.Count > 0)
                //{

                //    return true;
                //}
                //else
                //{
                //    info = "车辆未绑定围栏";
                //    return false;
                //}              


                for (int n = 0; n < 4; n++)
                {
                    APPAlarmDetail m_APPAlarmDetail = new APPAlarmDetail();
                    m_APPAlarmDetail.alarmType = "超速报警";
                    m_APPAlarmDetail.lon = 114.1234;
                    m_APPAlarmDetail.lat = 23.4567;
                    m_APPAlarmDetail.time = time;
                    appAlarmDetail.Add(m_APPAlarmDetail);
                }

                return true;

            }
            catch (Exception ex)
            {
                info = "服务器错误";
                return false;
            }
        }
        
    }
}
