const mongoose = require('mongoose');

const CovideSchema = new mongoose.Schema({
    cured: Array,
    deaths: Array,
    totalCases: Array,
    date: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Covid', CovideSchema);