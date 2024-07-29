var express = require('express');
var router = express.Router();
var OAuthClient = require('intuit-oauth');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

let oauth2_token_json = null;
let redirectUri = '';
let oauthClient = null;

const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Endpoint to start the OAuth flow
// router.post('/authUri', (req, res) => {
//   oauthClient = new OAuthClient({
//       clientId: req.body.clientId,
//       clientSecret: req.body.clientSecret,
//       environment: req.body.environment,
//       redirectUri: req.body.redirectUri
//   });

//   const authUri = oauthClient.authorizeUri({
//       scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
//       state: 'testState',
//   });

//   res.json({ authUri }); // Send the authorization URL back to the frontend
// });

router.get('/authUri', urlencodedParser, function (req, res) {
  oauthClient = new OAuthClient({
    clientId: req.query.json.clientId,
    clientSecret: req.query.json.clientSecret,
    environment: req.query.json.environment,
    redirectUri: req.query.json.redirectUri,
  });

  const authUri = oauthClient.authorizeUri({
    scope: [OAuthClient.scopes.Accounting],
    state: 'intuit-test',
  });
  res.send(authUri);
});

// Handle the callback to extract the `Auth Code` and exchange them for `Bearer-Tokens`
router.get('/callback', function(req, res) {
  oauthClient
  .createToken(req.url)
  .then(function(authResponse) {      
      // Store the tokens securely
      oauth2_token_json = JSON.stringify(authResponse.json, null, 2);
      res.send('Token acquired and stored');
  })
  .catch(function(e) {
      console.error('The error message is:', e.originalMessage);
      console.error(e.intuit_tid);
      res.send('Failed to acquire token: ' + e);
  });
});

/* POST to execute */
router.post('/execute', async function(req, res, next) {
  var inArguments = req.body.inArguments;
  console.log('req.body.inArguments: ' + req.body.inArguments);
  var msg = req.body.inArguments.staticValue;  
  res.status(200).json({ "error": false, "message": msg, "data": null});  
});

/* POST to publish */
router.post('/publish', async function(req, res, next) {
  res.status(200).json({ "error": false, "message": "publish success", "data": null});  
});

module.exports = router;
