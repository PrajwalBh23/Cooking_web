const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required: 'This fiies is required'
    },
    image:{
        type:String,
        required: 'This fiies is required'
    },

});



module.exports = mongoose.model('Category',categorySchema);