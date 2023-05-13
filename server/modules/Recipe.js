const { text } = require('express');
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: 'This fiies is required'
    },
    description:{
        type: String,
        required: 'This fiies is required'
    },
    ingredients:{
        type: Array,
        required: 'This fiies is required'
    },
    category:{
        type: String,
        /*enum - is for only choose from selected or in array*/
        enum: ['Indian', 'American','Thailand', 'Korean', 'Asian','Japan', 'Spanish'],
        required: 'This fiies is required'
    },
    image:{
        type: String,
        required: 'This fiies is required'
    },

});

// to search in the name and description.
recipeSchema.index({ name:'text', description : 'text' })


module.exports = mongoose.model('Recipe',recipeSchema);