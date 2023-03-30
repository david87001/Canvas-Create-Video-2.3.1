/*
	1.0.0：canvas畫圖和輸出
	2.2.0：突然想到要寫，算了好懶，前面的就跳過吧。反正這版新功能是自動上文字
	2.3.0：讓輸出可以不用重整網頁
			新增鍵盤事件
			新增時間軸跳轉功能
			新增字形選擇功能
			新增存檔輸出功能
			新增英文半形處理
			取消AudioContext
			學會使用duration
			修正輸出過快導致的影片卡頓情況
	2.3.1：修正2.3.0的輸出錯誤
*/

//用requestAnimationFrame方法來連續繪製video影像到canvas上
//這裡先建立全域方法reqAnimation, 並指向當前裝置的requestAnimationFrame方法 
window.reqAnimation = window.requestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| window.msRequestAnimationFrame
	|| window.mozRequestAnimationFrame



//音檔
var ccvAudio = document.getElementById("ccvVideo");
var ccvAudio_2 = document.getElementById("ccvVideo_2");
var audioCtx;
var analyser;
var bufferLength;
var dataArray;
var ccvAnimation_Output_Frame = 0;
var AudioContext_bool = false;



//影片
var ccvVideo;
var ccvVideo_2;
var ccvVideoFrame = 23.976;
var isOutput = false;

var ccvCanvas_1 = document.getElementById("ccvCanvas_1");
var ccvPan_1 = ccvCanvas_1.getContext('2d');

var ccvCanvas_2 = document.getElementById("ccvCanvas_2");
var ccvPan_2 = ccvCanvas_2.getContext('2d');

var ccvCanvas_timeline = document.getElementById("ccvCanvas_timeline");
var ccvPan_timeline = ccvCanvas_timeline.getContext('2d');

var ccvCanvas_Mask = document.getElementById("ccvCanvas_Mask");
var ccvPan_Mask = ccvCanvas_Mask.getContext('2d');


//文件
function ccvText_write(){
	document.getElementById("ccvVideo_text").innerHTML = ccvSubtitle_Array;
}



//鍵盤事件
var body = document.body;
function goRocket(e) {
	console.log(e.keyCode);//查鍵盤代碼
	switch (e.keyCode) {
		case 80://P
			if (ccvVideo.paused || ccvVideo.ended){
				ccvVideo_Play();
			}else{
				ccvVideo_Pause();
			}
			break;
		case 32://P
			if (ccvVideo.paused || ccvVideo.ended) {
				ccvVideo_Play();
			} else {
				ccvVideo_Pause();
			}
			break;
		case 77://M
			ccvTable_Subtitle_add();
			break;
		case 82://R
			ccvVideo_Return();
			break;
		case 90:
			ccvVideo_Refresh();
			break;
		case 37:
			ccvVideo_changeTime(ccvVideo.currentTime - 1);
			break;
		case 39:
			ccvVideo_changeTime(ccvVideo.currentTime + 1);
			break;
	}
}
body.addEventListener('keydown', goRocket, false) //偵測按下按鍵的行為


//滑鼠事件
var isChaning = false; // 用來判斷是否正在畫圖
ccvCanvas_timeline.addEventListener("mousedown", () => (isChaning = true));
ccvCanvas_timeline.addEventListener("mousedown", changeTime);
ccvCanvas_timeline.addEventListener("mouseup", () => (isChaning = false));
ccvCanvas_timeline.addEventListener("mouseout", () => (isChaning = false));
ccvCanvas_timeline.addEventListener("mousemove", changeTime);
function changeTime(e) {
	if (!isChaning) return; //如果不是在mousedown的時候，這個function不作用
	ccvVideo_changeTime(((e.offsetX / ccvCanvas_timeline.width) * document.getElementById("ccvVideo").duration).toFixed(6));
	//console.log([e.offsetX, e.offsetY]);
}


//其他
var ccvFont = "Microsoft JhengHei";


//function
var videoDuration;
function ccvLodeVideo(input) {
	ccvVideo = input.files[0];
	document.getElementById("ccvVideo").src = URL.createObjectURL(ccvVideo);
	document.getElementById("ccvVideo_2").src = URL.createObjectURL(ccvVideo);
	ccvVideo = document.getElementById("ccvVideo");
	ccvVideo_2 = document.getElementById("ccvVideo_2");
	document.getElementById("ccvCanvas_1").width = ccvVideo.width;
	document.getElementById("ccvCanvas_1").height = ccvVideo.height;
}
function ccvVideo_Play() {
	console.log("duration:" + document.getElementById("ccvVideo").duration);
	if (AudioContext_bool == false){
		AudioContext_Ready();//chrome 的惡意
		AudioContext_bool = true;
	}
	ccvVideo.play();
	ccvVideo_2.play();
	ccvAnimation();
}
function ccvVideo_Pause() {
	ccvClearArray();//不知道是不是真的需要放這個
	ccvVideo.pause();
	ccvVideo_2.pause();
}
function ccvVideo_Return() {
	ccvClearArray();//不知道是不是真的需要放這個
	ccvVideo.currentTime = 0;
	ccvVideo_2.currentTime = 0;
	ccvVideo_Pause();
	ccvAnimation();
}
function ccvVideo_changeTime(time) {
	ccvClearArray();//不知道是不是真的需要放這個
	ccvVideo.currentTime = time;
	ccvVideo_2.currentTime = time;
	ccvAnimation();
}
function ccvClearArray() {
	ccvAudio_VideoTimeArray_Save = [];
	ccvAudio_heightArray_SaveAsArray = [];
}

//download
function ccvVideo_Go() {
	//window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
	builder.finish(function (generatedURL) {
		let a = document.createElement("a");
		document.body.appendChild(a);
		a.style.display = 'none';
		a.href = generatedURL;
		a.download = 'Doritos Video Made_by_Canvas.avi';
		a.click();
	});
	alert(`輸出完成，耗時${Math.floor(Number(Date.parse(Date()) - Date.parse(start)) / 60000)}分${(Number(Date.parse(Date()) - Date.parse(start)) / 1000) % 60}秒`);
	return
}

//預備變數
var ccvAudio_VideoTimeArray_Save = []

var ccvAudio_heightArray_Save = []
var ccvAudio_heightArray_SaveAsArray = []

var ccvimageData;
var ccvCanvas_1_Buffer;


var builder = new VideoBuilder({
	width: 1280,
	height: 720,
	fps: ccvVideoFrame
});
var start = null;

var Doritos_nameFrame = 0;
var Doritos_nameFrame_Array = [[0, 2, "字幕 by 玉米片精靈"], [0, 2, ""]];
var ccvAnimation_Frame = 0

//主要動畫程式
function ccvAnimation() {
	if (isOutput == true){
		return;
	}
	ccvPan_1.clearRect(0, 0, ccvCanvas_1.width, ccvCanvas_1.height);
	document.getElementById("ccvVideo_time").innerHTML = formatSecond(ccvVideo.currentTime) + "/" + formatSecond(document.getElementById("ccvVideo").duration);
	//設影片為底
	ccvPan_1.globalAlpha = 1;
	analyser.getByteTimeDomainData(dataArray);
	ccvPan_1.drawImage(ccvVideo, 0, 0, ccvVideo.width, ccvVideo.height);
	//開始畫畫
	/*
	ccvVideo.currentTime ： 影片時間
	bufferLength ： 聲域的長度
	dataArray ： 聲音量值
	*/


	ccvAnimation_Frame = Math.floor(ccvVideo.currentTime * ccvVideoFrame);

	ccvAnimation_getFrame(ccvAnimation_Frame);
	ccvAnimation_subtitleToCanvas(ccvSubtitle_Array, ccvAnimation_Frame);
	ccvAnimation_timeline_change(ccvVideo.currentTime);
	///////////以下測試///////////
	///////////以上測試///////////

	
	reqAnimation(ccvAnimation);
}

function ccvAnimation_timeline_change(time){
	ccvPan_timeline.fillStyle = "#d9d9d9";
	ccvPan_timeline.fillRect(0, 0, ccvCanvas_timeline.width, ccvCanvas_timeline.height);
	ccvPan_timeline.fillStyle = "#32b80b";
	ccvPan_timeline.fillRect(0, 0, time / document.getElementById("ccvVideo").duration * ccvCanvas_timeline.width, ccvCanvas_1.height);
}

var ccvVideo_Output_Count = 0;

function ccvVideo_Output_Button() {
	//重設builder
	builder = new VideoBuilder({
		width: 1280,
		height: 720,
		fps: ccvVideoFrame
	});
	
	Doritos_nameFrame_Array[1][0] = Math.floor(document.getElementById("ccvVideo").duration * ccvVideoFrame);


	if (!start) start = Date();
	
	ccvVideo.currentTime = 0;
	ccvVideo_Output_Count = 0;
	ccvAnimation_Output_Frame = 0;
	ccvVideo.pause();
	Doritos_nameFrame_Array[0][0] = Doritos_nameFrame_Array[1][0] - 84;
	Doritos_nameFrame_Array[1][0] = Doritos_nameFrame_Array[1][0] - 12;
	isOutput = true;
	ccvVideo_Output_New();
}

//新增輸出時間調整程式
var ccvVideo_Output_New_Value = 0;
function ccvVideo_Output_New(){
	if (isOutput == false){
		return;
	}
	ccvVideo_Output_New_Value = ccvVideo_Output_New_Value + 1;
	if (ccvVideo_Output_New_Value == 4){
		ccvVideo_Output();
		ccvVideo_Output_New_Value = 0;
	}
	if (ccvVideo.currentTime >= ccvVideo.duration) {
		return;
	}
	reqAnimation(ccvVideo_Output_New);
}


//主要輸出程式
function ccvVideo_Output() {//123


	console.log(ccvVideo.currentTime);
	ccvVideo.currentTime = (ccvAnimation_Output_Frame / ccvVideoFrame).toFixed(6);
	console.log(ccvVideo.currentTime);
	


	//設影片為底
	ccvPan_1.globalAlpha = 1;
	ccvPan_1.drawImage(ccvVideo, 0, 0, ccvVideo.width, ccvVideo.height);


	//顯示進度條
	document.getElementById("ccvVideo_time").innerHTML = formatSecond(ccvVideo.currentTime) + 
	"/" + 
	formatSecond(document.getElementById("ccvVideo").duration) + 
	`${((ccvVideo.currentTime / ccvVideo.duration) * 100).toFixed(2)} %`;

	//開始畫畫
	ccvAnimation_subtitleToCanvas(ccvSubtitle_Array, ccvAnimation_Output_Frame);//上字幕
	///////////以下測試///////////
	
	///////////以上測試///////////
	//畫到第二張canvas上
	ccvAnimation_subtitleToCanvas(Doritos_nameFrame_Array, ccvAnimation_Output_Frame);

	//看輸出的畫格
	//ccvAnimation_getFrame(ccvAnimation_Output_Frame);


	ccvPan_2.drawImage(ccvCanvas_1, 0, 0, ccvCanvas_1.width, ccvCanvas_1.height);
	ccvAnimation_timeline_change(ccvVideo.currentTime);
	builder.addCanvasFrame(ccvCanvas_2);
	console.log("output");
	ccvAnimation_Output_Frame = ccvAnimation_Output_Frame + 1;

	// 如果 video暫停, 或是已經播放完畢則停止繪圖
	if (ccvVideo.currentTime >= ccvVideo.duration) {
		builder.finish(function (generatedURL) {
			let a = document.createElement("a");
			document.body.appendChild(a);
			a.style.display = 'none';
			a.href = generatedURL;
			a.download = 'Doritos Video Made_by_Canvas.mp4';
			a.click();
		});
		isOutput = false;
		alert(`輸出完成，耗時${Math.floor(Number(Date.parse(Date()) - Date.parse(start)) / 60000)}分${(Number(Date.parse(Date()) - Date.parse(start)) / 1000)%60}秒`);
		return
	};

	

	//reqAnimation(ccvVideo_Output);
}


function ccvAnimation_getFrame(ccvAnimation_Output_Frame) {
	//ccvPan_1.globalAlpha = 1;

	ccvPan_1.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
	ccvPan_1.font = "normal bold 100px " + ccvFont;
	ccvPan_1.textBaseline = "top";
	ccvPan_1.strokeStyle = `${document.getElementById("ccvColor_0").value}`;
	ccvPan_1.lineWidth = 20; //define the width of the stroke line 
	ccvPan_1.strokeText(`${ccvAnimation_Output_Frame}`, 20, 20);
	ccvPan_1.closePath();


	ccvPan_1.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
	ccvPan_1.font = "normal bold 100px " + ccvFont;
	ccvPan_1.textBaseline = "top";
	ccvPan_1.strokeStyle = `${document.getElementById("ccvColor_1").value}`;
	ccvPan_1.lineWidth = 10; //define the width of the stroke line 
	ccvPan_1.strokeText(`${ccvAnimation_Output_Frame}`, 20, 20);
	ccvPan_1.closePath();

	ccvPan_1.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
	ccvPan_1.font = "normal bold 100px " + ccvFont;
	ccvPan_1.textBaseline = "top";
	ccvPan_1.fillStyle = `${document.getElementById("ccvColor_2").value}`;
	ccvPan_1.fillText(`${ccvAnimation_Output_Frame}`, 20, 20);
	ccvPan_1.closePath();
}

var notKanji = "";
notKanji = notKanji + "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";
notKanji = notKanji + "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
notKanji = notKanji + "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ";
notKanji = notKanji + "ぁぃぅぇぉ" + "ゃゅょ" + "っ";
notKanji = notKanji + "ァィゥェォ" + "ャュョ" + "ッ";
notKanji = notKanji + "がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ";
notKanji = notKanji + "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ";
notKanji = notKanji + "/*-+./.,';:_-｛｝「」，？「」!@#$%^&*{}[]―~～！＠＃＄％、ー…";
notKanji = notKanji + " 　";
notKanji = notKanji.split("");
var notKanji_2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz !".split("");
console.log(notKanji);
function ccvAnimation_subtitle_checkKanji(checkKanji_Bunsho, checkKanji_notKanji) {
	for (checkKanji_i = 0; checkKanji_i < checkKanji_notKanji.length; checkKanji_i++) {
		if (checkKanji_Bunsho == checkKanji_notKanji[checkKanji_i]) {
			return true;
		}
	}
	return false;
}

function ccvAnimation_subtitle_checkText(subtitle_arr) {
	//區分單字是不是——平假片假特殊符號——漢字——左右括號
	let subtitle_sub_Bunsho = "";
	let subtitle_sub_Hiragana = [];
	let ccvAnimation_subtitle_checkText_Flag = 0;
	let Bunsho_count = 0;
	let Kanji_count = 0;
	for (let subtitle_i = 0; subtitle_i < subtitle_arr.length; subtitle_i++) {
		if (subtitle_arr[subtitle_i] == "(") {
			//進入上方平假標音
			ccvAnimation_subtitle_checkText_Flag = 1;
			subtitle_sub_Hiragana.push(["", Bunsho_count, Kanji_count]);
			Kanji_count = 0;
			continue;
		} else if (subtitle_arr[subtitle_i] == ")") {
			//回歸下方文本
			ccvAnimation_subtitle_checkText_Flag = 0;
			continue;
		} else if (ccvAnimation_subtitle_checkKanji(subtitle_arr[subtitle_i], notKanji_2)) {
			Bunsho_count = Bunsho_count + 0.5;//底下文本多了一個字
			subtitle_sub_Bunsho = subtitle_sub_Bunsho + subtitle_arr[subtitle_i];
			continue;
		} else if (ccvAnimation_subtitle_checkText_Flag == 0) {
			//輸入下方文本
			Bunsho_count = Bunsho_count + 1;//底下文本多了一個字
			subtitle_sub_Bunsho = subtitle_sub_Bunsho + subtitle_arr[subtitle_i];
			if (ccvAnimation_subtitle_checkKanji(subtitle_arr[subtitle_i], notKanji)) {
				continue;
				//不是漢字
			} else {
				//是漢字
				Kanji_count = Kanji_count + 1;//底下文本要標音的漢字多了一個
				continue;
			}
		} else if (ccvAnimation_subtitle_checkText_Flag == 1) {
			//輸入上方文本
			subtitle_sub_Hiragana[subtitle_sub_Hiragana.length - 1][0] = subtitle_sub_Hiragana[subtitle_sub_Hiragana.length - 1][0] + subtitle_arr[subtitle_i];
		}
	}
	return [subtitle_sub_Bunsho, subtitle_sub_Hiragana]
}

function ccvAnimation_subtitle(ccvAnimation_subtitleText, ccvAnimation_subtitleFrame_Position) {
	let subtitle_arr = ccvAnimation_subtitleText.split("");
	let [subtitle_sub_Bunsho, subtitle_sub_Hiragana] = ccvAnimation_subtitle_checkText(subtitle_arr);

	if (ccvAnimation_subtitleFrame_Position == 2) {

		ccvPan_Mask.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
		ccvPan_Mask.font = "normal bold 32px " + ccvFont;
		ccvPan_Mask.textBaseline = "top";
		ccvPan_Mask.textAlign = "start";
		ccvPan_Mask.strokeStyle = `${document.getElementById("ccvColor_0").value}`;
		ccvPan_Mask.lineWidth = 20; //define the width of the stroke line 
		ccvPan_Mask.strokeText(`${subtitle_sub_Bunsho}`,
			30,
			658);
		ccvPan_Mask.closePath();


		ccvPan_Mask.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
		ccvPan_Mask.font = "normal bold 32px " + ccvFont;
		ccvPan_Mask.textBaseline = "top";
		ccvPan_Mask.textAlign = "start";
		ccvPan_Mask.strokeStyle = `${document.getElementById("ccvColor_1").value}`;
		ccvPan_Mask.lineWidth = 10; //define the width of the stroke line 
		ccvPan_Mask.strokeText(`${subtitle_sub_Bunsho}`,
			30,
			658);
		ccvPan_Mask.closePath();

		ccvPan_Mask.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
		ccvPan_Mask.font = "normal bold 32px " + ccvFont;
		ccvPan_Mask.textBaseline = "top";
		ccvPan_Mask.textAlign = "start";
		ccvPan_Mask.fillStyle = `${document.getElementById("ccvColor_2").value}`;
		ccvPan_Mask.fillText(`${subtitle_sub_Bunsho}`,
			30,
			658);
		ccvPan_Mask.closePath();
	}
	//console.log(subtitle_sub_Bunsho)
	//console.log(subtitle_sub_Hiragana)
	//以下畫圖

	ccvPan_Mask.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
	ccvPan_Mask.font = "normal bold 64px " + ccvFont;
	ccvPan_Mask.textBaseline = "top";
	ccvPan_Mask.textAlign = "start";
	ccvPan_Mask.strokeStyle = `${document.getElementById("ccvColor_0").value}`;
	ccvPan_Mask.lineWidth = 20; //define the width of the stroke line 
	ccvPan_Mask.strokeText(`${subtitle_sub_Bunsho}`,
		50 + ccvAnimation_subtitleFrame_Position * 30,
		500 + ccvAnimation_subtitleFrame_Position * 126);
	ccvPan_Mask.closePath();


	ccvPan_Mask.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
	ccvPan_Mask.font = "normal bold 64px " + ccvFont;
	ccvPan_Mask.textBaseline = "top";
	ccvPan_Mask.textAlign = "start";
	ccvPan_Mask.strokeStyle = `${document.getElementById("ccvColor_1").value}`;
	ccvPan_Mask.lineWidth = 10; //define the width of the stroke line 
	ccvPan_Mask.strokeText(`${subtitle_sub_Bunsho}`,
		50 + ccvAnimation_subtitleFrame_Position * 30,
		500 + ccvAnimation_subtitleFrame_Position * 126);
	ccvPan_Mask.closePath();

	ccvPan_Mask.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
	ccvPan_Mask.font = "normal bold 64px " + ccvFont;
	ccvPan_Mask.textBaseline = "top";
	ccvPan_Mask.textAlign = "start";
	ccvPan_Mask.fillStyle = `${document.getElementById("ccvColor_2").value}`;
	ccvPan_Mask.fillText(`${subtitle_sub_Bunsho}`,
		50 + ccvAnimation_subtitleFrame_Position * 30,
		500 + ccvAnimation_subtitleFrame_Position * 126);
	ccvPan_Mask.closePath();

	for (let subtitle_Hiragana_i = 0; subtitle_Hiragana_i < subtitle_sub_Hiragana.length; subtitle_Hiragana_i++) {


		ccvPan_Mask.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
		ccvPan_Mask.font = "normal bold 32px " + ccvFont;
		ccvPan_Mask.textBaseline = "top";
		ccvPan_Mask.textAlign = "center";
		ccvPan_Mask.strokeStyle = `${document.getElementById("ccvColor_0").value}`;
		ccvPan_Mask.lineWidth = 20; //define the width of the stroke line 
		ccvPan_Mask.strokeText(`${subtitle_sub_Hiragana[subtitle_Hiragana_i][0]}`,
			((2 * subtitle_sub_Hiragana[subtitle_Hiragana_i][1] - subtitle_sub_Hiragana[subtitle_Hiragana_i][2]) / 2) * 64 + 50 + ccvAnimation_subtitleFrame_Position * 30,
			458 + ccvAnimation_subtitleFrame_Position * 126,
			subtitle_sub_Hiragana[subtitle_Hiragana_i][2] * 64);
		ccvPan_Mask.closePath();


		ccvPan_Mask.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
		ccvPan_Mask.font = "normal bold 32px " + ccvFont;
		ccvPan_Mask.textBaseline = "top";
		ccvPan_Mask.textAlign = "center";
		ccvPan_Mask.strokeStyle = `${document.getElementById("ccvColor_1").value}`;
		ccvPan_Mask.lineWidth = 10; //define the width of the stroke line 
		ccvPan_Mask.strokeText(`${subtitle_sub_Hiragana[subtitle_Hiragana_i][0]}`,
			((2 * subtitle_sub_Hiragana[subtitle_Hiragana_i][1] - subtitle_sub_Hiragana[subtitle_Hiragana_i][2]) / 2) * 64 + 50 + ccvAnimation_subtitleFrame_Position * 30,
			458 + ccvAnimation_subtitleFrame_Position * 126,
			subtitle_sub_Hiragana[subtitle_Hiragana_i][2] * 64);
		ccvPan_Mask.closePath();

		ccvPan_Mask.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
		ccvPan_Mask.font = "normal bold 32px " + ccvFont;
		ccvPan_Mask.textBaseline = "top";
		ccvPan_Mask.textAlign = "center";
		ccvPan_Mask.fillStyle = `${document.getElementById("ccvColor_2").value}`;
		ccvPan_Mask.fillText(`${subtitle_sub_Hiragana[subtitle_Hiragana_i][0]}`,
			((2 * subtitle_sub_Hiragana[subtitle_Hiragana_i][1] - subtitle_sub_Hiragana[subtitle_Hiragana_i][2]) / 2) * 64 + 50 + ccvAnimation_subtitleFrame_Position * 30,
			458 + ccvAnimation_subtitleFrame_Position * 126,
			subtitle_sub_Hiragana[subtitle_Hiragana_i][2] * 64);
		ccvPan_Mask.closePath();
	}
}

var ccvTable_Subtitle = `
<tr>
	<td colspan="2" style="text-align:center;" width="128">
		<button style="font-size: 25px;" onclick="ccvVideo_deleteTable()">刪除</button>
	</td>
	<td colspan="2" style="text-align:center;" width="128">
		<p style="font-size: 30px;">Frame</p>
	</td>
	<td colspan="2" style="text-align:center;" width="128">
		<p style="font-size: 30px;">上下排</p>
	</td>
	<td colspan="2" style="width: 2560px">
		<p style="font-size: 30px;">&ensp;&ensp;文本&ensp;&ensp;
		<button onclick="ccvVideo_Refresh()" style="font-size: 30px;">重新整理(Z)</button>
		<input id="ccvColor_0" type="text" style="font-size: 30px;" value = "#000000">
		<input id="ccvColor_1" type="text" style="font-size: 30px;" value = "#ff00ff">
		<input id="ccvColor_2" type="text" style="font-size: 30px;" value = "#ffffff">
	</td>
</tr>
`;
var ccvTable_Subtitle_addedTable = "";
var ccvAnimation_FrameNumber = 0;

function ccvVideo_deleteTable() {
	for (let deleteTable_i = 0; deleteTable_i < ccvAnimation_FrameNumber; deleteTable_i++) {
		console.log(document.getElementById(`ccvSubtitle_Checkbox_${deleteTable_i}`).checked)
		if (document.getElementById(`ccvSubtitle_Checkbox_${deleteTable_i}`).checked == true) {
			document.getElementById(`ccvSubtitle_Checkbox_${deleteTable_i}`).style = "display:none";
			document.getElementById(`ccvSubtitle_Frame_${deleteTable_i}`).style = "display:none";
			document.getElementById(`ccvSubtitle_Position_${deleteTable_i}`).style = "display:none";
			document.getElementById(`ccvSubtitle_Text_${deleteTable_i}`).style = "display:none";
		}
	}
}

function ccvTable_Subtitle_add() {
	ccvTable_Subtitle_addedTable = `
<tr>
	<td colspan="2" style="text-align:center;">
		<input id="ccvSubtitle_Checkbox_${ccvAnimation_FrameNumber}" type="checkbox" style = "width:30px;height:30px;">
	</td>
	<td colspan="2" style="text-align:center;">
		<p id="ccvSubtitle_Frame_${ccvAnimation_FrameNumber}" style="font-size: 35px;">${ccvAnimation_Frame}</p>
	</td>
	<td colspan="2" style="text-align:center;">
		<p id="ccvSubtitle_Position_${ccvAnimation_FrameNumber}" style="font-size: 35px;">上下排</p>
	</td>
	<td colspan="2" style="text-align:center;">
		<input id="ccvSubtitle_Text_${ccvAnimation_FrameNumber}" type="text" style="font-size: 70px;width: 2560px">
	</td>
</tr>
`;

	document.getElementById("ccvTable").innerHTML = document.getElementById("ccvTable").innerHTML + `
<tr>
	<td colspan="2" style="text-align:center;">
		<input id="ccvSubtitle_Checkbox_${ccvAnimation_FrameNumber}" type="checkbox" style = "width:30px;height:30px;">
	</td>
	<td colspan="2" style="text-align:center;">
		<p id="ccvSubtitle_Frame_${ccvAnimation_FrameNumber}" style="font-size: 35px;">${ccvAnimation_Frame}</p>
	</td>
	<td colspan="2" style="text-align:center;">
		<p id="ccvSubtitle_Position_${ccvAnimation_FrameNumber}" style="font-size: 35px;">上下排</p>
	</td>
	<td colspan="2" style="text-align:center;">
		<input id="ccvSubtitle_Text_${ccvAnimation_FrameNumber}" type="text" style="font-size: 70px;width: 2560px">
	</td>
</tr>
`;
	ccvAnimation_FrameNumber = ccvAnimation_FrameNumber + 1;
}


document.getElementById("ccvTable").innerHTML = ccvTable_Subtitle;

var ccvSubtitle_Array = [];

function ccvVideo_Translation() {
	ccvSubtitle_Array = [];
	let Translation_Index = -1;
	for (let Translation_i = 0; Translation_i < ccvAnimation_FrameNumber; Translation_i++) {
		if (document.getElementById(`ccvSubtitle_Checkbox_${Translation_i}`).checked == true) {
			continue;
		}
		Translation_Index = Translation_Index + 1;
		ccvSubtitle_Array[Translation_Index] = [];
		ccvSubtitle_Array[Translation_Index][0] = Number(document.getElementById(`ccvSubtitle_Frame_${Translation_i}`).innerHTML);
		ccvSubtitle_Array[Translation_Index][1] = 0;
		ccvSubtitle_Array[Translation_Index][2] = document.getElementById(`ccvSubtitle_Text_${Translation_i}`).value;
	}
	ccvSubtitle_Array.sort(function (a, b) {
		return a[0] - b[0];
	});
	for (let Translation_i = 0; Translation_i < ccvSubtitle_Array.length; Translation_i++) {
		if (Translation_i % 2 == 0) {
			ccvSubtitle_Array[Translation_i][1] = 0;
		} else {
			ccvSubtitle_Array[Translation_i][1] = 1;
		}
	}
	console.log(ccvSubtitle_Array);
}

function ccvVideo_Refresh() {
	console.log("重新整理");
	//表格轉錄到陣列上排列
	ccvVideo_Translation();
	//清空表格
	document.getElementById("ccvTable").innerHTML = ccvTable_Subtitle;
	//反轉錄更新表格
	ccvAnimation_FrameNumber = 0;
	for (let Refresh_i = 0; Refresh_i < ccvSubtitle_Array.length; Refresh_i++) {
		document.getElementById("ccvTable").innerHTML = document.getElementById("ccvTable").innerHTML + `
		<tr>
			<td colspan="2" style="text-align:center;">
				<input id="ccvSubtitle_Checkbox_${Refresh_i}" type="checkbox" style = "width:30px;height:30px;">
			</td>
			<td colspan="2" style="text-align:center;">
				<p id="ccvSubtitle_Frame_${Refresh_i}" style="font-size: 35px;">${ccvSubtitle_Array[Refresh_i][0]}</p>
			</td>
			<td colspan="2" style="text-align:center;">
				<p id="ccvSubtitle_Position_${Refresh_i}" style="font-size: 35px;">${ccvSubtitle_Position_change(ccvSubtitle_Array[Refresh_i][1])}</p>
			</td>
			<td colspan="2" style="text-align:center;">
				<input id="ccvSubtitle_Text_${Refresh_i}" type="text" value = "${ccvSubtitle_Array[Refresh_i][2]}" style="font-size: 70px;width: 2560px">
			</td>
		</tr>
		`
		ccvAnimation_FrameNumber = ccvAnimation_FrameNumber + 1;
	}
	console.log(ccvAnimation_FrameNumber, "ccvAnimation_FrameNumber")
}

function ccvSubtitle_Position_change(ccvPosition) {
	if (ccvPosition == 0) {
		return "上";
	} else if (ccvPosition == 1) {
		return "下";
	} else if (ccvPosition == 2) {
		return "多力多滋";
	}
}

function formatSecond(secs) {
	let min = Math.floor(secs / 60);
	let sec = Math.floor(secs - (min * 60));
	let frm = Math.floor((secs - Math.floor(secs))*ccvVideoFrame);
	while (min.toString().length < 2) {
		min = "0" + min;
	}
	while (sec.toString().length < 2) {
		sec = "0" + sec;
	}
	while (frm.toString().length < 2) {
		frm = "0" + frm;
	}
	return min + ":" + sec + ":" + frm;
}

function ccvFont_change(){
	ccvFont = window.prompt("請輸入你想要的字體名稱","Microsoft JhengHei");
	document.getElementById("ccvFont").innerHTML = "Font: " + ccvFont;
}





















//以下為2.2.2版以前會用的程式碼

/*
//打光方向
var dddLight = dddNormalize([6, 2, 0]);//光線要正交化

//做一個甜甜圈

var Myr1 = 50
var dddMyDonut = dddCreate_Cube(Myr1);		//做一個甜甜圈
var dddMyDonutSurface = dddCreate_CubeSurface();	//標注甜甜圈的各個表面的節點
var dddMyDonutNormal = dddCreate_CubeNormal();	//找出甜甜圈各個表面的法向量


for (let k = 0; k < 50; k++) {
	var dddMyDonut2 = dddCreate_Cube(Myr1);		//做一個甜甜圈
	var dddMyDonutSurface2 = dddCreate_CubeSurface();	//標注甜甜圈的各個表面的節點
	var dddMyDonutNormal2 = dddCreate_CubeNormal();	//找出甜甜圈各個表面的法向量
	

	dddMyDonut2 = dddRotate_X(dddPI / Math.floor(Math.random() * 60)-30, dddMyDonut2);
	dddMyDonutNormal2 = dddRotate_X(dddPI / Math.floor(Math.random() * 60)-30, dddMyDonutNormal2);
	dddMyDonut2 = dddRotate_Y(dddPI / Math.floor(Math.random() * 60)-30, dddMyDonut2);
	dddMyDonutNormal2 = dddRotate_Y(dddPI / Math.floor(Math.random() * 60)-30, dddMyDonutNormal2);
	dddMyDonut2 = dddRotate_Z(dddPI / Math.floor(Math.random() * 60)-30, dddMyDonut2);
	dddMyDonutNormal2 = dddRotate_Z(dddPI / Math.floor(Math.random() * 60)-30, dddMyDonutNormal2);

	dddTranslation((Math.floor((Math.random()**4) * 500)-250),
		0,
		0, dddMyDonut2);
	dddCombineDonut(dddMyDonut, dddMyDonutSurface, dddMyDonutNormal, dddMyDonut2, dddMyDonutSurface2, dddMyDonutNormal2)
	dddMyDonut2 = []		//做一個甜甜圈
	dddMyDonutSurface2 = []	//標注甜甜圈的各個表面的節點
	dddMyDonutNormal2 = []	//找出甜甜圈各個表面的法向量
}

console.log(dddMyDonut,"Donut")
console.log(dddMyDonutSurface,"Surface")
console.log(dddMyDonutNormal,"Normal")

*/



//聲音
function AudioContext_Ready() {
	audioCtx = new AudioContext();
	const ccvSource = audioCtx.createMediaElementSource(ccvAudio);
	analyser = audioCtx.createAnalyser();
	analyser.fftSize = 2048;
	bufferLength = analyser.frequencyBinCount;
	dataArray = new Uint8Array(bufferLength);
	analyser.getByteTimeDomainData(dataArray);
	ccvSource.connect(analyser);
}

function ccvAnimation_Audio(){
	ccvAudio_heightArray_Save = [];
	for (let i = 0; i < 1024; i++) {
		ccvAudio_heightArray_Save[i] = dataArray[i];
	}
	//對音檔粗剪
	for (let i = 0; i < 1024; i++) {
		for (let j = 0; j < 128; j++) {
			ccvAudio_heightArray_Save[i] = ccvAudio_heightArray_Save[i] + ccvAudio_heightArray_Save[((i + j) % 1024)]
		}
		ccvAudio_heightArray_Save[i] = ccvAudio_heightArray_Save[i] / 128
	}

	/*
	for (let i = 0; i < 1024; i++) {
		if (ccvAudio_heightArray_Save[i] <= 128) {
			ccvAudio_heightArray_Save[i] = 128
		}
	}
	*/
	ccvAudio_VideoTimeArray_Save.push(ccvVideo.currentTime);
	ccvAudio_heightArray_SaveAsArray.push(ccvAudio_heightArray_Save);

	for (let i = 0; i < 1024; i++) {
		ccvPan_1.fillStyle = "#ffffff";
		ccvPan_1.globalAlpha = 0.8;

		ccvPan_1.fillRect(i + (i-i%16)*4/16, ccvCanvas_1.height - ccvAudio_heightArray_Save[i - (i % 16)] * 2 + 256, 1, ccvCanvas_1.height);
		ccvPan_1.closePath();
	}
	ccvPan_1.globalAlpha = 1;
}

function ccvVideo_Output_Audio(){
	var ccvTimeArray = 0

	for (let i = 0; i < ccvAudio_VideoTimeArray_Save.length; i++) {
		if (ccvVideo.currentTime <= ccvAudio_VideoTimeArray_Save[i]) {
			ccvTimeArray = Number(i);
			break;
		};
	};

	for (let i = 0; i < 1024; i++) {
		ccvPan_1.fillStyle = "#ffffff";
		ccvPan_1.globalAlpha = 0.8;
		ccvPan_1.fillRect(i + (i - i % 16) * 4 / 16, ccvCanvas_1.height - ccvAudio_heightArray_SaveAsArray[ccvTimeArray][i - (i % 16)] * 2 + 256, 1, ccvCanvas_1.height);
		ccvPan_1.closePath();
	}
}

function ccvAnimation_Donut(){
	ccvPan_1.globalAlpha = 1;
	//旋轉
	dddMyDonut = dddRotate_X(dddPI / 600, dddMyDonut);
	dddMyDonutNormal = dddRotate_X(dddPI / 600, dddMyDonutNormal);
	dddMyDonut = dddRotate_Y(dddPI / 600, dddMyDonut);
	dddMyDonutNormal = dddRotate_Y(dddPI / 600, dddMyDonutNormal);
	dddMyDonut = dddRotate_Z(dddPI / 600, dddMyDonut);
	dddMyDonutNormal = dddRotate_Z(dddPI / 600, dddMyDonutNormal);
	//取亮度
	var dddMyDonutFindOut_Brightness = dddGetLuminance(dddLight, dddMyDonutNormal);
	//排序
	console.log(dddMyDonutSurface)
	var lighthouse = dddAnimationDrawSequence(dddMyDonut, dddMyDonutSurface);
	//畫甜甜圈
	for (let i = 0; i < dddMyDonutSurface.length; i++) {
		ccvPan_1.beginPath();									//產生一個新路徑，產生後再使用繪圖指令來設定路徑
		ccvPan_1.moveTo(dddMyDonut[dddMyDonutSurface[lighthouse[i]][0]][0] * 1000 / (1000 + dddMyDonut[dddMyDonutSurface[lighthouse[i]][0]][2]) + 640, dddMyDonut[dddMyDonutSurface[lighthouse[i]][0]][1] * 1000 / (1000 + dddMyDonut[dddMyDonutSurface[lighthouse[i]][0]][2]) + 360);
		for (let j = 1; j < dddMyDonutSurface[lighthouse[i]].length; j++) {
			ccvPan_1.lineTo(dddMyDonut[dddMyDonutSurface[lighthouse[i]][j]][0] * 1000 / (1000 + dddMyDonut[dddMyDonutSurface[lighthouse[i]][j]][2]) + 640, dddMyDonut[dddMyDonutSurface[lighthouse[i]][j]][1] * 1000 / (1000 + dddMyDonut[dddMyDonutSurface[lighthouse[i]][j]][2]) + 360);
		}
		ccvPan_1.closePath();
		ccvPan_1.fillStyle = `rgba(${(dddMyDonutFindOut_Brightness[lighthouse[i]] * 50 + 100) % 100},${(dddMyDonutFindOut_Brightness[lighthouse[i]] * 255) % 100 + 50},${dddMyDonutFindOut_Brightness[lighthouse[i]] * 50 + 125},1)`;
		ccvPan_1.fill();
	}
}



function ccvAnimation_getGrayscale(ccvAnimation_Frame, ccvAnimation_Frame_Min = 0, ccvAnimation_Frame_Max = ccvAnimation_Frame){
	if ((ccvAnimation_Frame >= ccvAnimation_Frame_Min) && (ccvAnimation_Frame <= ccvAnimation_Frame_Max)) {
		//色彩處理
		ccvimageData = ccvPan_1.getImageData(0, 0, ccvCanvas_1.width, ccvCanvas_1.height);
		ccvCanvas_1_Buffer = ccvimageData.data;
		// 取值
		let ccv_r, ccv_g, ccv_b
		for (let i = 0; i < ccvCanvas_1_Buffer.length; i += 4) {
			//ccv_buf = ccvCanvas_1_Buffer;
			ccv_r = ccvCanvas_1_Buffer[i];
			ccv_g = ccvCanvas_1_Buffer[i + 1];
			ccv_b = ccvCanvas_1_Buffer[i + 2];
			//以下更變數據
			ccvCanvas_1_Buffer[i] = (ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000;
			ccvCanvas_1_Buffer[i + 1] = (ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000
			ccvCanvas_1_Buffer[i + 2] = (ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000;
		}
		// 更新到ccvCanvas_1上
		ccvPan_1.putImageData(ccvimageData, 0, 0);
	}
}

function ccvAnimation_colorInvert(ccvAnimation_Frame, ccvAnimation_Frame_Min = 0, ccvAnimation_Frame_Max = ccvAnimation_Frame) {
	if ((ccvAnimation_Frame >= ccvAnimation_Frame_Min) && (ccvAnimation_Frame <= ccvAnimation_Frame_Max)) {
		//色彩處理
		ccvimageData = ccvPan_1.getImageData(0, 0, ccvCanvas_1.width, ccvCanvas_1.height);
		ccvCanvas_1_Buffer = ccvimageData.data;
		// 取值
		let ccv_r, ccv_g, ccv_b
		for (let i = 0; i < ccvCanvas_1_Buffer.length; i += 4) {
			//ccv_buf = ccvCanvas_1_Buffer;
			ccv_r = ccvCanvas_1_Buffer[i];
			ccv_g = ccvCanvas_1_Buffer[i + 1];
			ccv_b = ccvCanvas_1_Buffer[i + 2];
			//以下更變數據
			ccvCanvas_1_Buffer[i] = 255 - ccvCanvas_1_Buffer[i];
			ccvCanvas_1_Buffer[i + 1] = 255 - ccvCanvas_1_Buffer[i+1];
			ccvCanvas_1_Buffer[i + 2] = 255 - ccvCanvas_1_Buffer[i+2];
		}
		// 更新到ccvCanvas_1上
		ccvPan_1.putImageData(ccvimageData, 0, 0);
	}
}

function ccvAnimation_colorChange(ccvAnimation_Frame, ccvAnimation_Frame_Min = 0, ccvAnimation_Frame_Max = ccvAnimation_Frame) {
	if ((ccvAnimation_Frame >= ccvAnimation_Frame_Min) && (ccvAnimation_Frame <= ccvAnimation_Frame_Max)) {
		//色彩處理
		ccvimageData = ccvPan_1.getImageData(0, 0, ccvCanvas_1.width, ccvCanvas_1.height);
		ccvCanvas_1_Buffer = ccvimageData.data;
		// 取值
		let ccv_r, ccv_g, ccv_b
		for (let i = 0; i < ccvCanvas_1_Buffer.length; i += 4) {
			//ccv_buf = ccvCanvas_1_Buffer;
			ccv_r = ccvCanvas_1_Buffer[i];
			ccv_g = ccvCanvas_1_Buffer[i + 1];
			ccv_b = ccvCanvas_1_Buffer[i + 2];
			//以下更變數據
			ccvCanvas_1_Buffer[i] = ccv_b;//(ccv_r * (ccvAnimation_Frame_Max - ccvAnimation_Frame + ccvAnimation_Frame_Min) + ccv_g * ccvAnimation_Frame)/(ccvAnimation_Frame_Max - ccvAnimation_Frame_Min);
			ccvCanvas_1_Buffer[i + 1] = ccv_r;//(ccv_g * (ccvAnimation_Frame_Max - ccvAnimation_Frame + ccvAnimation_Frame_Min) + ccv_b * ccvAnimation_Frame) / (ccvAnimation_Frame_Max - ccvAnimation_Frame_Min);
			ccvCanvas_1_Buffer[i + 2] = ccv_g;//(ccv_b * (ccvAnimation_Frame_Max - ccvAnimation_Frame + ccvAnimation_Frame_Min) + ccv_r * ccvAnimation_Frame) / (ccvAnimation_Frame_Max - ccvAnimation_Frame_Min);
		}
		// 更新到ccvCanvas_1上
		ccvPan_1.putImageData(ccvimageData, 0, 0);
	}
}

function ccvAnimation_colorChange_BlackWhite(ccvAnimation_Frame, ccvAnimation_Frame_Min = 0, ccvAnimation_Frame_Max = ccvAnimation_Frame) {
	if ((ccvAnimation_Frame >= ccvAnimation_Frame_Min) && (ccvAnimation_Frame <= ccvAnimation_Frame_Max)) {
		//色彩處理
		ccvimageData = ccvPan_1.getImageData(0, 0, ccvCanvas_1.width, ccvCanvas_1.height);
		ccvCanvas_1_Buffer = ccvimageData.data;
		// 取值
		let ccv_r, ccv_g, ccv_b
		for (let i = 0; i < ccvCanvas_1_Buffer.length; i += 4) {
			//ccv_buf = ccvCanvas_1_Buffer;
			ccv_r = ccvCanvas_1_Buffer[i];
			ccv_g = ccvCanvas_1_Buffer[i + 1];
			ccv_b = ccvCanvas_1_Buffer[i + 2];
			ccv_gray = (ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000;
			//以下更變數據
			if (ccv_gray > 188) {
				ccvCanvas_1_Buffer[i] = 0;
				ccvCanvas_1_Buffer[i + 1] = 0;
				ccvCanvas_1_Buffer[i + 2] = 0;
			}
			else{
				ccvCanvas_1_Buffer[i] = 225;
				ccvCanvas_1_Buffer[i + 1] = 225;
				ccvCanvas_1_Buffer[i + 2] = 225;
			}
			
		}
		// 更新到ccvCanvas_1上
		ccvPan_1.putImageData(ccvimageData, 0, 0);
	}
}

function ccvAnimation_colorChange_blackLighting(ccvAnimation_Frame, ccvAnimation_Frame_Min = 0, ccvAnimation_Frame_Max = ccvAnimation_Frame) {
	if ((ccvAnimation_Frame >= ccvAnimation_Frame_Min) && (ccvAnimation_Frame <= ccvAnimation_Frame_Max)) {
		//色彩處理
		ccvimageData = ccvPan_1.getImageData(0, 0, ccvCanvas_1.width, ccvCanvas_1.height);
		ccvCanvas_1_Buffer = ccvimageData.data;
		// 取值
		let ccv_r, ccv_g, ccv_b
		for (let i = 0; i < ccvCanvas_1_Buffer.length; i += 4) {
			//ccv_buf = ccvCanvas_1_Buffer;
			ccv_r = ccvCanvas_1_Buffer[i];
			ccv_g = ccvCanvas_1_Buffer[i + 1];
			ccv_b = ccvCanvas_1_Buffer[i + 2];
			//以下更變數據
			if ((ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000 < 10){
				ccvCanvas_1_Buffer[i] = 250;
				ccvCanvas_1_Buffer[i + 1] = 250;
				ccvCanvas_1_Buffer[i + 2] = 250;
			} else if ((ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000 < 50){
				ccvCanvas_1_Buffer[i] = 100;
				ccvCanvas_1_Buffer[i + 1] = 100;
				ccvCanvas_1_Buffer[i + 2] = 255;
			} else if ((ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000 < 100) {
				ccvCanvas_1_Buffer[i] = 255;
				ccvCanvas_1_Buffer[i + 1] = 100;
				ccvCanvas_1_Buffer[i + 2] = 100;
			} else if ((ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000 < 150) {
				ccvCanvas_1_Buffer[i] = 100;
				ccvCanvas_1_Buffer[i + 1] = 255;
				ccvCanvas_1_Buffer[i + 2] = 100;
			}else{
				ccvCanvas_1_Buffer[i] = 25;
				ccvCanvas_1_Buffer[i + 1] = 25;
				ccvCanvas_1_Buffer[i + 2] = 25;
			}
			
		}
		// 更新到ccvCanvas_1上
		ccvPan_1.putImageData(ccvimageData, 0, 0);
	}
}

function ccvAnimation_colorChange_byGrayscale(ccvAnimation_Frame, ccvAnimation_Frame_Min = 0, ccvAnimation_Frame_Max = ccvAnimation_Frame) {
	if ((ccvAnimation_Frame >= ccvAnimation_Frame_Min) && (ccvAnimation_Frame <= ccvAnimation_Frame_Max)) {
		//色彩處理
		ccvimageData = ccvPan_1.getImageData(0, 0, ccvCanvas_1.width, ccvCanvas_1.height);
		ccvCanvas_1_Buffer = ccvimageData.data;
		// 取值
		let ccv_r, ccv_g, ccv_b
		for (let i = 0; i < ccvCanvas_1_Buffer.length; i += 4) {
			//ccv_buf = ccvCanvas_1_Buffer;
			ccv_r = ccvCanvas_1_Buffer[i];
			ccv_g = ccvCanvas_1_Buffer[i + 1];
			ccv_b = ccvCanvas_1_Buffer[i + 2];
			ccv_gray = (ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000;
			//以下更變數據
			/*
			if (ccv_gray < 20){
				ccvCanvas_1_Buffer[i] = 0;
				ccvCanvas_1_Buffer[i + 1] = 0;
				ccvCanvas_1_Buffer[i + 2] = 0;
				continue
			}*/
			ccvCanvas_1_Buffer[i] = (Math.sin((ccv_gray / 75) * dddPI) + 1) * 127 % 255;//ccv_gray;
			ccvCanvas_1_Buffer[i + 1] = (Math.sin((ccv_gray / 75) * dddPI + 2 * dddPI / 3) + 1) * 127 % 255;//ccvAnimation_colorChange_byGrayscale_ccv_g(ccv_gray);
			ccvCanvas_1_Buffer[i + 2] = (Math.sin((ccv_gray / 75) * dddPI + 4 * dddPI / 3) + 1) * 127 % 255;//255 - ccv_gray;
		}
		// 更新到ccvCanvas_1上
		ccvPan_1.putImageData(ccvimageData, 0, 0);
	}
}

function ccvAnimation_colorChange_byGrayscale_ccv_g(number){
	if (number < 127){
		return (2 * number);
	}else{
		return (255 - (number - 128) * 2)
	}
}

function ccvAnimation_colorRGB_byGrayscale(ccvAnimation_Frame, ccvAnimation_Frame_Min = 0, ccvAnimation_Frame_Max = ccvAnimation_Frame) {
	if ((ccvAnimation_Frame >= ccvAnimation_Frame_Min) && (ccvAnimation_Frame <= ccvAnimation_Frame_Max)) {
		//色彩處理
		ccvimageData = ccvPan_1.getImageData(0, 0, ccvCanvas_1.width, ccvCanvas_1.height);
		ccvCanvas_1_Buffer = ccvimageData.data;
		// 取值
		let ccv_r, ccv_g, ccv_b
		for (let i = 0; i < ccvCanvas_1_Buffer.length; i += 4) {
			//ccv_buf = ccvCanvas_1_Buffer;
			ccv_r = ccvCanvas_1_Buffer[i];
			ccv_g = ccvCanvas_1_Buffer[i + 1];
			ccv_b = ccvCanvas_1_Buffer[i + 2];
			//以下更變數據
			if ((ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000 > 200) {
				ccvCanvas_1_Buffer[i] = 255;
				ccvCanvas_1_Buffer[i + 1] = 255;
				ccvCanvas_1_Buffer[i + 2] = 255;
				continue;
			} else if ((ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000 > 150) {
				ccvCanvas_1_Buffer[i] = 50;
				ccvCanvas_1_Buffer[i + 1] = 200;
				ccvCanvas_1_Buffer[i + 2] = 50;
				continue;
			} else if ((ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000 > 100) {
				ccvCanvas_1_Buffer[i] = 200;
				ccvCanvas_1_Buffer[i + 1] = 50;
				ccvCanvas_1_Buffer[i + 2] = 50;
				continue;
			} else if ((ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000 > 50) {
				ccvCanvas_1_Buffer[i] = 50;
				ccvCanvas_1_Buffer[i + 1] = 50;
				ccvCanvas_1_Buffer[i + 2] = 200;
				continue;
			} else {
				ccvCanvas_1_Buffer[i] = 0;
				ccvCanvas_1_Buffer[i + 1] = 0;
				ccvCanvas_1_Buffer[i + 2] = 0;
			}

		}
		// 更新到ccvCanvas_1上
		ccvPan_1.putImageData(ccvimageData, 0, 0);
	}
}

function ccvAnimation_colorRGB(ccvAnimation_Frame, ccvAnimation_Frame_Min = 0, ccvAnimation_Frame_Max = ccvAnimation_Frame) {
	if ((ccvAnimation_Frame >= ccvAnimation_Frame_Min) && (ccvAnimation_Frame <= ccvAnimation_Frame_Max)) {
		//色彩處理
		ccvimageData = ccvPan_1.getImageData(0, 0, ccvCanvas_1.width, ccvCanvas_1.height);
		ccvCanvas_1_Buffer = ccvimageData.data;
		// 取值
		let ccv_r, ccv_g, ccv_b
		for (let i = 0; i < ccvCanvas_1_Buffer.length; i += 4) {
			//ccv_buf = ccvCanvas_1_Buffer;
			ccv_r = ccvCanvas_1_Buffer[i];
			ccv_g = ccvCanvas_1_Buffer[i + 1];
			ccv_b = ccvCanvas_1_Buffer[i + 2];
			//以下更變數據
			if ((ccv_r > 192) && (ccv_g > 192) && (ccv_b > 192)) {
				ccvCanvas_1_Buffer[i] = 255;
				ccvCanvas_1_Buffer[i + 1] = 255;
				ccvCanvas_1_Buffer[i + 2] = 255;
			} else if ((ccv_r < 96) && (ccv_g < 96) && (ccv_b < 96)) {
				ccvCanvas_1_Buffer[i] = 0;
				ccvCanvas_1_Buffer[i + 1] = 0;
				ccvCanvas_1_Buffer[i + 2] = 0;
			} else if ((ccv_r > ccv_g) && (ccv_r > ccv_b)) {
				ccvCanvas_1_Buffer[i] = 255;
				ccvCanvas_1_Buffer[i + 1] = 128;
				ccvCanvas_1_Buffer[i + 2] = 128;
			} else if ((ccv_g >= ccv_r) && (ccv_g > ccv_b)) {
				ccvCanvas_1_Buffer[i] = 128;
				ccvCanvas_1_Buffer[i + 1] = 255;
				ccvCanvas_1_Buffer[i + 2] = 128;
			} else if ((ccv_b >= ccv_r) && (ccv_b >= ccv_g)) {
				ccvCanvas_1_Buffer[i] = 128;
				ccvCanvas_1_Buffer[i + 1] = 128;
				ccvCanvas_1_Buffer[i + 2] = 255;
			}
		}
		// 更新到ccvCanvas_1上
		ccvPan_1.putImageData(ccvimageData, 0, 0);
	}
}

function ccvAnimation_toScreentone(ccvAnimation_Frame, ccvAnimation_Frame_Min = 0, ccvAnimation_Frame_Max = ccvAnimation_Frame) {
	if ((ccvAnimation_Frame >= ccvAnimation_Frame_Min) && (ccvAnimation_Frame <= ccvAnimation_Frame_Max)) {
		//色彩處理
		ccvimageData = ccvPan_1.getImageData(0, 0, ccvCanvas_1.width, ccvCanvas_1.height);
		ccvCanvas_1_Buffer = ccvimageData.data;
		// 取值
		let ccv_r, ccv_g, ccv_b
		for (let i = 0; i < ccvCanvas_1_Buffer.length; i += 4) {
			//ccv_buf = ccvCanvas_1_Buffer;
			ccv_r = ccvCanvas_1_Buffer[i];
			ccv_g = ccvCanvas_1_Buffer[i + 1];
			ccv_b = ccvCanvas_1_Buffer[i + 2];
			//以下更變數據
			if (((ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000) < 43){
				ccvCanvas_1_Buffer[i] = 0;
				ccvCanvas_1_Buffer[i + 1] = 0;
				ccvCanvas_1_Buffer[i + 2] = 0;
			}else if (((ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000) < 85) {
				ccvCanvas_1_Buffer[i] = ccvScreentone_20.data[i];
				ccvCanvas_1_Buffer[i + 1] = ccvScreentone_20.data[i+1];
				ccvCanvas_1_Buffer[i + 2] = ccvScreentone_20.data[i+2];
			} else if (((ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000) < 128) {
				ccvCanvas_1_Buffer[i] = ccvScreentone_40.data[i];
				ccvCanvas_1_Buffer[i + 1] = ccvScreentone_40.data[i + 1];
				ccvCanvas_1_Buffer[i + 2] = ccvScreentone_40.data[i + 2];
			} else if (((ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000) < 170) {
				ccvCanvas_1_Buffer[i] = ccvScreentone_60.data[i];
				ccvCanvas_1_Buffer[i + 1] = ccvScreentone_60.data[i + 1];
				ccvCanvas_1_Buffer[i + 2] = ccvScreentone_60.data[i + 2];
			} else if (((ccv_r * 299 + ccv_g * 587 + ccv_b * 114) / 1000) < 213) {
				ccvCanvas_1_Buffer[i] = ccvScreentone_80.data[i];
				ccvCanvas_1_Buffer[i + 1] = ccvScreentone_80.data[i + 1];
				ccvCanvas_1_Buffer[i + 2] = ccvScreentone_80.data[i + 2];
			} else{
				ccvCanvas_1_Buffer[i] = 255;
				ccvCanvas_1_Buffer[i + 1] = 255;
				ccvCanvas_1_Buffer[i + 2] = 255;
			}
			
		}
		// 更新到ccvCanvas_1上
		ccvPan_1.putImageData(ccvimageData, 0, 0);
	}
}

function ccvAnimation_subtitleToCanvas(ccvSubtitle_Array, ccvAnimation_Frame){
	for (let subtitleToCanvas_i = 0; subtitleToCanvas_i < ccvSubtitle_Array.length - 1; subtitleToCanvas_i++){
		if (ccvAnimation_Frame >= (ccvSubtitle_Array[subtitleToCanvas_i][0] - 48) && ccvAnimation_Frame < ccvSubtitle_Array[subtitleToCanvas_i][0]){
			ccvAnimation_subtitle(ccvSubtitle_Array[subtitleToCanvas_i][2], ccvSubtitle_Array[subtitleToCanvas_i][1]);
			//drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
			ccvPan_1.drawImage(ccvCanvas_Mask,
				0,
				0,
				ccvCanvas_Mask.width - 30 * (ccvSubtitle_Array[subtitleToCanvas_i][0] - ccvAnimation_Frame) ** (1.2),
				ccvCanvas_Mask.height,
				0,
				0,
				ccvCanvas_Mask.width - 30 * (ccvSubtitle_Array[subtitleToCanvas_i][0] - ccvAnimation_Frame)**(1.2),
				ccvCanvas_Mask.height);
			ccvPan_Mask.clearRect(0, 0, ccvCanvas_Mask.width, ccvCanvas_1.height);
		} else if (ccvAnimation_Frame >= ccvSubtitle_Array[subtitleToCanvas_i][0] && ccvAnimation_Frame < (ccvSubtitle_Array[subtitleToCanvas_i + 1][0])){
			ccvAnimation_subtitle(ccvSubtitle_Array[subtitleToCanvas_i][2], ccvSubtitle_Array[subtitleToCanvas_i][1]);
			//drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
			ccvPan_1.drawImage(ccvCanvas_Mask,
				0,
				0,
				ccvCanvas_Mask.width,
				ccvCanvas_Mask.height,
				0,
				0,
				ccvCanvas_Mask.width,
				ccvCanvas_Mask.height);
			ccvPan_Mask.clearRect(0, 0, ccvCanvas_Mask.width, ccvCanvas_1.height);
		} else if (ccvAnimation_Frame >= ccvSubtitle_Array[subtitleToCanvas_i+1][0] && ccvAnimation_Frame < (ccvSubtitle_Array[subtitleToCanvas_i + 1][0]+12)){
			ccvAnimation_subtitle(ccvSubtitle_Array[subtitleToCanvas_i][2], ccvSubtitle_Array[subtitleToCanvas_i][1]);
			//drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
			ccvPan_1.drawImage(
				ccvCanvas_Mask,
				100 * (ccvAnimation_Frame - ccvSubtitle_Array[subtitleToCanvas_i+1][0]),
				0,
				ccvCanvas_Mask.width - 100 * (ccvAnimation_Frame - ccvSubtitle_Array[subtitleToCanvas_i+1][0]),
				ccvCanvas_Mask.height,
				100 * (ccvAnimation_Frame - ccvSubtitle_Array[subtitleToCanvas_i+1][0]),
				0,
				ccvCanvas_Mask.width - 100 * (ccvAnimation_Frame - ccvSubtitle_Array[subtitleToCanvas_i+1][0]),
				ccvCanvas_Mask.height);
			ccvPan_Mask.clearRect(0, 0, ccvCanvas_Mask.width, ccvCanvas_1.height);
		}
	}
}


