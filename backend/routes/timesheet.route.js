const express = require('express');
const app = express();
const timesheetRoute = express.Router();

// Timesheet model
let Timesheet = require('../model/Timesheet');

// Add Timesheet
timesheetRoute.route('/add-timesheet').post((req, res, next) => {
  Timesheet.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get all timesheet
timesheetRoute.route('/').get((req, res) => {
  Timesheet.find((error, data) => {
    if(error) {
      return next(error)
    } else {
      res.json(data)
    }
  }).populate('project_id')
})

// Get all timesheet by year and week
timesheetRoute.route('/:year/:week').get((req, res) => {
    Timesheet.find({year: req.params.year, week: req.params.week}).find((error, data) => {
      if(error) {
        return next(error)
      } else {
        res.json(data)
      }
    }).populate({
      path: 'project_id',
      populate: {
        path:'client_id'
      }
    })
})

// Get all timesheet by year and week
timesheetRoute.route('/invoice/:year/:month').get((req, res) => {
    Timesheet.find({year: req.params.year, month: req.params.month}).find((error, data) => {
      if(error) {
        return next(error)
      } else {
        res.json(data)
      }
    }).populate({
      path: 'project_id',
      populate: {
        path:'client_id'
      }
    })
})

// Get single timesheet
timesheetRoute.route('/read-timesheet/val/:id').get((req, res) => {
  Timesheet.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update timesheet
timesheetRoute.route('/update-timesheet/:id').put((req, res, next) => {
  Timesheet.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Timesheet successfully updated!')
    }
  })
})

// Delete timesheet
timesheetRoute.route('/delete-timesheet/:id').delete((req, res, next) => {
  Timesheet.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = timesheetRoute;
