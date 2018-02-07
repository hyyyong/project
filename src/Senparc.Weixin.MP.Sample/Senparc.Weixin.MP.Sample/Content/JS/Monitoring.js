var map3;
var icon22;
var marker;
var playSpeed = 1;
$(function () {

    if (!localStorage["cphby"]) {
        window.location.href = "IndexLogin?" + $('#wxid').val();
    }
    //页面切换
    myshowSwiper = new Swiper('#myshow_swipe', {
        speed: 100,
        onlyExternal: true,
    });

    guigui = function () {
                var $hea = $('.hder');
                $hea.html(localStorage["cphby"]);
                var $img9 = $('<img src="../Images/Image/ic_time.png" class="time"/>');
                $hea.append($img9);
                var $time = $('.time');
                var $shij = $('.shij');
                var ii = false;
                $time.click(function () {
                    if (ii) {
                        ii = false;
                        $shij.css('display', 'none');
                    } else {
                        ii = true;
                        $shij.css('display', 'block');
                    }
                });
                var $content = $('#concon');
                var $last = $('.last');
                $last.click(function () {
                    $content.css('display', 'block');
                    $shij.css('display', 'none');
                    ii = false;
                });
                var $guang = $('#concon span.bi');
                $guang.click(function () {
                    $content.css('display', 'none');
                });


                var myDate = new Date();
                var Y = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
                var M = myDate.getMonth() + 1;       //获取当前月份(0-11,0代表1月)
                var D = myDate.getDate();        //获取当前日(1-31) 
                M = M < 10 ? "0" + M : M
                D = D < 10 ? "0" + D : D

                var star = Y + '-' + M + '-' + D + ' ' + '00' + ':' + '00' + ':' + '00';
                var end = Y + '-' + M + '-' + D + ' ' + '23' + ':' + '59' + ':' + '59';

                var $first = $('.shij .first');
                $first.click(function () {
                    $('.shij').css('display', 'none');
                    ii = false;

                    var data = {};
                    data["a[0]"] = star;
                    data["a[1]"] = end;
                    data["a[2]"] = localStorage["vehidby"];
                    data["a[3]"] = "1";

                    $.post("/OAuth2/GetTrackTwo", data, function (ser) {                      
                        if (ser == "gg") {
                            alert('没有此车辆数据')
                        }
                        else { 
                           // var json = jQuery.parseJSON(ser)
                            var Daaa = JSON.parse(ser);
                            if (Daaa.Data == "" || Daaa.Data==null) {
                                alert('没有此车辆数据')
                            } else {

                                var $cont = $('#cont')
                                var $huifang = $('<div class="huifang"></div>');
                                $cont.append($huifang);
                                var $dl = $('<dl></dl>');
                                $huifang.append($dl);
                                var $dd = $('<dd></dd>');
                                $dd.html('车牌号码：');
                                $dl.append($dd);
                                var $span = $('<span></span>');
                                $span.html(localStorage["cphby"]);
                                $dd.append($span);
                                var $img10 = $('<img src="../Images/Image/ic_delete.png" class="delete"/>');
                                $dd.append($img10);
                                var $dt = $('<dt></dt>');
                                $dl.append($dt);
                                var $ul = $('<ul></ul>');
                                $dt.append($ul);
                                var $li = $('<li></li>');
                                $li.html('开始时间：');
                                $ul.append($li);
                                var $span = $('<span></span>');
                                $span.html(star);
                                $li.append($span);
                                var $li = $('<li></li>');
                                $li.html('结束时间：');
                                $ul.append($li);
                                var $span = $('<span></span>');
                                $span.html(end);
                                $li.append($span);
                                var $li = $('<li></li>');
                                $li.html('里程：');
                                $ul.append($li);
                                var $span = $('<span></span>');
                                $span.html(Daaa.mileage + ' Km');
                                $li.append($span);
                                var $img11 = $('<img src="../Images/Image/ic_play_0.png" class="play"/>')
                                $dt.append($img11);
                                var $dele = $('.delete');
                                $dele.click(function () {
                                    //$huifang.css('display');
                                    $(this).parent().parent().parent().remove();
                                })


                                var $play = $('.play');
                                $play.click(function () {
                                    myshowSwiper.slideTo(1);
                                    var $xxx1 = $('#xxx1');
                                    var $header = $('<div id="header" ></div>');
                                    $xxx1.append($header);
                                    $header.html(localStorage["cphby"])
                                    var $img00 = $('<img src="../Images/Image/ic_left.png" class="back bbb"/>');
                                    $header.append($img00);
                                    var $map3 = $('<div id="map3"></div>');
                                    $xxx1.append($map3);
                                    var $contt = $('<div id="container"></div>');
                                    $xxx1.append($contt);
                                    var $img22 = $('<img src="../Images/Image/ic_maptype2.png" class="qiuguan ggg"/>');
                                    var flag = false;

                                    var satellLayer = new AMap.TileLayer.Satellite({ zIndex: 10 }); //实例化卫星图
                                    //在map中添加卫星图
                                    $img22.click(function () {

                                        if (flag) {
                                            $img22.attr('src', '../Images/Image/ic_maptype2.png');
                                            flag = false;
                                            satellLayer.hide();
                                        } else {
                                            $img22.attr('src', '../Images/Image/ic_maptype.png');
                                            flag = true;

                                            satellLayer.setMap(map3);
                                            satellLayer.show();

                                        }

                                    })
                                    $contt.append($img22);
                                    var $xianshi = $('<div class="xianshi"></div>');
                                    $contt.append($xianshi);
                                    var $table = $('<table style="border-collapse:collapse;"></table>');
                                    $xianshi.append($table);
                                    for (var i = 0; i < Daaa.Data.length; i++) {
                                        var $tr = $('<tr></tr>');
                                        $table.append($tr);

                                        var item = Daaa.Data[i]
                                        var $td = $('<td style="width:47.5%"></td>');
                                        $tr.append($td);
                                        $td.html('时间:');
                                        var $span = $('<span></span>');
                                        $span.html(item.t);
                                        $td.append($span);
                                        var $td = $('<td style="width:30%"></td>');
                                        $tr.append($td);
                                        $td.html('速度:');
                                        var $span = $('<span></span>');
                                        $span.html(item.s + "km/h");
                                        $td.append($span);
                                        var $td = $('<td style="width:22.5%"></td>');
                                        $tr.append($td);
                                        $td.html('方向:');
                                        var $span = $('<span></span>');
                                        $span.html(item.d + "°");
                                        $td.append($span);
                                        var $td = $('<td></td>');
                                        $tr.append($td);
                                        var $span = $('<span style="font-size:12px;line-height:24px;text-align:center;border-radius:5px;text-decoration:none;color:#fff;display:block;float:left;width:30px;height:24px;background:#79C9EE;margin-left:20px;">获取</span>');
                                        $td.append($span);
                                        $span.attr('lngg', item.o);
                                        $span.attr('latt', item.a);

                                        var markerB;
                                        var tf = false;
                                        $span.click(function () {
                                            if (tf) {
                                                markerB.setMap(null);
                                            }
                                            markerB = new AMap.Marker({
                                                map: map3,
                                                position: [$(this).attr('lngg'), $(this).attr('latt')],
                                            });
                                            tf = true;
                                        })
                                    }
                                    var $bobao = $('<div class="bobao"></div>');
                                    $contt.append($bobao);
                                    /*var $img66 = $('<img src="imgs/ic_play_slow.png" style="margin-left:10%;" id="slow"/>');
                                    $bobao.append($img66);*/

                                    var $img44 = $('<img src="../Images/Image/ic_play_play.png" style="margin-left:30%;" id="kkkk"/>');
                                    $bobao.append($img44);
                                    var $img55 = $('<img src="../Images/Image/ic_play_pause.png" style="margin-left:10%;" id="tttt"/>');
                                    $bobao.append($img55);
                                    map3 = new AMap.Map('map3', {
                                        resizeEnable: true,
                                        zoom: 12,
                                        center: [114.061031, 22.540298]
                                    });

                                    var lineArr = new Array();
                                    for (var i = 0; i < Daaa.Data.length; i++) {
                                        var item = Daaa.Data[i]
                                        var item1 = Daaa.Data[0]
                                        var lngX = item.o, latY = item.a;
                                        var lngX1 = item1.o, latY1 = item1.a;
                                        lineArr.push([parseFloat(lngX), parseFloat(latY)]);
                                    }

                                    map3.on("complete", completeEventHandler);
                                    AMap.event.addDomListener(document.getElementById('kkkk'), 'click', function () {

                                        marker.moveAlong(lineArr, playSpeed * 1000, function (k) {
                                            map3.setCenter(marker.getPosition());
                                            return k
                                        });
                                        $xianshi.css('display', 'none');
                                        if (tf) {
                                            markerB.setMap(null);
                                        }
                                    }, false);
                                    AMap.event.addDomListener(document.getElementById('tttt'), 'click', function () {
                                        marker.stopMove();
                                        $xianshi.css('display', 'block');
                                    }, false);
                                    // 地图图块加载完毕后执行函数
                                    function completeEventHandler() {
                                        icon22 = new AMap.Icon({
                                            image: '../Images/Image/hisIcon.png',
                                            size: new AMap.Size(20, 20),
                                            imageSize: new AMap.Size(20, 20),
                                        });
                                        marker = new AMap.Marker({
                                            map: map3,
                                            position: [lngX1, latY1],
                                            icon: icon22,
                                            offset: new AMap.Pixel(-20, -10),
                                            autoRotation: true

                                        });
                                        // 绘制轨迹
                                        var polyline = new AMap.Polyline({
                                            map: map3,
                                            path: lineArr,
                                            strokeColor: "#00A",  //线颜色
                                            strokeOpacity: 1,     //线透明度
                                            strokeWeight: 3,      //线宽
                                            strokeStyle: "solid"  //线样式
                                        });
                                        map3.setFitView();

                                    }
                                    var $bbb = $('.bbb');
                                    $bbb.click(function () {

                                        myshowSwiper.slideTo(0);
                                        $header.remove();
                                        $map3.remove();
                                        $contt.remove();
                                    });
                                })
                            }
                        }
                    });
                })

                var $que = $('#concon span.que');
                $que.click(function () {
                    $('#concon').css('display', 'none')

                    var startTime = $("#appDateTime").val();
                    var endTime = $("#Time").val();
                    var st = new Date(Date.parse($("#appDateTime").val().replace(/-/g, "/")));
                    var et = new Date(Date.parse($("#Time").val().replace(/-/g, "/")));
                    var dt = (et.getTime() - st.getTime()) / 86400000;

                    if (startTime == "" || endTime == "") {
                        alert("请输入开始时间和结束时间");
                        $('#concon').css('display', 'none')
                        return false;
                    } else if (startTime >= endTime) {

                        alert("开始时间不能大于结束时间");
                        $('#concon').css('display', 'none')
                        return false;

                    } else if (dt > 3) {

                        alert("请输入三天之内的时间");
                        $('#concon').css('display', 'none')
                        return false;
                    } else if (startTime == "请输入开始时间" || endTime == "请输入结束时间") {
                        alert("请输入开始时间和结束时间");
                        $('#concon').css('display', 'none')
                        return false;
                    }

                    var $kssj = startTime + ":" + "00";
                    var $jssj = endTime + ":" + "00";
                    var data = {};
                    data["a[0]"] = $kssj;
                    data["a[1]"] = $jssj;
                    data["a[2]"] = localStorage["vehidby"];
                    data["a[3]"] = "1";

                    $.post("/OAuth2/GetTrackTwo", data, function (ser) {
                        if (ser == "gg") {
                            alert('没有此车辆数据')
                        }
                        else {
                            // var json = jQuery.parseJSON(ser)
                            var Daaa = JSON.parse(ser);
                            if (Daaa.Data == "" || Daaa.Data == null) {
                                alert('没有此车辆数据')
                            } else {

                                var $cont = $('#cont')
                                var $huifang = $('<div class="huifang"></div>');
                                $cont.append($huifang);
                                var $dl = $('<dl></dl>');
                                $huifang.append($dl);
                                var $dd = $('<dd></dd>');
                                $dd.html('车牌号码：');
                                $dl.append($dd);
                                var $span = $('<span></span>');
                                $span.html(localStorage["cphby"]);
                                $dd.append($span);
                                var $img10 = $('<img src="../Images/Image/ic_delete.png" class="delete"/>');
                                $dd.append($img10);
                                var $dt = $('<dt></dt>');
                                $dl.append($dt);
                                var $ul = $('<ul></ul>');
                                $dt.append($ul);
                                var $li = $('<li></li>');
                                $li.html('开始时间：');
                                $ul.append($li);
                                var $span = $('<span></span>');
                                $span.html(star);
                                $li.append($span);
                                var $li = $('<li></li>');
                                $li.html('结束时间：');
                                $ul.append($li);
                                var $span = $('<span></span>');
                                $span.html(end);
                                $li.append($span);
                                var $li = $('<li></li>');
                                $li.html('里程：');
                                $ul.append($li);
                                var $span = $('<span></span>');
                                $span.html(Daaa.mileage + ' Km');
                                $li.append($span);
                                var $img11 = $('<img src="../Images/Image/ic_play_0.png" class="play"/>')
                                $dt.append($img11);
                                var $dele = $('.delete');
                                $dele.click(function () {
                                    //$huifang.css('display');
                                    $(this).parent().parent().parent().remove();
                                })


                                var $play = $('.play');
                                $play.click(function () {
                                    myshowSwiper.slideTo(1);
                                    var $xxx1 = $('#xxx1');
                                    var $header = $('<div id="header" ></div>');
                                    $xxx1.append($header);
                                    $header.html(localStorage["cphby"])
                                    var $img00 = $('<img src="../Images/Image/ic_left.png" class="back bbb"/>');
                                    $header.append($img00);
                                    var $map3 = $('<div id="map3"></div>');
                                    $xxx1.append($map3);
                                    var $contt = $('<div id="container"></div>');
                                    $xxx1.append($contt);
                                    var $img22 = $('<img src="../Images/Image/ic_maptype2.png" class="qiuguan ggg"/>');
                                    var flag = false;

                                    var satellLayer = new AMap.TileLayer.Satellite({ zIndex: 10 }); //实例化卫星图
                                    //在map中添加卫星图
                                    $img22.click(function () {

                                        if (flag) {
                                            $img22.attr('src', '../Images/Image/ic_maptype2.png');
                                            flag = false;
                                            satellLayer.hide();
                                        } else {
                                            $img22.attr('src', '../Images/Image/ic_maptype.png');
                                            flag = true;

                                            satellLayer.setMap(map3);
                                            satellLayer.show();

                                        }

                                    })
                                    $contt.append($img22);
                                    var $xianshi = $('<div class="xianshi"></div>');
                                    $contt.append($xianshi);
                                    var $table = $('<table style="border-collapse:collapse;"></table>');
                                    $xianshi.append($table);
                                    for (var i = 0; i < Daaa.Data.length; i++) {
                                        var $tr = $('<tr></tr>');
                                        $table.append($tr);

                                        var item = Daaa.Data[i]
                                        var $td = $('<td style="width:47.5%"></td>');
                                        $tr.append($td);
                                        $td.html('时间:');
                                        var $span = $('<span></span>');
                                        $span.html(item.t);
                                        $td.append($span);
                                        var $td = $('<td style="width:30%"></td>');
                                        $tr.append($td);
                                        $td.html('速度:');
                                        var $span = $('<span></span>');
                                        $span.html(item.s + "km/h");
                                        $td.append($span);
                                        var $td = $('<td style="width:22.5%"></td>');
                                        $tr.append($td);
                                        $td.html('方向:');
                                        var $span = $('<span></span>');
                                        $span.html(item.d + "°");
                                        $td.append($span);
                                        var $td = $('<td></td>');
                                        $tr.append($td);
                                        var $span = $('<span style="font-size:12px;line-height:24px;text-align:center;border-radius:5px;text-decoration:none;color:#fff;display:block;float:left;width:30px;height:24px;background:#79C9EE;margin-left:20px;">获取</span>');
                                        $td.append($span);
                                        $span.attr('lngg', item.o);
                                        $span.attr('latt', item.a);

                                        var markerB;
                                        var tf = false;
                                        $span.click(function () {
                                            if (tf) {
                                                markerB.setMap(null);
                                            }
                                            markerB = new AMap.Marker({
                                                map: map3,
                                                position: [$(this).attr('lngg'), $(this).attr('latt')],
                                            });
                                            tf = true;
                                        })
                                    }
                                    var $bobao = $('<div class="bobao"></div>');
                                    $contt.append($bobao);
                                    /*var $img66 = $('<img src="imgs/ic_play_slow.png" style="margin-left:10%;" id="slow"/>');
                                    $bobao.append($img66);*/

                                    var $img44 = $('<img src="../Images/Image/ic_play_play.png" style="margin-left:30%;" id="kkkk"/>');
                                    $bobao.append($img44);
                                    var $img55 = $('<img src="../Images/Image/ic_play_pause.png" style="margin-left:10%;" id="tttt"/>');
                                    $bobao.append($img55);
                                    map3 = new AMap.Map('map3', {
                                        resizeEnable: true,
                                        zoom: 12,
                                        center: [114.061031, 22.540298]
                                    });

                                    var lineArr = new Array();
                                    for (var i = 0; i < Daaa.Data.length; i++) {
                                        var item = Daaa.Data[i]
                                        var item1 = Daaa.Data[0]
                                        var lngX = item.o, latY = item.a;
                                        var lngX1 = item1.o, latY1 = item1.a;
                                        lineArr.push([parseFloat(lngX), parseFloat(latY)]);
                                    }

                                    map3.on("complete", completeEventHandler);
                                    AMap.event.addDomListener(document.getElementById('kkkk'), 'click', function () {

                                        marker.moveAlong(lineArr, playSpeed * 1000, function (k) {
                                            map3.setCenter(marker.getPosition());
                                            return k
                                        });
                                        $xianshi.css('display', 'none');
                                        if (tf) {
                                            markerB.setMap(null);
                                        }
                                    }, false);
                                    AMap.event.addDomListener(document.getElementById('tttt'), 'click', function () {
                                        marker.stopMove();
                                        $xianshi.css('display', 'block');
                                    }, false);
                                    // 地图图块加载完毕后执行函数
                                    function completeEventHandler() {
                                        icon22 = new AMap.Icon({
                                            image: '../Images/Image/hisIcon.png',
                                            size: new AMap.Size(20, 20),
                                            imageSize: new AMap.Size(20, 20),
                                        });
                                        marker = new AMap.Marker({
                                            map: map3,
                                            position: [lngX1, latY1],
                                            icon: icon22,
                                            offset: new AMap.Pixel(-20, -10),
                                            autoRotation: true

                                        });
                                        // 绘制轨迹
                                        var polyline = new AMap.Polyline({
                                            map: map3,
                                            path: lineArr,
                                            strokeColor: "#00A",  //线颜色
                                            strokeOpacity: 1,     //线透明度
                                            strokeWeight: 3,      //线宽
                                            strokeStyle: "solid"  //线样式
                                        });
                                        map3.setFitView();

                                    }
                                    var $bbb = $('.bbb');
                                    $bbb.click(function () {

                                        myshowSwiper.slideTo(0);
                                        $header.remove();
                                        $map3.remove();
                                        $contt.remove();
                                    });
                                })
                            }
                        }
                    });

                })
    }

    guigui();

    var currYear = (new Date()).getFullYear();
    var opt = {};
    opt.date = { preset: 'date' };
    opt.datetime = { preset: 'datetime' };
    opt.time = { preset: 'time' };
    opt.default = {
        theme: 'android-ics light', //皮肤样式
        display: 'modal', //显示方式 
        mode: 'scroller', //日期选择模式
        dateFormat: 'yyyy-mm-dd',
        lang: 'zh',
        showNow: true,
        nowText: "今天",
        startYear: currYear - 10, //开始年份
        endYear: currYear + 10 //结束年份
    };


    var optDateTime = $.extend(opt['datetime'], opt['default']);

    $("#appDateTime").mobiscroll(optDateTime).datetime(optDateTime);
    $("#Time").mobiscroll(optDateTime).datetime(optDateTime);
















})