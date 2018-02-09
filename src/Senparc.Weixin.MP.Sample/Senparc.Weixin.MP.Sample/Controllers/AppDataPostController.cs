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
    public class AppDataPostController : Controller
    {
        public JsonResult AppAddVehicel(int userId, string brand, string frameNo, string codeString, string engineNo, string image, string nickName, string mark, string phone, string plate, string vehicleType, string venderPhone)
        {
            string filePath = System.Web.HttpContext.Current.Request.Url.Host + "/Content/image" + userId + Guid.NewGuid().ToString() + ".png";
            string info = "";
            if (M_AppBase.MAppAddVehicel(userId, brand, frameNo, codeString, engineNo, image, nickName, mark, phone, plate, vehicleType, venderPhone, filePath, out info))
            {
                return Json(new { code = 0, msg = info, obj = DBNull.Value }, JsonRequestBehavior.AllowGet);

            }
            else
            {
                return Json(new { code = 1, msg = info, obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}