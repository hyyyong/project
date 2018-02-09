using Manager;
using Model;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace Senparc.Weixin.MP.Sample.Controllers
{
    public class VehicleInfoController : BaseController
    {
        //获取用户以及子用户下的所有车组
        public JsonResult GetVehGroupList(string userId, string token, string id)
        {
            List<VehGroup> vehGroupList = null;

            if (M_Login.GetVehGroupList(id, out vehGroupList))
            {
                if (vehGroupList != null)
                {
                    var rows = vehGroupList.ToList();
                    return Json(new { flag = 1, msg = "查询成功", obj = rows }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { flag = 1, msg = "数据库中没有车组数据", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { flag = 0, msg = "查询数据库失败", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
        }

        //获取单用户绑定的车组
        public JsonResult GetVehGroupListSingle(string userId, string token, string id)
        {
            List<VehGroup> vehGroupList = null;

            if (M_Login.GetVehGroupListSingle(id, out vehGroupList))
            {
                if (vehGroupList != null)
                {
                    var rows = vehGroupList.ToList();
                    return Json(new { flag = 1, msg = "查询成功", obj = rows }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { flag = 1, msg = "数据库中没有车组数据", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { flag = 0, msg = "查询数据库失败", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetVehGroupDetail(string userId, string vehgroupID, string token)
        {
            VehGroupDetail vehGroup = null;

            if (M_VehicleInfo.GetVehGroupDetail(vehgroupID, out vehGroup))
            {
                if (vehGroup != null)
                {
                    // var rows = vehGroup.ToList();
                    return Json(new { flag = 1, msg = "查询成功", obj = vehGroup }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { flag = 1, msg = "数据库中没有车组数据", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { flag = 0, msg = "查询数据库失败", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
        }


        public JsonResult AddVehGroup(string userId, string token, string VehGroupName, string Contact, string phone, string mark, int fVehGroupID)
        {
            int vehGroupID = 0; string info = "";
            switch (M_VehicleInfo.AddVehGroup(userId, VehGroupName, Contact, phone, mark, fVehGroupID, out vehGroupID, out info))
            {

                case 1:
                    return Json(new { flag = 1, msg = info, obj = vehGroupID }, JsonRequestBehavior.AllowGet);

                default:
                    return Json(new { flag = 0, msg = info, obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
            }
        }


        public JsonResult EditVehGroup(string userId, string token, string VehGroupID, string VehGroupName, string Contact, string phone, string Mark, int fVehGroupID)
        {
            string info = "";
            switch (M_VehicleInfo.EditVehGroup(VehGroupID, VehGroupName, Contact, phone, Mark, fVehGroupID, out  info))
            {

                case 1:
                    return Json(new { flag = 1, msg = info, obj = VehGroupID }, JsonRequestBehavior.AllowGet);
                default:
                    return Json(new { flag = 0, msg = info, obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
            }
        }


        public JsonResult DelVehGroup(string userId, string token, string VehGroupID, string del)
        {
            string info = "";
            switch (M_VehicleInfo.DelVehGroup(VehGroupID, userId, out info))
            {
                case 1:
                    return Json(new { flag = 1, msg = info, obj = VehGroupID }, JsonRequestBehavior.AllowGet);
                default:
                    return Json(new { flag = 0, msg = info, obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
            }
        }



        public JsonResult GetVehicleDetail(string userId, string token, int vehicleId,int groupID, string type)
        {
            VehDetail vehDetail = null;
            if (M_VehicleInfo.GetVehDetail(vehicleId,groupID, out vehDetail))
            {
                if (vehDetail != null)
                    return Json(new { flag = 1, msg = "查询成功", obj = vehDetail }, JsonRequestBehavior.AllowGet);
                else
                    return Json(new { flag = 1, msg = "查询成功", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new { flag = 0, msg = "查询数据库失败", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetVehByGroupID(string userId, string token, int groupID)
        {
            List<VehList> vehList = null;
            if (M_VehicleInfo.GetVehFromGroupID(groupID, out vehList))
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

        public JsonResult AddVehicle(string userId, string token, string plate, string simNo, string deviceId, string deviceType, string webpass, string frameNo, string engineNo, string plateColor, string vehicleColor, string ownerName, string ownerPhone, string ownerAddress, string vehicleType, string certificateNo, string ICCID, string installTime, string installPhone, string installPerson, string installAddress, string contactName, string contactPhone, string marks, string activeTime, string serverEndTime, string vehGroupId)
        {
            string info = "";
            string result = "";
            int count = M_VehicleInfo.AddVehicle(userId, plate, simNo, deviceId, deviceType, webpass, frameNo, engineNo, plateColor, vehicleColor, ownerName, ownerPhone, ownerAddress, vehicleType, certificateNo, ICCID, installTime, installPhone, installPerson, installAddress, contactName, contactPhone, marks, activeTime, serverEndTime, vehGroupId, out info, out result);
            switch (count)
            {
                case 0:
                    return Json(new { flag = 0, msg = info, obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
                case 1:
                    return Json(new { flag = 1, msg = "新增成功", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
                default:
                    return Json(new { flag = 0, msg = "新增失败", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
            }
        }




        public JsonResult editVehicle(string userId, string token, int vehicleId, string plate, string simNo, string deviceId, string deviceType, string webpass, string frameNo, string engineNo, string plateColor, string vehicleColor, string ownerName, string ownerPhone, string ownerAddress, string vehicleType, string certificateNo, string ICCID, string installTime, string installPhone, string installPerson, string installAddress, string contactName, string contactPhone, string marks, string activeTime, string serverEndTime, string vehGroupId)
        {
            string info = "";
            int count = M_VehicleInfo.EditVehicle(vehicleId, userId, plate, simNo, deviceId, deviceType, webpass, frameNo, engineNo, plateColor, vehicleColor, ownerName, ownerPhone, ownerAddress, vehicleType, certificateNo, ICCID, installTime, installPhone, installPerson, installAddress, contactName, contactPhone, marks, activeTime, serverEndTime, vehGroupId, out info);
            switch (count)
            {
                case 0:
                    return Json(new { flag = 0, msg = info, obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
                case 1:
                    return Json(new { flag = 1, msg = "编辑成功", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
                default:
                    return Json(new { flag = 0, msg = "编辑失败", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult delVehicle(string userId, string token, int vehicleId, string del)
        {
            bool mbool = M_VehicleInfo.delVehicle(userId, vehicleId);
            if (mbool)
            {
                return Json(new { flag = 1, msg = "删除成功", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { flag = 0, msg = "删除失败", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);


            }
        }


        #region 批量导入
        public ActionResult BatchVeh(int userId, string token, int vehGroupID)
        {
            NameValueCollection nvc = System.Web.HttpContext.Current.Request.Form;
            HttpFileCollection hfc = System.Web.HttpContext.Current.Request.Files;
            int ID = 0;
            string info = "";
            string imgPath = "";
            if (hfc.Count > 0)
            {
                imgPath = "/testUpload" + hfc[0].FileName;
                string PhysicalPath = Server.MapPath(imgPath);
                hfc[0].SaveAs(PhysicalPath);
                if (M_BatchVeh.ReadAndInsert(userId,vehGroupID, PhysicalPath, out ID, out info))
                {
                    return Json(new { flag = 1, msg = info, obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { flag = 0, msg = info, obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
                }
            }
            //注意要写好后面的第二第三个参数  nvc.Get("Id")
            return Json(new { flag = 0, msg = "导入模板失败", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
        }

        #endregion

      
    }
}