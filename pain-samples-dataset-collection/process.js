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
  log('#logs', "The detector reports initialized");
  //Display canvas instead of video feed because we want to draw the feature points on it
  document.querySelector("#face_video_canvas").style.display = "block";
  document.querySelector("#face_video").style.display = "none";
});

function log(node_name, msg) {
  document.querySelector(node_name).innerHTML += "<span>" + msg + "</span><br />";
}

//function executes when Start button is pushed.
function onStart() {
  if (detector && !detector.isRunning) {
    document.querySelector("#logs").innerHTML = "";
    detector.start(JSSDK.Assets.wasm);
  }
  log('#logs', "Clicked the start button");
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

    document.querySelector('#results').innerHTML = "";
  }
};

//Add a callback to notify when camera access is allowed
detector.addEventListener("onWebcamConnectSuccess", function() {
  log('#logs', "Webcam access allowed");
});

//Add a callback to notify when camera access is denied
detector.addEventListener("onWebcamConnectFailure", function() {
  log('#logs', "webcam denied");
  console.log("Webcam access denied");
});

//Add a callback to notify when detector is stopped
detector.addEventListener("onStopSuccess", function() {
  log('#logs', "The detector reports stopped");
  document.querySelector("#results").innerHTML = "";
});

//Add a callback to receive the results from processing an image.
//The faces object contains the list of the faces detected in an image.
//Faces object contains probabilities for all the different expressions, emotions and appearance metrics
detector.addEventListener("onImageResultsSuccess", function(faces, image, timestamp) {
  document.querySelector('#results').innerHTML = "";
  log('#results', "Timestamp: " + timestamp.toFixed(2));
  log('#results', "Number of faces found: " + faces.length);
  if (faces.length > 0) {
    document.getElementById("custom-emotion").innerHTML = JSON.stringify(faces[0].emotions, function(key, val) {
      return val.toFixed ? Number(val.toFixed(0)) : val;
    })
    document.getElementById("custom-expression").innerHTML = JSON.stringify(faces[0].expressions, function(key, val) {
      return val.toFixed ? Number(val.toFixed(0)) : val;
    })
    
    log('#results', "Appearance: " + JSON.stringify(faces[0].appearance));
    log('#results', "Emotions: " + JSON.stringify(faces[0].emotions, function(key, val) {
      return val.toFixed ? Number(val.toFixed(0)) : val;
    }));
    log('#results', "Expressions: " + JSON.stringify(faces[0].expressions, function(key, val) {
      return val.toFixed ? Number(val.toFixed(0)) : val;
    }));
    log('#results', "Emoji: " + faces[0].emojis.dominantEmoji);
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

var paincount = 0;
var nopaincount = 0;

function painSample(){
  var painSamples = []
  painSamples.push(document.getElementById('custom-emotion').innerHTML);
  painSamples.push(document.getElementById('custom-expression').innerHTML);
  var j = JSON.stringify(painSamples)

  const url = "http://makeathon.us-east-1.elasticbeanstalk.com/"; 

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
      painSamples
  }));

  paincount = paincount + 1;
  document.getElementById("paincount").innerHTML = "Pain Count = " + paincount;
}

function noPainSample(){
  var noPainSamples = []
  noPainSamples.push(document.getElementById('custom-emotion').innerHTML);
  noPainSamples.push(document.getElementById('custom-expression').innerHTML);

  const url = "http://makeathon.us-east-1.elasticbeanstalk.com/nopain"; 

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
      noPainSamples
  }));

  nopaincount = nopaincount + 1;
  document.getElementById("nopaincount").innerHTML = "No Pain Count = " + nopaincount;
}