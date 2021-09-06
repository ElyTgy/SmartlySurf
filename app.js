const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override'); 
const bodyParser = require('body-parser')
const RawVideo = require('./models/RawVid');
const TabTime = require('./models/TabTime');
const ProcessedVid = require('./models/Processed');
const {spawn} = require("child_process");


mongoose.connect('mongodb://localhost:27017/smartly-surf', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(methodOverride('_method'));
app.use(express.json({limit: '5000mb'}));
app.use(express.urlencoded({limit: '5000mb'}));
app.use("/public", express.static('public'))
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            
   optionSuccessStatus:200,
}
app.use(cors(corsOptions)) 


//TODO: refactor and take to another file
const python = spawn('python', ['./EmotionRecognition/sample.py']);
python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
   });
   python.on('close', (code) => {
   console.log(`child process close all stdio with code ${code}`);
   console.log(dataToSend)
   });
console.log("test: After Script");

app.get('/', (req, res) => {
    res.render("home.ejs")
});

app.get('/record', (req, res) => {
    res.render('recording.ejs')
});

app.post('/recieveRecording', async function (req, res) {
    if(req.body.video !== "")
    {
        let newVid = new RawVideo({startTime:req.body.startTime, endTime:req.body.endTime, video:req.body.video});
        await newVid.save()
    }
});

app.post('/recieveTabTime', async function (req, res) {
    let newTabInfo = new TabTime({order:req.body.order, time:req.body.time, host:req.body.host, pathname:req.body.pathname});
    await newTabInfo.save()
});

app.get('/stats', async (req, res) => {
    let data = await ProcessedVid.find( {} ).sort({time:-1})
    data = data.slice(0,10);
    
    let finalData = []
    for(let i = 0; i < 10; i++)
    {
        let result = JSON.parse(JSON.stringify(data[i]));
        let urlObj = new URL(result["url"]);
        let host = urlObj.host
        result["website_name"] = host

        let hours = Math.floor(result["time"] / 3600);
        result["time_hrs"] = hours;
        
        result["emotions_names"] = []
        result["emotions_minutes"] = []
        for(let j = 0; j < 7; j++)
        {
            let current_key = Object.keys(result["emotions"][j])[0]
            result["emotions_names"].push(current_key)
            let time_secs = result["emotions"][j][current_key]
            result["emotions_minutes"].push(Math.floor(time_secs/60))
        }
        
        finalData.push(result)
    }
    
    console.log(finalData)
    //res.send("res")
    res.render("stats.ejs", {finalData});
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
