define(['postmonger'], function(Postmonger) {
    const connection = new Postmonger.Session();
    let payload = {};

    const init = function() {
        connection.trigger('ready');
    };

    connection.on('initActivity', function(data) {
        console.log('initActivity data: ', JSON.stringify(data));
        payload = data;
        console.log('payload init: ' + JSON.stringify(payload));
        // Initialize any data or state here if necessary
    });

    connection.on('clickedNext', function() {

        console.log('payload: ' + JSON.stringify(payload));
        payload['metaData'].isConfigured = true;
        connection.trigger('updateActivity', payload);
        
    });

    return {
        init: init
    };
});
