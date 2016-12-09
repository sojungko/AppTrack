const mongoose = require('mongoose');
// This file contains the position schema for adding positions (the form on the front page)
// to the database. Each field in this schema has a corresponding field in the index.html addposition form.
// Any changes to the form should be reflected in this schema.
// This is used only with the endpoint '/form' in the server file.

const ApplicationSchema = new mongoose.Schema({
  userId: Number,
  startDate: String,
  companyName: String,
  role: String,
  jobDescription: String,
  appliedThrough: String,
  contactName: String,
  contactPhone: Number,
  contactEmail: String,
  contactType: String,
  dateApplied: String,
  dateOfLastContact: String,
  replyReceived: Boolean,
  stages: Array,
  contractTime: Number,
  initialComp: Number,
  negotiated: Boolean,
  finalComp: Number,
  acceptReject: Boolean,
  isOpen: Boolean
})

module.exports = mongoose.model('Application', ApplicationSchema);
