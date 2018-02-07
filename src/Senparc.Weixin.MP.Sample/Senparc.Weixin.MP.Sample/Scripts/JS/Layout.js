var toMap = 2;  		//	1 GOOGLE  2 BAIDU 3 GaoDe
var mapType = 0;		//0 GOOGLE	1 MAPINFO, 2 HTTPS GOOGLE, 3 BAIDU
var DEF_MAP_TYPE = "MapType";
var pageclik = "weizhi";// getUrlParameter("pageclik");
var myPageStyle = null; //样式
var weizhiPage = 'weizhi'; //位置页面
var DEF_PAGE_MONITOR = "PageMonitor";//监控界面是地图或者视频或者线路监控

$(document).ready(function () {

    langInitByUrl();

    mapType = $.cookie(DEF_MAP_TYPE);
    if (mapType == null) {
        if (langIsChinese()) {
            mapType = 3;
        } else {
            mapType = 0;
        }
    } else {
        mapType = parseInt(mapType);
    }
    if (mapType == 0) {
        toMap = 1;	//
    } else {
        toMap = 2;
    }
    loadReadyPage();
});

function loadReadyPage() {
    if (typeof parent.lang == "undefined") {
        setTimeout(loadReadyPage, 50);
    } else {
        //初始化样式
        myPageStyle = new pageStyle();
        myPageStyle.initCommonStyle("index");
        if (myPageStyle.getStyle() == 'hb') {
            $('#logoImg').css('width', '52px');
        } else if (myPageStyle.getStyle() == 'gj' || myPageStyle.getStyle() == 'xc') {
            $('#logoImg').css('width', '50px').css('height', '51px');
        }

        var imgUrl = myPageStyle.getCommonPageUrl('logo');
        if (myPageStyle.getStyle() == 'jy') {
            var imgUrls = GetCookie('image');
            if (imgUrls != 'undefined' && imgUrls != null) {
                imgUrl = '../' + imgUrls;
            }
        }
        $('#logoImg').attr('src', imgUrl);
        loadIndexPage();
    }
}


function loadIndexPage() {
    //先判断session，再判断用户名和密码
    var session = getUrlParameter("userSession");
    var account_ = getUrlParameter("account");
    var password_ = getUrlParameter("password");
    if (session != "" || (account_ != '' && password_ != '')) {
        setTimeout(directLogin, 100);
    } else {
        loadPage();
        var mainTitleName = GetCookie('mainTitle');
        if (mainTitleName != null && mainTitleName != 'undefined') {
            chineseMainTitle = mainTitleName;
            englishMainTitle = mainTitleName;
            twMainTitle = mainTitleName;
            showTitleAndCopyRight();
        } else {
            if (getUrlParameter("clientLogin") == 1) {
                setTimeout(ajaxLoadInformation, 100000);
            }
        }
    }
}

function directLogin() {
    var session = getUrlParameter("userSession");
    var account_ = getUrlParameter("account");
    var password_ = getUrlParameter("password");
    var ctype = getUrlParameter("ctype");
    if (session != "" || (account_ != '' && password_ != '')) {
        var action = "StandardLoginAction_sessionLogin.action";
        if (session != '') {
            action += '?userSession=' + session;
        } else {
            if (account_ != '' && password_ != '') {
                action += '?account=' + account_ + '&password=' + password_;
            }
        }
        if (ctype != null && ctype != '') {
            action += "&ctype=" + ctype;
        }
        doLogin(action, false, "", "", "", ctype);
    }
}


function doLogin(action, sysLogin, userAccount, password, verificationCode, ctype) {
    var logintipdlg = $.dialog({ id: 'logintip', title: false, content: lang.login_logining });
    $.ajax({
        url: action,
        data: { account: decodeURI(userAccount), password: password, language: langCurLocal(), verificationCode: verificationCode },
        cache: false,/*禁用浏览器缓存*/
        dataType: "json",
        success: function (json) {
            if (json) {
                var flag = json.result;
                if (flag != null) {
                    if (flag == 0) {
                        SetCookie("userId", json.accountId);
                        SetCookie("account", json.account);
                        SetCookie("isAdmin", json.isAdmin);
                        SetCookie("isMaster", json.isMaster);
                        SetCookie("isFirstCompany", json.isFirstCompany);
                        SetCookie("isSecondCompany", json.isSecondCompany);
                        SetCookie("isThreeCompany", json.isThreeCompany);
                        SetCookie("hasAddArea", json.hasAddArea);
                        SetCookie("hasLine", json.hasLine);
                        SetCookie("hasRoadRule", json.hasRoadRule);
                        SetCookie("privilege", json.privilege);
                        SetCookie("companyId", json.companyId);
                        SetCookie("isAllowManage", json.isAllowManage);
                        SetCookie("isManageLine", json.isManageLine);
                        SetCookie("isSanitationTruck", json.isSanitationTruck);
                        SetCookie("isChemicals", json.isChemicals);
                        SetCookie("level", json.level);
                        SetCookie("verify", json.verify);
                        SetCookie("isPolice", json.isPolice);
                        SetCookie("baiDuWebAPIKey", json.baiDuWebAPIKey);
                        SetCookie("googleWebAPIKey", json.googleWebAPIKey);
                        SetCookie("gaoDeWebAPIKey", json.gaoDeWebAPIKey);
                        SetCookie("siWeiWebAPIKey", json.siWeiWebAPIKey);
                        SetCookie("geocoderMapType", json.geocoderMapType);
                        SetCookie("defaultGeocoderMapType", json.defaultGeocoderMapType);
                        SetCookie("isXinTianDi", json.isXinTianDi);
                        SetCookie("isFangHao", json.isFangHao);
                        SetCookie("isAllowPassword", json.allowPassword);

                        SetCookie("mainTitle", json.mainTitle);
                        SetCookie("image", json.image);
                        //						SetCookie("pagecliks", '');
                        if (json.isAdmin == 0 && json.notValidServer) {
                            alert(lang.errorValidServerEx);
                        }
                        window.location = "index.html?clientLogin=1&ctype=" + ctype + "&lang=" + langCurLocal();
                    } else if (flag == 1) {
                        alert(lang.errLogin_UserNoExist);
                        window.location = "login.html?lang=" + langCurLocal();
                    } else if (flag == 2) {
                        alert(lang.errLogin_PasswordError);
                        window.location = "login.html?lang=" + langCurLocal();
                    } else if (flag == 3) {
                        alert(lang.errLogin_Expired);
                        window.location = "login.html?lang=" + langCurLocal();
                    } else if (flag == 5) {
                        alert(lang.errException);
                        window.location = "login.html?lang=" + langCurLocal();
                    } else if (flag == 7) {
                        alert(lang.errLogin_Session);
                        window.location = "login.html?lang=" + langCurLocal();
                    } else if (flag == 8) {
                        alert(lang.errLogin_Storage);
                        window.location = "login.html?lang=" + langCurLocal();
                    } else if (flag == 46) {
                        alert(lang.errUserDeactivated);
                        window.location = "login.html?lang=" + langCurLocal();
                    } else if (flag == 9) {
                        alert(lang.errorValidServer);
                    } else {
                        alert(lang.errUnkown);
                        window.location = "login.html?lang=" + langCurLocal();
                    }
                } else {
                    alert(lang.errUnkown);
                    window.location = "login.html?lang=" + langCurLocal();
                }
            }
            logintipdlg.close();
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(lang.errSendRequired);
            logintipdlg.close();
            window.location = "login.html?lang=" + langCurLocal();
        }
    });
}


var isloadSuc = false;//添加div成功
function loadPage() {
    //$.myajax.jsonGet('StandardLoginAction_getNavPage.action?clientLogin=' + getUrlParameter("clientLogin"), function (json, action, success) {
    // if (success) {../../Views/OperationManagement/OperationManagement.html
    var strss = "{\"result\":0,\"pages\":[{\"name\":\"weizhi\",\"index\":null,\"lang\":null,\"privi\":1,\"url\":\"LocationManagement/Location\",\"title\":null},{\"name\":\"shipin\",\"index\":null,\"lang\":null,\"privi\":8,\"url\":\"LocationManagement/Location\",\"title\":null},{\"name\":\"guiji\",\"index\":null,\"lang\":null,\"privi\":7,\"url\":\"TrackManagement/Track\",\"title\":null},{\"name\":\"luxiang\",\"index\":null,\"lang\":null,\"privi\":9,\"url\":\"VideoManagement/VideoReplay\",\"title\":null},{\"name\":\"tongji\",\"index\":null,\"lang\":null,\"privi\":2,\"url\":\"StatisticalReports/StatisticalReports.html\",\"title\":null},{\"name\":\"yunying\",\"index\":null,\"lang\":null,\"privi\":3,\"url\":\"../Gps/OperationManagement/OperationManagement.html\",\"title\":null},{\"name\":\"guize\",\"index\":null,\"lang\":null,\"privi\":5,\"url\":\"RulesManagement/RulesManagement.html\",\"title\":null},{\"name\":\"server\",\"index\":null,\"lang\":null,\"privi\":6,\"url\":\"ServerManagement/ServerManagement.html\",\"title\":null}]}";
    var json = JSON.parse(strss);
    pageUrlList = json.pages;
    userId = GetCookie('userId');
    account = GetCookie('account');
    companyId = GetCookie('companyId');
    loadLang();
    //初始化权限处理类
    myUserRole = new userRole();
    myUserRole.setPrivileges(GetCookie('privilege'));
    myUserRole.setIsAdmin(GetCookie('isAdmin'));
    myUserRole.setIsMaster(GetCookie('isMaster'));
    myUserRole.setIsFirstCompany(GetCookie('isFirstCompany'));
    myUserRole.setIsSecondCompany(GetCookie('isSecondCompany'));
    myUserRole.setIsThreeCompany(GetCookie('isThreeCompany'));
    myUserRole.setHasAddArea(GetCookie('hasAddArea'));
    myUserRole.setHasLine(GetCookie('hasLine'));
    myUserRole.setHasRoadRule(GetCookie('hasRoadRule'));
    myUserRole.setIsAllowManage(GetCookie('isAllowManage'));
    myUserRole.setIsManageLine(GetCookie('isManageLine'));
    myUserRole.setIsSanitationTruck(GetCookie('isSanitationTruck'));
    myUserRole.setIsChemicals(GetCookie('isChemicals'));
    myUserRole.setCompanyLevel(GetCookie('level'));
    myUserRole.setCompanyVerify(GetCookie('verify'));
    myUserRole.setIsPolice(GetCookie('isPolice'));
    myUserRole.setBaiDuWebAPIKey(GetCookie('baiDuWebAPIKey'));
    myUserRole.setGoogleWebAPIKey(GetCookie('googleWebAPIKey'));
    myUserRole.setGaoDeWebAPIKey(GetCookie('gaoDeWebAPIKey'));
    myUserRole.setSiWeiWebAPIKey(GetCookie('siWeiWebAPIKey'));
    myUserRole.setGeocoderMapType(GetCookie('geocoderMapType'));
    myUserRole.setDefaultGeocoderMapType(GetCookie('defaultGeocoderMapType'));
    myUserRole.setIsChangePsw(GetCookie('isAllowPassword'));
    myUserRole.setIsXinTianDi(GetCookie('isXinTianDi'));
    myUserRole.setIsFangHao(GetCookie('isFangHao'));
    //账号是否禁用修改密码 
    if (!myUserRole.isChangePsw()) {
        $('.down .arrows').hide();
        $('.quick-menu').hide();
    } else {
        $(".login-mess .down").click(function () {
            $(".quick-menu").slideDown(300);
            $(".quick-menu").mouseleave(function () {
                $(this).hide();
            });
        });
    }


    if (myUserRole.isChemicals() && !myUserRole.isAdmin()) {
        $('.login-mess #perfectInfo').show();
    }

    //计算打开的页面标签
    var pageNameList = [];
    $.each(json.pages, function (i, page) {
        pageNameList.push(page.name);
    });
    if (pageclik == '') {
        var temppage = $.cookie(DEF_PAGE_MONITOR);
        if (temppage != null) {
            if (!pageNameList.in_array(temppage)) {
                pageclik = pageNameList[0];
            } else {
                pageclik = temppage;
            }
        }
        if (pageclik == '') {
            pageclik = pageNameList[0];
        }
    }
    //生成导航
    var content = "";
    var mod = [];
    $.each(json.pages, function (i, page) {
        var title = getPageDisplay(page.privi);
        var pclass = "";
        if (page.name == pageclik) {
            pclass = "current";
            document.title = title;
            if (GetCookie('maintitle')) {
                document.title += '-' + GetCookie('maintitle');
            }
            if (page.name == 'weizhi' || page.name == 'shipin' || page.name == 'xianlu') {
                if (pageclik == 'weizhi' || pageclik == 'shipin' || pageclik == 'xianlu') {
                    controlMonitorPage(page.name);
                }
            }
            content += getMainPane(page.name, page.url, pclass);
        }
        var display = title;
        if (title != null && title.length != null && title.length > 10) {
            display = title.substring(0, 10) + '...';
        }
        mod.push({
            display: display,
            title: title,
            name: page.name,
            pclass: pclass,
            preicon: true
        });

        if ((pageclik == 'guiji' && page.name == 'guiji')
                || (pageclik == 'weizhi' && page.name == 'weizhi')
                || (pageclik == 'shipin' && page.name == 'shipin')
                || (pageclik == 'xianlu' && page.name == 'xianlu')
                || (pageclik == 'luxiang' && page.name == 'luxiang')
                || (pageclik == 'multimap' && page.name == 'multimap')
                || (pageclik == 'lineguiji' && page.name == 'lineguiji')) {
            weizhiPage = page.name;
        }
    });
    $('#rightTabs').flexPanel({
        TabsModel: mod
    });
    //添加页面
    //只添加打开的页面
   // $('#mainPanel-all').append(content);

    //加载子页面
    function loadSubPage(tabObj, pageName) {
        //$(tabObj).addClass('current').siblings().removeClass("current");
        //document.title = $(tabObj).find('.text').html();
        //if (GetCookie('maintitle')) {
        //    document.title += '-' + GetCookie('maintitle');
        //}
        //if ($('#mainPanel-all #mainPanel-' + pageName).length <= 0) {
        //    $('#mainPanel-all').append(getMainPane(pageName, getPageUrl(pageName), ""));
        //    $('#mainPanel-all #mainPanel-' + pageName).css('height', indexHeight - 5 + 'px');
        //    $('#mainPanel-all #mainPanel-' + pageName).find('#leftPanel').css('width', '250px').css('height', indexHeight - 5 + 'px');
        //    $('#mainPanel-all #mainPanel-' + pageName).find('#rightPanel').css('width', screenWidth - 255 + 'px').css('height', indexHeight - 5 + 'px').css("marginLeft", "250px");
        //}
        //$('#mainPanel-all #mainPanel-' + pageName).addClass('current').siblings().removeClass("current");

        window.location.href = "/Menu/Index";;
    }

    //点击后加载其他页面
    $('#rightTabs li').each(function (i) {
        var name = $(this).attr('data-tab');
        var target = "index.html?lang=" + langCurLocal() + "&pageclik=" + name;
        $(this).on('click', function () {
            if (name == 'guiji' || name == 'luxiang' || name == 'multimap' || name == 'lineguiji') {
                if (name == 'guiji') {
                    if (pageclik != 'guiji') {
                        guijiPage = openMyPage('guiji', true, target);
                    } else {
                        loadSubPage(this, name);
                    }
                } else if (name == 'luxiang') {
                    if (pageclik != 'luxiang') {
                        luxiangPage = openMyPage('luxiang', true, target);
                    } else {
                        loadSubPage(this, name);
                    }
                } else if (name == 'multimap') {
                    if (pageclik != 'multimap') {
                        multimapPage = openMyPage('multimap', true, target);
                    } else {
                        loadSubPage(this, name);
                    }
                } else if (name == 'lineguiji') {
                    if (pageclik != 'lineguiji') {
                        guijiPage = openMyPage('lineguiji', true, target);
                    } else {
                        loadSubPage(this, name);
                    }
                }
            } else if (name == 'denglu') {
                window.open("http://yaozw.gicp.net:8001/index_jqsd.asp");//location.href = "http://yaozw.gicp.net:8001/index_jqsd.asp";
            } else {
                if (pageclik == 'guiji' || pageclik == 'luxiang' || pageclik == 'multimap' || pageclik == 'lineguiji') {
                    otherPage = openMyPage('weizhi,shipin,xianlu,tongji,yunying,xiaoche,lajiche,taxi,guize,server,whMgr,police', true, target);
                } else {
                    if (name == 'weizhi' || name == 'shipin' || name == 'xianlu') {
                        loadSubPage(this, weizhiPage);
                        controlMonitorPage(name);
                    } else {
                        loadSubPage(this, name);
                        $.cookie(DEF_PAGE_MONITOR, name, { expires: 365 });
                        setChildPanelWidth(name);
                    }
                }
            }
        });
    });
    //if (pageclik == 'guiji' /*|| pageclik == 'weizhi' || pageclik == 'shipin' || pageclik == 'xianlu'*/ || pageclik == 'luxiang' || pageclik == 'multimap' || pageclik == 'lineguiji') {
    //    //获取授权车辆等信息
    //    getUserVehicles();
    //    //获取公司信息
    //    getParentCompanyTeams();
    //    //获取区域信息
    //    mapMarkManager.getMapmarkers();
    //    //				getListMarker();
    //} else {
    //    //获取授权车辆等信息
    //    getUserVehicles();
    //    //获取区域信息
    //    //				getListMarker();

    //    //获取公司信息
    //    getParentCompanyTeams();
    //    //获取区域信息
    //    mapMarkManager.getMapmarkers();
    //    //获取授权车辆信息
    //    getParentVehiList();
    //    //每隔5分钟刷新公司信息和授权车辆信息，如果有改变
    //    //  flashCompanyTeamsAndVehicleTimer();hyy
    //    //获取司机信息
    //    getParentDrivers();
    //}
    //如果是危化监管平台
    //if (myUserRole.isChemicals()) {
    //    //不是管理员
    //    if (!myUserRole.isAdmin()) {
    //        //判断是否已审核通过
    //        loadCompanyVerify();
    //        //获取信息完善界面
    //        loadInfoPerfectPage();
    //        //初始化公告信息管理
    //        bulletin = new standardBulletin();
    //        bulletin.initialize();
    //        //加载当前公司信息
    //        if (!myUserRole.isRescueCompany()) {
    //            loadCurrentCompanyInfo();
    //        }
    //    }
    //}
    setPanelWidth();
    isloadSuc = true;
    //    };
    //}, null);

    var ctype = getUrlParameter("ctype");
    if (ctype != 1) {
        $('.login-mess').show();
    }

    var buttons = [];
    var but = [];
    but.push({
        display: parent.lang.close,
        name: '',
        pclass: 'close',
        bgcolor: 'gray',
        hide: false
    });
    buttons.push(but);
    $('#toolbar-btn').flexPanel({
        ButtonsModel: buttons
    });
    $('#browserTip').text(parent.lang.browser_tip);
    /*$('#browser').width(window.screen.availWidth);
	$('#browserTip').width(window.screen.availWidth-200);*/
    $('#toolbar-btn').width(100);

    var localLang = GetCookie("language");
    //	isWeather
    if (localLang.indexOf('zh') == -1) {
        $('.isWeather').hide();
    }

    $('.close', '#toolbar-btn').on('click', function () {
        $('#browser').hide();
    });
    //修改密码
    $('.login-mess .password').on('click', function () {
        $.dialog({
            id: 'setPwd', title: parent.lang.modify_password, content: 'url:OperationManagement/user_password.html?id=' + userId,
            min: false, max: false, lock: true
        });
        $('.quick-menu').hide();
    });

    //退出操作
    $('#login-out').on('click', function () {
        if (!confirm(lang.isExit)) {
            return;
        }
        //发送退出登录的请求
        $.myajax.showLoading(true, lang.home_exitTip);
        $.myajax.jsonGet("StandardLoginAction_logout.action", function (json, action, success) {
            $.myajax.showLoading(false);
            //重定向到登录界面
            window.location = "login.html";
            //			SetCookie("pagecliks", '');
        }, null);
        //避免发送请求时间过长
        setTimeout(function () {
            //重定向到登录界面
            window.location = "login.html";
        }, 2000);
    });

    //设置页面宽度
    setPanelWidthEx();
    //禁止系统右键
    disableSysRight('body', true);

};

function loadLang() {
    $('#main .mainTitle').attr('title', lang.title);
    $('#main .mainTitle img').attr('alt', lang.title);
    //	$('#main .mainTitle').append(lang.title);
    document.title = lang.operations_management;
    if (GetCookie('maintitle')) {
        document.title += '-' + GetCookie('maintitle');
    }
    if (account && account.length > 6) {
        $('.login-mess .account').text(account.substring(0, 6) + '...');
    } else {
        $('.login-mess .account').text(account);
    }
    $('.login-mess .account').attr('title', account);
    $('.login-mess .login-out').attr('title', lang.logout);

    if (myPageStyle.styleId == 2 || myPageStyle.styleId == 3) {
        $('.login-mess .login-out span').text(lang.logout);
    }
    if (lang.modify_password.length > 6) {
        $('.login-mess .password').text(lang.modify_password.substring(0, 6) + '...');
    } else {
        $('.login-mess .password').text(lang.modify_password);
    }
    $('.login-mess .password').attr('title', lang.modify_password);
    if (GetCookie('maintitle')) {
        $('#spanTitle').text(GetCookie('maintitle'));
        $('#spanTitle').attr('title', GetCookie('maintitle'));
    }
    $('.login-mess .perfectInfo').text('信息完善');
    $('.login-mess .perfectInfo').attr('title', '信息完善');
}


/**
 * 获取页面名称
 */
function getPageDisplay(key) {
    var name = '';
    switch (key) {
        case 1:
            name = lang.location_positioning;
            break;
        case 2:
            name = lang.statistical_reports;
            break;
        case 3:
            name = lang.operations_management;
            break;
        case 4:
            name = lang.Internal_management;
            break;
        case 5:
            name = lang.rules_management;
            break;
        case 6:
            name = lang.Server_management;
            break;
        case 7:
            name = lang.track_management;
            break;
        case 8:
            name = lang.real_time_video;
            break;
        case 9:
            name = lang.video_query;
            break;
        case 10:
            name = '基础信息管理';
            break;
        case 11:
            name = parent.lang.monitor_lineMonitor;
            break;
        case 12:
            name = parent.lang.school_bus_management;
            break;
        case 13:
            name = parent.lang.zt;
            break;
        case 14:
            name = parent.lang.multimap;
            break;
        case 15:
            name = "智慧出租";
            break;
        case 16:
            if (myUserRole.isAdmin()) {
                name = "危化管理";
            } else {
                name = "运营管理";
            }
            break;
        case 17:
            name = parent.lang.policeManager;
            break;
        case 18:
            name = "线路回放";
            break;
    }
    return name;
}


var monitorName = "";
function controlMonitorPage(name) {
    $.cookie(DEF_PAGE_MONITOR, name, { expires: 365 });
    monitorName = name;
    switchMonitorPage();
}


function switchMonitorPage() {
    var obj = document.getElementById('all-weizhi');
    if (obj == null) {
        obj = document.getElementById('all-shipin');
        if (obj == null) {
            obj = document.getElementById('all-xianlu');
        }
    }

    if (obj == null || typeof obj.contentWindow.showMonitorPage != "function") {
        setTimeout(switchMonitorPage, 50);
    } else {

        obj.contentWindow.showMonitorPage(monitorName);
    }
}


/**
 *	获取对应页面
 */
function getMainPane(name, url, pclass) {
    var content = '';
    content += '<div id="mainPanel-' + name + '" class="mainPanel ' + pclass + '">';
    /*if(name == 'guiji' || name == 'weizhi' || name == 'shipin' || name == 'shouye') {
		if(name == 'shipin' || name == 'weizhi') {
			url += ".html";
		} else if (name == 'shouye'){
			url = url;
		} else {
			url += ".html";
		}*/
    if (name == 'guiji' || name == 'weizhi' || name == 'shipin' || name == 'xianlu' || name == 'luxiang' || name == 'multimap' || name == 'lineguiji') {
        url += ".html";
        content += '<iframe id="all-' + name + '" width="100%" height="100%" frameborder="0" src="' + url + '"></iframe>';
    } else {
        content += '<div id="leftPanel">';
        content += '<iframe id="left-' + name + '" width="100%" height="100%" frameborder="0" src="' + url + '"></iframe>';
        content += '</div>';
        content += '<div id="rightPanel">';
        if (name == 'guize') {
            content += '<iframe id="right-' + name + '" width="100%" height="100%" frameborder="0" src="RulesManagement/' + myPageStyle.getCommonPageUrl('RuleMaintain') + '.cshtml"></iframe>';
        } else if (name == 'server') {
            content += '<iframe id="right-' + name + '" width="100%" height="100%" frameborder="0" src="ServerManagement/AllServer.html?"></iframe>';
        } else if (name == 'tongji' || name == 'yunying' || name == 'xiaoche' || name == 'lajiche' || name == 'taxi' || name == 'whMgr' || name == 'police') {
            //			content += 	'<div id="'+ name +'Top" class="paneTop">标签页</div>';
            //			content += 	'<iframe id="right-'+name+'" width="100%" height="100%" frameborder="0" src=""></iframe>';
        } else {
            content += '<iframe id="right-' + name + '" width="100%" height="100%" frameborder="0" src=""></iframe>';
        }
        content += '</div>';
    }
    content += '</div>';
    return content;
}

/**
 *设置页面大小
 */
function setPanelWidth() {
    screenWidth = window.screen.availWidth; //$(window).width();//
    screenHeight = $(window).height();//document.documentElement.clientHeight;//$(window).height();// window.screen.availHeight;
    //不能少于1024
    if (screenWidth < 1024) {
        screenWidth = 1024;
    }
    indexHeight = screenHeight;
    if ($('#main-topPanel').hasClass('show')) {
        indexHeight = indexHeight - $('#main-topPanel').height();
    }
    indexWidth = screenWidth;
    mainHeight = screenHeight - 100;

    $('#main-topPanel').css('min-width', screenWidth - 20 + 'px');
    $('#mainPanel-all').css('width', screenWidth + 'px');
    $('#mainPanel-all .mainPanel').each(function () {
        $(this).css('height', indexHeight - 5 + 'px');
        $(this).find('#leftPanel').css('width', '250px').css('height', indexHeight - 5 + 'px');
        $(this).find('#rightPanel').css('width', screenWidth - 255 + 'px').css('height', indexHeight - 5 + 'px').css("marginLeft", "250px");
    });
    //修改样式
    if (myPageStyle) {
        myPageStyle.setIndexItemWidth();
    }
}

//设置页面宽度
function setPanelWidthEx() {
    if (isloadSuc) {
        //设置页面大小
        setTimeout(setPanelWidth, 200);
    } else {
        setTimeout(setPanelWidthEx, 50);
    }
}