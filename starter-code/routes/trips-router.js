const express = require('express');
const TripModel = require('../models/trip-model.js');
const router = express.Router();
const multer = require('multer');

const myUploader = multer(
  {
    dest: __dirname + "/../public/uploads"
  }
);

router.get("/my-trips", (req, res, next) => {

  TripModel.find(
    {owner: req.user._id},
    (err, foundTrips) => {
      if(err){
        next(err);
        return;
      }

      res.locals.listOfTrips = foundTrips;
      res.render("trips/index.ejs")
    }
  );
});
router.get("/trips/new", (req, res, next) => {

  res.render("trips/trip-form.ejs")
});

//<form method="post" action="/trips">
router.post("/trips", myUploader.single("tripPhoto"), (req, res, next) => {


  //multer creates req.file with all the file info
  console.log(req.file);

  const theTrip = new TripModel({
      name: req.body.tripName,
      photoUrl: "/uploads/" + req.file.filename,
      desc: req.body.tripDesc,
      owner: req.user._id //logged in user's ID from passport
    });
    theTrip.save((err) => {
      if(err){
        next(err);
        return;
      }
      req.flash("tripFeedback", "Trip added.");
      res.redirect("/");
    });

});


router.get("/trips/:tripId/edit", (req, res, next) => {

  TripModel.findById(
    req.params.tripId,
    (err, tripFromDb) => {
      if(err){
        next(err);
        return;
      }
      if(tripFromDb.owner.toString() !== req.user._id.toString()){
        req.flash("securityError", "You can only edit your own trips.");
        res.redirect("/my-trips");
        return;
      }
      res.locals.tripInfo = tripFromDb;
      res.render("trips/trip-edit.ejs")
    }
  );
});

router.post("/trips/:tripId", myUploader.single("tripPhoto"), (req, res, next) => {

  TripModel.findById(
    req.params.tripId,
    (err, tripFromDb) => {
      if(err){
        next(err);
        return;
      }
      if(tripFromDb.owner.toString() !== req.user._id.toString()){
        req.flash("securityError", "You can only edit your own trips.");
        res.redirect("/my-trips");
        return;
      }

      tripFromDb.name = req.body.tripName;
      tripFromDb.desc = req.body.tripDesc;

      //check if req.file, it will be underfined if user doesnt upload anything
      if(req.file){
        tripFromDb.photoUrl = "/uploads/" + req.file.filename;
      }

      tripFromDb.save((err) => {
        if(err){
          next(err);
          return;
        }
        req.flash("updateSuccess", "Trip Update Successful!");
        res.redirect("/my-trips");
      });
    }
  );
});

module.exports = router;
