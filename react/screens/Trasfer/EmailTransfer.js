import React, {Component} from "react";
import {FlatList, Image, Platform, SafeAreaView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginScreen from "../LoginScreen";
import TermConditionScreen from "../TermConditionScreen";
import {connect} from "react-redux";
import Utility from "../../utilize/Utility";
import FontSize from "../../resources/ManageFontSize";


class EmailTransfer extends Component {
    constructor(props) {
        super(props);
        let language = props.language;
        this.state={
            stateVal: 0,
        }
    }

    async changeCard(cardCode) {
        this.setState({
            stateVal:cardCode
        })
    }

    sendOption(language){
        return(
            <View style={{marginTop:10,marginStart:10,marginEnd:10}}>
                <Text>{language.send_message}</Text>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate("EmailTransferScreen")}>
                <View style={{marginStart:10,marginEnd:10,marginTop:10, borderColor: themeStyle.BORDER,
                    borderRadius: 5,
                    overflow: "hidden",
                    width: Utility.setWidth(100),
                    alignItems: 'center',
                    borderWidth: 2}}>
               <Image style={{
                    height: Utility.setHeight(50),
                    width: Utility.setWidth(50),
                   marginTop:20,
                   marginBottom:20,
                   marginStart:20,
                   marginEnd:20,
                   alignSelf:"flex-start"
                }} resizeMode={"contain"}
                       source={require("../../resources/images/message.png")}/>
                </View>
                </TouchableOpacity>
            </View>

        )
    }
    waitingOption(language){
        return(
            <View>
                <Text>{}</Text>
            </View>
        )
    }

    render() {
        let language = this.props.language;
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={CommonStyle.toolbar}>
                    <TouchableOpacity
                        style={CommonStyle.toolbar_back_btn_touch}
                        onPress={() => this.props.navigation.goBack(null)}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../../resources/images/ic_back_android.png") : require("../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.email_transfer}</Text>
                    <TouchableOpacity onPress={() => Utility.logout(this.props.navigation, language)}
                                      style={{
                                          width: Utility.setWidth(35),
                                          height: Utility.setHeight(35),
                                          position: "absolute",
                                          right: Utility.setWidth(10),
                                      }}
                                      >
                        <Image resizeMode={"contain"} style={{
                            width: Utility.setWidth(30),
                            height: Utility.setHeight(30),
                        }}
                               source={require("../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                <View style={[styles.headerLabel,{  marginTop:10,marginStart: 10,
                    marginEnd: 10,}]}>
                    <TouchableOpacity
                        onPress={() => this.changeCard(0)}
                        style={{
                            height: "100%",
                            //width: Utility.setWidth(65),,
                            paddingLeft:70,
                            paddingRight:70,
                            justifyContent: "center",
                            borderBottomLeftRadius:this.state.stateVal === 1 ? 3 : 0,
                            borderTopLeftRadius:this.state.stateVal === 1 ? 3 : 0,
                            backgroundColor: this.state.stateVal === 0 ? themeStyle.THEME_COLOR : "#F4F4F4",
                        }}>
                        <Text style={[styles.langText, {
                            color: this.state.stateVal === 0 ? themeStyle.WHITE : themeStyle.BLACK
                        }]}>{this.props.language.send}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.changeCard(1)}
                        style={{
                            height: "100%",
                            //width: Utility.setWidth(65),
                            paddingLeft:70,
                            paddingRight:70,
                            justifyContent: "center",
                            borderBottomRightRadius:this.state.stateVal === 1 ? 5 : 0,
                            borderTopRightRadius:this.state.stateVal === 1 ? 5 : 0,
                            backgroundColor: this.state.stateVal === 1 ? themeStyle.THEME_COLOR : "#F4F4F4",
                        }}>
                        <Text style={[styles.langText, {
                            color: this.state.stateVal === 1 ? themeStyle.WHITE : themeStyle.BLACK
                        }]}>{this.props.language.waiting}</Text>
                    </TouchableOpacity>
                </View>

                {this.state.stateVal === 0 ? this.sendOption(language) : this.waitingOption(language)}

            </View>)
    }

    componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.THEME_COLOR);
                StatusBar.setBarStyle("light-content");
            });
        }
        // bottom tab management
        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.transfer
        });
    }
}
const styles = {
    headerLabel: {
        flexDirection: "row",
        //backgroundColor: themeStyle.THEME_COLOR,
        height: Utility.setHeight(35),
        borderRadius: 5,
        borderWidth: 1,
        borderColor: themeStyle.WHITE,
        overflow: "hidden"
    },
}
const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(EmailTransfer);

