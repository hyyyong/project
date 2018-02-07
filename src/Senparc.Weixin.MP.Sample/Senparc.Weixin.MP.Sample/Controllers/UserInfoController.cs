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
    public class UserInfoController : BaseController
    {
        //登录获取微信id
        //[HttpPost]
        //[ActionName("Login")]
        public ActionResult Main()
        {
            return View();
        }

        //获取单个用户信息
        public JsonResult GetUserInfo(string userId, string token, int id)
        {
            UserInfo userList = new UserInfo();

            if (M_UserInfo.GetUser(id, out userList))
            {

                return Json(new { flag = 1, msg = "查询成功", obj = userList }, JsonRequestBehavior.AllowGet);

            }
            else
                return Json(new { flag = 0, msg = "查询数据库失败", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
        }

        //获取用户下所有的用户
        public JsonResult GetUserInfoList(string userId, string token, int id)
        {
            List<UserInfo> userList = new List<UserInfo>();

            if (M_UserInfo.GetUserList(id, out userList))
            {

                //var rows = userList.Skip(offset).Take(limit).ToList();
                var rows = userList.ToList();
                return Json(new { flag = 1, msg = "查询成功", obj = rows }, JsonRequestBehavior.AllowGet);

            }
            else
                return Json(new { flag = 0, msg = "查询数据库失败", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
        }


        public JsonResult AddUser(string userId, string token, string userName, string passWord, string code, string memo, string ownerName, string phone, int accountType, int fGroupID, string vehGroupID, string funcID)
        {
            int UserID = 0;
            switch (M_UserInfo.AddUser(userId, userName, passWord, code, memo, ownerName, phone, accountType, fGroupID, vehGroupID, funcID, out UserID))
            {
                case 0:
                    return Json(new { flag = 0, msg = "", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
                case 1:
                    return Json(new { flag = 1, msg = "添加成功", obj = UserID }, JsonRequestBehavior.AllowGet);
                default:
                    return Json(new { flag = 0, msg = "修改失败", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
            }

        }

        //修改用户资料
        public JsonResult EditUserInfo(int userId, string token, int id, string userName, string passWord, string code, string memo, string ownerName, string phone, string accountType)
        {
            string info = "";
            switch (M_UserInfo.EditUser(id, userName, passWord, code, memo, ownerName, phone, accountType, out info))
            {

                case 0:
                    return Json(new { flag = 0, msg = info, obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
                case 1:
                    return Json(new { flag = 1, msg = "修改成功", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);


                default:
                    return Json(new { flag = 0, msg = "修改失败", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult DelUser(string userID, string token, string id, string del)
        {
            switch (M_UserInfo.DelUser(id, userID))
            {
                case 0:
                    return Json(new { flag = 0, msg = "System用户是系统必需帐户，不允许删除！", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);

                case 1:
                    return Json(new { flag = 1, msg = "删除成功", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);

                default:
                    return Json(new { flag = 0, msg = "删除失败", obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult ChangePWD(int userId, string oldpwd, string newpwd)
        {
            string info = "";
            if (M_UserInfo.MChangePWD(userId, oldpwd, newpwd, out info))
            {
                return Json(new { flag = 1, msg = info, obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { flag = 0, msg = info, obj = DBNull.Value }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetDepartmentTwo(int limit, int offset, string userid)
        {
            var lstRes = new List<Department>();
            for (var i = 0; i < 50; i++)
            {
                var oModel = new Department();
                oModel.ID = Guid.NewGuid().ToString();
                oModel.Name = "销售部" + i;
                oModel.Level = i.ToString();
                oModel.Desc = "暂无描述信息";
                lstRes.Add(oModel);
            }

            var total = lstRes.Count;
            var rows = lstRes.Skip(offset).Take(limit).ToList();
            return Json(new { total = total, rows = rows }, JsonRequestBehavior.AllowGet);
        }



    }
}