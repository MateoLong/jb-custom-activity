var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST to execute */
router.post('/execute', async function(req, res, next) {
  var inArguments = req.body.inArguments;
  console.log('req.body.inArguments: ' + req.body.inArguments);
  var msg = req.body.inArguments.name + ' ' + req.body.inArguments.lastName;  
  res.status(200).json({ "error": false, "message": msg, "data": null});  
});

/* POST to publish */
router.post('/publish', async function(req, res, next) {
  res.status(200).json({ "error": false, "message": "publish success", "data": null});  
});

module.exports = router;
