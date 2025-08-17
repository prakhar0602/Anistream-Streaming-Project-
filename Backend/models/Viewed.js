const mongoose = require('mongoose');

const viewedSchema = mongoose.Schema({
    userId:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }],
    animeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath:'animeModel' 
    },
    animeModel: {
        type: String,
        required: true,
        enum: ['Series', 'Movies']
    },
    viewedAt: {
        type: Date,
        default: Date.now
    }
});

const Viewed = mongoose.model('Viewed', viewedSchema);
module.exports = Viewed;