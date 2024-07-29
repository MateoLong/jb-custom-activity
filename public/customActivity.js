define(['postmonger'], function(Postmonger) {
    const connection = new Postmonger.Session();
    var payload = {};

    const init = function() {
        connection.trigger('ready');
    };

    connection.on('initActivity', function(data) {
        console.log('initActivity data: ', JSON.stringify(data));
        if (data) {
            payload = data;
        }
        // Initialize any data or state here if necessary
    });

    connection.on('clickedNext', function() {

        console.log('payload: ' + JSON.stringify(payload));
        payload['metaData'].isConfigured = true;
        connection.trigger('updateActivity', payload);
        
        //    // Collect form values
        //    const clientId = document.getElementById('clientId').value;
        //    const clientSecret = document.getElementById('clientSecret').value;
        //    const environment = document.getElementById('environment').value;
        //    const redirectUri = document.getElementById('redirectUri').value;
   
        //    // Send a POST request to the backend to initiate OAuth
        //    $.post('/authUri', {
        //        clientId: clientId,
        //        clientSecret: clientSecret,
        //        environment: environment,
        //        redirectUri: redirectUri
        //     }).done(function(response) {
        //         console.log('Authorization URL:', response.authUri); // Log the received URL
        //         // Open the authorization URL in a new window
        //         const authWindow = window.open(response.authUri, 'QuickBooksAuth', 'width=800,height=600');
                
        //         // Optional: Poll the window to detect when it's closed
        //         const pollTimer = window.setInterval(function() {
        //             if (authWindow.closed !== false) { // !== is required for compatibility with Opera
        //                 window.clearInterval(pollTimer);
        //                 console.log('Authorization window closed');
        //                 // Optional: Trigger some action after the window is closed, e.g., refresh the page
        //                 // location.reload();
        //             }
        //         }, 100);
        //     }).fail(function(error) {
        //         console.error('Error initiating OAuth:', error);
        //     });
    });

    return {
        init: init
    };
});
