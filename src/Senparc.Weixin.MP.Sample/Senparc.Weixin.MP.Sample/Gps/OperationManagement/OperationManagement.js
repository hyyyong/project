var pageUrls = [];
$(document).ready(function() {
	$('body').flexShowLoading(true);
	setTimeout(loadReadyPage, 50);
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined"){// || !parent.isLoadVehiGroupList) {
		setTimeout(loadReadyPage, 50);
	} else {
		//初始化样式
		var doc_ = null;
		if (typeof doc != 'undefined') {
			doc_ = doc;
		}
		parent.myPageStyle.initCommonStyle("OperationManagement", function() {
			loadPage();
		}, document, doc_);
	}
}

function loadPage() {
	//新建页面管理
	parent.operatePageManage = new pageManagement($('#mainPanel-yunying', parent.document).find('#rightPanel').get(0));
	if(parent.mapPageManage != null) {
		parent.mapPageManage.put('yunying', parent.operatePageManage);
	}
	//$.myajax.jsonGet('StandardLoginAction_getOperationPage.action', function(json, action, success) {
    //	if (success) {
    //var strss = "{\"result\":0,\"pages\":[{\"name\":\"AllVehicleInfo\",\"index\":null,\"lang\":\"vehicle_information\",\"privi\":null,\"url\":\"../OperationManagement/AllVehicleInfo/AllVehicleInfo.html\",\"title\":\"\"},{\"name\":\"VehicleTeam\",\"index\":null,\"lang\":\"vehiTeam_management\",\"privi\":null,\"url\":\"../OperationManagement/UserInfo/UserInfo.html\",\"title\":\"\"},{\"name\":\"UserInfo\",\"index\":null,\"lang\":\"user_information\",\"privi\":null,\"url\":\"../OperationManagement/UserInfo/UserInfo.html\",\"title\":\"\"},{\"name\":\"AllRoleInfo\",\"index\":null,\"lang\":\"role_management\",\"privi\":null,\"url\":\"OperationManagement/AllRoleInfo.html\",\"title\":\"\"},{\"name\":\"AllCompanyInfo\",\"index\":null,\"lang\":\"company_information\",\"privi\":null,\"url\":\"OperationManagement/AllCompanyInfo.html\",\"title\":\"\"},{\"name\":\"AllDeviceInfo\",\"index\":null,\"lang\":\"device_management\",\"privi\":null,\"url\":\"OperationManagement/AllDeviceInfo.html\",\"title\":\"\"},{\"name\":\"AllSIMInfo\",\"index\":null,\"lang\":\"SIM_card_information\",\"privi\":null,\"url\":\"OperationManagement/AllSIMInfo.html\",\"title\":\"\"},{\"name\":\"AllDriverInfo\",\"index\":null,\"lang\":\"driver_information\",\"privi\":null,\"url\":\"OperationManagement/AllDriverInfo.html\",\"title\":\"\"},{\"name\":\"AllSafeInfo\",\"index\":null,\"lang\":\"vehiSafe_management\",\"privi\":null,\"url\":\"OperationManagement/AllSafeInfo.html\",\"title\":\"\"},{\"name\":\"AllTransportCertificate\",\"index\":null,\"lang\":\"vehicle_tscertificatemanagement\",\"privi\":null,\"url\":\"OperationManagement/AllTransportCertificate.html\",\"title\":\"\"},{\"name\":\"AllDrivingCertificate\",\"index\":null,\"lang\":\"vehicle_drivinglicense\",\"privi\":null,\"url\":\"OperationManagement/AllDrivingCertificate.html\",\"title\":\"\"},{\"name\":\"MaturityInfo\",\"index\":null,\"lang\":\"expiration_reminder\",\"privi\":null,\"url\":\"OperationManagement/MaturityInfo.html\",\"title\":\"\"}]}";

	var strss = "{\"result\":0,\"pages\":[{\"name\":\"UserInfo\",\"index\":null,\"lang\":\"userInfo_management\",\"privi\":null,\"url\":\"../OperationManagement/UserInfo/UserInfo.html\",\"title\":\"\"},{\"name\":\"VehicleInfo\",\"index\":null,\"lang\":\"vehicleInfo_management\",\"privi\":null,\"url\":\"../OperationManagement/VehicleInfo/VehicleInfo.html\",\"title\":\"\"},{\"name\":\"batchAddVeh\",\"index\":null,\"lang\":\"batchAddVeh_management\",\"privi\":null,\"url\":\"../OperationManagement/BatchAddVeh/BatchAddVeh.html\",\"title\":\"\"},{\"name\":\"vehTransfer\",\"index\":null,\"lang\":\"vehTransfer_management\",\"privi\":null,\"url\":\"OperationManagement/VehTransfer/VehTransfer.html\",\"title\":\"\"}]}";
	var json = JSON.parse(strss);
			var mod = [];
			$.each(json.pages, function(i, page) {
				var pclass = "clearfix";
				var title_ = getPageTitle(page);
				if (i == 0) {
					pclass = "current clearfix";
					//新增页面
					parent.operatePageManage.addPage(page.name, title_, page.url);
				}
				pageUrls.push(page.url);
				mod.push({
					display: title_,
					title: title_,
					name: page.name,
					pclass: pclass,
					bgicon: true
				});
			});

			$('.nav').flexPanel({
				TabsModel: mod
			});

			$('.nav li').on('click', function() {
				$(this).addClass('current').siblings().removeClass("current");
				var data_tab = $(this).attr('data-tab');
				var pageTitle = $('.text', this).text();
				var index = $(this).index();
				//新增页面
				parent.operatePageManage.addPage(data_tab, pageTitle, pageUrls[index]);
			});
		//};
	//}, null);
	//加载完成
	$('body').flexShowLoading(false);
}

/**
 * 获取页面标题
 * @param page
 * @returns
 */
function getPageTitle(page) {
	if(page.title) {
		return page.title;
	}else if(page.lang) {
		return parent.lang[page.lang];
	}
	return "";
}