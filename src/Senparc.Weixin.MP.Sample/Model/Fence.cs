using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
   public  class Fence
    {
       public int vehicleId { get; set; }
       public string name  { get; set; }
       public double lon { get; set; }
       public double lat { get; set; }
       public double oriLon { get; set; }
       public double oriLat { get; set; }
       public int radius { get; set; }
       public int type { get; set; }
    }
}
