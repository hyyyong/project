/**
 * 车辆类
 */
function standardVehicle(vehiIdno){
	this.id = null;
	this.idno = vehiIdno;	//车辆id
	this.name = null;			//车辆名称
	this.parentId = null;      //上级公司或者车队或者线路id
	this.driverName = null; //司机名称
	this.driverNum = null; //司机工号
	this.driverTele = null; //司机联系方式
	this.devList = new Array();  //设备
	this.icon = 1;		//如果没有配置图标，则默认使用货车车辆图标
	this.abbr = null;  //车辆简称
	this.isDrowing = false;   //是否正在被画区域操作，画区域时不更新位置点
	
	this.channels = new Array();  //通道
	this.vehiType = null;
	this.vid = null; //车辆id
	
	this.privilege = null; //车辆权限  1视频 2轨迹 3录像回放 1,2,3
	this.timeEnd = null; //环卫车辆执行完成时间
	
	this.isPeople = false; //是否是人员设备
	this.realtimeTrack = false; //是否开启了位置实时跟踪
	
	//警员
	this.peopleName = null; //人员名称
	this.telePhone = null; //电话
	this.description = null; //描述
	
	//危化
	this.isInSystem = true; //系统车辆
}

//是否公交管理
standardVehicle.prototype.isManageLine = function(){
	if(parent.myUserRole && typeof parent.myUserRole.isManageLine == 'function' &&
			parent.myUserRole.isManageLine()) {
		return true;
	}
	return false;
};

//是否环卫管理
standardVehicle.prototype.isSanitationTruck = function(){
	if(parent.myUserRole && typeof parent.myUserRole.isSanitationTruck == 'function' &&
			parent.myUserRole.isSanitationTruck()) {
		return true;
	}
	return false;
};

//是否新天地，不显示司机
standardVehicle.prototype.isXinTianDi = function(){
	if(parent.myUserRole && typeof parent.myUserRole.isXinTianDi == 'function' &&
			parent.myUserRole.isXinTianDi()) {
		return true;
	}
	return false;
};

standardVehicle.prototype.setName = function(name){
	this.name = name;
};

standardVehicle.prototype.setDevList = function(devList){
	this.devList = devList;
};

standardVehicle.prototype.addDevList = function(dev){
	this.devList.push(dev);
};

standardVehicle.prototype.setIcon = function(icon){
	this.icon = icon;
};

standardVehicle.prototype.setVehicle = function(vehi){
	this.id = vehi.nm;
	if(vehi.vtp && vehi.vtp == 4) {
		this.isPeople = true; //是否是人员设备
		this.peopleName = vehi.abbr; //人员名称
		this.telePhone = vehi.phone; //电话
		this.description = vehi.desc; //描述
	}
	this.name = vehi.nm;
	this.parentId = vehi.pid;
	this.driverName = vehi.dn; 
	this.driverNum = vehi.djb;
	this.driverTele = vehi.dt;
	this.icon = vehi.ic == null ? 1 : vehi.ic;
	this.abbr = vehi.abbr;
	this.vehiType = vehi.vtp;
	this.vid = vehi.id;
	this.privilege = vehi.pvg;
	this.timeEnd = vehi.etm == null ? 0 : vehi.etm;
};

standardVehicle.prototype.setStatus = function(devIdno,status){
	if(this.devList != null) {
		for (var i = 0; i < this.devList.length; i++) {
			if(this.devList[i].getIdno() == devIdno) {
				this.devList[i].setStatus(status);
				break;
			}
		}
	}
};

//是否开启了位置实时跟踪
standardVehicle.prototype.setRealtimeTrack = function(realtimeTrack) {
	this.realtimeTrack = realtimeTrack;
}

//设置运行时上级公司或者车队或者线路名称
standardVehicle.prototype.setCurParentName = function(curParentName){
	this.curParentName = curParentName;
}

//设置运行时司机名称
standardVehicle.prototype.setCurDriverName = function(curDriverName){
	this.curDriverName = curDriverName;
}

//设置运行时司机名称
standardVehicle.prototype.setCurDriverNum = function(curDriverNum){
	this.curDriverNum = curDriverNum;
}

//设置运行时当前站点名称
standardVehicle.prototype.setCurStationName = function(curStationName){
	this.curStationName = curStationName;
}

//设置运行时下一站名称
standardVehicle.prototype.setNextStationName = function(nextStationName){
	this.nextStationName = nextStationName;
}

standardVehicle.prototype.getIdno = function() {
	return this.idno;
};

standardVehicle.prototype.getId = function() {
	return this.id;
};

standardVehicle.prototype.getVid = function() {
	return this.vid;
};

standardVehicle.prototype.getName = function(){
	return this.name;
};

standardVehicle.prototype.getParentId = function(){
	return this.parentId;
};

//获取车辆简称
standardVehicle.prototype.getAbbreviation = function(){
	return this.abbr;
};

//获取司机名称
standardVehicle.prototype.getDriverName = function(){
	return this.driverName;
};

//获取司机联系方式
standardVehicle.prototype.getDriverTele = function(){
	return this.driverTele;
};

//获取司机工号
standardVehicle.prototype.getDriverNum = function(){
	return this.driverNum;
};

standardVehicle.prototype.getIcon = function(){
	var iconIndex = this.icon;
	if (iconIndex == null || iconIndex <= 0 || (iconIndex > 8 && iconIndex < 10) || (iconIndex > 10 && iconIndex <= 13)) {
		if(iconIndex > 10) {
			iconIndex = iconIndex - 10;
		}else {
			iconIndex = 1;
		}
	}
	return iconIndex;
};

standardVehicle.prototype.setDrowing = function(isDrowing){
	this.isDrowing = isDrowing;
}

standardVehicle.prototype.getDevList = function(){
	return this.devList;
};

standardVehicle.prototype.getVehiType = function() {
	return this.vehiType;
}

standardVehicle.prototype.getVehiTypeStr = function() {
	if(this.vehiType) {
		if(this.vehiType == 2) {
			return "洒水车";
		}else if(this.vehiType == 3) {
			return '扫地车';
		}
	}
	return '清洗车';
}

//人员名称
standardVehicle.prototype.getPeopleName = function() {
	return this.peopleName;
}

//电话
standardVehicle.prototype.getTelePhone = function() {
	return this.telePhone;
}

//描述
standardVehicle.prototype.getDescription = function() {
	return this.description;
}

//是否是人员设备
standardVehicle.prototype.isPeopleTerminal = function() {
	return this.isPeople;
}

//是否是系统车辆
standardVehicle.prototype.setInSystem = function(isInSystem) {
	this.isInSystem = isInSystem;
}

//是否是系统车辆
standardVehicle.prototype.isInSystemVehicle = function() {
	return this.isInSystem;
}

//是否开启了位置实时跟踪
standardVehicle.prototype.isOpenRealtimeTrack = function() {
	return this.realtimeTrack;
}

//是否支持视频
standardVehicle.prototype.isSupportVideo = function() {
	return this.privilege != null && this.privilege.toString().indexOf("1") != -1;
}

//是否支持轨迹回放
standardVehicle.prototype.isSupportTrack = function() {
	return this.privilege != null && this.privilege.toString().indexOf("2") != -1;
}

//是否支持录像回放
standardVehicle.prototype.isSupportVideoReplay = function() {
	return this.privilege != null && this.privilege.toString().indexOf("3") != -1;
}

//每个车辆可能有1至多个设备
standardVehicle.prototype.getDevIdnos = function(){
	var idnos = [];
	for (var i = 0; i < this.devList.length; ++ i) {
		idnos.push(this.devList[i].getIdno());
	}
	return idnos;
};

//获取定位时间最新的设备
standardVehicle.prototype.getLastTimeDevice = function(){
	var dev = null;
	if(this.devList != null) {
		if(this.devList.length == 1) {
			dev = this.devList[0];
		}else {
			var gpsTime1 = this.devList[0].getGpsTime();
			var gpsTime2 = this.devList[1].getGpsTime();
			//如果两个时间都存在，则取最大的
			if (gpsTime1 != null && gpsTime2 != null) {
				if (gpsTime1 > gpsTime2) {
					dev = this.devList[0];
				} else {
					dev = this.devList[1];
				}
			//如果两个时间都不存在，则取定位设备的
			} else if (gpsTime1 == null && gpsTime2 == null)  {
				dev = this.getGpsDevice();
			//如果1个存在，1个不存在，则取存在的那个设备
			} else {
				if (gpsTime1 != null) {
					dev = this.devList[0];
				} else {
					dev = this.devList[1];
				}
			}
		}
	}
	return dev;
}

//获取GPS设备
standardVehicle.prototype.getGpsDevice = function(){
	if(this.devList != null && this.devList.length > 0) {
		//如果有两个设备，则其中有1个是gps设备，1个是视频设备
		if (this.devList.length == 1) {
			return this.devList[0];
		} else {
			for (var i = 0; i < this.devList.length; i++) {
				if(this.devList[i].isGpsDevice()) {
					return this.devList[i];
				}
			}
		}
	}
	return null;
}

//获取视频设备
standardVehicle.prototype.getVideoDevice = function(){
	if(this.devList != null && this.devList.length > 0) {
		for (var i = 0; i < this.devList.length; i++) {
			if(this.devList[i].isVideoDevice()) {
				return this.devList[i];
			}
		}
	}
	return null;
}

//获取带有油量配置的设备
standardVehicle.prototype.getOilDevice = function(){
	if(this.devList != null && this.devList.length > 0) {
		for (var i = 0; i < this.devList.length; i++) {
			if(this.devList[i].isOilSensorSupport()) {
				return this.devList[i];
			}
		}
	}
	return null;
}

//获取带有油路控制的设备
standardVehicle.prototype.getOilControlDevice = function(){
	if(this.devList != null && this.devList.length > 0) {
		for (var i = 0; i < this.devList.length; i++) {
			if(this.devList[i].isOilControlSupport()) {
				return this.devList[i];
			}
		}
	}
	return null;
}

//获取带有电路控制的设备
standardVehicle.prototype.getElecControlDevice = function(){
	if(this.devList != null && this.devList.length > 0) {
		for (var i = 0; i < this.devList.length; i++) {
			if(this.devList[i].isElecControlSupport()) {
				return this.devList[i];
			}
		}
	}
	return null;
}

//获取带有温度传感器的设备(传感器)
standardVehicle.prototype.getTemperatureDevice = function(){
	if(this.devList != null && this.devList.length > 0) {
		for (var i = 0; i < this.devList.length; i++) {
			if(this.devList[i].getTempCount() != null && this.devList[i].getTempCount() > 0) {
				return this.devList[i];
			}
		}
	}
	return null;
}

//获取对讲设备
standardVehicle.prototype.getTalkbackDevice = function(){
	if(this.devList != null && this.devList.length > 0) {
		for (var i = 0; i < this.devList.length; i++) {
			if(this.devList[i].isTalkbackSupport()) {
				return this.devList[i];
			}
		}
	}
	return null;
}

//车辆是否支持对讲设备
standardVehicle.prototype.isTalkbackSupport = function(){
	var dev = this.getTalkbackDevice();
	return dev != null ? true : false;
}

//获取监听设备
standardVehicle.prototype.getMonitorDevice = function(){
	if(this.devList != null && this.devList.length > 0) {
		for (var i = 0; i < this.devList.length; i++) {
			if(this.devList[i].isMonitorSupport()) {
				return this.devList[i];
			}
		}
	}
	return null;
}

//车辆是否支持对讲设备
standardVehicle.prototype.isMonitorSupport = function(){
	var dev = this.getMonitorDevice();
	return dev != null ? true : false;
}

//判断通道所在设备是否视频设备
standardVehicle.prototype.isChannelVideoDevice = function(chnIndex){
	if(this.channels != null && this.channels.length > 0 && chnIndex != null) {
		for (var i = 0; i < this.channels.length; i++) {
//			alert(this.channels[i].index +','+ chnIndex +','+ this.channels[i].devType);
			if(this.channels[i].index == chnIndex && this.channels[i].devType == 1) {
				return true;
			}
		}
	}
	return false;
}

//判断车辆是否有JT808协议
standardVehicle.prototype.isJT808Protocol = function(){
	if(this.devList != null && this.devList.length > 0) {
		for (var i = 0; i < this.devList.length; i++) {
			if(this.devList[i].isJT808Protocol()) {
				return true;
			}
		}
	}
	return false;
}

//判断车辆是否有WKP协议
standardVehicle.prototype.isWKPProtocol = function(){
	if(this.devList != null && this.devList.length > 0) {
		for (var i = 0; i < this.devList.length; i++) {
			if(this.devList[i].isWKPProtocol()) {
				return true;
			}
		}
	}
	return false;
}

//判断车辆是否有易甲文的协议
standardVehicle.prototype.isRMProtocol = function(){
	if(this.devList != null && this.devList.length > 0) {
		for (var i = 0; i < this.devList.length; i++) {
			if(this.devList[i].isRMProtocol()) {
				return true;
			}
		}
	}
	return false;
}

//获取车辆所有通道属性		20150612
standardVehicle.prototype.getVehicleChannel = function(){
	return this.channels;
}

//获取车辆所有通道属性		20150612
//车辆分两个类型的设备，1个是定位设备，1种是视频设备
//定位设备也可以外接摄像头，进行图片抓拍，但不可以看实时视频
//就是定位设备也可以有通道，只可以抓拍
//如果一个车辆有两个设备，那么通道就是视频设备的通道
standardVehicle.prototype.loadVehicleChannel = function(){
	var channels = [];
	if(this.devList != null && this.devList.length > 0) {
		if (this.devList.length == 1) {
			var dev = this.devList[0];
			if(dev.isVideoDevice()) {
				channels = this.getVehicleVideoChannel();
			}else {
				channels = this.getVehicleGPSChannel();
			}
		} else {
			var index = 0;
			for (var i = 0; i < this.devList.length; i++) {
				var dev = this.devList[i];
				var devType = 0;
				if(dev.isVideoDevice()) {
					devType = 1;
				}
				var chnName = dev.getChnName();
				if(chnName != null && chnName != '') {
					var chanNames = chnName.split(',');
					for(var j = 0; j < chanNames.length; j++) {
						var channel = {};
						channel.id = this.getIdno() + '-'+ chanNames[j];
						channel.index = index;
						channel.name = chanNames[j];
						channel.parentId = this.getIdno();
						channel.devType = devType;
						channels.push(channel);
						index++;
					}
				}
			}
		}
	}
	this.channels = channels;
}

//获取车辆视频通道属性		20150612
//车辆分两个类型的设备，1个是定位设备，1种是视频设备
//定位设备也可以外接摄像头，进行图片抓拍，但不可以看实时视频
//就是定位设备也可以有通道，只可以抓拍
//如果一个车辆有两个设备，那么通道就是视频设备的通道
standardVehicle.prototype.getVehicleVideoChannel = function(){
	var channels = [];
	var dev = this.getVideoDevice();
	if(dev != null) {
		var chnName = dev.getChnName();
		if(chnName != null && chnName != '') {
			var chanNames = chnName.split(',');
			for(var i = 0; i < chanNames.length; i++) {
				var channel = {};
				channel.id = this.getIdno() + '-'+ chanNames[i];
				channel.index = i;
				channel.name = chanNames[i];
				channel.parentId = this.getIdno();
				channel.devType = 1;
				channels.push(channel);
			}
		}
	}
	return channels;
}

//获取车辆GPS通道属性		20150728
//车辆分两个类型的设备，1个是定位设备，1种是视频设备
//定位设备也可以外接摄像头，进行图片抓拍，但不可以看实时视频
//就是定位设备也可以有通道，只可以抓拍
//如果一个车辆有两个设备，那么通道就是视频设备的通道
standardVehicle.prototype.getVehicleGPSChannel = function(){
	var channels = [];
	var dev = this.getGpsDevice();
	if(dev != null) {
		var chnName = dev.getChnName();
		if(chnName != null && chnName != '') {
			var chanNames = chnName.split(',');
			for(var i = 0; i < chanNames.length; i++) {
				var channel = {};
				channel.id = this.getIdno() + '-'+ chanNames[i];
				channel.index = i;
				channel.name = chanNames[i];
				channel.parentId = this.getIdno();
				channel.devType = 0;
				channels.push(channel);
			}
		}
	}
	return channels;
}

//获取定位有效的设备
standardVehicle.prototype.getValidDevice = function(){
	var gpsDev = this.getGpsDevice();
//	var videoDev = this.getVideoDevice();
//	if(!gpsDev.isOnline()) {
//		if(!videoDev.isOnline()) {
//			return gpsDev;
//		}
//		return videoDev;
//	}
	return gpsDev;
};

//获取车辆地图经纬度信息
standardVehicle.prototype.getMapLngLat = function(){
	var dev = this.getGpsDevice();		//只有一个定位设备，直接取定位设备的GPS
	return dev.getMapLngLat();
}

//获取最后一个有效车辆地图经纬度信息
standardVehicle.prototype.getLastMapLngLat = function(){
	var dev = this.getGpsDevice();		//只有一个定位设备，直接取定位设备的GPS
	return dev.getLastMapLngLat();
}

//获取经纬度信息字符串
standardVehicle.prototype.getLngLatStr = function(){
	var dev = this.getGpsDevice();
	return dev.getLngLatStr();  //只有一个定位设备，直接取定位设备的GPS
};

//获取最后一个有效经纬度信息字符串
standardVehicle.prototype.getLastLngLatStr = function(){
	var dev = this.getGpsDevice();
	return dev.getLastLngLatStr();  //只有一个定位设备，直接取定位设备的GPS
};

//获取最后一个有效经纬度信息
standardVehicle.prototype.getLastLngLat = function(){
	var dev = this.getGpsDevice();
	return dev.getLastLngLat();  //只有一个定位设备，直接取定位设备的GPS
};

//获取车辆位置信息
standardVehicle.prototype.getPosition = function(){
	var dev = this.getGpsDevice();
	return dev.getPosition();
}

//判断车辆是否在线
standardVehicle.prototype.isOnline = function(){
	if(this.devList != null && this.devList.length > 0) {
		for(var i = 0; i < this.devList.length; i++) {
			if(this.devList[i].isOnline()) {
				return true;
				break;
			}
		}
	}
	return false;
}

/*
 * 返回在线状态是否发生变化了，如果为true，则表示状态发生了变化
 */
standardVehicle.prototype.setOnline = function(devIdno, online) {
	var oldOnline = this.isOnline();
	if(this.devList != null) {
		for (var i = 0; i < this.devList.length; i++) {
			if(this.devList[i].getIdno() == devIdno) {
				this.devList[i].setOnline(online);
				if(this.devList[i].status != null) {
					this.devList[i].status.setOnline(online);
				}
				break;
			}
		}
	}
	if (oldOnline != this.isOnline()) {
		return true;
	} else {
		return false;
	}
};

//获取车辆在线或者下线
standardVehicle.prototype.getOnlineString = function(){
	if(this.isOnline()) {
		return parent.lang.online;
	}else {
		return parent.lang.offline;
	}
}

//获取存储介质报警
standardVehicle.prototype.getStorageAlarm = function(){
	if(this.devList != null && this.devList.length > 0) {
		var dev = this.getVideoDevice();
		if(dev != null) {
			return dev.getStorageAlarm();
		}
	}
	return '';
};

//判断车辆是否报警
standardVehicle.prototype.isAlarm = function() {
	if(this.devList != null && this.devList.length > 0) {
		var info = this.getStatusInfo();
		if(info.isAlarm) {
			return true;
		}
	}
	return false;
}

//判断车辆定位是否有效
standardVehicle.prototype.isLocationInvalid = function() {
	var dev = this.getValidDevice();
	if((dev.isValid() && dev.isGpsValid()) && !dev.isDeviceStop()) {
		return true;
	}
	return false;
}

/*
 * 判断车辆是否停车未熄火
 */
standardVehicle.prototype.isParking = function() {
	var dev = this.getValidDevice();
	if(dev.getStatus() && dev.getStatus().isParking()) {
		return true;
	}
	return false;
}

/*
 * 判断车辆是否停车熄火
 */
standardVehicle.prototype.isParked = function() {
	var dev = this.getValidDevice();
	if(dev.getStatus() && dev.getStatus().isParked()) {
		return true;
	}
	return false;
}

/*
 * 判断车辆停车
 */
standardVehicle.prototype.isParkStatus = function() {
	return this.isParking() || this.isParked();
}

//获取IO的状态
standardVehicle.prototype.getIOStatus = function(){
	var ret = {};
	ret.normal = '';
	ret.alarm = '';
	var normal = [];
	var alarm = [];
	if(this.devList != null && this.devList.length > 0) {
		if(this.devList.length == 1) {
			var ioStatus = this.devList[0].getIOStatus();
			if(ioStatus.normal != '') {
				normal.push(ioStatus.normal);
			}
			if(ioStatus.alarm != '') {
				alarm.push(ioStatus.alarm);
			}
			ret.normal = normal.toString();
			ret.alarm = alarm.toString();
			return ret;
		}else {
			var IOAlarmName = [];
			for(var i = 0; i < this.devList.length; i++) {
				var IOName_ = this.devList[i].getIOAlarmName();
				if(IOName_.normal != '') {
					normal.push(IOName_.normal);	
				}
				if(IOName_.alarm != '') {
					alarm.push(IOName_.alarm);	
				}
			}
			if(normal.length > 0) {
				ret.normal = parent.lang.alarm_type_io_high + '：' + normal.toString();
			}
			if(alarm.length > 0) {
				ret.alarm = parent.lang.alarm_type_io_high + '：' + alarm.toString();
			}
			return ret;
		}
	}
	return null;
}

//获取车辆状态信息
standardVehicle.prototype.getStatusInfo = function() {
	var ret = {};
	var gpsStatus = [];
	var gpsAlarm = [];
	var videoStatus = [];
	var videoAlarm = [];
	var videoLostStatus = [];
	var recordStatus = [];
	var obdStatus = [];
	var IOStatus = [];
	
	if(this.devList != null && this.devList.length > 0) {
		if(this.devList.length == 1) {
			if(this.devList[0].isVideoDevice()) {
				var videoStatus_ = this.devList[0].getVideoStatus();
				var videoLost = this.devList[0].getVideoLostStatus();
				var record = this.devList[0].getRecordStatus();
				if(videoStatus_.normal != '') {
					videoStatus.push(videoStatus_.normal);
				}
				if(videoStatus_.alarm != '') {
					videoAlarm.push(videoStatus_.alarm);
				}
				if(videoLost != '') {
					videoLostStatus.push(videoLost);
				}
				if(record != '') {
					recordStatus.push(record);
				}
			}
			var gpsStatus_ = this.devList[0].getGpsStatus();
			var oilStatus_ = this.devList[0].getOilStatus();
			var electricStatus_ = this.devList[0].getElectricStatus();
			var fuelAlarmStatus_ = this.devList[0].getFuelAlarmStatus();
			var obdStatus_ = this.devList[0].getObdStatus();
			
			if(gpsStatus_.normal != '') {
				gpsStatus.push(gpsStatus_.normal);
			}
			if(gpsStatus_.alarm != '') {
				gpsAlarm.push(gpsStatus_.alarm);
			}
			//油路
			if(oilStatus_ != '') {
				gpsStatus.push(oilStatus_);
			}
			//电路
			if(electricStatus_ != '') {
				gpsStatus.push(electricStatus_);
			}
			//油量
			if(fuelAlarmStatus_ != null) {
				if(fuelAlarmStatus_.normal != '') {
					gpsStatus.push(fuelAlarmStatus_.normal);
				}
				if(fuelAlarmStatus_.alarm != '') {
					gpsAlarm.push(fuelAlarmStatus_.alarm);
				}
			}
			if(obdStatus_ != ''){
				obdStatus.push(obdStatus_);
			}
		}else {
			for(var i = 0; i < this.devList.length; i++) {
			//	if(this.devList[i].isOnline()) {
					if(this.devList[i].isGpsDevice()) {
						var gpsStatus_ = this.devList[i].getGpsStatus();
						if(gpsStatus_.normal != '') {
							gpsStatus.push(gpsStatus_.normal);
						}
						if(gpsStatus_.alarm != '') {
							gpsAlarm.push(gpsStatus_.alarm);
						}
					}else if(this.devList[i].isVideoDevice()) {
						var videoStatus_ = this.devList[i].getVideoStatus();
						if(videoStatus_.normal != '') {
							videoStatus.push(videoStatus_.normal);
						}
						if(videoStatus_.alarm != '') {
							videoAlarm.push(videoStatus_.alarm);
						}
						var videoLost = this.devList[i].getVideoLostStatus();
						var record = this.devList[i].getRecordStatus();
						if(videoLost != '') {
							videoLostStatus.push(videoLost);
						}
						if(record != '') {
							videoLostStatus.push(record);
						}
					}
					var oilStatus_ = this.devList[i].getOilStatus();
					var electricStatus_ = this.devList[i].getElectricStatus();
					var fuelAlarmStatus_ = this.devList[i].getFuelAlarmStatus();
					var obdStatus_ = this.devList[i].getObdStatus();
					//油路
					if(oilStatus_ != '') {
						gpsStatus.push(oilStatus_);
					}
					//电路
					if(electricStatus_ != '') {
						gpsStatus.push(electricStatus_);
					}
					//油量
					if(fuelAlarmStatus_ != null) {
						if(fuelAlarmStatus_.normal != '') {
							gpsStatus.push(fuelAlarmStatus_.normal);
						}
						if(fuelAlarmStatus_.alarm != '') {
							gpsAlarm.push(fuelAlarmStatus_.alarm);
						}
					}
					if(obdStatus_ != ''){
						obdStatus.push(obdStatus_);
					}
			//	}
			}
		}
		var IOStatus_ = this.getIOStatus();
		if(IOStatus_ != null) {
			if(IOStatus_.normal != '') {
				IOStatus.push(IOStatus_.normal);
			}
			if(IOStatus_.alarm != '') {
				gpsAlarm.push(IOStatus_.alarm);
			}
		}
	}
	ret.gpsStatus = '(' + this.getOnlineString() +')' + gpsStatus.toString();
	ret.gpsAlarm = gpsAlarm.toString();
	ret.videoStatus = videoStatus.toString();
	ret.videoAlarm = videoAlarm.toString();
	ret.videoLostStatus = videoLostStatus.toString();
	ret.recordStatus = recordStatus.toString();
	ret.IOStatus = IOStatus.toString();
	ret.obdStatus = obdStatus.toString();
	
	if (ret.gpsAlarm != '' || ret.videoAlarm != '') {
		ret.isAlarm = true;
	} 
	return ret;
}

//获取司机信息
standardVehicle.prototype.getVehicleDriver =function() {
	var driver = "";
	if (this.driverName !== null) {
		driver = this.driverName;
	}
	if (this.driverTele !== null) {
		if (driver !== "") {
			driver = driver + "(" + this.driverTele + ")";
		} else {
			driver = this.driverTele;
		}
	}
	if (driver === "") {
		driver = " ";
	}
	return driver;
}

//获取运行时司机信息
standardVehicle.prototype.getCurVehicleDriver =function(driverId) {
	var driver = "";
	if(driverId && parent.vehicleManager) {
		var driver_ = parent.vehicleManager.getDriverInfo(driverId);
		if(driver_) {
			driver = driver_.getName();
			if (driver_.getContact() !== null) {
				if (driver !== "") {
					driver = driver + "(" + driver_.getContact() + ")";
				} else {
					driver = driver_.getContact();
				}
			}
		}
	}
	if(driver == "") {
		driver = this.getVehicleDriver();
	}
	return driver;
}

//取GPS时间
standardVehicle.prototype.getParseGpsTime = function() {
	//取GPS时间规则		 afu 150529
	//规则1：如果有两个设备，要最时间最新的那个GPS时间，可能有1个在线，1个不在线，如果取最大时间一般不会出错
	//规则2：如果两个都在线，则取 gps定位设备的gps时间，其中1个在线，则取在线的GPS时间 ，如果两个都不在线，则取时间最大的那个
	if(this.devList != null && this.devList.length > 0) {
		if(this.devList.length == 1) {
			return this.devList[0].getGpsTimeString();
		}else {
			if(this.devList[0].isOnline()) {
				if(this.devList[1].isOnline()) {
					return this.getGpsDevice().getGpsTimeString();
				}else {
					return this.devList[0].getGpsTimeString()
				}
			}else {
				if(this.devList[1].isOnline()) {
					return this.devList[1].getGpsTimeString();
				}else {
					return this.getLastTimeDevice().getGpsTimeString()
				}
			}
		}
	}
}

//获取上级公司信息
standardVehicle.prototype.getCompanyInfo = function(parentId) {
	if(parent.vehicleManager) {
		return parent.vehicleManager.getTeam(parentId);
	}
	return null;
}

//获取司机信息
standardVehicle.prototype.getDriverInfo = function(driverId) {
	if(parent.vehicleManager) {
		return parent.vehicleManager.getDriverInfo(driverId);
	}
	return null;
}

//获取线路信息
standardVehicle.prototype.getLineInfo = function(lineId) {
	if(parent.vehicleManager) {
		return parent.vehicleManager.getLineInfo(lineId);
	}
	return null;
}

//获取站点信息
standardVehicle.prototype.getStationInfo = function(lineId, lineDirect, stationIndex) {
	if(parent.vehicleManager) {
		return parent.vehicleManager.getStationInfoEx(lineId+'-'+lineDirect+'-'+ stationIndex);
	}
	return null;
}

//获取车辆作业状态（环卫）0未执行 1执行中 2完成
//车辆只要完成1次，就把状态置为已完成的颜色
standardVehicle.prototype.getSanitationWorkStatus = function() {
	this.workStatus = 0;
	this.workStatusColor = "818181";
	var line = this.getLineInfo(this.parentId);
	if(line) {//线路
		var total = line.getWorkTotal(this.vehiType);//获取线路需要完成次数
		//如果未配置作业次数，则默认完成
		if(total && total != 0) {
			var dev = this.getValidDevice();
			var workStatus = dev.getSanitationWorkStatus(); //作业状态 1作业中 0空闲
			var number = dev.getSanitationWorkNumber(); //已作业次数
			//车辆只要完成1次，就把状态置为已完成的颜色
			if((number == 1 && workStatus == 0) || number > 1) {
				this.workStatus = 2;
				this.workStatusColor = "00AC00";
			}else {
				if(workStatus == 0 && number == 0) {
					this.workStatus = 0;
					this.workStatusColor = "818181";
				}else {
					this.workStatus = 1;
					this.workStatusColor = "00ACFF";
				}
			}
		}else {
			this.workStatus = 2;
			this.workStatusColor = "00AC00";
		}
	}
	return this.workStatus;
}

//获取作业状态颜色
standardVehicle.prototype.getWorkStatusColor = function() {
	return this.workStatusColor;
}

//获取车辆作业状态（环卫）
standardVehicle.prototype.getSanitationWorkStatusStr = function() {
	var dev = this.getValidDevice();
	return dev.getSanitationWorkStatusStr();
}

//获取站点索引（环卫）
standardVehicle.prototype.getStationIndex = function() {
	var dev = this.getValidDevice();
	return dev.getStationIndex();
}

//解析实时车辆状态
//showType  显示规则 1表示 vehicleMap使用
standardVehicle.prototype.gpsParseRealStatus = function(showType) {
	//应该不需要传参进来了，vehi用this，dev通过getGpsDevice来获取	 afu 150529
	var dev = this.getValidDevice();
	var ret = {};
	
	
	//取GPS时间规则		 afu 150529
	//规则1：如果有两个设备，要最时间最新的那个GPS时间，可能有1个在线，1个不在线，如果取最大时间一般不会出错
	//规则2：如果两个都在线，则取 gps定位设备的gps时间，其中1个在线，则取在线的GPS时间 ，如果两个都不在线，则取时间最大的那个
	ret.gpsTime = this.getParseGpsTime();
	//取定位设备的位置
	//取最后一个有效位置
	var geocoderLngLat = this.getLastLngLat();
	if (geocoderLngLat != null) {
		ret.geocoderLng = geocoderLngLat.lng;
		ret.geocoderLat = geocoderLngLat.lat;
	}else {
		ret.geocoderLng = "";
		ret.geocoderLat = "";
	}
	ret.position = dev.getLastLngLatStr();
	var point = dev.getLastMapLngLat();
	if (point != null) {
		ret.mapJingDu = point.lng;
		ret.mapWeiDu = point.lat;
		if(ret.position == '0,0' || ret.position == '') {//定位无效
			ret.isGpsValid = false;
		}else {
			ret.isGpsValid = true;
		}
	} else {
		if(point != null && ret.position != '0,0' && ret.position != '') {
			ret.mapJingDu = point.lng;
			ret.mapWeiDu = point.lat;
		}else {
			ret.mapJingDu = "";
			ret.mapWeiDu = "";
		}
		ret.isGpsValid = false;
	}
	ret.huangXiang = dev.getDirection();
	//取定位设备的速度
	ret.speed = dev.getSpeedFangXiangString();
	ret.speedInt = dev.getSpeedNum();
//	console.log(dev.status.speed);

	//取定位设备的里程
	ret.liCheng = dev.getLiChengString();
	var html=[];
	//车牌号
//	html.push('<span class="b">' + parent.lang.monitor_labelVehicleIdno + '</span>' + this.getIdno() + '<br/>');
	//如果是人员设备
	if(this.isPeopleTerminal()) {
		//人员名称
		html.push('<span class="b">'+ parent.lang.track_labelName +'</span>'+ this.getPeopleName() +'<br/>');
		//电话
		html.push('<span class="b">'+ parent.lang.track_labelTelPhone +'</span>'+ this.getTelePhone() +'<br/>');
		//时间
		html.push('<span class="b">' + parent.lang.labelTime + '</span>' + ret.gpsTime +'<br/>');
		//位置	位置信息暂时不显示在上面(afu 150624)
		html.push('<span class="b">' + parent.lang.monitor_labelPosition + '</span>'+ ret.position +'<br/>');
		//html.push('<span class="b">' + parent.lang.monitor_labelPosition + '</span>&nbsp;<span class="maplngLat" onclick="changeMapAddress(this,'+ret.mapJingDu+','+ret.mapWeiDu+');" title="'+ ret.position +'">'+ ret.position +'</span><br/>');
	}else {
		//时间
		html.push('<span class="b">' + parent.lang.labelTime + '</span>&nbsp;' + ret.gpsTime);
		//速度
		html.push('&nbsp;&nbsp;&nbsp;&nbsp;<span class="b">' + parent.lang.labelSpeed + '</span>&nbsp;' + ret.speed + '<br/>');
		//位置	位置信息暂时不显示在上面(afu 150624)
//		html.push('<span class="b">' + parent.lang.monitor_labelPosition + '</span>&nbsp;<span class="maplngLat" onclick="changeMapAddress(this,'+ret.mapJingDu+','+ret.mapWeiDu+');" title="'+ ret.position +'">'+ ret.position +'</span><br/>');
		//里程
		html.push('<span class="b">' + parent.lang.monitor_labelLiCheng + '</span>&nbsp;' + ret.liCheng);
		//油量信息
		var oilDevice = this.getOilDevice();
		if(oilDevice != null) {
			html.push('&nbsp;&nbsp;&nbsp;&nbsp;<span class="b">' + parent.lang.labelFuel + '</span>&nbsp;' + oilDevice.getYouLiangStr());
			ret.youLiang = parent.lang.labelFuel + oilDevice.getYouLiangStr();
		}
		html.push('<br/>');
	}
	//新天地不显示司机
	if(!this.isXinTianDi()) {
		ret.driverId = dev.getDriverId();
		ret.driver = this.getCurVehicleDriver(ret.driverId);
		if (ret.driver != "" && ret.driver != " ") {
			//司机
			html.push('<span class="b">' + parent.lang.monitor_labelDriver + '</span>&nbsp;' + ret.driver + '<br/>');
		}
	}
	if(this.isSanitationTruck()) {//环卫管理
		ret.stationIndex = dev.getStationIndex(); //获取站点索引
		var company_ = this.getCompanyInfo(this.parentId);
		if(company_.level != 1) {
			company_ = this.getCompanyInfo(company_.companyId);
		}
		//车辆类型
		html.push('<span class="b">产权单位：</span>&nbsp;' + company_.name + '<br/>');
		//车辆类型
		html.push('<span class="b">车辆类型：</span>&nbsp;' + this.getVehiTypeStr() + '<br/>');
		//作业状态
		html.push('<span class="b">作业状态：</span>&nbsp;' + dev.getSanitationWorkStatusStr() + '<br/>');
	}
	if(showType != null && showType == 1) {
		//正常状态
		html.push('<span class="b">' + parent.lang.monitor_labelNormal + '</span>&nbsp;' + this.getOnlineString() + '<br/>');
		ret.statusString = html.join("");
		return ret;
	}
	//传感器
	var tempDevice = this.getTemperatureDevice();
	if(tempDevice != null) {
		//温度传感器
		var temperature_ = tempDevice.getTemperature();
		if(temperature_) {
			html.push('<span class="b">' + parent.lang.monitor_labelTemperature + '</span>' + temperature_ + '<br/>');
			ret.wenDu = parent.lang.monitor_labelTemperature + temperature_;
		}
		//氧气传感器
		var oxygen_ = tempDevice.getOxygen();
		if(oxygen_) {
			html.push('<span class="b">' + parent.lang.monitor_labelOxygen + '</span>' + oxygen_ + '<br/>');
			ret.oxygen = parent.lang.monitor_labelOxygen + oxygen_;
		}
		//湿度传感器
		var humidity_ = tempDevice.getHumidity();
		if(humidity_) {
			html.push('<span class="b">' + parent.lang.monitor_labelHumidity + '</span>' + humidity_ + '<br/>');
			ret.humidity = parent.lang.monitor_labelHumidity + humidity_;
		}
	}
	//线路信息
	if(this.isManageLine()) {
		ret.lineId = dev.getLineId(); //获取线路id
		ret.lineDirect =  dev.getLineDirect(); //获取线路上下行
		ret.stationIndex = dev.getStationIndex(); //获取站点索引
		
		if(!ret.lineId) {//如果没有线路id，则取默认的线路id
			ret.lineId = this.getParentId();
		}
		if(ret.lineId) {
			//如果是线路，则加载
			var company_ = this.getCompanyInfo(ret.lineId);
			if(company_ && company_.getLevel() != null && company_.getLevel() == 3) {
				ret.parentName = '';
				var line_ = this.getLineInfo(ret.lineId);
				if(line_) {
					ret.parentName = line_.getName() + '('+ dev.getLineDirectStr() + ')';
				}
				html.push('<span class="b">' + parent.lang.monitor_belong_line_label + '</span>&nbsp;' + ret.parentName + '<br/>');
				//上一站 下一站
				//根据线路id-线路上下行-站点索引获取关联信息，再取站点信息
				//取当前站点信息
				ret.curStationName = '';
				var station_ = this.getStationInfo(ret.lineId, ret.lineDirect, ret.stationIndex);
				if(station_) {
					ret.curStationName = station_.getName();
				}
				//取下一站信息
				ret.nextStationName = '';
				if(ret.stationIndex != null) {
					var nextStation_ = this.getStationInfo(ret.lineId, ret.lineDirect, parseInt(ret.stationIndex, 10) + 1);
					if(nextStation_) {
						ret.nextStationName = nextStation_.getName();
					}
				}
				
				//到站状态  0到站 1出站
				ret.stationStatus = dev.getStationStatus();
				
				if(ret.stationStatus == 0) {
					//到站，显示到站：站台名称 下一站：站点名称
					html.push('<span class="b">' + parent.lang.monitor_cur_station_label + '</span>&nbsp;' + ret.curStationName);
				}else {
					//出站，显示上一站：站台名称 下一站：站台名称
					html.push('<span class="b">' + parent.lang.monitor_pre_station_label + '</span>&nbsp;' + ret.curStationName);
				}
				html.push('&nbsp;&nbsp;&nbsp;&nbsp;<span class="b">' + parent.lang.monitor_next_station_label + '</span>&nbsp;' + ret.nextStationName + '<br/>');
			}
		}
	}
	
	//解析车辆状态
	var info = this.getStatusInfo(showType);
	
	ret.gpsStatus = info.gpsStatus;
	ret.gpsAlarm = info.gpsAlarm;
	ret.videoStatus = info.videoStatus;
	ret.videoAlarm = info.videoAlarm;
	ret.videoLostStatus = info.videoLostStatus;
	ret.recordStatus = info.recordStatus;
	ret.IOStatus = info.IOStatus;
	ret.obdStatus = info.obdStatus;
	
	
	var alarm = [];
	var normal = [];
	if(ret.gpsStatus != '') {
		normal.push(ret.gpsStatus);
	}
	if(ret.videoStatus != '') {
		normal.push(ret.videoStatus);
	}
	if(ret.gpsAlarm != '') {
		alarm.push(ret.gpsAlarm);
	}
	if(ret.videoAlarm != '') {
		alarm.push(ret.videoAlarm);
	}
	//有报警才显示
	if(alarm.length > 0) {
		//报警
		html.push('<span class="b red">' + parent.lang.monitor_labelAlarm + '</span>&nbsp;<span class="red">' + alarm.toString() + '</span><br/>');
	}
	//正常状态
	html.push('<span class="b">' + parent.lang.monitor_labelNormal + '</span>&nbsp;' + normal.toString() + '<br/>');
	//录像状态
	var videoStatus = "";
	if(ret.recordStatus != '') {
		videoStatus += '<span class="b">' + parent.lang.monitor_video_status + '</span>&nbsp;' + ret.recordStatus;
	}
	if(ret.videoLostStatus != '') {
		if(videoStatus != '') {
			videoStatus += ',' + parent.lang.alarm_type_video_lost_status + '：';
		}else {
			videoStatus += '<span class="b">' + parent.lang.alarm_type_video_lost_status + '：</span>&nbsp;';
		}
		videoStatus += ret.videoLostStatus;
	}
	if(ret.IOStatus != '') {
		if(videoStatus != '') {
			videoStatus += ',' + parent.lang.alarm_type_io_high + '：';
		}else {
			videoStatus += '<span class="b">' + parent.lang.alarm_type_io_high + '：</span>&nbsp;';
		}
		videoStatus += ret.IOStatus;
	}
	if(videoStatus != '') {
		videoStatus += '<br/>';
		html.push(videoStatus);
	}
	if(ret.obdStatus != '') {
		//报警
		html.push('<span class="b">OBD:</span>&nbsp;' + ret.obdStatus + '<br/>');
	}
	//html.push('</font>');
	
	ret.isAlarm = info.isAlarm;
	ret.statusString = html.join("");
	info = null;
	return ret;
}

//解析实时车辆状态
//showType  显示规则 1表示 vehicleMap使用
standardVehicle.prototype.gpsParseTrackStatus = function(showType) {
	var data = {};
	//这里需要判断两个设备的状态都无效的时候，才返回无效的情况   afu 150529
	var isValid = false;
	for(var i = 0; i < this.devList.length; i++) {
		if(this.devList[i].isValid()) {
			isValid = true;
		}
	}
	//车辆是否正在画点或者圆的操作
	data.isDrowing = this.isDrowing;
	if (!isValid) {
		if(this.isOnline()) {
			data.image = 2;	//无效
			data.color = "#ED23EB";
		}else {
			data.image = 1;	//离线
			data.color = "#808080";
		}
		data.statusString = " ";
	//	data.alarm = " ";
	//	data.normal = " ";
		data.gpsTime = " ";
		data.position = " ";
		data.speed = " ";
		data.liCheng = " ";
		data.gpsStatus = "";
		data.gpsAlarm = "";
		data.videoStatus = "";
		data.videoAlarm = "";
		data.mapJingDu = "";
		data.mapWeiDu = "";
		data.huangXiang = 0;
		data.isGpsValid = false;
		//公交线路
		data.driver = "";
		data.driverId = '';//司机id
		data.lineId = ''; //获取线路id
		data.lineDirect =  ''; //获取线路上下行
		data.stationIndex = ''; //获取站点索引
		data.stationStatus = '';//到站状态  0到站 1出站
		data.curStationName = '';
		data.nextStationName = '';
		data.geocoderLng = "";
		data.geocoderLat = "";
		return data;
	}
	var info = this.gpsParseRealStatus(showType);
	data.statusString = info.statusString;
	data.gpsTime = info.gpsTime;
	data.position = info.position;
	data.speed = info.speed;
	data.speedInt = info.speedInt;
	data.liCheng = info.liCheng;
	data.gpsStatus = info.gpsStatus;
	data.gpsAlarm = info.gpsAlarm;
	data.videoStatus = info.videoStatus;
	if(info.recordStatus != '') {
		if(data.videoStatus != '') {
			data.videoStatus += ",";
		}
		data.videoStatus += parent.lang.monitor_video_status + info.recordStatus;
	}
	if(info.videoLostStatus != '') {
		if(data.videoStatus != '') {
			data.videoStatus += ",";
		}
		data.videoStatus += parent.lang.alarm_type_video_lost_status + '：' + info.videoLostStatus;
	}
	if(info.IOStatus != '') {
		if(data.videoStatus != '') {
			data.videoStatus += ",";
		}
		data.videoStatus += parent.lang.alarm_type_io_high + '：' + info.IOStatus;
	}
	if(info.obdStatus != '') {
		if(data.videoStatus != '') {
			data.videoStatus += ",";
		}
		data.videoStatus += 'OBD：(' + info.obdStatus + ")";
	}
	data.videoAlarm = info.videoAlarm;
	data.mapJingDu = info.mapJingDu;
	data.mapWeiDu = info.mapWeiDu;
	data.isGpsValid = info.isGpsValid;
	data.huangXiang = info.huangXiang;
	data.geocoderLng = info.geocoderLng;
	data.geocoderLat = info.geocoderLat;
	
	//油量
	if(info.youLiang) {
		if(data.gpsStatus != '') {
			data.gpsStatus += ",";
		}
		data.gpsStatus += info.youLiang;
	}
	//温度
	if(info.wenDu) {
		if(data.gpsStatus != '') {
			data.gpsStatus += ",";
		}
		data.gpsStatus += info.wenDu;
	}
	//氧气
	if(info.oxygen) {
		if(data.gpsStatus != '') {
			data.gpsStatus += ",";
		}
		data.gpsStatus += info.oxygen;
	}
	//湿度
	if(info.humidity) {
		if(data.gpsStatus != '') {
			data.gpsStatus += ",";
		}
		data.gpsStatus += info.humidity;
	}
	
	//分成6个状态，离线、在线、报警、GPS不定位、停车未烽火，停车		 afu 150529
	//优先级是		如果设备是离线的，则是离线状态，如果是在线的，则先报警，再GPS未定位，再停车及停车未熄火，最后才是在线
	if(this.isOnline()) {
		data.image = 0;	//正常状态
		data.color = "#009900";
		//定位有效
		if(this.isLocationInvalid()) {
			//是否停车   
			if(this.isParked()) {
				data.image = 10;	//停车
				data.color = "#FFD700";
			}else {//判断是否为静止，并且ACC开启
				if(this.isParking()) {
					data.image = 9;	//停车未熄火
					data.color = "#000080";
				}
			}
			//定位有效才算报警状态
			if (this.isAlarm() > 0) {
				data.image = 3;	//报警状态
				data.color = "#FF0000";
			}
		}else {//定位无效
			data.image = 2;	//无效
			data.color = "#ED23EB";
		}
	}else {
		data.image = 1;	//离线
		data.color = "#808080";
	}
	
	//公交线路
	data.driver = info.driver;
	data.driverId = info.driverId; //司机id
	data.lineId = info.lineId; //获取线路id
	data.lineDirect =  info.lineDirect; //获取线路上下行
	data.stationIndex = info.stationIndex; //获取站点索引
	data.stationStatus = info.stationStatus;//到站状态  0到站 1出站
	data.curStationName = info.curStationName;
	data.nextStationName = info.nextStationName;
	info = null;
	return data;
};

standardVehicle.prototype.getStatusName = function(status) {
	if (0 == status) {
		return "/online/";
	} else if (1 == status) {
		return "/offline/";
	} else if (2 == status) {
		return "/parkaccon/";
	} else if (9 == status) {
		return "/stopaccon/";
	} else if (10 == status) {
		return "/stopaccoff/";
	} else if (11 == status) {
		return "/io/";
	} else {
		return "/alarm/";
	}
};

//解析实时车辆状态
standardVehicle.prototype.getStatueImg = function(statustype) {
	var huangXiang = 2;//(Number(huangxiang) & 0x7);
	var imagePath = '../../../808gps/images/vehicle/';
	var image = null;
	if (statustype < 4 || statustype == 9 || statustype == 10 || statustype == 11) {
		image = imagePath + this.getIcon() + this.getStatusName(statustype) + (huangXiang + 1) + ".png";
	} else {
		if (4 == statustype) {	//停车
			image = imagePath + "parking.gif";
		} else if (5 == statustype) {	//起点
			image = imagePath + "qidian.gif";
		} else if (6 == statustype) {	//终点
			image = imagePath + "zhongdian.gif";
		} else if (7 == statustype) {
			image = imagePath + "position.gif";
		} else if (8 == statustype) {
			image = imagePath + "alarmmarker.gif";
		}
	}
	return image;
};

//判断车辆是否达到了流量限制，如果达到，则禁用用户查看视频，对讲、监听、媒体下载等操作
//存在视频设备的车辆
standardVehicle.prototype.isOverFlowLimit = function() {
	var videoDevice = this.getVideoDevice();
	if(videoDevice != null) {
		//设备设置了流量限制
		if(videoDevice.isflowLimit()) {
			//本日受限或者本月流量用完
			if(videoDevice.isFlowDayLimit() || videoDevice.isFlowMonthLimit()) {
				return true;
			}
		}
	}
	return false;
}