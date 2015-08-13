/**
 * Created by zhouhongfeng on 8/13/15.
 */
var mac = "";
function addScanDevice(message) {
    var obj = JSON.parse(message);
    if (obj.msg == "discovery doing"){
        var rootlist = document.getElementById("devicelist");
        subList = document.createElement("li");
        subList.addEventListener("click", function(){
            console.log('connectDevice!');
            mac = obj.address;
            var success = function(message){
                console.log(message);
                Session.set('counter', message);
            }

            var failure = function(message){
                console.log(message);
                Session.set('counter', message);
            }
            BpManagerCordova.connectDevice(mac, success, failure);});
        subTextList = document.createTextNode(obj.name + " - " + obj.address);
        subList.appendChild(subTextList);
        rootlist.appendChild(subList);
    }
}