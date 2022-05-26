/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'LoginForm.Application',

    name: 'LoginForm',

    requires: [
        // This will automatically load all classes in the LoginForm namespace
        // so that application classes do not need to require each other.
        'LoginForm.*'
    ],

    // The name of the initial view to create.
    mainView: 'LoginForm.view.main.MainView'
});
