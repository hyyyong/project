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
    public class AppBingVehController : ApiController
    {
       
        [HttpGet]
        [System.Web.Http.ActionName("bingVeh")]
        public object bingVeh(int vehicleId)
        {
            //获取围栏
            Fence fence= null;
            string info = "";
            if (M_AppSet.MGetFance(vehicleId,out fence, out info))
            {

                return new Ret { code = 0, msg = "获取围栏成功", obj = fence };
            }
            else
            {
                 return new Ret  {code = 1, msg = "获取围栏失败", obj = DBNull.Value };
            }
        }
     
    }
}