var express = require('express');
var router = express.Router();
var OAuthClient = require('intuit-oauth');

let oauth2_token_json = null;
let redirectUri = '';
let oauthClient = null;

// Endpoint to start the OAuth flow
router.post('/authUri', (req, res) => {
  oauthClient = new OAuthClient({
      clientId: req.body.clientId,
      clientSecret: req.body.clientSecret,
      environment: req.body.environment,
      redirectUri: req.body.redirectUri
  });

  const authUri = oauthClient.authorizeUri({
      scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
      state: 'testState',
  });

  res.json({ authUri }); // Send the authorization URL back to the frontend
});

// Handle the callback to extract the `Auth Code` and exchange them for `Bearer-Tokens`
router.get('/callback', function(req, res) {
  console.log('/callback: ' + req);
  oauthClient
  .createToken(req.url)
  .then(function(authResponse) {
      console.log('The Token is:', JSON.stringify(authResponse.getJson()));
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
