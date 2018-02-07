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
    public class AppCmdController : ApiController
    {
        [HttpGet]
        [System.Web.Http.ActionName("instructionSet")]
        public object InstructionSet(int vehicleId, string cmdtype)
        {
            try
            {
                Random rd = new Random();
                var redis = Wdj.Redis.Helper.RedisHelper.StringService;
                var serialNumber = "CMD" + DateTime.Now.Ticks + rd.Next(1000, 9999).ToString();
                redis.MsgPublish("InstructionCmd", "{\"vehId\":" + vehicleId + ",\"cmdtype\":" + cmdtype + ",\"serialNumber\":" + serialNumber + "}");
                return new Ret { code = 0, msg = "下发成功", obj = new { serialNumber = serialNumber } };
            }
            catch (Exception ex)
            {
                return new Ret { code = 1, msg = "下发失败", obj = DBNull.Value };
            }
        }

        [HttpGet]
        [System.Web.Http.ActionName("instructionState")]
        public object InstructionState(int vehicleId, string serialNumber)
        {
            var redis = Wdj.Redis.Helper.RedisHelper.StringService;
            if (redis.KeyExists(serialNumber))
            {
                var returnData = redis.StringGet(serialNumber);
                return new Ret { code = 0, msg = "查询到数据", obj = returnData  };
            } 
            return new Ret{ code = 1, msg = "没有返回数据", obj = DBNull.Value };
          
        }
    }
}