import React, {Component} from "react";
import {
    SafeAreaView,
    View,
    Text,
    StatusBar,
    TextInput,
    Linking,
    Platform, TouchableOpacity, Image, ScrollView, Alert, BackHandler
} from "react-native";
import themeStyle from "../resources/theme.style";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import dimen from "../resources/Dimens";
import Icon from "react-native-vector-icons/FontAwesome";
import FontSize from "../resources/ManageFontSize";
import {BusyIndicator} from "../resources/busy-indicator";
import {connect} from "react-redux";
import {actions} from "../redux/actions";
import fontStyle from "../resources/FontStyle";
import Utility from "../utilize/Utility";
import CommonStyle from "../resources/CommonStyle";
import Config from "../config/Config";
import StorageClass from "../utilize/StorageClass";
import {CommonActions, StackActions} from "@react-navigation/native";
import * as DeviceInfo from "react-native-device-info";
import ApiRequest from "../config/ApiRequest";

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: "Test@123",
            passwordTxt: "Test1234",
            isProgress: false,
            passwordVisible: false,
            errorTextUid: "",
            errorTextPwd: "",
            focusUid: false,
            focusPwd: false,
        };
    }

    /**
     * onSubmit button action
     */

    async onSubmit(language) {
        const {userID, passwordTxt} = this.state;

        if (userID === "") {
            this.setState({errorTextUid: language.require_user_id});
        } else if (userID.length < 8) {
            this.setState({errorTextUid: language.require_length_user_id});
        } else if (passwordTxt === "") {
            this.setState({errorTextPwd: language.require_pwd});
        } else {
            await this.loginRequest(userID, passwordTxt);
        }

    }

    async processLoginResponse(result) {
        let response = result.RESPONSE[0];
        console.log("responseVal", response);
        let userDetails = {
            UserName: this.state.userID,
            AUTH_FLAG: response.AUTH_FLAG,
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
        console.log("userDetails", userDetails);

        this.props.dispatch({
            type: actions.account.SET_USER_DETAILS,
            payload: {
                userDetails: userDetails,
            },
        })
        await StorageClass.store(Config.UserName, this.state.userID);
        let isFirstTime = await StorageClass.retrieve(Config.isFirstTime);
        console.log("userIdVal ===userID", isFirstTime + "=== " + response.USER_ID);

        if (isFirstTime === response.USER_ID) {
            this.props.navigation.dispatch(
                StackActions.replace("BottomNavigator", {userID: response.USER_ID})
            )
        } else {
            this.props.navigation.dispatch(
                StackActions.replace("LoginConfigureProfile", {userID: response.USER_ID})
            )
        }

    }

    deviceChange(result) {
        let that = this;
        Alert.alert(
            Config.appName,
            result.MESSAGE,
            [
                {
                    text:that.props.language.no_txt
                },
                {
                    text:that.props.language.yes_txt, onPress: () =>
                        this.props.navigation.navigate("TermConditionScreen",
                            {
                                showButton: true,
                                deviceChangeRes:result.RESPONSE[0],
                            })
                },
            ]
        );
    }

    userInput(text) {
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        this.setState({userID: text, errorTextUid: ""})
    }

    passwordChange(text) {
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        this.setState({passwordTxt: text, errorTextPwd: ""})
    }

    async changeLanguage(props, langCode) {
        console.log("langCode", langCode);
        await StorageClass.store(Config.Language, langCode);
        props.dispatch({
            type: actions.account.CHANGE_LANG,
            payload: {
                langId: langCode,
            },
        });
    }


    async loginRequest(userName, passwordVal) {
        this.setState({isProgress: true});
        let loginReq = {
            DEVICE_ID: await Utility.getDeviceID(),
            LOGIN_TYPE: "P",
            USER_ID: userName,
            DUAL_AUTHENTIC: "N",
            ACTION: "LOGINREQ",
            PASSWORD: passwordVal,
            ...Config.commonReq
        };
        console.log("request", loginReq);
        let result = await ApiRequest.apiRequest.callApi(loginReq, {});
        console.log("result", result);
       // result = result[0];
        this.setState({isProgress: false});
        if (result.STATUS === "0") {
            await this.processLoginResponse(result);
        } else if (result.STATUS === "71") {
            this.deviceChange(result);
        } else {
            Utility.alert(result.MESSAGE);
        }
    }

    render() {
        let language = this.props.language;
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={CommonStyle.toolbar}>
                    <Text style={CommonStyle.title}>{language.login}</Text>
                    <View style={CommonStyle.headerLabel}>
                        <TouchableOpacity
                            onPress={() => this.changeLanguage(this.props, "en")}
                            style={{
                                height: "100%",
                                justifyContent: "center",
                                backgroundColor: this.props.langId !== "en" ? themeStyle.THEME_COLOR : themeStyle.WHITE,
                            }}>
                            <Text style={[CommonStyle.langText, {
                                color: this.props.langId === "en" ? themeStyle.THEME_COLOR : themeStyle.WHITE
                            }]}>{language.language_english}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.changeLanguage(this.props, "bangla")}
                            style={{
                                height: "100%",
                                justifyContent: "center",
                                backgroundColor: this.props.langId === "en" ? themeStyle.THEME_COLOR : themeStyle.WHITE,
                            }}>
                            <Text style={[CommonStyle.langText, {
                                color: this.props.langId !== "en" ? themeStyle.THEME_COLOR : themeStyle.WHITE
                            }]}>{language.language_bangla}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={{flex: 1}}>
                    <View style={{alignItems: "center", justifyContent: "center", marginTop: Utility.setHeight(25)}}>
                        <Image style={{
                            height: Utility.setHeight(50),
                            width: Utility.getDeviceWidth() / 3,
                            marginBottom: Utility.setHeight(30),
                            marginTop: Utility.setHeight(10)
                        }}
                               resizeMode={"contain"}
                               source={require("../resources/images/logo.png")}/>

                        <View style={{
                            borderColor: themeStyle.BORDER,
                            width: Utility.getDeviceWidth() - 30,
                            paddingLeft: Utility.setWidth(20),
                            paddingRight: Utility.setWidth(20),
                            paddingBottom: Utility.setWidth(20),
                            borderRadius: 5,
                            overflow: "hidden",
                            borderWidth: 2,

                        }}>
                            <TextInput
                                selectionColor={themeStyle.THEME_COLOR}
                                style={{
                                    fontSize: FontSize.getSize(13),
                                    fontFamily: fontStyle.RobotoRegular,
                                    paddingBottom: -10
                                }}
                                placeholder={language.user_ID}
                                onChangeText={text => this.userInput(text)}
                                value={this.state.userID}
                                multiline={false}
                                onFocus={() => this.setState({focusUid: true})}
                                onBlur={() => this.setState({focusUid: false})}
                                numberOfLines={1}
                                contextMenuHidden={true}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}
                                returnKeyType={"next"}
                                onSubmitEditing={(event) => {
                                    this.pwdRef.focus();
                                }}
                                maxLength={12}/>
                            <View style={{
                                borderBottomWidth: 1,
                                borderBottomColor: this.state.focusUid ? themeStyle.THEME_COLOR : themeStyle.BLACK
                            }}/>
                            {this.state.errorTextUid !== "" ?
                                <Text style={{
                                    marginLeft: 5, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                                    fontFamily: fontStyle.RobotoRegular,
                                }}>{this.state.errorTextUid}</Text> : null}

                            <View style={{
                                height: hp(dimen.dim_h50),
                                marginTop: hp(dimen.dim_h20),
                                flexDirection: "row",
                                alignItems: "center",
                            }}>
                                <TextInput
                                    selectionColor={themeStyle.THEME_COLOR}
                                    style={{
                                        fontSize: FontSize.getSize(13),
                                        flex: 1,
                                        fontFamily: fontStyle.RobotoRegular,
                                        paddingBottom: -10
                                    }}
                                    ref={(ref) => this.pwdRef = ref}
                                    placeholder={language.passwordTxt}
                                    onChangeText={text => this.passwordChange(text)}
                                    value={this.state.passwordTxt}
                                    multiline={false}
                                    onFocus={() => this.setState({focusPwd: true})}
                                    onBlur={() => this.setState({focusPwd: false})}
                                    numberOfLines={1}
                                    contextMenuHidden={true}
                                    secureTextEntry={!this.state.passwordVisible}
                                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                    autoCorrect={false}
                                />

                                <Icon style={{marginEnd: 10, marginBottom: -10}}
                                      name={this.state.passwordVisible ? "eye" : "eye-slash"}
                                      size={20}
                                      color="#000000" onPress={() => {
                                    this.setState({passwordVisible: !this.state.passwordVisible});
                                }}/>
                            </View>
                            <View style={{
                                borderBottomWidth: 1,
                                borderBottomColor: this.state.focusPwd ? themeStyle.THEME_COLOR : themeStyle.BLACK
                            }}/>
                            {this.state.errorTextPwd !== "" ?
                                <Text style={{
                                    marginLeft: 5, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                                    fontFamily: fontStyle.RobotoRegular,
                                }}>{this.state.errorTextPwd}</Text> : null}

                            <View style={{
                                marginTop: hp(dimen.dim_h40),
                                backgroundColor: themeStyle.THEME_COLOR,
                                height: hp(dimen.dim_h48),
                                borderRadius: 5,
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
                                        this.onSubmit(language)
                                    }>
                                    <Text style={{
                                        color: "#fff",
                                        fontSize: FontSize.getSize(14),
                                        textAlign: "center",
                                        fontFamily: fontStyle.RobotoBold,
                                    }}>{language.login}</Text>
                                </TouchableOpacity>
                            </View>


                            <View style={{
                                marginTop: Utility.setHeight(15),
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Text style={[CommonStyle.midTextStyle, {
                                    color: "#7E4645",
                                    textAlign: "center",
                                    marginRight: 3,
                                }]}>{language.new_signup}</Text>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("RegistrationAccount")}>
                                    <Text style={[CommonStyle.midTextStyle, {
                                        color: "#7E4645",
                                        textDecorationLine: "underline"
                                    }]}>{language.sign_up_now}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={() => this.props.navigation.navigate("CredentialDetails")}>
                                <Text style={{
                                    marginTop: 10, alignSelf: "center", fontFamily: fontStyle.RobotoMedium,
                                    fontSize: FontSize.getSize(13), color: "#7E4645", textAlign: "center"
                                }}>{language.fgt_uid_pwd_pin}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => Linking.openURL(Config.onBoardURl)}>
                                <Text style={{
                                    marginTop: 10, alignSelf: "center", fontFamily: fontStyle.RobotoMedium,
                                    fontSize: FontSize.getSize(13), color: "#7E4645", textAlign: "center",
                                    textDecorationLine: "underline"
                                }}>{language.open_account}</Text>
                            </TouchableOpacity>
                        </View>
                        <Image style={{
                            alignSelf: "center",
                            marginTop: Utility.setHeight(20),
                            height: Utility.setHeight(80),
                            width: Utility.setWidth(80),
                            marginBottom: Utility.setHeight(20)
                        }} resizeMode={"contain"}
                               source={require("../resources/images/qr_login.jpg")}/>

                    </View>
                </ScrollView>
                <View style={{alignItems: "center", justifyContent: "center"}}>
                    <View
                        style={{flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 5}}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("WebScreen",
                            {
                                load_url: Config.faqURl,
                                title: language.faqs
                            })}>
                            <Text style={styles.optionText}>{language.faqs}</Text>
                        </TouchableOpacity>
                        <Text style={styles.dashStyle}>|</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("WebScreen",
                            {
                                load_url: Config.atmBranchURl,
                                title: language.atm_branch
                            })}>
                            <Text style={styles.optionText}>{language.atm_branch}</Text>
                        </TouchableOpacity>

                        <Text style={styles.dashStyle}>|</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("WebScreen",
                            {
                                load_url: Config.infoURl,
                                title: language.info
                            })}>
                            <Text style={styles.optionText}>{language.info}</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={{flexDirection: "row"}}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("WebScreen",
                            {
                                load_url: Config.privacyURl,
                                title: language.privacy
                            })}>
                            <Text style={styles.optionText}>{language.privacy}</Text>
                        </TouchableOpacity>
                        <Text style={styles.dashStyle}>|</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("WebScreen",
                            {
                                load_url: Config.contactURl,
                                title: language.contact
                            })}>
                            <Text style={styles.optionText}>{language.contact}</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.rightReserved}>{language.right_reserved}
                    </Text>
                </View>
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
            this.backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
        }
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener(
                "hardwareBackPress", this.backHandler)
        }
    }

    backAction = () => {
        Utility.exitApp(this.props.language);
        return true;
    }
}

const
    styles = {

        optionText: {
            fontFamily: fontStyle.RobotoMedium, fontSize: FontSize.getSize(12), color: themeStyle.THEME_COLOR
        },
        dashStyle: {
            marginLeft: Utility.setWidth(20),
            fontSize: FontSize.getSize(12),
            marginRight: Utility.setWidth(20),
            color: themeStyle.PLACEHOLDER_COLOR
        },

        rightReserved: {
            marginTop: Utility.setHeight(30),
            marginLeft: Utility.setWidth(10),
            marginRight: Utility.setWidth(10),
            marginBottom: Utility.setHeight(20),
            fontFamily: fontStyle.RobotoRegular, fontSize: FontSize.getSize(9), color: themeStyle.PLACEHOLDER_COLOR
        }
    }


const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(LoginScreen);
