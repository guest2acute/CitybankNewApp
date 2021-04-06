import {connect} from "react-redux";
import {
    I18nManager,
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
import {AddBeneficiary, GETACCTBALDETAIL, GETBANKDETAILS} from "../Requests/RequestBeneficiary";

class OtherBankAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: "",
            accountNo: "2101636171001",
            error_nickname: "",
            error_accountNo: "",
            isProgress: false,
            selectNicknameType: props.language.select_nickname,
            selectAcctType: props.language.bkash_select_acct,
            selectPaymentType: props.language.select_payment,
            selectAccountType: props.language.selectActType,
            // selectBankType: props.language.select_bank_type,
            selectBankType: props.language.select_bank_type,
            selectDistrictType: props.language.select_district_type,
            selectBranchType: props.language.select_branch_type,
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
            branchName: "",
            numberPayment: "",
            paymentdate: "",
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
            toAccount: ""
        }
    }


    backEvent() {
        this.props.navigation.goBack(null)
       /* if (this.state.screenSwitcher) {
            this.setState({screenSwitcher: false})
        } else {
            this.props.navigation.goBack(null)
        }*/
    }

    async changeCard(cardCode) {
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
            this.setState({dateVal: selectedDate, paymentdate: currentDate, show: false});
        } else {
            this.setState({show: false});
        }
    };

    openModal(option, title, data, language) {
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

    resetData(item, props) {
        this.setState({
            selectAcctType: item.label,
            selectTypeVal: item.value,
            modalVisible: false,
            account_card_name: "",
            accountNo: "",
            error_accountNo: "",
            error_cardName: "",
            /*   error_cardName: "",*/
            districtTypeArr: [],
            branchTypeArr: [],

            bankTypeArr: [],
            selectBankType: props.language.select_bank_type,
            selectDistrictType: props.language.select_district_type,
            selectBankVal: null,
            selectBranchVal: null,
            selectDistrictVal: null,
        }, async () => await this.getBankName())
    }


    onSelectItem(item) {
        const {modelSelection} = this.state;
        if (modelSelection === "nickNameType") {
            this.setState({selectNicknameType: item.label, selectTypeVal: item.value, modalVisible: false})
            this.alertToNavigate();
        } else if (modelSelection === "accountType") {
            console.log("account type onselect")
            this.resetData(item, this.props);
            // this.setState({selectAcctType: item.label, selectTypeVal: item.value, modalVisible: false})
        } else if (modelSelection === "paymentType") {
            this.setState({selectPaymentType: item.label, modalVisible: false})
        } else if (modelSelection === "selectAccountType") {
            this.setState({selectAccountType: item.label, modalVisible: false})
        } else if (modelSelection === "bankType") {
            console.log("bank type is this", this.state.selectTypeVal)
            this.setState({
                selectBankType: item.label, selectBankVal: item.details,
                modalVisible: false
            }, async () => {
                console.log(this.state.selectTypeVal)
                if (this.state.selectTypeVal === 0)
                    await this.getDistrictName();
            })
            // this.setState({selectBankType: item.label, modalVisible: false})
        } else if (modelSelection === "district_type") {
            this.setState({
                selectDistrictType: item.label, selectDistrictVal: item.details,
                modalVisible: false
            }, async () => {
                if (this.state.selectTypeVal === 0)
                    await this.getBranchName()
            })
            /* this.setState({selectDistrictType: item.label, modalVisible: false})*/
            /*       this.setState({selectDistrictType: item.label, modalVisible: false})*/
        } else if (modelSelection === "branch_type") {
            this.setState({selectBranchType: item.label, modalVisible: false})
        }
    }

    alertToNavigate() {
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
    }

    async onSubmit(language, navigation) {

        console.log("stageVal next screen", this.state.stageVal)
        console.log("otp_type is this", this.state.otp_type)
        if (this.state.cardCode === 0) {
            if (this.state.selectAcctType === language.bkash_select_acct) {
                Utility.alert(language.error_select_from_type, language.ok);
            } else if (this.state.transferAmount === "") {
                this.setState({errorTransferAmount: language.errTransferAmt})
            } else if (this.state.selectBankType === language.select_bank_type) {
                Utility.alert(language.error_select_bank_name, language.ok);
            } else if (this.state.selectTypeVal === 0 && this.state.selectDistrictType === language.select_district_type) {
                Utility.alert(language.error_select_district_name, language.ok);
            } else if (this.state.selectTypeVal === 0 && this.state.selectBranchType === language.select_branch_type) {
                Utility.alert(language.error_select_branch_name, language.ok);
            } else if (this.state.remarks === "") {
                this.setState({error_remarks: language.errRemarks})
            } else if (this.state.screenSwitcher) {
                //this.setState({stageVal: this.state.stageVal + 1});
                /*   this.props.navigation.navigate("Otp")
                   this.props.navigation.navigate("Otp", {
                       routeVal: [{name: 'Transfer'}, {name: 'OtherBankAccount'}],
                       routeIndex: 1
                   })*/
                // this.getActDetails(language);
                // this.beneficiaryAdd(language);
            } else {
                this.processRequest(0,language);
            }
        } else if (this.state.cardCode === 1) {
            let tempArr = [];
            if (this.state.selectAcctType === language.bkash_select_acct) {
                Utility.alert(language.error_select_from_type, language.ok);
            } else if (this.state.selectNicknameType === language.selectNickType) {
                Utility.alert(language.error_select_nickname, language.ok);
            } else if (this.state.transferAmount === "") {
                this.setState({errorTransferAmount: language.errTransferAmt})
            } else if (this.state.remarks === "") {
                this.setState({error_remarks: language.errRemarks})
            } else if (this.state.transferType === 1) {
                console.log("payment date is this", this.state.paymentdate)
                if (this.state.paymentdate === "") {
                    this.setState({errorPaymentDate: language.error_payment_date});
                } else if (this.state.selectPaymentType === language.select_payment) {
                    Utility.alert(language.select_payment, language.ok);
                } else if (this.state.numberPayment === "") {
                    this.setState({error_numberPayment: language.error_numberPayment})
                } else {
                    this.processRequest(1,language);
                    // this.setState({screenSwitcher: true})
                    /*   this.getActDetails(language);
                       this.beneficiaryAdd(language);*/
                }
            } else {
                this.processRequest(1,language);
                // this.setState({screenSwitcher: true})
            }
            /*  this.getActDetails(language);
              this.beneficiaryAdd(language);*/
        }
        // Utility.alertWithBack(language.ok_txt, language.success_saved, navigation)
    }

    processRequest(val,language) {
        let tempArr = [];
        // this.setState({screenSwitcher: true})
        tempArr.push(
            {key: language.fromAccount, value: this.state.selectAcctType},
            {key: language.available_bal, value: this.state.availableBalance},
            {key: language.currency, value: this.state.currency},
            {key: language.transfer_amount, value: this.state.transferAmount},
            {key: language.account_Type, value: this.state.selectAccountType},
            {key: language.transfer_mode, value: language.other_bank_props[this.state.transferModeType].label},
            {key: language.to_account, value: this.state.toAccount},
            {key: language.bank_name, value: this.state.selectBankType},
            {key: language.district_type, value: this.state.selectDistrictType},
            {key: language.branch_name, value: this.state.selectBranchType},
            {key: language.services_charge, value: this.state.servicesCharge},
            {key: language.vat, value: this.state.vat},
            {key: language.grand_total, value: this.state.grandTotal},
            {key: language.remarks, value: this.state.remarks},
            {key: language.otpType, value: language.otp_props[this.state.otp_type].label},
        );
        if(val === 0){
            this.props.navigation.navigate("TransferConfirm", {
                routeVal: [{name: 'Transfer'},{name: 'OtherBankAccount'}],
                routeIndex: 1,
                title: language.other_bank_account_title,
                transferArray: tempArr,
                screenName:"SecurityVerification"
            });
        }else if (val === 1) {
            if(this.state.transferType===1){
                tempArr.push(
                    {key: language.payment_date, value: this.state.paymentdate},
                    {key: language.Frequency, value: this.state.selectPaymentType},
                    {key: language.number_of_payment, value: this.state.numberPayment})
            }
            tempArr.push(
                {key: language.TransferType, value: language.transfer_pay_props[this.state.transferType].label},
                {key: language.nick_name, value: this.state.selectNicknameType})

            this.props.navigation.navigate("TransferConfirm", {
                routeVal: [{name: 'Transfer'},{name: 'OtherBankAccount'}],
                routeIndex: 1,
                title: language.other_bank_account_title,
                transferArray: tempArr,
                screenName:"Otp"
            });
        }
        console.log("val o this is",tempArr)
    }

    getActDetails(language) {
        console.log("get account details", this.state.accountNo)
        this.setState({isProgress: true});
        GETACCTBALDETAIL(this.state.accountNo, this.props).then(response => {
            console.log("response", response);
            this.setState({
                isProgress: false, account_holder_name: response.ACCOUNTNAME,
                currency: response.CURRENCYCODE, type_act: response.ACCTTYPE, accountDetails: response
            });
        }).catch(error => {
            this.setState({isProgress: false, error_accountNo: language.require_valid_actNumber});
            console.log("error", error);
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


    beneficiaryAdd(language) {
        this.props.navigation.navigate("SecurityVerification", {
            REQUEST_CD: "",
            transType: "O",
            resetScreen: this.resetScreen
        })
    }


    getListViewItem = (item) => {
        this.setState({transferAmount: item.label})
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
                    onPress={() => this.openModal("accountType", language.select_from_account, language.changeInArr, language)}>
                    <View style={CommonStyle.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectAcctType === language.bkash_select_acct ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
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
                <Text style={[CommonStyle.textStyle, {flex: 1}]}>
                    {language.available_bal}
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
                        availableBalance: Utility.userInput(text)
                    })}
                    value={this.state.availableBalance}
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
                <Text style={[CommonStyle.textStyle, {flex: 1}]}>
                    {language.currency}
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
                        currency: Utility.userInput(text)
                    })}
                    value={this.state.currency}
                    multiline={false}
                    numberOfLines={1}
                    contextMenuHidden={true}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    editable={false}
                    autoCorrect={false}
                />
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
                        onPress={() => this.openModal("nickNameType", language.selectNickType, language.nickTypeArr, language)}>
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
                      data={language.balanceTypeArr}
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
                                      style={[CommonStyle.textStyle, {color: themeStyle.WHITE}]}>{item.label}</Text>
                              </TouchableOpacity>
                          </View>
                      }
            />

            {/*
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.to_acct}
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
                        value={this.state.to_acct}
                        multiline={false}
                        numberOfLines={1}
                        editable={false}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    />
                </View>
*/}

            {/*<View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>*/}

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
                    onChangeText={text => this.transferModeShow(text)
                    }
                    value={this.state.transferAmount}
                    multiline={false}
                    numberOfLines={1}
                    contextMenuHidden={true}
                    keyboardType={"number-pad"}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                />
            </View>
            {this.state.errorTransferAmount !== "" ?
                <Text style={CommonStyle.errorStyle}>{this.state.errorTransferAmount}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            {this.state.cardCode ? null :
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
            }

            <View style={{flexDirection: "row", marginStart: 10, marginEnd: 10}}>
                <Text style={[CommonStyle.textStyle, {marginTop: 10}]}>
                    {language.transfer_mode}
                    <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                </Text>
                <RadioForm
                    radio_props={language.other_bank_props}
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
                    {language.to_account}
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
                        toAccount: Utility.userInput(text)
                    })}
                    value={this.state.toAccount}
                    multiline={false}
                    numberOfLines={1}
                    contextMenuHidden={true}
                    keyboardType={"number-pad"}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    editable={this.state.cardCode === 1 ? false : true}
                    maxLength={35}/>
                {/*
                <TextInput
                    ref={(ref) => this.transferamtRef = ref}
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {
                        alignItems: "flex-end",
                        textAlign: 'right',
                        marginLeft: 10
                    }]}
                    placeholder={""}
                    onChangeText={text => this.setState({
                        error_toAccount: "",
                        toAccount: Utility.userInput(text)
                    })}
                    value={this.state.toAccount}
                    multiline={false}
                    numberOfLines={1}
                    contextMenuHidden={true}
                    keyboardType={"number-pad"}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    maxLength={13}/>
*/}
            </View>
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
                        <TouchableOpacity
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
                        <TouchableOpacity
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
                        <TouchableOpacity
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
                                value={this.state.paymentdate}
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
                            ref={(ref) => this.transferamtRef = ref}
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

    otherBankAccountDetails(language) {
        console.log("details screen")
        return (
            <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.fromAccount}
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.selectAcctType}</Text>
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
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.currency}
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.currency}</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                {this.state.cardCode === 1 && this.state.screenSwitcher ?
                    <View>
                        <View style={{
                            flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.nick_name}
                            </Text>
                            <Text style={CommonStyle.viewText}>{this.state.selectNicknameType}</Text>
                        </View>
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                    </View> : null
                }

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.transfer_amount}
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.transferAmount}</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.account_type}
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.selectAccountType}</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.transfer_mode}
                    </Text>
                    <Text
                        style={CommonStyle.viewText}>{language.other_bank_props[this.state.transferModeType].label}</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.to_account}
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.toAccount}</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                {this.state.cardCode === 1 && this.state.screenSwitcher ? null
                    :
                    <View>
                        <View style={{
                            flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.bank_name}
                            </Text>
                            <Text style={CommonStyle.viewText}>{this.state.selectBankType}</Text>
                        </View>
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                        <View style={{
                            flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.district_type}
                            </Text>
                            <Text style={CommonStyle.viewText}>{this.state.selectDistrictType}</Text>
                        </View>
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                        <View style={{
                            flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.branch_name}
                            </Text>
                            <Text style={CommonStyle.viewText}>{this.state.selectBranchType}</Text>
                        </View>
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                    </View>
                }

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.services_charge}
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.servicesCharge}</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.vat}
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.vat}</Text>
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
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.remarks}
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.remarks}</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                {this.state.cardCode === 1 && this.state.screenSwitcher ?
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
                                    {language.TransferType}
                                </Text>
                                <Text
                                    style={CommonStyle.viewText}>{language.transfer_pay_props[this.state.transferType].label}</Text>
                            </View>
                            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                        </View>
                        <View style={{
                            flexDirection: "row",
                            height: Utility.setHeight(50),
                            marginStart: 10,
                            alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.payment_date}
                            </Text>
                            <Text
                                style={CommonStyle.viewText}>{this.state.paymentdate}</Text>
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
                                {language.Frequency}
                            </Text>
                            <Text
                                style={CommonStyle.viewText}>{this.state.selectPaymentType}</Text>
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
                            <Text
                                style={CommonStyle.viewText}>{this.state.numberPayment}</Text>
                        </View>
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                    </View>
                    : null
                }

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.otpType}
                    </Text>
                    <Text style={CommonStyle.viewText}>{language.otp_props[this.state.otp_type].label}</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            </View>
        )
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
                {this.state.screenSwitcher ? null :
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
                                borderBottomLeftRadius: this.state.cardCode === 1 ? 3 : 0,
                                borderTopLeftRadius: this.state.cardCode === 1 ? 3 : 0,
                                backgroundColor: this.state.cardCode === 0 ? themeStyle.THEME_COLOR : "#F4F4F4",
                            }}>
                            <Text style={[styles.langText, {
                                color: this.state.cardCode === 0 ? themeStyle.WHITE : themeStyle.BLACK,
                                fontFamily: fontStyle.RobotoMedium,
                                fontSize: FontSize.getSize(11),
                            }]}>{this.props.language.single_transfer}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.changeCard(1)}
                            style={{
                                height: "100%",
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                borderBottomRightRadius: this.state.cardCode === 1 ? 5 : 0,
                                borderTopRightRadius: this.state.cardCode === 1 ? 5 : 0,
                                backgroundColor: this.state.cardCode === 1 ? themeStyle.THEME_COLOR : "#F4F4F4",
                            }}>
                            <Text style={[styles.langText, {
                                color: this.state.cardCode === 1 ? themeStyle.WHITE : themeStyle.BLACK,
                                fontFamily: fontStyle.RobotoMedium,
                                fontSize: FontSize.getSize(11),
                            }]}>{this.props.language.transfer_from_beneficiary}</Text>
                        </TouchableOpacity>
                    </View>
                }
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        {this.state.screenSwitcher ? this.otherBankAccountDetails(language) : this.otherBankAccountView(language)}

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
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{this.state.screenSwitcher ? language.confirm : language.next}</Text>
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

    componentDidMount() {
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
    }

    async getBankName() {
        console.log("called getbankname");
        this.setState({
            isProgress: true
        });
        await GETBANKDETAILS(this.props.userDetails, this.props, "BANK", this.state.selectTypeVal === 1).then(response => {
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
