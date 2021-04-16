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
import {GETBENF} from "../Requests/RequestBeneficiary";
import {CHARGEVATAMT, GETAMTLABEL, OPERATIVETRNACCT} from "../Requests/FundsTransferRequest";
import Config from "../../config/Config";
import {GETBALANCE, unicodeToChar} from "../Requests/CommonRequest";

let minTransfer = 50;

class TransferToBkash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: "",
            bkash_name: "",
            toAccount: "",
            error_accountNo: "",
            isProgress: false,
            selectNicknameType: props.language.select_nickname,
            selectAcctType: props.language.sel_act_card_no,
            selectPaymentType: props.language.select_payment,
            selectTypeVal: -1,
            selectFromActVal: -1,
            selectNickVal: -1,
            selectPaymentVal: -1,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            otp_type: 0,
            availableBalance: "",
            transferAmount: "",
            error_transferAmount: "",
            errorPaymentDate: "",
            servicesCharge: "",
            grandTotal: "",
            remarks: "",
            error_remarks: "",
            paymentDate: "",
            mode: "date",
            dateVal: new Date(),
            numberPayment: "",
            error_numberPayment: "",
            error_otp: "",
            otp: "",
            otpType: 0,
            transferType: 0,
            show:false,
            selectNickArr: [],
            accountArr: [],
            actLabelList: [],
            labelRes: null,
            fromHolderName: "",
            focusAmount: false,
            error_grandTotal: ""
        }
    }

    showDatepicker = (id) => {
        this.setState({errorPaymentDate: "", currentSelection: id, show: true, mode: "date"});
    };

    backEvent() {
        this.props.navigation.goBack(null);
    }

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

    openModal(option, title, data, language) {
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

    getListViewItem = (item) => {
        this.setState({error_transferAmount: "", transferAmount: item.AMOUNT_LABEL}, async () => {
            await this.calculateVat();
        });
    }

    async calculateVat() {
        if (this.state.selectFromActVal === -1) {
            this.setState({transferAmount: ""})
            Utility.alert(this.props.language.error_select_from_type, this.props.language.ok);
            return;
        } else if (this.hasError()) {
            return;
        }
        const {selectFromActVal, transferAmount} = this.state;
        this.setState({isProgress: true});
        await CHARGEVATAMT(this.props.userDetails, "BKASH", selectFromActVal.APP_INDICATOR,
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
                });
                if (response.TOTAL_AMT > parseFloat(this.state.availableBalance)) {
                    this.setState({
                        error_grandTotal: this.props.language.error_grandTotal_more_balance,
                    });
                }
            }, (error) => {
                this.setState({isProgress: false});
                console.log("error", error);
            });
    }

    resetVal(){
        this.setState({
            transferAmount: "",
            error_transferAmount: "",
            servicesCharge: "",
            vat:"",
            grandTotal: "",
            error_grandTotal: "",
        });
    }

    async onSelectItem(item) {
        const {modelSelection} = this.state;
        if (modelSelection === "nickName") {
            console.log("item", item);
            this.setState({
                selectNicknameType: item.label, selectNickVal: item.value,
                toAccount: item.value.TO_ACCT_NO, bkash_name: item.value.NICK_NAME, modalVisible: false
            })
        } else if (modelSelection === "FromAccount") {
            this.setState({
                selectAcctType: item.label, selectFromActVal: item.value,
                modalVisible: false
            },()=>this.resetVal())
            await this.getBalance(item.value);
        } else if (modelSelection === "paymentType") {
            this.setState({selectPaymentType: item.label, selectPaymentVal: item.value, modalVisible: false})
        }
    }

    hasError() {
        const {transferAmount, availableBalance, grandTotal, selectFromActVal} = this.state;
        let minAmount = selectFromActVal.ACCT_CARD_FLAG === "A" ? 50 : 500;
        let maxAmount = selectFromActVal.ACCT_CARD_FLAG === "A" ? 30000 : parseFloat(availableBalance) / 2 > 60000 ? 60000 : parseFloat(availableBalance) / 2;

        let language = this.props.language;
        if (transferAmount === "") {
            this.setState({error_transferAmount: language.errTransferAmt});
            return true;
        } else if (parseFloat(transferAmount) < minAmount) {
            this.setState({
                error_transferAmount: language.errTransferAmt + minAmount,
            });
            return true;
        } else if (parseFloat(transferAmount) > maxAmount) {
            this.setState({
                error_transferAmount: language.errMaxTransferAmt + maxAmount,
            });
            return true;
        } else if (parseFloat(grandTotal) > parseFloat(availableBalance)) {
            this.setState({
                error_grandTotal: language.error_grandTotal_more_balance,
            });
            return true;
        }
        return false;
    }

    async onSubmit(language, navigation) {
        if (this.state.selectNicknameType === language.select_nickname) {
            Utility.alert(language.error_select_nickname, language.ok);
        } else if (this.state.selectAcctType === language.sel_act_card_no) {
            Utility.alert(language.error_select_from_type, language.ok);
        } else if (this.hasError()) {
            //has error
        } else if (this.state.remarks === "") {
            this.setState({error_remarks: language.errRemarks});
        } else if (this.state.transferType === 1) {
            if (this.state.paymentDate === "") {
                this.setState({errorPaymentDate: language.error_payment_date});
            } else if (this.state.selectPaymentType === language.select_payment) {
                Utility.alert(language.select_payment, language.ok);
            } else if (this.state.numberPayment === "") {
                this.setState({error_numberPayment: language.error_numberPayment});
            } else {
                this.processRequest(language)
            }
        } else {
            console.log("else part")
            this.processRequest(language)
        }
    }

    async getBalance(account) {
        this.setState({isProgress: true});
        let accountNo = account.ACCT_UNMASK;
        GETBALANCE(accountNo, account.APP_INDICATOR, account.APP_CUSTOMER_ID, this.props).then(response => {
            console.log("response", response);
            this.setState({
                isProgress: false,
                currency: response.CURRENCYCODE,
                fromHolderName: response.ACCOUNTNAME,
                availableBalance: response.hasOwnProperty("AVAILBALANCE") ? response.AVAILBALANCE : response.BALANCE
            })

        }).catch(error => {
            this.setState({isProgress: false});
            console.log("error", error);
        });

    }

    processRequest(language) {
        let tempArr = [];
        let userDetails = this.props.userDetails;
        let request = {
            APP_CUSTOMER_ID: this.state.selectFromActVal.APP_CUSTOMER_ID,
            CUSTOMER_ID: userDetails.CUSTOMER_ID,
            USER_ID: userDetails.USER_ID,
            ACTIVITY_CD: userDetails.ACTIVITY_CD,
            TO_ACCT_NO: this.state.toAccount,
            SERVICE_CHARGE: this.state.servicesCharge,
            ACTION: "FUNDTRF",
            TRN_AMT: this.state.transferAmount,
            REMARKS: this.state.remarks,
            ACCT_NO: this.state.selectFromActVal.ACCT_UNMASK,
            TO_ACCT_NM: "",
            FROM_ACCT_NM: this.state.fromHolderName,
            NICK_NAME: this.state.selectNickVal.NICK_NAME,
            REQ_FLAG: "R",
            REQ_TYPE: "B",
            TRN_TYPE: "BKASH",
            REF_NO: this.state.selectNickVal.REF_NO,
            TO_MOBILE_NO: this.state.selectNickVal.TO_CONTACT_NO,
            BEN_TYPE: "W",
            APP_INDICATOR: this.state.selectFromActVal.APP_INDICATOR,
            TO_EMAIL_ID: this.state.selectNickVal.TO_EMAIL_ID,
            VAT_CHARGE: this.state.vat,
            TO_IFSCODE: this.state.selectNickVal.TO_IFSCODE,
            OTP_TYPE: this.state.otp_type === 0 ? "S" : "E",
            FROM_CURRENCY_CODE: this.state.selectFromActVal.CURRENCY_CODE,
            TO_CURRENCY_CODE: this.state.selectNickVal.CURRENCY,
            TO_ACCT_CARD_FLAG: this.state.selectNickVal.ACCT_TYPE === "ACCOUNT" ? "A" : "C",
            ...Config.commonReq
        }
        console.log("request-", request);

        tempArr.push(
            {
                key: language.fromAccount,
                value: this.state.selectFromActVal.ACCT_UNMASK + "-" + this.state.selectFromActVal.ACCT_TYPE_NAME
            },
            {
                key: language.to_account,
                value: this.state.toAccount
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


        this.props.navigation.navigate("TransferConfirm", {
            routeVal: [{name: 'Transfer'}, {name: 'TransferToBkash'}],
            routeIndex: 1,
            title: language.transfer_bkash,
            transferArray: tempArr,
            screenName: "Otp",
            transRequest: request
        });
    }


    getNickList() {
        this.setState({isProgress: true});
        GETBENF(this.props.userDetails, "W", this.props).then(response => {
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

    async getOwnAccounts(serviceType) {
        this.setState({isProgress: true});

        await OPERATIVETRNACCT(this.props.userDetails, serviceType, this.props).then((response) => {
                let resArr = [];
                if (response.length === 0) {
                    Utility.alertWithBack(this.props.language.ok, this.props.language.debit_card_empty_message,
                        this.props.navigation);
                    return;
                }
                response.map((account) => {
                    resArr.push({
                        label: account.ACCT_CD + "-" + account.ACCT_TYPE_NAME,
                        value: account
                    });
                });
                console.log("resArr", resArr);
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
                this.setState({
                    isProgress: false, actLabelList: response.AMOUNTLIST,
                    labelRes: response
                });
            },
            (error) => {
                this.setState({isProgress: false});
                console.log("error", error);
            }
        );
    }


    transferToBkash(language) {
        return (
            <View>
                <View style={{flex: 1}}>
                    <Text style={[CommonStyle.labelStyle, {
                        color: themeStyle.THEME_COLOR,
                        marginStart: 10,
                        marginEnd: 10,
                        marginTop: 6,
                    }]}>
                        {language.nick_name}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TouchableOpacity
                        onPress={() => this.openModal("nickName", language.selectNickType, this.state.selectNickArr, language)}>
                        <View style={CommonStyle.selectionBg}>
                            <Text style={[CommonStyle.midTextStyle, {
                                color: this.state.selectNicknameType === language.select_nickname ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
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
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle, {flex: 1}]}>
                        {language.bkash_account}
                    </Text>

                    <Text style={[CommonStyle.textStyle]}>
                        {this.state.toAccount}
                    </Text>
                </View>
                {this.state.error_accountNo !== "" ?
                    <Text style={CommonStyle.errorStyle
                    }>{this.state.error_accountNo}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle, {flex: 1}]}>
                        {language.bkash_name}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        onChangeText={text => this.setState({
                            bkash_name: Utility.userInput(text)
                        })}
                        value={this.state.bkash_name}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        editable={false}
                        autoCorrect={false}
                    />
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{flex: 1}}>
                    {<Text style={[CommonStyle.labelStyle, {
                        color: themeStyle.THEME_COLOR,
                        marginStart: 10,
                        marginEnd: 10,
                        marginTop: 6,
                        marginBottom: 4
                    }]}>
                        {language.from_account_card}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    }
                    <TouchableOpacity
                        onPress={() => this.openModal("FromAccount", language.sel_act_card_no, this.state.accountArr, language)}>
                        <View style={CommonStyle.selectionBg}>
                            <Text style={[CommonStyle.midTextStyle, {
                                color: this.state.selectAcctType === language.sel_act_card_no ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
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
                    <Text style={[CommonStyle.textStyle]}>
                        {language.available_bal}
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.availableBalance}</Text>
                    <Text style={{paddingLeft: 5}}>BDT</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <FlatList horizontal={true}
                          data={this.state.actLabelList}
                          keyExtractor={((item, index) => index + "")}
                          renderItem={({item}) =>
                              <TouchableOpacity onPress={this.getListViewItem.bind(this, item)}>
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
                                      <Text style={[CommonStyle.textStyle, {color: themeStyle.WHITE}]}
                                      >{item.AMOUNT_LABEL}</Text>
                                  </View>
                              </TouchableOpacity>
                          }
                />
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.transfer_amount}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
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
                        placeholder={"00.00"}
                        onChangeText={text => this.setState({
                            error_transferAmount: "",
                            error_grandTotal: "",
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
                        maxLength={13}/>
                    <Text style={{paddingLeft: 5}}>BDT</Text>
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
                    <Text style={CommonStyle.viewText}>{this.state.servicesCharge}</Text>
                    <Text style={{paddingLeft: 5}}>BDT</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle, {flex: 1}]}>
                        {language.vat}
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.vat}</Text>
                    <Text style={{paddingLeft: 5}}>BDT</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.grand_total}
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.grandTotal}</Text>
                    <Text style={{paddingLeft: 5}}>BDT</Text>
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
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.et_placeholder}
                        onChangeText={text => this.setState({
                            error_remarks: "",
                            remarks: Utility.userInput(text)
                        })}
                        value={this.state.remarks}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={13}/>
                </View>
                {this.state.error_remarks !== "" ?
                    <Text style={CommonStyle.errorStyle
                    }>{this.state.error_remarks}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.TransferType}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>
                    <RadioForm
                        radio_props={language.transfer_pay_props}
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
                            this.setState({transferType: value});
                        }}
                    />
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                {/*{ language.transfer_pay_props[this.state.transferType].value === 1 ?*/}
                {this.state.transferType === 1 ?
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
                                        color: this.state.selectPaymentType === language.select_payment ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
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
                            flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.number_of_payment}
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
                            <Text style={CommonStyle.errorStyle
                            }>{this.state.error_numberPayment}</Text> : null}
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                    </View>
                    : null
                }

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
                            this.setState({otpType: value});
                        }}
                    />
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <Text style={CommonStyle.mark_mandatory}>*{language.mark_field_mandatory}</Text>
                <View style={{marginStart: 10, marginEnd: 10}}>
                    <Text style={CommonStyle.themeMidTextStyle}>{language.notes}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.transferTo_bkash_note1}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.transferTo_bkash_note2}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.transferTo_bkash_note3}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.transferTo_bkash_note4}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.transferTo_bkash_note5}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.transferTo_bkash_note6}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.transferTo_bkash_note7}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.transferTo_bkash_note8}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.transferTo_bkash_note9}</Text>
                </View>
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
                                   require("../../resources/images/ic_back_android.png") : require("../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.transfer_bkash}</Text>
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        {this.transferToBkash(language)}
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
                                              onPress={() => this.onSubmit(language, this.props.navigation)}>
                                <View style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: Utility.setHeight(46),
                                    borderRadius: Utility.setHeight(23),
                                    backgroundColor: themeStyle.THEME_COLOR
                                }}>
                                    <Text
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{language.next}</Text>
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
                                      data={this.state.modalData}
                                      keyExtractor={((item, index) => index + "")}
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
                        value={new Date()}
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

        await this.getNickList();
        await this.getOwnAccounts("BKASH");
        await this.getAmtLabel("BKASH");
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
}


const mapStateToProps = (state) => {
    return {
        userDetails: state.accountReducer.userDetails,
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(TransferToBkash);
