/*
A Node Module Implementing a Node Application using Mongoose. 
promotions.js
by: Joy Lucas
1/21/2017
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

//***Create details for the schema.
var promoSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ""
    },
    featured: {
        type: Boolean,
        default:false
    },
    price: {
        type: Currency,
        required: true                      
    },
    description: {
        type: String,
        required: true
    }
},{
    timestamps: true //***Automaticall add timestamps in the document.   
});

//*** Create a model for the schema. 
//***Mongoose will create a collection with the plural version of Promotion
var Promotions = mongoose.model('Promotion', promoSchema);

//***Export to the Node Applications. 
module.exports = Promotions;