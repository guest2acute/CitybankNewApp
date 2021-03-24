import React, {Component} from "react";
import {
    Alert, BackHandler,
    FlatList,
    Image,
    Platform,
    SafeAreaView,
    ScrollView, SectionList,
    StatusBar,
    Text, TextInput, TextPropTypes,
    TouchableOpacity,
    View
} from "react-native";
import themeStyle from "../resources/theme.style";
import {connect} from "react-redux";
import CommonStyle from "../resources/CommonStyle";
import Utility from "../utilize/Utility";
import fontStyle from "../resources/FontStyle";
import FontSize from "../resources/ManageFontSize";
import RadioForm from "react-native-simple-radio-button";
import CheckBox from "@react-native-community/checkbox";
import Icon from "react-native-vector-icons/FontAwesome";
import Config from "../config/Config";
import {CommonActions, StackActions} from "@react-navigation/native";
import MonthPicker from "react-native-month-year-picker";
import ApiRequest from "../config/ApiRequest";
import {BusyIndicator} from "../resources/busy-indicator";
import moment from "moment";
import * as ReadSms from "react-native-read-sms/ReadSms";


class RegistrationCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cardNo: "",
            cardName: "",
            conf_mobile: "",
            cardPin: "",
            errorMobile: "",
            error_conf_mobile: "",
            conf_email: "",
            errorEmail: "",
            errorCard_No: "",
            errorUserId: "",
            userId: "",
            userId_type: 0,
            otp_type: 0,
            otpVal: "",
            isTerm: false,
            debitPin: "",
            errorPin: "",
            errorExpiry: "",
            password: "",
            loginPin: "",
            errorLoginPin: "",
            errorpassword: "",
            stateVal: 0,
            options: [
                {title: props.language.signupWithAccount, selected: false},
                {title: props.language.signupWithCard, selected: true},
            ],
            dateVal: new Date(),
            showMonthPicker: false,
            expiryDate: "",
            signUpResponse: "",
            placeMobile: "",
            placeEmail: ""
        }
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

    async cardVerify(cardNo, type, language) {
        if (cardNo.length < 15) {
            this.setState({errorCard_No: language.errCardNo})
            return;
        }
        this.setState({isProgress: true});
        await ApiRequest.apiRequest.accountVerifyRequest(cardNo, type, this.props).then((response) => {
            console.log(response);
            this.setState({isProgress: false});
            console.log("verifyres", JSON.stringify(response));
            this.setState({
                cardName: response.CUST_NAME,
                placeMobile: response.MASK_MOBILE_NO,
                placeEmail: response.MASK_MAIL_ID,
                //conf_mobile: response.MOBILE_NO.replace(/\(/g, "").replace(/\)/g, ""),
                //conf_email: response.MAIL_ID,
                signUpResponse: response,
            });
            this.setState({disableButton: false});
        }, (error) => {
            this.setState({isProgress: false});
            console.log("error", error);
        });
    }

    backAction = () => {
        this.backEvent();
        return true;
    }

    backEvent() {
        const {stateVal} = this.state;
        if (stateVal === 0)
            this.props.navigation.goBack(null);
        else
            this.setState({stateVal: stateVal - 1});
    }

    onValueChange = (event, newDate) => {
        console.log("event", event + "-" + newDate);
        let dateVal = Utility.dateInFormat(newDate, "MM/YY")
        switch (event) {
            case "dateSetAction":
                console.log("event", "in");
                this.setState({expiryDate: dateVal, showMonthPicker: false});
                break;
            case "neutralAction":
                break;
            case "dismissedAction":
            default:
                this.setState({showMonthPicker: false});
        }
    }

    passwordSet(language) {
        return (<View key={"passwordSet"} style={{
            borderColor: themeStyle.BORDER,

            borderRadius: 5,
            marginTop: 10,
            overflow: "hidden",
            borderWidth: 2
        }}>
            <View>
                <View style={{
                    flexDirection: "row",
                    marginStart: 10,
                    height: Utility.setHeight(50),
                    alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.loginPin}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
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
                        placeholder={language.setLoginPIn}
                        onChangeText={text => this.setState({
                            errorLoginPin: "",
                            loginPin: Utility.input(text, "0123456789/")
                        })}
                        value={this.state.loginPin}
                        multiline={false}
                        numberOfLines={1}
                        keyboardType={"number-pad"}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        returnKeyType={"next"}
                        secureTextEntry={true}
                        onSubmitEditing={(event) => {
                            this.passwordRef.focus();
                        }}
                        maxLength={6}/>
                </View>
                {this.state.errorLoginPin !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorLoginPin}</Text> : null}
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
                        {language.setPwdTxt}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TextInput
                        ref={(ref) => this.passwordRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.etPasswordTxt}
                        onChangeText={text => this.setState({errorpassword: "", password: Utility.userInput(text)})}
                        value={this.state.password}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        secureTextEntry={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={12}/>
                </View>
                {this.state.errorpassword !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorpassword}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
        </View>)
    }

    listView(value) {
        let item = value.item;
        return (
            <TouchableOpacity disabled={value.index === 1} style={{height: Utility.setHeight(40)}}
                              onPress={() => this.props.navigation.dispatch(
                                  StackActions.replace('RegistrationAccount')
                              )}>
                <View style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    paddingLeft: 10,
                    borderBottomLeftRadius: value.index === 0 ? 5 : 0,
                    borderTopLeftRadius: value.index === 0 ? 5 : 0,
                    borderBottomRightRadius: value.index + 1 === this.state.options.length ? 5 : 0,
                    borderTopRightRadius: value.index + 1 === this.state.options.length ? 5 : 0,
                    overflow: "hidden",
                    paddingRight: 10,
                    backgroundColor: item.selected ? themeStyle.THEME_COLOR : "#CCCCCC",
                }}>
                    <Text style={{
                        fontFamily: fontStyle.RobotoMedium,
                        fontSize: FontSize.getSize(11),
                        color: item.selected ? themeStyle.WHITE : themeStyle.BLACK,
                    }}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    otpEnter(language) {
        return (<View key={"otpEnter"}>
            <Text style={[CommonStyle.textStyle, {
                marginStart: Utility.setWidth(10),
                marginEnd: Utility.setWidth(10),
                marginTop: Utility.setHeight(10),
                marginBottom: Utility.setHeight(20),
            }]}> {language.otp_description + language.otp_signup}</Text>
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

    otpView(language) {
        return (<View>
            <View>
                <View style={{
                    flexDirection: "row",
                    marginStart: 10,
                    height: Utility.setHeight(50),
                    alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.user_id}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TextInput
                        ref={(ref) => this.user_idRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.user_id_enter}
                        onChangeText={text => this.setState({
                            errorUserId: "",
                            userId: Utility.userInput(text)
                        })}
                        value={this.state.userId}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={12}/>
                </View>
                {this.state.errorUserId !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorUserId}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View style={[CommonStyle.checkboxContainer]}>
                <CheckBox
                    disabled={false}
                    onValueChange={(newValue) => this.setState({
                        isTerm: newValue,
                    })}
                    value={this.state.isTerm}
                    style={CommonStyle.checkbox}
                    tintColor={themeStyle.THEME_COLOR}
                    tintColors={{true: themeStyle.THEME_COLOR, false: themeStyle.GRAY_COLOR}}
                />
                <Text style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                    flexWrap: 'wrap',
                    justifyContent: "center"
                }}>
                    <Text style={[CommonStyle.textStyle, {
                        textAlign: "center",
                        marginRight: 3,
                    }]}>{language.read_term}</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("TermConditionScreen", {
                        showButton: false
                    })}>
                        <Text style={[CommonStyle.textStyle, {
                            textDecorationLine: "underline",
                        }]}>{language.term_condition}
                        </Text>
                    </TouchableOpacity>
                </Text>

            </View>
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.otpType}
                    <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                </Text>

                <RadioForm
                    radio_props={language.otp_props}
                    initial={0}
                    buttonSize={9}
                    selectedButtonColor={themeStyle.THEME_COLOR}
                    formHorizontal={true}
                    labelHorizontal={true}
                    borderWidth={1}
                    buttonColor={themeStyle.GRAY_COLOR}
                    labelColor={themeStyle.BLACK}
                    labelStyle={[CommonStyle.textStyle, {marginRight: 10}]}
                    style={{marginStart: 5, marginTop: 10, marginLeft: Utility.setWidth(20)}}
                    animation={true}
                    onPress={(value) => {
                        this.setState({otp_type: value});
                    }}
                />
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
        </View>)
    }

    accountView(language) {
        return (
            <View key={"accountView"}>
                <View style={{
                    borderColor: themeStyle.BORDER,
                    borderRadius: 5,
                    marginTop: 10,
                    overflow: "hidden",
                    borderWidth: 2
                }}>
                    <View style={{
                        flexDirection: "row",
                        height: Utility.setHeight(50),
                        marginStart: 10,
                        alignItems: "center",
                        marginEnd: 10,
                    }}>
                        <Text style={[CommonStyle.textStyle]}>
                            {language.credit_card_no}
                            <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                        </Text>
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle, {
                                alignItems: "flex-end",
                                textAlign: 'right',
                                flex: 1,
                                marginLeft: 10
                            }]}
                            placeholder={language.enter_card_no}
                            onChangeText={text => this.setState({
                                errorCard_No: "",
                                cardNo: Utility.input(text, "0123456789")
                            })}
                            onSubmitEditing={async (event) => {
                                await this.cardVerify(this.state.cardNo, "C", language);
                            }}
                            value={this.state.cardNo}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            keyboardType={"number-pad"}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}
                            maxLength={16}/>
                    </View>
                    {this.state.errorCard_No !== "" ?
                        <Text style={{
                            marginLeft: 5,
                            marginRight: 10,
                            color: themeStyle.THEME_COLOR,
                            fontSize: FontSize.getSize(11),
                            fontFamily: fontStyle.RobotoRegular,
                            alignSelf: "flex-end",
                            marginBottom: 10,
                        }}>{this.state.errorCard_No}</Text> : null}
                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                    <View style={{
                        flexDirection: "row",
                        height: Utility.setHeight(50),
                        marginStart: 10,
                        alignItems: "center",
                        marginEnd: 10,
                    }}>
                        <Text style={[CommonStyle.textStyle]}>
                            {language.cardName}
                        </Text>
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle, {
                                alignItems: "flex-end",
                                textAlign: 'right',
                                flex: 1,
                                marginLeft: 10
                            }]}
                            value={this.state.cardName}
                            editable={false}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}/>
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
                                {language.mobile}
                                <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                            </Text>
                            <TextInput
                                selectionColor={themeStyle.THEME_COLOR}
                                style={[CommonStyle.textStyle, {
                                    alignItems: "flex-end",
                                    textAlign: 'right',
                                    flex: 1,
                                    marginLeft: 10
                                }]}
                                placeholder={this.state.placeMobile}
                                onChangeText={text => this.setState({
                                    errorMobile: "",
                                    conf_mobile: Utility.input(text, "0123456789")
                                })}
                                value={this.state.conf_mobile}
                                multiline={false}
                                numberOfLines={1}
                                contextMenuHidden={true}
                                keyboardType={"number-pad"}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}
                                returnKeyType={"next"}
                                onSubmitEditing={(event) => {
                                    this.emailref.focus();
                                }}
                                maxLength={14}/>
                        </View>
                        {this.state.errorMobile !== "" ?
                            <Text style={{
                                marginLeft: 5,
                                marginRight: 10,
                                color: themeStyle.THEME_COLOR,
                                fontSize: FontSize.getSize(11),
                                fontFamily: fontStyle.RobotoRegular,
                                alignSelf: "flex-end",
                                marginBottom: 10,
                            }}>{this.state.errorMobile}</Text> : null}
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
                                {language.email}
                                <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                            </Text>
                            <TextInput
                                ref={(ref) => this.emailref = ref}
                                selectionColor={themeStyle.THEME_COLOR}
                                style={[CommonStyle.textStyle, {
                                    alignItems: "flex-end",
                                    textAlign: 'right',
                                    flex: 1,
                                    marginLeft: 10
                                }]}
                                placeholder={this.state.placeEmail}
                                onChangeText={text => this.setState({
                                    errorEmail: "",
                                    conf_email: Utility.userInput(text)
                                })}
                                value={this.state.conf_email}
                                multiline={false}
                                numberOfLines={1}
                                contextMenuHidden={true}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}/>
                        </View>
                        {this.state.errorEmail !== "" ?
                            <Text style={{
                                marginLeft: 5,
                                marginRight: 10,
                                color: themeStyle.THEME_COLOR,
                                fontSize: FontSize.getSize(11),
                                fontFamily: fontStyle.RobotoRegular,
                                alignSelf: "flex-end",
                                marginBottom: 10,
                            }}>{this.state.errorEmail}</Text> : null}
                    </View>
                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                </View>
            </View>);
    }

    cardUi(language) {
        return (<View key={"cardUi"} style={{
            borderColor: themeStyle.BORDER,
            borderRadius: 5,
            marginTop: 10,
            overflow: "hidden",
            borderWidth: 2
        }}>
            <View>
                <View style={{
                    flexDirection: "row",
                    marginStart: 10,
                    height: Utility.setHeight(50),
                    alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.enterExpiry}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TouchableOpacity style={{
                        flex: 1,
                        marginLeft: 10
                    }} onPress={() => this.setState({errorExpiry: "", showMonthPicker: true})}>
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle, {
                                alignItems: "flex-end",
                                textAlign: 'right',
                                flex: 1,
                                marginLeft: 10
                            }]}
                            placeholder={language.enterCardExpiry}
                            editable={false}
                            value={this.state.expiryDate}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}
                            returnKeyType={"next"}
                            onSubmitEditing={(event) => {
                                this.debitPinRef.focus();
                            }}
                            maxLength={5}/>
                    </TouchableOpacity>
                </View>
                {this.state.errorExpiry !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorExpiry}</Text> : null}
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
                        {language.enterCardPin}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TextInput
                        ref={(ref) => this.debitPinRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.enterPinHere}
                        onChangeText={text => this.setState({errorPin: "", cardPin: Utility.input(text, "0123456789")})}
                        value={this.state.cardPin}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        keyboardType={"number-pad"}
                        secureTextEntry={true}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.user_idRef.focus();
                        }}
                        maxLength={4}/>
                </View>
                {this.state.errorPin !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorPin}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            {this.otpView(language)}
        </View>)
    }

    async submit(language, navigation) {
        const {cardNo, cardName, stateVal, conf_mobile, conf_email, signUpResponse} = this.state;
        if (stateVal === 0) {
            if (cardNo.length < 15) {
                this.setState({errorCard_No: language.errCardNo});
            } else if (cardName === "") {
                await this.cardVerify(cardNo, "C", language);
            } else if (conf_mobile === "") {
                this.setState({errorMobile: language.require_mobile});
            } else if (signUpResponse.MAIL_ID !== "" && conf_email === "") {
                this.setState({errorEmail: language.require_email});
            } else if (conf_mobile !== signUpResponse.MOBILE_NO.replace(/\(/g, "").replace(/\)/g, "")) {
                this.setState({errorMobile: language.invalidMobile});
            } else if (conf_email !== signUpResponse.MAIL_ID) {
                this.setState({errorEmail: language.invalidEmail});
            } else {
                this.setState({stateVal: stateVal + 1});
            }
        } else if (stateVal === 1) {
            if (this.state.expiryDate === "") {
                this.setState({errorExpiry: language.errExpiryDate});
            } else if (this.state.cardPin.length !== 4) {
                this.setState({errorPin: language.errCardPin});
            } else if (this.state.userId === "") {
                this.setState({errorUserId: language.errorUserId});
            } else {
                let userRes = Utility.verifyUserId(this.state.userId, language)
                if (userRes !== "") {
                    this.setState({errorUserId: userRes});
                    return;
                } else if (!this.state.isTerm) {
                    Utility.alert(language.errorTerm,language.ok);
                    return;
                }
                await this.signupRequest();
            }
        } else if (stateVal === 2) {
            if (this.state.otpVal.length !== 4) {
                Utility.alert(language.errOTP,language.ok);
                return;
            }
            await this.getOTP();
        } else if (stateVal === 3) {
            if (this.state.loginPin.length !== 6) {
                this.setState({errorLoginPin: language.digits6LoginPin})
            } else if (!Utility.validPassword(this.state.password)) {
                this.setState({errorpassword: language.errorpassword})
            } else {
                await this.processSignup(language)
            }
        }
    }

    async processSignup(language) {
        const {signUpResponse} = this.state;
        this.setState({isProgress: true});
        await ApiRequest.apiRequest.requestSignup(this.state.loginPin, "",
            signUpResponse.CUSTOMER_ID,
            signUpResponse.ACTIVATION_CD, "CP",
            signUpResponse.MOBILE_NO, "P", this.state.password, this.props)
            .then((response) => {
                console.log(response);
                this.setState({isProgress: false});
                Alert.alert(
                    Config.appName,
                    response,
                    [
                        {
                            text: language.ok, onPress: () => this.props.navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{name: "LoginScreen"}],
                                })
                            )
                        },
                    ]
                );
            }, (error) => {
                this.setState({isProgress: false});
                console.log("error", error);
            });
    }

    async getOTP() {
        const {signUpResponse} = this.state;
        this.setState({isProgress: true});
        await ApiRequest.apiRequest.getOTPCall(this.state.otpVal, "R", signUpResponse,
            "CP", "REGUSERVERIFY", "O", this.props)
            .then((response) => {
                console.log(response);
                this.setState({isProgress: false, stateVal: 3});

            }, (error) => {
                this.setState({isProgress: false});
                console.log("error", error);
            });
    }

    async signupRequest() {
        let {stateVal} = this.state;
        this.setState({isProgress: true});

        let signupResult = await ApiRequest.apiRequest.veryAccountRequest("C", "Y",
            this.state.signUpResponse,
            "CP", this.state.otp_type === 0 ? "S" : "E",
            "",
            this.state.userId, await Utility.getDeviceID(), this.state.cardNo, this.state.cardPin,
            this.state.expiryDate, "",
            "", this.state.cardNo);

        this.setState({isProgress: false});
        console.log("signupResult", signupResult);
        if (signupResult.STATUS === "0") {
            let response = signupResult.RESPONSE[0];
            let signUpResponse = {
                ...this.state.signUpResponse,
                ACTIVATION_CD: response.ACTIVATION_CD,
                CUSTOMER_ID: response.CUSTOMER_ID
            }
            this.setState({signUpResponse: signUpResponse, stateVal: 2})
        } else {
            Utility.errorManage(signupResult.STATUS, signupResult.MESSAGE, this.props);
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
                        onPress={() => this.backEvent()}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../resources/images/ic_back_android.png") : require("../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.register_title}</Text>
                </View>
                <FlatList
                    horizontal
                    contentContainerStyle={{paddingLeft: 10, paddingRight: 10}}
                    showsHorizontalScrollIndicator={false}
                    legacyImplementation={false}
                    data={this.state.options}
                    renderItem={(item) => this.listView(item)}
                    keyExtractor={(item, index) => index + ""}
                    style={{width: Utility.getDeviceWidth(), flexGrow: 0, height: Utility.setHeight(40), marginTop: 10}}
                />
                <View style={{flex: 1}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{marginLeft: 10, marginRight: 10}}>
                            {this.state.stateVal === 2 ? null : <Text style={[CommonStyle.textStyle, {
                                marginTop: 15,
                                marginLeft: 10,
                                marginRight: 10
                            }]}>{this.state.stateVal === 0 ? language.welcome_signup + language.cardNoInput : this.state.stateVal === 1 ? language.welcome_signup + language.cardDetails : language.provideDetails}</Text>}
                            {this.state.stateVal === 0 ? this.accountView(language) : this.state.stateVal === 1 ? this.cardUi(language) : this.state.stateVal === 2 ? this.otpEnter(language) : this.passwordSet(language)}
                            <View style={{
                                flexDirection: "row",
                                marginStart: Utility.setWidth(10),
                                marginRight: Utility.setWidth(10),
                                marginTop: Utility.setHeight(20),
                            }}>
                                <TouchableOpacity style={{flex: 1}} onPress={() => this.backEvent()}>
                                    <View style={{
                                        flex: 1,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: Utility.setHeight(46),
                                        borderRadius: Utility.setHeight(23),
                                        borderWidth: 1,
                                        borderColor: themeStyle.THEME_COLOR
                                    }}>
                                        <Text
                                            style={[CommonStyle.midTextStyle, {color: themeStyle.THEME_COLOR}]}>{language.back_txt}</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{width: Utility.setWidth(20)}}/>

                                <TouchableOpacity style={{flex: 1}}
                                                  onPress={() => this.submit(language, this.props.navigation)}>
                                    <View style={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: Utility.setHeight(46),
                                        borderRadius: Utility.setHeight(23),
                                        backgroundColor: themeStyle.THEME_COLOR
                                    }}>
                                        <Text
                                            style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{this.state.stateVal === 3 ? language.submit_txt : language.next}</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </ScrollView>
                </View>
                {this.state.showMonthPicker ? <MonthPicker
                    onChange={this.onValueChange}
                    value={new Date()}
                    minimumDate={new Date()}
                    maximumDate={new Date(new Date().getFullYear() + 10, 12)}
                    locale="en"
                    mode="number"
                /> : null}
                <BusyIndicator visible={this.state.isProgress}/>
            </View>);
    }
}

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(RegistrationCard);
