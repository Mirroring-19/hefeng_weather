function getAjax(httpUrl, callbackFn) {
	//1.创建shr对象
	var xhr = new XMLHttpRequest()
	//2.设置请求的路径和方法,"GET","POST"
	//"GET",表单提交的数据会拼接到请求的路径里
	//"POST",会将表单的数据放置到请求的body里，post请求的数据比较大，安全
	xhr.open("GET", httpUrl)
	//3.发送数据
	xhr.send()
	//4.监听后台是否返回数据
	xhr.onreadystatechange = function() {
		if (xhr.status == 200 && xhr.readyState == 4)
			// console.log('Susses Get Data')
			// console.log(xhr)
			// console.log(xhr.status)
			// console.log(xhr.readyState)
			// //5处理数据
			callbackFn(xhr)
	}
}
