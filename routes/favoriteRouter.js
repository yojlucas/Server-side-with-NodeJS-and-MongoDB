/*
favoriteRouter.js
2/6/2017
*/

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Dishes = require('../models/dishes');
var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')

  .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.find({'postedBy': req.decoded._id})
            .populate(['postedBy', 'dishes'])
            .exec(function (err, favorites) {
                if (err) return err;
                res.json(favorites);
            });
    })

 .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.find({'postedBy': req.decoded._id})
            .exec(function (err, favorites) {
                if (err) throw err;
                req.body.postedBy = req.decoded._id;

                if (favorites.length) {
                    var favoriteAlreadyExist = false;
                    if (favorites[0].dishes.length) {
                        for (var i = (favorites[0].dishes.length - 1); i >= 0; i--) {
                            favoriteAlreadyExist = favorites[0].dishes[i] == req.body._id;
                            if (favoriteAlreadyExist) break;
                        }
                    }
                    if (!favoriteAlreadyExist) {
                        favorites[0].dishes.push(req.body._id);
                        favorites[0].save(function (err, favorite) {
                            if (err) throw err;
                            console.log('This dish is already in the favorites list!');
                            res.json(favorite);
                        });
                    } else {

                    Favorites.create({postedBy: req.body.postedBy}, function (err, favorite) {
                        if (err) throw err;
                        favorite.dishes.push(req.body._id);
                        favorite.save(function (err, favorite) {
                            if (err) throw err;
                          console.log('A new favorite dish is added to the list!');
                            res.json(favorite);
                        });
                    })
                }
             } 
         });
    })

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.remove({'postedBy': req.decoded._id}, 
                         function (err, resp) {
            if (err) throw err;
            console.log('Favorite dish deleted from the list!');
            res.json(resp);
        })
    });

//******************************************************
favoriteRouter.route('/:objectId')

   .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.findById({'postedBy': req.decoded._id}, 
                       function (err, favorites) {
            if (err) return err;
            var favorite = favorites ? favorites[0] : null;

            if (favorite) {
                for (var i = (favorite.dishes.length - 1); i >= 0; i--) {
                    if (favorite.dishes[i] == req.params.dishId) {
                        favorite.dishes.remove(req.params.dishId);
                    }
                }
                favorite.save(function (err, favorite) {
                    if (err) throw err;
                    console.log('Favorite dish deleted!');
                    res.json(favorite);
                });
            } 
        });
    });

module.exports = favoriteRouter;
