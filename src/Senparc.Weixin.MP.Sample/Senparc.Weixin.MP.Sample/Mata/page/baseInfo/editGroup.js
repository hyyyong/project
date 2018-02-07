var m_groupId = -1;
var User;
var m_fVehGroupID = -1;
function onCancelClick() {
    window.parent.closeFrame("", "");
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭  
}
$(function () {
    User = $.parseJSON($.cookie("User"));
    var id = getQueryString("id");
    m_groupId = id;   
    getGroup(id);
})


//根据用户ID获取用户资料
function getGroup(groupId) {
    $.ajax({
        type: 'GET',
        url: '/VehicleInfo/GetVehGroupDetail',
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 60000,                              //请求超时时间
        //    cache: false,                               //是否缓存上一次的请求数据
        //  async: true,                                //是否异步
        data: { "userId": User.userId, "token": User.token, "vehgroupID": groupId },
        beforeSend: function () {
            //alert('请求之前');
        },
        success: function (data) {
            if (data.flag == 1) {//登陆成功
                if (data.obj) {
                    $("#fGroupName").val(data.obj.VehGroupName);
                    $("#groupName").val(data.obj.VehGroupName);
                    $("#contact").val(data.obj.Contact);
                    $("#phone").val(data.obj.Phone);
                    $("#mark").val(data.obj.Mark);
                    m_fVehGroupID = data.obj.fVehGroupID;
                }
            }

        },
        error: function (msg) {
           
            layer.msg('用户数据请求失败，重新请求...');
            console.log('用户数据请求失败,' + JSON.stringify(msg));
        }
    });
}

function onSureClick() {
    if ($("#groupName").val().trim() == "") {
        layer.msg("车组名不能为空！", { time: 2000, btn: ['确认'] }); return;
    }
    if ($("#contact").val().trim() == "") {
        layer.msg("联系人不能为空！", { time: 2000, btn: ['确认'] }); return;
    }
    if ($("#phone").val().trim() == "") {
        layer.msg("联系电话不能为空！", { time: 2000, btn: ['确认'] }); return;
    }


    $.ajax({
        type: 'GET',
        url: '/VehicleInfo/EditVehGroup',
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 15000,                              //请求超时时间
        //    cache: false,                               //是否缓存上一次的请求数据
        //  async: true,                                //是否异步
        data: { "userId": User.userId, "token": User.token, 'VehGroupID': m_groupId, 'VehGroupName': $("#groupName").val(), 'Contact': $("#contact").val(), 'phone': $("#phone").val(), 'mark': $("#mark").val(), 'fVehGroupID': m_fVehGroupID },
        beforeSend: function () {
            //alert('请求之前');
        },
        success: function (data) {
            if (data.flag == 1) {//登陆成功
                layer.msg(data.msg, {
                    time: 5000, //2s后自动关闭
                    btn: ['确认']
                })
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
            setTimeout(function () { getUser(userid); }, 3000);
            layer.msg('用户数据请求失败，重新请求...');
            console.log('用户数据请求失败,' + JSON.stringify(msg));
        }
    });
}