using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
   public class AppBase
    {
    }

   public class APPVehList {
       public int vehicelId { get; set; }
       public string nickName { get; set; }
       public string plate { get; set; }
       public string phone { get; set; }
       public string venderPhone { get; set; }
       public string image { get; set; }
       public int isEquipment { get; set; }//是否绑定设备1：是  0：否
       public string voltage { get; set; }
       public string electricity { get; set; }
       public int charging { get; set; }//是否充电1：是  0：否
       public string dueDate { get; set; }
   }
}
