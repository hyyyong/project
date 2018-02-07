var vehiStatus = [];
var _groupId = 0;
var User;
$(document).ready(function () {
    User = $.parseJSON($.cookie("User"));
    setTimeout(loadReadyPage, 50);
});

function loadReadyPage() {
    if (typeof parent.lang == "undefined") {
        setTimeout(loadReadyPage, 50);
    } else {
        loadPage();
    }
}

function loadPage() {
    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();



    //2.初始化Button的点击事件
    var oButtonInit = new ButtonInit();
    oButtonInit.Init();
    loadReportTableWidth();
    ////初始化车辆状态
    //initVehiStatus();
    var width = 0;
    if (parent.screenWidth < 1280) {
        width = 980;
    } else {
        width = 'auto';
    }

    loadTree(User.userId);
    settingWH();
}

var settingWH = function () {
    $("#container").width($("#container1")[0].clientWidth - 260);
    $("#left").height($("#container1")[0].clientHeight - 100);

}



var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#vehicleInfoTable').bootstrapTable({
            data: [],
            toolbar: '#toolbar',                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: true,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: false,                     //是否启用排序
            sortOrder: "asc",                   //排序方式
            queryParams: '',//传递参数（*）
            sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1,                       //初始化加载第一页，默认第一页
            pageSize: 40,                       //每页的记录行数（*）
            pageList: [40, 100, 200, 500],        //可供选择的每页的行数（*）
            search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: true,
            showColumns: true,                  //是否显示所有的列
            showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            height: 600,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
            showToggle: true,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            columns: [{
                checkbox: true
            }, {
                field: 'plate',
                title: '车牌号码'
            }, {
                field: 'simNo',
                title: 'SIM卡号'
            }, {
                field: 'deviceType',
                title: '设备类型'
            }, {
                field: 'webpass',
                title: '服务密码'
            }, {
                field: 'ownerName',
                title: '车主'
            }, {
                field: 'ownerPhone',
                title: '车主电话'
            }, {
                field: 'serverEndTime',
                title: '服务到期时间'
            }, {
                field: 'vehGroupName',
                title: '车组名'
            }, {
                field: 'operation',
                title: '操作'

            }, ], formatNoMatches: function () {
                return "正在加载数据....";
            },
            formatLoadingMessage: function () {
                return "请稍等，正在加载中。。。";
            }
        });
    };
    return oTableInit;
};

var ButtonInit = function () {
    var oInit = new Object();
    var postdata = {};

    oInit.Init = function () {
        //初始化页面上面的按钮事件
    };

    return oInit;
};


function doExit() {
    $.dialog({ id: 'info' }).close();
}

//根据车组ID获取该车组的车辆数据  不包括子车组
function getVehList(vehGroupID) {
    $.ajax({
        type: 'GET',
        url: '/VehicleInfo/GetVehByGroupID',
        dataType: 'json',                           //指定服务器返回的数据类型
        //timeout: 60000,                           //请求超时时间
        //cache: false,                             //是否缓存上一次的请求数据
        //async: true,                              //是否异步
        data: { "userId": User.userId, "token": User.token, "groupID": vehGroupID },
        beforeSend: function () {
            //alert('请求之前');
        },
        success: function (data) {
            setVehList(data);

        },
        error: function (msg) {
            //  setTimeout(function () { getVehList(vehGroupID); }, 3000);
            layer.msg('车辆数据请求失败，重新请求...');
            console.log('车辆数据请求失败,' + JSON.stringify(msg));
        }
    });
}
function setVehList(data) {
    if (data.flag == 1) {//登陆成功
        if (data.obj != null) {
            $.each(data.obj, function (index) {
                this.index = index + 1;
                this.operation = "";
                this.operation = '<div id=' + this.vehicleId + ' style="white-space :nowrap;"><a class="add" data-toggle="modal" type="unstock" userId="' + this.vehicleId + '" corpName="' + this.plate + '" name="' + this.plate + '" onclick="changeVehGroup(' + this.vehicleId + ',this)" style="white-space:nowrap;color: #165082;">转移 </a> |'
      + '<a class="edit" data-toggle="modal" type="unstock" userId="' + this.vehicleId + '" onclick="editVehicle(' + this.vehicleId + ')" style="white-space:nowrap;color: #165082;">修改 </a> |'
      + '<a class="del" data-toggle="modal" type="unstock" userId="' + this.vehicleId + '" name="' + this.plate + '" onclick="delVehicle(' + this.vehicleId + ',this)" style="white-space:nowrap;color: #165082;">删除 </a>';
                this.operation += '</div>';


            })
            $("#vehicleInfoTable").bootstrapTable('load', data.obj);
        }
        else {
            $("#vehicleInfoTable").bootstrapTable('load', []);
        }


    } else {
        console.log('用户数据请求失败,' + data.msg);
    }
}

function changeVehGroup(vehicleId, e) {
}
function editVehicle(vehicleId) {
}
function delVehicle(vehicleId, e) {
    var name = $(e).attr("name");
    var delVehicles = layer.confirm('您确定要删除车辆(' + name + ')？', {
        title: ['删除车辆', 'font-size:18px;'],
        btn: ['确定', '取消'] //按钮
    }, function () {
        $.ajax({
            type: 'GET',
            url: '/VehicleInfo/delVehicle?userId=' + User.userId + '&token=' + User.token + '&vehicleId=' + vehicleId+'&del=',
            dataType: 'json',
            beforeSend: function () {

            },
            success: function (data) {
                if (data.flag == 1) {
                    layer.close(delVehicles);
                    loadPage();
                }
                else {
                    layer.msg(data.msg, { time: 5000, btn: ['确认'] });
                }

            },
            error: function (msg) {
                setTimeout(function () { getUser(userid); }, 3000);
                console.log('用户数据请求失败,' + JSON.stringify(msg));
            }
        });
    }, function () {
        layer.close(delVehicles);
    });

}


var setting = {
    treeId: "",
    treeObj: "",
    check: {
        enable: false,
        nocheckInherit: false,
        chkDisabledInherit: false
    },
    async: {
        enable: false,
        type: "get"
    },
    view: {
        showIcon: true,
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom

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
            getVehList(treeNode.VehGroupID);
            // }
        }
    }
}


//搜索功能
var namelist = [];
// 加载树
var loadTree = function (userid) {
    GroupBing(userid);
}

var GroupBing = function (userid) {
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
                        b.icon = "../../../Images/Main/tree_user.png";;
                        namelist.push(this);
                        obj.push(b)
                    });
                    tree = $.fn.zTree.init($("#tree"), setting, obj);
                    tree.expandAll(false);//默认折叠所有节点


                    //if (id == null || id == "") {
                    //    var nodes = tree.transformToArray(tree.getNodes());
                    //    $("#userView_1_switch").click();
                    //    $("#userView_1_a").click();
                    //    $("#userView_1_a").click();
                    //} else {
                    //    var node = tree.getNodeByParam("userId", id, null);
                    //    tree.selectNode(node);
                    //    $("#" + node.tId + "_span").click();
                    //}
                } catch (e) {
                    console.log(e);
                    //  console.log("父窗体数据未加载完成,本页数据将在3秒后重新加载");
                    ///  setTimeout(function () { xUserbin(); }, 3000);
                }
            } else {
                console.log('用户数据请求失败,' + data.msg);
            }
        },
        error: function (msg) {
            setTimeout(function () { UserBing(userid); }, 3000);
            layer.msg('用户数据请求失败，重新请求...');
            console.log('用户数据请求失败,' + JSON.stringify(msg));
        }
    });
}



function addHoverDom(treeId, treeNode) {


    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#upBtn_" + treeNode.tId).length > 0) return;

    var addStr = "";


    addStr += "<span id='addBtn_" + treeNode.tId + "'  groupId='" + treeNode.VehGroupID + "'  VehGroupName='" + treeNode.VehGroupName + "' name='" + treeNode.VehGroupName + "'  class='button add' title='添加车组'  onclick='addChildGroup(" + treeNode.VehGroupID + ",this)'  ></span>";
    addStr += "<span id='upBtn_" + treeNode.tId + "' class='button edit' title='修改'     onclick='editGroup(" + treeNode.VehGroupID + ")'  ></span>";
    addStr += "<span id='delBtn_" + treeNode.tId + "' VehGroupName='" + treeNode.VehGroupName + "' class='button remove' title='删除'    onclick='delGroup(" + treeNode.VehGroupID + ",this)' ></span>";
    addStr += "<span id='addVeh_" + treeNode.tId + "' name='" + treeNode.VehGroupName + "'  class='button bind' title='添加车辆'   onclick='addVeh(" + treeNode.VehGroupID + ",this)'></span>";
    if (treeNode.VehGroupID == _groupId) {
        addStr = "";
    }
    sObj.after(addStr);
};

function removeHoverDom(treeId, treeNode) {

    $("#addBtn_" + treeNode.tId).unbind().remove();
    $("#upBtn_" + treeNode.tId).unbind().remove();
    $("#delBtn_" + treeNode.tId).unbind().remove();
    $("#addVeh_" + treeNode.tId).unbind().remove();

}

function editGroup(vehGroupID) {
    layer.open({
        id: 'editGroup',
        title: ['修改车组', 'font-size:18px;'],
        skin: 'layui-layer-lan',//layui-layer-lan
        area: ['745px', '480px'],
        icon: 1,
        fixed: true,//即鼠标滚动时，层是否固定在可视区域。如果不想，设置fixed: false即可
        offset: '10px',//offset: ['100px', '50px']
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        content: ['Base/EditGroup.html?&id=' + vehGroupID, 'no'] //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
    });
}

function delGroup(vehGroupID, e) {
    var vehGroupName = $(e).attr("VehGroupName");
    var delGrouplayer = layer.confirm('您确定要删除车组(' + vehGroupName + ')', {
        title: ['删除车组', 'font-size:18px;'],
        btn: ['确定', '取消'] //按钮
    }, function () {
        $.ajax({
            type: 'GET',
            url: '/VehicleInfo/DelVehGroup?userId=' + User.userId + '&token=' + User.token + '&VehGroupID=' + vehGroupID+'&del=',
            dataType: 'json',
            beforeSend: function () {

            },
            success: function (data) {
                if (data.flag == 1) {
                    layer.close(delGrouplayer);
                    loadPage();
                }
                else {
                    layer.msg(data.msg, { time: 5000, btn: ['确认'] });
                }

            },
            error: function (msg) {
                layer.close(delGrouplayer);
                console.log('删除车组失败,' + JSON.stringify(msg));
            }
        });
    }, function () {
        layer.close(delUserlayer);
    });

}

function addVeh(vehGroupID,e) {
    var vehGroupName = $(e).attr("name");
    layer.open({
        id: 'addVeh',
        title: ['添加车辆', 'font-size:18px;'],
        skin: 'layui-layer-lan',//layui-layer-lan
        area: ['980px', '640px'],
        icon: 1,
        // fixed: true,//即鼠标滚动时，层是否固定在可视区域。如果不想，设置fixed: false即可
        offset: '10px',//offset: ['100px', '50px']
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        content: ['Base/AddVeh.html?&id=' + vehGroupID + '&vehGroupName=' + escape(vehGroupName)] //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
    });
}

function addChildGroup(vehGroupID, e) {
    var name = "";
    if ($(e).attr("name") != null && $(e).attr("name") != "") {
        name = $(e).attr("name");
    }
    AddGroup(vehGroupID, name);




}



//
function AddGroup(theUpdateGroupID, groupName) {
    layer.open({
        id: 'addGroup',
        title: ['添加车组', 'font-size:18px;'],
        skin: 'layui-layer-lan',//layui-layer-lan
        area: ['570px', '500px'],
        icon: 1,
        fixed: true,//即鼠标滚动时，层是否固定在可视区域。如果不想，设置fixed: false即可
        offset: '10px',//offset: ['100px', '50px']
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        content: ['Base/AddGroup.html?&id=' + theUpdateGroupID + '&groupName=' + escape(groupName), 'no'] //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
    });
}

function closeFrame(id, value) {
    if (id!="") {
        loadPage();
    }
}


function closeFrameVeh() {

}










