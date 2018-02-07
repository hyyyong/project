var User;
$(function () {
    User = $.parseJSON($.cookie("User"));
    var userId = getQueryString("userId");  
    //getUser(id);
    getVehGroupByUserId(userId);
    getBindGroupByUser(userId);

   

})

function onCancelClick() {
    window.parent.closeFrame("", "");
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭  
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
        // data: { "userId": userId },
        beforeSend: function () {
            //layer.msg('请求之前:' + JSON.stringify(userId), { icon: 3 });
        },
        success: function (data) {
            if (data.flag == 1) {
                //data.obj.push({ groupId: -1, groupName: "车组管理", parentId: null });

                $.each(data.obj, function () {
                    this.icon = "../../../Images/Main/tree_user.png";
                })
                VehGroup.initData([]);//获取车组数据
                //if (loginUser.userId == userID) {
                //    groupViewlist = data.obj;

                //    if (flag) {
                //        setTimeout(function () {
                //            AllVehGroup.initData(data.obj, "groupView2");                           
                //        }, 800);
                //        flag = false;
                //    }
                //}
                AllVehGroup.initData(data.obj, "groupAllTree");

                //var treeObj = VehGroup.tree;
                //var node = treeObj.getNodeByParam("VehGroupName", "车组管理", null);
                //treeObj.expandNode(node, true, false, true);
                //treeObj.selectNode(node);
            } else {
                //getVehGroupByUser(userID);
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
        //var aObj = $("#" + treeNode.tId + "_a");
        // var addTopDiv = "<img src='../Images/Tree/增加.png' title='添加部门成员' onclick='treeControl(this,0)'>";
        //var addDiv;
        //addDiv = document.createElement('img')
        //addDiv.setAttribute('src', '../Images/Tree/增加.png')
        //addDiv.setAttribute('title', '添加部门成员')
        //addDiv.onclick = function () { btnIsert(treeNode); }

        //aObj.after(addDiv);
    }
    //tree设置
    var setting = {
        treeId: "",
        treeObj: "",
        check: {
            enable: true,
            chkboxType: { "Y": "s", "N": "s" },
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
            //onClick: onTreeClick, //点击节点事件
            //beforeExpand: zTreeBeforeExpand
            beforeCheck: zTreeBeforeCheck,
            onCheck: zTreeOnCheck   //勾选节点事件
        }
    }

    //生成部门树结构
    m.initTree = function (data, id) {
        m.tree = $.fn.zTree.init($("#" + id + ""), setting, data);
        m.tree.expandAll(false);//默认折叠所有节点
    }
    return m;
}(AllVehGroup || {});

function zTreeBeforeCheck(treeId, treeNode) {
    //if (treeId == "groupView2") {
    //    var treeObj = $.fn.zTree.getZTreeObj("groupView2");
    //    if (treeNode.checked) {
    //        //取消勾选，同时取消父节点的勾选状态
    //        if (treeNode.parentId != -1) {
    //            treeObj.checkNode(treeNode.getParentNode(), false, false, false);
    //        }
    //    }
    //}
}

//勾选节点事件
function zTreeOnCheck(event, treeId, treeNode) {
    if (treeId == "groupAllTree") {

        var treeObj = VehGroup.tree;
        //先删除所有节点
        var nodes = treeObj.getNodes();
        for (var i = nodes.length; i >= 0; i--) {
            treeObj.removeNode(nodes[i], false);
        }
        //添加左边被勾选的节点到右边
        var treeObj2 = $.fn.zTree.getZTreeObj("groupAllTree");
        //var newArr = treeObj2.transformToArray(treeObj2.getCheckedNodes(true));
        var newArr = treeObj2.getCheckedNodes(true);

        var nodeArr = $.unique(newArr).sort();//去重、排序

        var strgroupId = ",";

        var obj = [];
        $.each(nodeArr, function () {
            if (strgroupId.indexOf("," + this.VehGroupID + ",") == -1) {
                var d = {};
                d.icon = "../../../Images/Main/tree_user.png";
                d.VehGroupName = this.VehGroupName;
                d.VehGroupID = this.VehGroupID;
                d.FVehGroupID = this.FVehGroupID;
                obj.push(d);
                strgroupId += d.VehGroupID + ",";
            }
        });

        VehGroup.initData(obj);//获取车组数据
        //VehGroupS.initData(nodeArr, "groupView");
        //treeObj.addNodes(null, nodeArr);
    }
}

//通过用户ID获取绑定车组树（只是当前用户下车组  不包括子车组）
function getBindGroupByUser(userId) {
    var userID = userId;
    $.ajax({
        type: 'Get',
        url: '/VehicleInfo/GetVehGroupList?userId=' + User.userID + '&token=' + User.token + '&id=' + userId,
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 15000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: true,                                //是否异步
        // data: { "userId": userId },
        beforeSend: function () {
            //layer.msg('请求之前:' + JSON.stringify(userId), { icon: 3 });
        },
        success: function (data) {
            if (data.flag == 1) {
                $.each(data.obj, function () {
                    this.icon = "../../../Images/Main/tree_user.png";
                });

                $("#boundGroups").attr("userId", userId);
                VehGroup.initData(data.obj);//获取车组数据
                setCheckNode(data.obj);

            } else {
                //getVehGroupByUser(userID);
                console.log("车组信息获取失败," + data.msg);
            }
        },
        error: function (msg) {
            setTimeout(function () { getVehGroupByUser(userID); }, 3000);
            console.log("车组信息获取失败," + msg.statusText);
        }
    });
}

//绑定车组树信息
var VehGroup = function (m) {
    m.date = [];//数据信息
    m.tree = null;//树形结构
    //*************数据相关*************
    //var VehGroupDate = 
    m.initData = function (Data) {
        //if ((Data.ErrorCode == "undefined" || Data.ErrorCode == undefined) | Data.length > 0) {
        //    parent.initSearch(Data, 'vehGroupTree');
        //}
        m.date = Data;//保存数据
        var start = new Date().getTime();//起始时间
        m.initTree(Data);//生成树结构
        var end = new Date().getTime();//结束时间
        var times = (end - start) + "ms";//返回函数执行需要时间
        console.log("initTree:" + times);

    }
    var addDiyDom = function (treeId, treeNode) {
        //var aObj = $("#" + treeNode.tId + "_a");
        // var addTopDiv = "<img src='../Images/Tree/增加.png' title='添加部门成员' onclick='treeControl(this,0)'>";

        //aObj.after(addDiv);
    }

    //***********树相关*************
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
            //addHoverDom: addHoverDom,
            //removeHoverDom: removeHoverDom,
            //addDiyDom: addDiyDom
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
            //onClick: onTreeClick, //点击节点事件
        }
    }

    //用户已绑定车组树结构
    m.initTree = function (data) {
        m.tree = $.fn.zTree.init($("#groupTree"), setting, data);
        m.tree.expandAll(false);//折叠所有节点
        var nodes = m.tree.transformToArray(m.tree.getNodes());
    }
    return m;
}(VehGroup || {});


function setCheckNode(list) {
    var treeObj = $.fn.zTree.getZTreeObj("groupAllTree");
    treeObj.checkAllNodes(false);
    $.each(list, function () {
        var node = treeObj.getNodeByParam("VehGroupID", this.VehGroupID, null);
        if (node != null) {
            treeObj.checkNode(node, true, false);
        }

    })
}


function onSureClick() {
    var treeObj = $.fn.zTree.getZTreeObj("groupAllTree");
    var nodes = treeObj.getCheckedNodes(true);
    var groupIds = "";
    var arr = [];
    $.each(nodes, function () {
        arr.push(this.VehGroupID);
    });
    groupIds = arr.join(',');
    var name ="";
    if (arr.length>0) {
        name = "已经绑定" + arr.length+"个车组";
    }
    window.parent.closeFrame("binVehGroup", groupIds, name);
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭  
}


