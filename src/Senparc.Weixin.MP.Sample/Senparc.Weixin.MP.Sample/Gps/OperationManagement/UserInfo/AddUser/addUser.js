var fGroupID = -1;
var vehGroupList = "";
var User;
function onCancelClick()
{
    window.parent.closeFrame("", "");
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭  
   
}
$(function () {
    User = $.parseJSON($.cookie("User"));
    var id = getQueryString("id");
    fGroupID = id;
    var userName = getQueryString("name");
    $("#parentName").val(userName);
    //getUser(id);
    $("#btnVehGroupTree").click(function () {
        layer.open({
            id: 'binVehGroup',
            title: ['选择绑定车组', 'font-size:18px;'],
            skin: 'layui-layer-lan',//layui-layer-lan
            area: ['600px', '450px'],
            icon: 1,
            fixed: true,//即鼠标滚动时，层是否固定在可视区域。如果不想，设置fixed: false即可
            offset: '10px',//offset: ['100px', '50px']
            type: 2, //0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）
            content: ['bindVehGroup.html?&userId='+id, 'no'] //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
        });
    });
 
})

function closeFrame(id, value,name) {
    $("#vehGroupName").val(name);
    vehGroupList = value;
}


function onSureClick() {
    if ($("#userName").val().trim() == "") {
        layer.msg("登录账号", { time: 5000, btn: ['确认'] });
        return;
    }
    if ($("#passWord").val().trim() == "") {
        layer.msg("密码", { time: 5000, btn: ['确认'] });
        return;
    }
    if ($("#code").val().trim() == "") {
        layer.msg("客户代码", { time: 5000, btn: ['确认'] }); return;
    }
    if ($("#memo").val().trim() == "") {
        layer.msg("公司名称", { time: 5000, btn: ['确认'] }); return;
    }
    if ($("#phone").val().trim() == "") {
        layer.msg("联系电话", { time: 5000, btn: ['确认'] }); return;
    }
    if ($("#accountType").val().trim() == "") {
        layer.msg("帐号类型", { time: 5000, btn: ['确认'] }); return;
    }
    if ($("#parentName").val().trim() == "") {
        layer.msg("上级账户不能为空", { time: 5000, btn: ['确认'] }); return;
    }
    if ($("#vehGroupName").val().trim() == "") {
        layer.msg("账户车组不能为空", { time: 5000, btn: ['确认'] }); return;
    }
    $.ajax({
        type: 'GET',
        url: '/UserInfo/AddUser',
        dataType: 'json',                           //指定服务器返回的数据类型
        timeout: 15000,                              //请求超时时间
        //    cache: false,                               //是否缓存上一次的请求数据
        //  async: true,                                //是否异步
        data: { "userId": User.userId, "token": User.token, 'userName': $("#userName").val(), 'passWord': $("#passWord").val(), 'code': $("#code").val(), 'memo': $("#memo").val(), 'ownerName': $("#ownerName").val(), 'phone': $("#phone").val(), 'accountType': $("#accountType").val(), 'fGroupID': fGroupID, 'vehGroupID': vehGroupList, 'funcID': "1,2" },
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
            setTimeout(function () { getUser(userid); }, 3000);
            layer.msg('用户数据请求失败，重新请求...');
            console.log('用户数据请求失败,' + JSON.stringify(msg));
        }
    });
}



