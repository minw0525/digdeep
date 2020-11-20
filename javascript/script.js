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
function getData(lang){
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
}

// draw initial div in grid-container
function contentDraw(){

}

//promise chain
checkUrl(url)
    .then(p=>{
      p.lang ? removeLang(p) : keepLang(p)
      }
    )
		.catch(getData)
		.then(getData)

console.log(paramsObj);
console.log(currLang);
console.log(pageIdx);
