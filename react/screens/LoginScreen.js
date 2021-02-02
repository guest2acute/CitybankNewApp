import React, {Component} from "react";
import {
    SafeAreaView,
    View,
    Text,
    StatusBar,
    TouchableOpacity, Platform,
    TextInput, Image,
    Keyboard, ScrollView, Alert, Linking,
} from "react-native";
import themeStyle from "../resources/theme.style";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import dimen from "../resources/Dimens";
import FontSize from "../resources/ManageFontSize";
import {BusyIndicator} from "../resources/busy-indicator";
import {connect} from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import Config from "../config/Config";
import FontStyle from "../resources/FontStyle";
import {actions} from "../redux/actions";
import en from "../localization/en";
import bangla from "../localization/bangla";
import Utility from "../utilize/Utility";
import fontStyle from "../resources/FontStyle";

import DeviceInfo from "react-native-device-info";
import Actions from "./ApiConfig/Actions";
import User from "../utilize/User";
import {CommonActions} from "@react-navigation/native";


class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userid: "",
            passwordTxt: "",
            isProgress: false,
            passwordVisible: false,
            hasFinger: false,
        };
    }

    /**
     * onSubmit button action
     */

    async onSubmit() {
        if (this.state.userid === "") {
            Utility.alert("Please enter user id");
        } else if (this.state.userid.length < 8) {
            Utility.alert("Invalid user id");
        } else if (this.state.passwordTxt === "") {
            Utility.alert("Please enter password");
        } else {
            this.setState({isProgress: true}, () => {
                this.loginRequest(this.state.userid, this.state.passwordTxt);
            })
        }
    }

    async loginRequest(user_id, password) {
        console.log("user_id", user_id);
        let loginReq = {
            DEVICE_ID: await Utility.getDeviceID(),
            LOGIN_TYPE: "P",
            USER_ID: user_id,
            DUAL_AUTHENTIC: "N",
            ACTION: Actions.LOGIN_REQUEST,
            PASSWORD: password,
            ...Config.commonReq
        };

        await this.makePostApiCall(loginReq);
    }

    async makePostApiCall(body) {
        console.log("body",body);
        fetch(Config.base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('responseJson', responseJson);
                if (responseJson != null) {
                    this.parseResponse(responseJson[0])
                }
            })
            .catch((error) => {
                return "";
            });
    }

    async parseResponse(result) {
        console.log("response", result);
        this.setState({isProgress: false});
        if (result.STATUS === "71") {
            let that = this;
            Alert.alert(
                Config.appName,
                result.MESSAGE,
                [
                    {
                        text: "No", onPress: () =>{}
                    },
                    {
                        text: "Yes", onPress: () =>
                            that.props.navigation.navigate("DeviceChangeScreen", {
                                userid: result.RESPONSE[0].USER_ID
                            })
                    },
                ]
            );
        } else if (result.STATUS !== "0") {
            Utility.alert(result.MESSAGE);
        } else {
            await User.store(Config.ActivityCd, result.ACTIVITY_CD);
            let response = result.RESPONSE[0];
            let userDetails = {
                UserName: this.state.userid,
                ACTIVITY_CD: result.ACTIVITY_CD,
                CUSTOMER_DTL_LIST: response.CUSTOMER_DTL_LIST,
                CUSTOMER_ID: response.CUSTOMER_ID,
                USER_ID: response.USER_ID,
                CUSTOMER_NM: response.CUSTOMER_NM,
                LAST_LOGIN_DT: response.LAST_LOGIN_DT,
                MOBILE_NO: response.MOBILE_NO,
                PERSON_NICK_NAME: response.PERSON_NICK_NAME,
                LOGIN_PASS_EXP_DAY: response.LOGIN_PASS_EXP_DAY,
                TXN_PASS_EXP_DAY: response.TXN_PASS_EXP_DAY,
                LANGUAGE_FLAG: response.LANGUAGE_FLAG,
                LOGIN_PASS_EXP_ALERT: response.LOGIN_PASS_EXP_ALERT,
                LOGIN_PASS_EXP_ALERT_MSG: response.LOGIN_PASS_EXP_ALERT_MSG,
                TXN_PASS_EXP_ALERT: response.TXN_PASS_EXP_ALERT,
                TXN_PASS_EXP_ALERT_MSG: response.TXN_PASS_EXP_ALERT_MSG,
                USER_PROFILE_IMG: response.USER_PROFILE_IMG,
            };
            await this.getUserDetails(userDetails, result);
        }
    }

    async getUserDetails(userDetails, result) {
        this.setState({isProgress: true});
        let userReq = {
            DEVICE_ID: Utility.getDeviceID(),
            USER_ID: this.state.userid,
            ACTION: "USERVERIFY",
            REQ_FLAG: "R",
            ...Config.commonReq
        }
        console.log("userReq", userReq);
        fetch(Config.base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userReq),
        })
            .then((response) => response.json())
            .then(async (responseJson) => {
                console.log('responseJson', responseJson);
                this.setState({isProgress: false});
                if (responseJson != null) {
                    let response = responseJson[0];
                    if (response.STATUS === "0") {
                        userDetails = {...userDetails, AUTH_TYPE: response.AUTH_TYPE}
                        this.props.dispatch({
                            type: actions.account.SET_USER_DETAILS,
                            payload: {
                                userDetails: userDetails,
                            },
                        });
                        this.props.dispatch({
                            type: actions.account.CHANGE_LOGIN_PREF,
                            payload: {
                                login_val: this.state.login_value,
                            },
                        });
                        await this.redirect(result);
                    } else {
                        Utility.alert(response.MESSAGE);
                    }
                }
            })
            .catch((error) => {
                this.setState({isProgress: false});
                return "";
            });

    }

    async redirect(response) {
        let isFirstTime = await User.retrieve(Config.isFirstTime);
        console.log("isFirstTime", isFirstTime);
        setTimeout(() => {
            if (isFirstTime === undefined || isFirstTime === null || isFirstTime === "0") {
                this.props.navigation.replace("EditProfileScreen", {
                    language: this.props.language,
                    screenFrom: "login",
                    userid: this.state.userid
                });
            } else {
                this.props.navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{name: "Navigator"}],
                    }),
                );
            }
        }, 100);

    }

    changeLanguage(langCode) {
        console.log("langCode", langCode);
        this.props.dispatch({
            type: actions.account.CHANGE_LANG,
            payload: {
                langId: langCode,
            },
        });
    }

    userInput(text) {
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        this.setState({userid: text})
    }

    passwordChange(text) {
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        this.setState({passwordTxt: text})
    }

    render() {
        let language = this.props.language;
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>

                <ScrollView showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handle">

                    <View style={{
                        marginLeft: wp(dimen.dim_w30),
                        marginRight: wp(dimen.dim_w30),
                    }}>

                        <View style={{
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: hp(dimen.dim_h10),
                        }}>
                            <Image
                                source={require("../resources/images/logo_transparent.png")}
                                resizeMode="contain"
                                style={{
                                    height: Config.getDeviceWidth() / 2.5,
                                    width: Config.getDeviceWidth() / 2.5,
                                }}
                            />
                        </View>

                        <View style={{
                            flexDirection: "column",
                            marginTop: 20,
                        }}>

                            <View style={{
                                height: hp(dimen.dim_h50),
                                flex: 1,
                                borderRadius: 2,
                                borderWidth: 0.5,
                                overflow: "hidden",
                                borderColor: themeStyle.BLACK,
                                backgroundColor: themeStyle.WHITE,
                                flexDirection: "row",
                                alignItems: "center",
                            }}>

                                <TextInput
                                    style={{
                                        fontSize: FontSize.getSize(14),
                                        marginLeft: 10,
                                        flex: 1,
                                        fontFamily: FontStyle.RobotoRegular,
                                    }}
                                    placeholder={language.user_ID}
                                    onChangeText={text => this.userInput(text)}
                                    value={this.state.userid}
                                    multiline={false}
                                    numberOfLines={1}
                                    contextMenuHidden={true}
                                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                    autoCorrect={false}
                                    maxLength={12}
                                    // autoFocus={true}
                                />

                            </View>
                            <View style={{alignItems: "flex-end", marginTop: hp(dimen.dim_h5)}}>
                                <TouchableOpacity onPress={() =>
                                    this.props.navigation.navigate("ForgotUIDScreen", {language: this.props.language})}>
                                    <Text style={{
                                        color: themeStyle.THEME_COLOR,
                                        fontSize: FontSize.getSize(12),
                                        fontFamily: FontStyle.RobotoRegular, textDecorationLine: "underline"
                                    }}>{language.fgt_uid}</Text>
                                </TouchableOpacity>
                            </View>


                            <View style={{
                                height: hp(dimen.dim_h50),
                                flex: 1,
                                borderRadius: 2,
                                borderWidth: 0.5,
                                marginTop: hp(dimen.dim_h20),
                                overflow: "hidden",
                                borderColor: themeStyle.BLACK,
                                backgroundColor: themeStyle.WHITE,
                                flexDirection: "row",
                                alignItems: "center",
                            }}>
                                <TextInput
                                    style={{
                                        fontSize: FontSize.getSize(14),
                                        marginLeft: 10,
                                        flex: 1,
                                        fontFamily: FontStyle.RobotoRegular,
                                    }}
                                    placeholder={language.passwordTxt}
                                    onChangeText={text => this.passwordChange(text)}
                                    value={this.state.passwordTxt}
                                    multiline={false}
                                    numberOfLines={1}
                                    contextMenuHidden={true}
                                    secureTextEntry={!this.state.passwordVisible}
                                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                    autoCorrect={false}
                                />

                                <Icon style={{marginEnd: 10}}
                                      name={this.state.passwordVisible ? "eye" : "eye-slash"}
                                      size={20}
                                      color="#000000" onPress={() => {
                                    this.setState({passwordVisible: !this.state.passwordVisible});
                                }}/>

                            </View>
                            <View style={{alignItems: "flex-end", marginTop: hp(dimen.dim_h5)}}>
                                <TouchableOpacity onPress={() =>
                                    this.props.navigation.navigate("ForgotPwdScreen", {language: this.props.language})}>
                                    <Text style={{
                                        color: themeStyle.THEME_COLOR,
                                        fontSize: FontSize.getSize(12),
                                        fontFamily: FontStyle.RobotoRegular, textDecorationLine: "underline"
                                    }}>{language.fgt_pwd}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{
                            marginTop: hp(dimen.dim_h40),
                            backgroundColor: themeStyle.THEME_COLOR,
                            height: hp(dimen.dim_h48),
                            borderRadius: hp(dimen.dim_h48) / 2,
                            justifyContent: "center",
                            shadowColor: themeStyle.RED_COLOR,
                            shadowOpacity: 0.5,
                            shadowRadius: 16,
                            shadowOffset: {
                                height: 6,
                                width: 2,
                            },
                        }}>
                            <TouchableOpacity
                                style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}
                                disabled={this.state.isProgress}
                                onPress={() =>
                                    this.onSubmit()
                                }>
                                <Text style={{
                                    color: "#fff",
                                    fontSize: FontSize.getSize(14),
                                    textAlign: "center",
                                    fontFamily: FontStyle.RobotoBold,
                                }}>{language.login}</Text>


                            </TouchableOpacity>

                        </View>

                        <View style={{
                            marginTop: hp(dimen.dim_h25),
                            backgroundColor: themeStyle.WHITE,
                            borderColor: themeStyle.THEME_COLOR,
                            borderWidth: 1,
                            height: hp(dimen.dim_h48),
                            borderRadius: hp(dimen.dim_h48) / 2,
                            justifyContent: "center",
                            shadowColor: themeStyle.RED_COLOR,
                            shadowOpacity: 0.5,
                            shadowRadius: 16,
                            shadowOffset: {
                                height: 6,
                                width: 2,
                            },
                        }}>
                            <TouchableOpacity
                                style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}
                                disabled={this.state.isProgress}
                                onPress={() =>
                                    this.props.navigation.navigate("SignupWithScreen", {language: this.props.language})
                                }>
                                <Text style={{
                                    color: themeStyle.THEME_COLOR,
                                    fontSize: FontSize.getSize(14),
                                    textAlign: "center",
                                    fontFamily: FontStyle.RobotoMedium,
                                }}>{language.signup}</Text>

                            </TouchableOpacity>
                        </View>
                        {/* <TouchableOpacity onPress={() =>
                            this.props.navigation.navigate("ForgotPwdScreen", {language: this.props.language})
                        }>
                            <Text style={{
                                color: themeStyle.THEME_COLOR,
                                fontSize: FontSize.getSize(13),
                                textAlign: "center",
                                marginTop: hp(dimen.dim_h30),
                                fontFamily: FontStyle.RobotoMedium,
                            }}>{language.fgt_pwd_uid}</Text></TouchableOpacity>*/}

                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: hp(dimen.dim_h20),
                        }}>
                            <Text style={styles.label}>{language.donot_have_act}</Text>
                            <TouchableOpacity onPress={() => Linking.openURL(Config.onBoardURl)}>
                                <Text style={{
                                    marginStart: 3,
                                    fontSize: FontSize.getSize(12),
                                    fontFamily: fontStyle.RobotoMedium,
                                    textDecorationLine: "underline",
                                    color: themeStyle.THEME_COLOR,
                                }
                                }>{language.open_account}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
                <BusyIndicator visible={this.state.isProgress}/>
            </View>
        );
    }

    componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.OFF_WHITE_COLOR);
                StatusBar.setBarStyle("dark-content");
            });
        }
    }


    componentDidUpdate(prevProps, prevState, snapshot) {

    }
}

const
    styles = {
        label: {
            fontSize: FontSize.getSize(13),
            fontFamily: fontStyle.RobotoRegular,
        },
    };


const
    mapStateToProps = (state) => {
        return {
            langId: state.accountReducer.langId,
            language: state.accountReducer.language,
            userDetails: state.accountReducer.userDetails,
        };
    };

export default connect(mapStateToProps)(LoginScreen);

