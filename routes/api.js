'use strict';

var expect = require('chai').expect;
let mongoose = require('mongoose');
let mongodb = require('mongodb');
const connectDB = require('/workspace/boilerplate-project-issuetracker/db.js');

// Schemas
const Issue = require('/workspace/boilerplate-project-issuetracker/models/Issue.js');
const Project = require('/workspace/boilerplate-project-issuetracker/models/Project.js')

module.exports = function (app) {

  // Connect to mongoDB
  connectDB();

  app.route('/api/issues/:project')

    // POST new issue object
    .post(async function (req, res) {
      let project = req.params.project;

      // Error if fields are missing
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        return res.json({ error: 'required field(s) missing' })
      }

      // Create newIssue object
      let newIssue = new Issue({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date().toUTCString(),
        updated_on: new Date().toUTCString(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        open: true,
        status_text: req.body.status_text || '',
        project: project
      });

      try {
        const savedIssue = await newIssue.save();
        res.json(savedIssue);
      } catch (error) {
        res.status(500).json({ error: 'Failed to save issue' });
      }
    })

    // GET issue info
    .get(async function(req, res => {

    })

    // PUT Update issues
    .put(async function (req, res) {
      const project = req.params.project;
      const { _id, ...updateFields } = req.body;
    
      // Ensure an _id is provided
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
    
      // Check if any fields are updated
      if (Object.keys(updateFields).length === 0) {
        return res.json({ error: 'no update field(s) sent', '_id': _id });
      }
    
      // Add or update the 'updated_on' field
      updateFields.updated_on = new Date().toUTCString();
    
      try {
        // Find the issue by _id
        const issue = await Issue.findById(_id);
    
        if (!issue) {
          return res.json({ error: 'could not update', '_id': _id });
        }
    
        // Update the fields in the issue object
        Object.keys(updateFields).forEach((key) => {
          if (updateFields[key] !== '') {
            issue[key] = updateFields[key];
          }
        });
    
        // Save the updated issue
        await issue.save();
    
        // Respond with a success message in the expected format
        res.json({ result: 'successfully updated', '_id': _id });
      } catch (error) {
        console.error('Update error:', error); // Log error for debugging
        res.status(500).json({ error: 'could not update', '_id': _id });
      }
    })

    // DELETE issues    
    .delete(function (req, res) {
      let project = req.params.project;

    });
};
