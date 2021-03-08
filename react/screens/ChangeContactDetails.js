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
import RadioForm from "react-native-simple-radio-button";
import Config from "../config/Config";
import {CommonActions} from "@react-navigation/native";
import FontSize from "../resources/ManageFontSize";
import fontStyle from "../resources/FontStyle";
import MonthPicker from "react-native-month-year-picker";
import ApiRequest from "../config/ApiRequest";


class ChangeContactDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            select_contact_type: {label: props.language.select_contact_type, value: -1},
            select_actNo: props.language.select_actNo,
            selectType: props.language.selectType,
            selectTypeVal: -1,
            selectCard: props.language.selectCard,
            selectActCard: {key: "-1", label: props.language.select_txt, value: -1},
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
            errorConfCredential: "",
            errorCredential: "",
            errorMobile: "",
            newCredential: "",
            confNewCredential: "",
            otp_type: 0,
            errorTransPin: "",
            errorExpiry: "",
            errorPin: "",
            otpVal: "",
            dateVal: new Date(),
            showMonthPicker: false,
            errorConfMobile: "",
            errorConfEmail: "",
            errorEmail: "",
            actNoList: [],
            cardNoList: [],
            selectRes: null,
            otp_type: 0,
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

    onValueChange = (event, newDate) => {
        console.log("event", event + "-" + newDate);
        let dateVal = Utility.dateInFormat(newDate, "MM/YY");
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
                        //onChangeText={text => this.setState({transactionPin: Utility.input(text, "0123456789")})}
                        onChangeText={text => this.setState({
                            errorTransPin: "",
                            transactionPin: Utility.input(text, "0123456789")
                        })}
                        value={this.state.transactionPin}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
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

            {this.selectOtpView(language)}
        </View>)
    }

    selectOtpView(language) {
        return (<View key={"selectOtpView"}>
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.otpType}
                    <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                </Text>

                <RadioForm
                    radio_props={this.state.selectRes == null || this.state.selectRes.EMAIL_ID === "" ?
                        language.otp_props_mobile : language.otp_props}
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
                        errorPin: "",
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
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            {this.selectOtpView(language)}
        </View>)
    }

    onSelectItem(item) {
        console.log("item", item);
        const {modelSelection} = this.state;
        if (modelSelection === "accountListType") {
            this.setState({select_actNo: item.label, modalVisible: false, selectRes: item.item})
        } else if (modelSelection === "cardType") {
            this.setState({selectCard: item.label, modalVisible: false, stateVal: 0, selectRes: item.item})
        } else if (modelSelection === "contactType") {
            this.setState({select_contact_type: item, modalVisible: false, stateVal: 0})
        } else if (modelSelection === "accountType") {
            this.setState({
                selectActCard: item,
                modalVisible: false,
                stateVal: 0,
                expiryDate: "",
                transactionPin: "",
                cardPin: "",
                selectCard: this.props.language.selectCard,
                select_actNo: this.props.language.select_actNo
            })
        }
    }

    async getMailMobOtp() {
        let {stateVal, selectRes, select_contact_type, transactionPin} = this.state;
        console.log("selectRes", selectRes);
        let userDetails = this.props.userDetails;
        this.setState({isProgress: true});
        let otpRequest = {
            APPCUSTOMER_ID: selectRes.APPCUSTOMER_ID,
            CUSTOMER_ID: userDetails.CUSTOMER_ID,
            USER_ID: userDetails.USER_ID,
            AUTH_FLAG: userDetails.AUTH_FLAG,
            REQ_FLAG: "R",
            REQ_TYPE: select_contact_type.value === 0 ? "UPD_MOBILE" : "UPD_EMAIL",
            ACTION: "GENUPDEMAILMBOTP",
            ACTIVITY_CD: userDetails.ACTIVITY_CD,
            SOURCE: selectRes.SOURCE,
            OTP_TYPE: this.state.otp_type === 0 ? "S" : "E",
            DEVICE_ID: await Utility.getDeviceID(),
            MOBILE_NO: selectRes.MOBILE_NO,
            EMAIL_ID: selectRes.EMAIL_ID,
            ...Config.commonReq
        }
        let header = {};
        if (userDetails.AUTH_FLAG === "CP") {
            otpRequest = {
                ...otpRequest,
                CARD_DETAIL: {
                    ACCT_NO: selectRes.ACCOUNT_NO,
                    CARD_PIN: this.state.cardPin,
                    EXPIRY_DATE: Utility.reverseString(this.state.expiryDate)
                }
            }
            header = {CARD_VERIFY: "Y"};
        } else {
            otpRequest = {
                ...otpRequest,
                TRANSACTION_PIN: transactionPin,
            }
        }
        console.log("otpRequest", otpRequest);
        let result = await ApiRequest.apiRequest.callApi(otpRequest, header);
        console.log("result", result);
        this.setState({isProgress: false});
        if (result.STATUS === "0") {
            let response = result.RESPONSE[0];
            selectRes = {...selectRes, REQUEST_CD: response.REQUEST_CD.toString()}
            this.setState({selectRes, stateVal: 1});
        } else {
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }
    }

    async submit(language, navigation) {
        const {stateVal} = this.state;
        let userDetails = this.props.userDetails;
        if (stateVal === 0) {
            if (userDetails.AUTH_FLAG === "TP") {
                if (this.state.select_actNo === "Select Account Number") {
                    Utility.alert("Please Select Account Number");
                } else if (this.state.transactionPin === "") {
                    this.setState({errorTransPin: language.errTransPin});
                } else {
                    await this.getMailMobOtp();
                }
            } else if (userDetails.AUTH_FLAG === "CP") {
                if (this.state.selectCard === language.selectCard) {
                    Utility.alert(language.errorSelectCard);
                } else if (this.state.expiryDate === "") {
                    this.setState({errorExpiry: language.errExpiryDate});
                } else if (this.state.cardPin === "") {
                    this.setState({errorPin: language.errCardPin});
                } else {
                    await this.getMailMobOtp();
                }
            }
        } else if (stateVal === 1) {
            if (userDetails.AUTH_FLAG === "TP") {
                if (this.state.otpVal.length !== 4) {
                    Utility.alert(language.errOTP);
                } else {
                    await this.verifyOtp();
                }
            } else {
                await this.processChange(language, navigation);
            }
        } else if (stateVal === 2) {
            await this.processChange(language, navigation);
        }
    }

    async processChange(language, navigation) {
        if (this.state.newCredential === "") {
            this.setState({errorCredential: this.state.select_contact_type.value === 0 ? language.errorNewMobNo : language.errorEmail});
        } else if (this.state.confNewCredential !== this.state.newCredential) {
            this.setState({errorConfCredential: this.state.select_contact_type.value === 0 ? language.errorMobConfNo : language.errorConfEmail});
        } else {
            await this.changeMobEmail(language, navigation);
        }
    }

    async verifyOtp() {
        const {selectRes, select_contact_type} = this.state;
        let userDetails = this.props.userDetails;
        userDetails = {...userDetails, REQUEST_CD: selectRes.REQUEST_CD}
        this.setState({isProgress: true});
        await ApiRequest.apiRequest.getOTPCall(this.state.otpVal, "R", userDetails,
            userDetails.AUTH_FLAG, "GENUPDEMAILMBOTPVERIFY",
            select_contact_type.value === 0 ? "UPD_MOBILE" : "UPD_EMAIL", this.props)
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

    backAction = () => {
        this.backEvent();
        return true;
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener("hardwareBackPress", this.backAction);
        }
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

    async changeMobEmail(language, navigation) {
        let {selectRes, select_contact_type, newCredential} = this.state;
        let userDetails = this.props.userDetails;
        let changeRequest = {
            APPCUSTOMER_ID: selectRes.APPCUSTOMER_ID,
            USER_ID: userDetails.USER_ID,
            AUTH_FLAG: userDetails.AUTH_FLAG,
            REQ_FLAG: "R",
            REQUEST_CD: selectRes.REQUEST_CD,
            CUSTOMER_ID: userDetails.CUSTOMER_ID,
            ACTIVITY_CD: userDetails.ACTIVITY_CD,
            SOURCE: selectRes.SOURCE,
            DEVICE_ID: await Utility.getDeviceID(),
            ...Config.commonReq
        }
        if (select_contact_type.value === 0) {
            changeRequest = {
                ...changeRequest, ACTION: "UPDATEMOBILENO",
                REQ_TYPE: "UPD_MOBILE", OLDMOBILENO: "8801719365359", NEWMOBILENO: newCredential
            };
        } else {
            changeRequest = {
                ...changeRequest, ACTION: "UPDATEEMAILID", REQ_TYPE: "UPD_EMAIL",
                OLDEMAILID: selectRes.EMAIL_ID, NEWEMAILID: newCredential
            };
        }

        this.setState({isProgress: true});
        console.log("result", changeRequest);
        let result = await ApiRequest.apiRequest.callApi(changeRequest, {});
        console.log("result", JSON.stringify(result));
        this.setState({isProgress: false});

        if (result.STATUS === "0") {
            Utility.alertWithBack(language.ok, result.MESSAGE, navigation)
        } else if (result.STATUS === "999") {
            Utility.alert(result.MESSAGE);
        } else {
            this.setState({isProgress: false});
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }
    }

    processAccounts(response) {
        let accountArr = [], cardArr = [];
        response.ACCOUNT_DTL.map((account) => {
            accountArr.push({
                label: Utility.maskString(account.ACCOUNT_NO) + "/" + account.ACCT_TYPE_NM,
                value: account.ACCOUNT_NO,
                item: account
            });
        });

        response.CARD_DTL.map((card) => {
            cardArr.push({
                label: Utility.maskString(card.ACCOUNT_NO) + "/" + card.ACCT_TYPE_NM,
                value: card.ACCOUNT_NO,
                item: card
            });
        });
        this.setState({actNoList: accountArr, cardNoList: cardArr, isProgress: false});
    }

    backEvent() {
        const {stateVal} = this.state;
        if (stateVal === 0)
            this.props.navigation.goBack(null);
        else
            this.setState({stateVal: stateVal - 1});
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
                        {this.state.select_contact_type.value === 0 ? language.new_mobile_no : language.new_email}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.enterHere}
                        onChangeText={text => this.setState({
                            errorCredential: "",
                            newCredential: this.state.select_contact_type.value === 0 ? Utility.input(text, "0123456789") : Utility.userInput(text)
                        })}
                        value={this.state.newCredential}
                        multiline={false}
                        numberOfLines={1}
                        keyboardType={this.state.select_contact_type.value === 0 ? "number-pad" : "email-address"}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.confRef.focus();
                        }}
                        autoCorrect={false}/>
                </View>
                {this.state.errorCredential !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorCredential}</Text> : null}

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
                        {this.state.select_contact_type.value === 0 ? language.conf_new_mobile_no : language.conf_new_email}
                    </Text>
                    <TextInput
                        ref={(ref) => this.confRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.enterHere}
                        onChangeText={text => this.setState({
                            errorConfCredential: "",
                            confNewCredential: this.state.select_contact_type.value === 0 ? Utility.input(text, "0123456789") : Utility.userInput(text)
                        })}
                        value={this.state.confNewCredential}
                        multiline={false}
                        numberOfLines={1}
                        keyboardType={this.state.select_contact_type.value === 0 ? "number-pad" : "email-address"}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}/>
                </View>
                {this.state.errorConfCredential !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorConfCredential} </Text> : null}

            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
        </View>)
    }

    processStage(language) {
        if (this.props.userDetails.AUTH_FLAG === "TP")
            return this.state.stateVal === 0 ? this.accountNoOption(language) : this.state.stateVal === 1 ? this.otpEnter(language) : this.passwordSet(language);
        else
            return this.state.stateVal === 0 ? this.creditCardOption(language) : this.passwordSet(language);
    }

    otpEnter(language) {
        return (<View key={"otpEnter"}>
            <Text style={[CommonStyle.textStyle, {
                marginStart: Utility.setWidth(10),
                marginEnd: Utility.setWidth(10),
                marginTop: Utility.setHeight(10),
                marginBottom: Utility.setHeight(20),
            }]}> {this.state.select_contact_type.value === 0 ? language.otp_description + language.otp_mobile :
                language.otp_description + language.otp_email}</Text>
            <View style={{
                borderColor: themeStyle.BORDER,
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
        return (<View key={"mainLayout"}>
            <Text style={[CommonStyle.labelStyle, {
                color: themeStyle.THEME_COLOR,
                marginStart: 10,
                marginEnd: 10,
                marginTop: 6,
                marginBottom: 4
            }]}>
                {language.type_contact}
            </Text>

            <TouchableOpacity
                onPress={() => this.openModal("contactType", language.select_contact_type, language.contactList, language)}>
                <View style={styles.selectionBg}>
                    <Text style={[CommonStyle.midTextStyle, {color: themeStyle.BLACK, flex: 1}]}>
                        {this.state.select_contact_type.label}
                    </Text>
                    <Image resizeMode={"contain"} style={styles.arrowStyle}
                           source={require("../resources/images/ic_arrow_down.png")}/>
                </View>
            </TouchableOpacity>


            {this.state.select_contact_type.value !== -1 ? <View>
                <Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                    marginBottom: 4
                }]}>
                    {language.changeIn}
                </Text>
                <TouchableOpacity
                    onPress={() => this.openModal("accountType", language.select_txt, language.changeInArr, language)}>
                    <View style={styles.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {color: themeStyle.BLACK, flex: 1}]}>
                            {this.state.selectActCard.label}
                        </Text>
                        <Image resizeMode={"contain"} style={styles.arrowStyle}
                               source={require("../resources/images/ic_arrow_down.png")}/>
                    </View>
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
                    <TouchableOpacity
                        style={CommonStyle.toolbar_back_btn_touch}
                        onPress={() => this.backEvent()}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../resources/images/ic_back_android.png") : require("../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.change_contact}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        {this.state.stateVal === 0 ? this.mainLayout(language) : null}
                        {this.state.select_contact_type.value !== -1 ? this.processStage(language) : null}
                        {this.state.select_contact_type.value !== -1 ? <View style={{
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
                                                      }]}>{item.label ? item.label : item.ACCOUNT_NO}</Text>
                                              </View>
                                          </TouchableOpacity>
                                      }
                                      ItemSeparatorComponent={this.renderSeparator}/>
                        </View>
                    </View>
                </Modal>
                {
                    this.state.showMonthPicker ? <MonthPicker
                        onChange={this.onValueChange}
                        value={new Date()}
                        minimumDate={new Date()}
                        maximumDate={new Date(new Date().getFullYear() + 10, 12)}
                        locale="en"
                        mode="number"
                    /> : null
                }
                <BusyIndicator visible={this.state.isProgress}/>
            </View>
        )
    }

}

const styles = {
    arrowStyle: {
        tintColor: themeStyle.BLACK,
        width: Utility.setWidth(35), height: Utility.setHeight(30)
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
        maxHeight: Utility.getDeviceHeight() - 100,
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
    }
;

export default connect(mapStateToProps)(ChangeContactDetails);
