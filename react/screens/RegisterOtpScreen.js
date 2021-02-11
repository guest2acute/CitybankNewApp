import React, {Component} from "react";
import {Platform, StatusBar, View, Image, SafeAreaView, TouchableOpacity, Text, TextInput, Alert} from "react-native";

import {actions} from "../redux/actions";
import {connect} from "react-redux";
import Config from "../config/Config";

import themeStyle from "../resources/theme.style";
import {LoginScreen} from "./LoginScreen";
import Utility from "../utilize/Utility";
import CommonStyle from "../resources/CommonStyle";
import {CommonActions} from "@react-navigation/native";
import fontStyle from "../resources/FontStyle";
import FontSize from "../resources/ManageFontSize";
import OTPScreen from "./OTPScreen";


/**
 * splash page
 */

let description, value;

class RegisterOtpScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            otpVal: ""
        }
        description = props.route.params.description;
        value = props.route.params.value;
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
        if (this.state.otpVal.length !== 4) {
            Utility.alert("Please enter 4 digit OTP");
        } else {
            let that = this;
            Alert.alert(
                Config.appName,
                language.success_msg,
                [
                    {
                        text: language.ok, onPress: () => navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{name: "LoginScreen"}],
                            })
                        )
                    },
                ]
            );

        }

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
                    <Text style={CommonStyle.title}>{language.otp_txt}</Text>
                </View>
                <Text style={[CommonStyle.textStyle, {
                    marginStart: Utility.setHeight(15),
                    marginEnd: Utility.setHeight(15),
                    marginTop: Utility.setHeight(15),
                    marginBottom: Utility.setHeight(5),
                    textAlign: "center"
                }]}> {language.otp_description + description}</Text>
                <View style={{
                    borderColor: themeStyle.BORDER,
                    width: Utility.getDeviceWidth() - 30,
                    marginStart: 15,
                    marginEnd: 15,
                    borderRadius: 5,
                    overflow: "hidden",
                    borderWidth: 2,
                }}>
                    <View style={{
                        marginStart: 10, marginEnd: 10, marginTop: 10
                    }}>
                        <Text style={[CommonStyle.labelStyle]}>
                            {language.otp}
                            <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                        </Text>
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle]}
                            placeholder={language.otp_input_placeholder}
                            onChangeText={text => this.setState({otpVal: Utility.input(text, "0123456789")})}
                            value={this.state.otpVal}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            secureTextEntry={true}
                            keyboardType={"number-pad"}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}
                            maxLength={4}/>
                    </View>
                </View>
                <View style={{
                    marginTop: Utility.setHeight(15),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Text style={[CommonStyle.textStyle, {
                        textAlign: "center"
                    }]}>{language.dnReceiveOTP}</Text>
                    <TouchableOpacity>
                        <Text style={[CommonStyle.midTextStyle, {
                            textDecorationLine: "underline"
                        }]}>{language.sendAgain}
                        </Text>
                    </TouchableOpacity>
                </View>
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
                            }]}>{value !== -1 ? language.submit : language.continue_txt}</Text>
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

export default connect(mapStateToProps)(RegisterOtpScreen);

