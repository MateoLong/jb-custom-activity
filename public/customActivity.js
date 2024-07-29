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

        // Redirect to the backend endpoint to initiate OAuth
        window.location.href = `/authUri?clientId=${jsonBody.clientId}&clientSecret=${jsonBody.clientSecret}&environment=${jsonBody.environment}&redirectUri=${jsonBody.redirectUri}`;
    });

    return {
        init: init
    };
});
