

var userId = null;  //用户id
var account = null;  //用户名
var companyId = null;  //用户所在公司id
var myUserRole = null; //用户权限类
var screenWidth = null;
var screenHeight = null;
var indexWidth = null;
var indexHeight = null;
var mainHeight = null;
var longbtime = null;
var longetime = null;
var daybtime = null;
var dayetime = null;
var monthbtime = null;
var monthetime = null;
var pageclik = "yunying";// getUrlParameter("pageclik");
var defaultTrackVehiIdno = decodeURIComponent(getUrlParameter("vehiIdno"));
var toMap = 2;  		//	1 GOOGLE  2 BAIDU
var mapType = 0;		//0 GOOGLE	1 MAPINFO, 2 HTTPS GOOGLE, 3 BAIDU
var DEF_MAP_TYPE = "MapType";
var DEF_PAGE_MONITOR = "PageMonitor";//监控界面是地图或者视频或者线路监控
var weizhiPage = 'weizhi'; //位置页面
var guijiPage = null;  //轨迹页面
var multimapPage = null; // 多地图页面
var luxiangPage = null; //录像回放页面
var otherPage = null;  //其他页面
var myPageStyle = null; //样式
var mapPageManage = new Hashtable(); //页面管理，管理每个主标签下的标签页
var bulletin = null; //公告信息管理类

var isCheck = 0; //1 密码强度校验

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

function isHBManagement() {
    return myPageStyle.getStyle() == 'hb';
}

function getMapType() {
    return mapType;
}

function saveMapType(type) {
    mapType = type;
    if (type == 0) {
        toMap = 1;
    } else if (type == 3) {
        toMap = 2;
    }
    $.cookie(DEF_MAP_TYPE, mapType, { expires: 365 });
}

function getGeocoderMapType() {
    return myUserRole.getGeocoderMapType();
}

function getDefaultGeocoderMapType() {
    return myUserRole.getDefaultGeocoderMapType();
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

function getPageWin(name) {
    var ret = null;
    /*if (name == 'weizhi' || name == 'shipin' || name == 'xianlu') {
		ret = weizhiPage;
	} else */if (name == 'multimap') {
	    ret = multimapPage;
	} else if (name == 'guiji') {
	    ret = guijiPage;
	} else if (name == 'luxiang') {
	    ret = luxiangPage;
	} else {
	    ret = otherPage;
	}
    return ret;
}

function getPageName(name) {
    var ret = null;
    var lstName = name.split(',');
    for (var i = 0; i < lstName.length; ++i) {
        /*if (lstName[i] == 'weizhi' || lstName[i] == 'shipin' || lstName[i] == 'xianlu') {
			ret = "weizhi";
			break;
		} else */if (lstName[i] == 'multimap') {
		    ret = "multimap";
		    break;
		} else if (lstName[i] == 'guiji') {
		    ret = "guiji";
		    break;
		} else if (name == 'luxiang') {
		    ret = "luxiang";
		} else {
		    ret = "other";
		    break;
		}
    }

    return ret;
}

/*
 * 打开界面
 * direct如果不存在，是否直接打开
 * 返回已经打开的窗口对象
 */
function openMyPage(name, direct, target) {
    //直接打开，暂时不处理
    return window.open(target);

    var winName = getPageName(name);
    //firefox 不支持focus，因此直接打开链接
    //	if ($.browser.mozilla && direct) {
    //		return window.open(target);
    //	}

    //	var lstName = name.split(',');
    //	var hasLoad = false;
    //	var pageName = '';
    //	for (var i = 0; i < lstName.length; ++ i) {
    //		if (lstName[i] != "" && isLoaded(lstName[i])) {
    //			hasLoad = true;
    //			pageName = lstName[i];
    //			break;
    //		}
    //	}

    var ret = null;
    var reOpen = true;
    if (true) {
        var page = getPageWin(winName);

        if (page != null && !page.closed) {
            try {
                window.blur();
                setTimeout(function () {
                    page.focus();
                }, 10);
                reOpen = false;
                ret = page;
            } catch (e1) {
            }
        }
        //可能父窗口打开过，父窗口会再调用次窗口的接口
        if (reOpen) {
            if (window.opener != null) {
                if (typeof window.opener.pageclik != "undefined") {
                    if (getPageName(window.opener.pageclik) == winName) {
                        ret = window.opener;
                        window.blur();
                        setTimeout(function () {
                            ret.focus();
                        }, 10);
                        reOpen = false;
                    }
                }
                if (reOpen && typeof window.opener.openMyPage == "function") {
                    try {
                        ret = window.opener.openMyPage(name, false, target);
                        if (ret != null) {
                            reOpen = false;
                        }
                    } catch (e1) {
                    }
                }
            }
        }
    }

    if (reOpen && direct) {
        ret = window.open(target, winName);
    }
    //返回是否打开已经存在的窗口
    return ret;
}

//获取页面的url
var pageUrlList = [];
function getPageUrl(pageName) {
    for (var i = 0; i < pageUrlList.length; i++) {
        if (pageUrlList[i].name == pageName) {
            return pageUrlList[i].url;
        }
    }
    return "";
}

var isloadSuc = false;//添加div成功
function loadPage() {
    //$.myajax.jsonGet('StandardLoginAction_getNavPage.action?clientLogin=' + getUrlParameter("clientLogin"), function (json, action, success) {
    // if (success) {../../Views/OperationManagement/OperationManagement.html
    // var strss = "{\"result\":0,\"pages\":[{\"name\":\"weizhi\",\"index\":null,\"lang\":null,\"privi\":1,\"url\":\"LocationManagement/Location\",\"title\":null},{\"name\":\"shipin\",\"index\":null,\"lang\":null,\"privi\":8,\"url\":\"LocationManagement/Location\",\"title\":null},{\"name\":\"guiji\",\"index\":null,\"lang\":null,\"privi\":7,\"url\":\"TrackManagement/Track\",\"title\":null},{\"name\":\"luxiang\",\"index\":null,\"lang\":null,\"privi\":9,\"url\":\"VideoManagement/VideoReplay\",\"title\":null},{\"name\":\"tongji\",\"index\":null,\"lang\":null,\"privi\":2,\"url\":\"StatisticalReports/StatisticalReports.html\",\"title\":null},{\"name\":\"yunying\",\"index\":null,\"lang\":null,\"privi\":3,\"url\":\"../OperationManagement/OperationManagement.html\",\"title\":null},{\"name\":\"guize\",\"index\":null,\"lang\":null,\"privi\":5,\"url\":\"RulesManagement/RulesManagement.html\",\"title\":null},{\"name\":\"server\",\"index\":null,\"lang\":null,\"privi\":6,\"url\":\"ServerManagement/ServerManagement.html\",\"title\":null}]}";
    var strss = "{\"result\":0,\"pages\":[{\"name\":\"shouye\",\"index\":null,\"lang\":null,\"privi\":1,\"url\":\"../HomeManagement/Home.html\",\"title\":null},{\"name\":\"weizhi\",\"index\":null,\"lang\":null,\"privi\":2,\"url\":\"../LocationManagement/Location.html\",\"title\":null},{\"name\":\"guiji\",\"index\":null,\"lang\":null,\"privi\":3,\"url\":\"../TrackManagement/Track.html\",\"title\":null},{\"name\":\"tongji\",\"index\":null,\"lang\":null,\"privi\":4,\"url\":\"../ReportsManagement/Reports.html\",\"title\":null},{\"name\":\"yunying\",\"index\":null,\"lang\":null,\"privi\":5,\"url\":\"../OperationManagement/OperationManagement.html\",\"title\":null}]}";
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
            $('#mainPanel-all').append(content);

            //加载子页面
            function loadSubPage(tabObj, pageName) {
                $(tabObj).addClass('current').siblings().removeClass("current");
                document.title = $(tabObj).find('.text').html();
                if (GetCookie('maintitle')) {
                    document.title += '-' + GetCookie('maintitle');
                }
                if ($('#mainPanel-all #mainPanel-' + pageName).length <= 0) {
                    $('#mainPanel-all').append(getMainPane(pageName, getPageUrl(pageName), ""));
                    $('#mainPanel-all #mainPanel-' + pageName).css('height', indexHeight - 5 + 'px');
                    $('#mainPanel-all #mainPanel-' + pageName).find('#leftPanel').css('width', '200px').css('height', indexHeight - 5 + 'px');
                    $('#mainPanel-all #mainPanel-' + pageName).find('#rightPanel').css('width', screenWidth - 205 + 'px').css('height', indexHeight - 5 + 'px').css("marginLeft", "200px");
                }
                $('#mainPanel-all #mainPanel-' + pageName).addClass('current').siblings().removeClass("current");
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
            //  //  flashCompanyTeamsAndVehicleTimer();hyy
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

//设置页面宽度
function setPanelWidthEx() {
    if (isloadSuc) {
        //设置页面大小
        setTimeout(setPanelWidth, 200);
    } else {
        setTimeout(setPanelWidthEx, 50);
    }
}

//设置子页面宽度大小
function setChildPanelWidth(name) {
    var child = $('#right-' + name, "#mainPanel-" + name).get(0);
    if (child != null) {
        if (typeof child.contentWindow.loadReportTableWidth == "function") {
            if (typeof child.contentWindow.fixHeight == "function") {
                child.contentWindow.loadReportTableWidth(child.contentWindow.fixHeight);
            } else {
                child.contentWindow.loadReportTableWidth();
            }
        }
    } else {
        //调整每个标签页管理的大小
        if (mapPageManage != null) {
            var pageManage_ = mapPageManage.get(name);
            if (pageManage_ && typeof pageManage_.pageManageResize == "function") {
                pageManage_.pageManageResize();
            }
        }

        /*$("#mainPanel-"+name+' .iframePage iframe').each(function() {
			if (typeof this.contentWindow.loadReportTableWidth == "function") {
				if(typeof this.contentWindow.fixHeight == "function") {
					this.contentWindow.loadReportTableWidth(this.contentWindow.fixHeight);
				}else {
					this.contentWindow.loadReportTableWidth();
				}
			}
		});*/
    }
}

//切换主菜单界面
function switchTopMenuPage(name) {
    if (name != null && name != '') {
        $('#tab-' + name).click();
    }
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

function doPasswordSuc() {
    $.dialog({ id: 'setPwd' }).close();
    $.dialog.tips(parent.lang.saveok, 1);
}

/**
 * 获取页面名称
 */
function getPageDisplay(key) {
    var name = '';
    switch (key) {
        case 1:
            name = lang.home_management;
            break;
        case 2:
            name = lang.location_management;
            break;       
        case 3:
            name = lang.track_management;          
            break;
        case 4:
            name = lang.reports_management;           
            break;
        case 5:
            name = lang.operations_management;          
            break;
        case 6:
            name = lang.Server_management;
            break;
        case 7:
            name = lang.rules_management;
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
        content += '<iframe id="all-' + name + '" width="100%" height="100%" scrolling="no"  frameborder="0" src="' + url + '"></iframe>';
    } else {
        content += '<div id="leftPanel">';
        content += '<iframe id="left-' + name + '" width="100%" height="100%" scrolling="no" frameborder="0" src="' + url + '"></iframe>';
        content += '</div>';
        content += '<div id="rightPanel">';
        if (name == 'guize') {
            content += '<iframe id="right-' + name + '" width="100%" height="100%" scrolling="no" frameborder="0" src="RulesManagement/' + myPageStyle.getCommonPageUrl('RuleMaintain') + '.cshtml"></iframe>';
        } else if (name == 'server') {
            content += '<iframe id="right-' + name + '" width="100%" height="100%" scrolling="no" frameborder="0" src="ServerManagement/AllServer.html?"></iframe>';
        } else if (name == 'tongji' || name == 'yunying' || name == 'xiaoche' || name == 'lajiche' || name == 'taxi' || name == 'whMgr' || name == 'police') {
            //			content += 	'<div id="'+ name +'Top" class="paneTop">标签页</div>';
            //			content += 	'<iframe id="right-'+name+'" width="100%" height="100%" frameborder="0" src=""></iframe>';
        } else {
            content += '<iframe id="right-' + name + '" width="100%" height="100%" scrolling="no"  frameborder="0" src=""></iframe>';
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
        $(this).find('#leftPanel').css('width', '200px').css('height', indexHeight - 5 + 'px');
        $(this).find('#rightPanel').css('width', screenWidth - 205 + 'px').css('height', indexHeight - 5 + 'px').css("marginLeft", "200px");
    });
    //修改样式
    if (myPageStyle) {
        myPageStyle.setIndexItemWidth();
    }
}

//var vehicleManager = new VehicleManager(); //车辆管理类
var vehicleList = null;	//车辆链表(报表等页面)
var vehicleListEx = null; //车辆列表（位置定位等页面）
var vehiGroupList = null;	//车辆车队链表
var vehiLineList = null;	//所有线路
var vehiOilList = new Array();
var vehiOBDList = new Array();
var vehiPeopleList = new Array();
var vehiTpmsList = new Array();
var vehiTempList = new Array();
var companys = null; //公司链表
var driverList = new Array();
//var mapMarker = new Array(); //全部区域
var isLoadVehiGroupList = false; // 是否已经加载车队链表
var isLoadCompanyList = false; //是否已经加载公司链表
var isLoadDriverList = false; //是否已经加载司机链表
var isLoadVehiList = false;	//是否已经加载车辆列表
var alarmClass = null;	//车辆报警监听类,子页面传递过来
var isChangedVehiGroup = false; //是否改变了公司车队信息
var isChangedVehicle = false; //是否改变了授权车辆信息
var isLoadMapMarkerList = false; //是否加载区域信息
var flashCompanyTeamsAndVehicleTime = 10000; //刷新信息时间间隔
var departments = []; //部门列表

//每隔10分钟刷新公司信息和授权车辆信息，如果有改变
function flashCompanyTeamsAndVehicleTimer() {
    setTimeout(flashCompanyTeamsAndVehicle, flashCompanyTeamsAndVehicleTime);
}

function flashCompanyTeamsAndVehicle() {
    //如果公司信息有改变
    if (isChangedVehiGroup) {
        getParentCompanyTeams();
        isChangedVehiGroup = false;
    }
    //如果授权车辆信息有改变
    if (isChangedVehicle) {
        getParentVehiList();
        isChangedVehicle = false;
    }
    flashCompanyTeamsAndVehicleTimer();
}

/**
 * 获得账号下可选公司和车队  报表等页面
 */
function getParentCompanyTeams() {
    //$.myajax.jsonGet('StandardLoginAction_loadCompanyList.action', function (json, action, success) {
    //    if (success) {
    var strjson = "{\"result\":0,\"companys\":[{\"name\":\"shenz深圳博实结\",\"id\":\"1\",\"level\":1,\"count\":null,\"parentId\":0,\"companyId\":0,\"vid\":null,\"simInfo\":null,\"plateType\":null,\"vehiId\":null,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"运维中心\",\"id\":\"2\",\"level\":2,\"count\":null,\"parentId\":1,\"companyId\":1,\"vid\":null,\"simInfo\":null,\"plateType\":null,\"vehiId\":null,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"CT12\",\"id\":\"4\",\"level\":1,\"count\":null,\"parentId\":0,\"companyId\":0,\"vid\":null,\"simInfo\":null,\"plateType\":null,\"vehiId\":null,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"上海卫脉信息技术有限公司\",\"id\":\"5\",\"level\":1,\"count\":null,\"parentId\":0,\"companyId\":0,\"vid\":null,\"simInfo\":null,\"plateType\":null,\"vehiId\":null,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null}]}";
    var json = JSON.parse(strjson);
            vehiGroupList = json.companys;
            companys = [];
            vehiLineList = [];
            departments = [];
            for (var i = 0; i < vehiGroupList.length; i++) {
                if (vehiGroupList[i].level == 1 || vehiGroupList[i].level == 4) {
                    companys.push(vehiGroupList[i]);
                } else if (vehiGroupList[i].level == 3) {
                    vehiLineList.push(vehiGroupList[i]);
                } else if (vehiGroupList[i].level == 12) {
                    departments.push(vehiGroupList[i]);
                }
            }
            isLoadVehiGroupList = true;
    //    };
    //}, null);
}


//var mapMarkManager = new MapMarkManager();
//var markers = [];
//获取区域信息(所有的区域信息)

//获取区域信息()
//设置经纬度半径等详细信息
function getMapmarkerInfo(id) {
    $.myajax.jsonGet('StandardLoginAction_findArea.action?id=' + id, function (json, action, success) {
        if (success) {
            var mapMarkerInfo = json.marker;
            var mapMark = mapMarkManager.getMapMark(mapMarkerInfo.id);
            mapMark.setStandardMarkJingWei(mapMarkerInfo);
            mapMarkManager.addMapMark(mapMarkerInfo.id, mapMark);
        };
    }, null);
}


/**
 * 获取公司下司机信息
 */
function getParentDrivers() {
    //$.myajax.jsonGet('StandardLoginAction_loadDriverList.action?type=0', function (json, action, success) {
    //    if (success) {
    var strjson = "{\"result\":0,\"infos\":[]}";
    var json = JSON.parse(strjson);
    driverList = json.infos;
            isLoadDriverList = true;
    //    };
    //}, null);
}

/**
 * 获取已授权车辆，报表等页面
 */
function getParentVehiList() {
    //$.myajax.jsonGet('StandardLoginAction_loadUserVehicleList.action', function (json, action, success) {
    //    if (success) {
    var strjson = "{\"result\":0,\"vehicles\":[{\"name\":\"013000010009\",\"id\":\"013000010009\",\"level\":null,\"count\":null,\"parentId\":2,\"companyId\":null,\"vid\":3,\"simInfo\":null,\"plateType\":2,\"vehiId\":3,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"013000010002\",\"id\":\"013000010002\",\"level\":null,\"count\":null,\"parentId\":1,\"companyId\":null,\"vid\":4,\"simInfo\":null,\"plateType\":2,\"vehiId\":4,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"018123654729\",\"id\":\"018123654729\",\"level\":null,\"count\":null,\"parentId\":1,\"companyId\":null,\"vid\":7,\"simInfo\":null,\"plateType\":2,\"vehiId\":7,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"018681598414\",\"id\":\"018681598414\",\"level\":null,\"count\":null,\"parentId\":1,\"companyId\":null,\"vid\":8,\"simInfo\":null,\"plateType\":2,\"vehiId\":8,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"013000010006\",\"id\":\"013000010006\",\"level\":null,\"count\":null,\"parentId\":2,\"companyId\":null,\"vid\":9,\"simInfo\":null,\"plateType\":2,\"vehiId\":9,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"013000010010\",\"id\":\"013000010010\",\"level\":null,\"count\":null,\"parentId\":1,\"companyId\":null,\"vid\":10,\"simInfo\":null,\"plateType\":2,\"vehiId\":10,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"13000000005\",\"id\":\"13000000005\",\"level\":null,\"count\":null,\"parentId\":4,\"companyId\":null,\"vid\":13,\"simInfo\":null,\"plateType\":2,\"vehiId\":13,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"13000000006\",\"id\":\"13000000006\",\"level\":null,\"count\":null,\"parentId\":4,\"companyId\":null,\"vid\":14,\"simInfo\":null,\"plateType\":2,\"vehiId\":14,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"014150374614\",\"id\":\"014150374614\",\"level\":null,\"count\":null,\"parentId\":2,\"companyId\":null,\"vid\":15,\"simInfo\":null,\"plateType\":2,\"vehiId\":15,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"13600000000\",\"id\":\"13600000000\",\"level\":null,\"count\":null,\"parentId\":1,\"companyId\":null,\"vid\":16,\"simInfo\":null,\"plateType\":2,\"vehiId\":16,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"13500000000\",\"id\":\"13500000000\",\"level\":null,\"count\":null,\"parentId\":1,\"companyId\":null,\"vid\":17,\"simInfo\":null,\"plateType\":2,\"vehiId\":17,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"CB72测试778801\",\"id\":\"CB72测试778801\",\"level\":null,\"count\":null,\"parentId\":2,\"companyId\":null,\"vid\":18,\"simInfo\":null,\"plateType\":2,\"vehiId\":18,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"013500000000\",\"id\":\"013500000000\",\"level\":null,\"count\":null,\"parentId\":1,\"companyId\":null,\"vid\":19,\"simInfo\":null,\"plateType\":2,\"vehiId\":19,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"贵CB5341\",\"id\":\"贵CB5341\",\"level\":null,\"count\":null,\"parentId\":4,\"companyId\":null,\"vid\":20,\"simInfo\":null,\"plateType\":2,\"vehiId\":20,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"贵CB4280\",\"id\":\"贵CB4280\",\"level\":null,\"count\":null,\"parentId\":4,\"companyId\":null,\"vid\":21,\"simInfo\":null,\"plateType\":2,\"vehiId\":21,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"贵C85796\",\"id\":\"贵C85796\",\"level\":null,\"count\":null,\"parentId\":4,\"companyId\":null,\"vid\":22,\"simInfo\":null,\"plateType\":2,\"vehiId\":22,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"贵C85795\",\"id\":\"贵C85795\",\"level\":null,\"count\":null,\"parentId\":4,\"companyId\":null,\"vid\":23,\"simInfo\":null,\"plateType\":2,\"vehiId\":23,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"贵C86518\",\"id\":\"贵C86518\",\"level\":null,\"count\":null,\"parentId\":4,\"companyId\":null,\"vid\":24,\"simInfo\":null,\"plateType\":2,\"vehiId\":24,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null}]}";
    var json = JSON.parse(strjson);
            vehicleList = json.vehicles;
            for (var i = 0; i < vehicleList.length; i++) {
                if (vehicleList[i].count != null && vehicleList[i].count == 1) {
                    vehiOilList.push(vehicleList[i]);
                }
                if (vehicleList[i].obd != null && vehicleList[i].obd == 1) {
                    vehiOBDList.push(vehicleList[i]);
                }
                if (vehicleList[i].level != null && vehicleList[i].level == 1) {
                    vehiPeopleList.push(vehicleList[i]);
                }
                if (vehicleList[i].tpms != null && vehicleList[i].tpms == 1) {
                    vehiTpmsList.push(vehicleList[i]);
                }
                if (vehicleList[i].temp != null && vehicleList[i].temp == 1) {
                    vehiTempList.push(vehicleList[i]);
                }
            }
            isLoadVehiList = true;
    //    };
    //}, null);
}

//加载线路和站点信息
function loadLineStationManage(lineInfos_, stationInfos_, lineRelations_, groupInfos_) {
    //分解线路分组信息
    if (groupInfos_ != null && groupInfos_.length > 0) {
        for (var i = 0; i < groupInfos_.length; i++) {
            var group_ = new StandardLineGroup(groupInfos_[i].id, groupInfos_[i].name);
            group_.setLineGroupInfo(groupInfos_[i]);
            vehicleManager.addLineGroup(groupInfos_[i].id, group_);
        }
    }
    //分解线路信息
    if (lineInfos_ != null && lineInfos_.length > 0) {
        for (var i = 0; i < lineInfos_.length; i++) {
            var line_ = new standardLine(lineInfos_[i].id, lineInfos_[i].name);
            line_.setRoleCls(myUserRole);
            line_.setStandardLine(lineInfos_[i]);
            vehicleManager.addLineInfo(lineInfos_[i].id, line_);
        }
    }
    //站点信息
    if (stationInfos_ != null && stationInfos_.length > 0) {
        for (var i = 0; i < stationInfos_.length; i++) {
            var station_ = new standardStation(stationInfos_[i].id, stationInfos_[i].name);
            station_.setMapType(mapType);
            station_.setRoleCls(myUserRole);
            station_.setStandardStation(stationInfos_[i]);
            vehicleManager.addStationInfo(stationInfos_[i].id, station_);
        }
    }
    //站点关联信息
    if (lineRelations_ != null && lineRelations_.length > 0) {
        for (var i = 0; i < lineRelations_.length; i++) {
            var relation_ = new lineStationRelation(lineRelations_[i].id);
            relation_.setRoleCls(myUserRole);
            relation_.setLineStationRelation(lineRelations_[i]);
            //线路id-线路方向-站点索引
            var relationId_ = relation_.getLineId() + '-' + relation_.getLineDirect() + '-' + relation_.getStationIndex();
            vehicleManager.addStationRelation(relationId_, relation_);
            //添加站点id到线路信息
            var line_ = vehicleManager.getLineInfo(relation_.getLineId());
            if (line_ != null) {
                var station = vehicleManager.getStationInfo(relation_.getStationId());
                line_.addStation(station, relation_.getLineDirect(), relation_.getStationIndex());
            }
        }
    }
}

//加载司机信息
function loadDriverManage(drivers) {
    if (drivers != null && drivers.length > 0) {
        for (var i = 0; i < drivers.length; i++) {
            var driver = new standardDriver(drivers[i].id, drivers[i].dn);
            driver.setStandardDriver(drivers[i]);
            vehicleManager.addDriverInfo(drivers[i].id, driver);
        }
    }
}

function loadVehiToMap() {
    if (vehicleListEx != null && vehicleListEx.length > 0) {
        var tempArray = [];
        var sortVehiList = [];
        //先解析车辆信息，放入sortVehiList链表中
        for (var i = 0; i < vehicleListEx.length; i++) {
            var vehi_old = vehicleListEx[i];
            var vehi = new standardVehicle(vehi_old.nm);
            vehi.setVehicle(vehi_old);
            //环卫不添加车牌号到线路
            if (vehi.getParentId() && !myUserRole.isSanitationTruck()) {
                //将线路下的车辆加入线路
                var line = vehicleManager.getLineInfo(vehi.getParentId());
                if (line) {
                    line.addvehiIdno(vehi.getIdno(), vehi.getVehiType());
                }
            }

            if (vehi_old.dl != null) {
                var devices = vehi_old.dl;
                for (var j = 0; j < devices.length; j++) {
                    var dev_old = devices[j];
                    var dev = new standardDevice(dev_old.id);
                    dev.setDevice(dev_old);
                    dev.setVehiIdno(vehi_old.nm);
                    dev.setPeopleTerminal(vehi.isPeopleTerminal());
                    vehi.addDevList(dev);
                    //将车辆加入到map集合
                    vehicleManager.addDevice(dev_old.id, dev);
                }
            }
            sortVehiList.push(vehi);
        }
        //对列表进行排序
        sortVehiList.sort(function (data1, data2) {
            //先判断是否在线，在判断是否停车，在线排在前面
            if (data1.isOnline() && data2.isOnline()) {
                //如果有一个处于停车状态
                if (data1.isParkStatus() && !data2.isParkStatus()) {
                    return 1;
                }
                if (!data1.isParkStatus() && data2.isParkStatus()) {
                    return -1;
                }
                //否则按车辆名称排序
            }

            //如果两个参数均为字符串类型
            var bnum1 = Number(data1.name);
            var bnum2 = Number(data2.name);
            if (!bnum1 && !bnum2) {
                var Regx = /^[A-Za-z0-9]*$/;
                var flag1 = Regx.test(data1.name); //字母
                var flag2 = Regx.test(data2.name);
                if (flag1 || flag2) {//按字母排序
                    if (flag1 && !flag2) {
                        return -1;
                    }
                    if (!flag1 && flag2) {
                        return 1;
                    }
                    if (flag1 && flag2) {
                        var str1 = data1.name.toLowerCase();
                        var str2 = data2.name.toLowerCase();
                        if (str1 > str2) return 1;
                        if (str1 == str2) return 0;
                        if (str1 < str2) return -1;
                    }
                }
                return data1.name.localeCompare(data2.name);
            }
            //如果参数1为数字，参数2为字符串
            if (bnum1 && !bnum2) {
                return -1;
            }
            //如果参数1为字符串，参数2为数字
            if (!bnum1 && bnum2) {
                return 1;
            }
            //如果两个参数均为数字
            if (bnum1 && bnum2) {
                var num1 = parseInt(data1.name, 10);
                var num2 = parseInt(data2.name, 10);
                if (num1 > num2) return 1;
                if (num1 == num2) return 0;
                if (num1 < num2) return -1;
            }
        });
        var tempArray = [];
        for (var i = 0; i < sortVehiList.length; i++) {
            var vehi = sortVehiList[i];
            //将车辆加入到map集合
            if (vehi.isOnline()) {
                vehicleManager.addVehicle(vehi.getIdno(), vehi);
                //将车牌号加入公司车队
                if (vehi.getParentId()) {
                    var team_ = vehicleManager.getTeam(vehi.getParentId().toString());
                    if (team_) {
                        team_.addOnlineVehiIdno(vehi.getIdno());
                    }
                }
            } else {
                tempArray.push(vehi);
            }
        }

        for (var i = 0; i < tempArray.length; i++) {
            vehicleManager.addVehicle(tempArray[i].getIdno(), tempArray[i]);
            //将车牌号加入公司车队
            if (tempArray[i].getParentId()) {
                var team_ = vehicleManager.getTeam(tempArray[i].getParentId().toString());
                if (team_) {
                    team_.addOfflineVehiIdno(tempArray[i].getIdno());
                }
            }
        }
    }
    vehicleManager.updateAllVehiIdnos();
    vehicleManager.updateAllDevIdnos();
}

//更新环卫车辆状态
function updateLineVehicleStatus(vehicleStatusList) {
    //数据格式[{id,lid,vid,stu,num,time,sid}]
    //更新之前，先把以前的数据清空
    var mapLineStatus = new Hashtable();
    for (var i = 0; i < vehicleStatusList.length; i++) {
        var lineInfo = parent.vehicleManager.getLineInfo(vehicleStatusList[i].lid);//线路信息
        if (lineInfo) {
            if (mapLineStatus.get(vehicleStatusList[i].lid) == null ||
					mapLineStatus.get(vehicleStatusList[i].lid) != 1) {
                lineInfo.clearLineVehicleStatus();
            }
            lineInfo.updateVehicleStatus(vehicleStatusList[i]);
            mapLineStatus.put(vehicleStatusList[i].lid, 1);
        }
    }
}

//
var isLoadPermitVehiGroupList = false; //公司信息是否加载完成

/**
 * 获取授权车辆(监控、回放等界面)
 */
function getUserVehicles() {
   // $.myajax.jsonGet('StandardLoginAction_getUserVehicleEx.action?toMap=' + toMap, function (json, action, success) {
    //  if (success) {
    var strjson = "{\"result\":0,\"infos\":[{\"name\":\"运维中心\",\"id\":\"2\",\"level\":2,\"count\":null,\"parentId\":1,\"companyId\":1,\"vid\":null,\"simInfo\":null,\"plateType\":null,\"vehiId\":null,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"shenz深圳博实结\",\"id\":\"1\",\"level\":1,\"count\":null,\"parentId\":0,\"companyId\":0,\"vid\":null,\"simInfo\":null,\"plateType\":null,\"vehiId\":null,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null},{\"name\":\"CT12\",\"id\":\"4\",\"level\":1,\"count\":null,\"parentId\":0,\"companyId\":0,\"vid\":null,\"simInfo\":null,\"plateType\":null,\"vehiId\":null,\"temp\":null,\"obd\":null,\"tpms\":null,\"actName\":null}],\"vehicles\":[{\"id\":3,\"desc\":null,\"dt\":null,\"dn\":null,\"abbr\":\"\",\"etm\":null,\"pid\":2,\"vtp\":\"\",\"nm\":\"013000010009\",\"pnm\":null,\"ic\":1,\"djb\":null,\"dl\":[{\"id\":\"013000010009\",\"tc\":0,\"st\":{\"id\":\"013000010009\",\"dt\":1,\"lc\":537000,\"vid\":null,\"pt\":6,\"sp\":760,\"net\":0,\"gw\":\"G1\",\"ol\":1,\"s1\":5251,\"s2\":0,\"s3\":0,\"s4\":0,\"t1\":0,\"t2\":0,\"t3\":0,\"t4\":0,\"hx\":140,\"lng\":113994184,\"lat\":22653400,\"mlng\":\"114.005584\",\"mlat\":\"22.656868\",\"pk\":0,\"gt\":\"2017-11-13 11:12:21.0\",\"ac\":7,\"ft\":24,\"fdt\":1,\"yl\":0,\"imei\":null,\"imsi\":null,\"hv\":null,\"sv\":null,\"po\":null,\"lid\":0,\"drid\":0,\"dct\":0,\"sfg\":0,\"snm\":0,\"sst\":0,\"or\":0,\"os\":0,\"ov\":0,\"ojt\":0,\"ost\":0,\"ojm\":0,\"ef\":0,\"p1\":0,\"p2\":0,\"p3\":0,\"p4\":0,\"p5\":0,\"p6\":0,\"p7\":0,\"p8\":0,\"p9\":0,\"p10\":0},\"nflt\":null,\"pid\":1,\"cn\":\"CH1,CH2,CH3,CH4,CH5,CH6,CH7,CH8\",\"ic\":0,\"cc\":8,\"io\":\"\",\"tn\":\"\",\"sim\":null,\"md\":361}],\"pvg\":\"1,2,3\",\"phone\":null},{\"id\":4,\"desc\":null,\"dt\":null,\"dn\":null,\"abbr\":\"\",\"etm\":null,\"pid\":1,\"vtp\":\"\",\"nm\":\"013000010002\",\"pnm\":null,\"ic\":1,\"djb\":null,\"dl\":[{\"id\":\"013000010002\",\"tc\":0,\"st\":{\"id\":\"013000010002\",\"dt\":1,\"lc\":3700,\"vid\":null,\"pt\":6,\"sp\":0,\"net\":0,\"gw\":\"G1\",\"ol\":0,\"s1\":13443,\"s2\":262144,\"s3\":0,\"s4\":0,\"t1\":0,\"t2\":0,\"t3\":0,\"t4\":0,\"hx\":0,\"lng\":114032952,\"lat\":22642500,\"mlng\":\"114.044542\",\"mlat\":\"22.645598\",\"pk\":180,\"gt\":\"2017-11-10 14:41:04.0\",\"ac\":7,\"ft\":24,\"fdt\":1,\"yl\":0,\"imei\":null,\"imsi\":null,\"hv\":null,\"sv\":null,\"po\":null,\"lid\":0,\"drid\":0,\"dct\":0,\"sfg\":0,\"snm\":0,\"sst\":0,\"or\":0,\"os\":0,\"ov\":0,\"ojt\":0,\"ost\":0,\"ojm\":0,\"ef\":0,\"p1\":0,\"p2\":0,\"p3\":0,\"p4\":0,\"p5\":0,\"p6\":0,\"p7\":0,\"p8\":0,\"p9\":0,\"p10\":0},\"nflt\":null,\"pid\":1,\"cn\":\"CH1,CH2,CH3,CH4\",\"ic\":0,\"cc\":4,\"io\":\"\",\"tn\":\"\",\"sim\":\"13803071533\",\"md\":361}],\"pvg\":\"1,2,3\",\"phone\":null},{\"id\":7,\"desc\":null,\"dt\":null,\"dn\":null,\"abbr\":\"\",\"etm\":null,\"pid\":1,\"vtp\":\"\",\"nm\":\"018123654729\",\"pnm\":null,\"ic\":1,\"djb\":null,\"dl\":[{\"id\":\"018123654729\",\"tc\":0,\"st\":{\"id\":\"018123654729\",\"dt\":2,\"lc\":1665700,\"vid\":null,\"pt\":6,\"sp\":730,\"net\":0,\"gw\":\"G1\",\"ol\":1,\"s1\":-2147482237,\"s2\":0,\"s3\":0,\"s4\":0,\"t1\":0,\"t2\":0,\"t3\":0,\"t4\":0,\"hx\":146,\"lng\":113995131,\"lat\":22652184,\"mlng\":\"114.006532\",\"mlat\":\"22.655655\",\"pk\":0,\"gt\":\"2017-11-13 11:12:28.0\",\"ac\":7,\"ft\":29,\"fdt\":1,\"yl\":1281,\"imei\":null,\"imsi\":null,\"hv\":null,\"sv\":null,\"po\":null,\"lid\":0,\"drid\":0,\"dct\":0,\"sfg\":0,\"snm\":0,\"sst\":0,\"or\":0,\"os\":0,\"ov\":0,\"ojt\":0,\"ost\":0,\"ojm\":0,\"ef\":0,\"p1\":0,\"p2\":0,\"p3\":0,\"p4\":0,\"p5\":0,\"p6\":0,\"p7\":0,\"p8\":0,\"p9\":0,\"p10\":0},\"nflt\":null,\"pid\":1,\"cn\":\"CH1,CH2,CH3,CH4,CH5\",\"ic\":0,\"cc\":5,\"io\":\"\",\"tn\":\"\",\"sim\":\"18123654729\",\"md\":361}],\"pvg\":\"1,2,3\",\"phone\":null},{\"id\":8,\"desc\":null,\"dt\":null,\"dn\":null,\"abbr\":\"\",\"etm\":null,\"pid\":1,\"vtp\":\"\",\"nm\":\"018681598414\",\"pnm\":null,\"ic\":1,\"djb\":null,\"dl\":[{\"id\":\"018681598414\",\"tc\":0,\"st\":{\"id\":\"018681598414\",\"dt\":1,\"lc\":0,\"vid\":null,\"pt\":6,\"sp\":0,\"net\":0,\"gw\":\"G1\",\"ol\":0,\"s1\":10369,\"s2\":327680,\"s3\":0,\"s4\":0,\"t1\":0,\"t2\":0,\"t3\":0,\"t4\":0,\"hx\":0,\"lng\":114032936,\"lat\":22642600,\"mlng\":\"114.044526\",\"mlat\":\"22.645698\",\"pk\":6444,\"gt\":\"2017-10-24 17:31:27.0\",\"ac\":7,\"ft\":24,\"fdt\":1,\"yl\":0,\"imei\":null,\"imsi\":null,\"hv\":null,\"sv\":null,\"po\":null,\"lid\":0,\"drid\":0,\"dct\":0,\"sfg\":0,\"snm\":0,\"sst\":0,\"or\":0,\"os\":0,\"ov\":0,\"ojt\":0,\"ost\":0,\"ojm\":0,\"ef\":0,\"p1\":0,\"p2\":0,\"p3\":0,\"p4\":0,\"p5\":0,\"p6\":0,\"p7\":0,\"p8\":0,\"p9\":0,\"p10\":0},\"nflt\":null,\"pid\":1,\"cn\":\"CH1,CH2,CH3,CH4\",\"ic\":0,\"cc\":4,\"io\":\"\",\"tn\":\"\",\"sim\":null,\"md\":361}],\"pvg\":\"1,2,3\",\"phone\":null},{\"id\":9,\"desc\":null,\"dt\":null,\"dn\":null,\"abbr\":\"\",\"etm\":null,\"pid\":2,\"vtp\":\"\",\"nm\":\"013000010006\",\"pnm\":null,\"ic\":1,\"djb\":null,\"dl\":[{\"id\":\"013000010006\",\"tc\":0,\"st\":{\"id\":\"013000010006\",\"dt\":1,\"lc\":3700,\"vid\":null,\"pt\":6,\"sp\":0,\"net\":0,\"gw\":\"G1\",\"ol\":0,\"s1\":13443,\"s2\":262144,\"s3\":0,\"s4\":0,\"t1\":0,\"t2\":0,\"t3\":0,\"t4\":0,\"hx\":0,\"lng\":114032952,\"lat\":22642500,\"mlng\":\"114.044542\",\"mlat\":\"22.645598\",\"pk\":0,\"gt\":\"2017-11-10 14:46:09.0\",\"ac\":7,\"ft\":24,\"fdt\":1,\"yl\":0,\"imei\":null,\"imsi\":null,\"hv\":null,\"sv\":null,\"po\":null,\"lid\":0,\"drid\":0,\"dct\":0,\"sfg\":0,\"snm\":0,\"sst\":0,\"or\":0,\"os\":0,\"ov\":0,\"ojt\":0,\"ost\":0,\"ojm\":0,\"ef\":0,\"p1\":0,\"p2\":0,\"p3\":0,\"p4\":0,\"p5\":0,\"p6\":0,\"p7\":0,\"p8\":0,\"p9\":0,\"p10\":0},\"nflt\":null,\"pid\":1,\"cn\":\"CH1,CH2,CH3,CH4\",\"ic\":0,\"cc\":4,\"io\":\"\",\"tn\":\"\",\"sim\":null,\"md\":361}],\"pvg\":\"1,2,3\",\"phone\":null},{\"id\":10,\"desc\":null,\"dt\":null,\"dn\":null,\"abbr\":\"\",\"etm\":null,\"pid\":1,\"vtp\":\"\",\"nm\":\"013000010010\",\"pnm\":null,\"ic\":1,\"djb\":null,\"dl\":[{\"id\":\"013000010010\",\"tc\":0,\"st\":{\"id\":\"013000010010\",\"dt\":1,\"lc\":70700,\"vid\":null,\"pt\":6,\"sp\":760,\"net\":0,\"gw\":\"G1\",\"ol\":1,\"s1\":5251,\"s2\":0,\"s3\":0,\"s4\":0,\"t1\":0,\"t2\":0,\"t3\":0,\"t4\":0,\"hx\":140,\"lng\":113992528,\"lat\":22655318,\"mlng\":\"114.003924\",\"mlat\":\"22.658779\",\"pk\":0,\"gt\":\"2017-11-13 11:12:09.0\",\"ac\":7,\"ft\":24,\"fdt\":1,\"yl\":0,\"imei\":null,\"imsi\":null,\"hv\":null,\"sv\":null,\"po\":null,\"lid\":0,\"drid\":0,\"dct\":0,\"sfg\":0,\"snm\":0,\"sst\":0,\"or\":0,\"os\":0,\"ov\":0,\"ojt\":0,\"ost\":0,\"ojm\":0,\"ef\":0,\"p1\":0,\"p2\":0,\"p3\":0,\"p4\":0,\"p5\":0,\"p6\":0,\"p7\":0,\"p8\":0,\"p9\":0,\"p10\":0},\"nflt\":null,\"pid\":1,\"cn\":\"CH1,CH2,CH3,CH4,CH5,CH6,CH7,CH8\",\"ic\":0,\"cc\":8,\"io\":\"\",\"tn\":\"\",\"sim\":null,\"md\":361}],\"pvg\":\"1,2,3\",\"phone\":null},{\"id\":13,\"desc\":null,\"dt\":null,\"dn\":null,\"abbr\":null,\"etm\":null,\"pid\":4,\"vtp\":null,\"nm\":\"13000000005\",\"pnm\":null,\"ic\":10,\"djb\":null,\"dl\":[{\"id\":\"13000000005\",\"tc\":0,\"st\":{\"id\":\"13000000005\",\"dt\":null,\"lc\":null,\"vid\":null,\"pt\":null,\"sp\":null,\"net\":null,\"gw\":null,\"ol\":null,\"s1\":null,\"s2\":null,\"s3\":null,\"s4\":null,\"t1\":null,\"t2\":null,\"t3\":null,\"t4\":null,\"hx\":null,\"lng\":0,\"lat\":0,\"mlng\":\"\",\"mlat\":\"\",\"pk\":null,\"gt\":null,\"ac\":null,\"ft\":null,\"fdt\":null,\"yl\":null,\"imei\":null,\"imsi\":null,\"hv\":null,\"sv\":null,\"po\":null,\"lid\":0,\"drid\":0,\"dct\":0,\"sfg\":0,\"snm\":0,\"sst\":0,\"or\":0,\"os\":0,\"ov\":0,\"ojt\":0,\"ost\":0,\"ojm\":0,\"ef\":0,\"p1\":0,\"p2\":0,\"p3\":0,\"p4\":0,\"p5\":0,\"p6\":0,\"p7\":0,\"p8\":0,\"p9\":0,\"p10\":0},\"nflt\":null,\"pid\":4,\"cn\":\"CH1,CH2,CH3,CH4,CH5,CH6,CH7,CH8\",\"ic\":0,\"cc\":8,\"io\":\"\",\"tn\":\"\",\"sim\":null,\"md\":361}],\"pvg\":\"1,2,3\",\"phone\":null},{\"id\":14,\"desc\":null,\"dt\":null,\"dn\":null,\"abbr\":null,\"etm\":null,\"pid\":4,\"vtp\":null,\"nm\":\"13000000006\",\"pnm\":null,\"ic\":10,\"djb\":null,\"dl\":[{\"id\":\"13000000006\",\"tc\":0,\"st\":{\"id\":\"13000000006\",\"dt\":null,\"lc\":null,\"vid\":null,\"pt\":null,\"sp\":null,\"net\":null,\"gw\":null,\"ol\":null,\"s1\":null,\"s2\":null,\"s3\":null,\"s4\":null,\"t1\":null,\"t2\":null,\"t3\":null,\"t4\":null,\"hx\":null,\"lng\":0,\"lat\":0,\"mlng\":\"\",\"mlat\":\"\",\"pk\":null,\"gt\":null,\"ac\":null,\"ft\":null,\"fdt\":null,\"yl\":null,\"imei\":null,\"imsi\":null,\"hv\":null,\"sv\":null,\"po\":null,\"lid\":0,\"drid\":0,\"dct\":0,\"sfg\":0,\"snm\":0,\"sst\":0,\"or\":0,\"os\":0,\"ov\":0,\"ojt\":0,\"ost\":0,\"ojm\":0,\"ef\":0,\"p1\":0,\"p2\":0,\"p3\":0,\"p4\":0,\"p5\":0,\"p6\":0,\"p7\":0,\"p8\":0,\"p9\":0,\"p10\":0},\"nflt\":null,\"pid\":4,\"cn\":\"CH1,CH2,CH3,CH4,CH5,CH6,CH7,CH8\",\"ic\":0,\"cc\":8,\"io\":\"\",\"tn\":\"\",\"sim\":null,\"md\":361}],\"pvg\":\"1,2,3\",\"phone\":null},{\"id\":15,\"desc\":null,\"dt\":null,\"dn\":null,\"abbr\":null,\"etm\":null,\"pid\":2,\"vtp\":null,\"nm\":\"014150374614\",\"pnm\":null,\"ic\":1,\"djb\":null,\"dl\":[{\"id\":\"014150374614\",\"tc\":0,\"st\":{\"id\":\"014150374614\",\"dt\":1,\"lc\":1300,\"vid\":null,\"pt\":6,\"sp\":0,\"net\":0,\"gw\":\"G1\",\"ol\":0,\"s1\":12291,\"s2\":0,\"s3\":0,\"s4\":256,\"t1\":0,\"t2\":0,\"t3\":0,\"t4\":0,\"hx\":0,\"lng\":114033048,\"lat\":22642750,\"mlng\":\"114.044639\",\"mlat\":\"22.645846\",\"pk\":30,\"gt\":\"2017-11-10 19:17:49.0\",\"ac\":7,\"ft\":24,\"fdt\":1,\"yl\":0,\"imei\":null,\"imsi\":null,\"hv\":null,\"sv\":null,\"po\":null,\"lid\":0,\"drid\":0,\"dct\":0,\"sfg\":0,\"snm\":0,\"sst\":0,\"or\":0,\"os\":0,\"ov\":0,\"ojt\":0,\"ost\":0,\"ojm\":0,\"ef\":0,\"p1\":0,\"p2\":0,\"p3\":0,\"p4\":0,\"p5\":0,\"p6\":0,\"p7\":0,\"p8\":0,\"p9\":0,\"p10\":0},\"nflt\":null,\"pid\":2,\"cn\":\"CH1,CH2,CH3,CH4\",\"ic\":0,\"cc\":4,\"io\":\"\",\"tn\":\"\",\"sim\":\"14150374614\",\"md\":361}],\"pvg\":\"1,2,3\",\"phone\":null},{\"id\":16,\"desc\":null,\"dt\":null,\"dn\":null,\"abbr\":null,\"etm\":null,\"pid\":1,\"vtp\":null,\"nm\":\"13600000000\",\"pnm\":null,\"ic\":1,\"djb\":null,\"dl\":[{\"id\":\"13600000000\",\"tc\":0,\"st\":{\"id\":\"13600000000\",\"dt\":null,\"lc\":null,\"vid\":null,\"pt\":null,\"sp\":null,\"net\":null,\"gw\":null,\"ol\":null,\"s1\":null,\"s2\":null,\"s3\":null,\"s4\":null,\"t1\":null,\"t2\":null,\"t3\":null,\"t4\":null,\"hx\":null,\"lng\":0,\"lat\":0,\"mlng\":\"\",\"mlat\":\"\",\"pk\":null,\"gt\":null,\"ac\":null,\"ft\":null,\"fdt\":null,\"yl\":null,\"imei\":null,\"imsi\":null,\"hv\":null,\"sv\":null,\"po\":null,\"lid\":0,\"drid\":0,\"dct\":0,\"sfg\":0,\"snm\":0,\"sst\":0,\"or\":0,\"os\":0,\"ov\":0,\"ojt\":0,\"ost\":0,\"ojm\":0,\"ef\":0,\"p1\":0,\"p2\":0,\"p3\":0,\"p4\":0,\"p5\":0,\"p6\":0,\"p7\":0,\"p8\":0,\"p9\":0,\"p10\":0},\"nflt\":null,\"pid\":1,\"cn\":\"CH1,CH2,CH3,CH4\",\"ic\":0,\"cc\":4,\"io\":\"\",\"tn\":\"\",\"sim\":null,\"md\":361}],\"pvg\":\"1,2,3\",\"phone\":null},{\"id\":17,\"desc\":null,\"dt\":null,\"dn\":null,\"abbr\":null,\"etm\":null,\"pid\":1,\"vtp\":null,\"nm\":\"13500000000\",\"pnm\":null,\"ic\":1,\"djb\":null,\"dl\":[{\"id\":\"13500000000\",\"tc\":0,\"st\":{\"id\":\"13500000000\",\"dt\":null,\"lc\":null,\"vid\":null,\"pt\":null,\"sp\":null,\"net\":null,\"gw\":null,\"ol\":null,\"s1\":null,\"s2\":null,\"s3\":null,\"s4\":null,\"t1\":null,\"t2\":null,\"t3\":null,\"t4\":null,\"hx\":null,\"lng\":0,\"lat\":0,\"mlng\":\"\",\"mlat\":\"\",\"pk\":null,\"gt\":null,\"ac\":null,\"ft\":null,\"fdt\":null,\"yl\":null,\"imei\":null,\"imsi\":null,\"hv\":null,\"sv\":null,\"po\":null,\"lid\":0,\"drid\":0,\"dct\":0,\"sfg\":0,\"snm\":0,\"sst\":0,\"or\":0,\"os\":0,\"ov\":0,\"ojt\":0,\"ost\":0,\"ojm\":0,\"ef\":0,\"p1\":0,\"p2\":0,\"p3\":0,\"p4\":0,\"p5\":0,\"p6\":0,\"p7\":0,\"p8\":0,\"p9\":0,\"p10\":0},\"nflt\":null,\"pid\":1,\"cn\":\"CH1,CH2,CH3,CH4\",\"ic\":0,\"cc\":4,\"io\":\"\",\"tn\":\"\",\"sim\":null,\"md\":361}],\"pvg\":\"1,2,3\",\"phone\":null},{\"id\":18,\"desc\":null,\"dt\":null,\"dn\":null,\"abbr\":\"\",\"etm\":null,\"pid\":2,\"vtp\":\"\",\"nm\":\"CB72测试778801\",\"pnm\":null,\"ic\":7,\"djb\":null,\"dl\":[{\"id\":\"014200778801\",\"tc\":0,\"st\":{\"id\":\"014200778801\",\"dt\":1,\"lc\":200,\"vid\":null,\"pt\":6,\"sp\":0,\"net\":0,\"gw\":\"G1\",\"ol\":0,\"s1\":13443,\"s2\":0,\"s3\":0,\"s4\":0,\"t1\":0,\"t2\":0,\"t3\":0,\"t4\":0,\"hx\":0,\"lng\":113746312,\"lat\":34729984,\"mlng\":\"113.758909\",\"mlat\":\"34.735275\",\"pk\":1290,\"gt\":\"2017-11-08 20:36:29.0\",\"ac\":7,\"ft\":24,\"fdt\":1,\"yl\":0,\"imei\":null,\"imsi\":null,\"hv\":null,\"sv\":null,\"po\":null,\"lid\":0,\"drid\":0,\"dct\":0,\"sfg\":0,\"snm\":0,\"sst\":0,\"or\":0,\"os\":0,\"ov\":0,\"ojt\":0,\"ost\":0,\"ojm\":0,\"ef\":0,\"p1\":0,\"p2\":0,\"p3\":0,\"p4\":0,\"p5\":0,\"p6\":0,\"p7\":0,\"p8\":0,\"p9\":0,\"p10\":0},\"nflt\":null,\"pid\":1,\"cn\":\"CH1,CH2,CH3,CH4\",\"ic\":0,\"cc\":4,\"io\":\"\",\"tn\":\"\",\"sim\":null,\"md\":361}],\"pvg\":\"1,2,3\",\"phone\":null},{\"id\":19,\"desc\":null,\"dt\":null,\"dn\":null,\"abbr\":\"\",\"etm\":null,\"pid\":1,\"vtp\":\"\",\"nm\":\"013500000000\",\"pnm\":null,\"ic\":1,\"djb\":null,\"dl\":[{\"id\":\"013500000000\",\"tc\":0,\"st\":{\"id\":\"013500000000\",\"dt\":1,\"lc\":100,\"vid\":null,\"pt\":6,\"sp\":0,\"net\":0,\"gw\":\"G1\",\"ol\":0,\"s1\":13443,\"s2\":0,\"s3\":0,\"s4\":0,\"t1\":0,\"t2\":0,\"t3\":0,\"t4\":0,\"hx\":0,\"lng\":114032912,\"lat\":22642550,\"mlng\":\"114.044502\",\"mlat\":\"22.645649\",\"pk\":358,\"gt\":\"2017-11-10 15:30:10.0\",\"ac\":7,\"ft\":24,\"fdt\":1,\"yl\":0,\"imei\":null,\"imsi\":null,\"hv\":null,\"sv\":null,\"po\":null,\"lid\":0,\"drid\":0,\"dct\":0,\"sfg\":0,\"snm\":0,\"sst\":0,\"or\":0,\"os\":0,\"ov\":0,\"ojt\":0,\"ost\":0,\"ojm\":0,\"ef\":0,\"p1\":0,\"p2\":0,\"p3\":0,\"p4\":0,\"p5\":0,\"p6\":0,\"p7\":0,\"p8\":0,\"p9\":0,\"p10\":0},\"nflt\":null,\"pid\":1,\"cn\":\"CH1,CH2,CH3,CH4\",\"ic\":0,\"cc\":4,\"io\":\"\",\"tn\":\"\",\"sim\":null,\"md\":361}],\"pvg\":\"1,2,3\",\"phone\":null},{\"id\":20,\"desc\":null,\"dt\":null,\"dn\":null,\"abbr\":\"\",\"etm\":null,\"pid\":4,\"vtp\":\"\",\"nm\":\"贵CB5341\",\"pnm\":null,\"ic\":1,\"djb\":null,\"dl\":[{\"id\":\"014150293557\",\"tc\":0,\"st\":{\"id\":\"014150293557\",\"dt\":1,\"lc\":28440300,\"vid\":null,\"pt\":6,\"sp\":0,\"net\":0,\"gw\":\"G1\",\"ol\":0,\"s1\":11266,\"s2\":0,\"s3\":0,\"s4\":256,\"t1\":0,\"t2\":0,\"t3\":0,\"t4\":0,\"hx\":0,\"lng\":107412000,\"lat\":28601134,\"mlng\":\"107.423025\",\"mlat\":\"28.604196\",\"pk\":3824,\"gt\":\"2017-11-08 15:52:22.0\",\"ac\":7,\"ft\":24,\"fdt\":1,\"yl\":0,\"imei\":null,\"imsi\":null,\"hv\":null,\"sv\":null,\"po\":null,\"lid\":0,\"drid\":0,\"dct\":0,\"sfg\":0,\"snm\":0,\"sst\":0,\"or\":0,\"os\":0,\"ov\":0,\"ojt\":0,\"ost\":0,\"ojm\":0,\"ef\":0,\"p1\":0,\"p2\":0,\"p3\":0,\"p4\":0,\"p5\":0,\"p6\":0,\"p7\":0,\"p8\":0,\"p9\":0,\"p10\":0},\"nflt\":null,\"pid\":4,\"cn\":\"CH1,CH2,CH3,CH4\",\"ic\":0,\"cc\":4,\"io\":\"\",\"tn\":\"\",\"sim\":null,\"md\":361}],\"pvg\":\"1,2,3\",\"phone\":null},{\"id\":21,\"desc\":null,\"dt\":null,\"dn\":null,\"abbr\":\"\",\"etm\":null,\"pid\":4,\"vtp\":\"\",\"nm\":\"贵CB4280\",\"pnm\":null,\"ic\":1,\"djb\":null,\"dl\":[{\"id\":\"014150293671\",\"tc\":0,\"st\":{\"id\":\"014150293671\",\"dt\":1,\"lc\":33342500,\"vid\":null,\"pt\":6,\"sp\":0,\"net\":0,\"gw\":\"G1\",\"ol\":0,\"s1\":11395,\"s2\":0,\"s3\":0,\"s4\":0,\"t1\":0,\"t2\":0,\"t3\":0,\"t4\":0,\"hx\":219,\"lng\":107442384,\"lat\":28564200,\"mlng\":\"107.453482\",\"mlat\":\"28.566750\",\"pk\":0,\"gt\":\"2017-11-08 15:51:50.0\",\"ac\":7,\"ft\":24,\"fdt\":1,\"yl\":0,\"imei\":null,\"imsi\":null,\"hv\":null,\"sv\":null,\"po\":null,\"lid\":0,\"drid\":0,\"dct\":0,\"sfg\":0,\"snm\":0,\"sst\":0,\"or\":0,\"os\":0,\"ov\":0,\"ojt\":0,\"ost\":0,\"ojm\":0,\"ef\":0,\"p1\":0,\"p2\":0,\"p3\":0,\"p4\":0,\"p5\":0,\"p6\":0,\"p7\":0,\"p8\":0,\"p9\":0,\"p10\":0},\"nflt\":null,\"pid\":4,\"cn\":\"CH1,CH2,CH3,CH4\",\"ic\":0,\"cc\":4,\"io\":\"\",\"tn\":\"\",\"sim\":null,\"md\":361}],\"pvg\":\"1,2,3\",\"phone\":null},{\"id\":22,\"desc\":null,\"dt\":null,\"dn\":null,\"abbr\":\"\",\"etm\":null,\"pid\":4,\"vtp\":\"\",\"nm\":\"贵C85796\",\"pnm\":null,\"ic\":1,\"djb\":null,\"dl\":[{\"id\":\"014150293714\",\"tc\":0,\"st\":{\"id\":\"014150293714\",\"dt\":1,\"lc\":33262100,\"vid\":null,\"pt\":6,\"sp\":70,\"net\":0,\"gw\":\"G1\",\"ol\":0,\"s1\":3203,\"s2\":0,\"s3\":0,\"s4\":0,\"t1\":0,\"t2\":0,\"t3\":0,\"t4\":0,\"hx\":28,\"lng\":107411184,\"lat\":28600082,\"mlng\":\"107.422207\",\"mlat\":\"28.603155\",\"pk\":0,\"gt\":\"2017-11-08 15:49:46.0\",\"ac\":7,\"ft\":24,\"fdt\":1,\"yl\":0,\"imei\":null,\"imsi\":null,\"hv\":null,\"sv\":null,\"po\":null,\"lid\":0,\"drid\":0,\"dct\":0,\"sfg\":0,\"snm\":0,\"sst\":0,\"or\":0,\"os\":0,\"ov\":0,\"ojt\":0,\"ost\":0,\"ojm\":0,\"ef\":0,\"p1\":0,\"p2\":0,\"p3\":0,\"p4\":0,\"p5\":0,\"p6\":0,\"p7\":0,\"p8\":0,\"p9\":0,\"p10\":0},\"nflt\":null,\"pid\":4,\"cn\":\"CH1,CH2,CH3,CH4\",\"ic\":0,\"cc\":4,\"io\":\"\",\"tn\":\"\",\"sim\":null,\"md\":361}],\"pvg\":\"1,2,3\",\"phone\":null},{\"id\":23,\"desc\":null,\"dt\":null,\"dn\":null,\"abbr\":null,\"etm\":null,\"pid\":4,\"vtp\":null,\"nm\":\"贵C85795\",\"pnm\":null,\"ic\":1,\"djb\":null,\"dl\":[{\"id\":\"014150293503\",\"tc\":0,\"st\":{\"id\":\"014150293503\",\"dt\":1,\"lc\":28449500,\"vid\":null,\"pt\":6,\"sp\":0,\"net\":0,\"gw\":\"G1\",\"ol\":0,\"s1\":11266,\"s2\":0,\"s3\":0,\"s4\":256,\"t1\":0,\"t2\":0,\"t3\":0,\"t4\":0,\"hx\":0,\"lng\":113973416,\"lat\":22675868,\"mlng\":\"113.984819\",\"mlat\":\"22.679086\",\"pk\":3231,\"gt\":\"2017-11-08 15:50:54.0\",\"ac\":7,\"ft\":24,\"fdt\":1,\"yl\":0,\"imei\":null,\"imsi\":null,\"hv\":null,\"sv\":null,\"po\":null,\"lid\":0,\"drid\":0,\"dct\":0,\"sfg\":0,\"snm\":0,\"sst\":0,\"or\":0,\"os\":0,\"ov\":0,\"ojt\":0,\"ost\":0,\"ojm\":0,\"ef\":0,\"p1\":0,\"p2\":0,\"p3\":0,\"p4\":0,\"p5\":0,\"p6\":0,\"p7\":0,\"p8\":0,\"p9\":0,\"p10\":0},\"nflt\":null,\"pid\":4,\"cn\":\"CH1,CH2,CH3,CH4\",\"ic\":0,\"cc\":4,\"io\":\"\",\"tn\":\"\",\"sim\":null,\"md\":361}],\"pvg\":\"1,2,3\",\"phone\":null},{\"id\":24,\"desc\":null,\"dt\":null,\"dn\":null,\"abbr\":null,\"etm\":null,\"pid\":4,\"vtp\":null,\"nm\":\"贵C86518\",\"pnm\":null,\"ic\":1,\"djb\":null,\"dl\":[{\"id\":\"014150293662\",\"tc\":0,\"st\":{\"id\":\"014150293662\",\"dt\":1,\"lc\":29311300,\"vid\":null,\"pt\":6,\"sp\":0,\"net\":0,\"gw\":\"G1\",\"ol\":0,\"s1\":11264,\"s2\":0,\"s3\":0,\"s4\":256,\"t1\":0,\"t2\":0,\"t3\":0,\"t4\":0,\"hx\":0,\"lng\":113972744,\"lat\":22675950,\"mlng\":\"113.984147\",\"mlat\":\"22.679155\",\"pk\":5119,\"gt\":\"2017-11-08 15:47:49.0\",\"ac\":7,\"ft\":24,\"fdt\":1,\"yl\":0,\"imei\":null,\"imsi\":null,\"hv\":null,\"sv\":null,\"po\":null,\"lid\":0,\"drid\":0,\"dct\":0,\"sfg\":0,\"snm\":0,\"sst\":0,\"or\":0,\"os\":0,\"ov\":0,\"ojt\":0,\"ost\":0,\"ojm\":0,\"ef\":0,\"p1\":0,\"p2\":0,\"p3\":0,\"p4\":0,\"p5\":0,\"p6\":0,\"p7\":0,\"p8\":0,\"p9\":0,\"p10\":0},\"nflt\":null,\"pid\":4,\"cn\":\"CH1,CH2,CH3,CH4\",\"ic\":0,\"cc\":4,\"io\":\"\",\"tn\":\"\",\"sim\":null,\"md\":361}],\"pvg\":\"1,2,3\",\"phone\":null}]}";
    var json = JSON.parse(strjson);
            if (myUserRole.isManageLine()) {//公交
                //加载线路和站点信息
                loadLineStationManage(json.lineInfos, json.stationInfos, json.lineRelations);
                //加载司机信息
                loadDriverManage(json.drivers);
            } else if (myUserRole.isSanitationTruck()) {//环卫
                //加载线路和站点信息
                loadLineStationManage(json.lineInfos, json.stationInfos, json.lineRelations, json.groupInfos);
            }
            //公司信息
            var permitVehiGroupList = json.infos;
            for (var i = 0; i < permitVehiGroupList.length; i++) {
                var team = new vehicleTeam(permitVehiGroupList[i].id, permitVehiGroupList[i].name);
                team.setVehicleTeam(permitVehiGroupList[i]);
                vehicleManager.addTeam(permitVehiGroupList[i].id, team);
            }
            for (var i = 0; i < permitVehiGroupList.length; i++) {
                //如果存在父公司，则添加父公司或者子公司
                if (permitVehiGroupList[i].parentId) {
                    //环卫不添加线路
                    if (!myUserRole.isSanitationTruck() || (myUserRole.isSanitationTruck() && permitVehiGroupList[i].level != 3)) {
                        var parentTeam = vehicleManager.getTeam(permitVehiGroupList[i].parentId.toString());
                        if (parentTeam) {
                            parentTeam.addChildTeam(permitVehiGroupList[i].id);
                            var team_ = vehicleManager.getTeam(permitVehiGroupList[i].id);
                            if (team_) {
                                team_.addParentTeam(parentTeam.id);
                            }
                        }
                    }
                }
            }
            //车辆信息
            vehicleListEx = json.vehicles;
            loadVehiToMap(json.vehicles);
            //线路车辆状态信息
            if (myUserRole.isSanitationTruck()) {//环卫
                //主要用于画线
                if (json.vehicleStatus != null && json.vehicleStatus.length > 0) {
                    updateLineVehicleStatus(json.vehicleStatus); //更新环卫车辆状态
                }
            }


            isLoadVehiList = true;
            isLoadPermitVehiGroupList = true;
      //  }
   // }, null);
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

var chineseMainTitle = null;
var englishMainTitle = null;
var twMainTitle = null;
var chineseCopyright = null;
var englishCopyright = null;
var twCopyright = null;
function ajaxLoadInformation() {
    //向服务器发送ajax请求
    $.myajax.jsonGet("StandardLoginAction_information.action", function (json, action, success) {
        if (success) {
            chineseMainTitle = json.ChineseMainTitle;
            englishMainTitle = json.EnglishMainTitle;
            twMainTitle = json.TwMainTitle;
            chineseCopyright = json.ChineseCopyright;
            englishCopyright = json.EnglishCopyright;
            twCopyright = json.TwCopyright;
            showTitleAndCopyRight();

            setTimeout(ajaxLoadInformation, 100000);
        }
    }, null);
}

function showTitleAndCopyRight() {
    if (langIsChinese()) {
        if (chineseMainTitle != null) {
            //document.title = chineseMainTitle;
            $('#spanTitle').text(chineseMainTitle);
            $('#spanTitle').attr('title', chineseMainTitle);
            SetCookie("maintitle", chineseMainTitle);
        }
        if (chineseCopyright != null) {
            $("#spanCopyright").html(chineseCopyright);
        }
    } else if (langIsTW()) {
        if (twMainTitle != null) {
            //document.title = twMainTitle;
            $('#spanTitle').text(twMainTitle);
            $('#spanTitle').attr('title', twMainTitle);
            SetCookie("maintitle", twMainTitle);
        }
        if (twCopyright != null) {
            $("#spanCopyright").html(twCopyright);
        }
    } else {
        if (englishMainTitle != null) {
            //document.title = englishMainTitle;
            $('#spanTitle').text(englishMainTitle);
            $('#spanTitle').attr('title', englishMainTitle);
            SetCookie("maintitle", englishMainTitle);
        }
        if (englishCopyright != null) {
            $("#spanCopyright").html(englishCopyright);
        }
    }
}

//判断是否已审核通过
function loadCompanyVerify() {
    if (myUserRole.getCompanyVerify() == 3) { //审核不通过
        alert('审核没有通过，查看失败原因！');
    } else if (myUserRole.getCompanyVerify() == 0) {//待提交
        alert('请尽快前往信息完善界面，完善企业信息！');
    }
}

//更新审核状态
function updateCompanyVerify(verify) {
    SetCookie("verify", verify);
}

//获取信息完善界面大小
function getPerfectPageSize(index) {
    var page = {};
    page.width = '975px';
    switch (index) {
        case 1:
        case 2:
            page.height = '600px';
            break;
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
            page.height = '425px';
            break;
        case 8:
            page.height = '600px';
            break;
        default:
            page.height = '600px';
            break;
    }
    return page;
}

//获取信息完善界面(完善公司信息)
function loadInfoPerfectPage() {
    //向服务器发送ajax请求
    $.myajax.jsonGet("whBaseAction_getInfoPerfectPage.action", function (json, action, success) {
        if (success) {
            if (json.url) {
                var page_ = getPerfectPageSize(json.index);
                //信息完善
                $('.login-mess .perfectInfo').on('click', function () {
                    $.dialog({
                        id: 'info', title: '信息完善', content: 'url:' + json.url + '&type=edit',
                        width: page_.width, height: page_.height, min: false, max: false, lock: true
                    });
                    $('.quick-menu').hide();
                });
            }
        }
    }, null);
}

//关闭完善界面
function doSaveCompanySuc() {
    parent.isChangedVehiGroup = true;
    $.dialog({ id: 'info' }).close();
    $.dialog.tips("保存成功！", 1);
}

//显示公告信息
function showBulletinMsg(index) {
    bulletin.showBulletinMsg(index);
}

//加载当前公司信息
var currentCompanyInfo = null;
function loadCurrentCompanyInfo() {
    //向服务器发送ajax请求
    $.myajax.jsonGet("WHCompanyAction_getCurrentWHCompanyInfo.action", function (json, action, success) {
        if (success) {
            currentCompanyInfo = json.company;

            myUserRole.setChemicalPrivileges(currentCompanyInfo.privilege);
        }
    }, null);
}

function disableForm() { }