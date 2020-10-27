const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Timesheet = new Schema({
  year: {
    type: Number
  },
  week: {
    type: Number
  },
  month: {
    type: Number
  },
  date: {
    type: Date
  },
  project_id: {
    type: Schema.Types.ObjectId,
    ref:'Project'
  },
  description: {
    type: String
  },
  hours: {
    type: Number
  }
}, {
  collection: 'timesheet'
})

module.exports = mongoose.model('Timesheet', Timesheet)
