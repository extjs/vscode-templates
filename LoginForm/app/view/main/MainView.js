Ext.define('LoginForm.view.main.MainView', {
    extend: 'Ext.form.Panel',
    xtype: 'form-login',

    requires: [
        'LoginForm.view.main.MainController',
        'LoginForm.view.main.MainViewModel',
        'Ext.Button'
    ],
    controller: 'main',

    bodyPadding: 20,
    width: 320,
    autoSize: true,

    items: [{
        xtype: 'textfield',
        allowBlank: false,
        required: true,
        label: 'User ID',
        name: 'user',
        placeholder: 'user id'
    }, {
        xtype: 'passwordfield',
        allowBlank: false,
        required: true,
        label: 'Password',
        name: 'pass',
        placeholder: 'password'
    }, {
        xtype: 'checkbox',
        boxLabel: 'Remember me',
        name: 'remember'
    }],

    buttons: [{
        text: 'Login',
        handler: 'onLogin'
    }, {
        text: 'Register',
        handler: 'onRegister'
    }]
});