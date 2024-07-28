define(['postmonger'], function(Postmonger) {
    const connection = new Postmonger.Session();

    const init = function() {
        connection.trigger('ready');
    }

    connection.on('initActivity', function( data ) {
        console.log('test: ', data);
    })

    connection.on('clickedNext', function( data ) {
        // // Generate the authUri
        var jsonBody = {};
        jsonBody.clientId = document.getElementById( 'clientId' ).value;        
        jsonBody.clientSecret = document.getElementById( 'clientSecret' ).value;        
        jsonBody.environment = document.getElementById( 'environment' ).value;        
        jsonBody.redirectUri = document.getElementById( 'redirectUri' ).value;      
        
        console.log('test clicked next data: ' + jsonBody);
        
        $.get('/authUri', {json:jsonBody}, function (uri) {
            console.log('The Auth Uris is :'+uri);
        })
        .then(function (authUri) {
            // Launch Popup using the JS window Object
            var parameters = "location=1,width=800,height=650";
            parameters += ",left=" + (screen.width - 800) / 2 + ",top=" + (screen.height - 650) / 2;
            var win = window.open(authUri, 'connectPopup', parameters);
            var pollOAuth = window.setInterval(function () {
                try {
                    if (win.document.URL.indexOf("code") != -1) {
                        window.clearInterval(pollOAuth);
                        win.close();
                        location.reload();
                    }
                } catch (e) {
                    console.log(e)
                }
            }, 100);
        });

    })

    return {
        init: init
    };
});
