const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let id1 = ''
let id2 = ''

suite('Functional Tests', function () {

    // POST tests
    suite('POST /api/issues/{project}', function () {
        // Create an issue with every field
        test('Create an issue with every field', function (done) {
            chai.request(server)
                .post('api/issues/test')
                .send({
                    issue_title: 'title',
                    issue_text: 'text',
                    created_by: 'created_name',
                    assigned_to: 'assigned_name',
                    status_text: 'status_test',
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, 'title')
                    assert.equal(res.body.issue_text, 'text')
                    assert.equal(res.body.created_by, 'created_name')
                    assert.equal(res.body.assigned_to, 'assigned_name')
                    assert.equal(res.body.status_text, 'status_test')
                    assert.equal(res.body.project, 'test')
                    id1 = res.body._id
                    console.log('id 1 has been set as ' + id1)
                    done();
                });

            // Create an issue with every field
            test('Create an issue with required fields', function (done) {
                chai.request(server)
                    .post('api/issues/test')
                    .send({
                        issue_title: 'title_required',
                        issue_text: 'text_required',
                        created_by: 'created_name_required',
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.issue_title, 'title_required')
                        assert.equal(res.body.issue_text, 'text_required')
                        assert.equal(res.body.created_by, 'created_name_required')
                        assert.equal(res.body.assigned_to, '')
                        assert.equal(res.body.status_text, '')
                        assert.equal(res.body.project, 'test')
                        id2 = res.body._id
                        console.log('id 2 has been set as ' + id2)
                        done();
                    });

                // Create an issue with missing required fields
                test('Create an issue with missing required fields', function (done) {
                    chai.request(server)
                        .post('/api/issues/test')
                        .send({
                            issue_title: 'title'
                        })
                        .end(function (err, res) {
                            assert.equal(res.body, 'required field(s) missing')
                            done();
                        });
                });
            });
        });
    });


    // GET tests
    suite('GET /api/issues/{project} => view issues', function (req, res) {

        // View issues on a project
        .get(function (req, res) {
        let project = req.params.project;

    })

            // View issues on a project with one filter
            .get(function (req, res) {
                let project = req.params.project;

            })

            // View issues on a project with multiple filters
            .get(function (req, res) {
                let project = req.params.project;

            })
    });

    // PUT tests
    suite('PUT /api/issues/{project} => update_text', function () {
        // Update one field on an issue
        test('Update one field on an issue', function (done) {
            chai.request(server)
                .put('api/issues/test')
                .send({
                    _id: id1,
                    issue_text: 'issue text'
                })
                .end(function (err, res) {
                    assert.equal(res.body, 'one issue updated successfully')
                    done()
                });
        });

        // Update multiple fields on an issue
        test('Update multiple fields on an issue', function (done) {
            chai.request(server)
                .put('api/issues/test')
                .send({
                    _id: id2,
                    issue_title: 'issue title',
                    issue_text: 'issue text'
                })
                .end(function (err, res) {
                    assert.equal(res.body, 'multiple issue fields updated successfully')
                    done()
                });
        })

            // Update an issue with missing _id
            .put(function (req, res) {
                let project = req.params.project;

            })

            // Update an issue with no fields to update
            .put(function (req, res) {
                let project = req.params.project;

            })

            // Update an issue with an invalid _id
            .put(function (req, res) {
                let project = req.params.project;

            })
    });

    suite('DELETE /api/issues/{project} => Delete issue', function (req, res) {
        // Delete an issue
        .delete (function (req, res) {
            let project = req.params.project;

        });

        // Delete an issue with an invalid _id
        .delete (function (req, res) {
            let project = req.params.project;

        });

        // Delete an issue with missing _id
        .delete (function (req, res) {
            let project = req.params.project;

        });
    });
});
