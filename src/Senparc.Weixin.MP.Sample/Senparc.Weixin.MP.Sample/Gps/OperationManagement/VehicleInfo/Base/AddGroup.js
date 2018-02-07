var m_groupId = -1;

function onCancelClick() {
    window.parent.closeFrame("", "");
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭  
}
$(function () {
    var id = getQueryString("id");
    m_groupId = id;
    var groupName = getQueryString("groupName");
    $("#fGroupName").val(groupName);
    //getUser(id);
})
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
        url: '/VehicleInfo/AddVehGroup',
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 15000,                              //请求超时时间
        //    cache: false,                               //是否缓存上一次的请求数据
        //  async: true,                                //是否异步
        data: { "userId": '', 'VehGroupName': $("#groupName").val(), 'Contact': $("#contact").val(), 'phone': $("#phone").val(), 'mark': $("#mark").val(), 'fVehGroupID': m_groupId },
        beforeSend: function () {
            //alert('请求之前');
        },
        success: function (data) {
            if (data.flag == 1) {//登陆成功
                layer.msg(data.msg, {
                    time: 2000, //2s后自动关闭
                    btn: ['确认']
                })
                window.parent.closeFrame("addGroup", "");
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