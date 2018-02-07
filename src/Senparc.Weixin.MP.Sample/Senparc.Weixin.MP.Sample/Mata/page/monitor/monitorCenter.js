var isGoogle = false;  //是否是谷歌地图
var User;
var vehicleTree; //车辆树
var vehicleCollectionSubscribe = new Array(); //订阅车辆
var groupArrayShow = new Array(); //监控显示树车组
var vehicleInfo = new Array();
var group = new Array();
var groupTotal = new Array();
jQuery(document).ready(function ($) {
   // $(".content-page").height($("#map_tab_left").height());  
    initialize();
    User = $.parseJSON($.cookie("User"));
    LoadTree(User.userId);

    $("#view_vehicle_all").click(function () {
        $("#view_vehicle_all").css('backgroundColor', '#36404a');
        $("#view_vehicle_all").css('color', '#fff');
        $("#view_vehicle_online").css('backgroundColor', '#ffffff');
        $("#view_vehicle_online").css('color', '#000000');
        $("#view_vehicle_offline").css('backgroundColor', '#ffffff');
        $("#view_vehicle_offline").css('color', '#000000');
       
    });
    $("#view_vehicle_online").click(function () {
        $("#view_vehicle_all").css('backgroundColor', '#ffffff');
        $("#view_vehicle_all").css('color', '#000000');
        $("#view_vehicle_online").css('backgroundColor', '#36404a');
        $("#view_vehicle_online").css('color', '#fff');
        $("#view_vehicle_offline").css('backgroundColor', '#ffffff');
        $("#view_vehicle_offline").css('color', '#000000');
    });
    $("#view_vehicle_offline").click(function () {
        $("#view_vehicle_all").css('backgroundColor', '#ffffff');
        $("#view_vehicle_all").css('color', '#000000');
        $("#view_vehicle_online").css('backgroundColor', '#ffffff');
        $("#view_vehicle_online").css('color', '#000000');
        $("#view_vehicle_offline").css('backgroundColor', '#36404a');
        $("#view_vehicle_offline").css('color', '#fff');
    });

    LoadVehTree();
});


var LoadTree = function (userid) {
    var setting = {
        treeId: "",
        treeObj: "",
        check: {
            enable:true,
            nocheckInherit: false,
            chkDisabledInherit: false
        },
        async: {
            enable: false,
            type: "get"
        },
        view: {
            showIcon: true
        },
        data: {
            key: {
                name: "VehGroupName",
            },
            simpleData: {
                enable: true,
                idKey: "VehGroupID",
                pIdKey: "FVehGroupID",
                rootPId: null
            }
        },
        callback: {
            onClick: function (event, treeId, treeNode) {

                //if (_obj != null && (_groupId == 0 || Number(_groupId) == Number(treeNode.VehGroupID))) {
                //    setVehList(_obj);
                //    _groupId = treeNode.VehGroupID;
                //} else {
                for (var i = 0; i < groupArrayShow.length; i++) {
                    if (treeNode.VehGroupID == groupArrayShow[i].ID) {
                        
                        return;
                    }
                }              
                var obj = new Object();
                obj.ID = treeNode.VehGroupID;
                obj.VehGroupID = treeNode.VehGroupID;
                obj.VehGroupName = treeNode.VehGroupName;                         
                groupArrayShow.push(obj);
                getVehList(treeNode.VehGroupID);
               
            }
        }
    }

    $.ajax({
        type: 'GET',
        url: '/VehicleInfo/GetVehGroupList',
        data: { "userId": User.userId, "token": User.token, "id": userid },
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 60000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: false,                                //是否异步
        beforeSend: function () {
            //alert('请求之前');
        },
        success: function (data) {
            _obj = data;
            if (data.flag == 1) {//登陆成功
                try {
                    var obj = [];
                    namelist = [];
                    $.each(data.obj, function (i) {
                        var b = data.obj[i];
                        b.icon = "/Mata/img/monitor/ic_group.png";;
                        namelist.push(this);
                        obj.push(b)                       
                    });
                    groupTotal = obj;
                    tree = $.fn.zTree.init($("#tree"), setting, obj);
                    tree.expandAll(false);
                } catch (e) {
                    console.log(e);
                   
                }
            } else {
                console.log('车组树失败,' + data.msg);
            }
        },
        error: function (msg) {
            setTimeout(function () { LoadTree(userid); }, 3000);
            layer.msg('车组树失败，重新请求...');
            console.log('用户数据请求失败,' + JSON.stringify(msg));
        }
    });
}



//根据车组ID获取该车组的车辆数据  不包括子车组
function getVehList(vehGroupID) {
    $.ajax({
        type: 'GET',
        url: '/Monitor/GetVehListByGroupID',
        dataType: 'json',                           //指定服务器返回的数据类型
        //timeout: 60000,                           //请求超时时间
        //cache: false,                             //是否缓存上一次的请求数据
        //async: true,                              //是否异步
        data: { "userId": User.userId, "token": User.token, "groupID": vehGroupID },
        beforeSend: function () {
            //alert('请求之前');
        },
        success: function (data) {
            if (data.flag == 1) {//登陆成功
                if (data.obj != null) {
                    for (var i = 0; i < data.obj.length; i++) {
                        vehicleInfo.push(data.obj[i]);
                    }
                }
                LoadVehTree();
            }
        },
        error: function (msg) {
            //  setTimeout(function () { getVehList(vehGroupID); }, 3000);
            layer.msg('车辆数据请求失败，重新请求...');
            console.log('车辆数据请求失败,' + JSON.stringify(msg));
        }
    });
}


//==============================================车辆操作=========================================================
function LoadVehTree() {
    vehicleTree = $.fn.zTree.init($("#VehTree"), vehSetting, treeData());
}

//一次性加载完数据
var vehSetting = {
    view: {
        fontCss: getFont,
        nameIsHTML: true,
        showIcon: true,
        addDiyDom: addDiyDom,
        expandSpeed: ""
    },
    check: {
        enable: true,
        nocheck: true,
        nocheckInherit: false,
        chkDisabledInherit: false
    },
    async: {
        enable: false,
        type: "get"
    },
    callback: {
        onRightClick: OnRightClick, //右键点击事件
        onCheck: zTreeOnCheck, //勾选事件
        beforeCheck: zTreebeforeCheck,
        //onNodeCreated: bindTreeMouseEvent,//节点生成
        onClick: zTreeClick,//左键点击
        onExpand: bindTreeMouseEvent, //节点展开事件
        beforeExpand: zTreeBeforeExpand//节点展开之前
        //onNodeCreated: zTreeOnNodeCreated
    }
};

function getFont(treeId, node) {
    return node.font ? node.font : {};
}

//给节点添加自定义图标
function addDiyDom(treeId, treeNode) {
    var aObj = $("#" + treeNode.tId + "_a");
    var cmdValue = "查看资料,轨迹回放";
        var treeCmds = cmdValue.split(",");
        var addDiv = "";
      
        for (var i = 0; i < treeCmds.length; i++) {
           
                addDiv += treeCmdAddDiv(treeCmds[i]);
            
        }
        if (treeNode.id.indexOf("V_") >= 0) {
            aObj.after(addDiv);
        }
   
}


//根据选中，生成树上的节点
function treeCmdAddDiv(cmdValue) {
    var img = "";
    switch (cmdValue) {
        
        case "版本检测":
            img = "<img src='/Mata/img/monitor/cmd_veh_trajectory.png' title='版本查询' onclick='commonCmd(this,9)'>";
            break;
        case "查看状态":
            img = "<img src='/Mata/img/monitor/cmd_veh_trajectory.png' title='车辆状态' onclick='commonCmd(this,13)'>";
            break;
        case "查看资料":
            img = "<img src='/Mata/img/monitor/cmd_veh_trajectory.png' title='查看资料' onclick='showVehicleInfo(this)'>";
            break;
        case "下发调度信息":
            img = "<img src='/Mata/img/monitor/cmd_veh_trajectory.png' title='文本下发' onclick='commonCmd(this,6)'>";
            break;
        case "超速设置":
            img = "<img src='/Mata/img/monitor/cmd_veh_trajectory.png' title='超速设置' onclick='overSpeed.setOverSpeed(this)'>";
            break;
        case "跟踪":
            img = "<img src='/Mata/img/monitor/cmd_veh_trajectory.png' title='跟踪' onclick='TrackMonitorVehicle(this)'>";
            break;
        case "轨迹回放":
            img = "<img src='/Mata/img/monitor/cmd_veh_trajectory.png' title='轨迹回放' onclick='onTrajectory(this)'>";
            break;
       
    }
    return img;
}

//点击右键
function OnRightClick(event, treeId, treeNode) {
   
}

//车组取消勾选前事件   可获取勾选的车辆减少for循环
function zTreebeforeCheck(treeId, treeNode) {
 
}

//节点展开事件   更新离线时间
function bindTreeMouseEvent(event, treeId, treeNode) {   
}


//节点展开之前
function zTreeBeforeExpand(treeId, treeNode) {
}


//树节点事件
function zTreeClick(event, treeId, treeNode) {
    //如果当前节点被勾选了，则当前车辆在地图上居中
    if (treeNode.id.indexOf("V_") >= 0) {
        if (!treeNode.checked) {
            treeNode.checked = true;
            vehicleTree.updateNode(treeNode);
            zTreeOnCheck(event, treeId, treeNode);
            checkedpNode(treeNode);
        }

        //var plateNo = treeNode.plateNo;
        //for (var i = 0, j = positionData.length; i < j; i++) {//遍历实时数据节点
        //    if (plateNo == positionData[i].Name) {  //如果传入的车ID与改行的车ID相等，则拿该行的数据显示
        //        var lng = positionData[i].Longitude;
        //        var lat = positionData[i].Latitude;
        //        trClickCallBack(positionData[i].VehID, lat + "," + lng);
        //        break;
        //    }
        //}

    }
}



//节点勾选事件
function zTreeOnCheck(event, treeId, treeNode) {
    var node = treeNode;
    //勾选车辆
    if (node.id.indexOf("V_") >= 0) {       
        if (node.checked) {
            onTreeNodeCheck(event, treeId, treeNode);
        }
        else {
            onTreeNodeUncheck(event, treeId, treeNode);
        }
    }
}


//节点勾选事件
function onTreeNodeCheck(event, treeId, treeNode) {
    var id = treeNode.id;
    if (treeNode.outService) {
        //controlDivStatus("服务已过期");
        return;
    }
    if (id.indexOf("V_") >= 0) {
        id = id.substr(2);      
        if (vehicleCollectionSubscribe.length >= 100) {
            uncheckedFirstNode();
            //var index = -1;
            //for (var m = 0; m < positionData.length; m++) {
            //    if (positionData[m].VehID == vehicleCollectionSubscribe[0].ID) {
            //        index = m;
            //        break;
            //    }
            //}

            //if (vehicleCollectionSubscribe[0].MapMaker != null) {
            //    vehicleCollectionSubscribe[0].MapMaker.setMap(null);
            //    vehicleCollectionSubscribe[0].MapMaker = null;
            //}
            //vehicleCollectionSubscribe.splice(0, 1);
            //if (index >= 0) {//如果列表中有这一列数据，则删除，否则不变

            //    positionData.splice(index, 1);
            //    var trs = dataTableTrueTime._oRecordSet.getRecords();
            //    var index1 = 0;
            //    for (var i = 0; i < trs.length; i++) {
            //        if (trs[i]._oData.VehID == vehicleCollectionSubscribe[0].ID) {
            //            index1 = i;
            //            break;
            //        }
            //    }

            //    dataTableTrueTime.deleteRow(index1);
            //    dataTableTrueTime.addIDs();
            //}
        }
        var obj = new Object();
        obj.TerminalNo = treeNode.tag;
        obj.ID = treeNode.id.substr(2);
        obj.MapMaker = null;
        obj.Name = treeNode.plateNo;
        obj.Longitude = 0;
        obj.Latitude = 0; //
        obj.Velocity = 0;
        obj.Angle = 0;
        obj.Mile = 0;
        obj.GpsTime = "";
        obj.AlarmString = "";
        obj.StartLngLat = "";
        obj.DriveStatus = "";//行驶状态
        obj.Duration = "";//持续时间
        vehicleCollectionSubscribe.push(obj);
 
        trueTimeMsg();
    }
}

//节点取消勾选事件
function onTreeNodeUncheck(event, treeId, treeNode) {
    if (treeNode.outService) {
        return;
    }
    var id = treeNode.id;
    if (id.indexOf("V_") >= 0) {
        id = id.substr(2);      
        var index;
        var index1 = -1;
        for (var j = 0; j < vehicleCollectionSubscribe.length; j++) {
            if (vehicleCollectionSubscribe[j].ID == id) {
                index = j;
                break;
            }
        }
        //for (var j = 0; j < positionData.length; j++) {
        //    if (positionData[j].VehID == id) {
        //        index1 = j;
        //        break;
        //    }
        //}
        //if (index1 >= 0) {

        //    if (positionData[index1].GsmInfo) {
        //        $("#GsmDiv").css("opacity", 0).css("filter", "alpha(opacity=0)").css("z-index", 99);
        //        $("#map").css("opacity", 1).css("filter", "alpha(opacity=100)").css("z-index", 100);
        //    }
        //    var trs = dataTableTrueTime._oRecordSet.getRecords();
        //    var index2 = 0;
        //    for (var i = 0; i < trs.length; i++) {
        //        if (trs[i]._oData.VehID == id) {
        //            index2 = i;
        //            break;
        //        }
        //    }
        //    dataTableTrueTime.deleteRow(index2);
        //    dataTableTrueTime.addIDs();
        //    positionData.splice(index1, 1);
        //}
        //var v1 = vehicleCollectionSubscribe[index];
        //if (v1.MapMaker != null) {
        //    v1.MapMaker.setMap(null);
        //    v1.MapMaker = null;
        //}
        vehicleCollectionSubscribe.splice(index, 1);
        trueTimeMsg();
        //infoWindow.close();


        //if (id == TrackMonitorVehicleID) {
        //    //如果当前跟踪的车辆就是取消的车辆，取消跟踪，清空地图线路
        //    TrackMonitorVehicleID = "";
        //    TrackMonitorLng = ""; //跟踪车辆的上一次经纬度 经纬度用来绘制轨迹线
        //    TrackMonitorLat = "";
        //    clearTrackLine();
        //}
    }
    //bindRealNum();

}


//取消订阅的第一辆车
function uncheckedFirstNode() {
    var id = vehicleCollectionSubscribe[0].ID;
    var node = vehicleTree.getNodeByParam("id", "V_" + id)
    node.checked = false;    //获取订阅的第一辆车 取消勾选

    vehicleTree.updateNode(node);
    var pNode = node.getParentNode();
    var pNodeChildNodes = vehicleTree.getNodeByParam("checked", true, pNode); //获取该节点的父节点的所有checked为true的子节点，如果没有则取消勾选
    if (pNodeChildNodes == null) {
        pNode.checked = false;
        vehicleTree.updateNode(pNode);
        uncheckedpNode(pNode);
    }
}


//递归取消所有以上的父节点
function uncheckedpNode(node) {
    var pNode = node.getParentNode();
    if (pNode != null) {
        var pNodeChildNodes = vehicleTree.getNodeByParam("checked", true, pNode); //获取该节点的父节点的所有checked为true的子节点，如果没有则取消勾选
        if (pNodeChildNodes == null) {
            pNode.checked = false;
            vehicleTree.updateNode(pNode);
            uncheckedpNode(pNode);
        }
    }
}


//递归勾选父节点
function checkedpNode(node) {
    var pNode = node.getParentNode();
    if (pNode != null) {
        if (!pNode.checked) {
            pNode.checked = true;
            vehicleTree.updateNode(pNode);
            checkedpNode(pNode);
        }
    }
}


//请求实时数据
function trueTimeMsg() {
  
}



/******************************树形控件**********************************/
// 加载树
var treeData = function () {
   // var group = new Array();
    //var vehicle = new Array();

        //group = $.parseJSON(localStorage.getItem("groupList"));
        //vehicle = $.parseJSON(localStorage.getItem("vehicleList"));       
   
    var root = new Array();
    for (var i = 0; i < groupArrayShow.length; i++) {
      
            var count = 2;// getVehCount(vehicle, group, group[i]["VehGroupID"].toString()); //车组下的车辆数
            var child = new Object();
            child.id = "G_" + groupArrayShow[i]["VehGroupID"].toString();
            child.name = groupArrayShow[i]["VehGroupName"].toString() + "(" + count + ")";
            //child.font = { 'font-weight': 'nomal', 'color': 'rgb(76, 75, 75)' };
            child.noR = true;
            child.check = false;
            child.t = "";
            child.isStore = groupArrayShow[i].isStore;
            //if (child.isStore.toString() == "0") {
            //    child.icon = "../../Images/ico/车组图标.png";
            //}
            //else {
            child.icon = "/Mata/img/monitor/ic_group_blue.png";
           // }
            child.children = [];
            if (count == 0) { //该车组下没有车辆
                child.chkDisabled = true;
            }
            else {
                child.isParent = true;
            }
            child.hasOpen = false;
           
            bindChildVeh(vehicleInfo, child, groupArrayShow[i]["VehGroupID"].toString());
            root.push(child);
       
    }
    return root;
}

//绑定车组下的车辆
var bindChildVeh = function (vehicle, treeNode) {
    for (var i = 0; i < vehicle.length; i++) {
        if (vehicle[i]["E"].toString() == treeNode.id.substr(2)) {
            var tempVeh = new Object();
            tempVeh.id = "V_" + vehicle[i]["A"].toString();
            tempVeh.name = vehicle[i]["C"].toString();
            tempVeh.plateNo = vehicle[i]["C"].toString();
            //tempVeh.font = { 'font-weight': 'normal', 'color': '#CBC9C9' };
            tempVeh.type = vehicle[i]["D"].toString();
            tempVeh.check = false;
            tempVeh.icon = "/Mata/img/monitor/ic_car_online.png";
            tempVeh.tag = vehicle[i]["B"].toString();
            tempVeh.t = "";
            tempVeh.online = 0;
            tempVeh.velocity = 0;//车辆速度
            tempVeh.state = 0;//车辆状态   6.30日添加
            tempVeh.outService = false;
            treeNode.children.push(tempVeh);
        }
    }
}


