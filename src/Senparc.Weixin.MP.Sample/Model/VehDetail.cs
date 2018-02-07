using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
   public class VehDetail
    {
        public int vehicleId{get;set;}
        public string plate{get;set;}
        public string simNo { get; set; }
        public string deviceId { get; set; }
        public string deviceType { get; set; }

        public string webpass { get; set; }
        public string frameNo { get; set; }
        public string engineNo { get; set; }
        public string plateColor { get; set; }
        public string vehicleColor { get; set; }

        public string ownerName { get; set; }
        public string ownerPhone { get; set; }
        public string ownerAddress { get; set; }
        public string vehicleType { get; set; }
        public string certificateNo { get; set; }

        public string ICCID { get; set; }
        public string installTime { get; set; }
        public string installPhone { get; set; }
        public string installPerson { get; set; }
        public string installAddress { get; set; }

        public string contactName { get; set; }
        public string contactPhone { get; set; }
        public string marks { get; set; }
        public string activeTime { get; set; }
        public string serverEndTime { get; set; }

        public int vehGroupId{get;set;}
        public string vehGroupName { get; set; }
        public string ipAddress { get; set; }
        public int delFlag{get;set;}
        public int isStore{get;set;}

        public int storeUserID{get;set;}

 
      
    }
}
