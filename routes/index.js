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

router.get('/createCustomer', function (req, res) {
  console.log('oauthClient: ' + JSON.stringify(oauthClient));
  const companyID = oauthClient.getToken().realmId;
  
  const url =
  oauthClient.environment == 'sandbox'
  ? OAuthClient.environment.sandbox
  : OAuthClient.environment.production;
  
  console.log('url: ' + url);
  
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

/* POST to execute */
router.post('/execute', async function(req, res, next) {
  // var inArguments = req.body.inArguments;
  // console.log('req.body.inArguments: ' + req.body.inArguments);
  // var msg = req.body.inArguments.staticValue;  
  // res.status(200).json({ "error": false, "message": msg, "data": null}); 
  console.log('execute!'); 
  console.log('oauthClient: ' + JSON.stringify(oauthClient)); 
  // Body sample from API explorer examples
  const body = {
    FullyQualifiedName: "King Groceries", 
    PrimaryEmailAddr: {
      Address: "jdrew@myemail.com"
    }, 
    DisplayName: "King's Groceries", 
    Suffix: "Jr", 
    Title: "Mr", 
    MiddleName: "B", 
    Notes: "Here are other details.", 
    FamilyName: "King", 
    PrimaryPhone: {
      FreeFormNumber: "(555) 555-5555"
    }, 
    CompanyName: "King Groceries", 
    BillAddr: {
      CountrySubDivisionCode: "CA", 
      City: "Mountain View", 
      PostalCode: "94042", 
      Line1: "123 Main Street", 
      Country: "USA"
    }, 
    GivenName: "James"
  };

  const companyID = oauthClient.getToken().realmId;

  const url =
  oauthClient.environment == 'sandbox'
    ? OAuthClient.environment.sandbox
    : OAuthClient.environment.production;

  console.log('url: ' + url);

  oauthClient
    .makeApiCall({
      url: `${url}v3/company/${companyID}/customer?minorversion=73`,
      method: 'POST',
      timeout: 0,
      headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    .then(function (response) {
      console.log('The API response is  : ' + response);      
      // res.status(200).json({ "error": false, "message": "customer created" });  
    })
    .catch(function (e) {
      console.log('The error is ' + JSON.stringify(e));
    });
});

/* POST to publish */
router.post('/publish', async function(req, res, next) {
  res.status(200).json({ "error": false, "message": "publish success", "data": null});  
});

/* POST to validate */
router.post('/validate', async function(req, res, next) {
  res.status(200).json({ "success": true });  
});

/* POST to save */
router.post('/save', async function(req, res, next) {
  res.status(200).json({ "success": true });  
});

/* POST to stop */
router.post('/stop', async function(req, res, next) {
  res.status(200).json({ "success": true });  
});

module.exports = router;
