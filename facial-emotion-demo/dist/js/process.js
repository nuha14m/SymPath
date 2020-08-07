var pspiglobal = 0;
var pspiarr =[]
var pscount=0;
var engglobal =0;
var domexpression ="";
var JSSDK = JSSDK || {};
JSSDK.Assets = {
  "wasm": {
      "affdex-native-bindings.wasm": "https://download.affectiva.com/js/wasm/affdex-native-bindings.wasm",
      "affdex-native-bindings.js": "https://download.affectiva.com/js/wasm/affdex-native-bindings.js",
      "affdex-native-bindings.data": "https://download.affectiva.com/js/wasm/affdex-native-bindings.data",
      "affdex-worker.js": "https://download.affectiva.com/js/wasm/affdex-worker.js"
  }
};

// SDK Needs to create video and canvas nodes in the DOM in order to function
// Here we are adding those nodes a predefined div.
var divRoot = document.querySelector("#affdex_elements");
var width = 640;
var height = 480;
var faceMode = affdex.FaceDetectorMode.LARGE_FACES;
//Construct a CameraDetector and specify the image width / height and face detector mode.
var detector = new affdex.CameraDetector(divRoot, width, height, faceMode);

//Enable detection of all Expressions, Emotions and Emojis classifiers.
detector.detectAllEmotions();
detector.detectAllExpressions();
detector.detectAllEmojis();
detector.detectAllAppearance();
//Add a callback to notify when the detector is initialized and ready for runing.
detector.addEventListener("onInitializeSuccess", function() {
  console.log("The detector reports initialized");
  //Display canvas instead of video feed because we want to draw the feature points on it
  document.querySelector("#face_video_canvas").style.display = "block";
  document.querySelector("#face_video").style.display = "none";
});

function log(node_name, msg) {
  document.querySelector(node_name).innerHTML += "<span>" + msg + "</span><br />";
}

window.onload = function () {
    if (detector && !detector.isRunning) {
       detector.start(JSSDK.Assets.wasm);
     }
     console.log("Clicked the start button");
    /*
    var ctx = document.getElementsByClassName("chartjs-gauge");
    var chart = new Chart(ctx, {
        type: "tsgauge",
        data: {
            datasets: [{
                backgroundColor: ["#c3eba2", "#0fdc63", "#fd9704", "#ff7143"],
                borderWidth: 0,
                gaugeData: {
                    value: 200,
                    valueColor: "#00000",
                },
                gaugeLimits: [0, 100, 200, 300, 400]
            }]
        },
        options: {
                events: [],
                showMarkers: true
        }
    });
    function change_gauge(chart, val ){
         chart.data.datasets.gaugeData.value = val;
         chart.update();
       }
    
    function accelerate(){
        change_gauge(chart, pspiglobal);
    }
     accelerate();
    window.setInterval(function(){
      accelerate();
    }, 1000);*/

    
    var ctx = document.getElementsByClassName("chartjs-gauge");
    var chart = new Chart(ctx, {
        type:"doughnut",
        data: {
            labels : ["Red","Green"],
            datasets: [{
                label: "Gauge",
                data : [0, 300],
                backgroundColor: [
                    "rgb(255, 99, 132)",
                    "rgb(147, 224, 130)",
                    "rgb(255, 205, 86)"
                ]
            }]
        },
        options: {
            circumference: Math.PI,
            rotation : Math.PI,
            cutoutPercentage : 90, // precent
            plugins: {
                          datalabels: {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                              borderColor: '#ffffff',
                  color: function(context) {
                                  return context.dataset.backgroundColor;
                              },
                              font: function(context) {
                    var w = context.chart.width;
                    return {
                      size: w < 512 ? 18 : 20
                    }
                  },
                  align: 'start',
                  anchor: 'start',
                  offset: 10,
                              borderRadius: 4,
                              borderWidth: 1,
                  formatter: function(value, context) {
                                  var i = context.dataIndex;
                    var len = context.dataset.data.length - 1;
                    if(i == len){
                      return null;
                    }
                                  return value+' mph';
                              }
                }
            },
            legend: {
                display: false
            },
            tooltips: {
                enabled: false
            }
        }
    });

    function change_gauge(chart, label, data){
      chart.data.datasets.forEach((dataset) => {
        if(dataset.label == label){
          dataset.data = data;
        }
      });
      chart.update();
    }

    function accelerate(){
      change_gauge(chart,"Gauge",[pspiglobal, 300-pspiglobal]);
      document.getElementById("pspi-val").innerHTML="Pain Index: "+pspiglobal;
        if(pspiglobal<100){document.getElementById("threshold").innerHTML="LOW";}
        else if(pspiglobal<200){document.getElementById("threshold").innerHTML="MILD";}
        else{document.getElementById("threshold").innerHTML="HIGH";}
        var engbar = document.getElementById("eng-bar");
        engbar.innerHTML = Math.floor(engglobal) + "%";
        engbar.style.width= Math.floor(engglobal) + "%";
    }

    // Start sequence
    accelerate();
    window.setInterval(function(){
      accelerate();
    }, 1000);
    
    
    
    
}

//function executes when Start button is pushed.
function onStart() {
  if (detector && !detector.isRunning) {
    detector.start(JSSDK.Assets.wasm);
  }
  console.log("Clicked the start button");
}

//function executes when the Stop button is pushed.
function onStop() {
  log('#logs', "Clicked the stop button");
  if (detector && detector.isRunning) {
    detector.removeEventListener();
    detector.stop();
  }
};

//function executes when the Reset button is pushed.
function onReset() {
  log('#logs', "Clicked the reset button");
  if (detector && detector.isRunning) {
    detector.reset();
  }
};

//Add a callback to notify when camera access is allowed
detector.addEventListener("onWebcamConnectSuccess", function() {
  console.log("Webcam access allowed");
});

//Add a callback to notify when camera access is denied
detector.addEventListener("onWebcamConnectFailure", function() {
  console.log( "webcam denied");
  console.log("Webcam access denied");
});

//Add a callback to notify when detector is stopped
detector.addEventListener("onStopSuccess", function() {
  console.log("The detector reports stopped");
  document.querySelector("#results").innerHTML = "";
});

//Add a callback to receive the results from processing an image.
//The faces object contains the list of the faces detected in an image.
//Faces object contains probabilities for all the different expressions, emotions and appearance metrics
detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
  document.querySelector('#results').innerHTML = "";
  if (faces.length > 0) {
   /* log('#results', "Emotions: " + JSON.stringify(faces[0].emotions, function(key, val) {
      return val.toFixed ? Number(val.toFixed(0)) : val;
    }));*/
    engglobal =faces[0].emotions["engagement"]
    var expr =faces[0].expressions;
    var pspi = expr["browFurrow"] + Math.max(expr["cheekRaise"], expr["lidTighten"]) + Math.max(expr["noseWrinkle"], expr["upperLipRaise"]) + expr["eyeClosure"];

    var all = faces[0]
    const url = "http://makeathon.us-east-1.elasticbeanstalk.com/"; 

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        all
    }));
    xhr.responseType = 'text';

    var txtResp = ""
    xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                console.log(xhr.response);
                txtResp = xhr.responseText
            }
        }
    };

    pscount+=1;
    pspiarr.push(pspi);
    if(pscount==1){
        pspiglobal = Math.floor(pspi);}
    if(pscount%8==0){
        idx = Array.from(Array(pscount).keys())
        sum = idx.map(i => pspiarr[i]).reduce((p,c) => p + c);
        pspiglobal = Math.floor(sum/8);
        pspiarr=[]; pscount=0;
    }
    if(document.querySelector('#face_video_canvas') != null)
      drawFeaturePoints(image, faces[0].featurePoints);
  }

  setTimeout(detector.captureNextImage, 150);
});

//Draw the detected facial feature points on the image
function drawFeaturePoints(img, featurePoints) {
  var contxt = document.querySelector('#face_video_canvas').getContext('2d');

  var hRatio = contxt.canvas.width / img.width;
  var vRatio = contxt.canvas.height / img.height;
  var ratio = Math.min(hRatio, vRatio);

  contxt.strokeStyle = "#FFFFFF";
  for (var id in featurePoints) {
    contxt.beginPath();
    contxt.arc(featurePoints[id].x,
      featurePoints[id].y, 2, 0, 2 * Math.PI);
    contxt.stroke();
  }
}
