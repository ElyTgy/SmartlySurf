
        'use strict';

//TODO: make modifaible in the same page by user
const oneSecond = 1000;
const oneMinute = 60000
const saveInterval = oneSecond*10;
let intervalID;
let timeoutID;

//let tintervalID;
//let ttimeoutID;

let mediaRecorder;
let recordedBlobs;

const errorMsgElement = document.querySelector('span#errorMsg');
const recordedVideo = document.querySelector('video#recorded');
const recordButton = document.querySelector('button#record');
//const testButton = document.querySelector('button#test');

/*testButton.addEventListener('click', () => {
    if (testButton.textContent === 'Start test') {
      testStart();
    } else {
      testStop();
    }
  });

function testStart(){
    testButton.innerHTML = "Stopp test"
    tintervalID = setInterval(function(){
    console.log("started recording with interval id", tintervalID);
    ttimeoutID = setTimeout(function() {
        console.log("dtopped recording with interval", ttimeoutID);
    }, saveInterval - oneSecond)
}, saveInterval)}

function testStop()
{
    clearTimeout(ttimeoutID);  
    clearInterval(tintervalID);
    console.log("Stopped interval", tintervalID)
    console.log("stopped timeput", ttimeoutID)
    testButton.textContent = 'Start test';
}*/

function startMonitoring(){
    startCamera()
    .then(function(){
        recordButton.textContent = 'Stop Monitoring';
        startRecording();})
    .catch(function(err){
        errorMsgElement.innerHTML = `Refresh the page and enable camera acess`;
    })
}

async function startCamera()
{
    const constraints = {
        audio: false,
        video: {
          width: 1280, height: 720
        }
      };
      console.log('Using media constraints:', constraints);
    
      await init(constraints);
}

recordButton.addEventListener('click', () => {
  if (recordButton.textContent === 'Start Monitoring') {
    startMonitoring();
  } else {
    stopRecording();
  }
});

function download(){
  console.log("downloading")
  const blob = new Blob(recordedBlobs, {type: 'video/mp4'});
  console.log(blob);

  var reader = new FileReader();
  reader.onload = function () {
    let base64str = btoa(reader.result);
    console.log(base64str);
    //send request to server
    var xhr = new XMLHttpRequest();
    var url = "recieveRecording";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Dide sth");
        }
  };
  var data = JSON.stringify(
    {"startTime": "0", "endTime": "10", "dataBase64":base64str}
    );
  xhr.send(data);
  }
  reader.readAsBinaryString(blob);
  
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.mp4';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}

function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startRecording() {
  console.log("Start Recording")
  recordedBlobs = [];
  let options = {mimeType: 'video/webm;codecs=vp9,opus'};
  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
    download()

  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  console.log("Stopped reording")
  mediaRecorder.stop();
  recordButton.textContent = 'Start Monitoring';
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  window.stream = stream;

  const gumVideo = document.querySelector('video#gum');
  gumVideo.srcObject = stream;
}

async function init(constraints) {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
    print(stream)
}

  