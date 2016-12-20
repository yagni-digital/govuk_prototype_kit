var express = require('express')
var router = express.Router()
var marked = require('marked')
var fs = require('fs')
var path = require('path')

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

router.get('/markdown/:contentType/:filename', function(req, res){

  var markdownPath = path.join(__dirname, '/markdown/', req.params.filename + '.md')
  console.log('path ' + markdownPath)
  var markdown = fs.readFileSync(markdownPath, 'utf8')
  console.dir(markdown)
  var markdownHTML = marked(markdown)

  res.render(req.params.contentType, {markdownHTML: markdownHTML})

})

// add your routes here

module.exports = router
