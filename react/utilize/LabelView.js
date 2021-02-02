import fontStyle from "../resources/FontStyle";
import FontSize from "../resources/ManageFontSize";
import {Text, View} from "react-native";
import React, {Component} from "react";
import Config from "../config/Config";


export class LabelView extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.label}>{this.props.title}</Text>
                <Text style={styles.text}>{this.props.value}</Text>
            </View>
        );
    }
}

const styles={
    container:{
        flexDirection: "row",
        marginBottom:10
    },
    label:{
        fontFamily:fontStyle.RobotoMedium,
        width:Config.getDeviceWidth()/3,
        fontSize:FontSize.getSize(12),
        marginRight:10,
    },
    text:{
        flex:1,
        fontFamily:fontStyle.RobotoRegular,
        fontSize:FontSize.getSize(12)
    }
}