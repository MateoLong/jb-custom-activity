define(['postmonger'], function(Postmonger) {
    const connection = new Postmonger.Session();

    let activity = null;

    function init() {
        document.addEventListener('DOMContentLoaded', main);
    }

    function main() {
        setupEventHandlers();
        connection.on('initActivity', onInitActivity);
        connection.trigger('ready');
    }

    function onInitActivity(payload) {
        activity = payload;

        const hasInArguments = Boolean(
            activity.arguments &&
            activity.arguments.execute &&
            activity.arguments.execute.inArguments &&
            activity.arguments.execute.inArguments.length > 0
        );

        const inArguments = hasInArguments ? activity.arguments.execute.inArguments : [];
    }

    return {
        init: init
    };
});
