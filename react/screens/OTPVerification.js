import React, {Component} from "react";
import {Platform, StatusBar, View, Image, SafeAreaView, TouchableOpacity, Text, TextInput, Alert} from "react-native";

import {actions} from "../redux/actions";
import {connect} from "react-redux";
import Config from "../config/Config";

import themeStyle from "../resources/theme.style";
import {LoginScreen} from "./LoginScreen";
import Utility from "../utilize/Utility";
import CommonStyle from "../resources/CommonStyle";
import RadioForm from "react-native-simple-radio-button";
import {CommonActions} from "@react-navigation/native";
import fontStyle from "../resources/FontStyle";
import FontSize from "../resources/ManageFontSize";

/**
 * splash page
 */

let description, value;

class OTPVerification extends Component {

    constructor(props) {
        super(props);
        this.state = {
            otp_type: 0,
            emailTxt: "t******8@gmail.com",
            mobileNo: "******529"
        }
    }


    async componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.THEME_COLOR);
                StatusBar.setBarStyle("light-content");
            });
        }

    }

    submit(language, navigation) {
        navigation.navigate("OTPScreen", {
            value: -1,
            description: language.otp_activate
        });
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
                                   require("../resources/images/ic_back_android.png") : require("../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.otp_sent}</Text>
                </View>

                <View style={{
                    borderColor: themeStyle.BORDER,
                    width: Utility.getDeviceWidth() - 30,
                    marginStart: 15,
                    marginEnd: 15,
                    marginTop: 15,
                    padding: 10,
                    borderRadius: 5,
                    overflow: "hidden",
                    borderWidth: 2,
                }}>
                    <Text style={CommonStyle.midTextStyle}>{language.emailAddress}</Text>
                    <Text
                        style={[CommonStyle.textStyle, {color: themeStyle.PLACEHOLDER_COLOR}]}>{this.state.emailTxt}</Text>
                    <Text style={[CommonStyle.midTextStyle, {marginTop: 25}]}>{language.mobileNo}</Text>
                    <Text
                        style={[CommonStyle.textStyle, {color: themeStyle.PLACEHOLDER_COLOR}]}>{this.state.mobileNo}</Text>

                    <View style={{
                        flexDirection: "row", alignItems: "center", marginTop: 15
                    }}>
                        <Text style={[CommonStyle.textStyle, {marginRight: 15}]}>
                            {language.otpType}
                            <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                        </Text>

                        <RadioForm
                            radio_props={language.otp_props}
                            initial={0}
                            buttonSize={8}
                            selectedButtonColor={themeStyle.THEME_COLOR}
                            formHorizontal={true}
                            labelHorizontal={true}
                            borderWidth={1}
                            buttonColor={themeStyle.GRAY_COLOR}
                            labelColor={themeStyle.BLACK}
                            labelStyle={[CommonStyle.textStyle, {marginEnd: 15, marginStart: -5}]}
                            style={{marginTop: 8}}
                            animation={true}
                            onPress={(value) => {
                                this.setState({otp_type: value});
                            }}
                        />
                    </View>
                </View>
                <Text
                    style={{
                        fontFamily:fontStyle.RobotoRegular,
                        fontSize:FontSize.getSize(11),
                        color: themeStyle.BLACK_43,
                        marginStart: Utility.setWidth(30),
                        marginEnd: Utility.setWidth(30),
                        marginTop: 10
                    }}>{this.state.otp_type === 0 ? language.otpViaMob + this.state.mobileNo : language.otpViaEmail + this.state.emailTxt}</Text>

                <TouchableOpacity
                    onPress={() => this.submit(language, this.props.navigation)}>
                    <View style={{
                        marginTop: 20,
                        alignSelf: "center",
                        justifyContent: "center",
                        height: Utility.setHeight(46),
                        width: Utility.setWidth(110),
                        borderRadius: Utility.setHeight(23),
                        backgroundColor: themeStyle.THEME_COLOR
                    }}>
                        <Text
                            style={[CommonStyle.midTextStyle, {
                                color: themeStyle.WHITE,
                                textAlign: "center"
                            }]}>{language.continue_txt}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = {
    viewStyles: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themeStyle.BG_COLOR,
    },

};


const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(OTPVerification);

