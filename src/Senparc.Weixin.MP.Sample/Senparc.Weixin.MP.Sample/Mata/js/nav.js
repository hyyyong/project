var navs = [{
	"title" : "后台首页",
	"icon" : "icon-computer",
	"href" : "page/main.html",
	"spread" : false
},{
	"title" : "监控中心",
	"icon" : "icon-text",
	"href": "page/monitor/MonitorCenter.html",
	"spread" : false
}
, {
    "title": "轨迹回放",
    "icon": "icon-text",
    "href": "page/trajectory/trajectory.html",
    "spread": false
},{
    "title": "数据统计",
	"icon" : "&#xe61c;",
	"href" : "",
	"spread" : false,
	"children" : [
		{
		    "title": "服务到期",
			"icon" : "&#xe631;",
			"href": "page/user/test.html",
			"spread" : false
		},
		{
		    "title": "报警报表",
			"icon" : "&#xe631;",
			"href" : "",
			"spread" : false
		},
		{
		    "title": "离线查询",
		    "icon": "&#xe631;",
		    "href": "",
		    "spread": false
		}
	]
}, {
    "title": "后台管理",
    "icon": "&#xe61c;",
    "href": "",
    "spread": false,
    "children": [
		{
		    "title": "客户管理",
		    "icon": "&#xe631;",
		    "href": "page/baseInfo/userInfo.html",
		    "spread": false
		},
		{
		    "title": "设备管理",
		    "icon": "&#xe631;",
		    "href": "page/baseInfo/vehicleInfo.html",
		    "spread": false
		},
		{
		    "title": "批量加车",
		    "icon": "&#xe631;",
		    "href": "page/baseInfo/batch.html",
		    "spread": false
		}
    ]
}]