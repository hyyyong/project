//初始化地图
var map = null;
var mouseTool = null;
var marker = null;
var markerCph = null;
var infoWindow = null;
var m_ICON_RED = new Array();
var m_ICON_GREEN = new Array();
var m_ICON_GRAY = new Array();

var AreaArr = new Array();
var NodeArr = new Array();
var POIArr = new Array();
var LineArr = new Array();

var alarmRed = false; //报警显示红色

var statusZIndex = 11; //鼠标移动到状态图标上后，显示该图标，并且将该图标移动到上面

var lastClickTr = null; //上次点击的点标记
var lastClickTime = null; //上次点击的时间标记

var LocationMarker = null;//table点击后在地图上标记一个点标签

function initMap() {
    map = new AMap.Map("map", {
        //center: new AMap.LngLat(116.397428, 39.90923), //地图中心点  
        //zoom: 12,  //地图显示的缩放级别  
        resizeEnable: true
    });
    //比例尺
    map.plugin(["AMap.ToolBar"], function () {
        var toolBar = new AMap.ToolBar();
        toolBar.setOffset(new AMap.Pixel(10, 38));
        map.addControl(toolBar);
    });
    //鹰眼
    map.plugin(["AMap.OverView"], function () {
        var view = new AMap.OverView();
        map.addControl(view);
    });

    //地图类型
    //map.plugin(["AMap.MapType"], function () {
    //    //地图类型切换
    //     var type = new AMap.MapType({
    //        defaultType: 0, //使用2D地图
    //        showRoad: true
    //    });
    //    map.addControl(type);
    //});
    AMap.event.addListener(map, 'resize', function () {
        $(".amap-copyright").removeAttr("style");
    });

}

//**************************工具栏操作***************************************/
//默认
function theDefault() {
    if (mouseTool != null) {
        mouseTool.close(true);
    }
    map.setDefaultCursor("pointer");
}
//测距
function range() {
    if (mouseTool != null) {
        mouseTool.close(true);
    }
    map.setDefaultCursor("default");
    map.plugin(["AMap.RangingTool"], function () {
        var ruler = new AMap.RangingTool(map);
        ruler.turnOn();
        AMap.event.addListener(ruler, "end", function (e) {
            ruler.turnOff();
        });
    });
};
//将所有的轨迹点显示或者隐藏
function showAllPoint(flag) {
    for (var i = 0; i < arrowList.length; i++) {
        if (flag) {
            arrowList[i].setMap(map);
        }
        else {
            arrowList[i].setMap();
        }
    }
}

//将所有的时间点显示或者隐藏
function showAllTime(flag) {
    for (var i = 0; i < timeList.length; i++) {
        if (flag) {
            timeList[i].setMap(map);
        }
        else {
            timeList[i].setMap();
        }
    }
}

//报警显示红色
function alarmRedLine() {
    if (mouseTool != null) {
        mouseTool.close(true);
    }
    map.setDefaultCursor("default");
    if (!alarmRed) {
        alarmRed = true;
        $("#alarmRedLine").text("取消报警显红色");
    }
    else {
        alarmRed = false;
        $("#alarmRedLine").text("报警显红色");
    }
}

function getRealLen(str) {
    return str.replace(/[^\x00-\xff]/g, '__').length; //这个把所有双字节的都给匹配进去了
}
//添加线覆盖物
function addLine(lineArr, name, point) {
    var polyline = new AMap.Polyline({
        path: lineArr, //设置线覆盖物路径   
        strokeColor: "#44AEFF", //线颜色   
        strokeOpacity: 1,  //线透明度    
        strokeWeight: 4, //线宽   
        outlineColor: "#14578A",
        isOutline: true,
        strokeStyle: "solid", //线样式  
        strokeDasharray: [10, 5]//补充线样式    
    });

    var length = (getRealLen(name) * 13 + 20);
    if (length < 80)
        length = 80;
    var info = "<div style='cursor:pointer;height:18px;width:" + length + "px;  '>"
               + " <div style=' height:18px; color:White;border-left:1px solid #2E7417;border-bottom:1px solid #2E7417;"
               + "border-top-left-radius:5px;border-bottom-left-radius:5px;"
               + "border-top:1px solid #2E7417; text-align:center; float:left; background-color:#12B612;'>"
               + " <label style='text-align:center; margin:0 5px 0 5px;  width:20px;'>线路</label>"
               + "</div>"
               + "<div style=' height:18px; float:left;display:inline;border-right:1px solid #2E7417;"
               + "border-top:1px solid #2E7417;border-bottom:1px solid #2E7417;border-top-right-radius:5px;border-bottom-right-radius:5px;"
               + "background-color:white;'>"
               + "<label style='text-align:center; text-align:center; margin:0px 5px 0 5px  '>" + name + "</label></div></div>";

    var infoMarker = new AMap.Marker({
        content: info,
        position: point,
        offset: new AMap.Pixel(-50, 0)
    });
    AMap.event.addListener(polyline, 'mousemove', function (e) {
        infoMarker.setMap(map);
        //infoMarker.setPosition(e.lnglat);
    });
    AMap.event.addListener(polyline, 'mouseout', function (e) {
        infoMarker.setMap(null);
    });
    polyline.setMap(map);
    var obj = new Object();
    obj.polyline = polyline;
    obj.infoMarker = infoMarker;
    LineArr.push(obj);
}

//画位置点
function addMarker(point, name, type) {
    var src = "../../Images/Map/POI/工厂.png";
    //    type = type + "";
    switch (type) {
        case "工厂":
            src = "../../Images/Map/POI/工厂.png";
            break;
        case "工地":
            src = "../../Images/Map/POI/工地.png";
            break;
        case "停车场":
            src = "../../Images/Map/POI/停车场.png";
            break;
        case "写字楼":
            src = "../../Images/Map/POI/写字楼.png";
            break;
        case "住宅":
            src = "../../Images/Map/POI/住宅.png";
            break;
    }
    var marker = new AMap.Marker({
        icon: new AMap.Icon({
            size: new AMap.Size(40, 40), //图标大小
            image: src
        }),
        position: point,
        offset: new AMap.Pixel(-20, -40)
    });

    var length = (getRealLen(name) * 13 + 60);
    if (length < 80)
        length = 80;
    var info = "<div style='cursor:pointer;height:18px;width:" + length + "px;  '>"
               + " <div style=' height:18px; color:White;border-left:1px solid #2E7417;border-bottom:1px solid #2E7417;"
               + "border-top-left-radius:5px;border-bottom-left-radius:5px;"
               + "border-top:1px solid #2E7417; text-align:center; float:left; background-color:#3F63A3;'>"
               + " <label style='text-align:center; margin:0 5px 0 5px;  width:30px;'>位置点</label>"
               + "</div>"
               + "<div style=' height:18px; float:left;display:inline;border-right:1px solid #2E7417;"
               + "border-top:1px solid #2E7417;border-bottom:1px solid #2E7417;border-top-right-radius:5px;border-bottom-right-radius:5px;"
               + "background-color:white;'>"
               + "<label style='text-align:center; text-align:center; margin:0px 5px 0 5px  '>" + name + "</label></div></div>";

    var infoMarker = new AMap.Marker({
        content: info,
        position: point,
        offset: new AMap.Pixel(20, -35)
    });
    AMap.event.addListener(marker, 'mousemove', function (e) {
        infoMarker.setMap(map);
        //infoMarker.setPosition(e.lnglat);
    });
    AMap.event.addListener(marker, 'mouseout', function (e) {
        infoMarker.setMap(null);
    });
    marker.setMap(map);  //在地图上添加点
    var obj = new Object();
    obj.marker = marker;
    obj.infoMarker = infoMarker;
    POIArr.push(obj);
}

//**************************地图图标***************************************/

//创建地图Maker
function createMapMarker(angle, state, lng, lat, cph) {

    marker = new AMap.Marker({
        icon: new AMap.Icon({
            size: new AMap.Size(40, 40), //图标大小
            image: "../../Images/car/Travel1.png"
        }),

        position: new AMap.LngLat(lng, lat),
        offset: new AMap.Pixel(-10, -20),
        zIndex: 100
    });
    marker.setMap(map);



    markerCph = new AMap.Marker({
        // cursor: 'pointer',
        position: new AMap.LngLat(lng, lat),
        offset: new AMap.Pixel(-30, 10),
        content: '<div style="width:80px;background-color:#6296DD;border:1px solid #0026ff;height: 18px;text-align:center;font-size:14px;">' + cph + '</div>',   //自定义点标记覆盖物内容
    });
    markerCph.setMap(map);
}

//设置位置方向
function createTraPoint(index, angle, lng, lat) {
    var mk = new AMap.Marker({
        icon: new AMap.Icon({
            image: "../../Images/Map/arrow.png"
        }),
        position: new AMap.LngLat(lng, lat),
        //        offset: new AMap.Pixel(-10, -20),
        angle: angle,
        zIndex: 2
    });
    if (angle > 90 && angle < 270) {
        mk.setOffset(new AMap.Pixel(-25, -20));
    }
    else {
        mk.setOffset(new AMap.Pixel(-10, -20));
    }
    arrowList.push(mk);
    if (blnShowPoint) {
        mk.setMap(map);
    }
    AMap.event.addListener(mk, 'click', function () {//点击时数据列表显示当前列
        //鼠标点击marker弹出自定义的信息窗体
        if (lastClickTr != null) {//恢复上一次点击列
            $(lastClickTr).removeAttr("style");
            $($(lastClickTr)[0].children[0]).removeAttr("style");
        }
        if (lastClickTime != null) {//恢复上一次点击列
            $(lastClickTime).removeAttr("style");
            $($(lastClickTime)[0].children[0]).removeAttr("style");
        }
        var currentClickTr = $(historyTable)[0].children[1].children[index];
        //    $($(currentTr).children[0]).css({ "background-color": "red" });
        var h = currentClickTr.offsetTop;
        $($("#historyDt")[0].parentNode).animate({ scrollTop: h }, 1000, function () {
            $($(currentClickTr)[0].children[0]).css({ "background-color": "#84B3EA" })
            $(currentClickTr).css({ "background-color": "#84B3EA" });
        });
        //        $($("#historyDt")[0].parentNode).scrollTop(h);

        //        $("html,body").animate({ scrollTop: $("#qy_name").offset().top }, 1000);

        lastClickTr = currentClickTr; //记录点击列，下次清空此列状态
    });
}

//设置轨迹点时间
var infoMarker;
function createPointTime(index, lng, lat, time) {
    //    alert(time + "   " + time.length);
    var length = (getRealLen(time) * 8 + 10);
    if (length < 80)
        length = 80;
    var info = "<div style='cursor:pointer;height:18px;border:1px solid #184BA7;width:" + length + "px;  background-color:white;"
               + "  -webkit-border-radius: 5px; -moz-border-radius:5px; '>"
               + " <div style=' height:18px; color:White; text-align:center; float:left; background-color:#3F63A3;'>"
               + " <label style='text-align:center; margin:0 5px 0 5px;     '> 时间 </label>"
               + "</div>"
               + "<div style=' height:18px; float:left; text-align:center; margin:2px 5px 0 5px  '>"
               + "<label style='text-align:center; '>" + time + "</label></div>"
               + "</div>";
    infoMarker = new AMap.Marker({
        content: info,
        position: new AMap.LngLat(lng, lat),
        offset: new AMap.Pixel(10, 0),
        zIndex: 1
    });
    timeList.push(infoMarker);
    if (blnShowPointTime) {
        infoMarker.setMap(map);
    }
    AMap.event.addListener(infoMarker, 'click', function () {//点击时数据列表显示当前列
        //鼠标点击marker弹出自定义的信息窗体
        if (lastClickTr != null) {//恢复上一次点击列
            $(lastClickTr).removeAttr("style");
            $($(lastClickTr)[0].children[0]).removeAttr("style");
        }
        if (lastClickTime != null) {//恢复上一次点击列
            $(lastClickTime).removeAttr("style");
            $($(lastClickTime)[0].children[0]).removeAttr("style");
        }
        var currentClickTr = $(historyTable)[0].children[1].children[index];
        //    $($(currentTr).children[0]).css({ "background-color": "red" });
        $($(currentClickTr)[0].children[0]).css({ "background-color": "#84B3EA" })
        $(currentClickTr).css({ "background-color": "#84B3EA" });
        var h = currentClickTr.offsetTop
        $($("#historyDt")[0].parentNode).scrollTop(h);
        lastClickTime = currentClickTr; //记录点击列，下次清空此列状态
    });
}

function getRealLen(str) {
    return str.replace(/[^\x00-\xff]/g, '__').length; //这个把所有双字节的都给匹配进去了
}

//创建一个地图InfoWindow
var infoWindow = new AMap.InfoWindow({
    size: new AMap.Size(300, 0),
    offset: new AMap.Pixel(0, -3)//-113, -140 

});

//标记开始和结束点
function createStartStop(point, type, index) {
    var statusMark = new AMap.Marker({
        position: new AMap.LngLat(point.Longitude, point.Latitude),
        zIndex: statusZIndex
    });
    switch (type) {
        case "0": //停车和怠速换图标
            statusMark.setOffset(new AMap.Pixel(0, -10));
            statusMark.setIcon(new AMap.Icon({ image: "../../Images/Map/start(1).png" }));
            break;
        case "1":
            statusMark.setOffset(new AMap.Pixel(0, -10));
            statusMark.setIcon(new AMap.Icon({ image: "../../Images/Map/stop(1).png" }));
            break;
    }
    statusMark.setMap(map);
    //if (point.Status == "停车" || point.Status == "怠速") {//如果是停车或者怠速
    var info = "<table style='cursor:pointer;height:100px;width:300px;'>"
           + "<tr><td width='30px'>时长:</td><td>" + point.SumTime + "秒</td></tr>"
           + "<tr><td width='30px'>时间:</td><td>" + point.GpsTime + "</td></tr>"
           + "<tr><td width='30px'>位置:</td><td>" + point.Location + "</td></tr></table>";
    infoWindow.setContent(info);
    AMap.event.addListener(statusMark, 'mouseover', function () {
        //鼠标点击marker弹出自定义的信息窗体
        var data = historyData[index].Status === "行驶" ? historyData[index].Velocity + "Km/h" : historyData[index].Velocity.split(" ")[1];
        var info = "<table style='cursor:pointer;height:100px;width:300px;'>"
          + "<tr><td width='30px'>时长:</td><td>" + historyData[index].SumTime + "秒</td></tr>"
        + '<tr><td width="30px">' + historyData[index].Status + ':</td><td>' + data + '</td></tr>'
          + "<tr><td width='30px'>时间:</td><td id='tableTime'>" + historyData[index].GpsTime + "</td></tr>"
          + "<tr><td width='30px'>位置:</td><td id='tableLocation'>" + historyData[index].Location + "</td></tr></table>";
        infoWindow.setContent(info);
        infoWindow.open(map, new AMap.LngLat(point.Longitude, point.Latitude));
    });
    AMap.event.addListener(statusMark, 'mouseout', function () {
        //鼠标点击marker弹出自定义的信息窗体
        infoWindow.close();
    });
    //}

}

//停车和怠速 标记
function createStatus(point, index) {
    var statusMark = new AMap.Marker({

        position: new AMap.LngLat(point.Longitude, point.Latitude),
        zIndex: statusZIndex
    });
    switch (point.Status) {
        case "停车": //停车和怠速换图标
            statusMark.setOffset(new AMap.Pixel(-4, -5));
            statusMark.setIcon(new AMap.Icon({ size: new AMap.Size(10, 10), image: "../../Images/Map/STOP.png" }));

            break;
        case "怠速":
            statusMark.setOffset(new AMap.Pixel(-4, -5));
            statusMark.setIcon(new AMap.Icon({ size: new AMap.Size(10, 10), image: "../../Images/Map/P.png" }));
            break;
    }
    statusMark.setMap(map);

    var data = point.Status === "行驶" ? point.Velocity + "Km/h" : point.Velocity.split(" ")[1];
    var info = '<table style="cursor:pointer;height:100px;width:300px;">'
            + '<tr><td width="30px">时间:</td><td id="tableTime">' + point.GpsTime + '</td></tr>'
            + '<tr><td width="30px">' + point.Status + ':</td><td>' + data + '</td></tr>'
            + '<tr><td width="30px">里程:</td><td>' + point.Mile + '公里</td></tr>'
            + '<tr><td width="30px">位置:</td><td id="tableLocation">' + point.Location + '</td></tr>'
            + '</table>';
    infoWindow.setContent(info);
    AMap.event.addListener(statusMark, 'mouseover', function () {
        //鼠标点击marker弹出自定义的信息窗体
        var data = point.Status === "行驶" ? point.Velocity + "Km/h" : point.Velocity.split(" ")[1];
        var info = '<table style="cursor:pointer;height:100px;width:300px;">'
                + '<tr><td width="30px">时间:</td><td id="tableTime">' + point.GpsTime + '</td></tr>'
                + '<tr><td width="30px">' + point.Status + ':</td><td>' + data + '</td></tr>'
                + '<tr><td width="30px">里程:</td><td>' + point.Mile + '公里</td></tr>'
                + '<tr><td width="30px">位置:</td><td id="tableLocation">' + point.Location + '</td></tr>'
                + '</table>';
        infoWindow.setContent(info);
        infoWindow.open(map, new AMap.LngLat(point.Longitude, point.Latitude));
        statusZIndex = statusZIndex + 1;
        statusMark.setzIndex(statusZIndex);
    });
    AMap.event.addListener(statusMark, 'mouseout', function () {
        //鼠标点击marker弹出自定义的信息窗体
        infoWindow.close();
    });
}

function setPointIcon(dituDirect) {
    var index = 1;
    var icon = null;
    if ((dituDirect >= 0 && dituDirect <= 22) || (dituDirect >= 338 && dituDirect <= 360)) {
        nIndex = 1;
    }
    else if (dituDirect >= 23 && dituDirect <= 67) {
        nIndex = 2;
    }
    else if (dituDirect >= 68 && dituDirect <= 112) {
        nIndex = 3;
    }
    else if (dituDirect >= 113 && dituDirect <= 157) {
        nIndex = 4;
    }
    else if (dituDirect >= 158 && dituDirect <= 202) {
        nIndex = 5;
    }
    else if (dituDirect >= 203 && dituDirect <= 247) {
        nIndex = 6;
    }
    else if (dituDirect >= 248 && dituDirect <= 292) {
        nIndex = 7;
    }
    else if (dituDirect >= 293 && dituDirect <= 337) {
        nIndex = 8;
    }
    else {
        nIndex = 1;
    }
    icon = new AMap.Icon({
        image: "../../Images/Map/GreenArrow/" + nIndex + ".png"
    });
    return icon;
}

//点击table列后在地图上显示该点数据
var LocationWindow;
var clickEvent;
function createDataPoint(tds, lng, lat) {
    LocationMarker = new AMap.Marker({
        position: new AMap.LngLat(lng, lat)
    });
    LocationMarker.setMap(map);
    LocationWindow = new AMap.InfoWindow({
        size: new AMap.Size(300, 0),
        offset: new AMap.Pixel(0, -33)//-113, -140 

    });
    var status = $(tds[7]).text();
    var data = status === "行驶" ? $(tds[2]).text() + "Km/h" : $(tds[2]).text().split(" ")[1];
    var info = '<table style="cursor:pointer;height:100px;width:300px;">'
              + '<tr><td width="30px">时间:</td><td id="tableTime">' + $(tds[1]).text() + '</td></tr>'
              + '<tr><td width="30px">' + status + ':</td><td>' + data + '</td></tr>'
              + '<tr><td width="30px">里程:</td><td>' + $(tds[4]).text() + '公里</td></tr>'
              + '<tr><td width="30px">位置:</td><td id="tableLocation">' + $(tds[9]).text() + '</td></tr>'
              + '</table>';
    LocationWindow.setContent(info);
    LocationWindow.open(map, new AMap.LngLat(lng, lat));
    clickEvent = AMap.event.addListener(LocationMarker, 'click', function () {//点击时数据列表显示当前列
        LocationWindow.setContent(info);
        LocationWindow.open(map, new AMap.LngLat(lng, lat));
    });
}

//*********************************地图工具函数************************************
//移动到点
function mapPanTo(lng, lat) {
    map.panTo(new AMap.LngLat(lng, lat));
}

//删除覆盖物
function mapRemoveOverlay(marker) {
    map.removeOverlay(marker);
}

//获取当前缩放等级
function mapGetZoom() {
    return map.getZoom();
}

//设置缩放等级
function mapSetZoom(num) {
    map.setZoom(num);
}

//设置位置
function markerSetPoistion(angle, lng, lat) {
    //    marker.setIcon(setIcon(angle, state));
    markerCph.setPosition(new AMap.LngLat(lng, lat));
    marker.setPosition(new AMap.LngLat(lng, lat));
    marker.setRotation(angle);
    if (angle >= 90 && angle <= 270) {
        marker.setOffset(new AMap.Pixel(-30, -20));
    }
    else {
        marker.setOffset(new AMap.Pixel(-10, -20));
    }
}

//table点击后显示的位置点更新位置
function LocationMarkerSetPoint(tds, lng, lat) {
    var status = $(tds[7]).text();
    var data = status === "行驶" ? $(tds[2]).text() + "Km/h" : $(tds[2]).text().split(" ")[1];
    var info = '<table style="cursor:pointer;height:100px;width:300px;">'
               + '<tr><td width="30px">时间:</td><td id="tableTime">' + $(tds[1]).text() + '</td></tr>'
               + '<tr><td width="30px">' + status + ':</td><td>' + data + '</td></tr>'
               + '<tr><td width="30px">里程:</td><td >' + $(tds[4]).text() + '公里</td></tr>'
               + '<tr><td width="30px">位置:</td><td id="tableLocation">' + $(tds[9]).text() + '</td></tr>'
               + '</table>';
    LocationWindow.setContent(info);
    LocationWindow.open(map, new AMap.LngLat(lng, lat));
    LocationMarker.setPosition(new AMap.LngLat(lng, lat))
    AMap.event.removeListener(clickEvent);
    clickEvent = AMap.event.addListener(LocationMarker, 'click', function () {//点击时数据列表显示当前列
        LocationWindow.setContent(info);
        LocationWindow.open(map, new AMap.LngLat(lng, lat));
    });
}
//轨迹线
var mapPolylineArr = new Array();
function mapPolyline(color, lineArr) {
    var polyline = new AMap.Polyline({
        path: lineArr, //设置线覆盖物路径  
        strokeColor: color, //线颜色   
        strokeOpacity: 1,  //线透明度    
        strokeWeight: 4, //线宽   
        outlineColor: "#14578A",
        isOutline: true,
        strokeStyle: "solid", //线样式  
        strokeDasharray: [10, 5]//补充线样式   

    });
    polyline.setMap(map);
    mapPolylineArr.push(polyline);
}

//轨迹数组
function getLineArr(lngLatArr) {
    var lineArr = new Array();
    for (var i = 0; i < lngLatArr.length; i++) {
        lineArr.push(new AMap.LngLat(lngLatArr[i].lng, lngLatArr[i].lat));
    }
    return lineArr;
}


//清除地图覆盖物
function clearMap() {
    map.clearMap();
    LocationMarker = null;
}
//轨迹回放
function moveAlong(lineArr, speed) {
    marker.moveAlong(lineArr, speed);
}

//判断点是否在视野范围内
function ContainPoint(lng, lat) {
    var bounds = map.getBounds();
    var bool = bounds.contains(new AMap.LngLat(lng, lat));
    return bool;
}



