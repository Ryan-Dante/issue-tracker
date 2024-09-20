const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let id1 = "";
let id2 = "";

suite("Functional Tests", function () {
  // POST tests
  suite("POST /api/issues/{project}", function () {
    test("Create an issue with every field", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "title",
          issue_text: "text",
          created_by: "created_name",
          assigned_to: "assigned_name",
          status_text: "status_test",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(res.body.created_by, "created_name");
          assert.equal(res.body.assigned_to, "assigned_name");
          assert.equal(res.body.status_text, "status_test");
          id1 = res.body._id;
          done();
        });
    });

    test("Create an issue with required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "title_required",
          issue_text: "text_required",
          created_by: "created_name_required",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "title_required");
          assert.equal(res.body.issue_text, "text_required");
          assert.equal(res.body.created_by, "created_name_required");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          id2 = res.body._id;
          done();
        });
    });

    test("Create an issue with missing required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "title",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
    });
  });

  // GET tests
  suite("GET /api/issues/{project} => view array of issues", function () {
    test("View issues on a project", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], "issue_title");
          assert.property(res.body[0], "issue_text");
          assert.property(res.body[0], "created_by");
          assert.property(res.body[0], "assigned_to");
          assert.property(res.body[0], "status_text");
          assert.property(res.body[0], "open");
          assert.property(res.body[0], "created_on");
          assert.property(res.body[0], "updated_on");
          assert.property(res.body[0], "_id");
          done();
        });
    });

    test("View issues on a project with one filter", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({ issue_title: "title" })
        .end(function (err, res) {
          res.body.forEach((issue) => {
            assert.equal(issue.issue_title, "title");
          });
          done();
        });
    });

    test("View issues on a project with multiple filters", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({ issue_title: "title", issue_text: "text" })
        .end(function (err, res) {
          res.body.forEach((issue) => {
            assert.equal(issue.issue_title, "title");
            assert.equal(issue.issue_text, "text");
          });
          done();
        });
    });
  });

  // PUT tests
  suite("PUT /api/issues/{project} => update_text", function () {
    test("Update one field on an issue", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: id1,
          issue_text: "issue text",
        })
        .end(function (err, res) {
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, id1);
          done();
        });
    });

    test("Update multiple fields on an issue", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: id2,
          issue_title: "issue title",
          issue_text: "issue text",
        })
        .end(function (err, res) {
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, id2);
          done();
        });
    });

    test("Update an issue with missing _id", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          issue_title: "title",
        })
        .end(function (err, res) {
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });

    test("Update an issue with no fields to update", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({ 
          _id: id1 
        })
        .end(function (err, res) {
          assert.equal(res.body.error, "no update field(s) sent");
          assert.equal(res.body._id, id1);
          done();
        });
    });

    test("Update an issue with an invalid _id", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
           _id: "invalid_id"
           })
        .end(function (err, res) {
          assert.equal(res.body.error, 'no update field(s) sent');
          assert.equal(res.body._id, "invalid_id");
          done();
        });
    });
  });

  // DELETE tests
  suite("DELETE /api/issues/{project} => Delete issue", function () {
    test("Delete an issue", function (done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({
          _id: id1,
        })
        .end(function (err, res) {
          assert.equal(res.body.result, "successfully deleted");
          assert.equal(res.body._id, id1);
          done();
        });
    });

    test("Delete an issue with an invalid _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({
          _id: "invalid_id",
        })
        .end(function (err, res) {
          assert.equal(res.body.error, "could not delete");
          assert.equal(res.body._id, "invalid_id");
          done();
        });
    });

    test("Delete an issue with missing _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({})
        .end(function (err, res) {
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });
  });
});
