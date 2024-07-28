define(['postmonger'], function(Postmonger) {
    const connection = new Postmonger.Session();

    connection.trigger('ready');

    connection.on('initActivity', function( data ) {
        console.log('test: ', data);
    })

    connection.on('clickedNext', function( data ) {
        var clientId = document.getElementById( 'clientId' );
        var clientId = document.getElementById( 'clientId' );
        console.log('test clicked next data: ' + clientId);
        
        // // Generate the authUri
        // var jsonBody = {};
        // jsonBody.clientId = $('#clientId').val();
        // jsonBody.clientSecret = $('#clientSecret').val();
        // jsonBody.environment = $('#environment').val();
        // jsonBody.redirectUri = $('#redirectUri').val();

        // $.get('/authUri', {json:jsonBody}, function (uri) {
        //     console.log('The Auth Uris is :'+uri);
        // })
        // .then(function (authUri) {
        //     // Launch Popup using the JS window Object
        //     var parameters = "location=1,width=800,height=650";
        //     parameters += ",left=" + (screen.width - 800) / 2 + ",top=" + (screen.height - 650) / 2;
        //     var win = window.open(authUri, 'connectPopup', parameters);
        //     var pollOAuth = window.setInterval(function () {
        //         try {
        //             if (win.document.URL.indexOf("code") != -1) {
        //                 window.clearInterval(pollOAuth);
        //                 win.close();
        //                 location.reload();
        //             }
        //         } catch (e) {
        //             console.log(e)
        //         }
        //     }, 100);
        // });

    })


});
