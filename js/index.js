// 展开侧边栏
function slide() {
	nav = document.querySelector('.navPage')
	nav.className = ("navPage active")
}
// 缩回侧边栏
function slideBack() {
	nav = document.querySelector('.navPage.active')
	nav.className = ("navPage")
}

//初始化
function renderUI() {
	let city = document.querySelector('.topNav #positon span').innerHTML
	adm = null;
	getData(city, adm)
}
//查询
function searchCity(city, adm) {
	getData(city, adm)
	slideBack()
	document.querySelector('.topNav #positon span').innerHTML = city
	document.querySelector('.navPage .content1 .nowPos span').innerHTML = city
}



//根据天气变换背景图
function changeBGImg(weather){
	let bgUrl = "url("+bgimg[''+weather+'']+")"
	let bgColor = bgcolor[''+weather+'']
	let body = document.querySelector('body')
	console.log(bgUrl,bgColor)
	body.style.background = bgUrl + "no-repeat"
	body.style.backgroundSize = "100% auto"
	body.style.backgroundColor = bgColor
}

//动态Ajax搜索城市
let search = document.querySelector(".navPage #searchInput")
var flag = true;
//防止中文输入法多次查询
search.addEventListener("compositionstart", function() {
	flag = false;
	console.log('输入开始')
})
search.addEventListener("compositionend", function() {
	flag = true;
	console.log('输入结束')
})

// 监听展开菜单中input的值变化实现动态查询
search.addEventListener("input", function(e) {
	setTimeout(function() {
		if (flag) {
			// debugger
			let searchCityList = document.querySelector('.content2 #searcityList ul')
			let content1 = document.querySelector('.navPage .content1')
			let content2 = document.querySelector('.navPage .content2')


			let city = search.value

			if (city != "") {
				content1.setAttribute("hidden", "hidden")
				content2.removeAttribute("hidden")
			} else {
				content2.setAttribute("hidden", "hidden")
				content1.removeAttribute("hidden")
			}

			let httpUrlCity = "https://geoapi.heweather.net/v2/city/lookup?location=" + city +
				"&key=98788a6050f24be1b4226f2fa11ae746&range=cn"

			getAjax(httpUrlCity, function(res) {
				console.log('开始查询')
				resJSON = JSON.parse(res.response)
				let cities = resJSON.location;
				
				
				searchCityList.innerHTML = ""

				if (cities != null) {
					cities.forEach(function(item, i) {
						let searchCityItem = document.createElement('li')
						searchCityItem.innerHTML = item.name + "——" + item.adm2 + "——" + item.adm1
						searchCityItem.setAttribute("onclick", 'searchCity(' + '"' + item.name + '","' + item.adm1 + '")')
						searchCityList.appendChild(searchCityItem)
					})
				} else {
					let searchCityItem = document.createElement('li')
					searchCityItem.innerHTML = "对不起，未找到该城市"
					searchCityList.appendChild(searchCityItem)
				}
			})
		}
	}, 0);
})


var time = 0;
//右上角刷新
let refresh = document.querySelector('.topNav #updateTime')
refresh.addEventListener("click", function() {
	// renderUI()
	// time = 0;
	// clearInterval(lastRefresh)
	// lastRefresh;
	window.location.reload()
})

var lastRefresh = setInterval(function() {
	let refreshTime = document.querySelector('.topNav #updateTime span')
	if (time < 1) {
		refreshTime.innerHTML = '刚刚更新'
	} else {
		refreshTime.innerHTML = '更新时间 ' + time + '分前'
	}
	time += 1
}, 60000)

//根据日期获得星期
 function getWeek(dateString) {
        var dateArray = dateString.split("-");
        date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
        return "周" + "日一二三四五六".charAt(date.getDay());
 };
 renderUI()