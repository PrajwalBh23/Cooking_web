const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

db.once('open', function(){
    console.log('Connected successfull')
})

// models

require('./Category');
require('./Recipe');