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

    function onDoneButtonClick() {
        activity.metaData.isConfigured = true;
        connection.trigger('updateActivity', activity);
    }

    function onCancelButtonClick() {
        connection.trigger('setActivityDirtyState', false);
        connection.trigger('requestInspectorClose');
    }

    function setupEventHandlers() {
        document.getElementById('done').addEventListener('click', onDoneButtonClick);
        document.getElementById('cancel').addEventListener('click', onCancelButtonClick);
    }

    return {
        init: init
    };
});
