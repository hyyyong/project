/**
 * 用户权限处理类
 */
function userRole(){
	this.isAdmin_ = false;  //是否管理员
	this.isMaster_ = false;  //是否是公司主账户
	this.isFirstCompany_ = false; //是否一级公司用户
	this.isSecondCompany_ = false; //是否二级公司用户
	this.isThreeCompany_ = false; //是否三级公司用户
	this.isAllowManage_ = false; //是否允许所有人管理车辆设备
	this.hasAddArea_ = false; //是否有添加行政区域
	this.hasLine_ = false; 
	this.hasRoadRule_ = false; //是否有添加道路规则
	this.isManageLine_ = false; //是否有管理线路和线路报表的权限
	this.isChemicals_ = false; //是否危化品监管平台
	this.isSanitationTruck_ = false; //是否环卫车系统
	this.isPolice_ = false; //是否有警员管理
	this.privileges = [];   //权限列表
	this.companyLevel_ = null; //公司级别
	this.companyVerify_ = null; //公司审核状态
	this.isXinTianDi_ = false; //新天地
	
	this.chemicalPrivilege = 0; //危化权限
	
	this.isChangePsw_ = true;//账号禁用修改密码
	this.isFangHao_ = false;
	this.baiDuWebAPIKey_ = null;
	this.googleWebAPIKey_ = null;
	this.gaoDeWebAPIKey_ = null;
	this.siWeiWebAPIKey_ = null;
	this.geocoderMapType_ = 0; //解析地理位置类型 0默认 1谷歌 2百度 3高德 4四维
	this.defaultGeocoderMapType_ = 0; //解析地理位置类型 0默认 1谷歌 2百度 3高德 4四维
}

//设置fanghao
userRole.prototype.setIsFangHao = function(fangHao) {
	if(typeof fangHao != 'undefined' && fangHao != null && fangHao == 1) {
		this.isFangHao_ = true;
	}
}


//赋值权限
userRole.prototype.setPrivileges = function(privilege) {
	if(typeof privilege != 'undefined' && privilege != null) {
		this.privileges = privilege.split(',');
	}
}

//赋值管理员
userRole.prototype.setIsAdmin = function(isAdmin) {
	if(typeof isAdmin != 'undefined' && isAdmin != null && isAdmin == 0) {
		this.isAdmin_ = true;
	}
}

//赋值管理员
userRole.prototype.setIsMaster = function(isMaster) {
	if(typeof isMaster != 'undefined' && isMaster != null && isMaster == 0) {
		this.isMaster_ = true;
	}
}

//赋值一级公司用户
userRole.prototype.setIsFirstCompany = function(isFirstCompany) {
	if(typeof isFirstCompany != 'undefined' && isFirstCompany != null && isFirstCompany == 0) {
		this.isFirstCompany_ = true;
	}
}

//赋值当前账号是否单点登录
userRole.prototype.setIsChangePsw = function(isChangePsw) {
	if(typeof isChangePsw != 'undefined' && isChangePsw != null && isChangePsw == 1) {
		this.isChangePsw_ = false;
	}
}


//赋值二级公司用户
userRole.prototype.setIsSecondCompany = function(isSecondCompany) {
	if(typeof isSecondCompany != 'undefined' && isSecondCompany != null && isSecondCompany == 0) {
		this.isSecondCompany_ = true;
	}
}

//赋值三级公司用户
userRole.prototype.setIsThreeCompany = function(isThreeCompany) {
	if(typeof isThreeCompany != 'undefined' && isThreeCompany != null && isThreeCompany == 0) {
		this.isThreeCompany_ = true;
	}
}

//赋值是否有添加行政区域
userRole.prototype.setHasAddArea = function(hasAddArea) {
	if(typeof hasAddArea != 'undefined' && hasAddArea != null && hasAddArea == 0) {
		this.hasAddArea_ = true;
	}
}

userRole.prototype.setHasLine = function(hasLine) {
	if(typeof hasLine != 'undefined' && hasLine != null && hasLine == 0) {
		this.hasLine_ = true;
	}
}

//赋值是否有添加道路规则
userRole.prototype.setHasRoadRule = function(hasRoadRule) {
	if(typeof hasRoadRule != 'undefined' && hasRoadRule != null && hasRoadRule == 0) {
		this.hasRoadRule_ = true;
	}
}

//赋值是否允许所有人管理车辆设备
userRole.prototype.setIsAllowManage = function(isAllowManage) {
	if(typeof isAllowManage != 'undefined' && isAllowManage != null && isAllowManage == 1) {
		this.isAllowManage_ = true;
	}
}

//赋值是否有管理线路和线路报表的权限
userRole.prototype.setIsManageLine = function(isManageLine) {
	if(typeof isManageLine != 'undefined' && isManageLine != null && isManageLine == 1) {
		this.isManageLine_ = true;
	}
}

//赋值是否危化品监管平台
userRole.prototype.setIsChemicals = function(isChemicals) {
	if(typeof isChemicals != 'undefined' && isChemicals != null && isChemicals == 1) {
		this.isChemicals_ = true;
	}
}

//赋值是否环卫车平台
userRole.prototype.setIsSanitationTruck = function(isSanitationTruck) {
	if(typeof isSanitationTruck != 'undefined' && isSanitationTruck != null 
			&& isSanitationTruck == 1) {
		this.isSanitationTruck_ = true;
	}
}

//赋值是否有警员管理
userRole.prototype.setIsPolice = function(isPolice_) {
	if(typeof isPolice_ != 'undefined' && isPolice_ != null 
			&& isPolice_ == 1) {
		this.isPolice_ = true;
	}
}

//赋值是否有新天地
userRole.prototype.setIsXinTianDi = function(isXinTianDi_) {
	if(typeof isXinTianDi_ != 'undefined' && isXinTianDi_ != null 
			&& isXinTianDi_ == 1) {
		this.isXinTianDi_ = true;
	}
}

//赋值公司级别
userRole.prototype.setCompanyLevel = function(companyLevel) {
	this.companyLevel_ = companyLevel;
}

//赋值公司审核状态
userRole.prototype.setCompanyVerify = function(companyVerify) {
	this.companyVerify_ = companyVerify;
}

//设置百度地图api key
userRole.prototype.setBaiDuWebAPIKey = function(baiDuWebAPIKey) {
	this.baiDuWebAPIKey_ = baiDuWebAPIKey;
}

//设置谷歌地图api key
userRole.prototype.setGoogleWebAPIKey = function(googleWebAPIKey) {
	this.googleWebAPIKey_ = googleWebAPIKey;
}

//设置高德地图api key
userRole.prototype.setGaoDeWebAPIKey = function(gaoDeWebAPIKey) {
	this.gaoDeWebAPIKey_ = gaoDeWebAPIKey;
}

//设置四维地图api key
userRole.prototype.setSiWeiWebAPIKey = function(siWeiWebAPIKey) {
	this.siWeiWebAPIKey_ = siWeiWebAPIKey;
}

//设置解析地理位置类型
userRole.prototype.setGeocoderMapType = function(geocoderMapType) {
	this.geocoderMapType_ = geocoderMapType;
}

//设置默认解析地理位置类型
userRole.prototype.setDefaultGeocoderMapType = function(defaultGeocoderMapType) {
	this.defaultGeocoderMapType_ = defaultGeocoderMapType;
}

//赋值危化权限
userRole.prototype.setChemicalPrivileges = function(privilege) {
	if(typeof privilege != 'undefined' && privilege != null) {
		this.chemicalPrivilege = privilege;
	}
}

//是否管理员
userRole.prototype.isAdmin = function() {
	return this.isAdmin_;
}

//是否公司主账户
userRole.prototype.isMaster = function() {
	return this.isMaster_;
}

//是否一级公司用户
userRole.prototype.isFirstCompany = function() {
	return this.isFirstCompany_;
}

//当前登录账号是否单点登录
userRole.prototype.isChangePsw = function() {
	return this.isChangePsw_;
}


//是否二级公司用户
userRole.prototype.isSecondCompany = function() {
	return this.isSecondCompany_;
}

//是否三级公司用户
userRole.prototype.isThreeCompany = function() {
	return this.isThreeCompany_;
}

//是否有添加行政区域
userRole.prototype.hasAddArea = function() {
	return this.hasAddArea_;
}

userRole.prototype.hasLine = function() {
	return this.hasLine_;
}

//是否有添加道路规则
userRole.prototype.hasRoadRule = function() {
	return this.hasRoadRule_;
}

//是否允许所有人管理车辆设备
userRole.prototype.isAllowManage = function() {
	return this.isAllowManage_;
}

//是否有管理线路和线路报表的权限
userRole.prototype.isManageLine = function() {
	return this.isManageLine_;
}

//是否危化品监管平台
userRole.prototype.isChemicals = function() {
	return this.isChemicals_;
}

//是否环卫车平台
userRole.prototype.isSanitationTruck = function() {
	return this.isSanitationTruck_;
}

//是否新天地
userRole.prototype.isXinTianDi = function() {
	return this.isXinTianDi_;
}

//是否物流公司
userRole.prototype.isLogisticCompany = function() {
	if(!this.isAdmin_ && this.companyLevel_ && this.companyLevel_ == 1) {
		return true;
	}
	return false;
}

//是否生产仓储公司
userRole.prototype.isProduceCompany = function() {
	if(this.companyLevel_ && this.companyLevel_ == 5) {
		return true;
	}
	return false;
}

//是否交通部门
userRole.prototype.isTrafficCompany = function() {
	if(this.companyLevel_ && this.companyLevel_ == 6) {
		return true;
	}
	return false;
}

//是否交警部门
userRole.prototype.isTrafficPoliceCompany = function() {
	if(this.companyLevel_ && this.companyLevel_ == 7) {
		return true;
	}
	return false;
}

//是否安监部门
userRole.prototype.isSafetyCompany = function() {
	if(this.companyLevel_ && this.companyLevel_ == 8) {
		return true;
	}
	return false;
}

//是否环保部门
userRole.prototype.isEnvironmentallyCompany = function() {
	if(this.companyLevel_ && this.companyLevel_ == 9) {
		return true;
	}
	return false;
}

//是否应急救援中心
userRole.prototype.isRescueCompany = function() {
	if(this.companyLevel_ && this.companyLevel_ == 10) {
		return true;
	}
	return false;
}

//是否公安部门
userRole.prototype.isPublicPoliceCompany = function() {
	if(this.companyLevel_ && this.companyLevel_ == 13) {
		return true;
	}
	return false;
}

//公司是否已审核
userRole.prototype.getCompanyVerify = function() {
	return this.companyVerify_;
}

//是否存在警员管理
userRole.prototype.isPolice = function() {
	return this.isPolice_;
}

//获取百度地图api key
userRole.prototype.getBaiDuWebAPIKey = function() {
	return this.baiDuWebAPIKey;
}

//获取谷歌地图api key
userRole.prototype.getGoogleWebAPIKey = function() {
	return this.googleWebAPIKey;
}

//获取高德地图api key
userRole.prototype.getGaoDeWebAPIKey = function() {
	return this.gaoDeWebAPIKey;
}

//获取四维地图api key
userRole.prototype.getSiWeiWebAPIKey = function() {
	return this.siWeiWebAPIKey;
}

//获取解析地理位置类型
userRole.prototype.getGeocoderMapType = function() {
	return this.geocoderMapType_;
}

//获取默认解析地理位置类型
userRole.prototype.getDefaultGeocoderMapType = function() {
	return this.defaultGeocoderMapType_;
}

//用户是否有规则的权限（电子围栏）
userRole.prototype.isMapFenceManageSupport = function() {
	return this.isPermit(5);
}

//用户是否有轨迹回放
userRole.prototype.isTrackPlaybackSupport = function() {
	return this.isPermit(6);
}

//用户是否有公司信息的权限
userRole.prototype.isCompanyManageSupport = function() {
	return this.isPermit(31);
}

//用户是否有角色管理的权限
userRole.prototype.isRoleManageSupport = function() {
	return this.isPermit(32) || this.isPermit(133);
}

//用户是否有用户信息的权限
userRole.prototype.isUserManageSupport = function() {
	return this.isPermit(33);
}

//用户是否有IC卡管理的权限
userRole.prototype.isICCardManageSupport = function() {
	return this.isPermit(313);
}

//用户是否有操作视频的权限
userRole.prototype.isVideoSupport = function() {
	return this.isPermit(621);
}

//用户是否有操作对讲的权限
userRole.prototype.isTalkbackSupport = function() {
	return this.isPermit(623);
}

//用户是否有操作监听的权限
userRole.prototype.isMonitorSupport = function() {
	return this.isPermit(624);
}

//用户是否有操作抓拍的权限
userRole.prototype.isCaptureSupport = function() {
	return this.isPermit(625);
}

//用户是否有操作下发文字信息的权限
userRole.prototype.isTTSSupport = function() {
	return this.isPermit(656);
}

//用户是否有操作设备信息查看的权限
userRole.prototype.isDevInfoSupport = function() {
	return this.isPermit(652);
}

//用户是否有操作参数配置的权限
userRole.prototype.isParamConfigSupport = function() {
	return this.isPermit(651);
}

//用户是否有操作电话回拨的权限  危化物流公司
userRole.prototype.isPhoneCallbackSupport = function() {
	return !this.isChemicals_ || (this.isChemicals_ &&  (this.isAdmin_ || this.isLogisticCompany()));
}

//用户是否有操作设备升级的权限
userRole.prototype.isDevUpgradeSupport = function() {
	return this.isPermit(653);
}

//用户是否有操作GPS上报间隔的权限
userRole.prototype.isGPSReportIntervalSupport = function() {
	
	return this.isPermit(656);
}

//用户是否有操作tpms 胎压监测的权限
userRole.prototype.isTpmsSupport = function() {
	return this.isPermit(656);
}

//用户是否有操作 WiFi配置诊断 的权限
userRole.prototype.isWifiApplication = function() {
	return this.isPermit(656);
}

//用户是否有操作WIFI下载任务设置的权限
userRole.prototype.isWifiConfigSupport = function() {
	return this.isPermit(656);
}

//用户是否有操作车辆控制的权限
userRole.prototype.isVehicleControlSupport = function() {
	return this.isPermit(656);
}

//用户是否有操作油量配置的权限
userRole.prototype.isOilConfigSupport = function() {
	return !this.isChemicals_ || (this.isChemicals_ &&  (this.isAdmin_ || this.isLogisticCompany()));
}

//用户是否有操作流量配置和统计的权限
userRole.prototype.is3GConfigSupport = function() {
	return this.isPermit(654);
}

//用户是否有操作划区域操作的权限
userRole.prototype.isDrawAreaSupport = function() {
	return !this.isChemicals_ || (this.isChemicals_ && (this.isAdmin_ || this.isLogisticCompany()));
}

//用户是否有操作运单信息的权限
userRole.prototype.isFindWaybillSupport = function() {
	return this.isChemicals_ 
		&& (this.isLogisticCompany() || this.isAdmin_ 
				|| this.isProduceCompany() || this.isChemicalPermit(0))
}

//用户是否有操作报警联动的权限
userRole.prototype.isAlarmLinkageSupport = function() {
	return this.isPermit(661);
}

//用户是否有操作报警屏蔽的权限
userRole.prototype.isAlarmMaskSupport = function() {
	return this.isPermit(662);
}

//用户是否有操作录像的权限
userRole.prototype.isRecordingSupport = function() {
	return this.isPermit(627);
}

//用户是否有操作移动侦测的权限
userRole.prototype.isMotionSupport = function() {
	return this.isPermit(655);
}

//用户是否有操作警员管理的权限
userRole.prototype.isPeopleSupport = function() {
	return this.isPermit(13);
}

//是否有权限
userRole.prototype.isPermit = function(role) {
	var s = String.fromCharCode(2);
	var reg = new RegExp(s+role+s);
	return (reg.test(s+this.privileges.join(s)+s));
}

//是否有权限
userRole.prototype.isChemicalPermit = function(role) {
	return (this.chemicalPrivilege>>role)&1 > 0;
}