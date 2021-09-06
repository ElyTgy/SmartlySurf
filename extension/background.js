//// background.js

let count = 1;
let time;
let prevTabHost = null;

const oneSecond = 1000;
const oneMinute = 60000
const saveInterval = oneSecond*10;
let intervalID;

console.log("BACKGROUND")

/*setTimeout(async function(){
  let currentTab = await getCurrentTab();
  //console.log(currentTab);
  //console.log(currentTab.url);
  seperateEndpoint(currentTab.url)
}, oneSecond*10)*/

intervalID = setInterval(async function(){
    time = Date.now();
    let currentTab = await getCurrentTab();
    const {host, pathname} = seperateEndpoint(currentTab.url);
    if(host !== prevTabHost)
    {
        prevTabHost = host;
        //console.log("Sending", {"order": count, "time": time, "host":host, "pathname":pathname})
        sendData({"order": count, "time": time, "host":host, "pathname":pathname})
        count = count+1;
    }
    else{console.log("Same Page, not saving to database")}

}, oneSecond*5)

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  console.log(tab);
  return tab;
}

function seperateEndpoint(url)
{
  let urlObj = new URL(url);
  let host = urlObj.host
  console.log(urlObj.host);
  let pathname = urlObj.pathname;
  console.log(urlObj.pathname);
  return {"host":host, "pathname":pathname};
}

function sendData(data)
{
  /*var xhr = new XMLHttpRequest();
  var url = "recieveTabTime";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          console.log("Did sth");
      }
};
var data = JSON.stringify(data);
xhr.send(data);*/

const url = "http://localhost:3000/recieveTabTime";
/*fetch(url, {
    method : "POST",
    //body: new FormData(document.getElementById("inputform")),
    // -- or --
     body : JSON.stringify({
        // user : document.getElementById('user').value,
        // ...
        data
    })
}).then(
    response => response.json() // .json(), etc.
    // same as function(response) {return response.text();}
).then(
    html => console.log(html)
);*/


fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
.then((response) => response.json())
.then((data) => {
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});

}