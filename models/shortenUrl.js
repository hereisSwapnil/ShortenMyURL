const mongoose = require('mongoose');
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 5 });

const shortenUrlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortenUrl: {
        type: String,
        required: true,
        default: uid.rnd()
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const shortenUrl = mongoose.model('shortenUrl', shortenUrlSchema);

module.exports = shortenUrl;