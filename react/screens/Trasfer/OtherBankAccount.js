import {connect} from "react-redux";
import {
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Alert,
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
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import BeneficiaryOtherBank from "./Beneficiary/BeneficiaryOtherBank";
import StorageClass from "../../utilize/StorageClass";
import Config from "../../config/Config";
import {AddBeneficiary, GETACCTBALDETAIL, GETBANKDETAILS, GETBENF} from "../Requests/RequestBeneficiary";
import {CHARGEVATAMT, GETAMTLABEL, OPERATIVETRNACCT} from "../Requests/FundsTransferRequest";
import {GETBALANCE, unicodeToChar} from "../Requests/CommonRequest";

class OtherBankAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: "",
            accountNo: "",
            error_nickname: "",
            error_accountNo: "",
            isProgress: false,
            selectNicknameType: props.language.select_nickname,
            selectAcctType: props.language.select_acct,
            selectPaymentType: props.language.select_payment,
            selectAccountType: props.language.selectActType,
            selectBankType: props.language.select_bank_type,
            selectDistrictType: props.language.select_district_type,
            selectBranchType: props.language.select_branch_type,
            selectNickVal: -1,
            selectAccountTypeVal: -1,
            selectFromActVal: -1,
            selectBankVal: -1,
            selectBranchVal: -1,
            selectDistrictVal: -1,
            selectTypeVal: -1,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            otp_type: 0,
            transferModeType: 0,
            transferType: 0,
            availableBalance: "",
            transferAmount: "",
            errorTransferAmount: "",
            servicesCharge: "",
            errorServicesCharge: "",
            grandTotal: "",
            remarks: "",
            error_remarks: "",
            bankName: "",
            districtName: "",
            accountType: "",
            fromHolderName: "",
            branchName: "",
            numberPayment: "",
            paymentDate: "",
            errorPaymentDate: "",
            mode: "date",
            dateVal: new Date(),
            selected: false,
            stageVal: 0,
            transferMode: false,
            transferBEFTMode: false,
            accountDetails: "",
            type_act: "",
            account_holder_name: "",
            currency: "",
            cardCode: 0,
            screenSwitcher: false,
            error_numberPayment: "",
            toAccount: "105010074",
            actLabelList: [],
            accountArr: [],
            selectNickArr:[],
            focusAmount: false,
            errorToAccount: ""
        }
    }


    backEvent() {
        this.props.navigation.goBack(null)
    }

    async changeCard(cardCode) {
        if (cardCode === 1) {
            this.getNickList();
        }
        this.setState({
            cardCode: cardCode
        })
    }

    showDatepicker = (id) => {
        console.log("click");
        this.setState({errorPaymentDate: "", currentSelection: id, show: true, mode: "date"});
    };

    onChange = (event, selectedDate) => {
        if (event.type !== "dismissed" && selectedDate !== undefined) {
            console.log("selectedDate-", selectedDate);
            let currentDate = selectedDate === "" ? new Date() : selectedDate;
            console.log("currentDate get date ", currentDate.getDate() + 1)
            currentDate = moment(currentDate).format("DD-MMM-YYYY");
            this.setState({dateVal: selectedDate, paymentDate: currentDate, show: false});
        } else {
            this.setState({show: false});
        }
    };

    openModal(option, title, data, language) {
        console.log("data", data);
        if (data.length > 0) {
            this.setState({
                modelSelection: option,
                modalTitle: title,
                modalData: data, modalVisible: true, selected: false
            });
        } else {
            Utility.alert(language.noRecord, language.ok);
        }
    }


    async onSelectItem(item) {
        const {modelSelection} = this.state;
        if (modelSelection === "nickNameType") {
            this.setState({selectNicknameType: item.label, selectNickVal: item.value, modalVisible: false})
           // this.alertToNavigate();
        } else if (modelSelection === "accountType") {
            this.setState({selectAcctType: item.label, selectFromActVal: item.value, modalVisible: false})
            await this.getBalance(item.value);
        } else if (modelSelection === "paymentType") {
            this.setState({selectPaymentType: item.label, modalVisible: false});
        } else if (modelSelection === "selectAccountType") {
            this.setState({
                selectAccountType: item.label,
                selectAccountTypeVal: item.value,
                selectBankType: this.props.language.select_bank_type,
                selectDistrictType: this.props.language.select_district_type,
                selectBranchType: this.props.language.select_branch_type,
                selectBankVal: -1,
                selectBranchVal: -1,
                selectDistrictVal: -1,
                modalVisible: false
            }, () => this.getBankName())
        } else if (modelSelection === "bankType") {
            this.setState({
                selectBankType: item.label, selectBankVal: item.details,
                selectBranchType: this.props.language.select_branch_type,
                selectBranchVal: -1,
                modalVisible: false
            }, async () => {
                await this.getDistrictName();
            })
        } else if (modelSelection === "district_type") {
            this.setState({
                selectDistrictType: item.label, selectDistrictVal: item.details,
                modalVisible: false
            }, async () => {
                await this.getBranchName()
            })
        } else if (modelSelection === "branch_type") {
            this.setState({selectBranchType: item.label, selectBranchVal: item.details, modalVisible: false})
        }
    }

  /*  alertToNavigate() {
        Alert.alert(
            Config.appName,
            this.props.language.update_beneficiary_alert,
            [
                {
                    text: this.props.language.yes_txt,
                    onPress: () => this.props.navigation.navigate("BeneficiaryOtherBank", {title: this.props.language.update_beneficiary})
                },
                {text: this.props.language.no_txt},
            ]
        );
    }*/

    async onSubmit(language, navigation) {
        if (this.state.cardCode === 0) {
            if (this.state.selectAcctType === language.select_acct) {
                Utility.alert(language.error_select_from_type, language.ok);
            } else if (this.state.transferAmount === "") {
                this.setState({errorTransferAmount: language.errTransferAmt})
            } else if (this.state.toAccount === "") {
                this.setState({errorToAccount: language.et_act_card})
            } else if (this.state.selectBankType === language.select_bank_type) {
                Utility.alert(language.error_select_bank_name, language.ok);
            } else if (this.state.selectAccountTypeVal === 0 && this.state.selectDistrictType === language.select_district_type) {
                Utility.alert(language.error_select_district_name, language.ok);
            } else if (this.state.selectAccountTypeVal === 0 && this.state.selectBranchType === language.select_branch_type) {
                Utility.alert(language.error_select_branch_name, language.ok);
            } else if (this.state.remarks === "") {
                this.setState({error_remarks: language.errRemarks})
            } else {
                this.processRequest(0, language);
            }
        } else if (this.state.cardCode === 1) {
            if (this.state.selectAcctType === language.select_acct) {
                Utility.alert(language.error_select_from_type, language.ok);
            } else if (this.state.selectNicknameType === language.selectNickType) {
                Utility.alert(language.error_select_nickname, language.ok);
            } else if (this.state.transferAmount === "") {
                this.setState({errorTransferAmount: language.errTransferAmt})
            } else if (this.state.toAccount === "") {
                this.setState({errorToAccount: language.et_act_card})
            }
            else if (this.state.remarks === "") {
                this.setState({error_remarks: language.errRemarks})
            } else if (this.state.transferType === 1) {
                if (this.state.paymentDate === "") {
                    this.setState({errorPaymentDate: language.error_payment_date});
                } else if (this.state.selectPaymentType === language.select_payment) {
                    Utility.alert(language.select_payment, language.ok);
                } else if (this.state.numberPayment === "") {
                    this.setState({error_numberPayment: language.error_numberPayment})
                } else {
                    this.processRequest(1, language);
                }
            } else {
                this.processRequest(1, language);
            }
        }
    }

    processRequest(val, language) {
        let tempArr = [];
        let screenName = "";
        let userDetails = this.props.userDetails;
        let request = {
            APP_CUSTOMER_ID:this.state.selectFromActVal.APP_CUSTOMER_ID,
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
            NICK_NAME: val === 0 ? "" : this.state.cityTransVal === 0 ? "" : this.state.selectNickVal.NICK_NAME,
            REQ_FLAG: "R",
            REQ_TYPE: val === 0 ? "I" : "B",
            TRN_TYPE: "BEFTN",
            REF_NO: val === 1 ? this.state.selectNickVal.REF_NO : "",
            TO_MOBILE_NO: val === 0 ? "" : this.state.selectNickVal.TO_CONTACT_NO,
            BEN_TYPE: "O",
            APP_INDICATOR: this.state.selectFromActVal.APP_INDICATOR,
            TO_EMAIL_ID: val === 0 ? "" : this.state.selectNickVal.TO_EMAIL_ID,
            VAT_CHARGE: this.state.vat,
            TO_IFSCODE: val === 0 ? this.state.selectBranchVal.ROUTING_NO : this.state.selectNickVal.TO_IFSCODE,
            OTP_TYPE: this.state.otp_type === 0 ? "S" : "E",
            FROM_CURRENCY_CODE: this.state.selectFromActVal.CURRENCY_CODE,
            TO_CURRENCY_CODE: val === 0 ? "" : this.state.selectNickVal.CURRENCY,
            TO_ACCT_CARD_FLAG: val === 0 ? "" : this.state.selectNickVal.ACCT_TYPE === "ACCOUNT" ? "A" : "C",
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

        if (val === 0) {
            screenName = "SecurityVerification";

        } else if (val === 1) {
            screenName = "Otp";
        }
        this.props.navigation.navigate("TransferConfirm", {
            routeVal: [{name: 'Transfer'}, {name: 'OtherBankAccount'}],
            routeIndex: 1,
            title: language.other_bank_account_title,
            transferArray: tempArr,
            screenName: screenName,
            transRequest: request
        });
    }


    resetScreen = (flag) => {
        console.log("flag", flag);
        if (flag) {
            this.setState({
                nickname: "",
                account_holder_name: "",
                currency: "",
                accountNo: "",
                type_act: "",
                stageVal: 0,
                accountDetails: null,
            })
        }
    }

    getNickList() {
        this.setState({isProgress: true});
        GETBENF(this.props.userDetails, "O", this.props).then(response => {
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
        } else if (this.state.transferAmount === "") {
            this.setState({error_transferAmount: this.props.language.errAmt});
            return;
        }
        const {selectFromActVal, transferAmount} = this.state;
        this.setState({isProgress: true});
        await CHARGEVATAMT(this.props.userDetails, "BEFTN", selectFromActVal.APP_INDICATOR,
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

    async getBalance(account) {
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

    transferModeShow(text) {
        console.log("show", text)
        if (text.length !== 0) {
            this.setState({
                transferAmount: text,
                errorTransferAmount: "",
                transferBEFTMode: true
            })
        } else if (text > 100000 || text <= 100000) {
            console.log("text is this", text)
            this.setState({
                transferAmount: text,
                errorTransferAmount: "",
                transferMode: true
            })
        } else {
            this.setState({
                transferAmount: text,
                errorTransferAmount: "",
                transferBEFTMode: true
            })
        }
    }

    otherBankAccountView(language) {
        return (<View>
            <View style={{flex: 1}}>
                {<Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                    marginBottom: 4
                }]}>
                    {language.fromAccount}
                    <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                </Text>
                }
                <TouchableOpacity
                    onPress={() => this.openModal("accountType", language.select_from_account, this.state.accountArr, language)}>
                    <View style={CommonStyle.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectAcctType === language.select_acct ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selectAcctType}
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
                    <Text style={CommonStyle.textStyle}>
                        {language.available_bal}
                    </Text>
                    <Text
                        style={CommonStyle.viewText}>{this.state.availableBalance}</Text>
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
            {this.state.cardCode === 1 ?
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
                        onPress={() => this.openModal("nickNameType", language.selectNickType, this.state.selectNickArr, language)}>
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
                </View> : null}
            <FlatList horizontal={true}
                      keyExtractor={(item, index) => index + ""}
                      data={this.state.actLabelList}
                      renderItem={({item}) =>
                          <View>
                              <TouchableOpacity onPress={this.getListViewItem.bind(this, item)} style={{
                                  marginRight: 10,
                                  marginLeft: 10,
                                  marginTop: 10,
                                  marginBottom: 10,
                                  borderRadius: 3,
                                  padding: 7,
                                  flexDirection: 'row',
                                  justifyContent: "space-around",
                                  backgroundColor: themeStyle.THEME_COLOR
                              }}>
                                  <Text
                                      style={[CommonStyle.textStyle, {color: themeStyle.WHITE}]}>{item.AMOUNT_LABEL}</Text>
                              </TouchableOpacity>
                          </View>
                      }
            />


            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.transfer_amount}
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
                    placeholder={"00.00"}
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
            {this.state.errorTransferAmount !== "" ?
                <Text style={CommonStyle.errorStyle}>{this.state.errorTransferAmount}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

            <View>
                <Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                    marginBottom: 4
                }]}>
                    {language.account_Type}
                </Text>
                <TouchableOpacity
                    onPress={() => this.openModal("selectAccountType", language.selectActType, language.changeInArr, language)}>
                    <View style={CommonStyle.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectAccountType === language.selectActType ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selectAccountType}
                        </Text>
                        <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                               source={require("../../resources/images/ic_arrow_down.png")}/>
                    </View>
                </TouchableOpacity>
            </View>


            <View style={{flexDirection: "row", marginStart: 10, marginEnd: 10}}>
                <Text style={[CommonStyle.textStyle, {marginTop: 10}]}>
                    {language.transfer_mode}
                    <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                </Text>
                <RadioForm
                    radio_props={this.state.selectAccountTypeVal === 1 ? language.npsb_bank_props : language.other_bank_props}
                    initial={this.state.transferModeType}
                    buttonSize={9}
                    selectedButtonColor={themeStyle.THEME_COLOR}
                    formHorizontal={false}
                    labelHorizontal={true}
                    borderWidth={1}
                    borderColor={themeStyle.PLACEHOLDER_COLOR}
                    buttonColor={themeStyle.GRAY_COLOR}
                    labelColor={themeStyle.PLACEHOLDER_COLOR}
                    labelStyle={[CommonStyle.textStyle, {color: this.state.transferBEFTMode ? themeStyle.BLACK : themeStyle.PLACEHOLDER_COLOR}]}
                    style={{marginStart: 15, marginTop: 10, marginBottom: 10}}
                    animation={true}
                    onPress={(value) => {
                        this.setState({transferModeType: value});
                    }}
                />
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle, {flex: 1}]}>
                    {language.to_account_card_number}
                </Text>
                <TextInput
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {
                        alignItems: "flex-end",
                        textAlign: 'right',
                        flex: 1,
                        marginLeft: 10
                    }]}
                    placeholder={""}
                    onChangeText={text => this.setState({
                        error_toAccount: "",
                        toAccount: Utility.input(text, "0123456789")
                    })}
                    value={this.state.toAccount}
                    multiline={false}
                    numberOfLines={1}
                    contextMenuHidden={true}
                    keyboardType={"number-pad"}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    maxLength={35}/>
            </View>
            {this.state.errorToAccount !== "" ?
                <Text style={CommonStyle.errorStyle}>{this.state.errorToAccount}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            {this.state.cardCode === 1 ? null
                :
                <>
                    <View style={{flex: 1}}>
                        {<Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.THEME_COLOR,
                            marginStart: 10,
                            marginEnd: 10,
                            marginTop: 6,
                            marginBottom: 4
                        }]}>
                            {language.type_bank}
                            <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                        </Text>
                        }
                        <TouchableOpacity disabled={this.state.selectAccountTypeVal === -1}
                                          onPress={() => this.openModal("bankType", language.select_bank_type, this.state.bankTypeArr, language)}>
                            <View style={CommonStyle.selectionBg}>
                                <Text style={[CommonStyle.midTextStyle, {
                                    color: this.state.selectBankType === language.select_bank_type ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                    flex: 1
                                }]}>
                                    {this.state.selectBankType}
                                </Text>
                                <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                       source={require("../../resources/images/ic_arrow_down.png")}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.THEME_COLOR,
                            marginStart: 10,
                            marginEnd: 10,
                            marginTop: 6,
                            marginBottom: 4
                        }]}>
                            {language.type_district}
                            <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                        </Text>
                        <TouchableOpacity disabled={this.state.selectBankVal === -1}
                                          onPress={() => this.openModal("district_type", language.select_district_type, this.state.districtTypeArr, language)}>
                            <View style={CommonStyle.selectionBg}>
                                <Text style={[CommonStyle.midTextStyle, {
                                    color: this.state.selectDistrictType === language.select_district_type ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                    flex: 1
                                }]}>
                                    {this.state.selectDistrictType}
                                </Text>
                                <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                       source={require("../../resources/images/ic_arrow_down.png")}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.THEME_COLOR,
                            marginStart: 10,
                            marginEnd: 10,
                            marginTop: 6,
                            marginBottom: 4
                        }]}>
                            {language.type_Branch}
                            <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                        </Text>
                        <TouchableOpacity disabled={this.state.selectDistrictVal === -1}
                                          onPress={() => this.openModal("branch_type", language.select_branch_name, this.state.branchTypeArr, language)}>
                            <View style={CommonStyle.selectionBg}>
                                <Text style={[CommonStyle.midTextStyle, {
                                    color: this.state.selectBranchType === language.select_branch_type ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                    flex: 1
                                }]}>
                                    {this.state.selectBranchType}
                                </Text>
                                <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                       source={require("../../resources/images/ic_arrow_down.png")}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </>

            }
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle, {flex: 1}]}>
                    {language.services_charge}
                </Text>
                <TextInput
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {
                        alignItems: "flex-end",
                        textAlign: 'right',
                        marginLeft: 10
                    }]}
                    placeholder={"00.00"}
                    onChangeText={text => this.setState({
                        errorServicesCharge: "",
                        servicesCharge: Utility.userInput(text)
                    })}
                    value={this.state.servicesCharge}
                    multiline={false}
                    numberOfLines={1}
                    contextMenuHidden={true}
                    keyboardType={"number-pad"}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    editable={false}
                    maxLength={13}/>
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle, {flex: 1}]}>
                    {language.vat}
                </Text>
                <TextInput
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {
                        alignItems: "flex-end",
                        textAlign: 'right',
                        marginLeft: 10
                    }]}
                    placeholder={"00.00"}
                    onChangeText={text => this.setState({
                        error_vat: "",
                        vat: Utility.userInput(text)
                    })}
                    value={this.state.vat}
                    multiline={false}
                    numberOfLines={1}
                    contextMenuHidden={true}
                    keyboardType={"number-pad"}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    editable={false}
                    maxLength={13}/>
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle, {flex: 1,}]}>
                    {language.grand_total}
                </Text>
                <TextInput
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {
                        alignItems: "flex-end",
                        textAlign: 'right',
                        marginLeft: 10
                    }]}
                    placeholder={"00.00"}
                    onChangeText={text => this.setState({
                        grandTotal: Utility.userInput(text)
                    })}
                    value={this.state.grandTotal}
                    multiline={false}
                    numberOfLines={1}
                    contextMenuHidden={true}
                    keyboardType={"number-pad"}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    editable={false}
                />
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.remarks}
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
                    maxLength={30}/>
            </View>
            {this.state.error_remarks !== "" ?
                <Text style={CommonStyle.errorStyle
                }>{this.state.error_remarks}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            {this.state.cardCode === 1 ?
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
                        initial={this.state.transferType}
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
                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                </View> : null}

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
            {/*                    <View style={{
                        flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                        marginEnd: 10
                    }}>
                        <Text style={[CommonStyle.textStyle]}>
                            {language.TransferType}
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
                            value={this.state.transferType}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}
                            editable={false}
                            maxLength={13}/>
                    </View>*/}
            {/*<View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>*/}

            {this.state.cardCode === 1 && this.state.transferType === 1 ?
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

            <Text style={CommonStyle.mark_mandatory}>*{language.mark_field_mandatory}</Text>

            <View style={{marginStart: 10, marginEnd: 10}}>
                <Text style={CommonStyle.themeMidTextStyle}>{language.notes}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.other_bankAccount_note1}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.other_bankAccount_note2}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.other_bankAccount_note3}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.other_bankAccount_note4}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.other_bankAccount_note5}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.other_bankAccount_note6}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.other_bankAccount_note7} </Text>
                <Text style={CommonStyle.themeTextStyle}>{language.other_bankAccount_note8}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.other_bankAccount_note9}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.other_bankAccount_note10}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.other_bankAccount_note11}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.other_bankAccount_note12}</Text>
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
                        onPress={() => this.props.navigation.goBack(null)}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../../resources/images/ic_back_android.png") : require("../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text
                        style={CommonStyle.title}>{this.state.stageVal === 0 ? language.other_bank_account_title : language.fund_transfer_bank}</Text>
                    <TouchableOpacity onPress={() => Utility.logout(this.props.navigation, language)}
                                      style={{
                                          width: Utility.setWidth(35),
                                          height: Utility.setHeight(35),
                                          position: "absolute",
                                          right: Utility.setWidth(10),
                                      }}
                    >
                        <Image resizeMode={"contain"} style={{
                            width: Utility.setWidth(30),
                            height: Utility.setHeight(30),
                        }}
                               source={require("../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                <View style={[styles.headerLabel, {
                    marginTop: 10, marginStart: 10,
                    marginEnd: 10,
                }]}>
                    <TouchableOpacity
                        onPress={() => this.changeCard(0)}
                        style={{
                            height: "100%",
                            alignItems: "center",
                            flex: 0.9,
                            justifyContent: "center",
                            borderBottomLeftRadius: this.state.cardCode === 1 ? 3 : 0,
                            borderTopLeftRadius: this.state.cardCode === 1 ? 3 : 0,
                            backgroundColor: this.state.cardCode === 0 ? themeStyle.THEME_COLOR : "#F4F4F4",
                        }}>
                        <Text style={[CommonStyle.midTextStyle, {
                            fontSize: FontSize.getSize(12),
                            color: this.state.cardCode === 0 ? themeStyle.WHITE : themeStyle.BLACK,
                        }]}>{this.props.language.single_transfer}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.changeCard(1)}
                        style={{
                            height: "100%",
                            flex: 1.1,
                            alignItems: "center",
                            justifyContent: "center",
                            borderBottomRightRadius: this.state.cardCode === 1 ? 5 : 0,
                            borderTopRightRadius: this.state.cardCode === 1 ? 5 : 0,
                            backgroundColor: this.state.cardCode === 1 ? themeStyle.THEME_COLOR : "#F4F4F4",
                        }}>
                        <Text style={[CommonStyle.midTextStyle, {
                            fontSize: FontSize.getSize(12),
                            color: this.state.cardCode === 1 ? themeStyle.WHITE : themeStyle.BLACK,
                        }]}>{this.props.language.transfer_from_beneficiary}</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        {this.otherBankAccountView(language)}

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

                            {this.state.modalData.length > 0 ?
                                <FlatList style={{backgroundColor: themeStyle.WHITE, width: "100%"}}
                                          data={this.state.modalData}
                                          keyExtractor={(item, index) => index + ""}
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
                                          ItemSeparatorComponent={this.renderSeparator}/> : null}
                        </View>
                    </View>
                </Modal>
                {this.state.show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date()}
                        mode={this.state.mode}
                        minimumDate={new Date()}
                        is24Hour={false}
                        display="default"
                        onChange={this.onChange}
                    />
                )}
                {
                    this.state.selected ? this.alertToNavigate() : null
                }
                <BusyIndicator visible={this.state.isProgress}/>
            </View>
        )
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

    async componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.THEME_COLOR);
                StatusBar.setBarStyle("light-content");
            });
        }

        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.more
        });

        await this.getOwnAccounts("FROMACCOUNTS");
        await this.getAmtLabel("BEFTN");

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

    async getBankName() {
        this.setState({
            isProgress: true
        });
        await GETBANKDETAILS(this.props.userDetails, this.props, "BANK", this.state.selectAccountTypeVal === 1).then(response => {
            console.log("response is this==========>", response);
            this.setState({
                isProgress: false,
                bankTypeArr: response
            });
        }).catch(error => {
            this.setState({isProgress: false});
            console.log("error", error);
        });
    }

    async getDistrictName() {
        console.log("called districtname")
        this.setState({
            isProgress: true
        });
        let userDetails = this.props.userDetails;
        userDetails = {...userDetails, BANK_CD: this.state.selectBankVal.BANK_CD};
        await GETBANKDETAILS(userDetails, this.props, "DIST", false).then(response => {
            console.log("response district is this=======>", response);
            this.setState({
                isProgress: false,
                districtTypeArr: response
            });
        }).catch(error => {
            this.setState({isProgress: false});
            console.log("error", error);
        });
    }

    async getBranchName() {
        this.setState({
            isProgress: true
        });
        let userDetails = this.props.userDetails;
        userDetails = {
            ...userDetails,
            BANK_CD: this.state.selectBankVal.BANK_CD,
            DIST_CD: this.state.selectDistrictVal.DIST_CD
        };
        await GETBANKDETAILS(userDetails, this.props, "BRANCH", false).then(response => {
            console.log("response", response);
            this.setState({
                isProgress: false,
                branchTypeArr: response
            });
        }).catch(error => {
            this.setState({isProgress: false});
            console.log("error", error);
        });
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

const styles = {
    textView: {
        marginStart: 10, color: themeStyle.THEME_COLOR
    },
    textStyle: {
        fontFamily: fontStyle.RobotoRegular,
        fontSize: FontSize.getSize(13),
        color: themeStyle.BLACK
    },
    headerLabel: {
        flexDirection: "row",
        height: Utility.setHeight(40),
        borderRadius: 5,
        borderWidth: 1,
        borderColor: themeStyle.WHITE,
        overflow: "hidden"
    },
}

const mapStateToProps = (state) => {
    return {
        userDetails: state.accountReducer.userDetails,
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(OtherBankAccount);
