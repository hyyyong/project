var m_groupId = -1;
var User;
var m_groupList=null;
function onCancelClick() {
    window.parent.closeFrame("", "");
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭  
}
$(function () {
    User = $.parseJSON($.cookie("User"));
    m_groupId = getQueryString("id");
    var vehGroupName = getQueryString("vehGroupName");
    $("#tree").hide();
    $("#groupId").val(vehGroupName);
    $("#activeTime").val(new Date().Format("yyyy-MM-dd hh:mm:ss"));
    $('#activeTime').prop("readonly", true).datetimepicker({
        lang: 'ch',
        timepicker: true,
        format: 'Y-m-d H:i:s',
        formatDate: 'Y-m-d H:i:s',
        zIndex: 999,
        left: 0,
        //pickerPosition: 'bottom-left',
    });


    $("#serverEndTime").val(new Date().Format("yyyy-MM-dd hh:mm:ss"));
    $('#serverEndTime').prop("readonly", true).datetimepicker({
        lang: 'ch',
        timepicker: true,
        format: 'Y-m-d H:i:s',
        formatDate: 'Y-m-d H:i:s',
        zIndex: 999,
        left: 0,
        //pickerPosition: 'bottom-left',
    });

    $("#groupId").click(function () {
        if ($("#tree").css("display") == "none") {
            $("#tree").show();
            if (m_groupList == null) {
                getVehGroupByUserId(User.userId)
            }
            else {
                AllVehGroup.initData(m_groupList, "groupTree");
            }
        }
        else
            $("#tree").hide();
       
       
    })

})


function onSureClick() {
    var userId = User.userId;
    var token = User.token;

    var plate = $("#plate").val().trim();
    var simNo = $("#simNo").val().trim();
    var deviceId = $("#deviceId").val().trim();
    var deviceType = $("#deviceType").val().trim();
    var webpass = $("#webpass").val().trim();

    var ownerName = $("#ownerName").val().trim();
    var ownerPhone = $("#ownerPhone").val().trim();
    var vehicleType = $("#vehicleType").val().trim();
    var vehicleColor = $("#vehicleColor").val().trim();
    var frameNo = $("#frameNo").val().trim();

    var engineNo = $("#engineNo").val().trim();
    var certificateNo = $("#certificateNo").val().trim();
    var ICCID = $("#ICCID").val().trim();
    var contactName = $("#contactName").val().trim();
    var contactPhone = $("#contactPhone").val().trim();

    var installTime = new Date().Format("yyyy-MM-dd hh:mm:ss");//$("#installTime").val().trim();
    var installPhone = $("#installPhone").val().trim();
    var installPerson = $("#installPerson").val().trim();
    var installAddress = $("#installAddress").val().trim();
    var ownerAddress = $("#ownerAddress").val().trim();

    var marks = "";// $("#marks").val().trim();
    var activeTime = $("#activeTime").val().trim();
    var serverEndTime = $("#serverEndTime").val().trim();

    var plateColor = "蓝色";// $("#plateColor").val().trim();
    var vehGroupId = m_groupId;

   
    if (plate == "") {       
        layer.msg("车牌不能为空！", { time: 5000, btn: ['确认'] }); return;
    }
    if (simNo == "") {
        enterDigital(simNo)
        layer.msg("车牌不能为空！", { time: 5000, btn: ['确认'] }); return;
    }
    if (deviceId == "") {
        layer.msg("设备编号不能为空！", { time: 5000, btn: ['确认'] }); return;
    }
    if (plate == "") {
        layer.msg("车牌不能为空！", { time: 5000, btn: ['确认'] }); return;
    }
    if (plate == "") {
        layer.msg("车牌不能为空！", { time: 5000, btn: ['确认'] }); return;
    }
    if (plate == "") {
        layer.msg("车牌不能为空！", { time: 5000, btn: ['确认'] }); return;
    }
    if (plate == "") {
        layer.msg("车牌不能为空！", { time: 5000, btn: ['确认'] }); return;
    }
    if (plate == "") {
        layer.msg("车牌不能为空！", { time: 5000, btn: ['确认'] }); return;
    }
    if (plate == "") {
        layer.msg("车牌不能为空！", { time: 5000, btn: ['确认'] }); return;
    }
    if (plate == "") {
        layer.msg("车牌不能为空！", { time: 5000, btn: ['确认'] }); return;
    }
    if (plate == "") {
        layer.msg("车牌不能为空！", { time: 5000, btn: ['确认'] }); return;
    }
   

    $.ajax({
        type: 'GET',
        url: '/VehicleInfo/AddVehicle',
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 15000,                              //请求超时时间
        //    cache: false,                               //是否缓存上一次的请求数据
        //  async: true,                                //是否异步
        data: { "userId": userId, 'token': token, 'plate': plate, 'simNo': simNo, 'deviceId': deviceId, 'deviceType': deviceType ,"webpass": webpass, 'frameNo': frameNo, 'engineNo': engineNo, 'plateColor': plateColor, 'vehicleColor': vehicleColor, 'ownerName': ownerName,"ownerPhone": ownerPhone, 'ownerAddress': ownerAddress, 'vehicleType': vehicleType, 'certificateNo': certificateNo, 'ICCID': ICCID, 'installTime': installTime , 'installPhone': installPhone,"installPerson": installPerson, 'installAddress': installAddress, 'contactName': contactName, 'contactPhone': contactPhone, 'marks': marks, 'activeTime': activeTime , 'serverEndTime': serverEndTime, 'vehGroupId': vehGroupId  },
        beforeSend: function () {
            //alert('请求之前');
        },
        success: function (data) {
            if (data.flag == 1) {//登陆成功
                layer.msg(data.msg, {
                    time: 2000, //2s后自动关闭
                    btn: ['确认']
                })
                window.parent.closeFrame("", "");
                var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                parent.layer.close(index); //再执行关闭  
            }
            else {
                layer.msg(data.msg, {
                    time: 2000, //2s后自动关闭
                    btn: ['确认']
                })
            }
        },
        error: function (msg) {
            setTimeout(function () { onSureClick(); }, 3000);
            layer.msg('加车数据请求失败，重新请求...');
            console.log('加车数据请求失败,' + JSON.stringify(msg));
        }
    });
}


//通过用户ID获取总车组树(包括子用户下车组)
function getVehGroupByUserId(userId) {
    var userID = userId;
    $.ajax({
        type: 'Get',
        url: '/VehicleInfo/GetVehGroupList?userId=' + User.userID + '&token=' + User.token + '&id=' + userId,
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 15000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步  
        success: function (data) {
            if (data.flag == 1) {
                m_groupList = data.obj;
                AllVehGroup.initData(data.obj, "groupTree");
                //var treeObj = VehGroup.tree;
                //var node = treeObj.getNodeByParam("VehGroupName", "车组管理", null);
                //treeObj.expandNode(node, true, false, true);
                //treeObj.selectNode(node);
            } else {              
                console.log("车组信息获取失败," + data.msg);
            }
        },
        error: function (msg) {
            setTimeout(function () { getVehGroupByUserId(userID); }, 3000);
            console.log("车组信息获取失败," + msg.statusText);
        }
    });
}


//总车组树信息
var AllVehGroup = function (m, id) {
    m.date = [];//数据信息
    m.tree = null;//树形结构
    //var VehGroupDate = 
    m.initData = function (Data, id) {
        setting.treeId = id;
        m.date = Data;//保存数据
        m.initTree(Data, id);//生成树结构
    }
    var addDiyDom = function (treeId, treeNode) {
      
    }
    //tree设置
    var setting = {
        treeId: "",
        treeObj: "",
        check: {
            enable: false,
            nocheckInherit: false,
            chkDisabledInherit: false
        },
        view: {
            showIcon: false,
            addDiyDom: addDiyDom
        },
        data: {
            key: {
                name: "VehGroupName",
            },
            simpleData: {
                enable: true,
                idKey: "VehGroupID",
                pIdKey: "FVehGroupID",
                rootPId: -1
            }
        },
        callback: {
            onClick: onTreeClick, //点击节点事件           
        }
    }

    //生成部门树结构
    m.initTree = function (data, id) {
        m.tree = $.fn.zTree.init($("#" + id + ""), setting, data);
        m.tree.expandAll(false);//默认折叠所有节点
    }
    return m;
}(AllVehGroup || {});


//节点点击事件
function onTreeClick(event, treeId, treeNode) {     
    $("#groupId").val(treeNode.VehGroupName);
    m_groupId=treeNode.VehGroupID;
    $("#tree").hide();
}
