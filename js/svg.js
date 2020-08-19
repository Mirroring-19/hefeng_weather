function getData() {
	var city = "沈阳"
	var adm = "沈阳"
	var httpUrlCity = "https://geoapi.heweather.net/v2/city/lookup?location=" + city +
		"&key=98788a6050f24be1b4226f2fa11ae746&adm=" + adm

	getAjax(httpUrlCity, function(res) {
		resJSON = JSON.parse(res.response)
		// console.log(resJSON)
		cityID = resJSON.location[0].id

		var d7 = "https://devapi.heweather.net/v7/weather/7d?location=" + cityID +
			"&key=98788a6050f24be1b4226f2fa11ae746"
			
		getAjax(d7, function(res) {
			let resJSON = JSON.parse(res.response)
			
			//遍历找到七天最高温和最低温的温差
			let daily = resJSON.daily;
			console.log(daily)
			
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
			
			for(i=0;i<7;i++){
				let topY =  Math.abs(daily[i].tempMax-maxHighTemp) * topYUnit;
				let bottomY =  -Math.abs(daily[i].tempMin-minLowTemp) * topYUnit;
				let x = i*xUnit
				topContent.innerHTML+=`
					<circle id="mycircle" cx="`+(x+26)+`" cy="`+(topY+30)+`" r="3" fill="orange"></circle>
					<text x="`+(x+17)+`" y="`+(topY+21)+`">`+daily[i].tempMax+`</text>
				`
				topCircleArrX.push(x+26)
				topCircleArrY.push(topY+30)
				
				bottomContent.innerHTML+=`
					<circle id="mycircle" cx="`+(x+26)+`" cy="`+(bottomY+100)+`" r="3" fill="orange"></circle>
					<text x="`+(x+17)+`" y="`+(bottomY+120)+`">`+daily[i].tempMin+`</text>
				`
				bottomCircleArrX.push(x+26);
				bottomCircleArrY.push(bottomY+100);
			}
			
			topContent.innerHTML += ` 
				<path fill="none" stroke="black" stroke-width="2px";
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
				<path fill="none" stroke="black" stroke-width="2px";
				 d="M `+bottomCircleArrX[0]+`,`+bottomCircleArrY[0]+`
				 L `+bottomCircleArrX[1]+`,`+bottomCircleArrY[1]+` 
				 L `+bottomCircleArrX[2]+`,`+bottomCircleArrY[2]+` 
				 L `+bottomCircleArrX[3]+`,`+bottomCircleArrY[3]+` 
				 L `+bottomCircleArrX[4]+`,`+bottomCircleArrY[4]+` 
				 L `+bottomCircleArrX[5]+`,`+bottomCircleArrY[5]+` 
				 L `+bottomCircleArrX[6]+`,`+bottomCircleArrY[6]+` 		
				 "></path>
			`
	
			
		})
	})
}
getData()

//svg测试用方法