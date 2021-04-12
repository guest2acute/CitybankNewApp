import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Image,
    Platform, AsyncStorage, Alert, BackHandler
} from 'react-native';

import {actions} from "../redux/actions";
import {connect} from "react-redux";
import Config from "../config/Config";
import {LoginScreen} from "./LoginScreen";
import Utility from "../utilize/Utility";
import CommonStyle from "../resources/CommonStyle";
import FontSize from "../resources/ManageFontSize";
import fontStyle from "../resources/FontStyle";
import themeStyle from "../resources/theme.style";
import FingerprintScanner from "react-native-fingerprint-scanner";
import Icon from "react-native-vector-icons/FontAwesome";
import StorageClass from "../utilize/StorageClass";
import {StackActions} from "@react-navigation/native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import dimen from "../resources/Dimens";
import ApiRequest from "../config/ApiRequest";
import {BusyIndicator} from "../resources/busy-indicator";
import {DeviceChange, unicodeToChar} from "./Requests/CommonRequest";
import {QRSCANCODE} from "./Requests/QRRequest";


class PinLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            one: '',
            two: '',
            three: '',
            four: '',
            five: '',
            six: '',
            oneFocus: false,
            twoFocus: false,
            threeFocus: false,
            fourFocus: false,
            fiveFocus: false,
            sixFocus: false,
            password: true,
            passwordTxt: "",
            errorTextPwd: "",
            biometryType: null,
            isProgress: false,
            loginPref: "",
            errorPIN: ""
        };
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
        }
        let loginPref = await StorageClass.retrieve(Config.LoginPref);
        this.setState({loginPref: loginPref});
        if (loginPref === "2") {
            this.checkFingerTouch();
        }
    }

    backAction = () => {
        Utility.exitApp(this.props.language);
        return true;
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener(
                "hardwareBackPress", this.backAction)
        }
    }


    passwordChange(text) {
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        this.setState({passwordTxt: text, errorTextPwd: ""})
    }

    handleChangeTextOne = (text) => {
        this.setState({errorPIN: "", one: text}, () => {
            if (this.state.one) this.two.focus();
        });
    }
    handleChangeTextTwo = (text) => {
        this.setState({errorPIN: "", two: text}, () => {
            if (this.state.two) this.three.focus();
        });
    }
    handleChangeTextThree = (text) => {
        this.setState({errorPIN: "", three: text}, () => {
            if (this.state.three) this.four.focus();
        });
    }
    handleChangeTextFour = (text) => {
        this.setState({errorPIN: "", four: text}, () => {
            if (this.state.four) this.five.focus();
        });

    }
    handleChangeTextFive = (text) => {
        this.setState({errorPIN: "", five: text}, () => {
            if (this.state.five) this.six.focus();
        });
    }
    handleChangeTextSix = (text) => {
        this.setState({errorPIN: "", six: text});
    }

    redirection(navigation, screenName) {
        navigation.dispatch(
            StackActions.replace(screenName)
        )
    }

    async changeLanguage(langCode) {
        console.log("langCode", langCode);
        await StorageClass.store(Config.Language, langCode);
        this.props.dispatch({
            type: actions.account.CHANGE_LANG,
            payload: {
                langId: langCode,
            },
        });
        Config.commonReq = {...Config.commonReq, DISPLAY_LANGUAGE: langCode}
    }

    async onSubmit(language) {
        console.log("in", "in");
        let password = "";
        if (this.state.loginPref === "0") {
            //if (this.state.passwordTxt.length === 0) {
            if (!Utility.validPassword(this.state.passwordTxt)) {
                this.setState({errorTextPwd: language.errorpassword});
                return;
            } else {
                password = this.state.passwordTxt;
            }
        } else if (this.state.loginPref === "1") {
            password = this.state.one + this.state.two + this.state.three + this.state.four + this.state.five + this.state.six;
            if (password.length !== 6) {
                this.setState({errorPIN: language.digits6LoginPin});
                return;
            }
        } else {
            password = await StorageClass.retrieve(Config.BioPinPref);
        }
        await this.loginRequest(password);
    }

    async loginRequest(password) {
        let userName = await StorageClass.retrieve(Config.UserName);
        this.setState({isProgress: true});
        let loginReq = {
            DEVICE_ID: await Utility.getDeviceID(),
            LOGIN_TYPE: this.state.loginPref === "0" ? "P" : this.state.loginPref === "1" ? "L" : "B",
            USER_ID: userName,
            DUAL_AUTHENTIC: "N",
            ACTION: "LOGINREQ",
            PASSWORD: password,
            ...Config.commonReq
        };
        console.log("request", loginReq);

        await ApiRequest.apiRequest.callApi(loginReq, {}).then(async result => {
            console.log("responseVal", result);
            this.setState({isProgress: false,});
            if (result.STATUS === "0") {
                await this.processLoginResponse(result, userName);
            } else if (result.STATUS === "71") {
                DeviceChange(result, this.props);
            } else {
                Alert.alert(
                    Config.appName,
                    unicodeToChar(result.MESSAGE),
                    [
                        {
                            text: this.props.language.ok, onPress: () => {
                                if (this.state.loginPref === "0") {
                                    this.setState({
                                        passwordTxt: ""
                                    });
                                    this.passwordRef.focus();
                                } else if (this.state.loginPref === "1") {
                                    this.setState({
                                        one: '',
                                        two: '',
                                        three: '',
                                        four: '',
                                        five: '',
                                        six: ''
                                    });
                                    this.one.focus();
                                } else if (this.state.loginPref === "2") {
                                    this.showAuthenticationDialog();
                                }
                            }
                        },
                    ]
                );
            }
        }).catch(error => {
            this.setState({isProgress: false});
            Alert.alert(
                Config.appName,
                this.props.language.somethingWrong,
                [
                    {
                        text: this.props.language.ok, onPress: () => {
                            if (this.state.loginPref === "2") {
                                this.showAuthenticationDialog();
                            }
                        }
                    },
                ]
            );
        });

    }


    async processLoginResponse(result, userName) {
        let response = result.RESPONSE[0];
        console.log("response", response);
        let userDetails = {
            UserName: userName,
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
            TXN_PASS_REG_FLAG: response.TXN_PASS_REG_FLAG,
            EMAIL_ID: response.EMAIL_ID,
        };
        console.log("userDetails", userDetails);

        Config.userRequest = {
            ACTIVITY_CD: result.ACTIVITY_CD,
            CUSTOMER_ID: response.CUSTOMER_ID,
            USER_ID: response.USER_ID,
        };


        this.props.dispatch({
            type: actions.account.SET_USER_DETAILS,
            payload: {
                userDetails: userDetails,
            },
        });
        this.props.navigation.dispatch(
            StackActions.replace("BottomNavigator", {userID: response.USER_ID})
        )
    }

    backspace = (id) => {
        if (id === 'two') {
            if (this.state.two) {
                this.setState({two: ''});
            } else if (this.state.one) {
                this.setState({one: ''});
                this.one.focus();
            }
        } else if (id === 'three') {
            if (this.state.three) {
                this.setState({three: ''});
            } else if (this.state.two) {
                this.setState({two: ''});
                this.two.focus();
            }
        } else if (id === 'four') {
            if (this.state.four) {
                this.setState({four: ''});
            } else if (this.state.three) {
                this.setState({three: ''});
            } else if (this.state.two) {
                this.setState({two: ''});
                this.two.focus();
            }
        } else if (id === 'five') {
            if (this.state.five) {
                this.setState({five: ''});
            } else if (this.state.four) {
                this.setState({four: ''});
            } else if (this.state.three) {
                this.setState({three: ''});
            } else if (this.state.two) {
                this.setState({two: ''});
                this.two.focus();
            }
        }
        if (id === 'six') {
            if (this.state.six) {
                this.setState({six: ''});
            } else if (this.state.five) {
                this.setState({five: ''});
            } else if (this.state.four) {
                this.setState({four: ''});
            } else if (this.state.three) {
                this.setState({three: ''});
            } else if (this.state.two) {
                this.setState({two: ''});
                this.two.focus();
            }
        }
    }

    fingerView(language) {
        return (<View>
            <View style={{marginTop: hp(dimen.dim_h100)}}>
                <Image style={{
                    width: wp(dimen.dim_w80), height: hp(dimen.dim_h80), marginBottom: 10,
                    alignSelf: "center", tintColor: themeStyle.THEME_COLOR,
                }} resizeMode={"contain"}
                       source={require("../resources/images/thumbprint_icon.jpg")}/>

                <Text style={{
                    fontSize: FontSize.getSize(16), fontFamily: fontStyle.RobotoBold
                    , alignSelf: "center", color: themeStyle.BLACK_43
                    , marginBottom: 10,
                }}>{language.loginFinger}
                </Text>
                <Text style={{
                    fontSize: FontSize.getSize(13),
                    fontFamily: fontStyle.RobotoRegular,
                    alignSelf: "center",
                    marginBottom: 20,
                    color: "#000000",
                }}>{language.placeFinger}
                </Text>
            </View>
        </View>)
    }

    passwordView(language) {
        return (<View style={{
            marginTop: Utility.setHeight(20),
            marginLeft: Utility.setHeight(20),
            marginRight: Utility.setHeight(20),
        }}>
            <Text style={[CommonStyle.midTextStyle, {
                color: themeStyle.THEME_COLOR,
            }]}>{language.pwd}
                <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
            </Text>
            <View style={{
                height: Utility.setHeight(40),
                flexDirection: "row",
                alignItems: "center",
            }}>
                <TextInput
                    ref={(ref) => this.passwordRef = ref}
                    selectionColor={themeStyle.THEME_COLOR}
                    style={{
                        fontSize: FontSize.getSize(13),
                        flex: 1,
                        fontFamily: fontStyle.RobotoRegular,
                        paddingBottom: -10
                    }}

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
            {this.loginButtonView(language, false)}
        </View>)
    }

    checkFingerTouch() {
        FingerprintScanner.isSensorAvailable()
            .then((biometryType) => {
                this.setState({biometryType}, () => {
                    this.showAuthenticationDialog();
                });
            })
            .catch((error) => console.log("isSensorAvailable error => ", error));
    }


    showAuthenticationDialog = () => {
        const {biometryType} = this.state;
        console.log("")
        if (biometryType !== null && biometryType !== undefined) {
            FingerprintScanner.authenticate({
                description: this.props.language.biometricTitle,
                cancelButton: this.props.language.LoginWith
            })
                .then(async () => {
                    await this.onSubmit(this.props.language);
                    FingerprintScanner.release();
                })
                .catch(async (error) => {
                    FingerprintScanner.release();
                    if (error === undefined) {
                        return;
                    }
                    console.log('error is => ', error.message);
                    if (error.message.indexOf("tapped Cancel") !== -1) {
                        this.redirection(this.props.navigation, "LoginScreen");
                    } else {
                        this.popupConfirm();
                    }

                });
        } else {
            console.log('biometric authentication is not available');
        }
    };

    popupConfirm() {
        Alert.alert(
            Config.appName,
            this.props.language.biometricError,
            [
                {text: this.props.language.ok, onPress: () => this.showAuthenticationDialog()},
            ]
        );
    }

    async getQrDetails() {
        this.setState({isProgress: true});

        let userDetails = {
            USER_ID: await StorageClass.retrieve(Config.isFirstTime),
            ACTIVITY_CD: "",
            CUSTOMER_ID: ""
        }

        if (userDetails.USER_ID === null || userDetails.USER_ID === "") {
            Utility.alert(this.props.language.qr_merchant_without_login_alert);
            return;
        }

        QRSCANCODE(userDetails, "", "", "", "N", this.props).then(response => {
            console.log("response", response);
            this.setState({
                isProgress: false,
            });
            this.props.navigation.navigate("CityPay", {
                isLoggedIn: "N"
            });

        }).catch(error => {
            this.setState({isProgress: false});
            console.log("error", error);
        });
    }


    pinView(language) {
        const {oneFocus, twoFocus, threeFocus, fourFocus, fiveFocus, sixFocus} = this.state;
        const oneStyle = {
            borderBottomColor: oneFocus ? 'red' : 'black',
            borderBottomWidth: oneFocus ? 2 : 1,
        };
        const twoStyle = {
            borderBottomColor: twoFocus ? 'red' : 'black',
            borderBottomWidth: twoFocus ? 2 : 1,
        };
        const threeStyle = {
            borderBottomColor: threeFocus ? 'red' : 'black',
            borderBottomWidth: threeFocus ? 2 : 1,
        };
        const fourStyle = {
            borderBottomColor: fourFocus ? 'red' : 'black',
            borderBottomWidth: fourFocus ? 2 : 1,
        };
        const fiveStyle = {
            borderBottomColor: fiveFocus ? 'red' : 'black',
            borderBottomWidth: fiveFocus ? 2 : 1,
        };
        const sixStyle = {
            borderBottomColor: sixFocus ? 'red' : 'black',
            borderBottomWidth: sixFocus ? 2 : 1,
        };
        return (<View>
            <View style={{alignItems: "center", justifyContent: "center", marginTop: Utility.setHeight(150)}}>
                <Text style={{
                    textAlign: "center",
                    fontFamily: fontStyle.RobotoMedium,
                    color: themeStyle.GRAY_COLOR,
                    fontSize: FontSize.getSize(17)
                }}>{language.PinNumber}
                </Text>
            </View>

            <View>
                <View style={{
                    marginHorizontal: 20,
                    alignItems: "center",
                    justifyContent: "space-around",
                    flexDirection: "row",
                    marginTop: Utility.setHeight(10)
                }}>
                    <TextInput
                        ref={(ref) => this.one = ref}
                        style={[{...oneStyle}, styles.pinInputBox]}
                        secureTextEntry={true}
                        autoFocus={true}
                        //style={[styles.textInput, { ...oneStyle }]}
                        autoCorrect={false}
                        autoCapitalize='none'
                        keyboardType='number-pad'
                        caretHidden
                        onFocus={() => this.setState({oneFocus: true})}
                        onBlur={() => this.setState({oneFocus: false})}
                        maxLength={1}
                        onChangeText={(text) => {
                            this.handleChangeTextOne(text);
                        }}
                        value={this.state.one}
                    />
                    <TextInput
                        ref={(ref) => this.two = ref}
                        onKeyPress={({nativeEvent}) => (
                            nativeEvent.key === 'Backspace' ? this.backspace('two') : null
                        )}
                        style={[{...twoStyle}, styles.pinInputBox]}
                        secureTextEntry={true}
                        autoCorrect={false}
                        autoCapitalize='none'
                        maxLength={1}
                        onFocus={() => this.setState({twoFocus: true})}
                        onBlur={() => this.setState({twoFocus: false})}
                        caretHidden
                        keyboardType='number-pad'
                        onChangeText={(text) => {
                            this.handleChangeTextTwo(text);
                        }}
                        value={this.state.two}
                    />

                    <TextInput
                        ref={(ref) => this.three = ref}
                        onKeyPress={({nativeEvent}) => (
                            nativeEvent.key === 'Backspace' ? this.backspace('three') : null
                        )}
                        style={[{...threeStyle}, styles.pinInputBox]}
                        secureTextEntry={true}
                        autoCorrect={false}
                        autoCapitalize='none'
                        onFocus={() => this.setState({threeFocus: true})}
                        onBlur={() => this.setState({threeFocus: false})}
                        maxLength={1}
                        caretHidden
                        keyboardType='number-pad'
                        onChangeText={(text) => {
                            this.handleChangeTextThree(text);
                        }}
                        value={this.state.three}
                    />
                    <TextInput
                        ref={(ref) => this.four = ref}
                        onKeyPress={({nativeEvent}) => (
                            nativeEvent.key === 'Backspace' ? this.backspace('four') : null
                        )}
                        style={[{...fourStyle}, styles.pinInputBox]}
                        secureTextEntry={true}
                        autoCorrect={false}
                        autoCapitalize='none'
                        onFocus={() => this.setState({fourFocus: true})}
                        onBlur={() => this.setState({fourFocus: false})}
                        maxLength={1}
                        caretHidden
                        keyboardType='number-pad'
                        onChangeText={(text) => {
                            this.handleChangeTextFour(text);
                        }}
                        value={this.state.four}
                    />
                    <TextInput
                        ref={(ref) => this.five = ref}
                        onKeyPress={({nativeEvent}) => (
                            nativeEvent.key === 'Backspace' ? this.backspace('five') : null
                        )}
                        style={[{...fiveStyle}, styles.pinInputBox]}
                        secureTextEntry={true}
                        autoCorrect={false}
                        autoCapitalize='none'
                        onFocus={() => this.setState({fiveFocus: true})}
                        onBlur={() => this.setState({fiveFocus: false})}
                        maxLength={1}
                        caretHidden
                        keyboardType='number-pad'
                        onChangeText={(text) => {
                            this.handleChangeTextFive(text);
                        }}
                        value={this.state.five}
                    />
                    <TextInput
                        ref={(ref) => this.six = ref}
                        onKeyPress={({nativeEvent}) => (
                            nativeEvent.key === 'Backspace' ? this.backspace('six') : null
                        )}
                        style={[{...sixStyle}, styles.pinInputBox]}
                        secureTextEntry={true}
                        autoCorrect={false}
                        autoCapitalize='none'
                        onFocus={() => this.setState({sixFocus: true})}
                        onBlur={() => this.setState({sixFocus: false})}
                        maxLength={1}
                        caretHidden
                        keyboardType='number-pad'
                        onChangeText={(text) => {
                            this.handleChangeTextSix(text);
                        }}
                        returnKeyType={"done"}
                        onSubmitEditing={async (event) => {
                            await this.onSubmit(this.props.language);
                        }}
                        value={this.state.six}
                    />
                </View>
            </View>
            {this.state.errorPIN !== "" ?
                <Text style={{
                    marginLeft: 25,
                    marginRight: 25,
                    color: themeStyle.THEME_COLOR,
                    fontSize: FontSize.getSize(11),
                    fontFamily: fontStyle.RobotoRegular,
                    marginBottom: 10,
                    marginTop: 10
                }}>{this.state.errorPIN}</Text> : null}

            {this.loginButtonView(language, true)}
        </View>)
    }

    loginButtonView(language, isPin) {
        return (<View>
            <View style={{
                marginTop: Utility.setHeight(20),
                backgroundColor: themeStyle.THEME_COLOR,
                height: Utility.setHeight(55),
                borderRadius: Utility.setHeight(42),
                justifyContent: "center",
                alignSelf: "center",
                shadowColor: themeStyle.RED_COLOR,
                shadowOpacity: 0.5,
                shadowRadius: 16,
                shadowOffset: {
                    height: 6,
                    width: 2,
                },
                width: Utility.setWidth(170),
            }}>
                <TouchableOpacity
                    style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}
                    disabled={this.state.isProgress}
                    onPress={() => this.onSubmit(this.props.language)}>
                    <Text style={{
                        color: "#fff",
                        fontSize: FontSize.getSize(14),
                        textAlign: "center",
                        fontFamily: fontStyle.RobotoBold,
                    }}>{language.login}</Text>
                </TouchableOpacity>
            </View>

            <View style={{
                marginTop: Utility.setHeight(10),
                marginHorizontal: 10,
                backgroundColor: themeStyle.THEME_COLOR,
                height: Utility.setHeight(40),
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
                    onPress={() => this.redirection(this.props.navigation, "LoginScreen")}>
                    <Text style={{
                        color: "#fff",
                        fontSize: FontSize.getSize(14),
                        textAlign: "center",
                        fontFamily: fontStyle.RobotoBold,
                    }}>{this.props.language.LoginWith}</Text>
                </TouchableOpacity>
            </View>
        </View>)
    }

    render() {
        let language = this.props.language;

        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={CommonStyle.toolbar}>
                    <Text style={CommonStyle.title}>{this.props.language.PINLogin}</Text>
                    <View style={CommonStyle.headerLabel}>
                        <TouchableOpacity
                            onPress={() => this.changeLanguage(Config.EN)}
                            style={{
                                height: "100%",
                                justifyContent: "center",
                                backgroundColor: this.props.langId !== "en" ? themeStyle.THEME_COLOR : themeStyle.WHITE,
                            }}>
                            <Text style={[CommonStyle.langText, {
                                color: this.props.langId === "en" ? themeStyle.THEME_COLOR : themeStyle.WHITE
                            }]}>{this.props.language.language_english}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.changeLanguage(Config.BN)}
                            style={{
                                height: "100%",
                                justifyContent: "center",
                                backgroundColor: this.props.langId === "en" ? themeStyle.THEME_COLOR : themeStyle.WHITE,
                            }}>
                            <Text style={[CommonStyle.langText, {
                                color: this.props.langId !== "en" ? themeStyle.THEME_COLOR : themeStyle.WHITE
                            }]}>{this.props.language.language_bangla}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.state.loginPref === "0" ? this.passwordView(language) : this.state.loginPref === "1" ? this.pinView(language) : this.state.loginPref === "2" ? this.fingerView(language) : null}

                {this.state.loginPref !== "2" ?
                    <TouchableOpacity onPress={() => this.getQrDetails()}>
                        <Image style={{
                            alignSelf: "center",
                            marginTop: Utility.setHeight(20),
                            height: Utility.setHeight(70),
                            width: Utility.setWidth(70),
                            marginBottom: Utility.setHeight(20)
                        }} resizeMode={"contain"}
                               source={require("../resources/images/qr_login.jpg")}/>
                    </TouchableOpacity> : null}

                <BusyIndicator visible={this.state.isProgress}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textInput: {
        fontSize: 22,
        textAlign: 'center',
        paddingVertical: 0,
        paddingHorizontal: 0,
        //width: '12%'
        borderWidth: 2,
        height: 30
    },

    pinInputBox: {
        fontFamily: fontStyle.RobotoMedium,
        fontSize: FontSize.getSize(20),
        height: Utility.setHeight(45),
        width: Utility.setWidth(42),

        backgroundColor: '#F0EFF4',
        borderColor: '#F0EFF4',
        borderRadius: 5,
        borderWidth: 1,
        alignSelf: "center",
        padding: 10,
        textAlign: "center"
    }
});

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(PinLogin);
