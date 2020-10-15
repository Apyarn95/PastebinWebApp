const mongoose = require('mongoose');

const PasteSchema = new mongoose.Schema({
    name:{
        type : String,
        required:true,
    },
    fname:{
        type:String,
        required : true
    },
    text:{
        type:String,
        required : true
     },
     key:{
         type:String,
         required : true
     }
})
const Paste = mongoose.model('Paste',PasteSchema);

module.exports = Paste