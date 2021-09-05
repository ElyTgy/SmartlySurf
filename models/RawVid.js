const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RawVidSchema = new Schema({
    startTime: Number,
    endTime: Number,
    video: String
});

module.exports = mongoose.model('RawVideo', RawVidSchema);

