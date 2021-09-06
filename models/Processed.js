const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProcessedVidSchema = new Schema({
    url: String,
    emotions: [
        {angry:Number},
        {disgust:Number},
        {fear:Number},
        {happy:Number},
        {neutral:Number},
        {sad:Number},
        {suprise:Number}
    ],
    time: Number
});

module.exports = mongoose.model('processedvideos', ProcessedVidSchema);

