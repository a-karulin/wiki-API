const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});
const articlesSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articlesSchema);

app.route("/articles/:article")

.get(function(req, res){
  Article.findOne({title: req.params.article}, function(err, foundArticle){
    if(!err){
      res.send(foundArticle);
    }else{
      res.send("No articles matching that was found.");
    }
  })
})

.put(function(req, res){
  Article.updateOne({title: req.params.article},
    {title: req.body.title, content: req.body.content},
    function(err){
      if(!err){
        res.send("Successfully updated a new article.");
      }else {
        res.send(err);
      }
    });
  }
)

.patch(function(req, res){
  Article.updateOne({title: req.params.article},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated a new article.");
      }else {
        res.send(err);
      }
    });
})

.delete(function(req, res){
  Article.deleteOne({title: req.params.article}, function(err){
    if (!err){
      res.send("Successfully deleted article");
    }else{
      res.send(err);
    }
  });
})

app.route("/articles")

.get(
  function(req, res){
    Article.find(function(err, foundArticles){
      if(!err){
        res.send(foundArticles);
      }else{
        res.send(err);
      }
    });
  }
)

.post(function(req, res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  })
  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new article.");
    }else {
      res.send(err);
    }
  })
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all articles");
    }else{
      res.send(err);
    }
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
