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
        return Session.get('bloodPressure')/250 * 100;
    },
    'wave':function(){
        return Session.get('wave');
    },
    'address': function(){
        return Session.get('address');
    },
    'message' : function () {
        return Session.get('message');
    },
    test:true
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
                        renderWave();
                    }
                }
            }, failureHandler);
        }

        updateMessage("searching...");
        Session.set('status','connectingToDevice');
        BpManagerCordova.startDiscovery("", success, failureHandler, "");
    }
});

function updateMessage(msg){
    Session.set('message', msg);
}

function failureHandler(msg){
    updateMessage(msg);
}


var renderWave = function(){


    var container = $("#flot-line-chart-moving");

    var data = [];

    series = [{
        data: getRandomData(),
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
            min: 0,
            max: 110
        },
        legend: {
            show: true
        }
    });

    // Update the random dataset at 25FPS for a smoothly-animating chart

    setInterval(function updateRandom() {
        series[0].data = getRandomData();
        plot.setData(series);
        plot.draw();
    }, 40);

};