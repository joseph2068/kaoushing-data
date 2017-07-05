var data = '';
var records = '';
var area = document.getElementById('areaId');
var btns = document.querySelector('.menu');
var text = document.querySelector('.areaText');
var showdata = document.querySelector('.showintro');


function getData() {
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

        btns.addEventListener('click', slectZone);

        //顯示選取區域的資料
        function slectZone(e) {
            var getValue = e.target.value;
            var getName = e.target.nodeName;
            var boxStr = '';
            if (getName !== 'INPUT' && getName !== 'SELECT') {
                return;
            }
            for (var i = 0; i < records.length; i++) {
                if (getValue == records[i].Zone) {
                    text.textContent = records[i].Zone;
                    boxStr += '<div class="card">';
                    boxStr += '<img src="' + records[i].Picture1 + '">';
                    boxStr += '<h3>' + records[i].Name + '</h3>';
                    boxStr += '<p><i class="fa fa-clock-o" aria-hidden="true"></i>' + records[i].Opentime + '</p>';
                    boxStr += '<p><i class="fa fa-map-marker" aria-hidden="true"></i>' + records[i].Add + '</p>';
                    boxStr += '<p><i class="fa fa-mobile" aria-hidden="true"></i>' + records[i].Tel + '<i class="fa fa-tag" aria-hidden="true"></i>' + records[i].Ticketinfo + '</p>';
                    boxStr += '</div>';
                }
                showdata.innerHTML = boxStr;


            }
            // //新增google map
            updateMap(getValue)

        }


        // 從這邊開始
        var markers = [];
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: {
                lat: 22.754394,
                lng: 120.309045
            }
        });

        // 清除 makers 的 function (google map api 提供的)
        function clearMarkers() {
            setMapOnAll(null);
            markers = [];
        }

        function setMapOnAll(map) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
            console.log(markers);
        }

        function updateMap(zone) {
            var newRecords = []; // 選擇的區域會整理到這裡面來
            if (zone) {
                for (var i = 0; i < records.length; i++) {
                    if (zone == records[i].Zone) {
                        newRecords.push(records[i]);
                    }
                }
            } else {
                newRecords = records;
            }

            clearMarkers(); // 清除多餘 maker

            //跑迴圈依序將值塞入到 marker
            for (i = 0; i < newRecords.length; i++) {
                var str = {
                    title: records[i].Name,
                    position: {
                        lng: Number(newRecords[i].Px),
                        lat: Number(newRecords[i].Py)
                    },
                    map: map
                };
                var marker = new google.maps.Marker(str);
                markers.push(marker);
            }
            console.log(marker);
        }
        updateMap(); // 第一次執行

    }; // Http End
}




//gotop按鈕
$(function () {
    $("#gotop").click(function () {
        jQuery("html,body").animate({
            scrollTop: 0
        }, 1000);
    });
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('#gotop').fadeIn("fast");
        } else {
            $('#gotop').stop().fadeOut("fast");
        }
    });
});

function initMap() {
    getData()
    //設定中心點座標

}