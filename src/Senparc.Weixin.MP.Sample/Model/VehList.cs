using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
   public class VehList
    {
        public int vehicleId { get; set; }
        public string plate { get; set; }
        public string simNo { get; set; }
        public string deviceId { get; set; }
        public string deviceType { get; set; }
        public string webpass { get; set; }       
        public string ownerName { get; set; }
        public string ownerPhone { get; set; }  
        //public string installTime { get; set; }
        //public string activeTime { get; set; }
        public string serverEndTime { get; set; }
        public int vehGroupId { get; set; }
        public string vehGroupName { get; set; }
        public string ipAddress { get; set; }   
    }
}
