import React, {Component} from "react";
import {
    Platform,
    StatusBar,
    View,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Text,
    TextInput,
    Alert,
    BackHandler
} from "react-native";

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
import ApiRequest from "../config/ApiRequest";
import {BusyIndicator} from "../resources/busy-indicator";
import * as ReadSms from "react-native-read-sms/ReadSms";

let description, value, deviceChangeRes;

class OTPVerification extends Component {

    constructor(props) {
        super(props);
        deviceChangeRes = props.route.params.deviceChangeRes ? props.route.params.deviceChangeRes : null;
        this.state = {
            otp_type: 0,
            otpVal: "",
            emailTxt: deviceChangeRes.MASK_EMAIL_ID,
            mobileNo: deviceChangeRes.MASK_MOBILE_NO,
            stageVal: 0,
            otpResponse: null
        }
    }


    async componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.THEME_COLOR);
                StatusBar.setBarStyle("light-content");
            });
            await this.startReadSMS();
        }

    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            ReadSms.stopReadSMS();
        }
    }

    startReadSMS = async () => {
        console.log("Great!! you have received new sms:");
        const hasPermission = await ReadSms.requestReadSMSPermission();
        if(hasPermission) {
            await ReadSms.startReadSMS((status, sms, error) => {
                if (status === "success") {
                    console.log("Great!! you have received new sms:", sms);
                }
            });
        }
    }


    async submit(language, navigation) {
        if (this.state.stageVal === 0) {
            await this.deviceRegister(language, navigation)
        } else if (this.state.otpVal.length !== 4) {
            Utility.alert(language.errOTP,language.ok);
        } else {
            await this.processOTP(language, navigation);
        }
    }

    async deviceRegister(language, navigation) {
        this.setState({isProgress: true});
        let deviceRegReq = {
            DEVICE_ID: await Utility.getDeviceID(),
            USER_ID: deviceChangeRes.USER_ID,
            CUSTOMER_ID: deviceChangeRes.CUSTOMER_ID,
            REQ_FLAG: "R",
            ACTION: "DEVICEREG",
            SMS_TYPE: this.state.otp_type === 0 ? "S" : this.state.otp_type === 1 ? "E" : "B",
            ...Config.commonReq
        };
        console.log("request", deviceRegReq);
        let result = await ApiRequest.apiRequest.callApi(deviceRegReq, {});
        console.log("result", result);
        //result = result[0];
        this.setState({isProgress: false});
        if (result.STATUS === "0") {
            this.setState({stageVal: this.state.stageVal + 1, otpResponse: result.RESPONSE[0]})
        } else {
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }
    }

    async processOTP(language, navigation) {
        this.setState({isProgress: true});
        let deviceRegReq = {
            USER_ID: this.state.otpResponse.USER_ID,
            ACTIVITY_CD: this.state.otpResponse.ACTIVITY_CD,
            REQUEST_CD: this.state.otpResponse.REQUEST_CD,
            OTP_NO: this.state.otpVal,
            REQ_FLAG: "R",
            ACTION: "DEVICEREGVERIFY"
        };
        console.log("request", deviceRegReq);
        let result = await ApiRequest.apiRequest.callApi(deviceRegReq, {});
        console.log("result", result);
        //result = result[0];
        this.setState({isProgress: false});
        if (result.STATUS === "0" || result.STATUS === "999") {
            Utility.alertWithBack(language.ok, result.MESSAGE, navigation);
        } else {
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }
    }


    otpEnter(language) {
        return (<View>
            <Text style={[CommonStyle.textStyle, {
                marginStart: Utility.setWidth(10),
                marginEnd: Utility.setWidth(10),
                marginTop: Utility.setHeight(10),
                marginBottom: Utility.setHeight(20),
            }]}> {language.otp_description + language.otp_activate}</Text>
            <View style={{
                borderColor: themeStyle.BORDER,
                width: Utility.getDeviceWidth() - 30,
                marginStart: Utility.setWidth(10),
                marginEnd: Utility.setWidth(10),
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
        </View>)

    }

    mainLayout(language) {
        return (<View>
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
                    fontFamily: fontStyle.RobotoRegular,
                    fontSize: FontSize.getSize(11),
                    color: themeStyle.BLACK_43,
                    marginStart: Utility.setWidth(30),
                    marginEnd: Utility.setWidth(30),
                    marginTop: 10
                }}>{this.state.otp_type === 0 ? language.otpViaMob + this.state.mobileNo : this.state.otp_type === 1 ? language.otpViaEmail + this.state.emailTxt : language.otpViaBoth}</Text>

        </View>)
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
                {this.state.stageVal === 0 ? this.mainLayout(language) : this.otpEnter(language)}
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
                <BusyIndicator visible={this.state.isProgress}/>
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

