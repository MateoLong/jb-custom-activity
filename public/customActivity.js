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
        const jsonBody = {
            clientId: document.getElementById('clientId').value,
            clientSecret: document.getElementById('clientSecret').value,
            environment: document.getElementById('environment').value,
            redirectUri: document.getElementById('redirectUri').value
        };

        console.log('clickedNext jsonBody: ', jsonBody);

        // Request the authorization URI from the backend and redirect
        $.get('/authUri', jsonBody, function(response) {
            // This will redirect the user to the QuickBooks authorization URL
        }).fail(function(error) {
            console.error('Error fetching auth URI:', error);
        });
    });

    return {
        init: init
    };
});
