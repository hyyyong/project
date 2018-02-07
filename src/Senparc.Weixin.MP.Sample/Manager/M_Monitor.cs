using Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manager
{
  public  class M_Monitor
    {
      public static bool GetVehListFromGroupID(int GroupID, out List<MVehicleInfo> vehicleList)
      {

          vehicleList = null;
          DBHelp dbhelp = new DBHelp();
          DataTable table;
          string sqlCmd = @"select Vehicle.id,Vehicle.plate,Vehicle.simNo,Vehicle.deviceId,Vehicle.deviceType,webpass,Vehicle.ownerName,Vehicle.ownerPhone,Vehicle.serverEndTime,VehGroupMain.vehGroupId,VehGroupMain.vehGroupName,Vehicle.ipAddress from Vehicle INNER JOIN VehicleDetail ON Vehicle.Id = VehicleDetail.VehID  INNER join VehGroupMain on VehGroupMain.VehGroupID=VehicleDetail.VehGroupID  where VehicleDetail.VehGroupID=" + GroupID + "  and (Vehicle.delflag=0 or Vehicle.DelFlag=null)";
          if (!dbhelp.QueryDataSet(SqlConfig.CONNECTION_STRING, sqlCmd, new SqlParameter[] { }, false, out table))
              return false;

          vehicleList = new List<MVehicleInfo>();
          if (table.Rows.Count == 0)
              return true;

          for (int i = 0; i < table.Rows.Count; i++)
          {
              MVehicleInfo veh = new MVehicleInfo();
              veh.A = Convert.ToInt32(table.Rows[i]["Id"]);
              veh.B = table.Rows[i]["deviceId"].ToString();
              veh.C = table.Rows[i]["plate"].ToString();
              veh.D = table.Rows[i]["deviceType"].ToString();
              veh.E = Convert.ToInt32(table.Rows[i]["vehGroupId"]);
              veh.F = table.Rows[i]["simNo"].ToString();
              veh.G = table.Rows[i]["vehGroupName"].ToString();
              veh.H = table.Rows[i]["ownerName"].ToString();
              veh.I = table.Rows[i]["ownerPhone"].ToString();
              vehicleList.Add(veh);
          }

          return true;
      }

    }
}
