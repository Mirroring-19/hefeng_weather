function getData(city,adm) {
	// var city = document.querySelector('#city').value
	if(adm==null){
		adm="福建"
	}
	
	var httpUrlCity = "https://geoapi.heweather.net/v2/city/lookup?location=" + city +
		"&key=98788a6050f24be1b4226f2fa11ae746&adm="+adm
	
	
	//Ajax根据城市名获取城市ID
	getAjax(httpUrlCity, function(res) {
		resJSON = JSON.parse(res.response)
		cityID = resJSON.location[0].id
		let lat = resJSON.location[0].lat
		let lon = resJSON.location[0].lon
		
		//当前天气API
		var httpUrlWeatherNow = "https://devapi.heweather.net/v7/weather/now?location=" + cityID +
			"&key=98788a6050f24be1b4226f2fa11ae746"
		//当前空气质量API
		var httpUrlAirNow = "https://devapi.heweather.net/v7/air/now?location=" + cityID + 
			"&key=98788a6050f24be1b4226f2fa11ae746"
		//当前分钟级降水API（该API目前无法获得数据，返回403）
		var httpUrlMinutely5m = "https://devapi.heweather.net/v7/minutely/5m?location=" + lon+","+lat + 
			"&key=98788a6050f24be1b4226f2fa11ae746"
		//获取24小时天气API
		var h24 = "https://devapi.heweather.net/v7/weather/24h?location=" + cityID +
			"&key=98788a6050f24be1b4226f2fa11ae746"
		//获取预警信息API
		var alarm = "https://devapi.heweather.net/v7/warning/now?location=" + cityID +
			"&key=98788a6050f24be1b4226f2fa11ae746"
		//获取生活指数
		var lp = "https://devapi.heweather.net/v7/indices/1d?location=" + cityID +
			"&type=0&key=98788a6050f24be1b4226f2fa11ae746"
		//获取七天气温
		var d7 = "https://devapi.heweather.net/v7/weather/7d?location=" + cityID +
			"&key=98788a6050f24be1b4226f2fa11ae746"
		//Ajax根据城市ID获取现在天气数据
		getAjax(httpUrlWeatherNow, function(res) {
			let resJSON = JSON.parse(res.response)
			let data = resJSON.now;
			
			//变更背景
			changeBGImg(data.text)
			
			//获取温度信息并展示
			let tempData = document.querySelector('#mainContent #temp span')
			tempData.innerHTML = data.temp+"°";
			
			//获取描述信息并展示
			let textData = document.querySelector('#mainContent #text span')
			textData.innerHTML = data.text;
			let textContent =  data.text;
			//获取描述信息对应的图标
			let textIcon = document.querySelector('#mainContent #text svg')
			//获取目前时间应该用哪种icon
			let nowTime = resJSON.updateTime.slice(11,13);
			if(nowTime>5&&nowTime<19){
				var icon = dayIcon;
			}else{
				var icon = nightIcon
			}
			textIcon.innerHTML = ``;
			textIcon.innerHTML += `
			<use xlink:href="#`+icon[''+textContent+'']+`"></use>
			`
			
			// newIcon.setAttribute("xlink:href","#"+svgIcon[''+textContent+''])
			// textIcon.appendChild(newIcon)
			
			//获取实况降水量并展示
			let precipData = document.querySelector('#baseinfo #precip .content')
			precipData.innerHTML = data.precip+"mm"
			
			//获取实况湿度并展示
			let humidityData = document.querySelector('#baseinfo #humidity .content')
			humidityData.innerHTML = data.humidity+"%"
			
			//获取实况风向并展示
			let windDirData = document.querySelector('#baseinfo #wind .title')
			windDirData.innerHTML = data.windDir
			
			//获取实况风力等级并展示
			let windScaleData = document.querySelector('#baseinfo #wind .content')
			windScaleData.innerHTML = data.windScale+"级"
			
			//获取实况大气压强并展示
			let pressureData = document.querySelector('#baseinfo #pressure .content')
			pressureData.innerHTML = data.pressure+"hpa"
			

		})
		
		//Ajax根据城市ID获取现在空气质量数据
		getAjax(httpUrlAirNow, function(res) {
			let resJSON = JSON.parse(res.response)
			let data = resJSON.now;
			
			//获取实时空气质量指数级别并展示
			let categoryData = document.querySelector('#mainContent #aqi .category')
			categoryData.innerHTML = data.category;
			
			//获取实时空气质量指数并展示
			let aqiData = document.querySelector('#mainContent #aqi .aqi')
			aqiData.innerHTML = data.aqi;
		})
		
		//Ajax根据城市ID获取分钟级降水信息
		getAjax(httpUrlMinutely5m, function(res) {
			let resJSON = JSON.parse(res.response)
			let data = resJSON;
			// console.log(data)
			//获取分钟降水描述并展示
			// let summaryData = document.querySelector('#alarmlist #summary .summary')
			// summaryData.innerHTML = data.summary;
			
		})
		
		//Ajax根据城市ID获取每小时天气并展示最近八小时
		getAjax(h24, function(res) {
			let resJSON = JSON.parse(res.response)
			let data = resJSON;
			let content = document.querySelector("#hour .content")
			content.innerHTML = ""
			for(i=0;i<8;i++){
				index = i+1 ;
				let hourTime = document.querySelector("#hour .item:nth-child("+index+") #hourtime")
				let hourTemp = document.querySelector("#hour .item:nth-child("+index+") #temp")
				
				let textContent = data.hourly[i].text
				
				let nowTime = data.hourly[i].fxTime.slice(11,13)
				
				if(nowTime>5&&nowTime<19){
					var icon = dayIcon;
				}else{
					var icon = nightIcon
				}
				
				content.innerHTML+=
				`<div class="item">
					<div id="hourtime">
					`+data.hourly[i].fxTime.slice(11,13)+`
					</div>
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#`+icon[''+textContent+'']+`"></use>
					</svg>
					<div id="temp">
					`+data.hourly[i].temp+`
					</div>
				</div>`
			}
		})
		
		//Ajax根据城市ID获取预警信息并遍历展示
		getAjax(alarm, function(res) {
			let resJSON = JSON.parse(res.response)
			let data = resJSON;
			let warning = resJSON.warning;
			
			let alarmItem = document.querySelector("#alarmlist ul")
			alarmItem.innerHTML=`
			<li id="summary">
				<svg class="icon" aria-hidden="true">
					<use xlink:href="#icon-ditu"></use>
				</svg>
				<span class="summary">未来两小时无降水</span>
				<img src="img/aqi-right.png">
			</li>
			`
		
			warning.forEach(function(item,i){
				alarmItem.innerHTML+=`
					<li class=alarmItem>
					<svg class="icon" aria-hidden="true">
						<use xlink:href="#`+warningIcon[''+warning[i].level+'']+`"></use>
					</svg>
					<span class="alarm">`+warning[i].typeName+`</span>
					<img src="img/aqi-right.png">
				</li>
				`
			})
		})
		
		getAjax(lp,function(res){
			let resJSON = JSON.parse(res.response)
			let data = resJSON;

			let lpDaily = resJSON.daily;
			let lpArray = [1,2,3,5,6,8,13,14] //选择需要的生活指数item
			let new_lpDaily = [];	//建立新数组
					
			lpDaily.forEach(function(item,i){
				if(lpArray.indexOf(i)!=-1){
					new_lpDaily.push(item);	//往新数组中添加需要的生活指数item
				}
			})
			
			//清空三个tr的数据
			for(i=1;i<=3;i++){
				let tr = document.querySelector("#life-point .content table tr:nth-child("+i+")")
				tr.innerHTML=""
			}
			
			//遍历展示需要的生活指数item
			new_lpDaily.forEach(function(item,i){
				let trNum = parseInt((i/3)+1)
				let tr = document.querySelector("#life-point .content table tr:nth-child("+trNum+")")
				tr.innerHTML+=`<td><div>`+item.name+`</div><div>`+item.category+` <img src="img/aqi-right.png"></div></td>`
			})
			
			document.querySelector("#life-point .content table tr:nth-child(3)").innerHTML+=`<td><div>更多指数</div><div><img src="img/aqi-right.png"></div></td>`
		})
		
		getAjax(d7, function(res) {
			let resJSON = JSON.parse(res.response)
			
			//遍历找到七天最高温和最低温的温差
			let daily = resJSON.daily;
			
			let maxTempArr = []
			let minTempArr = []
			
			// 获取七天最高,最低温数组
			daily.forEach(function(item,i){
				maxTempArr.push(item.tempMax)
				minTempArr.push(item.tempMin)
			})
			
			//最高最高气温
			let maxHighTemp = Math.max.apply(null,maxTempArr)
			//最低最高气温
			let minHighTemp = Math.min.apply(null,maxTempArr)
			//最高最低气温
			let maxLowTemp = Math.max.apply(null,minTempArr)
			//最低最地气温
			let minLowTemp = Math.min.apply(null,minTempArr)
			
			//最高温气温差值
			let maxDValue = maxHighTemp-minHighTemp
			//最低温气温差值
			let minDvalue = maxLowTemp-minLowTemp
			
			let topYUnit = 26/maxDValue;
			let bottomYUnit = 26/minDvalue
			
			let xUnit  = 323/6
		
			let topContent = document.querySelector('svg #top')
			let bottomContent = document.querySelector('svg #bottom')
			
			let topCircleArrX = []
			let topCircleArrY = []
			
			let bottomCircleArrX = []
			let bottomCircleArrY = []
			
			
		
			topContent.innerHTML =""
			bottomContent.innerHTML =""
			
			for(i=0;i<7;i++){
				let topY =  Math.abs(daily[i].tempMax-maxHighTemp) * topYUnit;
				let bottomY =  -Math.abs(daily[i].tempMin-minLowTemp) * bottomYUnit;
				let x = i*xUnit
				
				topCircleArrX.push(x+26)
				topCircleArrY.push(topY+30)
				
				
				bottomCircleArrX.push(x+26);
				bottomCircleArrY.push(bottomY+100);
			}

			topContent.innerHTML += ` 
				<path fill="none" stroke="white" stroke-width="1px";
				 d="M `+topCircleArrX[0]+`,`+topCircleArrY[0]+`
				 L `+topCircleArrX[1]+`,`+topCircleArrY[1]+` 
				 L `+topCircleArrX[2]+`,`+topCircleArrY[2]+` 
				 L `+topCircleArrX[3]+`,`+topCircleArrY[3]+` 
				 L `+topCircleArrX[4]+`,`+topCircleArrY[4]+` 
				 L `+topCircleArrX[5]+`,`+topCircleArrY[5]+` 
				 L `+topCircleArrX[6]+`,`+topCircleArrY[6]+` 		
				 "></path>
			`
			bottomContent.innerHTML += `
				<path fill="none" stroke="white" stroke-width="1px";
				 d="M `+bottomCircleArrX[0]+`,`+bottomCircleArrY[0]+`
				 L `+bottomCircleArrX[1]+`,`+bottomCircleArrY[1]+` 
				 L `+bottomCircleArrX[2]+`,`+bottomCircleArrY[2]+` 
				 L `+bottomCircleArrX[3]+`,`+bottomCircleArrY[3]+` 
				 L `+bottomCircleArrX[4]+`,`+bottomCircleArrY[4]+` 
				 L `+bottomCircleArrX[5]+`,`+bottomCircleArrY[5]+` 
				 L `+bottomCircleArrX[6]+`,`+bottomCircleArrY[6]+` 		
				 "></path>
			`
			
			for(i=0;i<7;i++){
				topContent.innerHTML+=`
					<circle id="mycircle" cx="`+topCircleArrX[i]+`" cy="`+topCircleArrY[i]+`" r="2" fill="white"></circle>
					<text x="`+(topCircleArrX[i]-9)+`" y="`+(topCircleArrY[i]-9)+`"  style="font-size: 12px;">`+daily[i].tempMax+`°</text>
				`
				bottomContent.innerHTML+=`
					<circle id="mycircle" cx="`+bottomCircleArrX[i]+`" cy="`+bottomCircleArrY[i]+`" r="2" fill="white"></circle>
					<text x="`+(bottomCircleArrX[i]-9)+`" y="`+(bottomCircleArrY[i]+20)+`"  style="font-size: 12px;">`+daily[i].tempMin+`°</text>
				`
			}
			
	
			
			
			let SDContent = document.querySelector("#senven-day .content")
			SDContent.innerHTML=""
			//渲染日期
			daily.forEach(function(item,i){
				let date = item.fxDate.slice(5,10)
				date = date.replace("-","/")
				week = getWeek(item.fxDate)
				SDContent.innerHTML+=`
				<div class="contentItem">
					<div class="date">`+date+`</div>
					<div class="week">`+week+`</div>
					<div class="dayIcon">
						<svg class="icon" aria-hidden="true">
							<use xlink:href="#`+dayIcon[''+item.textDay+'']+`"></use>
						</svg>
					</div>
					<div class="nightIcon">
						<svg class="icon" aria-hidden="true">
							<use xlink:href="#`+nightIcon[''+item.textNight+'']+`"></use>
						</svg>
					</div>
					<div class="dir">`+item.windDirNight+`</div>
					<div class="lvl">`+item.windScaleNight+`级</div>
				</div>
				`
			})
		})
		
	})
}
