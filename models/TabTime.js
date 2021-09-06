const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TabTimeSchema = new Schema({
    order: Number,
    time: Number,
    host: String,
    pathname: String
});

module.exports = mongoose.model('TabTime', TabTimeSchema);

