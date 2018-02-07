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
    public class AppSetController : ApiController
    {
       
        [HttpGet]
        [System.Web.Http.ActionName("getfence")]
        public object GetFance(int vehicleId)
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

        [HttpGet]
        [System.Web.Http.ActionName("setfence")]
        public object SetFance(int vehicleId, string radius, string lon, string lat,string fencetype, string name)
        {
            //设置围栏
            string info = "";
            if (M_AppSet.MSetFance(vehicleId, radius, lon, lat, fencetype, name))
            {
                return new Ret  { code = 0, msg = "围栏设置成功", obj = DBNull.Value };
            }
            else
            {
                return new Ret  { code = 1, msg = "围栏设置失败", obj = DBNull.Value };
            }
        }

        [HttpGet]
        [System.Web.Http.ActionName("deletefence")]
        public object DeleteFence(int vehicleId)
        {
            //删除围栏
            string info = "";
            if (M_AppSet.MDeleteFence(vehicleId))
            {
                return new Ret  { code = 0, msg = "删除围栏成功", obj = DBNull.Value };
            }
            else
            {
               return new Ret  { code = 1, msg = "删除围栏失败", obj = DBNull.Value };
            }
        }



        [HttpGet]
        [System.Web.Http.ActionName("pushwarnset")]
        public object PushWarnSet(int vehicleId, string alarmtype)
        {
            //推送报警等级设计 alarmtype 0警戒模式，1标准模式，2免打扰模式，3关闭通知，4寻车模式
            string info = "";
            if (M_AppSet.MPushWarnSet(vehicleId, alarmtype))
            {
                return new Ret  { code = 0, msg = "报警等级设置成功", obj = DBNull.Value };
            }
            else
            {
                return new Ret { code = 1, msg = "报警等级设置失败", obj = DBNull.Value };
            }
        }

        [HttpGet]
        [System.Web.Http.ActionName("pushwarntype")]
        public object PushWarnType(int vehicleId, string alarmtype, string isopen)
        {
            //推送报警类型设置  	0app,1微信，2电话
            string info = "";
            if (M_AppSet.MPushWarnType(vehicleId,  alarmtype,  isopen))
            {
                return new Ret  { code = 0, msg = "删除围栏成功", obj = DBNull.Value };
            }
            else
            {
                return new Ret  { code = 1, msg = "删除围栏失败", obj = DBNull.Value };
            }
        }

        [HttpGet]
        [System.Web.Http.ActionName("getpushwarnset")]
        public object GetPushWarnSet(int vehicleId, string alarmtype)
        {
            //获取报警推送等级和类型
            string info = "";
            if (M_AppSet.MGetPushWarnSet(vehicleId, alarmtype))
            {
                return new Ret  { code = 0, msg = "删除围栏成功", obj = DBNull.Value };
            }
            else
            {
                return new Ret  { code = 1, msg = "删除围栏失败", obj = DBNull.Value };
            }
        }
    }
}