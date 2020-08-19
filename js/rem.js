rem()

//rem布局
function rem(){
	var screenWidth = window.innerWidth;
	var html = document.querySelector("html")
	if(screenWidth<640){
		//rem布局
		var danwei = screenWidth/3.75//屏幕的宽度/设计稿占满全屏的宽度为多少rem
		html.style.fontSize = danwei + 'px';
		// console.log(danwei)
	}else{
		html.style.fontSize = 14 + 'px';
	}
}