//google spreadsheet link
const dataKO = "https://spreadsheets.google.com/feeds/list/1vDv8wHMb6u0cX1td924A1LfzPPB91hywmxkQLZb-dfU/1/public/full?alt=json";
const dataEN = "https://spreadsheets.google.com/feeds/list/1vDv8wHMb6u0cX1td924A1LfzPPB91hywmxkQLZb-dfU/2/public/full?alt=json";

const paramsObj = {};
const paramReg = /(\?|&)(\D|\d){1,}/;
const dataSheet = {"ko":[],"en":[]};
let filePath;
let pageIdx;
let currLang;
let url = window.location.href;
let entry;


function checkUrl(url){
	const currParam = paramReg.exec(url) ? paramReg.exec(url)[0] : null;
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
			currLang = paramsObj.lang;
			return paramsObj;
		}

		//check pathname
		filePath = window.location.pathname;
		function getFilePath(path){
			switch (path) {
				case "/digdeep/index.html":
					pageIdx = 1;
					console.log(pageIdx)
					return pageIdx;

				case "/digdeep/project":
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
	url = url.replace(langPart,"");
	currLang = "ko";
	console.log(url);
	console.log (pageIdx);
	window.location.href = url;
	return pageIdx;
}

const keepLang = params => {
	currLang = "ko";
	console.log(pageIdx);
	return pageIdx;
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
		const gC = $(".grid-container");
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
			const last = $('<h2></h2>');
			last.text('dig deep.');

			const jail = $('<div></div>');
			jail.attr('class', 'jail');

			for(let i = 0; i<28; i++){
				const item = $('<div></div>');
				item.attr('class', `item booth diggingDiv ${data[i].query}` );

				const video = $('<video autoplay muted loop></video>');
				//const source = $(`<source src="video/thumbnail_jiu.mp4" type="video/mp4">`)
				//video.attr('src',`video/thumbnail_${data[i].query}.mp4`)
				video.attr('src',`video/thumbnail_jiu.mp4`);
				//video.append(source);
				item.append(video);


				const wrappingBlock = $("<div></div>");
				wrappingBlock.attr('class', 'wrappingBlock hidden');

				//create childern inside digging booth
				const thumbnail = $("<img>");
				const blockTag = $("<div></div>");
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
				const workLink = $("<a></a>");
				if(paramsObj.lang){
					workLink.attr("href",`./project?student=${data[i].query}&lang=${currLang}`);
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
				info.append(title, p1, p2, last);

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

			return pageIdx;
		}
		//project page
		function projectDraw(data){
			gC.attr('style','grid-template-columns: repeat(3, minmax(100px, 1fr)) repeat(5, minmax(0, 1fr)) 160px 160px;');
			$('.logo h1').css('grid-column','1/2');

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

			return pageIdx;
		}
		resolve(dataSheet);
	})
}



//------------------------------------------------------------------------------
//------------------------------------------------------------------------------




// fill content in grid-container
function contentFill(dataSheet){

	console.log(pageIdx);
	return new Promise((resolve, reject)=>{
		//global container
		const gC = $(".grid-container");
		console.log(dataSheet);
		switch (pageIdx) {
			case 1: //page index => main
				mainFill(dataSheet[currLang]);
				break;
			case 2: //page index => project
				projectFill(dataSheet[currLang]);
				break;
			case 3: //page index => credit
				creditFill(dataSheet[currLang]);
				break;
			default: alert('wrong page!');
		}

		//declare filling functions
		//main page
		function mainFill(data){
			function fillMainInfo(data){
				const lexicon = $('.info>p:first-of-type');
				const keynote = $('.info>p:last-of-type');
				console.log(currLang);
				switch (currLang){
					case 'ko':
					console.log(lexicon);
					lexicon.html('1. (무엇을 알아내기 위해) 깊이 파고들다<br>2. (장비 따위의) 필요한 것을 찾기 위해 노력하다.');
					keynote.html('2020년, 준비를 마친 인부들이 이동을 시작했다.<br>오프라인에서 온라인으로, 전신의 움직임에서 손가락의 작은 움직임으로, 땅 위에서 픽셀 위로….<br>수많은 변화 속에서 그들은 존재를 지속할 수 있는 무언가를 찾아 나섰다.각자가 속한 그리드와 픽셀 위에서, 28명의 인부들은 삽을 들고 더 깊은 아래를 향해 웹 속을 파고든다. 그 끝에 발굴해낸 새로운 가능성과 존재의 조각이 궁금하다면,')
					break;
					case 'en':
					console.log(keynote);
					lexicon.html('1. search thoroughly for information<br>2. try hard to provide the money, equipment, etc.');
					keynote.html('In 2020, after extensive preparation, workers began to move.<br>From offline to online, from full-body movement to small finger movements, from the ground to pixels above...<br>Amidst a multitude of changes,they longed to find that “something” (or quality) that will rest immortally. On top of the grid and pixels to which they correspond, twenty-eight members hold a shovel to dig deeper into the web. If you are curious about the new possibilities and pieces unearthed,');
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
			fillMainTagText(data);
			return pageIdx;
		}

		//project page
		function projectFill(data){
			return pageIdx;
		}

		//credit page
		function creditFill(data){
			return pageIdx;
		}
		resolve();
	})
}




//promise chain
console.log(url)
checkUrl(url)
	.then(p=>{
		p.lang ? removeLang(p) : keepLang(p)
		}
	)
initData(dataKO,'ko')
	.then(()=>initData(dataEN,'en'))
	.then(contentDraw)
	.then(contentFill)
	.catch(console.log)
	

		/*
		.then(contentDraw(pageIdx,dataSheet))
		.then(()=>{
			console.log(paramsObj);
			console.log(currLang);
			console.log(pageIdx);
		})*/




//bind popstate event
$(window).bind('popstate', function(e) {
    let returnLocation = history.location || document.location;
    console.log(returnLocation)
    let href = returnLocation.search;
    //mainRefill(href);
		let prevState = e.state;
		console.log(e );
		$('body').innerHTML = prevState;
});

// a tag onclick pushstate event
$(document).on("click", "a", function(e) {
	e.preventDefault();
	let href = $(this).attr("href");
	console.log(href);
	history.pushState(href,"", href);
		checkUrl(url)
		.then(p=>{
			p.lang ? removeLang(p) : keepLang(p)
			}
		)
	initData(dataKO,'ko')
		.then(()=>initData(dataEN,'en'))
		.then(contentDraw)
		.then(contentFill); //spa로 만들기
	return false;
});
