var layer;
$(function () {
    layui.use('layer', function () {
        layer = layui.layer;
    })

    $("#addVehicle").click(function () {
        $.ajax({
            type: 'POST',
            // url: '/gps/AppBase/addVehicel',
            url: '/Monitor/OriginalPost?',
            
            dataType: 'JSON',                           //指定服务器返回的数据类型
            timeout: 15000,                              //请求超时时间
            //    cache: false,                               //是否缓存上一次的请求数据
            //  async: true,                                //是否异步
             data:JSON.stringify({ "userId":1, "brand": "立马", "frameNo": "fhd", 'codeString': "ygzx010013100001001", 'engineNo': "engineNodd", 'image': "", 'nickName': "hhh", 'mark': "marks", 'phone': "13100001001", 'plate': "chepai",'vehicleType': "motuoche",'venderPhone': "13699880099" }),  
           // data: { userId: 1, brand: "立马", frameNo: "fhd", codeString: "ygzx010013100001001", engineNo: "engineNodd", image: "", nickName: "hhh", mark: "marks", phone: "13100001001", plate: "chepai", vehicleType: "motuoche", venderPhone: "13699880099" },
            // data: {'codeString': "ygzx010013100001001"},
            contentType: 'application/json',
            beforeSend: function () {
                //alert('请求之前');
            },
            success: function (data) {
                if (data.flag == 1) {//登陆成功
                    layer.msg(data.msg, {
                        time: 2000, //2s后自动关闭
                        btn: ['确认']
                    });                   
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
              
            }
        });
    });
});