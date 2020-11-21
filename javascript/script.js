const paramsObj = {};
const paramReg = /(\?|&)(\D|\d){1,}/;
const dataSheet = {"ko":[],"en":[]};
let filePath;
let pageIdx;
let currLang;
let url = window.location.href;


function checkUrl(url){
	const currParam = paramReg.exec(url) ? paramReg.exec(url)[0] : null;
	return new Promise((resolve, reject)=>{
		//check pathname
		filePath = window.location.pathname;
		switch (filePath) {
			case "/digdeep/index.html":
				pageIdx = 1;
				break;

			case "/digdeep/project":
				pageIdx = 2;
				break;

			case "/digdeep/credit":
				pageIdx = 3;
				break;

			//default: window.location.href = "https://digdeep.works"
		}

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
		}
		getParam();
		(currLang !== "en") ? resolve(paramsObj) : reject(currLang);
	});
}

const removeLang = params => {
  console.log(url)
  url = url.replace(langPart,"");
  currLang = "ko";
  console.log(url);
  console.log (currLang);
  window.location.href = url;
  return currLang;
}

const keepLang = params => {
  currLang = "ko";
  console.log(url);
  return currLang;
}


//get google sheet JSON data
function getData(){
	//google spreadsheet link
	const dataKO = "https://spreadsheets.google.com/feeds/list/1vDv8wHMb6u0cX1td924A1LfzPPB91hywmxkQLZb-dfU/1/public/full?alt=json";
	const dataEN = "https://spreadsheets.google.com/feeds/list/1vDv8wHMb6u0cX1td924A1LfzPPB91hywmxkQLZb-dfU/2/public/full?alt=json";
	class individual {
		constructor(title,name,url,description,team,personalUrl,email,query) {
			this.title = title;
			this.name = name;
			this.url = url;
			this.description = description;
			this.team = team;
			this.personalUrl = personalUrl;
			this.email = email;
			this.query = query;
		}
	}

	function parseData(lang, data){
		let request = new XMLHttpRequest();
		let entry;
		request.open("GET", data);
		request.onload=function(){
				let gSheet = JSON.parse(request.responseText);
				entry = gSheet['feed']['entry'];
				console.log(entry[0].gsx$title)
				for(let i in entry){ // 각 행에대해 아래 스크립트를 실행합니다.
					const person = new individual(entry[i].gsx$title['$t'], entry[i].gsx$name['$t'], entry[i].gsx$url['$t'], entry[i].gsx$description['$t'], entry[i].gsx$team['$t'], entry[i].gsx$personalurl['$t'], entry[i].gsx$email['$t'], entry[i].gsx$query['$t'])
					dataSheet[lang][i] = person;
				}
		}
		request.send();
	}

	parseData('ko', dataKO);
	parseData('en', dataEN);
	console.log(dataSheet);
	return pageIdx
}

// draw initial div in grid-container
function contentDraw(pageIdx){

	return new Promise(()=>{
		//global container
		const gC = $(".grid-container");

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
		function mainDraw(data){
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
			last.text('Dig deep.');

			gC.append(about);
			about.append(info);
			info.append(title, p1, p2, last);
			console.log(data);


			for(let i = 0; i<28; i++){
				const item = $('<div></div>');
				item.attr('class', `item booth diggingDiv ${data[i].query}` );
				item.css({
					//'background-image' : `url(\'image/diggingman.png\') center /contain no-repeat content-box`,
					'background' : 'url(\'image/diggingman.png\') center /contain no-repeat content-box'
				});
				const wrappingBlock = $("<div></div>");
				wrappingBlock.attr('class', 'wrappingBlock hidden');

				//create childern inside digging booth
				const thumbnail = $("<img>");
				const blockTag = $("<div></div>");
				thumbnail.attr('src',`image/1.png`);
				thumbnail.attr('class', `thumbnail ${data[i].query}Thumbnail`);
				/*item.css({
					//'background-image' : `url(\'image/diggingman.png\') center /contain no-repeat content-box`,
					'background' : 'url(\'image/diggingman.png\') center /contain no-repeat content-box'
				});*/
				blockTag.attr('class', `blockTag ${data[i].query}`)

				// work link
				const workLink = $("<a></a>");
				workLink.attr('href',`https://minw0525.000webhostapp.com/v2_member?student=${data[i].query}`);

				//append block tag
				const nameBlock = $(`<div></div>`);
				nameBlock.attr('class', 'nameBlock');
				const blockTitle = $(`<span></span>`);
				blockTitle.attr('class', 'title');

				//append span to nameBlock
				const tagName = $(`<span></span>`);
				tagName.attr('class','name')
				const arrow = $(`<span>→</span>`);

				gC.append(item);
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

			//make blank div
			for(let i = 0; i<8; i++){
				const item = $('<div></div>');
				item.attr('class', 'item booth' );
				gC.append(item);

			}
			return pageIdx;
		}

		//
		function projectDraw(pageIdx){

		}
	})
}

//promise chain
checkUrl(url)
    .then(p=>{
      p.lang ? removeLang(p) : keepLang(p)
      }
    )
		.catch(getData)
		.then(getData)
		.then(contentDraw)

console.log(paramsObj);
console.log(currLang);
console.log(pageIdx);
