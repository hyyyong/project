//创建一个地图InfoWindow
var infoWindow = null;
function initialize() {
    map = new AMap.Map("map", {
        //center: new AMap.LngLat(116.397428, 39.90923), //地图中心点  
        //zoom: 12,  //地图显示的缩放级别  
        resizeEnable: true
    });
    //toolbar
    map.plugin(["AMap.ToolBar"], function () {
        var toolBar = new AMap.ToolBar();
        toolBar.setOffset(new AMap.Pixel(10, 38));

        map.addControl(toolBar);

    });
    //鹰眼
    map.plugin(["AMap.OverView"], function () {
        var view = new AMap.OverView();
        view.open();
        map.addControl(view);
    });

    //比例尺
    map.plugin(["AMap.MapType"], function () {
        //地图类型切换
        var type = new AMap.MapType({
            defaultType: 0, //使用2D地图
            showRoad: true
        });
        map.addControl(type);
    });
    AMap.event.addListener(map, 'resize', function () {
        $(".amap-copyright").removeAttr("style");
    });

    infoWindow = new AMap.InfoWindow({
        size: new AMap.Size(300, 0),
        offset: new AMap.Pixel(-10, -15)//-113, -140 
    });

}
