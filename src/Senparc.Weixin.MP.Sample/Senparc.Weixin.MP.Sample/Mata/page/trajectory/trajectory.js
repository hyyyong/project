var historyData = [];//轨迹回放数据表
var timer = null;
var index = 0;
var indexPointArray = 0; //循环遍历纠偏后的数组，存储值

var blnShowPoint = false; //显示轨迹点
var blnShowPointTime = false; //显示轨迹点时间
var blnPause = true; //暂停按钮

var nTimerSpeed = 300; //轨迹回放速度
var marker = null; //轨迹车辆图标
var currentPoint = null; //当前回放点
var vehicleList = new Array(); //车辆列别
var groupList = new Array(); //车组列表

var currentVehicle = null; //当前车辆
var currentID = "";
var historyTable;
var stopTable;
var arrowList = new Array(); //回放位置点数据
var timeList = new Array(); //回放时间点数据
var lineArr = new Array(); //纠偏完成后的经纬度存在此
var realPnlFlag = 1;


$(function () {
    setTimeout(initPage, 50);
})
//初始化页面
function initPage() {
   // var vehidFromMontior = getQueryString("vehID");
    //User = $.parseJSON($.cookie("User"));
    initMap();

    $("#txtStartDate").val(new Date().Format("yyyy-MM-dd ") + "00:00:00");
    $("#txtEndDate").val(new Date().Format("yyyy-MM-dd hh:mm:ss"));

    $('#txtStartDate').focus(function () {
        document.getElementById('txtStartDate').blur();
    });

    $('#txtEndDate').focus(function () {
        document.getElementById('txtEndDate').blur();
    });
    $('#txtStartDate').datetimepicker({
        lang: 'ch',
        timepicker: true,
        format: 'Y-m-d H:i:s',
        formatDate: 'Y-m-d H:i:s',
        zIndex: 999,
        left: 0,
        //pickerPosition: 'bottom-left',
    });
    $("#txtEndDate").datetimepicker({
        lang: 'ch',
        timepicker: true,
        format: 'Y-m-d H:i:s',
        formatDate: 'Y-m-d H:i:s',
        zIndex: 999,
        left: 0,
    });

   
}


//时间
// Date增加Format方法 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
// Date增加Add方法
var dateAdd = function (count, dd) {
    if (dd == undefined) {
        dd = new Date();
    }
    dd.setDate(dd.getDate() + count);
    return dd.Format("yyyy-MM-dd");
}
var dateAdd1 = function (count, dd) {
    if (dd == undefined) {
        dd = new Date();
    }
    dd.setDate(dd.getDate() + count);
    return dd.Format("yyyy-MM-dd hh:mm:ss");
}



