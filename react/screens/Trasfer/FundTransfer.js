import {connect} from "react-redux";
import {
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Image,
    TextInput, FlatList, Platform, StatusBar, BackHandler
} from "react-native";
import themeStyle from "../../resources/theme.style";
import fontStyle from "../../resources/FontStyle";
import FontSize from "../../resources/ManageFontSize";
import CommonStyle from "../../resources/CommonStyle";
import React, {Component} from "react";
import {BusyIndicator} from "../../resources/busy-indicator";
import Utility from "../../utilize/Utility";
import RadioForm from "react-native-simple-radio-button";

import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import {CHARGEVATAMT, FUNDTRF, GETAMTLABEL, OPERATIVETRNACCT} from "../Requests/FundsTransferRequest";
import {GETACCTBALDETAIL, GETBENF} from "../Requests/RequestBeneficiary";
import {GETBALANCE, unicodeToChar} from "../Requests/CommonRequest";
import Config from "../../config/Config";


let initialVar = {
    currency: "",
    isProgress: false,
    selectFromActVal: -1,
    selectToActVal: -1,
    selectPaymentVal: -1,
    selectNickVal: -1,
    modelSelection: "",
    modalVisible: false,
    modalTitle: "",
    modalData: [],
    transfer_type: 0,
    toBalance: "",
    toHolderName: "",
    toCurrency: "",
    transferAmount: "",
    servicesCharge: "",
    grandTotal: "",
    remarks: "",
    vat: "",
    paymentDate: "",
    numberPayment: "",
    toAccount: "",
    fromBalance: "",
    fromHolderName: "",
    VAT_AMT_LABEL: "",
    CHARGE_AMT_LABEL: "",
    error_transferAmount: "",
    error_grandTotal: "",
    error_remarks: "",
    error_vat: "",
    errorPaymentDate: "",
    error_numberPayment: "",
    errorToAct: "",
    focusAmount: false,
    focusAccount: false,
    account_holder_name: "",
    otp_type: 0,
    accountRes: null,
    transferArray: [],
    actLabelList: []
};

class FundTransfer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cityTransVal: 0,
            selectNickArr: [],
            selectNicknameType: props.language.select_nickname,
            selectAcctType: props.language.select_from_account,
            selectToAcctType: props.language.select_to_acct,
            selectPaymentType: props.language.select_payment,
            show: false,
            mode: "date",
            dateVal: new Date(),
            stateVal: 0,
            accountArr: [], ...initialVar
        }
    }

    openModal(option, title, data, language) {
        console.log("data", data);
        if (option === "fromAccountType") {
            data = data.filter((e) => e.value.FROM_ALLOW === "Y");
        } else if (option === "toAccountType") {
            data = data.filter((e) => e.value.TO_ALLOW === "Y");
        }
        if (data.length > 0) {
            this.setState({
                modelSelection: option,
                modalTitle: title,
                modalData: data, modalVisible: true
            });
        } else {
            Utility.alert(language.noRecord, language.ok);
        }
    }

    showDatepicker = (id) => {
        this.setState({errorPaymentDate: "", currentSelection: id, show: true, mode: "date"});
    };

    onChange = (event, selectedDate) => {
        if (event.type !== "dismissed" && selectedDate !== undefined) {
            console.log("selectedDate-", selectedDate);
            let currentDate = selectedDate === "" ? new Date() : selectedDate;
            currentDate = moment(currentDate).format("DD-MMM-YYYY");
            this.setState({dateVal: selectedDate, paymentDate: currentDate, show: false});
        } else {
            this.setState({show: false});
        }
    };

    async onSelectItem(item) {
        const {modelSelection} = this.state;

        if (modelSelection === "nickName") {
            console.log("onselect item is this", item)
            this.setState({
                selectNicknameType: item.label,
                selectNickVal: item.value,
                modalVisible: false,
                toAccount: item.value.TO_ACCT_NM,
            })
        } else if (modelSelection === "fromAccountType") {
            this.setState({
                selectAcctType: item.label,
                selectFromActVal: item.value,
                modalVisible: false,
                isProgress: true
            })
            await this.getBalance(item.value, true);
        } else if (modelSelection === "toAccountType") {
            this.setState({
                selectToAcctType: item.label,
                selectToActVal: item.value,
                modalVisible: false,
                isProgress: true
            })
            await this.getBalance(item.value, false);
        } else if (modelSelection === "paymentType") {
            this.setState({selectPaymentType: item.label, selectPaymentVal: item.value, modalVisible: false})
        }
    }

    async getBalance(account, isFrom) {
        let accountNo = account.ACCT_UNMASK;
        GETBALANCE(accountNo, account.APP_INDICATOR, account.APPCUSTOMER_ID, this.props).then(response => {
            console.log("response", response);
            if (isFrom) {
                this.setState({
                    isProgress: false,
                    currency: response.CURRENCYCODE,
                    fromHolderName: response.ACCOUNTNAME,
                    fromBalance: response.hasOwnProperty("AVAILBALANCE") ? response.AVAILBALANCE : response.BALANCE
                })
            } else {
                this.setState({
                    isProgress: false,
                    toCurrency: response.CURRENCYCODE,
                    toHolderName: response.ACCOUNTNAME,
                    toBalance: response.hasOwnProperty("AVAILBALANCE") ? response.AVAILBALANCE : response.BALANCE
                })
            }
        }).catch(error => {
            this.setState({isProgress: false});
            console.log("error", error);
        });

    }

    getListViewItem = (item) => {
        this.setState({error_transferAmount: "", transferAmount: item.AMOUNT_LABEL}, async () => {
            await this.calculateVat();
        });
    }

    backAction = () => {
        this.backEvent();
        return true;
    }

    backEvent() {
        const {stateVal} = this.state;
        console.log("log", stateVal);
        if (stateVal < 2)
            this.props.navigation.goBack();
        else if (stateVal === 2)
            this.setState({stateVal: stateVal - 2});
        else if (stateVal === 4) {
            this.setState({stateVal: stateVal - 3});
        } else {
            this.setState({stateVal: stateVal - 1});
        }
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener("hardwareBackPress", this.backAction);
        }
    }

    async onSubmit(language) {
        console.log("cityTransVal", this.state.cityTransVal)
        console.log("transfer type", this.state.transfer_type)
        console.log("accountRes ACCOUNT", this.state.accountRes)
        console.log("TO_ACCT_NO is this", this.state.selectNickVal)
        const {
            numberPayment,
            selectPaymentType,
            paymentDate,
            fromBalance,
            grandTotal,
            toAccount,
            selectAcctType,
            selectNicknameType,
            stateVal,
            selectToActVal,
            selectFromActVal,
            cityTransVal,
            transferAmount,
            remarks
        } = this.state;

        if (stateVal === 0) {
            if (selectFromActVal === -1) {
                Utility.alert(language.error_select_from_type, language.ok);
            } else if (selectToActVal === -1) {
                Utility.alert(language.error_select_to_type, language.ok);
            } else if (selectFromActVal === selectToActVal) {
                Utility.alert(language.error_account_same, language.ok);
            } else if (selectToActVal.IS_STAFF_AC === "Y" && selectFromActVal.ACCT_TYPE === "PREPAID CARD") {
                Utility.alert(language.errPrepaidStaff, language.ok);
            } else if (transferAmount === "") {
                this.setState({error_transferAmount: language.errAmt});
            } else if (parseFloat(transferAmount) < parseFloat(selectFromActVal.MIN_CARD_TRN_AMT)) {
                this.setState({error_transferAmount: language.errTransferAmt + " " + selectFromActVal.MIN_CARD_TRN_AMT});
            } else if (parseFloat(transferAmount) > (parseFloat(fromBalance) * parseFloat(selectFromActVal.MAX_WITHDRAW) / 100)) {
                this.setState({error_transferAmount: language.errMaxTransferAmt + " " + (parseFloat(fromBalance) * parseFloat(selectFromActVal.MAX_WITHDRAW) / 100)});
            } else if (remarks === "") {
                this.setState({error_remarks: language.errRemarks});
            } else if (this.state.transfer_type === 1) {
                this.processRequest(language, 0);
            } else {
                this.processRequest(language, 0);
            }
        } else if (stateVal === 1) {
            if (selectAcctType === language.selectAccountType) {
                Utility.alert(language.error_select_from_type, language.ok);
            } else if (cityTransVal === 1 && selectNicknameType === language.select_nickname) {
                Utility.alert(language.error_select_nickname_type, language.ok);
            } else if (cityTransVal === 0 && toAccount.length === 0) {
                this.setState({errorToAct: language.require_accnumber});
            } else if (transferAmount === "") {
                this.setState({error_transferAmount: language.errAmt});
            } else if (parseFloat(transferAmount) < parseFloat(selectFromActVal.MIN_CARD_TRN_AM)) {
                this.setState({error_transferAmount: language.errTransferAmt + " " + selectFromActVal.MIN_CARD_TRN_AM});
            } else if (parseFloat(transferAmount) > (parseFloat(fromBalance) * parseFloat(selectFromActVal.MAX_WITHDRAW) / 100)) {
                this.setState({error_transferAmount: language.errMaxTransferAmt + " " + (parseFloat(fromBalance) * parseFloat(selectFromActVal.MAX_WITHDRAW) / 100)});
            } else if (remarks === "") {
                this.setState({error_remarks: language.errRemarks});
            } else if (grandTotal !== "" && parseFloat(fromBalance) < parseFloat(grandTotal)) {
                Utility.alert(this.props.language.insufficientBal, this.props.language.ok);
            } else if (this.state.cityTransVal === 0) {
                this.processRequest(language, 1);
            } else if (this.state.cityTransVal === 1 && this.state.transfer_type === 1) {
                if (paymentDate === "") {
                    this.setState({errorPaymentDate: language.error_payment_date});
                } else if (selectPaymentType === language.select_payment) {
                    Utility.alert(language.select_payment, language.ok);
                } else if (numberPayment === "") {
                    this.setState({error_numberPayment: language.error_numberPayment});
                } else {
                    this.processRequest(language, 1);
                }
            } else {
                this.processRequest(language, 1);
            }
        }
    }

    processRequest(language, val) {
        let tempArr = [];
        let screenName = "";
        let userDetails = this.props.userDetails;
        let request = {
            APP_CUSTOMER_ID:this.state.selectFromActVal.APP_CUSTOMER_ID,
            CUSTOMER_ID: userDetails.CUSTOMER_ID,
            USER_ID: userDetails.USER_ID,
            ACTIVITY_CD: userDetails.ACTIVITY_CD,
            TO_ACCT_NO: val === 0 ? this.state.selectToActVal.ACCT_UNMASK : this.state.cityTransVal === 0 ? this.state.accountRes.ACCOUNT : this.state.selectNickVal.TO_ACCT_NO,
            SERVICE_CHARGE: this.state.servicesCharge,
            ACTION: "FUNDTRF",
            TRN_AMT: this.state.transferAmount,
            REMARKS: this.state.remarks,
            ACCT_NO: this.state.selectFromActVal.ACCT_UNMASK,
            TO_ACCT_NM: "",
            FROM_ACCT_NM: this.state.fromHolderName,
            NICK_NAME: val === 0 ? "" : this.state.cityTransVal === 0 ? "" : this.state.selectNickVal.NICK_NAME,
            REQ_FLAG: "R",
            REQ_TYPE: val === 1 && this.state.cityTransVal === 1 ? "B" : "I",
            TRN_TYPE: val === 0 ? "CBLOA" : "CBLTA",
            REF_NO: val === 1 && this.state.cityTransVal === 1 ? this.state.selectNickVal.REF_NO : "",
            TO_MOBILE_NO: val === 0 ? this.state.selectToActVal.MOBILE_NO : this.state.cityTransVal === 0 ? this.state.accountRes.CONTACTNUMBER : this.state.selectNickVal.TO_CONTACT_NO,
            BEN_TYPE: "I",
            APP_INDICATOR: val === 0 ? this.state.selectFromActVal.APP_INDICATOR : this.state.selectFromActVal.APP_INDICATOR,
            TO_EMAIL_ID: val === 0 ? this.state.selectToActVal.EMAIL_ID : this.state.cityTransVal === 0 ? "" : this.state.selectNickVal.TO_EMAIL_ID,
            VAT_CHARGE: this.state.vat,
            TO_IFSCODE: val === 0 ? "" : this.state.cityTransVal === 0 ? "" : this.state.selectNickVal.TO_IFSCODE,
            OTP_TYPE: this.state.otp_type === 0 ? "S" : "E",
            FROM_CURRENCY_CODE: this.state.selectFromActVal.CURRENCY_CODE,
            TO_CURRENCY_CODE: val === 0 ? this.state.selectToActVal.CURRENCY_CODE : this.state.cityTransVal === 0 ? this.state.accountRes.CURRENCYCODE : this.state.selectNickVal.CURRENCY,
            TO_ACCT_CARD_FLAG: val === 0 ? this.state.selectToActVal.ACCT_CARD_FLAG : this.state.cityTransVal === 0 ? "A" : this.state.selectNickVal.ACCT_TYPE === "ACCOUNT" ? "A" : "C",
            ...Config.commonReq
        }
        console.log("request type is ", request);
        tempArr.push(
            {
                key: language.fromAccount,
                value: this.state.selectFromActVal.ACCT_UNMASK + "-" + this.state.selectFromActVal.ACCT_TYPE_NAME
            },
            {
                key: language.to_account,
                value: val === 0 ? this.state.selectToActVal.ACCT_UNMASK : this.state.cityTransVal === 0 ? this.state.accountRes.ACCOUNT : this.state.selectNickVal.TO_ACCT_NO
            });

        if (this.state.transfer_type === 1) {
            tempArr.push(
                {key: language.payment_date, value: this.state.paymentDate},
                {key: language.Frequency, value: this.state.selectPaymentType},
                {key: language.number_of_payment, value: this.state.numberPayment});
        }

        tempArr.push(
            {key: language.transfer_amount, value: this.state.transferAmount},
            {key: language.services_charge, value: this.state.servicesCharge},
            {key: language.vat, value: this.state.vat},
            {key: language.grand_total, value: this.state.grandTotal},
            {key: language.remarks, value: this.state.remarks});

        if (val === 0) {
            screenName = "Receipt";
        } else if (val === 1) {
            if (this.state.cityTransVal === 0)
                screenName = "SecurityVerification";
            else
                screenName = "Otp";
        }

        this.props.navigation.navigate("TransferConfirm", {
            routeVal: [{name: 'Transfer'}, {name: 'FundTransfer'}],
            routeIndex: 1,
            title: val === 0 ? language.fund_transfer_own_account : language.fund_transfer_city_account,
            transferArray: tempArr,
            screenName: screenName,
            transRequest: request
        });
    }

    async getOwnAccounts(serviceType) {
        this.setState({isProgress: true});

        await OPERATIVETRNACCT(this.props.userDetails, serviceType, this.props).then((response) => {
                let resArr = [];
                response.map((account) => {
                    resArr.push({
                        label: account.ACCT_CD + "-" + account.ACCT_TYPE_NAME,
                        value: account
                    });
                });
                this.setState({isProgress: false, accountArr: resArr});
            },
            (error) => {
                this.setState({isProgress: false});
                console.log("error", error);
            }
        );
    }

    async getAmtLabel(transType) {
        this.setState({isProgress: true});

        await GETAMTLABEL(this.props.userDetails, transType, this.props).then((response) => {
                this.setState({isProgress: false, actLabelList: response});
            },
            (error) => {
                this.setState({isProgress: false});
                console.log("error", error);
            }
        );
    }


    resetData(props) {
        this.setState({
            selectNicknameType: props.language.select_nickname,
            selectAcctType: props.language.select_from_account,
            selectToAcctType: props.language.select_to_acct,
            selectPaymentType: props.language.select_payment,
            ...initialVar
        });
    }

    async calculateVat() {
        if (this.state.selectFromActVal === -1) {
            this.setState({transferAmount: ""})
            Utility.alert(this.props.language.error_select_from_type, this.props.language.ok);
            return;
        } else if (this.state.transferAmount === "") {
            this.setState({error_transferAmount: this.props.language.errAmt});
            return;
        }
        const {selectFromActVal, transferAmount} = this.state;
        this.setState({isProgress: true});
        await CHARGEVATAMT(this.props.userDetails, this.state.stateVal === 0 ? "CBLOA" : "CBLTA", selectFromActVal.APP_INDICATOR,
            selectFromActVal.ACCT_UNMASK, transferAmount, this.props)
            .then((response) => {
                console.log("response", response);
                this.setState({
                    isProgress: false,
                    vat: response.VAT_AMT.toString(),
                    servicesCharge: response.CHARGE_AMT.toString(),
                    grandTotal: response.TOTAL_AMT.toString(),
                    CHARGE_AMT_LABEL: unicodeToChar(response.CHARGE_AMT_LABEL),
                    VAT_AMT_LABEL: unicodeToChar(response.VAT_AMT_LABEL)
                })
            }, (error) => {
                this.setState({isProgress: false});
                console.log("error", error);
            });
    }

    getNickList() {
        this.setState({isProgress: true});
        GETBENF(this.props.userDetails, "I", this.props).then(response => {
            console.log("response======>", response);
            let arr = [];
            response.map((account) => {
                arr.push({label: account.NICK_NAME, value: account});
            })
            this.setState({
                isProgress: false,
                selectNickArr: arr
            });
        }).catch(error => {
            this.setState({isProgress: false});
            console.log("error", error);
        });
    }

    beneficiaryTransfer(language) {
        return (
            <View key={"beneficiaryTransfer"}>
                <View style={{flex: 1}}>
                    <Text style={[CommonStyle.labelStyle, {
                        color: themeStyle.THEME_COLOR,
                        marginStart: 10,
                        marginEnd: 10,
                        marginTop: 6,
                        marginBottom: 3
                    }]}>
                        {language.nick_name}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TouchableOpacity
                        onPress={() => this.openModal("nickName", language.selectNickType, this.state.selectNickArr, language)}>
                        <View style={CommonStyle.selectionBg}>
                            <Text style={[CommonStyle.midTextStyle, {
                                color: this.state.selectNicknameType === language.selectNickType ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                flex: 1
                            }]}>
                                {this.state.selectNicknameType}
                            </Text>
                            <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                   source={require("../../resources/images/ic_arrow_down.png")}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{
                    flexDirection: "row",
                    height: Utility.setHeight(50),
                    marginStart: 10,
                    alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={CommonStyle.textStyle}>
                        {language.to_account}
                    </Text>
                    <Text
                        style={CommonStyle.viewText}>{this.state.toAccount}</Text>
                </View>
            </View>)
    }

    getActDetails(language) {
        if (this.state.toAccount.length === 0) {
            this.setState({errorToAct: language.require_accnumber});
            return;
        }
        this.setState({isProgress: true});
        GETACCTBALDETAIL(this.state.toAccount, this.props).then(response => {
            console.log("response", response);
            this.setState({
                isProgress: false, account_holder_name: response.ACCOUNTNAME, otp_type: 0, accountRes: response
            });
        }).catch(error => {
            this.setState({isProgress: false, errorToAct: language.require_valid_actNumber});
            console.log("error", error);
        });
    }

    singleTransfer(language) {
        return (<View key={"singleTransfer"}>
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={CommonStyle.textStyle}>
                    {language.to_acct}
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
                    placeholder={language.et_placeholder}
                    onChangeText={text => this.setState({
                        errorToAct: "",
                        toAccount: Utility.input(text, "0123456789")
                    })}
                    value={this.state.toAccount}
                    multiline={false}
                    numberOfLines={1}
                    contextMenuHidden={true}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    keyboardType={"number-pad"}
                    onFocus={() => this.setState({focusAccount: true})}
                    onBlur={() => {
                        if (this.state.focusAccount) {
                            this.setState({focusAccount: false}, async () => {
                                await this.getActDetails(language);
                            });
                        }
                    }}
                    returnKeyType={"done"}
                />
            </View>
            {this.state.errorToAct !== "" ?
                <Text style={CommonStyle.errorStyle}>{this.state.errorToAct}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={CommonStyle.textStyle}>
                    {language.account_holder_name}
                </Text>
                <Text
                    style={CommonStyle.viewText}>{this.state.account_holder_name}</Text>
            </View>

        </View>)
    }

    accountNoOption(language) {
        return (
            <View>
                <View style={{flex: 1}}>
                    {this.state.stateVal === 1 ?
                        <View>
                            <View style={{
                                flexDirection: "row",
                                height: Utility.setHeight(50),
                                alignItems: "center",
                                marginTop: 10,
                                marginBottom: 10
                            }}>
                                <RadioForm
                                    radio_props={language.transferCity_props}
                                    initial={this.state.cityTransVal}
                                    buttonSize={9}
                                    selectedButtonColor={themeStyle.THEME_COLOR}
                                    formHorizontal={false}
                                    labelHorizontal={true}
                                    borderWidth={1}
                                    buttonColor={themeStyle.GRAY_COLOR}
                                    labelColor={themeStyle.BLACK}
                                    labelStyle={[CommonStyle.textStyle, {marginRight: 10}]}
                                    style={{marginStart: 5, marginTop: 10, marginLeft: Utility.setWidth(20)}}
                                    animation={true}
                                    onPress={(value) => {
                                        if (this.state.cityTransVal !== value) {
                                            this.resetData(this.props);
                                        }
                                        this.setState({cityTransVal: value});
                                    }}
                                />
                            </View>
                            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                        </View> : null}
                    <Text style={[CommonStyle.labelStyle, {
                        color: themeStyle.THEME_COLOR,
                        marginStart: 10,
                        marginEnd: 10,
                        marginTop: 6,
                        marginBottom: 4
                    }]}>
                        {language.fromAccount}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>

                    <TouchableOpacity
                        onPress={() => this.openModal("fromAccountType", language.select_from_account, this.state.accountArr, language)}>
                        <View style={CommonStyle.selectionBg}>
                            <Text style={[CommonStyle.midTextStyle, {
                                color: this.state.selectAcctType === language.select_from_account ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                flex: 1
                            }]}>
                                {this.state.selectAcctType}
                            </Text>
                            <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                   source={require("../../resources/images/ic_arrow_down.png")}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={CommonStyle.textStyle}>
                        {language.available_bal}
                    </Text>
                    <Text
                        style={CommonStyle.viewText}>{this.state.fromBalance}</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={CommonStyle.textStyle}>
                        {language.currency}
                    </Text>
                    <Text
                        style={CommonStyle.viewText}>{this.state.currency}</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                {this.state.stateVal === 0 ?
                    <View>
                        <View style={{flex: 1}}>
                            {<Text style={[CommonStyle.labelStyle, {
                                color: themeStyle.THEME_COLOR,
                                marginStart: 10,
                                marginEnd: 10,
                                marginTop: 6,
                                marginBottom: 4
                            }]}>
                                {language.to_acct}
                                <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                            </Text>
                            }
                            <TouchableOpacity
                                onPress={() => this.openModal("toAccountType", language.select_from_account, this.state.accountArr, language)}>
                                <View style={CommonStyle.selectionBg}>
                                    <Text style={[CommonStyle.midTextStyle, {
                                        color: this.state.selectToAcctType === language.select_to_acct ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                        flex: 1
                                    }]}>
                                        {this.state.selectToAcctType}
                                    </Text>
                                    <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                           source={require("../../resources/images/ic_arrow_down.png")}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            flexDirection: "row",
                            height: Utility.setHeight(50),
                            marginStart: 10,
                            alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.available_bal}
                            </Text>
                            <Text
                                style={CommonStyle.viewText}>{this.state.toBalance}</Text>
                        </View>
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                        <View style={{
                            flexDirection: "row",
                            height: Utility.setHeight(50),
                            marginStart: 10,
                            alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={CommonStyle.textStyle}>
                                {language.currency}
                            </Text>
                            <Text
                                style={CommonStyle.viewText}>{this.state.toCurrency}</Text>
                        </View>
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                    </View> :
                    this.state.cityTransVal === 0 ? this.singleTransfer(language) : this.beneficiaryTransfer(language)
                }
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                {this.state.actLabelList.length > 0 ?
                    <FlatList horizontal={true}
                              data={this.state.actLabelList}
                              keyExtractor={((item, index) => index + "")}
                              renderItem={({item}) =>
                                  <TouchableOpacity
                                      onPress={this.getListViewItem.bind(this, item)}>
                                      <View style={{
                                          marginRight: 10,
                                          marginLeft: 10,
                                          marginTop: 10,
                                          borderRadius: 3,
                                          padding: 7,
                                          flexDirection: 'row',
                                          justifyContent: "space-around",
                                          backgroundColor: themeStyle.THEME_COLOR
                                      }}>
                                          <Text
                                              style={[CommonStyle.textStyle, {color: themeStyle.WHITE}]}
                                          >{item.AMOUNT_LABEL}</Text>
                                      </View>
                                  </TouchableOpacity>
                              }
                    /> : null}
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle, {flex: 1}]}>
                        {language.transfer_amount}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TextInput
                        ref={(ref) => this.transferAmountRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            marginLeft: 10
                        }]}
                        placeholder={"0.00"}
                        onChangeText={text => this.setState({
                            error_transferAmount: "",
                            CHARGE_AMT_LABEL: "",
                            VAT_AMT_LABEL: "",
                            servicesCharge: "",
                            vat: "",
                            transferAmount: Utility.input(text, "0123456789.")
                        })}
                        value={this.state.transferAmount}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        returnKeyType={"done"}
                        onFocus={() => this.setState({focusAmount: true})}
                        onBlur={() => {
                            if (this.state.focusAmount) {
                                this.setState({focusAmount: false}, async () => {
                                    await this.calculateVat();
                                });
                            }
                        }}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    />
                </View>
                {this.state.error_transferAmount !== "" ?
                    <Text style={CommonStyle.errorStyle
                    }>{this.state.error_transferAmount}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle, {flex: 1}]}>
                        {language.services_charge}
                    </Text>
                    <Text
                        style={CommonStyle.viewText}>{this.state.servicesCharge}</Text>
                </View>
                {this.state.CHARGE_AMT_LABEL !== "" ?
                    <Text style={CommonStyle.errorStyle
                    }>{this.state.CHARGE_AMT_LABEL}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle, {flex: 1}]}>
                        {language.vat}
                    </Text>
                    <Text
                        style={CommonStyle.viewText}>{this.state.vat}</Text>
                </View>
                {this.state.VAT_AMT_LABEL !== "" ?
                    <Text style={CommonStyle.errorStyle
                    }>{this.state.VAT_AMT_LABEL}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={CommonStyle.textStyle}>
                        {language.grand_total}
                    </Text>
                    <Text
                        style={CommonStyle.viewText}>{this.state.grandTotal}</Text>
                </View>
                {this.state.error_grandTotal !== "" ?
                    <Text style={CommonStyle.errorStyle
                    }>{this.state.error_grandTotal}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.remarks}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TextInput
                        ref={(ref) => this.remarksRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        onChangeText={text => this.setState({
                            error_remarks: "",
                            remarks: text
                        })}
                        value={this.state.remarks}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={30}/>
                </View>
                {this.state.error_remarks !== "" ?
                    <Text style={CommonStyle.errorStyle
                    }>{this.state.error_remarks}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                {this.state.stateVal === 0 || this.state.cityTransVal === 1 ? <View><View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.TransferType}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>

                    <RadioForm
                        radio_props={language.transfer_pay_props}
                        initial={this.state.transfer_type}
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
                            this.setState({
                                transfer_type: value, paymentDate: "",
                                selectPaymentType: language.select_payment, numberPayment: ""
                            });
                        }}
                    />
                </View>

                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/></View> : null}
                {this.state.transfer_type === 1 ?
                    <View>
                        <View style={{
                            flexDirection: "row",
                            marginStart: 10,
                            height: Utility.setHeight(50),
                            alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.payment_date}
                                <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                            </Text>
                            <TouchableOpacity style={{
                                marginLeft: 10,
                                flex: 1,
                            }} onPress={() => this.showDatepicker(0)}>
                                <TextInput
                                    selectionColor={themeStyle.THEME_COLOR}
                                    style={[CommonStyle.textStyle, {
                                        alignItems: "flex-end",
                                        textAlign: 'right',
                                    }]}
                                    placeholder={language.select_payment_date}
                                    editable={false}
                                    value={this.state.paymentDate}
                                    multiline={false}
                                    numberOfLines={1}
                                    contextMenuHidden={true}
                                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                    autoCorrect={false}/>
                            </TouchableOpacity>
                        </View>
                        {this.state.errorPaymentDate !== "" ?
                            <Text style={{
                                marginLeft: 5,
                                marginRight: 10,
                                color: themeStyle.THEME_COLOR,
                                fontSize: FontSize.getSize(11),
                                fontFamily: fontStyle.RobotoRegular,
                                alignSelf: "flex-end",
                                marginBottom: 10,
                            }}>{this.state.errorPaymentDate}</Text> : null}
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                        <View style={{flex: 1}}>
                            {<Text style={[CommonStyle.labelStyle, {
                                color: themeStyle.THEME_COLOR,
                                marginStart: 10,
                                marginEnd: 10,
                                marginTop: 6,
                                marginBottom: 4
                            }]}>
                                {language.Frequency}
                                <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                            </Text>
                            }
                            <TouchableOpacity
                                onPress={() => this.openModal("paymentType", language.select_payment, language.payment_array, language)}>
                                <View style={CommonStyle.selectionBg}>
                                    <Text style={[CommonStyle.midTextStyle, {
                                        color: this.state.selectPaymentType === language.select_bank_type ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                        flex: 1
                                    }]}>
                                        {this.state.selectPaymentType}
                                    </Text>
                                    <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                           source={require("../../resources/images/ic_arrow_down.png")}/>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                        <View style={{
                            flexDirection: "row",
                            height: Utility.setHeight(50),
                            marginStart: 10,
                            alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.number_of_payment}
                            </Text>
                            <TextInput
                                ref={(ref) => this.transferAmountRef = ref}
                                selectionColor={themeStyle.THEME_COLOR}
                                style={[CommonStyle.textStyle, {
                                    alignItems: "flex-end",
                                    textAlign: 'right',
                                    flex: 1,
                                    marginLeft: 10
                                }]}
                                placeholder={language.et_placeholder}
                                onChangeText={text => this.setState({
                                    error_numberPayment: "",
                                    numberPayment: Utility.userInput(text)
                                })}
                                value={this.state.numberPayment}
                                multiline={false}
                                numberOfLines={1}
                                contextMenuHidden={true}
                                keyboardType={"number-pad"}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}
                                maxLength={13}/>
                        </View>
                        {this.state.error_numberPayment !== "" ?
                            <Text style={CommonStyle.errorStyle}>{this.state.error_numberPayment}</Text> : null}
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                    </View>
                    : null
                }
                {this.state.stateVal === 1 ? <View>
                    <View style={{
                        flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                        marginEnd: 10
                    }}>
                        <Text style={[CommonStyle.textStyle]}>
                            {language.otpType}
                            <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                        </Text>

                        <RadioForm
                            radio_props={this.state.selectFromActVal == null || this.state.selectFromActVal.EMAIL_ID === "" ?
                                language.otp_props_mobile : language.otp_props}
                            initial={this.state.otp_type}
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
                </View> : null}
                <Text style={CommonStyle.mark_mandatory}>*{language.mark_field_mandatory}</Text>
                <View style={{marginStart: 10, marginEnd: 10}}>
                    <Text style={CommonStyle.themeMidTextStyle}>{language.notes}</Text>
                    {this.state.stateVal === 0 ?
                        <View>
                            <Text style={CommonStyle.themeTextStyle}>{language.fund_transfer_note1}</Text>
                            <Text style={CommonStyle.themeTextStyle}>{language.fund_transfer_note2}</Text>
                        </View>
                        :
                        <View>
                            <Text style={CommonStyle.themeTextStyle}>{language.fund_transferCity_note1}</Text>
                            <Text style={CommonStyle.themeTextStyle}>{language.fund_transferCity_note2}</Text>
                        </View>
                    }
                    <Text style={CommonStyle.themeTextStyle}>{language.fund_transfer_note3}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.fund_transfer_note4}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.fund_transfer_note5}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.fund_transfer_note6}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.fund_transfer_note7}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.fund_transfer_note8}</Text>
                </View>
            </View>)
    }

    async changeCard(cardCode) {
        console.log("cardCode", cardCode);
        if (this.state.stateVal === cardCode) {
            return;
        }
        this.setState({
            stateVal: cardCode
        })
        this.resetData(this.props);
        if (cardCode === 1) {
            await this.getOwnAccounts("IFT_FUND_TRANSFER");
            await this.getAmtLabel("CBLTA");
            this.getNickList();
        } else if (cardCode === 0) {
            await this.getOwnAccounts("OWN_FUND_TRANSFER");
            await this.getAmtLabel("CBLOA");
        }

    }

    render() {
        let language = this.props.language;
        console.log("state value is this is", this.state.stateVal)
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={CommonStyle.toolbar}>
                    <TouchableOpacity
                        style={CommonStyle.toolbar_back_btn_touch}
                        onPress={() => this.backEvent()}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../../resources/images/ic_back_android.png") : require("../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text
                        style={CommonStyle.title}>{this.state.stateVal === 2 ? language.fund_transfer_own_account : this.state.stateVal === 4 ? language.fund_transfer_city_account : language.fund_transfer}</Text>
                    <TouchableOpacity onPress={() => Utility.logout(this.props.navigation, language)}
                                      style={{
                                          width: Utility.setWidth(35),
                                          height: Utility.setHeight(35),
                                          position: "absolute",
                                          right: Utility.setWidth(10),
                                      }}>
                        <Image resizeMode={"contain"} style={{
                            width: Utility.setWidth(30),
                            height: Utility.setHeight(30),
                        }}
                               source={require("../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                {this.state.stateVal === 2 || this.state.stateVal === 4 ? null :
                    <View style={[styles.headerLabel, {
                        marginTop: 10, marginStart: 10,
                        marginEnd: 10,
                    }]}>
                        <TouchableOpacity
                            onPress={() => this.changeCard(0)}
                            style={{
                                height: "100%",
                                alignItems: "center",
                                flex: 1,
                                justifyContent: "center",
                                borderBottomLeftRadius: this.state.stateVal === 1 ? 3 : 0,
                                borderTopLeftRadius: this.state.stateVal === 1 ? 3 : 0,
                                backgroundColor: this.state.stateVal === 0 ? themeStyle.THEME_COLOR : "#F4F4F4",
                            }}>
                            <Text style={[styles.langText, {
                                color: this.state.stateVal === 0 ? themeStyle.WHITE : themeStyle.BLACK,
                                fontFamily: fontStyle.RobotoMedium,
                                fontSize: FontSize.getSize(11),
                            }]}>{this.props.language.own_accountt}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.changeCard(1)}
                            style={{
                                height: "100%",
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                borderBottomRightRadius: this.state.stateVal === 1 ? 5 : 0,
                                borderTopRightRadius: this.state.stateVal === 1 ? 5 : 0,
                                backgroundColor: this.state.stateVal === 1 ? themeStyle.THEME_COLOR : "#F4F4F4",
                            }}>
                            <Text style={[styles.langText, {
                                color: this.state.stateVal === 1 ? themeStyle.WHITE : themeStyle.BLACK,
                                fontFamily: fontStyle.RobotoMedium,
                                fontSize: FontSize.getSize(11),
                            }]}>{this.props.language.city_accountt}</Text>
                        </TouchableOpacity>
                    </View>
                }
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        {this.accountNoOption(language)}
                        <View style={{
                            flexDirection: "row",
                            marginStart: Utility.setWidth(10),
                            marginRight: Utility.setWidth(10),
                            marginTop: Utility.setHeight(20)
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
                                              onPress={() => this.onSubmit(language)}>
                                <View style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: Utility.setHeight(46),
                                    borderRadius: Utility.setHeight(23),
                                    backgroundColor: themeStyle.THEME_COLOR
                                }}>
                                    <Text
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{this.state.stateVal === 2 || this.state.stateVal === 4 ? language.transfer : language.next}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({modalVisible: false})
                    }}>
                    <View style={CommonStyle.centeredView}>
                        <View style={CommonStyle.modalView}>
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
                {this.state.show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={this.state.dateVal}
                        minimumDate={new Date()}
                        mode={this.state.mode}
                        is24Hour={false}
                        display="default"
                        onChange={this.onChange}
                    />
                )}
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
        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.transfer
        });
        await this.getOwnAccounts("OWN_FUND_TRANSFER");
        await this.getAmtLabel("CBLOA");
    }

}

const styles =
    {
        headerLabel: {
            flexDirection: "row",
            height: Utility.setHeight(40),
            borderRadius: 5,
            borderWidth: 1,
            borderColor: themeStyle.WHITE,
            overflow: "hidden"
        }
    }

const mapStateToProps = (state) => {
    return {
        userDetails: state.accountReducer.userDetails,
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(FundTransfer);
