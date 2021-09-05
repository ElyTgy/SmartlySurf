
        'use strict';

let startTime;
let endTime;

let mediaRecorder;
let recordedBlobs;

const errorMsgElement = document.querySelector('span#errorMsg');
const saveSucess = document.querySelector('span#saved');
const recordedVideo = document.querySelector('video#recorded');
const recordButton = document.querySelector('button#record');

recordButton.addEventListener('click', () => {
  if (recordButton.textContent === 'Start Monitoring') {
    startMonitoring();
  } else {
    stopRecording();
  }
});

function startMonitoring(){
    startCamera()
    .then(function(){
        recordButton.textContent = 'Stop Monitoring';
        saveSucess.innerHTML = "";
        startRecording();})
    .catch(function(err){
        errorMsgElement.innerHTML = `Enable camera access <a href="chrome://settings/content/camera">here</a> `;
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


function startRecording() {
  console.log("Start Recording")
  recordedBlobs = [];
  let options = {mimeType: 'video/webm;codecs=vp9,opus'};
  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error ('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  mediaRecorder.onstop = (event) => {
    endTime = Date.now();
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
    download()

  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  startTime = Date.now();
  console.log('MediaRecorder started', mediaRecorder);
}


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
    {"startTime": startTime, "endTime": endTime, "video":base64str}
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

  saveSucess.innerHTML = "Successfully saved video! Please be patient while we update your information"
}

function stopRecording() {
  console.log("Stopped reording")
  mediaRecorder.stop();
  recordButton.textContent = 'Start Monitoring';
}

function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  window.stream = stream;

  const gumVideo = document.querySelector('video#gum');
  gumVideo.srcObject = stream;
}

async function init(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    console.error('navigator.getUserMedia error:', e);
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

  