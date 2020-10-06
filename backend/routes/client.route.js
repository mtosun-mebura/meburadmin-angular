const express = require('express');
const app = express();
const clientRoute = express.Router();

// Client model
let Client = require('../model/Client');

// Add Client
clientRoute.route('/add-client').post((req, res, next) => {
  Client.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get all client
clientRoute.route('/').get((req, res) => {
  Client.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single client
clientRoute.route('/read-client/:id').get((req, res) => {
  Client.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update client
clientRoute.route('/update-client/:id').put((req, res, next) => {
  Client.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Client successfully updated!')
    }
  })
})

// Delete client
clientRoute.route('/delete-client/:id').delete((req, res, next) => {
  Client.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = clientRoute;
