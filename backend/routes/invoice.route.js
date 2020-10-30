const express = require('express');
const app = express();
const invoiceRoute = express.Router();

// Invoice model
let Invoice = require('../model/Invoice');

// Add Invoice
invoiceRoute.route('/add-invoice').post((req, res, next) => {
  Invoice.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get all invoice
invoiceRoute.route('/').get((req, res) => {
  Invoice.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data.sort((a, b) => Number(b.invoice_number_index) - Number(a.invoice_number_index)))
    }
  }).populate('client_id')
})

// Get all invoices by year, month and client
invoiceRoute.route('/:year/:month/:client').get((req, res) => {
  Invoice.find({year: req.params.year, month: req.params.month, client_id: req.params.client}).find((error, data) => {
    if(error) {
      return next(error)
    } else {
      res.json(data)
    }
  }).populate('client_id')
})

// Get single invoice
invoiceRoute.route('/read-invoice/:id').get((req, res) => {
  Invoice.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
    }
  })
})


// Update invoice
invoiceRoute.route('/update-invoice/:id').put((req, res, next) => {
  Invoice.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Invoice successfully updated!')
    }
  })
})

// Delete invoice
invoiceRoute.route('/delete-invoice/:id').delete((req, res, next) => {
  Invoice.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = invoiceRoute;
