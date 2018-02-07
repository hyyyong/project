
var userid = "";
var User;
var layer;

   
function onCancelClick()
{
    window.parent.closeFrame("", "");
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭  
}


$(function () {
    layui.use('layer', function () {
        layer = layui.layer;
    })
    User = $.parseJSON($.cookie("User"));
    var id = getQueryString("id");
    userid = id;
    getUser(id);
   
})


//根据用户ID获取用户资料
function getUser(userid) {
    $.ajax({
        type: 'GET',
        url: '/UserInfo/GetUserInfo',
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 60000,                              //请求超时时间
        //    cache: false,                               //是否缓存上一次的请求数据
        //  async: true,                                //是否异步
        data: { "userId": User.userId, "token": User.token, "id": userid },
        beforeSend: function () {
            //alert('请求之前');
        },
        success: function (data) {
            if (data.flag == 1) {//登陆成功
                if (data.obj) {

                    if (data.obj.accountType==1) {
                        $("#accountType").append("<option value='" + 1 + "'>" + "客户" + "</option>");
                        $("#accountType").append("<option value='" + 2 + "'>" + "管理员" + "</option>");
                        $("#accountType").append("<option value='" + 3 + "'>" + "监控人员" + "</option>");
                    } else if (data.obj.accountType == 2) {

                        $("#accountType").append("<option value='" + 2 + "'>" + "管理员" + "</option>");
                        $("#accountType").append("<option value='" + 3 + "'>" + "监控人员" + "</option>");
                    }
                    else {
                        $("#accountType").append("<option value='" + 3 + "'>" + "监控人员" + "</option>");
                    }

                

                    $("#userName").val(data.obj.userName);
                    $("#passWord").val(data.obj.passWord);
                    $("#code").val(data.obj.code);
                    $("#memo").val(data.obj.memo);
                    $("#OwnerName").val(data.obj.ownerName);
                    $("#phone").val(data.obj.phone);
                    $("#accountType").val(data.obj.accountType);
                    $("#parentName").val(data.obj.parentName);                   
                    $("#parentmemo").val(data.obj.parentMemo);
                }
            }

        },
        error: function (msg) {
            setTimeout(function () { getUser(userid); }, 3000);
            layer.msg('用户数据请求失败，重新请求...');
            console.log('用户数据请求失败,' + JSON.stringify(msg));
        }
    });
}

function onSureClick() {
    if ( $("#userName").val().trim()=="") {
        layer.msg("登录账号", { time: 5000, btn: ['确认'] }); return;
    }
    if ($("#passWord").val().trim() == "") {
        layer.msg("密码", { time: 5000, btn: ['确认'] }); return;
    }
    if ($("#code").val().trim() == "") {
        layer.msg("客户代码", { time: 5000, btn: ['确认'] }); return;
    }
    if ($("#memo").val().trim() == "") {
        layer.msg("公司名称", { time: 5000, btn: ['确认'] }); return;
    }
    if ($("#OwnerName").val().trim() == "") {
        layer.msg("联系人", { time: 5000, btn: ['确认'] }); return;
    }
    if ($("#phone").val().trim() == "") {
        layer.msg("联系电话", { time: 5000, btn: ['确认'] }); return;
    }
    if ($("#accountType").val().trim() == "") {
        layer.msg("帐号类型", { time: 5000, btn: ['确认'] }); return;
    }
 
    $.ajax({
        type: 'GET',
        url: '/UserInfo/EditUserInfo',
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 15000,                              //请求超时时间
        //    cache: false,                               //是否缓存上一次的请求数据
        //  async: true,                                //是否异步
        data: { "userId": User.userId, "token": User.token, "id": userid, 'userName': $("#userName").val(), 'passWord': $("#passWord").val(), 'code': $("#code").val(), 'memo': $("#memo").val(), 'phone': $("#phone").val(), 'accountType': $("#accountType").val(), 'OwnerName': $("#OwnerName").val() },
        beforeSend: function () {
            //alert('请求之前');
        },
        success: function (data) {
            if (data.flag == 1) {//登陆成功
                layer.msg(data.msg, {
                    time: 2000, //2s后自动关闭
                    btn: ['确认']
                });
                window.parent.closeFrame("editUser", "");
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
           
            layer.msg('修改用户失败，请重新请求...');
            console.log('用户数据请求失败,' + JSON.stringify(msg));
        }
    });
}