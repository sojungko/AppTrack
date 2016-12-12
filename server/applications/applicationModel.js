const mongoose = require('mongoose');
// This file contains the position schema for adding positions (the form on the front page)
// to the database. Each field in this schema has a corresponding field in the index.html addposition form.
// Any changes to the form should be reflected in this schema.
// This is used only with the endpoint '/form' in the server file.

const ApplicationSchema = new mongoose.Schema({
	userId: String,
	startDate: Date,
	companyName: String,
	role: String,
	coverLetter: String,
	jobDescription: String,
	appliedThrough: String,
	contactName: String,
	contactPhone: Number,
	contactEmail: String,
	contactType: String,
	dateApplied: Date,
	dateOfLastContact: Date,
	replyReceived: Boolean,
	stages: Array,
	isOpen: Boolean
})

module.exports = mongoose.model('Application', ApplicationSchema);
