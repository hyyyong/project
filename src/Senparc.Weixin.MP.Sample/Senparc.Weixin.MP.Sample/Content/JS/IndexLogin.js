
      
        
$(function () {
    
 
              if (!localStorage["cphby"]) {
                  $('#div_login').css("display", "block");
                  $('#div_loginTrue').css("display", "none");
              }
              else {
                  $('#div_login').css("display", "none");
                  $('#div_loginTrue').css("display", "block");
              }
              $('#dislogin').click(function () {


                  $('#div_loginTrue').css("display", "none");
                  $('#div_login').css("display", "block");
                  localStorage.removeItem('cphby');
                  localStorage.removeItem('vehidby');
              })

             
              $("#login").click(function () {
                  var userName = $('#userName').val();
                  var userPwd = $('#userPwd').val();
                  var wxid = $('#wxid').val();
                 
                  //asyncbox.alert("正在登陆", "提示");
                  if ($.trim($("#userName").val()) == "") {
                      asyncbox.alert("用户名不能为空", "提示");
                      return false;
                  }

                  if ($.trim($("#userPwd").val()) == "") {
                      asyncbox.alert("密码不能为空", "提示");
                      return false;
                  }
                  var data = {};
                  data["a[0]"] = userName;
                  data["a[1]"] = userPwd;
                  data["a[2]"] = wxid;
                  data["a[3]"] = "1";

                  $.post("/OAuth2/IndexLoginBtn", data, function (ser) {
                      var json = jQuery.parseJSON(ser)
                      if (json.msg == "1") {
                          $('#div_login').css("display", "none");
                          $('#div_loginTrue').css("display", "block");
                         
                          $('#div_loginTrue').val("绑定成功");

                          //登录成功，获取到用户信息
                          localStorage.removeItem("cphby");
                          localStorage.removeItem("vehidby");
                          //重写缓存
                          localStorage.setItem("cphby", json.content);
                          localStorage.setItem("vehidby", json.vehid);
                          // ie8 火狐必须设置时间 否则在关闭浏览器后cookie丢失
                          $.cookie("cphby", json.content, { expires: 30 });
                          $.cookie("vheidby", json.vehid, { expires: 30 });
                          // window.location = "Main.html";
                      }
                      else {
                          asyncbox.alert(ser, "提示");
                      }
                  });
              });

          });
