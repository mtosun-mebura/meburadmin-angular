const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Project = new Schema({
  client_id: {
    type: Schema.Types.ObjectId,
    ref:'Client'
  },
  project_code: {
    type: String
  },
  project_name: {
    type: String
  }
}, {
  collection: 'project'
})

module.exports = mongoose.model('Project', Project)
