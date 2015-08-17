var state = 'waitingForStarting';

Template.measureBP.helpers({
    'statusEqualTo':function(status){
        return Session.get('status') === status;
    },
    'status':function(){
        return Session.get('status');
    },
    'bloodPressure':function(){
        return Session.get('bloodPressure');
    },
    'bloodPressureRate': function () {
        return Session.get('bloodPressure')/200 * 100;
    },
    'wave':function(){
        return Session.get('wave');
    },
    'HP':function(){
        return Session.get('HP');
    },
    'LP':function(){
        return Session.get('LP');
    },
    'heartRate':function(){
        return Session.get('heartRate');
    },
    'address': function(){
        return Session.get('address');
    },
    'message' : function () {
        return Session.get('message');
    },
    debug:false
})


Template.measureBP.events({
    'click #startToMeasure': function () {
        console.log('startDiscovery...');
        var success = function(msg){
            var address = JSON.parse(msg).address;
            Session.set('address',address);
            updateMessage(msg);
            BpManagerCordova.startMeasure(address,function(msg){
                updateMessage(msg);
                var jsonObj = JSON.parse(msg);
                if (jsonObj.msg === 'measure doing'){
                    Session.set('status','measuring');
                    if(jsonObj.pressure){
                        Session.set('bloodPressure',jsonObj.pressure);
                    }
                    if(jsonObj.wave){
                        Session.set('wave',jsonObj.wave);
                        renderWave(jsonObj.wave);
                    }
                }else if(jsonObj.msg === 'measure done'){
                    Session.set('status','measured');
                    Session.set('HP',jsonObj.highpressure);
                    Session.set('LP',jsonObj.lowpressure);
                    Session.set('heartRate',jsonObj.heartrate);
                }
            }, failureHandler);
        }

        updateMessage("searching...");
        Session.set('status','connectingToDevice');
        BpManagerCordova.startDiscovery("", success, failureHandler, "");
    },
    'click #bpresult':function(){
        Session.set('status','waitingToMeasure');
    }
});

function updateMessage(msg){
    Session.set('message', msg);
}

function failureHandler(msg){
    updateMessage(msg);
}

var data = [];



var renderWave = function(wave){

    var container = $("#flot-line-chart-moving");

    var maximum = container.outerWidth() / 2 || 300;

    if(data.length === 0){
        for(var i =0;i<maximum;i++){
            data[i] = 0;
        }
    }

    data = data.slice(wave.length);
    for(var i = 0;i<wave.length;i++){
        data.push(wave[i]);
    }

    var res = [];
    for (var i = 0; i < data.length; i++) {
        res.push([i, data[i]]);
    }

    series = [{
        data: res,
        lines: {
            fill: false
        }
    }];


    var plot = $.plot(container, series, {
        grid: {

            color: "#999999",
            tickColor: "#D4D4D4",
            borderWidth:0,
            minBorderMargin: 20,
            labelMargin: 10,
            backgroundColor: {
                colors: ["#ffffff", "#ffffff"]
            },
            margin: {
                top: 8,
                bottom: 20,
                left: 20
            },
            markings: function(axes) {
                var markings = [];
                var xaxis = axes.xaxis;
                for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
                    markings.push({
                        xaxis: {
                            from: x,
                            to: x + xaxis.tickSize
                        },
                        color: "#fff"
                    });
                }
                return markings;
            }
        },
        colors: ["#1ab394"],
        xaxis: {
            tickFormatter: function() {
                return "";
            }
        },
        yaxis: {
            min: 10,
            max: 50
        },
        legend: {
            show: true
        }
    });

    //plot.setData(series);
    plot.draw();


};