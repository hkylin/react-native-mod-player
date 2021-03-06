'use strict';

import React, {
    Component, 
    PropTypes
} from "react";

import {
    Dimensions, 
    Image, 
    StyleSheet, 
} from "react-native";


//TODO: more fluid layouting!!!

var dosFont     = 'PerfectDOSVGA437Win',
    borderColor = '#AEAEAE',
    blackColor  = '#000000',
    whiteColor  = '#FFFFFF',
    row         = 'row',
    absolute    = 'absolute',
    stretch     = 'stretch'

var dims = Dimensions.get('window');
dims.mid = (dims.height - 30) / 2;
   

module.exports = StyleSheet.create({
    bar : {
        height : 13, 
        backgroundColor : 'transparent', 
        borderWidth : 1, 
        borderColor : '#FF0000', 
        position : 'absolute', 
        // top : 50,
        top : dims.mid,
        width : dims.width * .5 
    },
    soundFormat : {
        flexDirection  : row,
    },

    container : {
        backgroundColor : blackColor,
        // borderWidth     : .5,
        // borderColor     : blackColor,
        paddingTop      : 35,
        flexDirection   : 'column',
        flex : 1,
    },

    titleBar : {
        height            : 20,
        paddingTop        : 3,
        paddingLeft       : 3,
        borderTopWidth    : 1,
        borderBottomWidth : 1,
        borderColor       : borderColor,
        flexDirection     : row,
        justifyContent    : 'center'
    },


    gameImage : {
        alignSelf  : stretch,
        resizeMode : Image.resizeMode.fit
    },
    
    controlsContainer : {
        height      : 60,
        // width       : 375,
        borderTopWidth : 1,
        borderColor    : borderColor
    },

    vizContainer : {
        height         : 50,
        flexDirection  : row,
        justifyContent : 'space-around',
    },
    vizItem : {
        width : 187,
        flex  : 1,
        // borderWidth : 1,
        // borderColor : '#FF0000'
    },

    timeText : {
        position : absolute,
        // fontSize : 20
    },


    imageContainer : {
        height          : 498, 
        // flexDirection   : row,
        overflow        : 'hidden',
        // width       : 375,
        alignSelf       : stretch,  // This doesn't effing work!
        borderTopWidth  : 1,
        borderColor     : borderColor,
        backgroundColor : blackColor
    },

    rowNumberz  : {
        position         : absolute,
        top              : (508/2),
        width            : 20,
        borderRightWidth : 1,
        borderColor      : blackColor,
    },
    
    patternView : {
        position : 'absolute',
        top : dims.mid,
        backgroundColor : '#FF0000',
        flex:1, 
        overflow:'hidden',
        alignSelf : stretch
    },


    vizSeparator : {
        borderWidth : 1,
        borderColor : '#FFFFFF',
        width : 2
    },
    playerBarTop : {
        position    : absolute,
        height      : 1,
        width       : 375,
        top         : (508/2) -1,
        left        : 0,
        borderWidth : 1,
        borderColor : '#FF0000'
    },

    playerBarBottom : {
        position    : absolute,
        height      : 1,
        width       : 375,
        top         : (508/2) + 11,
        left        : 0
    },

    songName : {
        fontFamily : dosFont,
        fontSize   : 16, 
        color      : whiteColor 
    },

    fileName : {
        fontFamily : dosFont,
        fontSize   : 12, 
        color      : whiteColor,
        fontWeight : 'bold'
    },
    progressView : {
        borderTopWidth : 1,
        borderTopColor : whiteColor,
        width  : 375
    },

    webView : {
        flex :  1
    },

    instrumentRow : {
        flexDirection : row
    },

    instrumentText : {
        fontFamily : dosFont,
        fontSize   : 16,
        color      : '#00FF00',
        width      : 30
    },


    instrumentsLabel : {
        fontFamily : dosFont,
        fontSize   : 16,
        color      : '#00FF00',
        width      : 150,
        fontWeight : 'bold'
    },

    instrumentName : {
        fontFamily : dosFont,
        fontSize   : 16,
        color      : '#FFFFFF',
        fontWeight : 'bold' 
    },
    vizContainer : {
        height         : 50,
        width          : 375,
        // borderWidth    : 1,
        flexDirection  : 'row',
        justifyContent : 'space-around',
        borderTopWidth : 1,
        borderTopColor : '#FFFFFF'
        // flex           : 'stretch',
        // borderColor    : "#00FF00"
    },

});
