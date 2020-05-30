// required packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

// storing express in app
const app = express();

// accessing EJS instead of .html
app.set('view engine', 'ejs');

// accessing bodyParser
app.use(bodyParser.urlencoded({
  extended: true
}));

// storing files in public folder
app.use(express.static("public"));

// connecting to MongoDB using mongoose
mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// articles Schema for mongoose
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
}, {
  versionKey: false
});

// articles model for mongoose
const Article = mongoose.model("Article", articleSchema);

/////////////////////////Requests targeting all articles///////////////////////////////////
app.route("/articles")

  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        foundArticles.forEach((element) => {
          console.log(element.title);
        });
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all of the articles");
      } else {
        res.send(err);
      }
    });
    // .put()
    // .patch()
  });


/////////////////////////Requests targeting specific articles///////////////////////////////////
app.route("/articles/:articleTitle")

  .get(function(req, res) {
    Article.findOne({ title: req.params.articleTitle }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found.")
      }
    });
  });

/////////////////////////GET Articles///////////////////////////////////
app.get("/", function(req, res) {
  res.render("index.ejs")
});

/////////////////////////POST a Article///////////////////////////////////
app.post("/compose", function(req, res) {
  const newArticle = new Article({
    title: req.body.articleTitle,
    content: req.body.articleContent
  });
  newArticle.save()
  res.redirect("/")
});

// Listening for server start
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
