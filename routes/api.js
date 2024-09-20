'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');
const connectDB = require('/workspace/boilerplate-project-issuetracker/db.js');

// Schemas
const Issue = require('/workspace/boilerplate-project-issuetracker/models/Issue.js');
const Project = require('/workspace/boilerplate-project-issuetracker/models/Project.js');

module.exports = function (app) {

  // Connect to mongoDB
  connectDB();

  app.route('/api/issues/:project')

    // GET all issues
    .get(async (req, res) => {
      let project = req.params.project;

      try {
        const currentProject = await Project.findOne({ name: project });

        if (!currentProject) {
          return res.json({ error: 'project not found' });
        }

        const query = { projectId: currentProject._id, ...req.query };
        const issues = await Issue.find(query);

        if (issues.length === 0) {
          return res.json({ error: 'no issues found', project });
        }

        res.json(issues);
      } catch (err) {
        res.json({ error: 'could not get issues' });
      }
    })

    // POST new issue object
    .post(async function (req, res) {
      let project = req.params.project;

      // Check if the project already exists
      let currentProject = await Project.findOne({ name: project });

      // If the project doesn't exist, create it
      if (!currentProject) {
        currentProject = new Project({ name: project });
        await currentProject.save();
      }

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
        projectId: currentProject._id,
      });

      try {
        const savedIssue = await newIssue.save();
        res.json(savedIssue);
      } catch (error) {
        res.status(500).json({ error: 'Failed to save issue' });
      }
    })

    // PUT Update issues
    .put(async (req, res) => {
      const project = req.params.project;
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;

      // If the _id is missing
      if (!req.body._id) {
        return res.json({ error: "missing _id" });
      }

      // Check if no fields are updated
      if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && open === undefined) {
        return res.json({ error: 'no update field(s) sent', '_id': _id });
      }

      try {
        const updatedIssue = await Issue.findByIdAndUpdate(_id, {
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
          open,
          updated_on: new Date(), 
        }, { new: true });

        if (!updatedIssue) {
          return res.json({ error: 'could not update', '_id': _id });
        }

        res.json({ result: 'successfully updated', '_id': _id });
        console.log('Update body:', req.body);
      } catch (error) {
        res.json({ error: 'could not update', '_id': _id });
      }
    })

    // DELETE issues    
    .delete (async (req, res) => {
    const { _id } = req.body;

    // Ensure an _id is provided
    if (!_id) {
      return res.json({ error: 'missing _id' });
    }

    try {
      // Find and remove the issue by _id
      const deletedIssue = await Issue.findByIdAndDelete(_id);

      if (!deletedIssue) {
        return res.json({ error: 'could not delete', '_id': _id });
      }

      res.json({ result: 'successfully deleted', '_id': _id });
    } catch (err) {
      res.json({ error: 'could not delete', '_id': _id });
    }
  });
};