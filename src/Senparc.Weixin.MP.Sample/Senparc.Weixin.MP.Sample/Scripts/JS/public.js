$(function() {
	//去除Enter键和Backspace键，避免按这两个键退出系统的问题
	$(document).keydown(function (e) {
		var doPrevent;
		if (e.keyCode == 8||e.keyCode==13) {//注：8为Backspace键，13为Enter键
			var d = e.srcElement || e.target;
			if (d.tagName.toUpperCase() == 'INPUT' || d.tagName.toUpperCase() == 'TEXTAREA') {
				doPrevent = d.readOnly || d.disabled;
			}else
				doPrevent = true;
		}else 
			doPrevent = false;
		if (doPrevent)
			e.preventDefault();
	});
});
//字符串是否s结束
String.prototype.endWith=function(s){
	 if(s==null||s==""||this.length==0||s.length>this.length)
		 return false;
	 if(this.substring(this.length-s.length)==s)
		 return true;
	 else
		 return false;
	 return true;
 };
 //字符串是否s开始
String.prototype.startWith=function(s){
	if(s==null||s==""||this.length==0||s.length>this.length)
		return false;
	if(this.substr(0,s.length)==s)
		return true;
	else
		return false;
	return true;
};
///<summary>获得字符串实际长度，中文2，英文1</summary>
///<param name="str">要获得长度的字符串</param>
String.prototype.realLength = function() {
	var realLength = 0, len = this.length, charCode = -1;    
    for (var i = 0; i < len; i++) {        
    	charCode = this.charCodeAt(i);        
    	if (charCode >= 0 && charCode <= 128) 
    		realLength += 1;        
    	else realLength += 2;    
    }    
    return realLength;
}
//截取字符串
String.prototype.getRealSubStr = function(start, lenth) {
	var charCode = -1, retStr = '';  
	var str = this.substr(start, lenth);
	var realLength = retStr.realLength();
	
	var i = 0;
	while(realLength <= lenth && i <= lenth) {
		retStr += str.substr(i, 1);
		realLength = retStr.realLength();
		i++;
	}
    return retStr;
}

/**
 * 全部替换
 * g 执行全局匹配（查找所有匹配而非在找到第一个匹配后停止）
 * m 执行多行匹配
 * @param regex  //被替换的
 * @param replacement //替换的
 * @returns String
 */
String.prototype.replaceAll = function(regex, replacement){
	//this.replace(/regex/g, replacement)
	return this.replace(new RegExp(regex, "gm"), replacement);
}

/**
 * 比较字符串是否相等，不区分大小写
 * @param str
 * @returns {Boolean}
 */
String.prototype.compareNotCase = function(str) {
	return this.toLowerCase() == str.toLowerCase();
}

/**
 * 判断字符串str是否包含在本字符串中
 * @param str
 * @returns {Boolean}
 */
String.prototype.indexOfNotCase = function(str) {
	return this.toLowerCase().indexOf(str.toLowerCase());
}


var getLength = function(str) {    
	///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    var realLength = 0, len = str.length, charCode = -1;    
    for (var i = 0; i < len; i++) {        
    	charCode = str.charCodeAt(i);        
    	if (charCode >= 0 && charCode <= 128) 
    		realLength += 1;        
    	else realLength += 2;    
    }    
    return realLength;
 };

//数组中是否存在e
Array.prototype.S=String.fromCharCode(2);  
Array.prototype.in_array=function(e)  {  
	var r=new RegExp(this.S+e+this.S);
	return (r.test(this.S+this.join(this.S)+this.S));  
};  

//数组中e 的下标
Array.prototype.getIndex=function(e)  {  
	for (var i = 0; i < this.length; i++) {
		if (this[i] == e) {
			return i;    
		} 
	}  
};  

function toggleMyClass(mid, obj, className) {
	$(mid).each(function(){
		if(this == obj) {
			$(this).addClass(className);
		}else {
			$(this).removeClass(className);
		}
	});
};

/**
 * 音频文件获取编码后的字符串
 * js和java的ascii 1-127的字符循环编码匹配不同
 *	ascii      java        js
 *               +        %20
 *	!           %21        !
 *	'           %27        '
 *	(           %28        (
 *	)           %29        )
 *	~           %7E        ~
 *	js 编码后对特殊字符做个处理
 */
function audioFileEncodeURI(value) {
	value = encodeURI(value);
	value = value.replace(/%20/gi, "+").replace(/(!)|(')|(\()|(\))|(\~)/gi, function(item) {
		return "%" + item.charCodeAt(0).toString(16).toLocaleUpperCase();
	});
	return value;
}

//获取数组中所有id组成的新数组 type 类型 'id' 或者 'name'
function getNewArrayByArray(array,type) {
	var newArray = [];
	if(type == null || array == null) {
		return newArray;
	}
	for(var i = 0; i < array.length; i++) {
		if(type == 'id') {
			if(array[i].id) {
				newArray.push(array[i].id);
			}
		} else if(type == 'vehiId') {
			if(array[i].vehiId) {
				newArray.push(array[i].vehiId);
			}
		}else if(type == 'name') {
			newArray.push(array[i].name);
		}
	}
	return newArray;
};

//获取数组中id与id相同的值
function getArrayName(array,id) {
	if(id == null) {
		return '';
	}
	for(var i = 0; i < array.length; i++) {
		if(array[i].id == id) {
			return array[i].name;
		}
	}
	return '';
};

////获取数组中id与id相同的值
//function getMarkArrayName(array,id) {
//	if(id == null) {
//		return '';
//	}
//	for(var i = 0; i < array.length; i++) {
//		if(array[i].i == id) {
//			return array[i].n;
//		}
//	}
//	return '';
//};




//
function getArrayLevel(array,id) {
	if(id == null) {
		return '';
	}
	for(var i = 0; i < array.length; i++) {
		if(array[i].id == id) {
			return array[i].level;
		}
	}
	return '';
};

//根据id返回相应对象
function getArrayInfo(array,id) {
	if(id == null) {
		return null;
	}
	for(var i = 0; i < array.length; i++) {
		if(array[i].id == id) {
			return array[i];
		}
	}
	return null;
}

//根据id返回相应对象的索引
function getArrayIndex(array, id) {
	if(id == null) {
		return 0;
	}
	for(var i = 0; i < array.length; i++) {
		if(array[i].id == id) {
			return i;
		}
	}
	return 0;
}

function arrayToStr(arr) {
	var str = '';
	for(var i = 0; i < arr.length; i++) {
		if(i != 0) str += '|';
		str += arr[i].id + '&' + arr[i].name;
	}
	return str;
}


//
//function arrayToMarkStr(arr) {
//	var str = '';
//	for(var i = 0; i < arr.length; i++) {
//		if(i != 0) str += '|';
//		str += arr[i].i + '&' + arr[i].n;
//	}
//	return str;
//}



function vehicleList2Arr(arr) {
	var str = '';
	for(var i = 0; i < arr.length; i++) {
		if(i != 0) str += '|';
		str += arr[i].nm + '&' + arr[i].nm;
	}
	return str;
}

//获取距离body的上边距
function getTop(e){
	var offset = 0;
	var obj = e;
	while(obj != null && obj != document.body) {
		offset += obj.offsetTop;
		obj = obj.offsetParent;
	}
	while(obj != null && e != document.body) {
		offset -= e.scrollTop;
		e = e.parentElement;
	}
	return offset;
} 
//获取距离body的左边距
function getLeft(e){ 
	var offset = 0;
	var obj = e;
	while(obj != null && obj != document.body) {
		offset += obj.offsetLeft;
		obj = obj.offsetParent;
	}
	while(e != null && e != document.body) {
		offset -= e.scrollLeft;
		e = e.parentElement;
	}
	return offset;
}

//限制输入数字
function restrictionsDigital(mid) {
	$(mid).on('input propertychange',function() {
		var isNum = /^[0-9]*$/;
		var value = $.trim($(this).val());
		if(!isNum.test(value)) {
			$(this).val(value.substring(0,value.length-1));
		}
	});
}

/**
 * 限制输入数字
 */
function enterDigital(mid) {
	$(mid).on('input propertychange keypress',function() {
		var isNum = /\D/g;
		var value = $.trim($(this).val());
		if(isNum.test(value)) {
			$(this).val(value.replace(isNum,''));
		}
	});
}


/**
 * 限制输入数字和'.-'
 */
function enterDigitalAndPoint(mid) {
	$(mid).on('input propertychange keypress',function() {
		if(/[^\d.-]/g.test(this.value)) {
			this.value = this.value.replace(/[^\d.-]/g, '');  //清除“数字”和“.”“-”以外的字符
		}
		if(/^\./g.test(this.value)) {
			this.value = this.value.replace(/^\./g, '');  //验证第一个字符是数字而不是.
		}
		if(/^\-\./g.test(this.value)) {
			this.value = this.value.replace(/^\-\./g, '-'); //不能存在-.
		}
//		var isCkx2 = /\.{2,}/g; //不能有连续2个.
		if(/\.+\d*\-*\.+/g.test(this.value)) {//不能有超过2个的.
			//只保留第一个. 清除多余的.
			this.value = this.value.replace('.','$#$').replace(/\./g,'').replace("$#$",'.');
		}
		if(/\-+\d*\.*\-+/g.test(this.value)) {//不能有超过2个的-
			//只保留第一个- 清除多余的-
			this.value = this.value.replace('-','$#$').replace(/\-/g,'').replace('$#$','-'); 
		}else {
			if(/\d+\.*\-/g.test(this.value)) {//不能以数字-开头
				this.value = this.value.substring(0,this.value.length-1);
			}
		}
	});
}

/**
 * 限制输入特殊字符
 */
function cleanSpelChar(mid){
	$(mid).on('input propertychange keypress',function() {
		/*var pattern = new RegExp("[`~%!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“\"'。，、？]"); 
		var value = $.trim($(this).val());
		if(value != null && value != '') {
			var rs = ""; 
			for (var i = 0; i < value.length; i++) { 
				rs = rs+value.substr(i, 1).replace(pattern, ''); 
			} 
			$(this).val(rs);
		}*/
		var reg= /[@#,|?<>"':*\\\/\$%\^&\*]+/g;
		var value = $.trim($(this).val());
		if(reg.test(value)){
		//if(!reg.test(str))  {
			$(this).val(value.replace(reg,''));
		}
	});
}

/**
 * 只能输入汉字和字母
 */
function enterChar(mid) {
	$(mid).on('input propertychange keypress',function() {
		var isNum = /[\d]/g;
		var value = $.trim($(this).val());
		if(isNum.test(value)){
			$(this).val(value.replace(isNum,''));
		}
	});
}

/**
 * 限制只能输入汉字英文和数字
 */
function enterCharEnglishNumer(mid) {
	$(mid).on('input propertychange keypress',function() {
		var isNum = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g;
		var value = $.trim($(this).val());
		if(isNum.test(value)){
			$(this).val(value.replace(isNum,''));
		}
	});
}

/**
 * 限制只能输入汉字英文和数字以及-
 */
function enterCharEnglishNumerEx(mid) {
	$(mid).on('input propertychange keypress',function() {
		var isNum = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\\-]/g;
		var value = $.trim($(this).val());
		if(isNum.test(value)){
			$(this).val(value.replace(isNum,''));
		}
	});
}

/**
 * 限制输入特殊字符和汉字
 */
function cleanChar(mid){
	$(mid).on('input propertychange keypress',function() {
		var isNum = /[^\w\.\/]/ig;
		var value = $.trim($(this).val());
		if(isNum.test(value)){
			$(this).val(value.replace(isNum,''));
		}
	});
}

/**
 * 限制输入特殊字符(除去@)和汉字
 */
function cleanCharAndNum(mid){
	$(mid).on('input propertychange keypress',function() {
		var isNum = /[^\w\.\/@]/ig;
		var value = $.trim($(this).val());
		if(isNum.test(value)){
			$(this).val(value.replace(isNum,''));
		}
	});
}

/**
 * 限制只能输入英文和数字
 */
function enterEnglishNumer(mid) {
	$(mid).on('input propertychange keypress',function() {
		var isNum = /[^\a-\z\A-\Z0-9]/g;
		var value = $.trim($(this).val());
		if(isNum.test(value)){
			$(this).val(value.replace(isNum,''));
		}
	});
}

var searchTimer = null;
var companyTree;
var oldCompanyId = null;
/**
 * 加载公司树结构
 * @param companys 公司列表
 * @param mid 顶点id
 * @param type 1区域
 */
function addCompanyTree(companys_, mid, type, titleName, displayName_, errtips_) {
	var displayName, errtips;
	var companys = [];
	if(typeof parent.myUserRole != 'undefined' && parent.myUserRole.isChemicals()
			&& type && type == '1'){
		companys.push({id:0,name:'中国',parentId:-1});
		displayName = "选择区域";
		errtips = "区域列表中没有对应的值";
	}else{
		if(displayName_) {
			displayName = displayName_;
		}else {
			displayName = parent.lang.btnSelectCompany;
		}
		if(errtips_) {
			errtips = errtips_;
		}else {
			errtips = parent.lang.errCompanyNotExists;
		}
	}
	$('.td-company').flexPanel({
		InputModel : {display: displayName,value:'',name : 'company', pid : 'company', pclass : 'buttom',bgicon : 'true',hidden:true, hide : false} 
	});

	if(parent.myUserRole.isSanitationTruck()) {//环卫不显示线路
		for (var i = 0; i < companys_.length; i++) {
			if(companys_[i].level != 3) {
				companys.push(companys_[i]);
			}
		}
	}else {
		companys = companys_;
	}
	
	companyTree = new dhtmlXTreeObject("company_tree", "100%", "100%", 0);
	companyTree.enableCheckBoxes(false);
	companyTree.enableThreeStateCheckboxes(false);
	companyTree.setImagePath("../../../js/dxtree/imgs/");
	companyTree.fillCompany(companys, mid, titleName);
	companyTree.setOnDblClickHandler(companyDblClickEvent);
	$('#company_tree').css('overflow','auto');
	var isOut = true;
	$('.td-company #combox-company').on('input propertychange click',function(e){
		
		$('#company_tree').css('top',getTop($('.td-company .btn-group').get(0)) + $('.td-company .btn-group').height() + 'px');
		$('#company_tree').css('left',getLeft($('.td-company .btn-group').get(0)) + 'px');
		$('#company_tree').css('width',$('.td-company .btn-group .item').width()+'px');
		if(e.type == 'click') {
			isOut = false;
			$('#company_tree').show();
		}
		if (searchTimer == null) {
			searchTimer = setTimeout(function() {
				var name = $.trim($('.td-company #combox-company').val());
				if (name !== "") {
					companyTree.searchCompany(name);
				}
				searchTimer = null;
			}, 200);
		}
	}).on('mouseover',function(){
		isOut = false;
	}).on('mouseout',function(){
		isOut = true;
	});
	
	$('.td-company .bg-icon-company').on('click',function(){
		if($('#combox-company').get(0) && $('#combox-company').get(0).disabled) {
			return;
		}
		$('#company_tree').css('top',getTop($('.td-company .btn-group').get(0)) + $('.td-company .btn-group').height() + 'px');
		$('#company_tree').css('left',getLeft($('.td-company .btn-group').get(0)) + 'px');
		$('#company_tree').css('width',$('.td-company .btn-group .item').width()+'px');
		if($('#company_tree').css('display') == 'none') {
			$('#company_tree').show();
			isOut = false;
			if (searchTimer == null) {
				searchTimer = setTimeout(function() {
					var name = $.trim($('.td-company #combox-company').val());
					if (name !== "") {
						companyTree.searchCompany(name);
					}
					searchTimer = null;
				}, 200);
			}
		}else {
			checkCompanyTreeParam();
		}
	}).on('mouseover',function(){
		isOut = false;
	}).on('mouseout',function(){
		isOut = true;
	});
	
	$('.td-company #combox-company').on('keydown',function(e){
		if(e.keyCode == 13) {
			$('#company_tree').css('top',getTop($('.td-company .btn-group').get(0)) + $('.td-company .btn-group').height() + 'px');
			$('#company_tree').css('left',getLeft($('.td-company .btn-group').get(0)) + 'px');
			$('#company_tree').css('width',$('.td-company .btn-group .item').width()+'px');
			if($('#company_tree').css('display') == 'none') {
				$('#company_tree').show();
				isOut = true;
				if (searchTimer == null) {
					searchTimer = setTimeout(function() {
						var name = $.trim($('.td-company #combox-company').val());
						if (name !== "") {
							var search = companyTree.searchCompany(name);
							$('.td-company .span-tip').text('*');
							if(search == null) {
								$('.td-company #hidden-company').val('');
								$('.td-company .span-tip').text(errtips);
								oldCompanyId = '';
								isOut = true;
							}
						}else {
							$('.td-company #hidden-company').val('');
							$('.td-company .span-tip').text(errtips);
							oldCompanyId = '';
							isOut = true;
						}
						searchTimer = null;
					}, 200);
				}
			}else {
				checkCompanyTreeParam();
			}
		}
	});

	
	$('#company_tree').on('mouseover',function(){
		isOut = false;
	}).on('mouseout',function(){
		isOut = true;
	});
	$('body').on('click',function(){
		if(isOut && $('#company_tree').css('display') != 'none'){
			checkCompanyTreeParam();
		}
	});
	var checkCompanyTreeParam = function(){
		if($('#combox-company').get(0) && $('#combox-company').get(0).disabled) {
			return;
		}
		var name = $.trim($('.td-company #combox-company').val());
		var selId = companyTree.getSelectedItemId();
		if(selId != '*_0' && selId != '*_'+sid) {
			var id =selId.split('_')[1];
			var cname = getArrayName(companys,id);
			if(name == '' || name == cname) {
				companyDblClickEvent();
				isOut = true;
			}else {
				var plag = false;
				for(var i = 0; i < companys.length; i++) {
					if(name == companys[i].name) {
						companyDblClickEvent();
						isOut = true;
						plag = true;
						return;
					}
				}
				if(!plag) {
					$('.td-company #hidden-company').val('');
					$('.td-company .span-tip').text(errtips);
					oldCompanyId = '';
					$('#company_tree').hide();
					isOut = true;
				}
			}
		}else {
			if(name == null || name == '') {
				if(typeof parent.myUserRole != 'undefined' && parent.myUserRole.isChemicals()
						&& type && type == '1'){
					companyDblClickEvent();
					isOut = true;
				}else {
					$('.td-company #hidden-company').val('');
					$('.td-company .span-tip').text(errtips);
					oldCompanyId = '';
					$('#company_tree').hide();
					isOut = true;
				}
			}else {
				var plag = false;
				for(var i = 0; i < companys.length; i++) {
					if(name == companys[i].name) {
						companyDblClickEvent();
						isOut = true;
						plag = true;
						return;
					}
				}
				if(!plag) {
					$('.td-company #hidden-company').val('');
					$('.td-company .span-tip').text(errtips);
					oldCompanyId = '';
					$('#company_tree').hide();
					isOut = true;
				}
			}
		}
	}
}

/**
 * 检查数据
 * @returns {Boolean}
 */
function checkParam() {
	var flag = true;
	var i = 0;
	$('#required-area input,#required-area textArea').each(function(){
		if (!$(this).hasClass("nocheckempty")) {
			var name = $(this).attr('data-name');
			if(($(this).val() == null || $(this).val() == '') && name != 'role' 
				&& name != 'devIDNO' && name != 'icCard'){
				$('.td-'+name).find('.span-tip').text(parent.lang.not_be_empty);
				if(i == 0) {
					$('#required-area .panel-body').addClass('show');
					$(this).focus();
				}
				i++;
			}else {
				$('.td-'+name).find('.span-tip').text('*');
			}
		}
	});
	if(i != 0) {
		flag = false;
	}
	return flag;
}

function getParentCompany(companys,parentId) {
	for(var i = 0; i < companys.length; i++) {
		if(companys[i].id == parentId) {
			return companys[i];
		}
	}
}

//获取父公司
function getPartCompanys(companys,parentCompanys,id) {
	for(var i = 0;i < companys.length; i++) {
		if(companys[i].id == id){
			parentCompanys.push(companys[i]);
		}
	}
}

//获取子公司
function getChildCompanys(companys,childCompanys,id) {
	for(var i = 0;i < companys.length; i++) {
		if(companys[i].parentId == id){
			childCompanys.push(companys[i]);
		}
	}
}

/**
 * 添加页面锁屏
 * @param flag
 */
function disableForm(flag){
	if(flag) {
		$('body').append('<div id="lockmask" style="position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; overflow: hidden; -ms-filter:\'progid:DXImageTransform.Microsoft.Alpha(Opacity=50)\'; opacity: 0.5;filter:alpha(opacity=50);background: none repeat scroll 0% 0% rgb(220, 226, 241); z-index: 1994;"></div>');
	}else {
		$('#lockmask').remove();
	}
}

/**
 * 设置界面宽度
 */
function loadReportTableWidth(callBackFun) {
	var width = $(window).width();
	var height = $(window).height();
	//不能少于1024
	if(width < 1024) {
		width = 1024;
	}
	
	if(getTop($('.queryGraph-render').get(0)) == 0 || getTop($("#container").get(0)) != 0) {
		height = height - getTop($('.flexigrid .bDiv').get(0)) - $('.flexigrid .pDiv').height() - 10;
	}
	if(getTop($('.queryGraph-render').get(0)) != 0) {
		height = height - getTop($('.flexigrid .bDiv').get(0)) - $('.flexigrid .pDiv').height() - 10;
	}
	height = height < 0 ? 0 : height;
	$('.flexigrid .bDiv').height(height);
	if (typeof callBackFun == "function") {
		callBackFun();
	}
}

/**
 * 地图界面全屏显示
 */
function fullMapScreen() {
	$('body',parent.document).find('#main-topPanel').toggleClass('show');
	$('body',parent.document).resize();
};

/**
 * 添加提示组件
 * @param id
 * @param tltle
 */
function setTooltip(id, tltle) {
	$(id).attr("title", tltle);
	$(id).tooltip();
}

/**
 * 判字符串断是否包含空格(字符前中后)
 * @param str
 * @returns
 */
function isCheckEmpty(str) {
	var reg =/\s/;
	return reg.test(str);
}

/**
 * 是否禁止系统右键  true 禁止
 */
function disableSysRight(id,disable,func) {
	if(disable) {
		if(typeof func != 'undefined' && func != null) {
			$(id).on('contextmenu',func);
		}else {
			$(id).on('contextmenu',function(){return false;});
		}
	}else {
		$(id).unbind('contextmenu');
	}
}

/**
 * 获取服务器ip
 * 与浏览器ip匹配
 */
function getComServerIp(lstSvrIp) {
	if(lstSvrIp != null && lstSvrIp.length > 0) {
		var host = window.location.host.split(':');
		if (host.length >= 1) {
			var addr = host[0];
			if(addr == 'localhost') {
				return "127.0.0.1";
			}
			for (var i = 0; i < lstSvrIp.length; ++ i) {
				if (addr == lstSvrIp[i]) {
					return lstSvrIp[i];
				}
			}
		}
		return lstSvrIp[0];
	}
	return "127.0.0.1";
}

//显示错误信息
function showDialogErrorMessage(result, cmsserver, resultTip) {
	if(cmsserver != null && cmsserver == 1) {
		var timeout = 0.5;
		switch(result) {
		case 1:		//系统出现异常	$.dialog.tips 默认关闭时间为1.5秒
			$.dialog.tips(parent.lang.errException,timeout);
			break;
		case 2:		//用户无权限
			$.dialog.tips(parent.lang.errNoPrivilige,timeout);
			break;
		case 3:		//参数错误
			$.dialog.tips(parent.lang.errRequireParam,timeout);
			break;
		case 4:		//操作数据库出错
			$.dialog.tips(parent.lang.errDbConnErr,timeout);
			break;
		case 5:		//信息不存在
			$.dialog.tips(parent.lang.errNoExist,timeout);
			break;
		case 6:		//未知错误
			$.dialog.tips(parent.lang.errUnkown,timeout);
			break;
		case 7:		//名称已经被使用
			$.dialog.tips(parent.lang.errNameExist,timeout);
			break;
		case 21:		//设备信息不存在
			$.dialog.tips(parent.lang.errDeviceNoExist,timeout);
			break;
		case 22:		//没有收到设备的回馈信息
			$.dialog.tips(parent.lang.errorDeviceNoResponse,timeout);
			break;
		case 23:	//设备不在线
			$.dialog.tips(parent.lang.video_not_online,timeout);
			break;
		case 24:	//正在为其它客户端执行对讲操作
			return "";
		case 25:	//设备媒体转发关联信息不存在
			return "";
		case 26:	//设备连接中断
			$.dialog.tips(parent.lang.errorDeviceDisconnect,timeout);
			break;
		case 27:	//未定义存储路径
			return "";
		case 45:	//设备不支持此功能
			$.dialog.tips(parent.lang.device_nosupport,timeout);
			break;
		case 61:	//文件格式错误
			$.dialog.tips(parent.lang.errSImageType,timeout);
			break;
		case 62:	//服务器上不存在此文件
			$.dialog.tips(parent.lang.errorFileNotExists,timeout);
			break;
		case 63:	//文件已全部下载完成
			$.dialog.tips(parent.lang.errorFileDownloadAll,timeout);
			break;
		case 64:	//文件正在下载
			$.dialog.tips(parent.lang.errorFileDownloading,timeout);
			break;
		case 65:	//没有搜索到录像文件
			$.dialog.tips(parent.lang.errorVideoFileNotSearch,timeout);
			break;
		case 66:	//文件正在被使用
			$.dialog.tips(parent.lang.errorFileisUse,timeout);
			break;
		case 101:	//服务器连接失败
			$.dialog.tips(parent.lang.errorServerConnectFail,timeout);
			break;
		case 81:	//用户不存在
			$.dialog.tips(parent.lang.errLogin_UserNoExist,timeout);
			break;
		case 82:	//用户密码错误
			$.dialog.tips(parent.lang.errLogin_PasswordError,timeout);
			break;
		case 83:	//用户名错误
			$.dialog.tips(parent.lang.errLogin_UserError,timeout);
			break;
		case 102:	//服务器空间不足
			$.dialog.tips(parent.lang.errorServerSpaceNotEnough,timeout);
			break;
		case 106:	//服务器信息不存在，无法为客户提供服务
			$.dialog.tips(parent.lang.errServerNoExist,timeout);
			break;
		case 109:	//服务器不在线
			$.dialog.tips(parent.lang.errorServerOffline,timeout);
			break;
		case 110:	//服务器连接中断
			$.dialog.tips(parent.lang.errorServerDisconnect,timeout);
			break;
		case 57:	//RET_USER_RESPONSE_ERR = 57; //用户请求异常
			$.dialog.tips(parent.lang.usersRequestFails,timeout);
			break;
		case 58:	//RET_DOWNLOADTASK_EXIST = 58; //下载任务已存在
			$.dialog.tips(parent.lang.errDownloadTaskExists,timeout);
			break;
		case 59:	//RET_DEVICE_OFFLINE = 59;  //设备不在线
			$.dialog.tips(parent.lang.video_not_online,timeout);
			break;
		default:	//未知错误
			return '';
		}
	}else {
		if((typeof showErrorMessage) == 'function') {
			showErrorMessage(result, resultTip);
		}
		if(result == 2) {
			top.window.location = "login.html";
		}
	}	
}

//百度谷歌经纬度互换
function convertBaiduGoogle(lat, lng, toMap) {
	var x_pi = (3.14159265358979324*3000.0)/180.0;
	lat = parseFloat(lat);
	lng = parseFloat(lng);
	var gps = {};
	if(toMap == 1) {////百度经纬度转为谷歌经纬度
		lng = lng - 0.0065, lat = lat - 0.006; 
		var z = Math.sqrt(lng * lng + lat * lat) - 0.00002 * Math.sin(lat * x_pi); 
		var theta = Math.atan2(lat, lng) - 0.000003 * Math.cos(lng * x_pi);
		gps.lng = z * Math.cos(theta);
		gps.lat = z * Math.sin(theta);
	}else {//谷歌经纬度转为百度经纬度
		var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_pi);  
	    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_pi);
	    gps.lng = z * Math.cos(theta) + 0.0065;
	    gps.lat = z * Math.sin(theta) + 0.006;
	}
	gps.lng = gps.lng.toFixed(6);
	gps.lat = gps.lat.toFixed(6);
    return gps;
}

function transformLat(dblng, dblat, pi){
    var ret = -100.0 + 2.0 * dblng + 3.0 * dblat + 0.2 * dblat * dblat + 0.1 * dblng * dblat + 0.2 * Math.sqrt(Math.abs(dblng));
    ret += (20.0 * Math.sin(6.0 * dblng * pi) + 20.0 * Math.sin(2.0 * dblng * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(dblat * pi) + 40.0 * Math.sin(dblat / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(dblat / 12.0 * pi) + 320 * Math.sin(dblat * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}

function transformLon(dblng, dblat, pi){
	var ret = 300.0 + dblng + 2.0 * dblat + 0.1 * dblng * dblng + 0.1 * dblng * dblat + 0.1 * Math.sqrt(Math.abs(dblng));
    ret += (20.0 * Math.sin(6.0 * dblng * pi) + 20.0 * Math.sin(2.0 * dblng * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(dblng * pi) + 40.0 * Math.sin(dblng / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(dblng / 12.0 * pi) + 300.0 * Math.sin(dblng / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
}

//gps坐标转换为火星坐标（gcj02）谷歌、高德、四维使用此坐标
function fixCoordinate(lat, lng){
	var a = 6378245.0;
    var ee = 0.00669342162296594323;
    var pi = 3.14159265358979324;
	var gps = {};
	gps.lat = parseFloat(lat);
	gps.lng = parseFloat(lng);
    var dWeidu = transformLat(lng - 105.0, lat - 35.0, pi);
    var dJingDu = transformLon(lng - 105.0, lat - 35.0, pi);
    var radJingDu = lat / 180.0 * pi;
    var magic = Math.sin(radJingDu);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dWeidu = (dWeidu * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dJingDu = (dJingDu * 180.0) / (a / sqrtMagic * Math.cos(radJingDu) * pi);
    gps.lat = gps.lat + dWeidu;
    gps.lng = gps.lng + dJingDu;
    
    gps.lng = gps.lng.toFixed(6);
	gps.lat = gps.lat.toFixed(6);
	return gps;
}

//gps坐标转换为百度坐标
function fixConvert(lat, lng)  {
	var x_pi = (3.14159265358979324*3000.0)/180.0;
	var gps = fixCoordinate(lat, lng);
    var x = gps.lng, y = gps.lat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);  
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);  
    gps.lng = z * Math.cos(theta) + 0.0065;  
    gps.lat = z * Math.sin(theta) + 0.006;
    gps.lng = gps.lng.toFixed(6);
	gps.lat = gps.lat.toFixed(6);
    return gps; 
}

//gps坐标转换
//mapType 地图类型 0谷歌 3百度
//geocoderMapType 0默认 1谷歌 2百度 3高德 4四维
//defaultGeocoderMapType 0默认 1谷歌 2百度 3高德 4四维
function geocoderLngLat(lat, lng, mapType, geocoderMapType, defaultGeocoderMapType) {
	if(geocoderMapType && geocoderMapType != 0) {
		if(geocoderMapType == 2) {
			return fixConvert(lat, lng);
		}else {
			return fixCoordinate(lat, lng);
		}
	}else {//默认解析
		if(defaultGeocoderMapType && defaultGeocoderMapType != 0) {
			if(defaultGeocoderMapType == 2) {
				return fixConvert(lat, lng);
			}else {
				return fixCoordinate(lat, lng);
			}
		}else {
			if(mapType && mapType == 3) {
				return fixConvert(lat, lng);
			}else {
				return fixCoordinate(lat, lng);
			}
		}
	}
}

/* 
 * 判断图片类型
 *  
 * @param fileObj  type="file"的javascript对象 
 * @return true-符合要求,false-不符合 
 */ 
function checkImgType(fileObj){
    if (fileObj.value) {
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|JPEG|PNG|BMP)$/.test(fileObj.value)) {  
            return false;
        }
    }  
    return true;  
}

/* 
 * 判断图片大小
 *  
 * @param fileObj type="file"的javascript对象
 * @param size 图片大小
 * @return true-符合要求,false-不符合 
 */ 
function checkImgSize(fileObj, size){  
    if (fileObj.value) {  
        if (fileObj.files && fileObj.files[0]) {
        	//获取文件大小
            var fileSize = fileObj.files[0].size || fileObj.files[0].fileSize;
            if(fileSize > parseInt(size, 10)*1024*1024){
            	return false;
            }
    	} else{ // 兼容IE
//        	var img = new Image(); //动态创建img
//    		img.src = fileObj.value;
//    		img.style.display = "none";
//    		img.onload = function(){
//    			img.fileSize= this.fileSize;
//    			alert(img.fileSize);//ie获取文件大小
//    		}
//    		if(img.readyState=="complete"){//已经load完毕，直接打印文件大小
//    			alert(img.filesize);//ie获取文件大小
//    		}else{
//    			img.onreadystatechange=function(){
//    				if(img.readyState=='complete'){//当图片load完毕
//    					alert(img.fileSize);//ie获取文件大小
//    				}
//    			}
//    		}
    	}
    }  
    return true;
}

//追加CSS文件到head标签内
function loadHeadCss(url, callback, document_, doc_) {
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

//获取设备类型列表
function getTerminalTypes() {
	var pageType = getUrlParameter('pageType'); //2位警员管理
	var terminalTypes = [];
	if(pageType && pageType == 2) {//警员管理
		terminalTypes.push({id:9,name: '单兵设备'});
	}else {
		terminalTypes.push({id:5,name: parent.lang.positioning_terminal});
		terminalTypes.push({id:7,name: parent.lang.video_terminal});
	}
	if(parent.myUserRole && parent.myUserRole.isSanitationTruck()) {//环卫车
		terminalTypes.push({id:8,name: '手持终端'});
	}
	return terminalTypes;
}

//密码强度校验    当isCheck 传1表示进行数据校验，
function doCheckPsw(input,tip,isCheck){
	//规则： 不能为单一数字，单一字母，单一符号 。必须包含两种以上
	if(isCheck == 1){
		var	reg = /^((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{8,}$/;
		var data = $(input).val();
		if (!reg.test(data)){
			tip.text(parent.lang.passwordcheck);
			return false;
		}else {
			tip.text("*");
			return true;
		}
	}
}

//kg转为吨
function getGoodsBigAmount(amount) {
	if(amount != null && amount != '') {
		return parseInt(amount, 10) / 1000;
	}
	return 0;
}

//吨转为kg
function getGoodsSmallAmount(amount) {
	if(amount != null && amount != '') {
		return parseInt(parseFloat(amount) * 1000, 10);
	}
	return 0;
}

//创建一个名字为name的计时器，调用console.timeEnd(name)停止计时器并输出所耗时间（毫秒）
function loadConsoleTime(flag, name) {
	if(flag) {
		console.time(name);
	}else {
		console.timeEnd(name);
	}
}

window._console = window.console;//将原始console对象缓存  
window.console = (function (orgConsole) {  
    return {//构造的新console对象  
        log: getConsoleFn("log"),  
        debug: getConsoleFn("debug"),  
        info: getConsoleFn("info"),  
        warn: getConsoleFn("warn"),  
        exception: getConsoleFn("exception"),  
        assert: getConsoleFn("assert"),  
        dir: getConsoleFn("dir"),  
        dirxml: getConsoleFn("dirxml"),  
        trace: getConsoleFn("trace"),  
        group: getConsoleFn("group"),  
        groupCollapsed: getConsoleFn("groupCollapsed"),  
        groupEnd: getConsoleFn("groupEnd"),  
        profile: getConsoleFn("profile"),  
        profileEnd: getConsoleFn("profileEnd"),  
        count: getConsoleFn("count"),  
        clear: getConsoleFn("clear"),  
        time: getConsoleFn("time"),  
        timeEnd: getConsoleFn("timeEnd"),  
        timeStamp: getConsoleFn("timeStamp"),  
        table: getConsoleFn("table"),  
        error: getConsoleFn("error"),  
        memory: getConsoleFn("memory"),  
        markTimeline: getConsoleFn("markTimeline"),  
        timeline: getConsoleFn("timeline"),  
        timelineEnd: getConsoleFn("timelineEnd")  
    };  
    function getConsoleFn(name) {  
        return function actionConsole() {  
            if (typeof (orgConsole) !== "object") return;  
            if (typeof (orgConsole[name]) !== "function") return;//判断原始console对象中是否含有此方法，若没有则直接返回  
            return orgConsole[name].apply(orgConsole, Array.prototype.slice.call(arguments));//调用原始函数  
        };  
    }  
}(window._console));


/**
 * tableObject 报表对象
 * lng1 定义的经度字段，需要和报表中的name相对应，没有则填null
 * lat1 定义的纬度字段，需要和报表中的name相对应，没有则填null
 * position1 定义的地理位置字段，需要和报表中的name相对应，没有则填null
 * lng2 定义的经度字段，需要和报表中的name相对应，没有则填null
 * lat2 定义的纬度字段，需要和报表中的name相对应，没有则填null
 * position2 定义的地理位置字段，需要和报表中的name相对应，没有则填null
 * toMap 地图类型
 */
var analysisLocationObject = (function(tableObject, lng1, lat1, position1, lng2, lat2, position2, toMap) {
	//lng 经度  lat 纬度  position地理位置
	function getValidLnglat_(lng, lat, position) {
		if(position != null && lng != null && lat != null) {
			var latlng = gpsGetPositionEx(lng, lat, 1);
			if(latlng != '0,0' && latlng == position) {
				return latlng;
			}
		}
		return "";
	}
	
	//解析地理位置
	function analysisLocation() {
		var data = $(tableObject).flexGetData(); //获取查询的数据
		if(data && data.rows && data.rows.length > 0) {
			var infoList = data.rows;
			//取待解析的经纬度信息
			var latlngs = [];
			for (var i = 0; i < infoList.length; i++) {
				var info = infoList[i];
				var latlng1 = getValidLnglat_(info[lng1], info[lat1], info[position1]);
				if(latlng1 != '' && !latlngs.in_array(latlng1)) {
					latlngs.push(latlng1);
				}
				var latlng2 = getValidLnglat_(info[lng2], info[lat2], info[position2]);
				if(latlng2 != '' && !latlngs.in_array(latlng2)) {
					latlngs.push(latlng2);
				}
			}
			if(latlngs.length > 0) {
				//到后台进行解析
				$.myajax.jsonGet('StandardReportAlarmAction_analysisLocation.action?latlng='+ latlngs.join(';') +'&toMap='+ toMap, function(json,action,success){
					if(success) {
						updateTableLocation(json.mapLocation);
					};
				}, null);
			}
		}
	}
	
	//将解析的地理位置更新到报表
	function updateTableLocation(mapLocation) {
		if(mapLocation) {
			//循环界面div
			$('tr', tableObject).each(function() {
				if(position1 != null) {
					var latlng = $.trim($('.'+ position1 +' a', this).html());
					if(latlng != '' && mapLocation[latlng] != null) {
						$('.'+ position1 +' a', this).html(mapLocation[latlng]);
					}
				}
				if(position2 != null) {
					var latlng = $.trim($('.'+ position2 +' a', this).html());
					if(latlng != '' && mapLocation[latlng] != null) {
						$('.'+ position2 +' a', this).html(mapLocation[latlng])
					}
				}
			});
		}
	}
	
	//执行解析
	new analysisLocation();
});


//车牌类型
function getPlateTypes() {
	var plateTypes = [];
	plateTypes.push({id:1,name: parent.lang.blue_label});
	plateTypes.push({id:2,name: parent.lang.yellow_label});
	plateTypes.push({id:3,name: parent.lang.black_label});
	plateTypes.push({id:4,name: parent.lang.white_label});
	plateTypes.push({id:5,name: parent.lang.green});
	plateTypes.push({id:6,name: parent.lang.yellowGreen});
	plateTypes.push({id:8,name: parent.lang.agriculturalYellow});
	plateTypes.push({id:9,name: parent.lang.other});
	return plateTypes;
}

//获取颜色

function getPlate(plateTypes){
	var  plates  = getPlateTypes();
	var platesArry = [1,2,3,4,5,6,8,9];
	var plateColer = '';
	if(platesArry.in_array(plateTypes)){
		switch (parseIntDecimal(plateTypes)) {
		case 1:
			plateColer = parent.lang.blue_label;
			break;
		case 2:
			plateColer = parent.lang.yellow_label;
			break;
		case 3:
			plateColer = parent.lang.black_label;
			break;
		case 4:
			plateColer = parent.lang.white_label;
			break;
		case 5:
			plateColer = parent.lang.green;
			break;
		case 6:
			plateColer = parent.lang.yellowGreen;
			break;
		case 8:
			plateColer = parent.lang.agriculturalYellow;
			break;
		case 9:
			plateColer = parent.lang.other;
			break;
		default:
			break;
		}
	}else{
		plateColer = parent.lang.other;
	}
	return plateColer;
}


