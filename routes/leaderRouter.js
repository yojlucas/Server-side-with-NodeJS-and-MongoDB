/*
Node Module that implements the Express router for the /leadership REST API. 
leaderRouter.js
by: Joy Lucas
1/15/2017
*/

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Leaders = require('../models/leadership');

var Verify = require('./verify');

var leaderRouter  = express.Router();
leaderRouter.use(bodyParser.json());

//Use the router, and Route all the items.
leaderRouter.route('/')
.get(function(req,res,next) {
    Leaders.find({}, function(err, leader) {
        if (err) next(err);
        res.json(leader);
    });
})
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req,res,next) {
    Leaders.create(req.body, function (err, leader) {
        if (err) next(err);
        console.log('Leader created!');
        var id = leader._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the leader with id: ' + id);
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Leaders.remove({}, function (err, resp) {
        if (err) next(err);
        res.json(resp);
    });
});

////Define another chain/router. Route the specific item in the leaderhip.
leaderRouter.route('/:leaderId')
.get(function (req, res, next) {
    Leaders.findById(req.params.leaderId, function (err, leader) {
        if (err) next(err);
        res.json(leader);
    });
})
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, {
        new: true
    }, function (err, leader) {
        if (err) next(err);
        res.json(leader);
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Leaders.findByIdAndRemove(req.params.leaderId, function (err, resp) {
        if (err) next(err);
        res.json(resp);
    });
}); //Completes the chaining.. (use semicolon)

module.exports = leaderRouter;