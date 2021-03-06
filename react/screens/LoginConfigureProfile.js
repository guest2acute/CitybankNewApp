import {connect} from "react-redux";
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    TextInput, FlatList, Platform, StatusBar, BackHandler
} from "react-native";
import themeStyle from "../resources/theme.style";
import fontStyle from "../resources/FontStyle";
import FontSize from "../resources/ManageFontSize";
import CommonStyle from "../resources/CommonStyle";
import React, {Component} from "react";
import {BusyIndicator} from "../resources/busy-indicator";
import Utility from "../utilize/Utility";
import RadioForm from "react-native-simple-radio-button";
import StorageClass from "../utilize/StorageClass";
import Config from "../config/Config";
import {StackActions} from "@react-navigation/native";
import {actions} from "../redux/actions";
import FingerprintScanner from "react-native-fingerprint-scanner";
import ApiRequest from "../config/ApiRequest";

let userID = "";

class LoginConfigureProfile extends Component {
    constructor(props) {
        super(props);
        userID = props.route.params.userID;
        this.state = {
            isProgress: false,
            transactionPin: "",
            confirmTransactionPin: "",
            alias: "",
            loginPin: "",
            errorLoginPIN: "",
            conf_loginPin: "",
            errorConfLoginPIN: "",
            errorTransPIN: "",
            errorConfTransPIN: "",
            loginPrefVal: "0",
            biometryType: null,
            prefOption: true
        }
        this.checkFingerTouch();
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    marginStart: 5,
                    marginEnd: 5,
                    backgroundColor: themeStyle.SEPARATOR,
                }}
            />
        );
    };

    async updateUserRequest(navigation) {
        let userDetails = this.props.userDetails;
        this.setState({isProgress: true});
        let userRequest = {
            ALIAS: this.state.alias,
            TRANSACTION_PIN: this.state.transactionPin,
            CUSTOMER_ID: userDetails.CUSTOMER_ID.toString(),
            USER_ID: userDetails.USER_ID,
            AUTH_FLAG: "CP",
            REQ_FLAG: "R",
            PROFILE_IMG: userDetails.USER_ID,
            ACTION: "PROFILESETREQ",
            ACTIVITY_CD: userDetails.ACTIVITY_CD,
            LOGIN_PIN: this.state.loginPin,
            LANGUAGE: this.props.langId === "en" ? "E" : "B",
            BIO_FLAG: this.state.loginPrefVal === "2" ? "Y" : "N",
            ...Config.commonReq
        };
        console.log("request", userRequest);
        let result = await ApiRequest.apiRequest.callApi(userRequest, {});
        console.log("result", result);
        // result = result[0];
        this.setState({isProgress: false});
        if (result.STATUS === "0") {
            await StorageClass.store(Config.isFirstTime, userID);
            await StorageClass.store(Config.LoginPref, this.state.loginPrefVal);
            if (this.state.loginPrefVal === "2") {
                console.log("result", result);
                let response = result.RESPONSE[0];
                await StorageClass.store(Config.BioPinPref, response.BIO_PIN);
            }
            navigation.dispatch(
                StackActions.replace("BottomNavigator", {userID: userID})
            );
        } else {
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }
    }

    accountNoOption(language) {
        return (<View>
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.alias}
                </Text>
                <TextInput
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {
                        alignItems: "flex-end",
                        textAlign: 'right',
                        flex: 1,
                        marginLeft: 10
                    }]}
                    placeholder={language.et_alias}
                    onChangeText={text => this.setState({alias: text})}
                    value={this.state.alias}
                    multiline={false}
                    numberOfLines={1}
                    contextMenuHidden={true}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    returnKeyType={"next"}
                    onSubmitEditing={(event) => {
                        this.transPinRef.focus();
                    }}
                />
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            {console.log("AUTH_FLAG", this.props.userDetails.AUTH_FLAG)}
            {this.props.userDetails.AUTH_FLAG === "TP" && this.props.userDetails.TXN_PASS_REG_FLAG === "N" ?
                <View>
                    <View>
                        <View>
                            <View style={{
                                flexDirection: "row",
                                height: Utility.setHeight(50),
                                marginStart: 10,
                                alignItems: "center",
                                marginEnd: 10,
                            }}>
                                <Text style={[CommonStyle.textStyle]}>
                                    {language.set_transaction_pin}
                                    <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                                </Text>
                                <TextInput
                                    ref={(ref) => this.transPinRef = ref}
                                    selectionColor={themeStyle.THEME_COLOR}
                                    style={[CommonStyle.textStyle, {
                                        alignItems: "flex-end",
                                        textAlign: 'right',
                                        flex: 1,
                                        marginLeft: 10
                                    }]}
                                    placeholder={language.enterPinHere}
                                    onChangeText={text => this.setState({
                                        errorTransPIN: "",
                                        transactionPin: Utility.input(text, "0123456789")
                                    })}
                                    value={this.state.transactionPin}
                                    multiline={false}
                                    numberOfLines={1}
                                    keyboardType={"number-pad"}
                                    contextMenuHidden={true}
                                    secureTextEntry={true}
                                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                    autoCorrect={false}
                                    returnKeyType={"next"}
                                    onSubmitEditing={(event) => {
                                        this.cTransPinRef.focus();
                                    }}
                                    maxLength={4}/>
                            </View>
                            {this.state.errorTransPIN !== "" ?
                                <Text style={CommonStyle.errorStyle
                                }>{this.state.errorTransPIN}</Text> : null}
                        </View>
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                    </View>

                    <View>
                        <View>
                            <View style={{
                                flexDirection: "row",
                                height: Utility.setHeight(50),
                                marginStart: 10,
                                alignItems: "center",
                                marginEnd: 10,
                            }}>
                                <Text style={[CommonStyle.textStyle]}>
                                    {language.Confirm_Pin}
                                    <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                                </Text>
                                <TextInput
                                    ref={(ref) => this.cTransPinRef = ref}
                                    selectionColor={themeStyle.THEME_COLOR}
                                    style={[CommonStyle.textStyle, {
                                        alignItems: "flex-end",
                                        textAlign: 'right',
                                        flex: 1,
                                        marginLeft: 10
                                    }]}
                                    placeholder={language.enterPinHere}
                                    onChangeText={text => this.setState({
                                        errorConfTransPIN: "",
                                        confirmTransactionPin: Utility.input(text, "0123456789")
                                    })}
                                    value={this.state.confirmTransactionPin}
                                    multiline={false}
                                    numberOfLines={1}
                                    contextMenuHidden={true}
                                    keyboardType={"number-pad"}
                                    secureTextEntry={true}
                                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                    autoCorrect={false}
                                    returnKeyType={"next"}
                                    onSubmitEditing={(event) => {
                                        this.loginPinRef.focus();
                                    }}
                                    maxLength={4}/>
                            </View>
                            {this.state.errorConfTransPIN !== "" ?
                                <Text style={CommonStyle.errorStyle}>{this.state.errorConfTransPIN}</Text> : null}
                        </View>
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                    </View>
                </View>
                : null}
            <View>
                <View style={{
                    flexDirection: "row",
                    marginStart: 10,
                    height: Utility.setHeight(50),
                    alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.setLoginPIn}
                    </Text>
                    <TextInput
                        ref={(ref) => this.loginPinRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.enterPinHere}
                        onChangeText={text => this.setState({
                            errorLoginPIN: "",
                            loginPin: Utility.input(text, "0123456789")
                        })}
                        value={this.state.loginPin}
                        multiline={false}
                        numberOfLines={1}
                        keyboardType={"number-pad"}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        secureTextEntry={true}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.cLoginPinRef.focus();
                        }}
                        maxLength={6}/>
                </View>
                {this.state.errorLoginPIN !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errorLoginPIN}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View>
                <View style={{
                    flexDirection: "row",
                    marginStart: 10,
                    height: Utility.setHeight(50),
                    alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.conf_loginPin}
                    </Text>
                    <TextInput
                        ref={(ref) => this.cLoginPinRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.enterPinHere}
                        onChangeText={text => this.setState({
                            errorConfLoginPIN: "",
                            conf_loginPin: Utility.input(text, "0123456789")
                        })}
                        value={this.state.conf_loginPin}
                        multiline={false}
                        numberOfLines={1}
                        keyboardType={"number-pad"}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        secureTextEntry={true}
                        maxLength={6}/>
                </View>
                {this.state.errorConfLoginPIN !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errorConfLoginPIN}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

            <View style={{
                flexDirection: "row", alignItems: "center", marginTop: 15
            }}>
                <Text style={[CommonStyle.textStyle, {marginRight: 15, marginStart: 10}]}>
                    {language.Login_W}
                    <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                </Text>
                <RadioForm
                    radio_props={this.state.prefOption ? language.Login_M : language.LoginWithoutBio}
                    initial={0}
                    buttonSize={8}
                    selectedButtonColor={themeStyle.THEME_COLOR}
                    formHorizontal={true}
                    labelHorizontal={true}
                    borderWidth={1}
                    buttonColor={themeStyle.GRAY_COLOR}
                    labelColor={themeStyle.BLACK}
                    labelStyle={[CommonStyle.textStyle, {marginEnd: 8, marginStart: -7, marginTop: -1}]}
                    style={{marginTop: 8}}
                    animation={true}
                    onPress={(value) => {
                        this.setState({loginPrefVal: value.toString()});
                    }}
                />
            </View>
        </View>)
    }

    async onSubmit(language, navigation) {
        const {transactionPin, confirmTransactionPin, loginPin, conf_loginPin, loginPrefVal} = this.state;
        console.log("loginPrefVal", loginPrefVal);
        console.log("loginPin", loginPin.length);
        /*
                if (this.state.loginPin !== conf_loginPin) {
                    this.setState({errorConfLoginPIN: language.errConfirmLoginPin});
                } else if ((loginPrefVal === "1" || loginPin !== "") && loginPin.length !== 6) {
                    this.setState({errorLoginPIN: language.digits6LoginPin});
                } else {
                    await this.updateUserRequest(navigation);
                }
        */
        if (this.props.userDetails.AUTH_FLAG === "TP" &&
            this.props.userDetails.TXN_PASS_REG_FLAG === "N") {
            if (transactionPin.length !== 4) {
                this.setState({errorTransPIN: language.digits4TransPin});
                return;
            } else if (transactionPin !== confirmTransactionPin) {
                this.setState({errorConfTransPIN: language.errConfirmTransPin});
                return;
            }
        }

        if ((loginPrefVal === "1" || loginPin !== "") && loginPin.length !== 6) {
            this.setState({errorLoginPIN: language.digits6LoginPin});
        } else if (this.state.loginPin !== conf_loginPin) {
            this.setState({errorConfLoginPIN: language.errConfirmLoginPin});
        } else {
            await this.updateUserRequest(navigation);
        }

    }


    checkFingerTouch() {
        FingerprintScanner.isSensorAvailable()
            .then((biometryType) => {
                this.setState({prefOption: true});
            })
            .catch((error) => {
                this.setState({prefOption: false});
                console.log("isSensorAvailable error => ", error)
            });
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
        Config.commonReq = {...Config.commonReq, DISPLAY_LANGUAGE: langCode}
    }

    render() {
        let language = this.props.language;
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={CommonStyle.toolbar}>
                    <Text style={CommonStyle.title}>{language.login_configure_profile}</Text>
                    <View style={CommonStyle.headerLabel}>
                        <TouchableOpacity
                            onPress={() => this.changeLanguage(this.props, Config.EN)}
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
                            onPress={() => this.changeLanguage(this.props, Config.BN)}
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        <Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.THEME_COLOR,
                            marginStart: 10,
                            marginEnd: 10,
                            marginTop: 6,
                            marginBottom: 4
                        }]}>
                            {language.config_information}
                        </Text>
                        {this.accountNoOption(language)}
                        <View style={{
                            flexDirection: "row",
                            marginStart: Utility.setWidth(10),
                            marginRight: Utility.setWidth(10),
                            marginTop: Utility.setHeight(20)
                        }}>
                            <TouchableOpacity style={{flex: 1}}
                                              onPress={() => this.onSubmit(language, this.props.navigation)}>
                                <View style={{
                                    flex: 1,
                                    alignSelf: "center",
                                    justifyContent: "center",
                                    height: Utility.setHeight(46),
                                    width: Utility.getDeviceWidth() / 2.5,
                                    borderRadius: Utility.setHeight(23),
                                    backgroundColor: themeStyle.THEME_COLOR
                                }}>
                                    <Text
                                        style={[CommonStyle.midTextStyle, {
                                            color: themeStyle.WHITE,
                                            textAlign: "center"
                                        }]}>{language.submit}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Text style={[CommonStyle.textStyle,{marginStart: 10, marginTop: 20, color: themeStyle.THEME_COLOR}]}>
                            *{language.mark_field_mandatory}
                        </Text>
                    </View>
                </ScrollView>
                <BusyIndicator visible={this.state.isProgress}/>
            </View>
        )
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
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener(
                "hardwareBackPress", this.backAction)
        }
    }

    backAction = () => {
        Utility.exitApp(this.props.language);
        return true;
    }

}

const mapStateToProps = (state) => {
    return {
        userDetails: state.accountReducer.userDetails,
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(LoginConfigureProfile);
