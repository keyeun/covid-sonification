const max = require('max-api');
const request = require('request');
const cheerio = require('cheerio');
let service_key = 'h7ns18Q0%2BOKN4mlakTp8a6ZLoMXFchIPdZhpIWKG0r6xQgnblNmxfs%2FXwY2JCobmjU%2BX8f8GytTDe1b%2BzOBTzg%3D%3D'; // insert your service_key(Decoding) from data.go.kr

function today(day) {
  let today = new Date();
  let year = String(today.getFullYear());
  let month = String(today.getMonth() + 1).padStart(2, '0');
  let date = ("00"+(dt.getDate()-day).toString()).slice(-2);
  return year + month + date;
}

let toggle = false;

var dt = new Date();
var dt_ago = new Date();
dt_ago.setMonth(dt_ago.getMonth() - 1)
var date_str = dt.getFullYear().toString() + ("00"+(dt.getMonth()+1).toString()).slice(-2)+ ("00"+(dt.getDate()-1).toString()).slice(-2);
var date_ago = dt.getFullYear().toString() + ("00"+(dt.getMonth()+1).toString()).slice(-2)+ ("00"+(dt.getDate()-2).toString()).slice(-2);
var dayconfirm = {} // 금일 확진자수
var dayconfirmy = {} // 어제 확진자수
var death = {} //금일 사망자수


max.addHandler('monitor', (v) => {
  toggle = v == 1 ? true : false;
});


var url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson';
var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + service_key; /* Service Key*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('30'); /* */
queryParams += '&' + encodeURIComponent('startCreateDt') + '=' + encodeURIComponent(date_str); /* */
queryParams += '&' + encodeURIComponent('endCreateDt') + '=' + encodeURIComponent(date_str); /* */


var queryParamstwo = '?' + encodeURIComponent('serviceKey') + '=' + service_key; /* Service Key*/
queryParamstwo += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
queryParamstwo += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('30'); /* */
queryParamstwo += '&' + encodeURIComponent('startCreateDt') + '=' + encodeURIComponent(date_ago); /* */
queryParamstwo += '&' + encodeURIComponent('endCreateDt') + '=' + encodeURIComponent(date_ago); /* */


function get_covid_data() {
  request({
    url : url+ queryParams,
    method:'GET'
  },function(error,response,body){
    var $=cheerio.load(body);
    $('item').each(function(index,data){
      var gubun = $(data).children('gubun').text();
      var data1 = parseFloat($(data).children('incDec').text());
      setData(gubun,data1);
    })
    // $('item').each(function(i,elem){
    //   ulList[i] = {
    //     date: $(this).find('stdDay').text(),
    //     confirmnum: parseFloat($(this).find('incDec').text()),
    //     gubun: $(this).find('gubun').text()
    //   };
      // var gubun = $(this).find('gubun').text();
      // var covidate = $(this).find('stdDay').text();
      // var data1 = parseFloat($(this).find('incDec').text());
      // setData(gubun,data1);
    // });
    max.post(date_ago);
    max.outlet(dayconfirm);
    // max.outlet([
    //   Number(parseFloat(dayconfirm["서울"])),
    //   Number(parseFloat(dayconfirm["광주"])),
    //   Number(parseFloat(dayconfirm["경기"])),
    //   Number(parseFloat(dayconfirm["제주"]))
    // ]);
  })
}

function get_covid_yesterday() {
  request({
    url : url+ queryParamstwo,
    method:'GET'
  },function(error,response,body){
    var $=cheerio.load(body);
    $('item').each(function(index,data){
      var gubun = $(data).children('gubun').text();
      var data1 = parseFloat($(data).children('incDec').text());
      setYes(gubun,data1);
    })
    max.post(date_ago);
    max.outlet(dayconfirmy);
  })
}

function covid_death(){
  request({
    url : url+ queryParams,
    method:'GET'
  },function(error,response,body){
    var $=cheerio.load(body);
    $('item').each(function(index,data){
      var gubun = $(data).children('gubun').text();
      var data2 = parseFloat($(data).children('deathCnt').text());
      setDeah(gubun,data2);
    })

    max.outlet(death);
  })
}

function setData(index,data1){
  dayconfirm[index] = data1;
}

function setDeah(index,data){
  death[index] = data;
}

function setYes(index,data1){
  dayconfirmy[index] = data1;
}


max.addHandler("test",() => {
  max.outlet(date_str)
})

max.addHandler("death",() => {
  covid_death();
})



max.addHandler('bang', () => {
  get_covid_data();
});

max.addHandler('compares', (n) => {
  get_covid_yesterday();
});



