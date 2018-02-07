using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Senparc.Weixin.MP.Entities.GaoDeMap
{
    /// <summary>
    /// 标记大小
    /// </summary>
    public enum GaoDeMapMarkerSize
    {
        Default = mid,
        small = 0, mid = 1, large = 2
    }
    //http://restapi.amap.com/v3/staticmap?markers=-1,http://ico.ooopic.com/ajax/iconpng/?id=158688.png,0:116.37359,39.92437&zoom=12&size=600*800&scale=1&key=56f66f3be229b34a277334c795d843d6
    public class GaoDeMapMarker
    {
        /// <summary>
        /// （可选）指定集合 {tiny, mid, small} 中的标记大小。如果未设置 size 参数，标记将以其默认（常规）大小显示。
        /// </summary>
        //public GaoDeMapMarkerSize Size { get; set; }
        /// <summary>
        /// （可选）指定 24 位颜色（例如 color=0xFFFFCC）或集合 {black, brown, green, purple, yellow, blue, gray, orange, red, white} 中预定义的一种颜色。
        /// </summary>
       // public string Color { get; set; }
        /// <summary>
        /// （可选）指定集合 {A-Z, 0-9} 中的一个大写字母数字字符。
        /// </summary>
        //public string Label { get; set; }
        /// <summary>
        /// 经度longitude
        /// </summary>
        public double X { get; set; }
        /// <summary>
        /// 纬度latitude
        /// </summary>
        public double Y { get; set; }

        ///// <summary>
        ///// 地图缩放等级
        ///// </summary>
        //public int Zoom { get; set; }

        ///// <summary>
        ///// 1:返回普通图；2:调用高清图，图片高度和宽度都增加一倍，zoom也增加一倍（当zoom为最大值时，zoom不再改变）。
        ///// </summary>
        //public int Scale { get; set; }
    }
  
}
