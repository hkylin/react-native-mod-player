'use strict';

var React    = require('react-native'),
    styles   = require('./Styles'),
    sqlite   = require('react-native-sqlite'),
    Main     = require('./Main')

window.db = require('./db.js');

var {
        AppRegistry,
        NavigatorIOS,
        View,
        StatusBarIOS,
    } = React;

var { 
        MCFsTool,
        MCModPlayerInterface
    } = require('NativeModules');


// Cache the bundlepath globally so we can access it later =)
MCFsTool.getBundlePath((bundlepath) => {
    window.bundlePath = bundlepath;
});

StatusBarIOS.setStyle('light-content', true);


AppRegistry.registerComponent('KGMP', () => Main);

