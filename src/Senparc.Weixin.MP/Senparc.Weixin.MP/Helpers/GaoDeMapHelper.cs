using Senparc.Weixin.MP.Entities.GaoDeMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;

namespace Senparc.Weixin.MP.Helpers
{

    //图片
    //http://restapi.amap.com/v3/staticmap?markers=-1,http://ico.ooopic.com/ajax/iconpng/?id=158688.png,0:116.37359,39.92437&zoom=12&size=600*800&scale=1&key=56f66f3be229b34a277334c795d843d6

    //标注
    //http://restapi.amap.com/v3/staticmap?location=116.48482,39.94858&zoom=10&size=400*400&labels=%E6%9C%9D%E9%98%B3%E5%85%AC%E5%9B%AD,2,0,16,0xFFFFFF,0x008000:116.48482,39.94858&key=56f66f3be229b34a277334c795d843d6
    public static class GaoDeMapHelper
    {
        //public static readonly string VehImage = WebConfigurationManager.AppSettings["VehImage"];//与微信公众账号后台的AppId设置保持一致，区分大小写。
        public static readonly string key = WebConfigurationManager.AppSettings["GaoDeMapKey"];//与微信公众账号后台的AppId设置保持一致，区分大小写。
        public static string GetGaoDeStaticMap(int scale, GaoDeMapMarker markersList, string size, int zoom, string imageType)
        {
            //return "http://restapi.amap.com/v3/staticmap?markers=-1,http://ico.ooopic.com/ajax/iconpng/?id=158688.png,0:116.37359,39.92437&zoom=12&size=600*800&scale=1&key=56f66f3be229b34a277334c795d843d6";
            string image = "http://" + HttpContext.Current.Request.Url.Host + @"/Images/Image/" + imageType;

          

            string parameters = string.Format("zoom={0}&size={1}&markers=-1,{2},0:{3},{4}&key={5}", zoom, size, image, markersList.X, markersList.Y, key);
            string url = "http://restapi.amap.com/v3/staticmap?" + parameters;
            return url;
        }

    }
}
