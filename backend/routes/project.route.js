const express = require('express');
const app = express();
const projectRoute = express.Router();

// Project model
let Project = require('../model/Project');

// Add Project
projectRoute.route('/add-project').post((req, res, next) => {
  Project.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get all project
projectRoute.route('/').get((req, res) => {
  Project.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  }).populate('client_id')
})

// Get single project
projectRoute.route('/read-project/:id').get((req, res) => {
  Project.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update project
projectRoute.route('/update-project/:id').put((req, res, next) => {
  Project.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Project successfully updated!')
    }
  })
})

// Delete project
projectRoute.route('/delete-project/:id').delete((req, res, next) => {
  Project.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = projectRoute;
