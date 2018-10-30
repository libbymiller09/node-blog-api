const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);


describe("Blog Post", function() {
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });

  //GET requests tests
  
  it("should list items on GET", function() {
    return chai
      .request(app)
      .get("/blog-posts")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("array");
        expect(res.body.length).to.be.at.least(1);
        const expectedKeys = ["title", "author", "content", "date"];
        res.body.forEach(function(item) {
          expect(item).to.be.a("object");
          expect(item).to.include.keys(expectedKeys);
        });
      });
    });
});

//POST requests tests

it("should add an item on POST", function() {
  const newItem = { title: "Blog", author: "Elisabeth Miller", content: "Blogging", date: "October 25th" };
  return chai
    .request(app)
    .post("/recipes")
    .send(newItem)
    .then(function(res) {
      expect(res).to.have.status(201);
      expect(res).to.be.json;
      expect(res.body).to.be.a("object");
      expect(res.body).to.include.keys("title", "author", "content", "date");
      expect(res.body.id).to.not.equal(null);
      expect(res.body).to.deep.equal(
        Object.assign(newItem, { id: res.body.id })
      );
    });
});

//PUT requests tests

it("should update items on PUT", function() {
  const updateData = {
    title: "Blog",
    author: "Elisabeth Miller",
    content: "Blogging",
    date: "October 25th"
  };

  return (
    chai
      .request(app)
      .get("/blog-posts")
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai
          .request(app)
          .put(`/blog-posts/${updateData.id}`)
          .send(updateData);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
        expect(res).to.be.json;
        expect(res.body).to.be.a("object");
        expect(res.body).to.deep.equal(updateData);
      })
  );
});

//DELETE requests tests

it("should delete items on DELETE", function() {
  return (
    chai
      .request(app)
      .get("/blog-posts")
      .then(function(res) {
        return chai.request(app).delete(`/blog-posts/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      })
  );
});
