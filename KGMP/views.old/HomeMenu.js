var React         = require('react-native'),
    BrowseViewNav = require('./Browse/BrowseViewNavigator'),
    FavsViewNav   = require('./Browse/FavoritesViewNavigator'),
    RandomPlayer  = require('./player/RandomPlayer'),
    BaseComponent = require('./BaseComponent'),
    AboutView     = require('./about/AboutView'),
    AboutWKWV     = require('./about/AboutViewWKWV');

var mLogo = require('image!mlogo_tiny');

mLogo.height *= 1.5;
mLogo.width *= 1.5;

var { 
        MCModPlayerInterface,
        MCQueueManager
    } = require('NativeModules');


var {
    TouchableHighlight,
    StyleSheet,
    Text,
    Image,
    StatusBarIOS,
    View,
    LinkingIOS,
    TouchableWithoutFeedback
} = React;



var styles = StyleSheet.create({

    mainCt : {
        flex           : 1,
        flexDirection  : 'column',
        backgroundColor : '#000000',
        // borderWidth    : 2,
        // borderColor    : '#00FF00'
    },

    menuCt : {
        flex           : 1,
        flexDirection  : 'column',
        justifyContent : 'center',
    },

    highlightCt : {
        width          : 210,
        height         : 35,
        borderWidth    : 1,
        borderColor    : '#333333',
        // borderRadius   : 3,
        flexDirection  : 'row',
        justifyContent : 'center',
    },

    touchableCt : {
        flexDirection  : 'row',
        justifyContent : 'center',
        marginTop      : window.height > 480 ? 20 : 10,
        marginBottom   : window.height > 480 ? 10 : 15,
        // borderWidth    : 2,
        // borderColor    : '#FF0000'
    },  

    label : {
        fontFamily : 'PerfectDOSVGA437Win',
        fontSize   : 36, 
        fontWeight : 'bold',
        color      : '#EFEFEF'
    },

    titleRed : {
        fontFamily : 'PerfectDOSVGA437Win', 
        fontSize   : 45,
        fontWeight : 'bold',
        color      : '#FF0000'
    },

    titleGreen : {
        fontFamily : 'PerfectDOSVGA437Win', 
        fontSize   : 45,
        color      : '#00FF00'
    }
});


var x = false;

class HomeMenu extends BaseComponent {
    setInitialState() {
        this.state = { time : 0 };
    }


    createButton(fn, text) {
        return (
            <View style={styles.touchableCt} key={text}>
                <TouchableHighlight
                    activeOpacity={1}
                    animationVelocity={0}
                    underlayColor="rgb(00,200,00)" 
                    style={styles.highlightCt} 
                    onPress={fn}>
                        <Text style={styles.label}>{text}</Text>
                </TouchableHighlight>
            </View>
        );
    }
     
    render() {
        // setTimeout(()=> {
        //     if (!x) {
        //         this.onRandomPress();
        //         x = true;
        //     }

        // }, 100);

        var footerStyle,
            playerSeparatorStyle;

        // Todo: Clean this isht up!

        if (window.height == 480) {
            footerStyle = {marginBottom: 20};
            playerSeparatorStyle = {flexDirection:'row', justifyContent : 'center', marginBottom : 20};
        }
        else if (window.height == 568) {
            footerStyle = {marginBottom: 10};
            playerSeparatorStyle = {flexDirection:'row', justifyContent : 'center', marginBottom :30};
        }
        else {
            footerStyle = {marginBottom: 40};
            playerSeparatorStyle = {flexDirection:'row', justifyContent : 'center', marginBottom :30};
        }

        return (
            <View style={styles.mainCt}>
                <View style={styles.menuCt}>
                    <View style={{flexDirection:'row', justifyContent : 'center'}}>
                        <Text style={styles.titleRed}>K</Text>
                        <Text style={styles.titleGreen}>ey</Text>
                        <Text style={styles.titleRed}>G</Text>
                        <Text style={styles.titleGreen}>en</Text>
                        <Text style={[styles.titleRed, {marginLeft: 10}]}>M</Text>
                        <Text style={styles.titleGreen}>usic</Text>
                    </View>
                    <View style={playerSeparatorStyle}>
                        <Text style={styles.titleRed}>P</Text>
                        <Text style={styles.titleGreen}>layer</Text>
                    </View>
                    {[
                        this.createButton(this.onRandomPress,    "Random"),
                        this.createButton(this.onBrowsePress,    "Browse"),
                        this.createButton(this.onFavoritesPress, "Favorites"),
                        // this.createButton(this.onSearchPress,    "Search"),
                        this.createButton(this.onAboutPress,     "About"),
                        // this.createButton(this.onWKWVDemo,     "WKWV Demo")
                    ]}
                </View>
                <View style={footerStyle}>
                    <TouchableWithoutFeedback onPress={this.onModusPress}>
                        <View style={{ flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                            <Image style={{marginRight : 10}} source={mLogo} /> 
                            <Text style={{color:'#FFFFFF', fontFamily : 'PerfectDOSVGA437Win', fontWeight : 'bold', fontSize : 24, marginTop: 12}}>Modus Create</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>

        );
    }

    onModusPress() {
        LinkingIOS.openURL('http://moduscreate.com');
    }


}

HomeMenu.propTypes = {
    onRandomPress    : React.PropTypes.func,
    onBrowsePress    : React.PropTypes.func,
    onFavoritesPress : React.PropTypes.func,
    onAboutPress     : React.PropTypes.func,
    onSearchPress    : React.PropTypes.func
};

Object.assign(HomeMenu.prototype, {
    bindableMethods : {

        onRandomPress : function() {
            var  navigator = this.props.navigator;
            this.showSpinner();


            MCQueueManager.getNextRandomAndClearQueue((rowData) => {
                // console.log(rowData);
                var filePath = window.bundlePath + unescape(rowData.directory) + unescape(rowData.name);

                MCModPlayerInterface.loadFile(
                    filePath,
                    //failure
                    (data) => {
                        this.hideSpinner();
                        alert('Failure loading ' + unescape(rowData.name));
                    },        
                    //success
                    (modObject) => {
                        // debugger;
                        var fileName  = rowData.file_name,
                            rtBtnText,
                            rtBtnHandler;

                        modObject.id_md5 = rowData.id_md5;
                        modObject.fileName = fileName;
                        
                        window.mainNavigator.push({
                            title            : 'Player',
                            rightButtonTitle : rtBtnText,
                            component        : RandomPlayer,
                            componentConfig  : {
                                modObject  : modObject,
                                patterns   : modObject.patterns,
                                fileRecord : rowData
                            }
                        });
      
                        this.hideSpinner();
                    }
                );

            });
           
        },
        
        onBrowsePress : function() {
            this.showSpinner();

            setTimeout(() => {
                this.props.navigator.push({
                    component      : BrowseViewNav,
                    // transitionType : 'PushFromRight'
                });

                this.hideSpinner();
            }, 50)

        },
        
        onFavoritesPress : function() {
            this.showSpinner();
            MCQueueManager.getFavorites((rowData) => {
                // console.log('Favorites:');
                // console.log(rowData);
                if (rowData.directory) {
                    rowData = [rowData];
                }

                window.mainNavigator.push({
                    component       : FavsViewNav,
                    componentConfig : {
                        rowData : rowData
                    }
                });

                this.hideSpinner();
            });
        },
        
        onWKWVDemo : function() {

            this.showSpinner();
            MCModPlayerInterface.loadModusAboutMod(
                //failure
                (data) => {
                    alert('Apologies. This file could not be loaded.');
                    console.log(data);
                },        
                //success
                (modObject) => {

                    modObject.directory = unescape(modObject.directory);
                    modObject.file_name = unescape(modObject.file_name);

                    window.mainNavigator.push({
                        title           : 'WKWVDemo',
                        component       : AboutWKWV,
                        componentConfig : {
                            modObject : modObject
                        }
                    });
                    this.hideSpinner();
                }
            ); 
        },

        onAboutPress : function() {

            // this.showSpinner();
            // MCModPlayerInterface.loadModusAboutMod(
            //     //failure
            //     (data) => {
            //         alert('Apologies. This file could not be loaded.');
            //         console.log(data);
            //     },        
            //     //success
            //     (modObject) => {

            //         modObject.directory = unescape(modObject.directory);
            //         modObject.file_name = unescape(modObject.file_name);

                    window.mainNavigator.push({
                        title           : 'About',
                        component       : AboutView,
                        componentConfig : {
                            // modObject : modObject
                        }
                    });
                    // this.hideSpinner();
            //     }
            // );        
        },
        
        onSearchPress : function() {
            // this.props.onSearchPress();
        }
    }
});


module.exports = HomeMenu;

