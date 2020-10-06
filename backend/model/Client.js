const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Client = new Schema({
  business_name: {
    type: String
  },
  finance_email_address: {
    type: String
  },
  person_name: {
    type: String
  },
  department_name: {
    type: String
  },
  address: {
    type: String
  },
  zip_code: {
    type: String
  },
  city: {
    type: String
  },
  invoice_inner: {
    type: String
  }
  ,payment_days: {
    type: Number
  },
  start_date: {
    type: String
  },
  end_date: {
    type: String
  },
  rate: {
    type: Number
  },
  contract: {
    type: String
  }
}, {
  collection: 'client'
})

module.exports = mongoose.model('Client', Client)
