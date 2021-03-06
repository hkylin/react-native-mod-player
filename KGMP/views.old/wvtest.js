/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  WebView,
  TextInput,
  TouchableOpacity
} = React;

var MCBridgedWebView = require('./Extension/MCBridgedWebView');



var KGMP = React.createClass({
  render: function() {
    var wv = React.createElement(WebViewExample);

    return wv;
  }
});

var styles = StyleSheet.create({
container: {
    flex: 1,
    borderWidth : 1,
    borderColor : '#FF0000'
  },
  addressBarRow: {
    flexDirection: 'row',
    padding: 8,
  },
  webView: {
    backgroundColor: BGWASH,
    height: 350,
    flex: 1
  },
  addressBarTextInput: {
    backgroundColor: BGWASH,
    borderColor: 'transparent',
    borderRadius: 3,
    borderWidth: 1,
    height: 24,
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 3,
    flex: 1,
    fontSize: 14,
  },
  navButton: {
    width: 20,
    padding: 3,
    marginRight: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BGWASH,
    borderColor: 'transparent',
    borderRadius: 3,
  },
  disabledButton: {
    width: 20,
    padding: 3,
    marginRight: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DISABLED_WASH,
    borderColor: 'transparent',
    borderRadius: 3,
  },
  goButton: {
    height: 24,
    padding: 3,
    marginLeft: 8,
    alignItems: 'center',
    backgroundColor: BGWASH,
    borderColor: 'transparent',
    borderRadius: 3,
    alignSelf: 'stretch',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    height: 22,
  },
  statusBarText: {
    color: 'white',
    fontSize: 13,
  },
  spinner: {
    width: 20,
    marginRight: 6,
  },
});



var HEADER = '#3b5998';
var BGWASH = 'rgba(255,255,255,0.8)';
var DISABLED_WASH = 'rgba(255,255,255,0.25)';

var TEXT_INPUT_REF = 'urlInput';
var WEBVIEW_REF = 'webview';
var DEFAULT_URL = 'https://m.facebook.com';

var WebViewExample = React.createClass({

  getInitialState: function() {
    return {
      // url: DEFAULT_URL,
      localUrl : 'cubetest.html',
      status: 'No Page Loaded',
      backButtonEnabled: false,
      forwardButtonEnabled: false,
      loading: true,
      scalesPageToFit: true,
    };
  },

  inputText: '',

  handleTextInputChange: function(event) {
    this.inputText = event.nativeEvent.text;
  },

  render: function() {
    this.inputText = this.state.url;

    if (! this.state.js) {
      setTimeout(() => {
        var wv = this.refs[WEBVIEW_REF];
        // debugger;
        this.state.js = true;
        var call = "particleCount = 200;particles.drawcalls[ 0 ].count = particleCount;";
        wv.execJsCall(call)
      }, 1000)  
    }
    

    return (
      <View style={styles.container}>
        <MCBridgedWebView
          ref={WEBVIEW_REF}
          automaticallyAdjustContentInsets={false}
          style={styles.webView}
          url={this.state.url}
          localUrl={this.state.localUrl}
          html="Some Html"
          javaScriptEnabledAndroid={true}
          onNavigationStateChange={this.onNavigationStateChange}
          startInLoadingState={true}
          scalesPageToFit={this.state.scalesPageToFit}
        />
      </View>
    );
  },

  goBack: function() {
    this.refs[WEBVIEW_REF].goBack();
  },

  goForward: function() {
    this.refs[WEBVIEW_REF].goForward();
  },

  reload: function() {
    var ref = this.refs[WEBVIEW_REF];
    // debugger;
    ref.reload();
  },

  onNavigationStateChange: function(navState) {
    this.setState({
      backButtonEnabled: navState.canGoBack,
      forwardButtonEnabled: navState.canGoForward,
      url: navState.url,
      status: navState.title,
      loading: navState.loading,
      scalesPageToFit: true
    });
  },

  onSubmitEditing: function(event) {
    this.pressGoButton();
  },

  pressGoButton: function() {
    var url = this.inputText.toLowerCase();
    if (url === this.state.url) {
      this.reload();
    } else {
      this.setState({
        url: url,
      });
    }
    // dismiss keyoard
    this.refs[TEXT_INPUT_REF].blur();
  },

});


AppRegistry.registerComponent('KGMP', () => KGMP);
