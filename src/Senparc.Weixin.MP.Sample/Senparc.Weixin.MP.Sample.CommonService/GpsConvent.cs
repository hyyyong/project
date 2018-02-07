using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Senparc.Weixin.MP.Sample.CommonService
{
    class GpsConvent
    {
      

            private static double pi = 3.14159265358979324;
            private static double a = 6378245.0;
            private static double ee = 0.00669342162296594323;

            //纠偏    GPS转高德经纬度
            public static void transform(ref double wgLat, ref double wgLon)
            {
                double[] latlng = new double[2];
                if (outOfChina(wgLat, wgLon))
                {
                    // wgLat = wgLat;
                    //wgLon = wgLon;
                    return;
                }
                double dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
                double dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
                double radLat = wgLat / 180.0 * pi;
                double magic = Math.Sin(radLat);
                magic = 1 - ee * magic * magic;
                double sqrtMagic = Math.Sqrt(magic);
                dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
                dLon = (dLon * 180.0) / (a / sqrtMagic * Math.Cos(radLat) * pi);
                wgLat = wgLat + dLat;
                wgLon = wgLon + dLon;
                //return latlng;
            }


            public static void transformGoogleToWGS84(ref double wgLat, ref  double wgLon)
            {
                double wgLatNew = wgLat;
                double wgLonNew = wgLon;

                transform(ref wgLatNew, ref wgLonNew);
                wgLat = wgLat - (wgLatNew - wgLat);
                wgLon = wgLon - (wgLonNew - wgLon);

                //return latlngNew;
            }

            private static bool outOfChina(double lat, double lon)
            {
                if (lon < 72.004 || lon > 137.8347)
                    return true;
                if (lat < 0.8293 || lat > 55.8271)
                    return true;
                return false;
            }

            private static double transformLat(double x, double y)
            {
                double ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.Sqrt(Math.Abs(x));
                ret += (20.0 * Math.Sin(6.0 * x * pi) + 20.0 * Math.Sin(2.0 * x * pi)) * 2.0 / 3.0;
                ret += (20.0 * Math.Sin(y * pi) + 40.0 * Math.Sin(y / 3.0 * pi)) * 2.0 / 3.0;
                ret += (160.0 * Math.Sin(y / 12.0 * pi) + 320 * Math.Sin(y * pi / 30.0)) * 2.0 / 3.0;
                return ret;
            }

            private static double transformLon(double x, double y)
            {
                double ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.Sqrt(Math.Abs(x));
                ret += (20.0 * Math.Sin(6.0 * x * pi) + 20.0 * Math.Sin(2.0 * x * pi)) * 2.0 / 3.0;
                ret += (20.0 * Math.Sin(x * pi) + 40.0 * Math.Sin(x / 3.0 * pi)) * 2.0 / 3.0;
                ret += (150.0 * Math.Sin(x / 12.0 * pi) + 300.0 * Math.Sin(x / 30.0 * pi)) * 2.0 / 3.0;
                return ret;
            }
        
    }
}
