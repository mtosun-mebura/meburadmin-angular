const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Invoice = new Schema({
  date: {
    type: Date
  },
  year: {
    type: Number
  },
  month: {
    type: Number
  },
  client_id: {
    type: Schema.Types.ObjectId,
    ref:'Client'
  },
  invoice_number: {
    type: String
  },
  invoice_number_index: {
    type: Number
  },
  partial_invoice: {
    type: Boolean
  }
}, {
  collection: 'invoice'
})

module.exports = mongoose.model('Invoice', Invoice)
