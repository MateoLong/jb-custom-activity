var express = require('express');
var router = express.Router();
var OAuthClient = require('intuit-oauth');

const oauthClient = new OAuthClient({
  clientId: process.env.QUICKBOOKS_CLIENT_ID,
  clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
  environment: 'sandbox',
  redirectUri: process.env.QUICKBOOKS_REDIRECT_URI
});

let oauth2_token_json = null;
let redirectUri = '';

// Endpoint to start the OAuth flow
router.get('/authUri', function(req, res) {
  var authUri = oauthClient.authorizeUri({
      scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
      state: 'testState'
  });
  res.redirect(authUri);
});

// Handle the callback to extract the `Auth Code` and exchange them for `Bearer-Tokens`
router.get('/callback', function(req, res) {
  oauthClient
  .createToken(req.url)
  .then(function(authResponse) {
      console.log('The Token is:', JSON.stringify(authResponse.getJson()));      
      oauth2_token_json = JSON.stringify(authResponse.json, null, 2);
      res.send('Token acquired and stored');
  })
  .catch(function(e) {
      console.error('The error message is:', e.originalMessage);
      console.error(e.intuit_tid);
      res.send('Failed to acquire token');
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
