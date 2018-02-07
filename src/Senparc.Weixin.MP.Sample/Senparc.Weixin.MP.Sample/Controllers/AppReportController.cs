using GpsWebApI;
using Manager;
using Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Senparc.Weixin.MP.Sample.Controllers
{
    public class AppReportController : ApiController
    {       
        [HttpGet]
        [System.Web.Http.ActionName("mileage")]
        public object GetMileage(int userId,int vehicleId)
        {
            //获取围栏
            Mileage mileage = null;
            string info = "";
            if (M_AppReport.MGetMileage(vehicleId, out mileage, out info))
            {

                return new Ret { code = 0, msg = "查询成功", obj = mileage };
            }
            else
            {
                 return new Ret  {code = 1, msg = "查询失败", obj = DBNull.Value };
            }
        }



        [HttpGet]
        [System.Web.Http.ActionName("alarmdetail")]
        public object GetAlarmDetail( int vehicleId ,string time )
        {
            //获取围栏

            List<APPAlarmDetail> appAlarmDetail = new List<APPAlarmDetail>();
           
            string info = "";
            if (M_AppReport.MGetAlarmDetail(vehicleId,time, out appAlarmDetail, out info))
            {

                return new Ret { code = 0, msg = "查询成功", obj = appAlarmDetail };
            }
            else
            {
                return new Ret { code = 1, msg = "查询失败", obj = DBNull.Value };
            }
        }
     
    }
}