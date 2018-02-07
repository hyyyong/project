using Manager;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;

namespace Senparc.Weixin.MP.Sample.Controllers
{
    public class MonitorController : Controller
    {
        public JsonResult GetVehListByGroupID(string userId, string token, int groupID)
        {
            List<MVehicleInfo> vehList = null;
            if (M_Monitor.GetVehListFromGroupID(groupID, out vehList))
            {
                if (vehList.Count > 0)
                    return Json(new { flag = 1, msg = "查询成功", obj = vehList.ToList() }, JsonRequestBehavior.AllowGet);
                else
                    return Json(new { flag = 1, msg = "查询成功", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { flag = 0, msg = "查询数据库失败", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}