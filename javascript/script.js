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
			case "/digdeep/":
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
/*
function getData(params){
  return new Promise((resolve, reject)=>{
    $.getJSON("json_sample.json",function(data) {
      console.log(data)
      dataSheet = data[currLang];
      resolve(dataSheet);
    })
});
}
*/
function getData(lang){
	//google spreadsheet link
	const dataKO = "https://spreadsheets.google.com/feeds/list/1vDv8wHMb6u0cX1td924A1LfzPPB91hywmxkQLZb-dfU/1/public/basic?alt=json-in-script&callback=parseJSON";
	const dataEN = "https://spreadsheets.google.com/feeds/list/1vDv8wHMb6u0cX1td924A1LfzPPB91hywmxkQLZb-dfU/2/public/basic?alt=json-in-script&callback=parseJSON";
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

	function parseJSON(lang, dataUrl){
		$.getJSON(dataUrl, function(data){
			let entry = data.feed.entry;//구글 스프레드 시트의 모든 내용은 feed.entry에 담겨있습니다.
			for(let i in entry){ // 각 행에대해 아래 스크립트를 실행합니다.
				const person = new individual(entry[i].gsx$title[0], entry[i].gsx$name[0], entry[i].gsx$url[0], entry[i].gsx$description[0], entry[i].gsx$team[0], entry[i].gsx$personalurl[0], entry[i].gsx$email[0], entry[i].gsx$query[0])
				dataSheet[lang][i] = person
			}
		})
	}

	parseJSON(lang, dataKO)
}



checkUrl(url)
    .then(p=>{
      p.lang ? removeLang(p) : keepLang(p)
      }
    )
		.catch(console.log)

console.log(paramsObj);
console.log(currLang);
console.log(pageIdx);
