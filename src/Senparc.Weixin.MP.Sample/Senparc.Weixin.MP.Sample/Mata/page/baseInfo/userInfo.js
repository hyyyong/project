var vehiStatus = [];
var m_userObj = null;//最高层用户数据集合
var m_userId = 0;//当前用户id
var User;
var layer;
$(function () {
    layui.use('layer', function () {
        layer = layui.layer;
    })
    User = $.parseJSON($.cookie("User"));
    setTimeout(loadUserPage, 50);
})





//================================用户操作区==========================================================================
function loadUserPage() {
    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();
    //2.初始化Button的点击事件
    var oButtonInit = new ButtonInit();
    oButtonInit.Init();
    //loadReportTableWidth();
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
    $("#container").height($("#container1")[0].clientHeight+40);
    $("#left").height($("#container1")[0].clientHeight - 100);

}

var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#userInfoTable').bootstrapTable({
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
            //showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            height: 657,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
           // showToggle: true,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            columns: [{
                checkbox: true
            }, {
                field: 'userName',
                title: '用户名'
            }, {
                field: 'passWord',
                title: '密码'
            }, {
                field: 'ownerName',
                title: '联系人'
            }, {
                field: 'phone',
                title: '联系电话'
            }, {
                field: 'memo',
                title: '客户名称'
            }, {
                field: 'parentName',
                title: '上级账户'
            }, {
                field: 'parentMemo',
                title: '上级客户'
            }, {
                field: 'operation',
                title: '操作',
                width: '160'
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
//根据用户ID获取用户下的所有用户到Table中
function getUser(userid) {
    $.ajax({
        type: 'GET',
        url: '/UserInfo/GetUserInfoList',
        data: { "userId": User.userId, "token": User.token, "id": userid },
        dataType: 'json',
        beforeSend: function () {

        },
        success: function (data) {
            setUserList(data);

        },
        error: function (msg) {
            setTimeout(function () { getUser(userid); }, 3000);
            console.log('用户数据请求失败,' + JSON.stringify(msg));
        }
    });
}
function setUserList(data) {
    if (data.flag == 1) {//登陆成功
        //layer.msg('用户请求成功', { icon: 1 });
        var userType = "";
        $.each(data.obj, function (index) {

            this.index = index + 1;
            this.operation = "";
            switch (this.accountType) {
                case 0:
                case 1:
                    userType = "客户";
                    this.operation = '<div id=' + this.userId + ' style="white-space:nowrap;"><a  data-toggle="modal" userId="' + this.userId + '"corpName="' + this.memo + '" name="' + this.userName + '" accountType="' + this.accountType + '"onclick="addChildUser(' + this.userId + ',this)" style="white-space:nowrap;color:#165082;">新增用户</a>|'
  + '<a class="edit" data-toggle="modal" userId="' + this.userId + '"onclick="editUser(' + this.userId + ')"style="white-space:nowrap;color: #165082;">修改</a>|'
  + '<a class="del" data-toggle="modal" userId="' + this.userId + '" name="' + this.userName + '"  onclick="delUser(' + this.userId + ',this)" style="white-space:nowrap;color: #165082;">删除</a>';
                    //this.operation += '|<a class="bindGroup" data-toggle="modal" userId="' + this.userId + '"   onclick="bindVehGroup(' + this.userId + ',this)"  style="white-space:nowrap;color: #165082;">绑定</a>';
                    break;
                case 2:
                    userType = "用户";
                    this.operation = '<div id=' + this.userId + '>'
                        //+'<a  data-toggle="modal" userId="' + this.userId + '"   corpName="' + this.memo + '" name="' + this.userName + '"   onclick="addChildUser(' + this.userId + ',this)"   style="white-space:nowrap;   color: #165082;">新增用户</a>|'
  + '<a class="edit" data-toggle="modal" userId="' + this.userId + '"   onclick="editUser(' + this.userId + ')"   style="white-space:nowrap;    color: #165082;">修改</a>|'
  + '<a class="del" data-toggle="modal" userId="' + this.userId + '" name="' + this.userName + '"    onclick="delUser(' + this.userId + ',this)" style="white-space:nowrap;  color: #165082;">删除</a>';
                    //this.operation += '|<a class="bindGroup" data-toggle="modal" userId="' + this.userId + '"   onclick="bindVehGroup(' + this.userId + ')"  style="white-space:nowrap;color: #165082;">绑定</a>';
                    break;

                    //              case 3:
                    //                  userType = "管理员";
                    //                  this.operation = '<div id=' + this.userId + '><a  data-toggle="modal" userId="' + this.userId + '"   corpName="' + this.memo + '" name="' + this.userName + '"   onclick="addChildUser(' + this.userId + ',this)"   style="white-space:nowrap;   color: #165082;">新增用户</a>|'
                    //+ '<a class="edit" data-toggle="modal" userId="' + this.userId + '"   onclick="editUser(' + this.userId + ')"   style="white-space:nowrap;    color: #165082;">修改</a>|'
                    //+ '<a class="del" data-toggle="modal" userId="' + this.userId + '"  name="' + this.userName + '"    onclick="delUser(' + this.userId + ',this)" style="white-space:nowrap;color: #165082;">删除</a>';
                    //                  break;
                    //              case 4:
                    //                  userType = "监控员";
                    //                  this.operation = '<div id=' + this.userId + '><a  data-toggle="modal" userId="' + this.userId + '"   corpName="' + this.memo + '" name="' + this.userName + '"   onclick="addChildUser(' + this.userId + ',this)"   style=" white-space:nowrap;  color: #165082;">新增用户</a>|'
                    //+ '<a class="edit" data-toggle="modal" userId="' + this.userId + '"   onclick="editUser(' + this.userId + ')"   style=" white-space:nowrap;   color: #165082;">修改</a>';
                    //                  break;
            }
            this.operation += '</div>';
            if (this.accountType == 0) {
                this.operation = "";
            }
            this.userType = userType;

        })
        $("#userInfoTable").bootstrapTable('load', data.obj);

    } else {
        console.log('用户数据请求失败,' + data.msg);
    }
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
            name: "userName",
        },
        simpleData: {
            enable: true,
            idKey: "userId",
            pIdKey: "parentId",
            rootPId: null
        }
    },
    callback: {
        onClick: function (event, treeId, treeNode) {

            if (m_userObj != null && (m_userId == 0 || Number(m_userId) == Number(treeNode.userId))) {
                setUserList(m_userObj);
                m_userId = treeNode.userId;
            } else {
                getUser(treeNode.userId);
            }
        }
    }
}


//搜索功能
var namelist = [];
// 加载树
var loadTree = function (userid) {
    UserBing(userid);
}

var UserBing = function (userid) {
    $.ajax({
        type: 'GET',
        url: '/UserInfo/GetUserInfoList',
        data: { "userId": User.userId, "token": User.token, "id": userid },
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 60000,                              //请求超时时间
        cache: false,                               //是否缓存上一次的请求数据
        async: false,                                //是否异步
        beforeSend: function () {
            //alert('请求之前');
        },
        success: function (data) {
            m_userObj = data;
            if (data.flag == 1) {//登陆成功
                try {
                    var obj = [];
                    namelist = [];
                    $.each(data.obj, function (i) {
                        var b = data.obj[i];
                        b.icon = "/Mata/img/monitor/base_user.png";
                        namelist.push(this);
                        obj.push(b)
                    });
                    tree = $.fn.zTree.init($("#usertree"), setting, obj);
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
                    //  setTimeout(function () { xUserbin(); }, 3000);
                }
                setUserList(m_userObj);
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
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0 || $("#upBtn_" + treeNode.tId).length > 0) return;

    var addStr = "";

    switch (treeNode.accountType) {
        case 0:
            //"系统账号";
            addStr += "<span id='addBtn_" + treeNode.tId + "'  userId='" + treeNode.userId + "'  memo='" + treeNode.memo + "' name='" + treeNode.userName + "'  accountType='" + treeNode.accountType + "'  class='button add' title='添加客户'  onclick='addChildUser(" + treeNode.userId + ",this)'  ></span>";
            //addStr += "<span id='upBtn_" + treeNode.tId + "' class='button edit' title='修改'     onclick='editUser(" + treeNode.userId + ")'  ></span>";
            //addStr += "<span id='delBtn_" + treeNode.tId + "'name='" + treeNode.userName + "' class='button remove' title='删除'    onclick='delUser(" + treeNode.userId + ",this)' ></span>";
            //addStr += "<span id='addVeh_" + treeNode.tId + "' class='button bind' title='绑定'   onclick='bindVehGroup(" + treeNode.parentId + "," + treeNode.userId + ")'></span>";
            break;
        case 1:
            //  "客户system";
            addStr += "<span id='addBtn_" + treeNode.tId + "'  userId='" + treeNode.userId + "'  corpName='" + treeNode.memo + "' name='" + treeNode.userName + "'  accountType='" + treeNode.accountType + "'  class='button add' title='新增用户'  onclick='addChildUser(" + treeNode.userId + ",this)'  ></span>";
            addStr += "<span id='upBtn_" + treeNode.tId + "' class='button edit' title='修改'     onclick='editUser(" + treeNode.userId + ")'  ></span>";
            addStr += "<span id='delBtn_" + treeNode.tId + "'name='" + treeNode.userName + "' class='button remove' title='删除'    onclick='delUser(" + treeNode.userId + ",this)' ></span>";
            //addStr += "<span id='addVeh_" + treeNode.tId + "' class='button bind' title='绑定'   onclick='bindVehGroup(" + treeNode.parentId + "," + treeNode.userId + ")'></span>";
            break;

        case 2:
            //  "用户system";
            //addStr += "<span id='addBtn_" + treeNode.tId + "'  userId='" + treeNode.userId + "'  corpName='" + treeNode.memo + "' name='" + treeNode.userName + "'  class='button add' title='新增用户'  onclick='addChildUser(" + treeNode.userId + ",this)'  ></span>";
            addStr += "<span id='upBtn_" + treeNode.tId + "' class='button edit' title='修改'     onclick='editUser(" + treeNode.userId + ")'  ></span>";
            addStr += "<span id='delBtn_" + treeNode.tId + "'name='" + treeNode.userName + "' class='button remove' title='删除'    onclick='delUser(" + treeNode.userId + ",this)' ></span>";
            //addStr += "<span id='addVeh_" + treeNode.tId + "' class='button bind' title='绑定'   onclick='bindVehGroup(" + treeNode.parentId + "," + treeNode.userId + ")'></span>";
            break;
            //case 3:
            //    // "管理员";
            //    addStr += "<span id='addBtn_" + treeNode.tId + "'  userId='" + treeNode.userId + "'  corpName='" + treeNode.memo + "' name='" + treeNode.userName + "'  class='button add' title='新增管理员'  onclick='addChildUser(" + treeNode.userId + ",this)'  ></span>";
            //    addStr += "<span id='upBtn_" + treeNode.tId + "' class='button edit' title='修改'     onclick='editUser(" + treeNode.userId + ")'  ></span>";
            //    addStr += "<span id='delBtn_" + treeNode.tId + "'name='" + treeNode.userName + "' class='button remove' title='删除'    onclick='delUser(" + treeNode.userId + ",this)' ></span>";
            //    break;

            //case 4:
            //    // "监控员";
            //    addStr += "<span id='addBtn_" + treeNode.tId + "'  userId='" + treeNode.userId + "'  corpName='" + treeNode.memo + "' name='" + treeNode.userName + "'  class='button add' title='新增监控员'  onclick='addChildUser(" + treeNode.userId + ",this)'  ></span>";
            //    addStr += "<span id='upBtn_" + treeNode.tId + "' class='button edit' title='修改'     onclick='editUser(" + treeNode.userId + ")'  ></span>";
            //    break;
    }
    if (treeNode.userId == m_userId) {
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

function editUser(userId) {

    layer.open({
        id: 'editUser',
        title: ['修改用户', 'font-size:18px;'],
        skin: 'layui-layer-lan',//layui-layer-lan
        area: ['680px', '545px'],
        icon: 1,
        fixed: true,//即鼠标滚动时，层是否固定在可视区域。如果不想，设置fixed: false即可
        //offset: '10px',//offset: ['100px', '50px']
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        content: ['editUser.html?&id=' + userId, 'no'] //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
    });


}

function delUser(userId, e) {
    var userName = $(e).attr("name");

    var delUserlayer = layer.confirm('您确定要删除(' + userName + ')用户', {
        title: ['删除用户', 'font-size:18px;'],
        btn: ['确定', '取消'] //按钮
    }, function () {
        $.ajax({
            type: 'GET',
            url: '/UserInfo/DelUser?userId=' + User.userId + '&token=' + User.token + '&id=' + userId,

            dataType: 'json',
            beforeSend: function () {

            },
            success: function (data) {
                if (data.flag == 1) {
                    layer.close(delUserlayer);
                    loadUserPage();
                }
                else {
                    layer.msg(data.msg, { time: 5000, btn: ['确认'] });
                }

            },
            error: function (msg) {

                console.log('用户数据请求失败,' + JSON.stringify(msg));
            }
        });
    }, function () {
        layer.close(delUserlayer);
    });


}

function bindVehGroup(parentId, userId) {
    //if (parentId==null) {
    //    layer.msg("最高用户已拥有该账号下所有车站！不需要在绑定", { time: 5000, btn: ['确认'] }); return;
    //}

    layer.open({
        id: 'binVehGroup',
        title: ['选择绑定车组', 'font-size:18px;'],
        skin: 'layui-layer-lan',//layui-layer-lan
        area: ['600px', '450px'],
        icon: 1,
        fixed: true,//即鼠标滚动时，层是否固定在可视区域。如果不想，设置fixed: false即可
        //offset: '10px',//offset: ['100px', '50px']
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        content: ['bindVehGroup.html?&userId=' + userId, 'no'] //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
    });

}
function addChildUser(userId, e) {

    layer.open({
        id: 'addUser',
        title: ['添加用户', 'font-size:18px;'],
        skin: 'layui-layer-lan',//layui-layer-molv
        area: ['680px', '545px'],
        icon: 1,
        fixed: true,//即鼠标滚动时，层是否固定在可视区域。如果不想，设置fixed: false即可
        //offset: '10px',//offset: ['100px', '50px']
        type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
        content: ['addUser.html?&id=' + userId + "&name=" + escape($(e).attr("name"))+"&accountType="+ escape($(e).attr("accountType")), 'no'] //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
    });

}

function closeFrame(id, value, name) {
    if (id == "binVehGroup") {
        var ss = "";
    }
    if (id != "") {
        loadUserPage();
    }

}





//================================用户操作区==========================================================================









