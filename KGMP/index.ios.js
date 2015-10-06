'use strict';

var React    = require('react-native'),
    styles   = require('./jsx/Styles'),
    Main     = require('./jsx/Main');


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
    // console.log(bundlepath)
    window.bundlePath = bundlepath;
});

StatusBarIOS.setStyle('light-content', true);

var KGMP = React.createClass({
    render : function() {
        return (<Main />);
    }
})

AppRegistry.registerComponent('KGMP', () => KGMP);

