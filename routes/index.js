// Backend (Node.js and Express.js)

const express = require('express');
const OAuthClient = require('intuit-oauth');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let oauthClient = new OAuthClient({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    environment: 'sandbox', // or 'production'
    redirectUri: process.env.REDIRECT_URI,
});

let refresh_token = 'stored_refresh_token'; // Retrieve the stored refresh token from your database or config

// Route to get the authorization URI
app.get('/authUri', (req, res) => {
    oauthClient = new OAuthClient({
        clientId: req.query.clientId,
        clientSecret: req.query.clientSecret,
        environment: req.query.environment,
        redirectUri: req.query.redirectUri,
    });

    const authUri = oauthClient.authorizeUri({
        scope: [OAuthClient.scopes.Accounting],
        state: 'intuit-test',
    });
    res.redirect(authUri); // Redirect the client to the QuickBooks authorization URL
});

// Callback route to handle the authorization response
app.get('/callback', (req, res) => {
    oauthClient.createToken(req.url)
        .then(authResponse => {
            refresh_token = authResponse.getJson().refresh_token;
            // Store the refresh token securely
            res.send('Authorization successful');
        })
        .catch(e => {
            console.error(e);
            res.send('Authorization failed');
        });
});

// Route to get company info using the refresh token
app.get('/getCompanyInfo', (req, res) => {
    oauthClient.refreshUsingToken(refresh_token)
        .then(authResponse => {
            const accessToken = authResponse.getJson().access_token;
            const companyID = authResponse.getJson().realmId;

            const url = oauthClient.environment === 'sandbox' 
                ? OAuthClient.environment.sandbox 
                : OAuthClient.environment.production;

            oauthClient.makeApiCall({ url: `${url}v3/company/${companyID}/companyinfo/${companyID}`, headers: { Authorization: `Bearer ${accessToken}` } })
                .then(apiResponse => {
                    res.json(apiResponse.getJson());
                })
                .catch(e => {
                    console.error(e);
                    res.status(500).send('API call failed');
                });
        })
        .catch(e => {
            console.error(e);
            res.status(500).send('Token refresh failed');
        });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
