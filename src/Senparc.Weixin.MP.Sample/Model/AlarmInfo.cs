using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    /// <summary>
    /// 报警信息
    /// </summary>
    public class AlarmInfo
    {
        public int flag { get; set; }
        public string msg { get; set; }
        public List<AlarmDataInfo> obj { get; set; }
    }

    public class AlarmDataInfo
    {
        public string id { get; set; }       //SIm
        public string alarmId { get; set; }       //SIm
        public string directBegin { get; set; }       //车牌号
        public string directEnd { get; set; }        //终端类型
        public string groupId { get; set; }           //车组ID
        public string groupName { get; set; }       //终端编号
        public string latBegin { get; set; }       //终端时间
        public string lonBegin { get; set; }         //车辆状态(0：离线/1：行驶/2：停车/3：从未上线/4：报警5.过期)
        public string mileageBegin { get; set; }      //车辆状态持续时间
        public string mileageEnd { get; set; }       //经度
        public string plate { get; set; }        //纬度
        public string speedBegin { get; set; }        //速度
        public string speedEnd { get; set; }       //报警信息 
        public string timeBegin { get; set; }        //纬度
        public string timeEnd { get; set; }        //纬度
        public string type { get; set; }        //速度
        public string vehicleId { get; set; }       //报警信息 
    }
}
