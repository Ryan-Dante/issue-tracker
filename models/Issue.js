const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
    assigned_to: { type: String, default: '' },
    open: { type: Boolean, default: true },
    status_text: { type: String, default: '' },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, 
}, {
    strictQuery: 'throw'
});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;


