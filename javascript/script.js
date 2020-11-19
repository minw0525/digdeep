const paramsObj = {};
const paramReg = /(\?|&)(\D|\d){1,}/;
let filePath;
let pageIdx;
let currLang;
let dataSheet;
let url = window.location.href;


function checkUrl(url){
	const currParam = paramReg.exec(url)[0];
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
			case '/digdeep/index.html':
				pageIdx = 1;
				break;

			case '/digdeep/project':
				pageIdx = 2;
				break;

			case '/digdeep/credit':
				pageIdx = 3;
				break;

			//default: window.location.href = "https://digdeep.works"
		}
		getParam();
		(currLang !== "en") ? resolve(paramsObj) : reject(paramsObj);
	});
}

const removeLang = params => {
  console.log(url)
  url = url.replace(langPart,"");
  currLang = "ko";
  console.log(url);
  console.log (currLang);
  window.location.href = url;
  return params;
}

const keepLang = params => {
  currLang = "ko";
  console.log(url);
  return params;
}


checkUrl(url)
    .then(p=>{
      p.lang ? removeLang(p) : keepLang(p)
      }
    )

console.log(paramsObj);
console.log(currLang);
console.log(pageIdx);
