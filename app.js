const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override'); 
const bodyParser = require('body-parser')
const RawVideo = require('./models/RawVid');

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

app.get('/', (req, res) => {
    res.render("home.ejs")
});

app.get('/record', (req, res) => {
    res.render('recording.ejs')
});

app.post('/recieveRecording', async function (req, res) {
    let newVid = new RawVideo({startTime:req.body.startTime, endTime:req.body.endTime, video:req.body.video});
    await newVid.save()
});

app.get('/stats', (req, res) => {
    res.send("Stats fetched from db are shown here");
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
