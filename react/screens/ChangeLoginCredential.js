import {connect} from "react-redux";
import {
    I18nManager,
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Image,
    TextInput, FlatList, Platform, StatusBar, Alert, BackHandler
} from "react-native";
import themeStyle from "../resources/theme.style";
import CommonStyle from "../resources/CommonStyle";
import React, {Component} from "react";
import {BusyIndicator} from "../resources/busy-indicator";
import Utility from "../utilize/Utility";

import FontSize from "../resources/ManageFontSize";
import fontStyle from "../resources/FontStyle";
import ApiRequest from "../config/ApiRequest";
import MonthPicker from "react-native-month-year-picker";



class ChangeLoginCredential extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            select_credential_type: props.route.params.title === props.language.change_login_password?props.language.credentialList[0]:props.language.credentialList[1],
            select_actNo: props.language.select_actNo,
            selectType: props.language.selectType,
            selectTypeVal: -1,
            selectCard: props.language.selectCard,
            selectActCard: props.userDetails.AUTH_FLAG==="TP"?props.language.accountTypeArr[0]:props.language.accountTypeArr[1],
            accountNo: "",
            cardPin: "",
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            expiryDate: "",
            creditCardNo: "",
            transactionPin: "",
            stateVal: 0,
            newCredential: "",
            errorNewCredential: "",
            confNewCredential: "",
            errorConfNewCredential: "",
            actNoList: [],
            cardNoList: [],
            selectRes: null,
            errorTransPin: "",
            errorCardPin: "",
            errorExpiry: "",
            dateVal: new Date(),
            showMonthPicker: false,
            title:props.route.params.title,
        }
        console.log("check it",props.route.params.title === props.language.change_login_password)
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

    accountNoOption(language) {
        return (<View key={"accountNoOption"}>
            <TouchableOpacity style={{marginTop: 20}}
                              onPress={() => this.openModal("accountListType", language.select_actNo, this.state.actNoList, language)}>
                <View style={styles.selectionBg}>
                    <Text style={[CommonStyle.midTextStyle, {
                        color: this.state.select_actNo === language.select_actNo ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                        flex: 1
                    }]}>
                        {this.state.select_actNo}
                    </Text>
                    <Image resizeMode={"contain"} style={styles.arrowStyle}
                           source={require("../resources/images/ic_arrow_down.png")}/>
                </View>
            </TouchableOpacity>
            {this.state.select_actNo !== language.select_actNo ? <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.transactionPin}
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
                            errorTransPin: "",
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
                {this.state.errorTransPin !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorTransPin}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            </View> : null}
        </View>)
    }

    creditCardOption(language) {
        return (<View key={"creditCardOption"}>

            <TouchableOpacity style={{marginTop: 20}}
                              onPress={() => this.openModal("cardType", language.selectCard, this.state.cardNoList, language)}>
                <View style={styles.selectionBg}>
                    <Text style={[CommonStyle.midTextStyle, {
                        color: this.state.select_actNo === language.select_actNo ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                        flex: 1
                    }]}>
                        {this.state.selectCard}
                    </Text>
                    <Image resizeMode={"contain"} style={styles.arrowStyle}
                           source={require("../resources/images/ic_arrow_down.png")}/>
                </View>
            </TouchableOpacity>

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
                }} onPress={() => this.setState({errorExpiry: "", showMonthPicker: true})}>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.expiryDate}
                        value={this.state.expiryDate}
                        editable={false}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        secureTextEntry={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={5}/></TouchableOpacity>
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
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
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
                    onChangeText={text => this.setState({errorCardPin: "", cardPin: Utility.input(text, "0123456789")})}
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
            {this.state.errorCardPin !== "" ?
                <Text style={{
                    marginLeft: 5,
                    marginRight: 10,
                    color: themeStyle.THEME_COLOR,
                    fontSize: FontSize.getSize(11),
                    fontFamily: fontStyle.RobotoRegular,
                    alignSelf: "flex-end",
                    marginBottom: 10,
                }}>{this.state.errorCardPin}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
        </View>)
    }

    onSelectItem(item) {
        const {modelSelection} = this.state;
        if (modelSelection === "accountListType") {
            this.setState({select_actNo: item.label, modalVisible: false, selectRes: item.item})
        } else if (modelSelection === "cardType") {
            this.setState({selectCard: item.label, modalVisible: false, stateVal: 0, selectRes: item.item})
        } else if (modelSelection === "accountType") {
            this.setState({selectActCard: item, modalVisible: false, stateVal: 0})
        } else if (modelSelection === "credentialType") {
            this.setState({select_credential_type: item, modalVisible: false, stateVal: 0})
        }
    }

    async submit(language, navigation) {
        const {stateVal, select_actNo, transactionPin, selectCard} = this.state;
        console.log("this.state.selectActCard", this.state.selectActCard);
        console.log("this.state.stateVal", this.state.stateVal);
        if (stateVal === 0) {
            if (this.state.selectActCard.value === 0) {
                if (select_actNo === this.props.language.select_actNo) {
                    Utility.alert(language.errorActNo);
                } else if (transactionPin === "") {
                    this.setState({errorTransPin: language.errTransPin});
                } else {
                    await this.verifyCard();
                }
            } else if (this.state.selectActCard.value === 1) {
                if (this.state.selectCard === language.selectCard) {
                    Utility.alert(language.errorSelectCard);
                } else if (this.state.expiryDate === "") {
                    this.setState({errorExpiry: language.errExpiryDate});
                } else if (this.state.cardPin === "") {
                    this.setState({errorCardPin: language.errCardPin});
                } else {
                    await this.verifyCard();
                }
            }
        } else if (stateVal === 1) {
            if (this.state.selectActCard.value === 0) {
                if (this.state.otpVal.length !== 4) {
                    Utility.alert(language.errOTP);
                } else {
                    await this.verifyOtp();
                }
            } else {
                await this.changeCredential(language, navigation);
            }
        } else if (stateVal === 2) {
            await this.changeCredential(language, navigation);
        }
    }

    async verifyOtp() {
        const {selectActCard, selectRes, select_contact_type} = this.state;
        let userDetails = this.props.userDetails;
        userDetails = {...userDetails, REQUEST_CD: selectRes.REQUEST_CD, MOBILE_NO: selectRes.MOBILE_NO,}
        this.setState({isProgress: true});
        await ApiRequest.apiRequest.getOTPCall(this.state.otpVal, "R", userDetails,
            selectActCard.value === 0 ? "TP" : "CP", "CHANGEPWD",
            "O", this.props)
            .then((response) => {
                console.log(response);
                this.setState({isProgress: false, stateVal: 2});

            }, (error) => {
                this.setState({isProgress: false});
                console.log("error", error);
            });
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
        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.more
        });
        await this.getAccount();
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener("hardwareBackPress", this.backAction);
        }
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

    async getAccount() {
        let userDetails = this.props.userDetails;
        this.setState({isProgress: true});
        let result = await ApiRequest.apiRequest.getAccountDetails(userDetails, {});
        console.log("result", result);
        if (result.STATUS === "0") {
            let response = result.RESPONSE[0];
            console.log("response", response);
            this.processAccounts(response);
        } else {
            this.setState({isProgress: false});
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }
    }

    processAccounts(response) {
        let accountArr = [], cardArr = [];
        response.ACCOUNT_DTL.map((account) => {
            accountArr.push({label: account.ACCOUNT_NO, value: account.ACCOUNT_NO, item: account});
        });

        response.CARD_DTL.map((account) => {
            cardArr.push({label: account.ACCOUNT_NO, value: account.ACCOUNT_NO, item: account});
        });
        this.setState({actNoList: accountArr, cardNoList: cardArr, isProgress: false});
    }


    passwordSet(language) {
        return (<View key={"passwordSet"} style={{
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
                        {this.state.select_credential_type.value === 0 ? language.pwd_txt : language.new_pin_txt}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={this.state.select_credential_type.value === 0 ? language.new_pass_txt : language.et_new_pin_txt}
                        onChangeText={text => this.setState({
                            errorNewCredential: "",
                            newCredential: this.state.select_credential_type.value === 0 ? Utility.userInput(text) : Utility.input(text, "0123456789")
                        })}
                        value={this.state.newCredential}
                        multiline={false}
                        numberOfLines={1}
                        keyboardType={this.state.select_credential_type.value === 0 ?"default":"number-pad"}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.newCredentialRef.focus();
                        }}
                        maxLength={this.state.select_credential_type.value === 0 ?12:6}/>
                </View>
                {this.state.errorNewCredential !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorNewCredential}</Text> : null}
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
                        {this.state.select_credential_type.value === 0 ? language.conf_new_pass_txt : language.conf_new_pass_txt}
                    </Text>
                    <TextInput
                        ref={(ref) => this.newCredentialRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={this.state.select_credential_type.value === 0 ? language.et_confirm_pwd_txt : language.et_confirm_pin_txt}
                        onChangeText={text => this.setState({
                            errorConfNewCredential: "",
                            confNewCredential: this.state.select_credential_type.value === 0 ? Utility.userInput(text) : Utility.input(text, "0123456789")
                        })}
                        value={this.state.confNewCredential}
                        multiline={false}
                        numberOfLines={1}
                        keyboardType={this.state.select_credential_type.value === 0 ?"default":"number-pad"}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={this.state.select_credential_type.value === 0 ?12:6}/>
                </View>
                {this.state.errorConfNewCredential !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorConfNewCredential}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
        </View>)
    }

    processStage(language) {
        if (this.state.selectActCard.value === 0)
            return this.state.stateVal === 0 ? this.accountNoOption(language) : this.state.stateVal === 1 ? this.otpEnter(language) : this.passwordSet(language);
        else
            return this.state.stateVal === 0 ? this.creditCardOption(language) : this.passwordSet(language);
    }

    async verifyCard() {
        const {select_actNo, expiryDate, transactionPin, cardPin, selectCard, selectActCard, selectRes} = this.state;
        let userDetails = this.props.userDetails;
        userDetails = {...userDetails,MOBILE_NO:selectRes.MOBILE_NO,EMAIL_ID:selectRes.EMAIL_ID};
        let pin = this.state.selectActCard.value === 0 ? transactionPin : cardPin;
        let actCardNumber = selectActCard.value === 0 ? select_actNo : selectCard;
        this.setState({isProgress: true});
        await ApiRequest.apiRequest.verifyAccountCard(selectActCard.value === 1,
            actCardNumber, pin, expiryDate, userDetails,this.state.select_credential_type.value === 0 ? "L" : "P", this.props)
            .then((response) => {
                console.log(response);
                this.setState({
                    isProgress: false,
                    selectRes: {...selectRes, REQUEST_CD: response.REQUEST_CD.toString()},
                    stateVal: selectActCard.value === 0 ? 1 : 2
                });
            }, (error) => {
                this.setState({isProgress: false});
                console.log("error", error);
            });
    }

    async changeCredential(language, navigation) {
        const {
            selectRes,
            newCredential,
            selectActCard,
            errorNewCredential,
            confNewCredential,
            errorConfNewCredential,
            select_credential_type
        } = this.state;


        if ((select_credential_type.value === 0 && newCredential === "") || (select_credential_type.value === 1 && newCredential.length !== 6)) {
            this.setState({errorNewCredential: select_credential_type.value === 0 ? language.errorNewPwd : language.errorNewPIN});
            return;
        } else if (confNewCredential !== newCredential) {
            this.setState({errorConfNewCredential: select_credential_type.value === 0 ? language.errorNewConfPIN : language.errorNewConfPIN});
            return;
        }


        let userDetails = this.props.userDetails;
        userDetails = {...userDetails, REQUEST_CD: selectRes.REQUEST_CD}
        this.setState({isProgress: true});
        await ApiRequest.apiRequest.changeCredential(selectActCard.value === 1, newCredential
            , userDetails, this.state.select_credential_type.value === 0 ? "L" : "P", this.props)
            .then((response) => {
                console.log(response);
                this.setState({isProgress: false});
                Utility.alertWithBack(language.ok, response.MESSAGE, navigation)
            }, (error) => {
                this.setState({isProgress: false});
                console.log("error", error);
            });
    }


    otpEnter(language) {
        return (<View key={"otpEnter"}>
            <Text style={[CommonStyle.textStyle, {
                marginStart: Utility.setWidth(10),
                marginEnd: Utility.setWidth(10),
                marginTop: Utility.setHeight(10),
                marginBottom: Utility.setHeight(20),
            }]}> {language.otp_description + language.otp_pwd}</Text>
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
            <Text style={[CommonStyle.labelStyle, {
                color: themeStyle.THEME_COLOR,
                marginStart: 10,
                marginEnd: 10,
                marginTop: 6,
                marginBottom: 4
            }]}>
                {language.type_credential}
            </Text>

            <TouchableOpacity
                onPress={() => this.openModal("credentialType", language.select_credential_type, language.credentialList, language)}>
                <View style={styles.selectionBg}>
                    <Text style={[CommonStyle.midTextStyle, {color: themeStyle.BLACK, flex: 1}]}>
                        {this.state.select_credential_type.label}
                    </Text>
                    <Image resizeMode={"contain"} style={styles.arrowStyle}
                           source={require("../resources/images/ic_arrow_down.png")}/>
                </View>
            </TouchableOpacity>
            {this.state.select_credential_type.value !== -1 ?
                <View key={"accountSelection"}>
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
                        disabled={true}
                        onPress={() => this.openModal("accountType", language.selectActType, language.accountTypeArr, language)}>
                        <View style={[styles.selectionBg,{height:Utility.setHeight(40)}]}>
                            <Text style={[CommonStyle.midTextStyle, {color: themeStyle.BLACK, flex: 1}]}>
                                {this.state.selectActCard.label}
                            </Text>
                           {/* <Image resizeMode={"contain"} style={styles.arrowStyle}
                                   source={require("../resources/images/ic_arrow_down.png")}/>*/}
                        </View>
                    </TouchableOpacity></View> : null}
        </View>)

    }

    render() {
        let language = this.props.language;
        return (<View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={CommonStyle.toolbar}>
                    <TouchableOpacity
                        style={CommonStyle.toolbar_back_btn_touch}
                        onPress={() => this.backEvent()}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../resources/images/ic_back_android.png") : require("../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{this.state.title}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        {this.state.stateVal === 0 ? this.mainLayout(language) : null}
                        {this.state.select_credential_type.value !== -1 ? this.processStage(language) : null}
                        {this.state.select_credential_type.value !== -1 ?
                            <View style={{
                                flexDirection: "row",
                                marginStart: Utility.setWidth(10),
                                marginRight: Utility.setWidth(10),
                                marginTop: Utility.setHeight(20)
                            }}>
                                <TouchableOpacity style={{flex: 1}}
                                                  onPress={() => this.submit(language, this.props.navigation)}>
                                    <View style={{
                                        alignSelf: "center",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: Utility.getDeviceWidth() / 3,
                                        height: Utility.setHeight(46),
                                        borderRadius: Utility.setHeight(23),
                                        backgroundColor: themeStyle.THEME_COLOR
                                    }}>
                                        <Text
                                            style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{this.state.stateVal !== 2 ? language.next : language.submit}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View> : null}
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
                                      data={this.state.modalData} keyExtractor={(item, index) => index + ""}
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
                {this.state.showMonthPicker ? <MonthPicker
                    onChange={this.onValueChange}
                    value={new Date()}
                    minimumDate={new Date()}
                    maximumDate={new Date(new Date().getFullYear() + 10, 12)}
                    locale="en"
                    mode="number"
                /> : null}
                <BusyIndicator visible={this.state.isProgress}/>
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
        userDetails: state.accountReducer.userDetails,
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(ChangeLoginCredential);
