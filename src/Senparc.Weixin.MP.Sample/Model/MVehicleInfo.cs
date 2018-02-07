using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
   public  class MVehicleInfo
    {
        public int A { get; set; }//车辆id
        public string B{ get; set; }//deviceID
        public string C { get; set; }//车牌
        public string D{ get; set; }//车辆类型
        public int E { get; set; }//车组 vehGroup

        public string F { get; set; }//simNo
        public string G { get; set; }//vehGroupName
        public string H { get; set; }//ownerName
        public string I { get; set; }//ownerPhone
        
    }
}
