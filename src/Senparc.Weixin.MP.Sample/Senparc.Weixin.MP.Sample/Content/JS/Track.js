 var map2;
 var icon2;
 var mkr;
var direction;



 $(function(){
 	if(!localStorage["cphby"]){
 	    //window.location.href='Login.html'
 	    window.location.href = "IndexLogin?" + $('#wxid').val();
 	}

 	myshowSwiper=new Swiper('#myshow_swipe',{
 		speed:100,
 		onlyExternal:true,	    	  		
 	}); 

	map2 = new AMap.Map('map2', {
	    resizeEnable: true,
	    zoom:12,
	    center: [114.061031,22.540298]
	});
	/*icon2 = new AMap.Icon({
        image : 'imgs/ic_carpark.png',
        size : new AMap.Size(25,40),
        imageSize:new AMap.Size(25,40),
    });*/
	mkr =new AMap.Marker({
 		map:map2,

 		//icon:icon2
 	});


	var $qiuguan = $('.qiuguan');
 	var $dengguan = $('.dengguan');


 	var flag = false;

 	var satellLayer = new AMap.TileLayer.Satellite({zIndex:10}); //实例化卫星图
		//在map中添加卫星图
	$qiuguan.click(function(){
 		if(flag){
 		    $qiuguan.attr('src','../Images/Image/ic_maptype2.png');
 		
 			satellLayer.hide();
 		}else{
 		    $qiuguan.attr('src','../Images/Image/ic_maptype.png');
 			flag = true;

 			satellLayer.setMap(map2); 
 			satellLayer.show();

 		}
 		
 	})
 	

	var trafficLayer = new AMap.TileLayer.Traffic({
        zIndex: 10
    });
    
	

 	$dengguan.click(function(){
 		if(flag){
 		    $dengguan.attr('src','../Images/Image/ic_traffic_0.png');
 			flag = false;
 			trafficLayer.hide();
 		}else{
 		    $dengguan.attr('src','../Images/Image/ic_traffic_1.png');
 			flag = true;
 			trafficLayer.setMap(map2);
 			trafficLayer.show();

 		}
 		
 	})


 	xiang1=function(){
		
		
 	   
 

 	    var data = {};
 	    data["a[0]"] = localStorage["vehidby"];
 	   

 	    $.post("/OAuth2/GetVehDetails", data, function (ser) {

 	        var Daaa = JSON.parse(ser);
 	        if (Daaa.flag == "1") {
 	            alert(Daaa.msg)
 	        }
 	        else { 	           
 	            if (Daaa.Data == "" || Daaa.Data == null) {
 	                alert('没有此车辆数据')
 	            } else {

 	               // var result = "{\"TaxiNo\":\"GPRS_GB型\",\"VehicleType\":\"K9\",\"VehGroupName\":\"HYY\",\"Direction\":\"2\",\"Time\":\"2017-10-24 00:12:26\",\"i\":0,\"ACC\":\"ACC关 \",\"LocalType\":\"未定位\",\"Deviceid\":\"8594\",\"Alarm\":0,\"Angle\":\"90\",\"Velocity\":0,\"direction\":0,\"LastLat\":19.78799,\"LastLng\":110.02066,\"Cph\":141}";

 	                //var item=dddd2.Data[i];

 	                var item = Daaa.Data;
 	                var $xxxx = $('#xxxx');

 	                var $head = $('<div id="header"></div>');
 	                $head.html(item.Cph);
 	                $xxxx.append($head);
 	                var $imgl = $('<img src="../Images/Image/ic_left.png" class="back bk1" />');
 	                var $imgr = $('<img src="../Images/Image/ic_left.png" class="back bk2" />');
 	                $head.append($imgl);
 	                $head.append($imgr);
 	                var $particular = $('<div id="particular"></div>');
 	                $xxxx.append($particular);
 	                var $divv1 = $('<div class="kuai1"></div>')
 	                $particular.append($divv1);
 	                var $div = $('<div class="toubu"></div>');
 	                $div.html('车辆资料');
 	                $divv1.append($div);
 	                var $ull1 = $('<ul></ul>');
 	                $divv1.append($ull1);
 	                var $li = $('<li>车牌号码：</li>');
 	                $ull1.append($li);
 	                var $span = $('<span></span>');
 	                $span.html(item.Cph);
 	                $li.append($span);
 	                var $li = $('<li>车辆类型：</li>');
 	                $ull1.append($li);
 	                var $span = $('<span></span>');
 	                $span.html(item.VehicleType);
 	                $li.append($span);
 	                var $li = $('<li>终端类型：</li>');
 	                $ull1.append($li);
 	                var $span = $('<span></span>');
 	                $span.html(item.TaxiNo);
 	                $li.append($span);
 	                var $li = $('<li>车组名称：</li>');
 	                $ull1.append($li);
 	                var $span = $('<span></span>');
 	                $span.html(item.VehGroupName)
 	                $li.append($span);
 	                var $li = $('<li>终端号码：</li>');
 	                $ull1.append($li);
 	                var $span = $('<span></span>');
 	                $span.html(item.Deviceid);
 	                $li.append($span);

 	                var $particular = $('#particular');
 	                var $divv2 = $('<div class="kuai2"></div>')
 	                $particular.append($divv2);
 	                var $div = $('<div class="toubu"></div>');
 	                $div.html('定位信息');
 	                $divv2.append($div);
 	                var $ull2 = $('<ul class="ul2"></ul>')
 	                $divv2.append($ull2);
 	                var $li = $('<li>时间：</li>');
 	                $ull2.append($li);
 	                var $span = $('<span></span>');
 	                $span.html(item.Time);
 	                $li.append($span);
 	                var $li = $('<li>经度：</li>');
 	                $ull2.append($li);
 	                var $span = $('<span></span>');
 	                $span.html(item.LastLng);
 	                $li.append($span);
 	                var $li = $('<li>纬度：</li>');
 	                $ull2.append($li);
 	                var $span = $('<span></span>');
 	                $span.html(item.LastLat);
 	                $li.append($span);
 	                var $li = $('<li>速度：</li>');
 	                $ull2.append($li);
 	                var $span = $('<span></span>');
 	                $span.html(item.Velocity + '.0Km/h');
 	                $li.append($span);
 	                var $li = $('<li>方向：</li>');
 	                $ull2.append($li);
 	                var $span = $('<span></span>');
 	                $span.html(direction);
 	                $li.append($span);
 	                var $li = $('<li>里程：</li>');
 	                $ull2.append($li);
 	                var $span = $('<span></span>');
 	                $span.html(item.Direction + 'Km');
 	                $li.append($span);

 	                var $particular = $('#particular');
 	                var $divv3 = $('<div class="kuai3"></div>')
 	                $particular.append($divv3);
 	                var $div = $('<div class="toubu"></div>');
 	                $div.html('动态信息');
 	                $divv3.append($div);
 	                var $ull3 = $('<ul></ul>')
 	                $divv3.append($ull3);
 	                var $li = $('<li>ACC状态：</li>');
 	                $ull3.append($li);
 	                var $span = $('<span></span>');
 	                $span.html(item.ACC);
 	                $li.append($span);
 	                var $li = $('<li>定位状态：</li>');
 	                $ull3.append($li);
 	                var $span = $('<span></span>');
 	                $span.html(item.LocalType);
 	                $li.append($span);
 	                var $li = $('<li>剩余电量：</li>');
 	                $ull3.append($li);
 	                var $span = $('<span></span>');
 	                if (item.TaxiNo == "A5B" || item.TaxiNo == "A5C" || item.TaxiNo == "A5C-3" || item.TaxiNo == "A5BC-5" || item.TaxiNo == "A5D" || item.TaxiNo == "A5E" || item.TaxiNo == "A5H" || item.TaxiNo == "Acar") {
 	                    $span.html(item.RemainingBattery);
 	                } else {
 	                    $span.html('--');
 	                }

 	                $li.append($span);

 	                var $particular = $('#particular');
 	                var $divv4 = $('<div class="kuai4"></div>')
 	                $particular.append($divv4);
 	                var $div = $('<div class="toubu"></div>');
 	                $div.html('报警信息');
 	                $divv4.append($div);
 	                var $ull4 = $('<ul class="ul4"></ul>')
 	                $divv4.append($ull4);

 	                var $li = $('<li>报警：</li>');
 	                var $span = $('<span></span>');
 	                $li.append($span);
 	                $span.html(item.Alarm);
 	                $ull4.append($li);

 	                $('.bk1').css('display', 'none');
 	                var $bk2 = $('.bk2');
 	                $bk2.click(function () {
 	                    myshowSwiper.slideTo(0);
 	                })


 	            }
 	        }
	    })

 		
	}


	shuaxin();
	setInterval("shuaxin()",30000);










 })






function setIcon(ImgState, isOnline) {
    var icon = null;
    if (isOnline == 1) {
        switch (ImgState) {
            case 0:
                icon = new AMap.Icon({
                    size : new AMap.Size(20,20),
        			imageSize:new AMap.Size(20,20), //图标大小   停车
                    //                    image: "../Images/car/gray/car" + nIndex.toString() + ".png"
        			image: "../Images/Image/ic_carpark.png"
                });
                break;
            case 1:
                icon = new AMap.Icon({
                    size : new AMap.Size(20,20),
        			imageSize:new AMap.Size(20,20), //图标大小    行驶
                    //                    image: "../Images/car/green/car" + nIndex.toString() + ".png"
        			image: "../Images/Image/ic_caronline.png"
                });
                break;
            case 2:
                icon = new AMap.Icon({
                    size : new AMap.Size(20,20),
        			imageSize:new AMap.Size(20,20), //图标大小        报警
        			image: "../Images/Image/ic_caralarm.png"

                });
                break;
            default:
                break;
        }
    }
    else {
        icon = new AMap.Icon({
            size : new AMap.Size(20,20),
        	imageSize:new AMap.Size(20,20),//图标大小  //离线
        	image: "../Images/Image/ic_caroffline.png"

        });
    }
    return icon;
}











var clickxiang = 0;//初始化点击状态

function gexiangxi(){
	if(clickxiang == 1){
		
		myshowSwiper.slideTo(2);
	}else{
		
		clickxiang=1;
		myshowSwiper.slideTo(2);
		xiang1();
	}
	
 } 

 var address;

 function shuaxin(){
 						
		//map.clearMap();
     mkr.setMap(null);
     return;
     $.post("/OAuth2/GetVehDetails", data, function (ser) {

	 //   $.get('/v1/DBInfo',{cph:localStorage["cphby"]},function(result){
		var result = "{\"TaxiNo\":\"GPRS_GB型\",\"VehicleType\":\"K9\",\"VehGroupName\":\"HYY\",\"Direction\":\"2\",\"Time\":\"2017-10-24 00:12:26\",\"i\":0,\"ACC\":\"ACC关 \",\"LocalType\":\"未定位\",\"Deviceid\":\"8594\",\"Alarm\":0,\"Angle\":\"90\",\"Velocity\":0,\"direction\":0,\"LastLat\":19.78799,\"LastLng\":110.02066,\"Cph\":141}";
	 		//var dddd2=JSON.parse(result);
	 		
		 	
		 	    var item = JSON.parse(result);
		 		var lng = parseFloat(item.LastLng),Lat = parseFloat(item.LastLat);
				map2.setCenter([lng,Lat]); 
			 	mkr.setPosition([lng,Lat]); 
			 	mkr.setAngle(parseFloat(item.Angle));
			 	if(item.Velocity==0){
					var isOnline = 1 ;var ImgState = 0;
				}else if(item.Velocity>0){
					var isOnline = 1 ;var ImgState = 1;
				}else if(item.Alarm=="超速报警"){
					var isOnline = 1 ;var ImgState = 2;
				}else{
					var isOnline = 0;
				}
			 	mkr.setIcon(setIcon(ImgState, isOnline));

			 	var lnglatXY=[item.LastLng,item.LastLat];//地图上所标点的坐标
			    function regeocoder() {  //逆地理编码
			         var geocoder = new AMap.Geocoder({
			            radius: 1000,
			            extensions: "all"
			        });        
			        geocoder.getAddress(lnglatXY, function(status, result) {
			            if (status === 'complete' && result.info === 'OK') {
			                geocoder_CallBack(result);

			            }
			        });        
			        
			    };
			    if(item.Angle>360){
			    	var sudu = item.Angle%360;
			    }else{
			    	var sudu = item.Angle;
			    }
			    if(sudu==0 || sudu==360){
			    	direction = "北";
			    }else if(sudu>0 && sudu<90){
			    	direction = "东北";
			    }else if(sudu==90){
			    	direction = "东";
			    }else if(sudu>90 && sudu<180){
			    	direction = "东南";
			    }else if(sudu==180){
			    	direction = "南";
			    }else if(sudu>180 && sudu<270){
			    	direction = "西南";
			    }else if(sudu==270){
			    	direction = "西";
			    }else if(sudu>270 && sudu<360){
			    	direction = "西北";
			    }
			    function geocoder_CallBack(data) {
			         address = data.regeocode.formattedAddress; //返回地址描述
			         var info456 = new AMap.InfoWindow({
			   		
				   		closeWhenClickMap:true,
				   		content:"<div style='width:180px;font-size:12px;'>"
				   		+"车牌："+item.Cph+"<br/>速度："+item.Velocity+".0Km/h<br/>方向："+direction+"<br/>时间："+item.Time+"<br/>"
				   		+"地址："+address+"</div>"
				   		+"<div style='height:30px;border-top:1px solid #888;width:100%;'>"
				   		+"<a onclick='gexiangxi()' href='javascript:void(0)' style='display:block;font-size:16px;width:100%; height:30px;text-align:center;text-decoration: none;line-height:30px;color:#79C9EE;'>详情</a></div><script></script>"
				   	});
				 	
				 	AMap.event.addListener(mkr,'click',function(){
				 		info456.open(map2,[item.LastLng,item.LastLat]);
				 	});			        
			    }
			    regeocoder();			   
			 	mkr.setMap(map2);

	    })

	//mk.hide();

		
	}