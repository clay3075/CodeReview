var mongoose = require('mongoose');
const path = require('path');

var commentSchema = mongoose.Schema({
    Author: String,
    Text: String,
    DateCreated: Date,
    Review: String,
    FileName: String
});

commentSchema.methods.TimeSinceCreated = function() {
    return convertMS(Date.now() - this.DateCreated);
}

commentSchema.methods.FilePath = function(root) {
    return path.join(root, this.Review, this.FileName);
}

function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    return { days: d, hours: h, minutes: m, seconds: s };
  };

module.exports = mongoose.model('comment', commentSchema);