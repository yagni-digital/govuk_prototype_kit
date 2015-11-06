var express = require('express');
var router = express.Router();
var marked = require('marked');
var fs = require('fs');
var path = require('path');

router.get('/', function (req, res) {
  res.render('index');
});

router.get('/docs/:page', function (req, res) {
  var doc = fs.readFileSync(path.join(__dirname, "../docs/" + req.params.page + ".md"), "utf8");
  console.log(doc);
  var html = marked(doc);
  res.render("docs", {"document": html});
});

router.get('/examples/template-data', function (req, res) {
  res.render('examples/template-data', { 'name' : 'Foo' });
});

// add your routes here

module.exports = router;