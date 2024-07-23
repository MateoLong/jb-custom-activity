define(['postmonger'], function(Postmonger) {
    const connection = new Postmonger.Session();

    connection.trigger('ready');

    connection.on('initActivity', function( data ) {
        console.log('test: ', data);
    })

    connection.on('clickedNext', function(  ) {
        console.log('test');
    })


});
