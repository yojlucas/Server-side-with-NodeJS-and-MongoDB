/*
A Node Module Implementing a Node Application using Mongoose. 
leadership.js
by: Joy Lucas
1/21/2017
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//***Create details for the schema.
var leaderSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default:false
    },
    abbr: {
        type: String,
        required: true                      
    },
    description: {
        type: String,
        required: true
    }
},{
    timestamps: true //***Automatically add timestamps in the document.   
});

//*** Create a model for the schema. 
//***Mongoose will create a collection with the plural version of Promotion
var Leaders = mongoose.model('Leader', leaderSchema);

//***Export to the Node Applications. 
module.exports = Leaders;