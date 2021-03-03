import {connect} from "react-redux";
import {
    I18nManager,
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    BackHandler,
    Image,
    TextInput, FlatList, Platform, StatusBar
} from "react-native";
import themeStyle from "../resources/theme.style";
import CommonStyle from "../resources/CommonStyle";
import React, {Component, useCallback} from "react";
import {BusyIndicator} from "../resources/busy-indicator";
import Utility from "../utilize/Utility";
import RadioForm from "react-native-simple-radio-button";
import MonthPicker from 'react-native-month-year-picker';
import ApiRequest from "../config/ApiRequest";
import StorageClass from "../utilize/StorageClass";
import Config from "../config/Config";
import {StackActions} from "@react-navigation/native";
import FontSize from "../resources/ManageFontSize";
import fontStyle from "../resources/FontStyle";


let cardNumber = [{key: "0", label: "1234567890123456", value: 1234567890123456}, {
    key: "1",
    label: "4567890123456123",
    value: 4567890123456123
}];


class CredentialDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            selectType: props.language.selectType,
            selectTypeVal: -1,
            selectCard: props.language.selectCard,
            selectActCard: props.language.accountTypeArr[0],
            accountNo: "2101038360001",
            cardPin: "0000",
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            expiryDate: "11/23",
            creditCardNo: "376948112527300",
            transactionPin: "",
            cityTouchUserId: "zebatest2",
            errActNo: "",
            errTransPin: "",
            errorUid: "",
            errExpiryDate: "",
            errCardNo: "",
            errCardPin: "",
            showMonthPicker: false,
            otpView: false,
            responseForOTP: "",
            otpVal: "",
            isField: false,
            responseUserId: "",
            newP: "",
            errorNewP: "",
            errorConfNewP: "",
            confNewP: ""
        }
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

    openModal(option, title, data, language) {
        if (data.length > 0) {
            this.setState({
                modelSelection: option,
                modalTitle: title,
                modalData: data, modalVisible: true
            });
        } else {
            Utility.alert(language.noRecord);
        }
    }

    backAction = () => {
        this.backBtn();
        return true;
    }

    componentDidMount() {
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

    accountNoOption(language) {
        return (<View key={"accountNoOption"}>
            <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>

                    <Text style={[CommonStyle.textStyle]}>
                        {language.actNo}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.actNo_here}
                        onChangeText={text => this.setState({
                            errActNo: "",
                            accountNo: Utility.input(text, "0123456789")
                        })}
                        value={this.state.accountNo}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.tPinRef.focus();
                        }}
                        maxLength={13}/>
                </View>
                {this.state.errActNo !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errActNo}</Text> : null}
            </View>

            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.transactionPin}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>
                    <TextInput
                        ref={(ref) => this.tPinRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.enterPinHere}
                        onChangeText={text => this.setState({
                            errTransPin: "",
                            transactionPin: Utility.input(text, "0123456789")
                        })}
                        value={this.state.transactionPin}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        secureTextEntry={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={4}/>
                </View>
                {this.state.errTransPin !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errTransPin}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

            {/*  <Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.THEME_COLOR,
                            marginStart: 10,
                            marginEnd: 10,
                            marginTop: 10,
                            marginBottom: 5
                        }]}>
                            {language.selectCard} *
                        </Text>
                        <TouchableOpacity
                            onPress={() => this.openModal("cardType", language.selectCard, cardNumber, language)}>
                            <View style={styles.selectionBg}>
                                <Text style={[CommonStyle.midTextStyle, {
                                    color: this.state.selectCard === language.selectCard ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                    flex: 1
                                }]}>
                                    {this.state.selectCard}
                                </Text>
                                <Image resizeMode={"contain"} style={styles.arrowStyle}
                                       source={require("../resources/images/ic_arrow_down.png")}/>
                            </View>
                        </TouchableOpacity> */}
        </View>)
    }

    creditCardOption(language) {
        return (<View key={"creditCardOption"}>
            <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.credit_card_no}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
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
                            errCardNo: "",
                            creditCardNo: Utility.input(text, "0123456789")
                        })}
                        value={this.state.creditCardNo}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={16}/>
                </View>
                {this.state.errCardNo !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errCardNo}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.enterExpiry}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>
                    <TouchableOpacity style={{
                        flex: 1,
                        marginLeft: 10
                    }} onPress={() => this.setState({showMonthPicker: true})}>
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle, {
                                alignItems: "flex-end",
                                textAlign: 'right',
                            }]}
                            placeholder={language.expiryDate}
                            editable={false}
                            value={this.state.expiryDate}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}/>
                    </TouchableOpacity>
                </View>
                {this.state.errExpiryDate !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errExpiryDate}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.enterCardPin}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.enterPinHere}
                        onChangeText={text => this.setState({
                            errCardPin: "",
                            cardPin: Utility.input(text, "0123456789")
                        })}
                        value={this.state.cardPin}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        secureTextEntry={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={4}/>
                </View>
                {this.state.errCardPin !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errCardPin}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

        </View>)
    }

    onSelectItem(item) {
        const {modelSelection} = this.state;
        if (modelSelection === "type") {
            this.setState({selectType: item.label, selectTypeVal: item.value, modalVisible: false})
        } else if (modelSelection === "accountType") {
            this.setState({selectActCard: item, modalVisible: false})
        } else if (modelSelection === "cardType") {
            this.setState({selectCard: item.label, modalVisible: false})
        }
    }

    async backBtn() {
        if (this.state.selectTypeVal === 0) {
            if (this.state.selectActCard.value === 0 && this.state.otpView) {
                this.setState({otpView: false,otpVal:""});
            } else {
                this.props.navigation.goBack();
            }
        } else {
            console.log("in-" + this.state.isField, this.state.otpView + "-" + this.state.selectActCard.value);
            if (this.state.selectActCard.value === 0 && this.state.isField) {
                this.setState({isField: false, newP: "", confNewP: ""});
            } else if (this.state.selectActCard.value === 0 && this.state.otpView) {
                this.setState({otpView: false,otpVal:""});
            } else if (this.state.selectActCard.value === 1 && this.state.isField) {
                this.setState({isField: false, newP: "", confNewP: ""});
            } else {
                this.props.navigation.goBack();
            }
        }
    }

    async submit(language, navigation) {
        let otpMsg = "", successMsg = "";
        if (this.state.selectTypeVal === -1) {
            Utility.alert(language.errValidType);
            return;
        } else if (this.state.selectTypeVal > 0 && (this.state.cityTouchUserId.length < 8 || this.state.cityTouchUserId.length > 12)) {
            this.setState({errorUid: language.invalidUid});
            return;
        } else if (this.state.selectActCard.value === 0) {
            if (this.state.accountNo.length !== 13) {
                this.setState({errActNo: language.errActNo});
                return;
            } else if (this.state.transactionPin.length !== 4) {
                this.setState({errTransPin: language.errTransPin});
                return;
            } else if (this.state.isField) {
                if (this.state.selectTypeVal === 1 && this.state.newP.length === "") {
                    this.setState({errorNewP: language.errorNewPwd});
                    return;
                } else if (this.state.selectTypeVal === 2 && this.state.newP.length !== 6) {
                    this.setState({errorNewP: language.errorNewPIN});
                    return;
                } else if (this.state.confNewP !== this.state.newP) {
                    this.setState({errorConfNewP: this.state.selectTypeVal === 1 ? language.errorNewConfPIN : language.errorNewConfPwd});
                    return;
                } else {
                    await this.processNewRequest(language);
                }
                return;
            } else if (this.state.otpView) {
                if (this.state.otpVal.length !== 4) {
                    Utility.alert(language.errOTP);
                } else {
                    await this.processOTP(language, navigation);
                }
                return;
            }
        } else if (this.state.selectActCard.value === 1) {
            if (this.state.creditCardNo.length === 0) {
                this.setState({errCardNo: language.errCardNo});
                return;
            } else if (this.state.expiryDate.length === "") {
                this.setState({errExpiryDate: language.errExpiryDate});
                return;
            } else if (this.state.cardPin.length !== 4) {
                this.setState({errCardPin: language.errCardPin});
                return;
            }
        }
        this.state.selectTypeVal > 0 ? await this.getUserDetails(language) : await this.processAccount(this.state.selectActCard.value === 1);
    }



    async processAccount(isCard, language) {
        this.setState({isProgress: true});
        let actNo = isCard ? this.state.creditCardNo : this.state.accountNo;
        let commonReq = {
            ACCT_NO: actNo,
            ACTION: isCard ? "VERIFYCARDGETUID" : "GETUSERALLEXISTS",
            AUTHORIZATION: Config.AUTH,
            REG_WITH: isCard ? "C" : "A",
            ...Config.commonReq
        }
        if (isCard) {
            commonReq = {
                ...commonReq,
                CARD_PIN: this.state.cardPin,
                EXPIRY_DATE: this.state.expiryDate.replace("/", ""),
            }
        }

        console.log("request", commonReq);
        let result = await ApiRequest.apiRequest.callApi(commonReq, {});
        console.log("result", result);
        //result = result[0];
        if (result.STATUS === "0") {
            let response = result.RESPONSE[0];
            if (this.state.selectTypeVal > 0 && response.USER_ID !== this.state.responseUserId.USER_ID) {
                this.setState({isProgress: false});
                Utility.alert(isCard ? language.errCardMatch : language.errAccountMatch);
                return;
            }
            await this.resetPwd(response.USER_ID, actNo, isCard);
        } else {
            this.setState({isProgress: false});
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }
    }

    resetAll() {
        this.setState({
            accountNo: "",
            cardPin: "",
            expiryDate: "",
            creditCardNo: "",
            transactionPin: "",
            cityTouchUserId: "",
            otpView: false,
            responseForOTP: "",
            otpVal: "",
            isField: false,
            responseUserId: "",
            newP: "",
            confNewP: ""
        });
    }

    async resetPwd(responseUid, actNo, isCard) {
        let language = this.props.language;
        let resetReq = {
            DEVICE_ID: await Utility.getDeviceID(),
            USER_ID: responseUid,
            RESET_BY: this.state.selectTypeVal === 0 ? "U" : "P",
            AUTH_TOKEN: Config.AUTH.ACCESS_TOKEN,
            PASS_TYPE: "L",
            ACCT_NO: actNo,
            REQ_FLAG: "R",
            RESET_TYPE: "F",
            REQ_TYPE: "P",
            ACTION: "RESETPWD",
            CARD_USER_ID: responseUid,
            AUTH_TYPE: isCard ? "CP" : "TP",
            ...Config.commonReq
        }
        if (!isCard) {
            resetReq = {...resetReq, TRANSACTION_PIN: this.state.transactionPin}
        }
        console.log("request", resetReq);
        let result = await ApiRequest.apiRequest.callApi(resetReq, {});
       // result = result[0];
        this.setState({isProgress: false});

        if (result.STATUS === "0" || result.STATUS === "999") {
            if (isCard) {
                if (this.state.selectTypeVal === 0) {
                    this.resetAll();
                    Utility.alert(result.MESSAGE);
                } else {
                    this.setState({isField: true, responseForOTP: response});
                }
            } else {
                let response = result.RESPONSE[0];
                this.setState({otpView: true, responseForOTP: response});
            }
        } else {

            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }

    }

    async getUserDetails(language) {
        this.setState({isProgress: true});
        let userReq = {
            DEVICE_ID: await Utility.getDeviceID(),
            USER_ID: this.state.cityTouchUserId,
            ACTION: "USERVERIFY",
            REQ_FLAG: "R",
            ...Config.commonReq
        }
        console.log("userReq", userReq);
        let result = await ApiRequest.apiRequest.callApi(userReq, {});
        //result = result[0];
        console.log("result", result);
        this.setState({isProgress: false});
        if (result.STATUS === "0") {
            this.setState({responseUserId: result}, async () => {
                await this.processAccount(this.state.selectActCard.value === 1, language);
            });
        } else {
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }

    }

    otpLayout(language) {
        let otpMsg = "";
        if (this.state.selectTypeVal === 0) {
            otpMsg = language.otp_fgt_uid;
        } else if (this.state.selectTypeVal === 1) {
            otpMsg = language.otp_fgt_pwd;
        } else if (this.state.selectTypeVal === 2) {
            otpMsg = language.otp_fgt_pin;
        }
        return (<View key={"otpLayout"}>
            <Text style={[CommonStyle.textStyle, {
                marginStart: Utility.setWidth(15),
                marginEnd: Utility.setWidth(15),
                marginTop: Utility.setHeight(15),
                marginBottom: Utility.setHeight(5),
                textAlign: "center"
            }]}> {language.otp_description + otpMsg}</Text>
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
        </View>)
    }

    async processOTP(language, navigation) {
        let response = this.state.responseForOTP;
        this.setState({isProgress: true});
        let otpReq = {
            OTP_NO: this.state.otpVal,
            CUSTOMER_ID: response.CUSTOMER_ID.toString(),
            USER_ID: response.USER_ID,
            RESET_TYPE: "F",
            REQUEST_CD: response.REQUEST_CD,
            ACTION: "RESETPWDVERIFY",
            REQ_TYPE: "O",
            ACTIVITY_CD: response.ACTIVITY_CD,
            DEVICE_ID: await Utility.getDeviceID(),
            ...Config.commonReq
        }
        if (this.state.selectTypeVal > 0)
            otpReq = {...otpReq, PASS_TYPE: this.state.selectTypeVal === 1 ? "L" : "P"}

        console.log("request", otpReq);
        let result = await ApiRequest.apiRequest.callApi(otpReq, {});
       // result = result[0];
        this.setState({isProgress: false});
        if (result.STATUS === "0" || result.STATUS === "999") {

            if (this.state.selectTypeVal === 0) {
                this.resetAll();
                Utility.alert(result.MESSAGE);
            } else {
                console.log("otpvalidate", result.RESPONSE[0]);
                this.setState({isField: true});
            }
        } else {
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }

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

    mainLayout(language) {
        return (<View key={"mainLayout"}>
            <Text style={[CommonStyle.labelStyle, {
                color: themeStyle.THEME_COLOR,
                marginStart: 10,
                marginEnd: 10,
                marginTop: 6,
                marginBottom: 4
            }]}>
                {language.selectionType}
            </Text>
            <TouchableOpacity
                onPress={() => this.openModal("type", language.selectType, language.optionTypeArr, language)}>
                <View style={styles.selectionBg}>
                    <Text style={[CommonStyle.midTextStyle, {
                        color: this.state.selectType === language.selectType ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                        flex: 1
                    }]}>
                        {this.state.selectType}
                    </Text>
                    <Image resizeMode={"contain"} style={styles.arrowStyle}
                           source={require("../resources/images/ic_arrow_down.png")}/>
                </View>
            </TouchableOpacity>
            {this.state.selectTypeVal > 0 ?
                <View>
                    <View style={{
                        flexDirection: "row",
                        height: Utility.setHeight(50),
                        marginStart: 10,
                        alignItems: "center",
                        marginEnd: 10,
                    }}>
                        <Text style={[CommonStyle.textStyle]}>
                            {language.cityTouchUserId}
                            <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                        </Text>
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle, {
                                alignItems: "flex-end",
                                textAlign: 'right',
                                flex: 1,
                                marginLeft: 10
                            }]}
                            placeholder={language.enterUserId}
                            onChangeText={text => this.setState({
                                errorUid: "",
                                cityTouchUserId: Utility.userInput(text)
                            })}
                            value={this.state.cityTouchUserId}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}
                            maxLength={12}/>
                    </View>
                    {this.state.errorUid !== "" ?
                        <Text style={CommonStyle.errorStyle}>{this.state.errorUid}</Text> : null}
                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                </View> : null}

            <Text style={[CommonStyle.labelStyle, {
                color: themeStyle.THEME_COLOR,
                marginStart: 10,
                marginEnd: 10,
                marginTop: 6,
                marginBottom: 4
            }]}>
                {language.type_act}
            </Text>

            <TouchableOpacity
                onPress={() => this.openModal("accountType", language.selectActType, language.accountTypeArr, language)}>
                <View style={styles.selectionBg}>
                    <Text style={[CommonStyle.midTextStyle, {color: themeStyle.BLACK, flex: 1}]}>
                        {this.state.selectActCard.label}
                    </Text>
                    <Image resizeMode={"contain"} style={styles.arrowStyle}
                           source={require("../resources/images/ic_arrow_down.png")}/>
                </View>
            </TouchableOpacity>

        </View>)
    }

    fieldSet(language) {
        return (<View key={"fieldSet"} style={{
            borderColor: themeStyle.BORDER,
            marginLeft: 10, marginRight: 10,
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
                        {this.state.selectTypeVal === 2 ? language.new_pin_txt : language.pwd_txt}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={this.state.selectTypeVal === 2 ? language.new_pin_txt : language.pwd_txt}
                        onChangeText={text => this.setState({
                            errorNewP: "",
                            newP: this.state.selectTypeVal === 2 ? Utility.input(text, "0123456789") : Utility.userInput(text)
                        })}
                        value={this.state.newP}
                        multiline={false}
                        numberOfLines={1}
                        keyboardType={this.state.selectTypeVal === 2 ? "number-pad" : "default"}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={this.state.selectTypeVal === 2 ? 6 : 50}/>
                </View>
                {this.state.errorNewP !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorNewP}</Text> : null}
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
                        {this.state.selectTypeVal === 2 ? language.confirm_pin_txt : language.conf_new_pass_txt}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={this.state.selectTypeVal === 2 ? language.confirm_pin_txt : language.conf_new_pass_txt}
                        onChangeText={text => this.setState({
                            errorConfNewP: "",
                            confNewP: this.state.selectTypeVal === 2 ? Utility.input(text, "0123456789") : Utility.userInput(text)
                        })}
                        value={this.state.confNewP}
                        multiline={false}
                        numberOfLines={1}
                        keyboardType={this.state.selectTypeVal === 2 ? "number-pad" : "default"}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={this.state.selectTypeVal === 2 ? 6 : 50}/>
                </View>
                {this.state.errorConfNewP !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorConfNewP}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
        </View>)
    }


    async processNewRequest(language) {
        let response = this.state.responseForOTP;
        console.log("newrequest", response);
        this.setState({isProgress: true});
        let changeReq = {
            DEVICE_ID: await Utility.getDeviceID(),
            USER_ID: response.USER_ID,
            CUSTOMER_ID: response.CUSTOMER_ID.toString(),
            RESET_TYPE: "F",
            REQUEST_CD: response.REQUEST_CD,
            REQ_TYPE: "P",
            ACTION: "RESETPWDVERIFY",
            NEW_PASSWORD: this.state.newP,
            ACTIVITY_CD: response.ACTIVITY_CD,
            REQ_FLAG: "R",
            ...Config.commonReq
        }
        if (this.state.selectTypeVal > 0)
            changeReq = {...changeReq, PASS_TYPE: this.state.selectTypeVal === 1 ? "L" : "P"}
        console.log("changeReq", changeReq);
        let result = await ApiRequest.apiRequest.callApi(changeReq, {});
        //result = result[0]
        this.setState({isProgress: false});
        if (result.STATUS === "0" || result.STATUS === "999") {
            console.log("result final", result.MESSAGE);
            Utility.alert(result.MESSAGE);
        } else {
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }
    }

    render() {
        let language = this.props.language;
        return (<View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={CommonStyle.toolbar}>
                    <TouchableOpacity
                        style={CommonStyle.toolbar_back_btn_touch}
                        onPress={() => this.backBtn()}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../resources/images/ic_back_android.png") : require("../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.credentialDetails}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        {this.state.otpView || this.state.isField ? null : this.mainLayout(language)}
                        {this.state.isField ? this.fieldSet(language) : this.state.otpView ? this.otpLayout(language) : this.state.selectActCard.value === 1 ? this.creditCardOption(language) : this.accountNoOption(language)}
                        <View style={{
                            flexDirection: "row",
                            marginStart: Utility.setWidth(10),
                            marginRight: Utility.setWidth(10),
                            marginTop: Utility.setHeight(20)
                        }}>
                            <TouchableOpacity style={{flex: 1}} onPress={() => this.backBtn()}>
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
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{(this.state.isField || (this.state.otpView && this.state.selectTypeVal === 0) || (this.state.selectTypeVal === 0 && this.state.selectActCard.value === 1)) ? language.submit : language.next}</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                        <Text style={{marginStart: 10, marginTop: 20, color: themeStyle.THEME_COLOR}}>
                            *{language.mark_field_mandatory}
                        </Text>
                    </View>
                </ScrollView>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({modalVisible: false})
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{
                                width: "100%",
                                backgroundColor: themeStyle.THEME_COLOR,
                                height: Utility.setHeight(30),
                                justifyContent: "center"
                            }}>
                                <Text style={[CommonStyle.midTextStyle, {
                                    textAlign: "center",
                                    color: themeStyle.WHITE,

                                }]}>{this.state.modalTitle}</Text>
                            </View>

                            <FlatList style={{backgroundColor: themeStyle.WHITE, width: "100%"}}
                                      data={this.state.modalData} keyExtractor={(item, index) => item.key}
                                      renderItem={({item}) =>
                                          <TouchableOpacity onPress={() => this.onSelectItem(item)}>
                                              <View
                                                  style={{height: Utility.setHeight(35), justifyContent: "center"}}>
                                                  <Text
                                                      style={[CommonStyle.textStyle, {
                                                          color: themeStyle.THEME_COLOR,
                                                          marginStart: 10
                                                      }]}>{item.label}</Text>
                                              </View>
                                          </TouchableOpacity>
                                      }
                                      ItemSeparatorComponent={this.renderSeparator}/>
                        </View>
                    </View>
                </Modal>
                <BusyIndicator visible={this.state.isProgress}/>
                {this.state.showMonthPicker ? <MonthPicker
                    onChange={this.onValueChange}
                    value={new Date()}
                    minimumDate={new Date()}
                    maximumDate={new Date(new Date().getFullYear() + 10, 12)}
                    locale="en"
                    mode="number"
                /> : null}

            </View>
        )
    }

}

const styles = {
    arrowStyle: {
        tintColor: themeStyle.BLACK,
        width: Utility.setWidth(35),
        height: Utility.setHeight(30)
    },
    selectionBg: {
        paddingStart: 10,
        paddingBottom: 4,
        paddingTop: 4,
        paddingEnd: 10,
        flexDirection: "row",
        backgroundColor: themeStyle.SELECTION_BG,
        alignItems: "center"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: Utility.getDeviceWidth() - 30,
        overflow: "hidden",
        borderRadius: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    }

}

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(CredentialDetails);
