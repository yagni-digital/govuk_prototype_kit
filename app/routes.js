var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('index');
});


// Example route: Passing data into a page
router.get('/examples/template-data', function (req, res) {
  res.render('examples/template-data', { 'name' : 'Foo' });
});

// Ineligible users are routed to '/ineligible.html'

router.get('/question-2', function (req, res) {

  var eligible = req.query.eligible;

  if (eligible == "Yes"){
    res.render('question-2');
  } else {
    res.render('ineligible');
  }
  
});

// Write the user input to the check your answers page

router.get('/check-your-answers-page', function (req, res) {

  var feat = req.query.feat;

  res.render('check-your-answers-page', { 'feat' : feat });
  
});



module.exports = router;