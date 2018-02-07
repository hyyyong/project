/**
 * 用户的样式
 */
function pageStyle() {
	this.styleId = 1; //默认为样式1
	this.styleObj = null; //默认样式
	this.screenWidth = 0; //电脑分辨率
	this.allStyles = new Array();  //所有的加载样式
	this.isInitFinished = false;  //是否加载完全
	this.init();
}

//获取加载样式Id
pageStyle.prototype.getStyle = function() {
	return this.styleId;
}

//获取加载样式
pageStyle.prototype.loadStyleObj = function() {
	if(this.allStyles && this.styleId) {
		for (var i = 0; i < this.allStyles.length; i++) {
			if(this.allStyles[i].id == this.styleId) {
				this.styleObj = this.allStyles[i];
			}
		}
		if(!this.styleObj) {
			this.styleObj = this.allStyles[0];
		}
	}
}

//初始化
pageStyle.prototype.init = function() {
	this.loadAllStyles();
	this.screenWidth = window.screen.availWidth;
	if(this.screenWidth < 1024) {
		this.screenWidth = 1024;
	}
}

//加载华宝的界面
pageStyle.prototype.loadHBStyle = function() {
	$('#weatherForecast').css("top","-3px");
	$('#coverWeather').css("top","-3px");
	var style_hb = {};
	style_hb.id = 'hb';
	style_hb.name = "style-hb";
	style_hb.title = lang.style_sky_blue;
	style_hb.logoUrl = "./images/hb/logo.png";
	style_hb.url = "css/hb/login.css";
	style_hb.indexUrl = "css/hb/index.css";
	style_hb.operateManageUrl ="css/hb/OperationManagement.css";
	style_hb.ruleManageUrl = "css/hb/RulesManagement.css";
	style_hb.ruleMaintainHtmlUrl = "RuleMaintain_hb";
	style_hb.serverManageUrl = "css/hb/ServerManagement.css";
	style_hb.reportManageUrl = "../StatisticalReports/css/hb/StatisticalReports.css";
	style_hb.schoolReportUrl = "../StatisticalReports/css/StatisticalReports.css";
	style_hb.trackManageUrl = "css/hb/Track.css";
	style_hb.videoManageUrl = "css/hb/VideoReplay.css";
	style_hb.ttxMapUrl = "css/hb/ttxMap.css";
	style_hb.pluginReportManageUrl = "../../StatisticalReports/css/StatisticalReports.css";
	this.allStyles.push(style_hb);
}

//加载公交的页面
pageStyle.prototype.loadLineStyle = function() {
	var style_ = {};
	style_.id = 'gj';
	style_.name = "style-gj";
	style_.title = lang.style_sky_blue;
	style_.logoUrl = "./images/login_bs/logo.png";
	style_.url = "css/login_bs.css";
	style_.indexUrl = "css/index1.css";
	style_.operateManageUrl ="css/OperationManagement.css";
	style_.ruleManageUrl = "css/RulesManagement.css";
	style_.ruleMaintainHtmlUrl = "RuleMaintain";
	style_.serverManageUrl = "css/ServerManagement.css";
	style_.reportManageUrl = "../StatisticalReports/css/StatisticalReports.css";
	style_.schoolReportUrl = "../StatisticalReports/css/StatisticalReports.css";
	style_.trackManageUrl = "css/Track.css";
	style_.videoManageUrl = "css/VideoReplay.css";
	style_.ttxMapUrl = "css/ttxMap.css";
	this.allStyles.push(style_);
}

//加载校车的页面
pageStyle.prototype.loadXCStyle = function() {
	var style_xc = {};
	style_xc.id = 'xc';
	style_xc.name = "style-xc";
	style_xc.title = lang.style_sky_blue;
	style_xc.logoUrl = "./images/schoolbus/logo.png";
	style_xc.url = "css/login_xc.css";
	style_xc.indexUrl = "css/index1.css";
	style_xc.operateManageUrl ="OperationManagement.css";
	style_xc.ruleManageUrl = "css/RulesManagement.css";
	style_xc.ruleMaintainHtmlUrl = "RuleMaintain";
	style_xc.serverManageUrl = "css/ServerManagement.css";
	style_xc.reportManageUrl = "../StatisticalReports/css/StatisticalReports.css";
	style_xc.schoolReportUrl = "../StatisticalReports/css/StatisticalReports.css";
	style_xc.taxitUrl = "../TaxiManagement/css/TaxiManagement.css";
	style_xc.trackManageUrl = "css/Track.css";
	style_xc.videoManageUrl = "css/VideoReplay.css";
	style_xc.ttxMapUrl = "css/ttxMap.css";
	this.allStyles.push(style_xc);
}

//加载默认界面
pageStyle.prototype.loadDefaultStyle = function() {
	var style_1 = {};
	style_1.id = 1;
	style_1.name = "style-1";
	style_1.title = lang.style_sky_blue;
	style_1.logoUrl = "../../Images/Main/logo.png";
	style_1.url = "css/login1.css";
	style_1.indexUrl = "../../../Content/CSS/index1.css";
	style_1.operateManageUrl ="OperationManagement.css";
	style_1.ruleManageUrl = "css/RulesManagement.css";
	style_1.ruleMaintainHtmlUrl = "RuleMaintain";
	style_1.serverManageUrl = "css/ServerManagement.css";
	style_1.reportManageUrl = "../StatisticalReports/css/StatisticalReports.css";
	style_1.schoolReportUrl = "../StatisticalReports/css/StatisticalReports.css";
	style_1.taxitUrl = "../TaxiManagement/css/TaxiManagement.css";
	style_1.trackManageUrl = "css/Track.css";
	style_1.videoManageUrl = "css/VideoReplay.css";
	style_1.ttxMapUrl = "css/ttxMap.css";
	style_1.commonOperateManageUrl = "../OperationManagement/css/OperationManagement.css";
	style_1.commonReportUrl = "../StatisticalReports/css/StatisticalReports.css";
	style_1.pluginReportManageUrl = "../../StatisticalReports/css/StatisticalReports.css";
	this.allStyles.push(style_1);
	var style_2 = {};
	style_2.id = 2;
	style_2.name = "style-2";
	style_2.title = lang.style_black_night;
	style_2.logoUrl = "./images/home/logo.png";
	style_2.url = "css/login2.css";
	style_2.indexUrl = "css/index2.css";
	style_2.operateManageUrl ="css/OperationManagement.css";
	style_2.ruleManageUrl = "css/RulesManagement.css";
	style_2.ruleMaintainHtmlUrl = "RuleMaintain";
	style_2.serverManageUrl = "css/ServerManagement.css";
	style_2.reportManageUrl = "../StatisticalReports/css/StatisticalReports.css";
	style_2.schoolReportUrl = "../StatisticalReports/css/StatisticalReports.css";
	style_2.taxitUrl = "../TaxiManagement/css/TaxiManagement.css";
	style_2.trackManageUrl = "css/Track.css";
	style_2.videoManageUrl = "css/VideoReplay.css";
	style_2.ttxMapUrl = "css/ttxMap.css";
	style_2.commonOperateManageUrl = "../OperationManagement/css/OperationManagement.css";
	style_2.commonReportUrl = "../StatisticalReports/css/StatisticalReports.css";
	style_2.pluginReportManageUrl = "../../StatisticalReports/css/StatisticalReports.css";
	this.allStyles.push(style_2);
	var style_3 = {};
	style_3.id = 3;
	style_3.name = "style-3";
	style_3.title = lang.style_grass_green;
	style_3.logoUrl = "./images/home/logo.png";
	style_3.url = "css/login3.css";
	style_3.indexUrl = "css/index3.css";
	style_3.operateManageUrl ="css/OperationManagement.css";
	style_3.ruleManageUrl = "css/RulesManagement.css";
	style_3.ruleMaintainHtmlUrl = "RuleMaintain";
	style_3.serverManageUrl = "css/ServerManagement.css";
	style_3.reportManageUrl = "../StatisticalReports/css/StatisticalReports.css";
	style_3.schoolReportUrl = "../StatisticalReports/css/StatisticalReports.css";
	style_3.taxitUrl = "../TaxiManagement/css/TaxiManagement.css";
	style_3.trackManageUrl = "css/Track.css";
	style_3.videoManageUrl = "css/VideoReplay.css";
	style_3.ttxMapUrl = "css/ttxMap.css";
	style_3.commonOperateManageUrl = "../OperationManagement/css/OperationManagement.css";
	style_3.commonReportUrl = "../StatisticalReports/css/StatisticalReports.css";
	style_3.pluginReportManageUrl = "../../StatisticalReports/css/StatisticalReports.css";
	this.allStyles.push(style_3);
}

//11.21 loadLoginPolice
//加载警员界面
pageStyle.prototype.loadLoginPolice = function() {
	var style_1 = {};
	style_1.id = "jy";
	style_1.name = "style-1";
	style_1.title = lang.style_sky_blue;
	style_1.logoUrl = "./images/home/logo.png";
	style_1.url = "css/police.css";
	style_1.indexUrl = "css/index1.css";
	style_1.operateManageUrl ="css/OperationManagement.css";
	style_1.ruleManageUrl = "css/RulesManagement.css";
	style_1.ruleMaintainHtmlUrl = "RuleMaintain";
	style_1.serverManageUrl = "css/ServerManagement.css";
	style_1.reportManageUrl = "../StatisticalReports/css/StatisticalReports.css";
	style_1.schoolReportUrl = "../StatisticalReports/css/StatisticalReports.css";
	style_1.taxitUrl = "../TaxiManagement/css/TaxiManagement.css";
	style_1.trackManageUrl = "css/Track.css";
	style_1.videoManageUrl = "css/VideoReplay.css";
	style_1.ttxMapUrl = "css/ttxMap.css";
	style_1.commonOperateManageUrl = "../OperationManagement/css/OperationManagement.css";
	style_1.commonReportUrl = "../StatisticalReports/css/StatisticalReports.css";
	style_1.pluginReportManageUrl = "../../StatisticalReports/css/StatisticalReports.css";
	this.allStyles.push(style_1);
	function addCurrent (index){
		$('.download-content li').eq(index).addClass('current').siblings().removeClass('current');
	}
	addCurrent(2);
	$('.download-content li').hover(function(){
		var index = $(this).index();
		addCurrent(index);
	})
}

//加载所有的样式
pageStyle.prototype.loadAllStyles = function() {
	//加载华宝的界面
//	 this.loadHBStyle();
	// 加载公交的页面
//	  this.loadLineStyle();
	// 加载校车页面
//	 this.loadXCStyle();
	//加载默认界面
	 this.loadDefaultStyle();
	//11.21新交警界面
//	this.loadLoginPolice();
}

//所选样式是否在样式集合中
pageStyle.prototype.styleInStyles = function(style_) {
	if(this.allStyles && style_) {
		for (var i = 0; i < this.allStyles.length; i++) {
			if(this.allStyles[i].id == style_) {
				return true;
			}
		}
	}
	return false;
}

/**
 * 加载用户登录界面样式
 * @defaultStyle 默认样式  1，2，3
 */
pageStyle.prototype.initLoginUserStyle = function(defaultStyle) {
	//获取cookie中样式
	this.styleId = GetCookie("style");
	if(!this.styleId || !this.allStyles) {
		this.styleId = defaultStyle;
	}else {
		if(this.allStyles) {
			if(!this.styleInStyles(this.styleId)) {
				if(!this.styleInStyles(defaultStyle)) {
					this.styleId = this.allStyles[0].id;
				}else {
					this.styleId = defaultStyle;
				}
			}
		}
	}
	//如果要加载的样式不在默认样式集合中，则取默认样式第一个
	if(!this.styleInStyles(this.styleId)) {
		this.styleId = this.allStyles[0].id;
	}
	
	if(this.allStyles && this.allStyles.length > 1) {
		//初始化样式选择
		this.initLoginSwitchStyle();
	}else {
		$('.wy-mod-style').hide();
	}
	
	//加载样式
	this.loadStyleObj();
	var that = this;
	this.loadHeadCss(this.styleObj.url, function() {
		that.isInitFinished = true;
		that.loadUserLoginStyle();
	});
}

//加载用户登录界面样式
pageStyle.prototype.loadUserLoginStyle = function() {
	$(".wy-mod-style .switch-span").text(this.styleObj.title);
	if(this.styleId == 2 || this.styleId == 3) {
		$('#_banners .banner2').show();
		if(this.styleId == 3) {
			$("#clientDownload").show();
		}
	}else {
		$('#_focus').show();
		$('.wy-mod-nav-main').show();
		$('#_banners .banner1').show();
		if(this.allStyles && this.allStyles.length > 1) {
			$('.wy-mod-nav').css('width', '1024px');
		}
		$("#clientDownload").show();
		$('.switch-style .'+this.styleObj.name).addClass('current');
	}
	SetCookie("style", this.styleObj.id);
}

/**
 * 初始化样式选择
 */
pageStyle.prototype.initLoginSwitchStyle = function() {
	var mod = [];
	for (var i = 0; i < this.allStyles.length; i++) {
		mod.push({
			display: this.allStyles[i].title,
			title: this.allStyles[i].title,
			name: this.allStyles[i].name,
			pclass: 'clearfix'
//			preicon : true
		});
	}
	
	$('.switch-style').flexPanel({
		TabsModel : mod
	});
	
	var that = this;
	$('.switch-style li').on('click',function(){
		$(this).addClass('current').siblings().removeClass("current");
		$('.switch-style ul').removeClass('show');
		$('.wy-mod-style .carat').removeClass('show');
		SetCookie("style", $(this).attr('data-tab').split('-')[1]);
		document.location.reload();
	});
	
	$('body').click(function(event) {
		var obj = event.srcElement ? event.srcElement : event.target;
		if(obj != $('.wy-mod-style .switch-span')[0] && obj != $('.wy-mod-style .carat')[0]) {
			$('.switch-style ul').removeClass('show');
			$('.wy-mod-style .carat').removeClass('show');
		}
	});
	
	$('.wy-mod-style .switch-div').on('click',function() {
		if($('.carat', this).hasClass('show')) {
			$('.switch-style ul').removeClass('show');
			$('.carat', this).removeClass('show');
		}else {
			$('.switch-style ul').addClass('show');
			$('.carat', this).addClass('show');
		}
		var that = this;
		$('.switch-style ul').mouseleave(function(){
			$(this).removeClass('show');
			$('.carat', that).removeClass('show');
		});
	});
}

/**
 * 获取页面css路径
 * @returns
 */
pageStyle.prototype.getCommonPageUrl = function(pageMark) {
	if(pageMark == "index") {
		return this.styleObj.indexUrl;
	}else if(pageMark == "OperationManagement") {//运营管理
		return this.styleObj.operateManageUrl;
	}else if(pageMark == "SchoolReportManagement"){//校车报表
		return this.styleObj.schoolReportUrl;
	}else if(pageMark == "SchoolBusManagement") {//校车管理
		return this.styleObj.operateManageUrl;
	}else if(pageMark == "LaJiCheManagement") {//渣土车管理
		return this.styleObj.operateManageUrl;
	}else if(pageMark == "ServerManagement") {//服务器管理
		return this.styleObj.serverManageUrl;
	}else if(pageMark == "RulesManagement") {//规则管理
		return this.styleObj.ruleManageUrl;
	}else if(pageMark == "RuleMaintain") {//规则维护
		return this.styleObj.ruleMaintainHtmlUrl;
	}else if(pageMark == "StatisticalReports") {//报表管理
		return this.styleObj.reportManageUrl;
	}else if(pageMark == "TrackManagement") {//轨迹回放
		return this.styleObj.trackManageUrl;
	}else if(pageMark == "VideoManagement") {//录像回放
		return this.styleObj.videoManageUrl;
	}else if(pageMark == "logo") {//Logo图片
		return this.styleObj.logoUrl; 
	}else if(pageMark == "ttxMap") {//ttxMap css
		return this.styleObj.ttxMapUrl;
	}else if(pageMark == "TaxiManagement") {//出租车
		return this.styleObj.taxitUrl;
	}else if(pageMark == "whManagement") { //危化管理
		return this.styleObj.commonOperateManageUrl;
	}else if(pageMark == "whReports") { //危化报表
		return this.styleObj.commonReportUrl;
	}else if(pageMark == "pluginStatisticalReports") {//插件报表
		return this.styleObj.pluginReportManageUrl;
	} else {
		return this.styleObj.reportManageUrl;
	}
}

/**
 * 加载界面样式
 * @param page
 */
pageStyle.prototype.initCommonStyle = function(pageMark, callback, document_, doc_) {
	//页面标识
	if(pageMark) {
		//获取cookie中样式
		this.styleId = GetCookie("style");
		//如果要加载的样式不在默认样式集合中，则取默认样式第一个
		if(!this.styleInStyles(this.styleId)) {
			this.styleId = this.allStyles[0].id;
		}
		//加载样式
		this.loadStyleObj();
		
		var that = this;
		this.loadHeadCss(this.getCommonPageUrl(pageMark), function() {
			that.isInitFinished = true;
			if (callback != null) {
				callback();
			}
		}, document_, doc_);
	}
}

//修改主界面菜单样式
pageStyle.prototype.setIndexItemWidth = function() {
	if(this.styleId == 3) {
		this.setGreedIndexItemWidth();
	}else {
		this.setComnmonIndexItemWidth();
		if(this.styleId == 2) {
			this.setBlockIndexItemWidth();
		}else {
			this.setBlueIndexItemWidth();
		}
	}
}

//主页面菜单共同样式
pageStyle.prototype.setComnmonIndexItemWidth = function() {
	if(this.screenWidth < 1440 && this.screenWidth > 1280) {
		$('#main-topPanel .logo').css('max-width', '325px');
		$('#main-topPanel #spanTitle').css('font-size', '17px');
		$('#rightTabs').css('margin-left','30px');
	}else if(this.screenWidth <= 1280 && this.screenWidth > 1024) {
		$('#main-topPanel .logo').css('max-width', '275px');
		$('#main-topPanel #spanTitle').css('font-size', '15px');
		$('#rightTabs').css('margin-left','20px');
	}else if(this.screenWidth == 1024) {
		$('#main-topPanel .logo').css('max-width', '240px');
		$('#main-topPanel #spanTitle').css('font-size', '12px');
		$('#rightTabs').css('margin-left','1px');
	}else {
		$('#main-topPanel .logo').css('max-width', '375px');
		$('#main-topPanel #spanTitle').css('font-size', '20px');
		$('#rightTabs').css('margin-left','40px');
	}
}

//修改蓝色主界面菜单样式
pageStyle.prototype.setBlueIndexItemWidth = function() {
	if(this.screenWidth < 1440 && this.screenWidth > 1280) {
		$('.header .nav-bar a').each(function() {
			$(this).css('padding','18px 18px');
		});
		$('#login-out').css('margin-right','20px');
	}else if(this.screenWidth <= 1280 && this.screenWidth > 1024) {
		$('.header .nav-bar a').each(function() {
			$(this).css('padding','18px 16px');
		});
		$('#login-out').css('margin-right','20px');
	}else if(this.screenWidth == 1024) {
		$('.header .nav-bar a').each(function() {
			$(this).css('padding','18px 10px');
		});
		$('#login-out').css('margin-right','20px');
	}else {
		$('.header .nav-bar a').each(function() {
			$(this).css('padding','18px 22px');
		});
		$('#login-out').css('margin-right','30px');
	}
}

//修改黑色主界面菜单样式
pageStyle.prototype.setBlockIndexItemWidth = function() {
	$('#weatherForecast').css({"right":"150px","top":"8px"});
	$('#coverWeather').css({"right":"150px","top":"8px"});
	if(this.screenWidth < 1440 && this.screenWidth > 1280) {
		$('.header .nav-bar a').each(function() {
			$(this).css('padding','0px 12px');
		});
	}else if(this.screenWidth <= 1280 && this.screenWidth > 1024) {
		$('.header .nav-bar a').each(function() {
			$(this).css('padding','0px 9px');
		});
	}else if(this.screenWidth == 1024) {
		$('.header .nav-bar a').each(function() {
			$(this).css('padding','0px 6px');
		});
	}else {
		$('.header .nav-bar a').each(function() {
			$(this).css('padding','0px 15px');
		});
	}
}

//修改绿色主界面菜单样式
pageStyle.prototype.setGreedIndexItemWidth = function() {
	$('#weatherForecast').hide();
	$('#coverWeather').hide();
	$('#blackWeather').css({"right":"80px","top":"20px"});
	$('#blackWeather').show();

	
}

//追加CSS文件到head标签内
pageStyle.prototype.loadHeadCss = function(url, callback, document_, doc_) {
	var link = document.createElement("link");
	link.setAttribute("type", "text/css");
	link.setAttribute("rel", "stylesheet");
	link.setAttribute("href", url);
	var heads = null;
	if(document_) {
		heads = document_.getElementsByTagName("head");
	}else {
		heads = document.getElementsByTagName("head");
	}
	if(heads.length)  
        heads[0].appendChild(link);
    else {
    	if(doc_) {
    		doc_.documentElement.appendChild(link);
    	}else {
    		doc.documentElement.appendChild(link);
    	}
    }
	//判断服务器 
	if(typeof link.onreadystatechange != 'undefined') {
		link.onreadystatechange = function () { 
			//IE下的判断，判断是否加载完成 
			if (link && (link.readyState == "loaded" || link.readyState == "complete")) { 
				link.onreadystatechange = null; 
				if (callback != null) {
					callback(); 
				}
			} 
		}; 
	}else if(typeof link.onload != 'undefined') {
		link.onload = function () { 
			link.onload = null;
			if (callback != null) {
				callback(); 
			}
		};
	}else {
		if (callback != null) {
			callback(); 
		}
	}
}