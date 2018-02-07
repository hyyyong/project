using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    class CurrentVehInfo
    {
    }

    public class PositionInfo
    {
        public int a { get; set; }          //车辆ID
        public string b { get; set; }       //SIm
        public string c { get; set; }       //车牌号
        public string d { get; set; }        //终端类型
        public int e { get; set; }           //车组ID
        public string f { get; set; }       //终端编号
        public string h { get; set; }       //终端时间
        public int p { get; set; }         //车辆状态(0：离线/1：行驶/2：停车/3：从未上线/4：报警5.过期)
        public string g { get; set; }      //车辆状态持续时间
        public string i { get; set; }       //经度
        public string j { get; set; }        //纬度
        public string k { get; set; }        //速度
        public string m { get; set; }       //方向 
        public string l { get; set; }       //报警信息 
        public int n { get; set; }         //定位(0：不定位，1：GPS，2：WIFI，3：多基站，4：单基站)

        public string o { get; set; }       //剩余电量，若车辆没有剩余电量则为空字符串
        public string EP { get; set; }       //过期时间
        public string NOW { get; set; }      //系统时间
    }
    /// <summary>
    /// 最后位置数据
    /// </summary>
    public class VehicleInfo
    {
        public int flag { get; set; }
        public string msg { get; set; }
        public PositionInfo obj { get; set; }
    }
}
