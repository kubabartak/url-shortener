// structure of database

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const urlSchema = new Schema({
    originalUrl: String, 
    shorterUrl: String
}, {timestamps: true});

const ModelClass = mongoose.model('short_urls', urlSchema);

module.exports=ModelClass;