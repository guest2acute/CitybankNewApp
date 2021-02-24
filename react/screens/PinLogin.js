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
    Platform, AsyncStorage
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
            hasFinger: false,
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
        }
        let loginPref = await StorageClass.retrieve(Config.LoginPref);
        this.setState({loginPref: loginPref});
        if (loginPref === "2")
            this.checkFingerTouch();
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
    }

    async onSubmit(language) {
        console.log("in", "in");
        let password = "";
        if (this.state.loginPref === "0") {
            if (this.state.passwordTxt.length === 0) {
                this.setState({errorTextPwd: language.require_pwd});
                return;
            } else {
                password = this.state.passwordTxt;
            }
        } else if (this.state.loginPref === "1") {
            password = this.state.one + this.state.two + this.state.three + this.state.four + this.state.five + this.state.six;
            if (password.length !== 6) {
                this.setState({errorPIN: language.errValidPin});
                return;
            }
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
        let result = await ApiRequest.apiRequest.callApi(loginReq, {});
        console.log("logres",result);
       // result = result[0];

        this.setState({isProgress: false});
        if (result.STATUS === "0") {
            await this.processLoginResponse(result, userName);
        } else {
            Utility.alert(result.MESSAGE);
        }
    }

    async processLoginResponse(result, userName) {
        let response = result.RESPONSE[0];
        console.log("response",response);
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
        };
        console.log("userDetails", userDetails);

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
                this.showAuthenticationDialog();
            })
            .catch((error) => console.log("isSensorAvailable error => ", error));
    }

    getMessage = () => {
        const {biometryType} = this.state;
        /* if (biometryType === "TouchID") {
           return "Scan your Face on the device to continue";
         } else {*/
        return "Scan your Fingerprint on the mobile scanner to continue";
        // }
    };

    showAuthenticationDialog = () => {
        const {biometryType} = this.state;
        if (biometryType !== null && biometryType !== undefined) {
            FingerprintScanner.authenticate({
                description: this.getMessage()
            })
                .then(() => {
                    this.props.navigation.replace("Navigator");
                })
                .catch((error) => {
                    FingerprintScanner.release();
                    this.popupConfirm();
                    console.log('Authentication error is => ', error);
                });
        } else {
            console.log('biometric authentication is not available');
        }
    };

    popupConfirm() {
        Alert.alert(
            Config.appName,
            "Please validate using finger to login",
            [
                {text: "Ok", onPress: () => this.showAuthenticationDialog()},
                {text: "Close app", onPress: () => BackHandler.exitApp()},
            ]
        );
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
                <Text style={[CommonStyle.midTextStyle, {
                    color: themeStyle.PLACEHOLDER_COLOR,
                    textAlign: "center",
                    fontSize: FontSize.getSize(18)
                }]}>{language.PinNumber}
                </Text>
            </View>

            <View>
                <View style={{
                    marginHorizontal: 20,
                    alignItems: "center",
                    justifyContent: "space-around",
                    flexDirection: "row",
                    marginTop: Utility.setHeight(40)
                }}>
                    <TextInput
                        ref={(ref) => this.one = ref}
                        style={[{...oneStyle}, {
                            fontFamily: fontStyle.RobotoMedium,
                            fontSize: FontSize.getSize(20),
                            height: Utility.setHeight(45),
                            backgroundColor: '#e8e8e8',
                            borderColor: '#e8e8e8',
                            borderRadius: 5,
                            borderWidth: 2,
                            alignSelf: "center",
                            padding: 10,
                            textAlign: "center"
                        }]}
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
                        style={[{...twoStyle}, {
                            fontFamily: fontStyle.RobotoMedium,
                            fontSize: FontSize.getSize(20),
                            height: Utility.setHeight(45),
                            backgroundColor: '#e8e8e8',
                            borderColor: '#e8e8e8',
                            borderRadius: 5,
                            borderWidth: 2,
                            alignSelf: "center",
                            padding: 10,
                            textAlign: "center"
                        }]}
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
                        style={[{...threeStyle}, {
                            fontFamily: fontStyle.RobotoMedium,
                            fontSize: FontSize.getSize(20),
                            height: Utility.setHeight(45),
                            backgroundColor: '#e8e8e8',
                            borderColor: '#e8e8e8',
                            borderRadius: 5,
                            borderWidth: 2,
                            alignSelf: "center",
                            padding: 10,
                            textAlign: "center"
                        }]}
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
                        style={[{...fourStyle}, {
                            fontFamily: fontStyle.RobotoMedium,
                            fontSize: FontSize.getSize(20),
                            height: Utility.setHeight(45),
                            backgroundColor: '#e8e8e8',
                            borderColor: '#e8e8e8',
                            borderRadius: 5,
                            borderWidth: 2,
                            alignSelf: "center",
                            padding: 10,
                            textAlign: "center"
                        }]}
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
                        style={[{...fiveStyle}, {
                            fontFamily: fontStyle.RobotoMedium,
                            fontSize: FontSize.getSize(20),
                            height: Utility.setHeight(45),
                            borderRadius: 5,
                            backgroundColor: '#e8e8e8',
                            borderColor: '#e8e8e8',
                            borderWidth: 2,
                            alignSelf: "center",
                            padding: 10,
                            textAlign: "center"
                        }]}
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
                        style={[{...sixStyle}, {
                            fontFamily: fontStyle.RobotoMedium,
                            fontSize: FontSize.getSize(20),
                            height: Utility.setHeight(45),
                            backgroundColor: '#e8e8e8',
                            borderColor: '#e8e8e8',
                            borderRadius: 5,
                            elevation: 1,
                            alignSelf: "center",
                            padding: 10,
                            textAlign: "center"
                        }]}
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
                marginTop: isPin ? Utility.setHeight(50) : Utility.setHeight(20),
                backgroundColor: themeStyle.THEME_COLOR,
                height: Utility.setHeight(44),
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

            {this.state.loginPref === "1" ? <View style={{
                marginTop: 10,
                marginHorizontal: 10,
                backgroundColor: themeStyle.THEME_COLOR,
                height: 40,
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
            </View> : null}
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
                            onPress={() => this.changeLanguage("en")}
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
                            onPress={() => this.changeLanguage("bangla")}
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
                <BusyIndicator visible={this.state.isProgress}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    inputcontainer: {
        //height: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: '20%',
        marginBottom: '2%',

    },
    textInput: {
        fontSize: 22,
        textAlign: 'center',
        paddingVertical: 0,
        paddingHorizontal: 0,
        //width: '12%'
        borderWidth: 2,
        height: 30
    },
});

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(PinLogin);
