using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
   public class Mileage
    {
       public int nums { get; set; }
       public List<Alarmobject> alarm{get;set;}
       public List<Histotyobject> histoty { get; set; }
    }

   public class Alarmobject {
       public List<DayA> daya { get; set; }
       public string title { get; set; }
   }

   public class Histotyobject {
       public List<DayH> dayh { get; set; }
       public string title { get; set; }
   }


    public class DayA
    {
        public Am a1 { get; set; }
        public Am a2 { get; set; }
        public Am a3 { get; set; }
        public Am a4 { get; set; }
        public Am a5 { get; set; }
    
    }

    public class Am 
    {
        public int num { get; set; }
        public string alarmtype { get; set; }
        public string alarmtime { get; set; }
    }

    public class DayH
    {
        public string etime { get; set; }
        public string stime { get; set; }
        public string suntime { get; set; }
        public double mileage { get; set; }
        public int speed { get; set; }
        public double lon { get; set; }
        public double lat { get; set; }
    }
}
