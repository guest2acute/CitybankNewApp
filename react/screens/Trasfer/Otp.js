import React, {Component} from "react";
import {
    Platform,
    StatusBar,
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    BackHandler, Alert
} from "react-native";

import {connect} from "react-redux";
import themeStyle from "../../resources/theme.style";
import Utility from "../../utilize/Utility";

import {CommonActions} from "@react-navigation/native";
import CommonStyle from "../../resources/CommonStyle";
import {BusyIndicator} from "../../resources/busy-indicator";
import {FUNDTRFVERIFY} from "../Requests/FundsTransferRequest";
import Config from "../../config/Config";
import * as ReadSms from "react-native-read-sms/ReadSms";


class Otp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            otpVal: "",
        }
    }

    async submit(language) {
        if (this.state.otpVal.length !== 4) {
            Utility.alert(language.errOTP, language.ok);
        } else {
            await this.verifyOTP();
        }
    }

    otpEnter(language) {
        return (
            <View key={"otpEnter"}>
                <Text style={[CommonStyle.textStyle, {
                    marginStart: Utility.setWidth(10),
                    marginEnd: Utility.setWidth(10),
                    marginTop: Utility.setHeight(10),
                    marginBottom: Utility.setHeight(20),
                }]}> {language.otp_description}</Text>
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

    async verifyOTP() {
        this.setState({isProgress: true});
        let actions;
        if (this.props.route.params.routeVal.length > 1 && this.props.route.params.routeVal[1].name === "EmailTransfer") {
            actions = "EMAILFUNDOTPVERIFY";
        } else {
            actions = "FUNDTRFVERIFY";
        }
        await FUNDTRFVERIFY(
            this.props.userDetails, this.props.route.params.REQUEST_CD, this.state.otpVal,
            actions, this.props)
            .then((response) => {
                console.log(response);
                this.setState({isProgress: false});
                this.alertConfirm(response);
            }, (error) => {
                this.setState({isProgress: false});
                console.log("error", error);
            });
    }

    alertConfirm(response) {
        Alert.alert(
            Config.appName,
            response.MESSAGE,
            [
                {
                    text: this.props.language.ok, onPress: () => {
                        if (response.STATUS === "999") {
                            CommonActions.reset({
                                routes: this.props.route.params.routeVal,
                                index: this.props.route.params.routeIndex
                            });
                        } else {
                            this.props.navigation.navigate("Receipt",
                                {
                                    REQUEST_CD: "",
                                    transType: "fund",
                                    response: response.RESPONSE[0],
                                    routeVal: this.props.route.params.routeVal,
                                    routIndex: this.props.route.params.routeIndex,
                                    transferArray: this.props.route.params.transferArray
                                });
                        }

                    }
                },
            ]
        );
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
                    <Text style={CommonStyle.title}>{language.verifyOtp}</Text>
                </View>
                {this.otpEnter(language)}
                <TouchableOpacity
                    onPress={() => this.submit(language)}>
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
                            }]}>{language.submit_txt}</Text>
                    </View>
                </TouchableOpacity>
                <BusyIndicator visible={this.state.isProgress}/>
            </View>

        );
    }

    async componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.THEME_COLOR);
                StatusBar.setBarStyle("light-content");
            });
            BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
            await this.startReadSMS();
        }
        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.transfer
        });
    }

    startReadSMS = async () => {
        console.log("Great!! you have received new sms:");
        const hasPermission = await ReadSms.requestReadSMSPermission();
        if (hasPermission) {
            await ReadSms.startReadSMS((status, sms, error) => {
                if (status === "success") {
                    console.log("Great!! you have received new sms:", sms);
                }
            });
        }
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener("hardwareBackPress", this.backAction);
            ReadSms.stopReadSMS();
        }
    }

    backAction = () => {
        this.backEvent();
        return true;
    }

    backEvent() {
        this.props.navigation.goBack(null);
    }
}


const mapStateToProps = (state) => {
    return {
        userDetails: state.accountReducer.userDetails,
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(Otp);

