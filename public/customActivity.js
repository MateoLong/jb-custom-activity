define(['postmonger'], function(Postmonger) {
    const connection = new Postmonger.Session();

    const init = function() {
        connection.trigger('ready');
    };

    connection.on('initActivity', function(data) {
        console.log('initActivity data: ', data);
        // Initialize any data or state here if necessary
    });

    connection.on('clickedNext', function(data) {
           // Collect form values
           const clientId = document.getElementById('clientId').value;
           const clientSecret = document.getElementById('clientSecret').value;
           const environment = document.getElementById('environment').value;
           const redirectUri = document.getElementById('redirectUri').value;
   
           // Send a POST request to the backend to initiate OAuth
           $.post('/authUri', {
               clientId: clientId,
               clientSecret: clientSecret,
               environment: environment,
               redirectUri: redirectUri
           }).done(function(response) {
               // Redirect to the received authorization URL
               window.location.href = response.authUri;
           }).fail(function(error) {
               console.error('Error initiating OAuth:', error);
           });
    });

    return {
        init: init
    };
});
