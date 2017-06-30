var data = '';
var records = '';
var area = document.getElementById('areaId');
var btns = document.querySelector('.menu');
var text = document.querySelector('.areaText');
var showdata = document.querySelector('.container');


var xhr = new XMLHttpRequest();
xhr.open('get', 'http://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
xhr.send(null);
xhr.onload = function () {
    data = (JSON.parse(xhr.responseText));

    //資料的陣列
    var records = data.result.records;

    //把資料中挑選區域,刪除重複的

    var recordsLen = records.length;

    var allZone = [];
    var menus;

    function upadateMenu() {
        for (var i = 0; i < recordsLen; i++) {
            allZone.push(records[i].Zone);
        }
        menus = allZone.filter(function (el, i, arr) {
            return arr.indexOf(el) === i;
        });

    }
    upadateMenu();

    //將資料帶入area中

    var str = '';
    for (var i = 0; i < menus.length; i++) {
        str += '<option>' + menus[i] + '</option>';
        area.innerHTML = '<option>--請選擇行政區--</option>' + str;
    }

    //監聽 area,btns的事件

    area.addEventListener('change', slectZone);

    btns.addEventListener('click', slectZone)

    //顯示選取區域的資料
    function slectZone(e) {
        var getValue = e.target.value;
        var boxStr = '';
        for (var i = 0; i < records.length; i++) {
            if (getValue == records[i].Zone) {
                text.textContent = records[i].Zone;
                boxStr += '<div class ="box">';
                boxStr += '<h3>' + records[i].Name + '</h3>';
                boxStr += '</div>';
            }
            showdata.innerHTML = boxStr;

        }

    }


}