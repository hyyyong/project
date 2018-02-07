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
    public class AppBaseController : ApiController
    {
        //车用验证  
        [HttpGet]
        [System.Web.Http.ActionName("getcheck")]
        public object GetCheck(string codeString)
        {
            
            string info = "";
            if (M_AppBase.MGetCheck(codeString, out info))
            {
               return new Ret  { code = 0, msg = "设备存在", obj = DBNull.Value };
            }
            else
            {
                return new Ret { code = 1, msg = info, obj = DBNull.Value };
            }
        }


        [HttpGet]
        [System.Web.Http.ActionName("upgradeApp")]
        public object GetUpgradeApp(string appType)
        {

            string info = "";
            if (M_AppBase.MGetUpgradeApp(appType, out info))
            {
                return new Ret { code = 0, msg = "存在", obj = DBNull.Value };
            }
            else
            {
                return new Ret { code = 1, msg = info, obj = DBNull.Value };
            }
        }
  
        ////添加车辆
        //[HttpPost]
        //[System.Web.Http.ActionName("addVehicel")]
        //public object AppAddVehicel(int userId, string brand,string frameNo, string codeString, string engineNo, string image, string nickName,string mark, string phone, string plate, string vehicleType, string venderPhone)
        //{
        //    string filePath = System.Web.HttpContext.Current.Request.Url.Host + "/Content/image" + userId + Guid.NewGuid().ToString() + ".png";
        //    string info = "";            
        //    if (M_AppBase.MAppAddVehicel( userId, brand, frameNo, codeString, engineNo, image, nickName, mark, phone, plate,  vehicleType,  venderPhone,filePath, out info))
        //    {
        //        return new Ret  { code = 0, msg = "添加成功", obj = DBNull.Value };
        //    }
        //    else
        //    {
        //        return new Ret  { code = 1, msg = "下发失败", obj = DBNull.Value };
        //    }
        //}


        //添加车辆
        [HttpPost]
        [System.Web.Http.ActionName("addVehicel")]
        public object AppAddVehicel(Tb_Vehicel temp)
        {
            string filePath = System.Web.HttpContext.Current.Request.Url.Host + "/Content/image" + Convert.ToInt32(temp.userId) + Guid.NewGuid().ToString() + ".png";
            string info = "";
            if (M_AppBase.MAppAddVehicel(temp.userId, temp.brand, temp.frameNo, temp.codeString, temp.engineNo, temp.image, temp.nickName, temp.mark, temp.phone, temp.plate, temp.vehicleType, temp.venderPhone, filePath, out info))
            {
                return new Ret { code = 0, msg = "添加成功", obj = DBNull.Value };
            }
            else
            {
                return new Ret { code = 1, msg = "下发失败", obj = DBNull.Value };
            }
        }





        
        [HttpGet]
        [System.Web.Http.ActionName("getVehicle")]
        public object GetVehicle(int userId)
        {
            //获取绑定车辆资料
            List<APPVehList> vehicleList = null;
            if (M_AppBase.MGetVehicle(userId, out vehicleList))
            {
                return new Ret { code = 0, msg = "获取数据成功", obj = vehicleList };
            }
            else
            {
                return new Ret { code = 1, msg = "获取数据失败", obj = DBNull.Value };
            }
        }


        [HttpGet]
        [System.Web.Http.ActionName("bindVehicle")]
        public object BindVehicle(int userId, int vehicleId, string codeString)
        {
            //获取绑定车辆资料
            string info = "";
            if (M_AppBase.MBindVehicle(userId,  vehicleId,  codeString, out info))
            {
                return new Ret { code = 0, msg = "获取数据成功", obj = DBNull.Value };
            }
            else
            {
                return new Ret { code = 1, msg = "获取数据失败", obj = DBNull.Value };
            }
        }
    }
    public class Tb_Vehicel { 
        public int userId{get;set;}
        public string brand{get;set;}
        public string frameNo{get;set;}
        public string codeString{get;set;}
        public string engineNo{get;set;}
        public string image{get;set;}
        public string nickName{get;set;}
        public string mark{get;set;}
        public string phone{get;set;}
        public string plate{get;set;}
        public string vehicleType{get;set;}
        public string venderPhone { get; set; }
    }
}