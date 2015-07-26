'use strict';

var React = require('react-native');


var {
    TouchableHighlight,
    StyleSheet,
    Text,
    View
} = React;


var deviceWidth = 375;
var white ='#FFFFFF';
var styles = StyleSheet.create({

    summaryRow : {
        flexDirection  : 'row'
    },

    fileSummary : {
        alignSelf  : 'stretch',

        // height : 374,
        padding : 5,
        borderBottomWidth : .5,
        borderBottomColor : white
    },
    title : {
        fontFamily      : 'PerfectDOSVGA437Win',
        fontSize        : 16,
        backgroundColor : '#000000',
        color           : '#00FF00',
        fontWeight      : 'bold'
    },

    text : {
        fontFamily      : 'PerfectDOSVGA437Win',
        fontSize        : 16,
        backgroundColor : '#000000',
        color           : white,
        fontWeight      : 'bold'
    },

    textLink : {
        fontSize : 18,
        color    : '#0000FF'
    }
});


module.exports  = React.createClass({

    props : {
        data    : React.PropTypes.object,
        onPress : React.PropTypes.func
    },

    getInitialState : function() {
        return {
            pattern : 0,
            order   : 0,
            row     : 0
        }
    },

    onFormatPress : function() {
        this.props.onPress && this.props.onPress(this.fileTypeObj);
    },

    render : function() {
        var data  = this.props.data,
            state = this.state;

        // console.log(data);
        // console.log(data.typeLong)

        return (
            <View style={styles.fileSummary}>
                <View style={styles.summaryRow}>
                    <Text style={styles.title}>Group: </Text>
                    <Text style={styles.text}>{data.group}</Text>
                </View>  

                <View style={styles.summaryRow}>
                    <Text style={styles.title}>Song Title: </Text>
                    <Text style={styles.text}>{data.name}</Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.title}>Tracker: </Text>
                    <Text style={styles.text}>{data.tracker}</Text>
                </View>  

                <View style={styles.summaryRow}>
                    <Text style={styles.title}>Type: </Text>
                    <Text style={styles.text}>{data.typeLong}</Text>
                </View>  

                <View style={styles.summaryRow}>
                    <View>
                        <Text style={styles.title}>Order: </Text>
                        <Text style={styles.text}>{state.order}</Text>
                    </View>


                    <View>
                        <Text style={styles.title}>Pattern: </Text>
                        <Text style={styles.text}>{state.pattern}</Text>
                    </View>  
              

                    <View>
                        <Text style={styles.title}>Row: </Text>
                        <Text style={styles.text}>{state.row}</Text>
                    </View>
                </View>
                {/* 

                <View style={styles.summaryRow}>
                    <Text style={styles.title}>Speed: </Text>
                    <Text style={styles.text}>{data.speed}</Text>
                </View>  


                <View style={styles.summaryRow}>
                    <Text style={styles.title}>BMP: </Text>
                    <Text style={styles.text}>{data.bpm}</Text>
                </View>  

                <View style={styles.summaryRow}>
                     <View>
                        <Text style={styles.title}>Tracks: </Text>
                        <Text style={styles.text}>{data.tracks}</Text>
                    </View>
                    <View>
                        <Text style={styles.title}>Insruments: </Text>
                        <Text style={styles.text}>{data.instruments}</Text>
                    </View>
                    <View>
                        <Text style={styles.title}>Samples: </Text>
                        <Text style={styles.text}>{data.samples}</Text>
                    </View>
                    <View>
                        <Text style={styles.title}>Patterns: </Text>
                        <Text style={styles.text}>{data.numPatterns}</Text>
                    </View>

                </View>                



                <View style={styles.summaryRow}>

                </View>   

                <View style={styles.summaryRow}>
                    <Text style={styles.title}>Current Order: </Text>
                    <Text style={styles.text}>{state.order}</Text>
                </View>  
                


                <View style={styles.summaryRow}>
                    <Text style={styles.title}>Current Pattern: </Text>
                    <Text style={styles.text}>{state.pattern}</Text>
                </View>  
              

                <View style={styles.summaryRow}>
                    <Text style={styles.title}>Current Row: </Text>
                    <Text style={styles.text}>{state.row}</Text>
                </View>


                <View style={styles.soundFormat}>
                    <Text style={styles.text}>Format: </Text>
                    <TouchableHighlight 
                        onPress={this.onFormatPress}
                        underlayColor="rgb(210, 230, 255)">
                            <Text style={styles.textLink}>
                                {formatText}
                            </Text>
                    </TouchableHighlight>
                </View>
                {copyright}
                */}
            </View>
        );

    }
});
