var express = require('express');
var router = express.Router();
var OAuthClient = require('intuit-oauth');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

let oauth2_token_json = null;
let redirectUri = '';
let oauthClient = null;

const urlencodedParser = bodyParser.urlencoded({ extended: false });

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
      console.log('token aquired and stored');
      res.send('Token acquired and stored');
  })
  .catch(function(e) {
      console.error('The error message is:', e.originalMessage);
      console.error(e.intuit_tid);
      res.send('Failed to acquire token: ' + e);
  });
});

router.get('/getCompanyInfo', function (req, res) {
  const companyID = oauthClient.getToken().realmId;

  const url =
    oauthClient.environment == 'sandbox'
      ? OAuthClient.environment.sandbox
      : OAuthClient.environment.production;

  oauthClient
    .makeApiCall({ url: `${url}v3/company/${companyID}/companyinfo/${companyID}` })
    .then(function (authResponse) {
      console.log(`\n The response for API call is :${JSON.stringify(authResponse.json)}`);
      res.send(authResponse.json);
    })
    .catch(function (e) {
      console.error(e);
    });
});

router.get('/createCustomer', function (req, res, next) {
  console.log('entra al createCustomer');
  const companyID = oauthClient.getToken().realmId;

  const url =
    oauthClient.environment == 'sandbox'
      ? OAuthClient.environment.sandbox
      : OAuthClient.environment.production;

  // Body sample from API explorer examples
  const body = {
  TrackQtyOnHand: true,
  Name: 'Garden Supplies',
  QtyOnHand: 10,
  InvStartDate: '2015-01-01',
  Type: 'Inventory',
  IncomeAccountRef: {
    name: 'Sales of Product Income',
    value: '79',
  },
  AssetAccountRef: {
    name: 'Inventory Asset',
    value: '81',
  },
  ExpenseAccountRef: {
    name: 'Cost of Goods Sold',
    value: '80',
  },
};

oauthClient
  .makeApiCall({
    url: `${url}v3/company/${companyID}/customer?minorversion=73`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  .then(function (response) {
    console.log('The API response is  : ' + response);
    res.json(response);
  })
  .catch(function (e) {
    console.log('The error is ' + JSON.stringify(e));
  });
});

/* POST to execute */
router.post('/execute', async function(req, res, next) {
  // var inArguments = req.body.inArguments;
  // console.log('req.body.inArguments: ' + req.body.inArguments);
  // var msg = req.body.inArguments.staticValue;  
  // res.status(200).json({ "error": false, "message": msg, "data": null}); 
  console.log('execute!'); 
  const companyID = oauthClient.getToken().realmId;

  const url =
    oauthClient.environment == 'sandbox'
      ? OAuthClient.environment.sandbox
      : OAuthClient.environment.production;

  oauthClient
    .makeApiCall({ url: `${url}v3/company/${companyID}/companyinfo/${companyID}` })
    .then(function (authResponse) {
      console.log(`\n The response for API call is :${JSON.stringify(authResponse.json)}`);
      res.send(authResponse.json);
    })
    .catch(function (e) {
      console.error(e);
    });
});

/* POST to publish */
router.post('/publish', async function(req, res, next) {
  res.status(200).json({ "error": false, "message": "publish success", "data": null});  
});

module.exports = router;
