//google spreadsheet link
const dataKO = "https://spreadsheets.google.com/feeds/list/1vDv8wHMb6u0cX1td924A1LfzPPB91hywmxkQLZb-dfU/1/public/full?alt=json";
const dataEN = "https://spreadsheets.google.com/feeds/list/1vDv8wHMb6u0cX1td924A1LfzPPB91hywmxkQLZb-dfU/2/public/full?alt=json";

const paramsObj = {};
const paramReg = /(\?|&)(\D|\d){1,}/;
const langPart = /(\?|&)lang=(\D|\d){1,}/;
const dataSheet = {"ko":[],"en":[]};
let filePath;
let pageIdx;
let currLang;
let url = window.location.href;
let entry;


function checkUrl(url){
	const currParam = paramReg.exec(url) ? paramReg.exec(url)[0] : null;
	paramsObj.student = null;
	paramsObj.lang = null;

	return new Promise((resolve, reject)=>{

		//get querystring
		function getParam(){
			paramsObj.lang = "";
			if(currParam){
				currParam.replace(
					/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { paramsObj[key] = value; }
				);
			}
			console.log(paramsObj);
			if(paramsObj.lang === 'en'){
				currLang = paramsObj.lang;
			}else{
				currLang = 'ko'
			}
			return paramsObj;
		}

		//check pathname
		filePath = window.location.pathname;
		function getFilePath(path){
			switch (path) {
				case "/digdeep/":
				//case "/Users/minuuuu/Google%20%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B8%8C/%ED%95%99%EA%B5%90/2020-2%20%EC%A1%B8%EC%97%85%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/%EC%A1%B8%EC%97%85%EC%A0%84%EC%8B%9C%EC%9B%B9%ED%8C%80/digdeep/index.html" :
					pageIdx = 1;
					console.log(pageIdx)
					return pageIdx;

				case "/digdeep/project":
				//case '/Users/minuuuu/Google%20%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B8%8C/%ED%95%99%EA%B5%90/2020-2%20%EC%A1%B8%EC%97%85%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/%EC%A1%B8%EC%97%85%EC%A0%84%EC%8B%9C%EC%9B%B9%ED%8C%80/digdeep/project' :
				pageIdx = 2;
					console.log(pageIdx);
					return pageIdx;

				case '/digdeep/credit':
					pageIdx = 3;
					console.log(pageIdx)
					return pageIdx;

				default: //window.location.href = "https://digdeep.works"
				console.log(pageIdx);

			}
		}
		
		console.log(getParam());
		console.log(getFilePath(filePath));
		console.log(currLang);
		console.log(pageIdx);

		(currLang !== "en") ? resolve(paramsObj) : reject();
	});
}

const removeLang = params => {
	console.log(url)
	url = url.replace(paramReg,"");
	console.log(url);
	console.log (pageIdx);
	window.location.href = url;
}


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

async function initData(data, lang){
	//get google sheet JSON data
	function getData(data){
		return new Promise(function(resolve, reject) {
			let request = new XMLHttpRequest();
			request.open("GET", data);
			request.send();
			request.onload = function() {
					let gSheet = JSON.parse(request.responseText);
					entry = gSheet['feed']['entry'];
					console.log(entry);
					resolve(entry);
			}
		});
	}


	function copyData(entry) {
		return new Promise(function(resolve, reject) {
			class Individual {
				constructor(title, name, url, description, team, personalUrl, email, role, query) {
					this.title = title;
					this.name = name;
					this.url = url;
					this.description = description;
					this.team = team;
					this.personalUrl = personalUrl;
					this.email = email;
					this.role = role;
					this.query = query;
				}
			}
			for (let i in entry) { // 각 행에대해 아래 스크립트를 실행합니다.
					const person = new Individual(entry[i].gsx$title['$t'],entry[i].gsx$name['$t'],entry[i].gsx$url['$t'],entry[i].gsx$description['$t'],entry[i].gsx$team['$t'],entry[i].gsx$personalurl['$t'],entry[i].gsx$email['$t'],entry[i].gsx$role['$t'],entry[i].gsx$query['$t'])
					dataSheet[lang][i] = person;
			}
			console.log('copying done')
			console.log(dataSheet);
			resolve(dataSheet);
		});
	}

	return getData(data).then(copyData);

}







//------------------------------------------------------------------------------
//------------------------------------------------------------------------------





// draw initial div in grid-container
function contentDraw(dataSheet){

	console.log(pageIdx);
	return new Promise((resolve, reject)=>{
		//global container
		const gC = $('.grid-container');
		gC.empty();

		console.log(dataSheet);
		switch (pageIdx) {
			case 1: //page index => main
				mainDraw(dataSheet[currLang]);
				break;
			case 2: //page index => project
				projectDraw(dataSheet[currLang]);
				break;
			case 3: //page index => credit
				creditDraw(dataSheet[currLang]);
				break;
			default: alert('wrong page!');
		}


		//declare drawing functions

		//main page
		function mainDraw(data){
			gC.attr('style','grid-template-columns: repeat(7, 1fr) 160px 160px');
			$('.logo h1').css('grid-column','1/3');
			$('.nameTag').remove();
			

			console.log(data);
			const about = $('<div></div>');
			about.attr('class', 'item about');
			const info = $('<div></div>')
			info.attr('class', 'info');
			const title = $('<h2></h2>');
			title.attr('class','title');
			title.text('Dig deep');
			const p1 = $('<p></p>');
			const p2 = $('<p></p>');
			const p3 = $('<p></p>');
			const last = $('<h2></h2>');
			last.text('dig deep.');

			const jail = $('<div></div>');
			jail.attr('class', 'jail');

			for(let i = 0; i<28; i++){
				const item = $('<div></div>');
				item.attr('class', `item booth diggingDiv ${data[i].query}` );

				const video = $('<video autoplay muted loop></video>');
				const source = $(`<source src='video/thumbnail_jiu.mp4' type='video/mp4'>`)
				//video.attr('src',`video/thumbnail_${data[i].query}.mp4`)
				//video.attr('src',`video/thumb_kyuntae_250.mp4`);
				video.append(source);
				item.append(video);


				const wrappingBlock = $('<div></div>');
				wrappingBlock.attr('class', 'wrappingBlock hidden');

				//create childern inside digging booth
				const thumbnail = $('<img>');
				const blockTag = $('<div></div>');
				thumbnail.attr({
					'src': `image/1.png`,
					'class': `thumbnail ${data[i].query}Thumbnail`
				});
				/*item.css({
					//'background-image' : `url(\'image/diggingman.png\') center /contain no-repeat content-box`,
					'background' : 'url(\'image/diggingman.png\') center /contain no-repeat content-box'
				});*/
				blockTag.attr('class', `blockTag ${data[i].query}`)

				// work link
				const workLink = $('<a></a>');
				workLink.attr('class','spa');
				if(paramsObj.lang){
					workLink.attr('href',`./project?student=${data[i].query}&lang=${currLang}`);
				}else{
				workLink.attr('href', `./project?student=${data[i].query}`);
				}

				//append block tag
				const nameBlock = $(`<div></div>`);
				nameBlock.attr('class', 'nameBlock');
				const blockTitle = $(`<span></span>`);
				blockTitle.attr('class', 'title');

				//append span to nameBlock
				const tagName = $(`<span></span>`);
				tagName.attr('class','name')
				const arrow = $(`<span>→</span>`);

				gC.append(jail);
				jail.append(item);

				gC.append(about);
				about.append(info);
				info.append(title, p1, p2, p3, last);

				item.append(wrappingBlock);
				wrappingBlock.append(thumbnail, workLink);
				workLink.append(blockTag);
				blockTag.append(nameBlock, blockTitle);
				nameBlock.append(tagName, arrow);


				//apply hover event
				item.hover(function(){
					wrappingBlock.toggleClass('hidden');
					wrappingBlock.toggleClass('showed');
				},function(){
					wrappingBlock.toggleClass('hidden');
					wrappingBlock.toggleClass('showed');
				})
			}

			return data;
		}
		//project page
		function projectDraw(data){
			gC.attr('style','grid-template-columns: repeat(3, minmax(100px, 1fr)) repeat(5, minmax(0, 1fr)) 160px 160px;');
			$('.logo h1').css('grid-column','1/2');
			$('.nameTag').remove();

			//apply url box in header
			const logoBlock = $('.logo');

			const nameTag = $('<div></div>');
			nameTag.attr('class','nameTag item');
			const titleText = $('<span></span>');
			const nameText = $('<span></span>');
			titleText.attr({ 
				'class': 'title',
				'data-detect': 'title'
			});
			nameText.attr({
				'class': 'name',
				'data-detect': 'name'
			});
			
			logoBlock.append(nameTag);
			nameTag.append(titleText, nameText);


			//left pannel
			const leftPannel = $('<div></div>');
			leftPannel.attr('class', 'leftPannel');
			gC.append(leftPannel);

			const personal = $('<div></div>');
			personal.attr('class', 'personal item');
			leftPannel.append(personal);

			const diggingVid = $('<video autoplay muted loop></video>');
			diggingVid.attr('src', `video/thumbnail_jiu.mp4`);
			const urlBox = $('<span></span>');
			personal.append(diggingVid, urlBox);

			const urlLink = $('<a></a>');
			urlLink.attr({
				'target': 'blank',
				'class': 'url',
				'data-detect': 'url'
			})
			urlBox.append(urlLink);

			const description = $('<div></div>');
			description.attr('class','description item');

			const descrBox = $('<div></div>');
			descrBox.attr('class','descrBox');

			const descrText = $('<p></p>');
			descrText.attr('data-detect','description');

			leftPannel.append(description);
			description.append(descrBox);
			descrBox.append(descrText);



			//sticky wrapper 
			const stickyWrapper = $('<div></div>');
			stickyWrapper.attr('class','stickyWrapper item');
			gC.append(stickyWrapper);
			//append image loop
			for(let i=0; i<2; i++){
				const spacer = $('<div></div>')
				spacer.attr('class','stick spacer');
				stickyWrapper.append(spacer);

				if(i===1) break;

				for(let j = 0; j<5; j++){
					const stickImg = $('<img></img>');
					stickImg.attr('class', 'stick stick-img');
					stickyWrapper.append(stickImg);
				}
			}

			const index = $('<div></div>');
			index.attr('class', 'index item');
			gC.append(index);

			return data;
		}
		resolve(dataSheet);
	})
}



//------------------------------------------------------------------------------
//------------------------------------------------------------------------------




// fill content in grid-container
function contentFill(data){

	console.log(pageIdx);
	return new Promise((resolve, reject)=>{
		//global container
		const gC = $('.grid-container');
		console.log(data);
		switch (pageIdx) {
			case 1: //page index => main
				mainFill(data[currLang]);
				break;
			case 2: //page index => project
				projectFill(data[currLang]);
				break;
			case 3: //page index => credit
				creditFill(data[currLang]);
				break;
			default: alert('wrong page!');
		}

		//declare filling functions
		//main page
		function mainFill(){
			function fillMainInfo(){
				const lexicon1 = $('.info>p:first-of-type');
				const lexicon2 = $('.info>p:nth-of-type(2)');
				const keynote = $('.info>p:last-of-type');
				console.log(currLang);
				switch (currLang){
					case 'ko':
					lexicon1.html('1. (무엇을 알아내기 위해) 깊이 파고들다.');					
					lexicon2.html('2. (장비 따위의) 필요한 것을 찾기 위해 노력하다.');
					keynote.html('2020년, 준비를 마친 인부들이 이동을 시작했다. 오프라인에서 온라인으로, 전신의 움직임에서 손가락의 작은 움직임으로, 땅 위에서 픽셀 위로…. 수많은 변화 속에서 그들은 존재를 지속할 수 있는 무언가를 찾아 나섰다. 각자가 속한 그리드와 픽셀 위에서, 28명의 인부들은 삽을 들고 더 깊은 아래를 향해 웹 속을 파고든다. 그 끝에 발굴해낸 새로운 가능성과 존재의 조각이 궁금하다면,')
					break;
					case 'en':
					lexicon1.html('1. search thoroughly for information');
					lexicon2.html('2. try hard to provide the money, equipment, etc.');
					keynote.html('In 2020, after extensive preparation, workers began to move. From offline to online, from full-body movement to small finger movements, from the ground to pixels above... Amidst a multitude of changes, they longed to find that “something” (or quality) that will rest immortally. On top of the grid and pixels to which they correspond, twenty-eight members hold a shovel to dig deeper into the web. If you are curious about the new possibilities and pieces unearthed,');
					break;
				}
			}

			function fillMainTagText(data){
				const blockTags = Array.prototype.slice.call($('.blockTag'))
				blockTags.map(e=>{
					let i = blockTags.indexOf(e);
					const blockContent = [data[i].name, data[i].title];
					e.childNodes[0].childNodes[0].textContent = blockContent[0];
					e.childNodes[1].textContent = blockContent[1];
				})
			}
			fillMainInfo(data);
			fillMainTagText(dataSheet[currLang]);
			return data;
		}

		//project page
		function projectFill(data){
			$('div').scrollTop(0);

			function renderTxt(data){
				console.log(data);
				let isTarget = function(el){
					if(el.query === paramsObj.student) return true;
				};
				console.log(isTarget(data));
				let targetData = data.find(isTarget);
				console.log(targetData);
				
				urlSet(targetData);				
				
				let changeList = Array.prototype.slice.call($('[data-detect]'))
				changeList.map(v=>{
					v.textContent = targetData[v.dataset.detect]
				})
				indexFill(data);
			}

			//fill index
			function indexFill(data){
				$('.index').empty();
				$.each(data,i=>{
					let indexLink = $('<a></a>');
					if(paramsObj.lang){
						indexLink.attr('href','?student='+data[i].query+'&lang='+currLang);
					}else{
						indexLink.attr('href','?student='+data[i].query);
					}
					indexLink.attr('class','spa');
					$('.index').append(indexLink);
					indexLink.html('<p>'+data[i].name+'</p>');
				})
			}

						//sticky image fill
			function stickyImageSet(student){
				const imgBoxes = Array.prototype.slice.call($('.stick-img'))
				imgBoxes.map(e=>{
				let i = imgBoxes.indexOf(e)+1;
				//e.src = 'image/'+student+i+'.png';
				e.src = 'image/'+''+i+'.png';
				})
			}

			function urlSet(data){
				const urlLink = $('.url');
				urlLink.attr({
					'href': `https://${data['url']}`,
					'title': data['name']
				});
			}			
			
			stickyImageSet(paramsObj.student);
			renderTxt(data);
			return data;
		}

		//credit page
		function creditFill(data){
			return data;
		}

		makeMultilingual();
		resolve(data);
	})
}


function changeLangBtn (){
	$(".ko").toggleClass('altLangOff');
	$(".ko").toggleClass('altLangOn');
	$(".en").toggleClass('altLangOn');
	$(".en").toggleClass('altLangOff');
  }


//promise chain
console.log(url)
	checkUrl(url)
		.then(p=>{
			if(p.lang) {removeLang(p)}
	 	})
initData(dataKO,'ko')
	.then(()=>initData(dataEN,'en'))
	.then(contentDraw)
	.then(data=>{
		console.log(data);
		mixedData = arrRandomShuffle(data);
		console.log(mixedData);
		return mixedData;
	})
	.then(contentFill)
	.then(()=>(currLang == 'ko'
		?($('.ko').addClass('altLangOff'),$('.en').addClass('altLangOn'))
		:($('.ko').addClass('altLangOn'),$('.en').addClass('altLangOff'))
	))
	.catch(console.log)




const reFill = function(url){
	checkUrl(url)
		.then(p=>{
			if(p.lang) {removeLang(p)}
	 	})
	console.log(dataSheet);

	contentDraw(dataSheet)
		.then(contentFill(mixedData))
		.catch(console.log)
		
}


//bind popstate event
$(window).bind('popstate', function() {
    let returnLocation = history.location || document.location;
    console.log(returnLocation)
    let href = returnLocation.search;
	reFill(href);

});

// a tag onclick pushstate event
$(document).on('click', 'a.spa', function(e) {
	//e.preventDefault();
	let href = $(this).attr('href');
	console.log(href);
	history.pushState(href,'', href);
	url = window.location.href;

	reFill(url);
	return false;
});

// shuffle array randomly
function arrRandomShuffle(obj){
	const copiedObj = JSON.parse(JSON.stringify(obj));
    const array1 = copiedObj['ko'];
    const array2 = copiedObj['en'];
    for (let i = array1.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array1[i], array1[j]] = [array1[j], array1[i]];
        [array2[i], array2[j]] = [array2[j], array2[i]];
    }
    console.log(obj);
    console.log(copiedObj);
    return copiedObj;
}


//lang btn onclick event;
const langBtn = $('.altLangOn');
function altLang(){
	console.log(currLang);
	if(currLang === 'ko'){
		url = window.location.href;
		currLang = 'en';
		if(paramsObj.student){
			url = url.concat('&lang=en');
		}else{
			url = url.concat('?lang=en')
		}
		console.log(url);
		history.pushState(url,'', url);
		let href = window.location.search;
		console.log(href);
		reFill(href);
		console.log(dataSheet);
	}else if(currLang === 'en'){
		url = window.location.href;
		currLang = 'ko';
		url = url.replace(langPart,'');
		console.log(url);
		history.pushState(url,'', url);
		let href = window.location.search;
		console.log(href);
		reFill(href);
		console.log(dataSheet);
	}
	changeLangBtn();
	$('html').attr('lang', currLang)
}
$(document).on('click', '.altLangOn', altLang)


function makeMultilingual(){
	$("body").multilingual([
		'en', 'num'
	]);
}
