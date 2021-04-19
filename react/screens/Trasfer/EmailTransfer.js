import React, {Component} from "react";
import {
    FlatList,
    Image, Modal,
    Platform,
    SafeAreaView, ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View, BackHandler
} from "react-native";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import {connect} from "react-redux";
import Utility from "../../utilize/Utility";
import FontSize from "../../resources/ManageFontSize";
import fontStyle from "../../resources/FontStyle";
import RadioForm from "react-native-simple-radio-button";
import {BusyIndicator} from "../../resources/busy-indicator";
import {GETBALANCE, unicodeToChar} from "../Requests/CommonRequest";
import {GETBENF} from "../Requests/RequestBeneficiary";
import Config from "../../config/Config";
import {CHARGEVATAMT, EMAILWAITTRFREQ, GETAMTLABEL, OPERATIVETRNACCT} from "../Requests/FundsTransferRequest";
import {actions} from "../../redux/actions";

let init = {
    requestList: null,
    transVal: 0,
    stateVal: 0,
    nickname: "",
    mobile_number: "",
    errorMobile: "",
    isProgress: false,
    selectTypeVal: -1,
    selectNickTypeVal: -1,
    selectFromAccountVal: -1,
    modelSelection: "",
    modalVisible: false,
    modalTitle: "",
    modalData: [],
    otp_type: 0,
    availableBalance: "",
    transferAmount: "",
    errorTransferAmount: "",
    servicesCharge: "",
    error_servicescharge: "",
    grandTotal: "",
    error_grandTotal: "",
    remarks: "",
    error_remarks: "",
    errorEmail: "",
    securityQuestions: "",
    error_security: "",
    errorAnswer: "",
    answer: "",
    emailTxt: "",
    selectNickArr: [],
    accountArr: [],
    fromHolderName: "",
    focusAmount: false,
    actLabelList: []

}

class EmailTransfer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectBeneficiaryType: props.language.select_beneficiary_type,
            selectNicknameType: props.language.select_nickname,
            selectAcctType: props.language.sel_act_card_no,
            ...init
        }
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

    async changeCard(cardCode) {
        this.setState({
            stateVal: cardCode,
        }, () => this.getRequestList());
    }

    openModal(option, title, data, language) {
        if (option === "fromAccountType")
            data = data.filter((e) => e.value.FROM_ALLOW === "Y");

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

    async onSelectItem(item) {
        const {modelSelection} = this.state;
        if (modelSelection === "nickType") {
            this.setState({
                selectNicknameType: item.label, selectNickTypeVal: item.value,
                emailTxt: item.value.TO_EMAIL_ID, mobile_number: item.value.TO_CONTACT_NO, modalVisible: false
            })
        } else if (modelSelection === "fromAccountType") {
            this.setState({selectAcctType: item.label, selectFromAccountVal: item.value, modalVisible: false})
            await this.getBalance(item.value);
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
            });

        }).catch(error => {
            this.setState({isProgress: false});
            console.log("error", error);
        });
    }

    async onSubmit(language, navigation) {
        if (this.state.transVal === 1 && this.state.selectNicknameType === language.select_nickname) {
            Utility.alert(language.error_select_nickname, language.ok);
        } else if (!Utility.validateEmail(this.state.emailTxt)) {
            this.setState({errorEmail: language.invalidEmail});
        } else if (this.state.mobile_number !== "" && !Utility.ValidateMobileNumber(this.state.mobile_number)) {
            this.setState({errorMobileNo: language.invalidMobile});
        } else if (this.state.selectAcctType === language.sel_act_card_no) {
            Utility.alert(language.error_select_from_type, language.ok);
        } else if (this.state.transferAmount === "") {
            this.setState({errorTransferAmount: language.errAmt});
        } else if (this.state.securityQuestions === "") {
            this.setState({error_security: language.err_security})
        } else if (this.state.answer === "") {
            this.setState({errorAnswer: language.error_answer});
        } else if (this.state.remarks === "") {
            this.setState({error_remarks: language.errRemarks});
        } else {
            this.processRequest(language);
        }
    }

    async getRequestList() {
        this.setState({isProgress: true});
        EMAILWAITTRFREQ(this.props.userDetails, this.props).then(response => {
            console.log("response", response);
            this.setState({
                isProgress: false,
                requestList: response
            });
        }).catch(error => {
            this.setState({isProgress: false});
            console.log("error", error);
        });

    }

    getNickList() {
        this.setState({isProgress: true});
        GETBENF(this.props.userDetails, "E", this.props).then(response => {
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

    processRequest(language) {
        const {selectFromAccountVal, selectNickTypeVal, transferAmount, transVal, securityQuestions} = this.state;
        let tempArr = [];
        let userDetails = this.props.userDetails;
        let request = {
            APP_CUSTOMER_ID: selectFromAccountVal.APP_CUSTOMER_ID,
            USER_ID: userDetails.USER_ID,
            ACTIVITY_CD: userDetails.ACTIVITY_CD,
            CUSTOMER_ID: userDetails.CUSTOMER_ID,
            ACTION: "EMAILFUNDOTP",
            NICK_NAME: this.state.transVal === 0 ? "" : selectNickTypeVal.NICK_NAME,
            AUTH_FLAG: userDetails.AUTH_FLAG,
            FROM_ACCT_NO: selectFromAccountVal.ACCT_UNMASK,
            TRN_AMOUNT: transferAmount,
            FROM_CBNUMBER: selectFromAccountVal.APP_CUSTOMER_ID,
            FROM_MOBILE_NO: selectFromAccountVal.MOBILE_NO,
            TO_MOBILE_NO: this.state.mobile_number,
            TO_EMAIL_ID: this.state.emailTxt,
            REF_NO: transVal === 1 ? selectNickTypeVal.REF_NO : "",
            TO_IFSCODE: transVal === 1 ? selectNickTypeVal.TO_IFSCODE : "",
            REMARKS: this.state.remarks,
            SEC_QUESTION: securityQuestions,
            SEC_ANSWER: this.state.answer,
            TO_ACCT_NM: "",
            VAT_CHARGE: this.state.vat,
            SERVICE_CHARGE: this.state.servicesCharge,
            OTP_TYPE: this.state.otp_type === 0 ? "S" : "E",
            FROM_ACCT_NM: this.state.fromHolderName,
            REQ_TYPE: transVal === 0 ? "I" : "B",
            FROM_CURRENCY_CODE: selectFromAccountVal.CURRENCY_CODE,
            TO_CURRENCY_CODE: this.state.transVal === 0 ? "" : selectNickTypeVal.CURRENCY,
            TO_ACCT_CARD_FLAG: this.state.transVal === 0 ? "" : selectNickTypeVal.ACCT_TYPE === "ACCOUNT" ? "A" : "C",
            ...Config.commonReq
        }
        console.log("request-", request);

        tempArr.push(
            {
                key: language.fromAccount,
                value: this.state.selectFromAccountVal.ACCT_UNMASK + "-" + this.state.selectFromAccountVal.ACCT_TYPE_NAME
            },
            {
                key: language.beneficiary_Email_Address,
                value: this.state.emailTxt
            },
            {
                key: language.beneficiary_mobile_number,
                value: this.state.mobile_number
            });

        tempArr.push(
            {key: language.transfer_amount, value: this.state.transferAmount},
            {key: language.services_charge, value: this.state.servicesCharge},
            {key: language.vat, value: this.state.vat},
            {key: language.grand_total, value: this.state.grandTotal},
            {key: language.remarks, value: this.state.remarks});


        this.props.navigation.navigate("TransferConfirm", {
            routeVal: [{name: 'Transfer'}, {name: 'EmailTransfer'}],
            routeIndex: 1,
            title: language.email_transfer,
            transferArray: tempArr,
            screenName: "Otp",
            transRequest: request
        });
    }


    _renderItem = ({item, index}) => {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate("EmailTransferDetails", {details: item})}>
                <View style={{
                    flexDirection: "row", justifyContent: "space-between",
                    width: Utility.getDeviceWidth(),
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: index % 2 === 0 ? null : themeStyle.SEPARATOR
                }}>
                    <View style={{flex: 0.8, flexDirection: "column", marginStart: 10, marginEnd: 10}}>
                        {item.NICK_NAME !== "" ? <Text style={CommonStyle.textStyle}>{item.NICK_NAME}</Text> : null}
                        <Text style={[CommonStyle.textStyle, {}]}>{item.TO_EMAIL_ID}</Text>
                        <Text style={[CommonStyle.textStyle, {
                            fontSize: FontSize.getSize(12),
                            color: themeStyle.PLACEHOLDER_COLOR
                        }]}>
                            {item.EXPIRE_DT}
                        </Text>
                    </View>
                    <View style={{justifyContent: "center"}}>
                        <Text style={[CommonStyle.textStyle, {
                            color: themeStyle.THEME_COLOR,
                            marginStart: 10,
                            marginEnd: 10,
                            textAlign: "center",
                            alignItems: "center"
                        }]}>{item.AMOUNT}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }


    resetData(props) {
        this.setState({
            //selectNicknameType: props.language.select_nickname,
            //selectAcctType: props.language.sel_act_card_no,
            //selectToAcctType: props.language.select_to_acct,
            //selectPaymentType: props.language.select_payment,
            //...initialVar
        });
    }


    getListViewItem = (item) => {
        this.setState({errorTransferAmount: "", transferAmount: item.AMOUNT_LABEL}, async () => {
            await this.calculateVat();
        });
    }

    sendOption(language) {
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <View key={"sendOption"}>

                    <View style={{
                        flexDirection: "row",
                        height: Utility.setHeight(50),
                        alignItems: "center",
                        marginTop: 10,
                        marginBottom: 10
                    }}>
                        <RadioForm
                            radio_props={language.transferCity_props}
                            initial={this.state.transVal}
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
                                if (this.state.transVal !== value) {
                                    this.resetData(this.props);
                                }
                                this.setState({transVal: value});
                            }}
                        />
                    </View>

                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>


                    {this.state.transVal === 1 ?
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
                                onPress={() => this.openModal("nickType", language.selectNickType, this.state.selectNickArr, language)}>
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

                    <View style={{
                        flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                        marginEnd: 10,
                    }}>
                        <Text style={[CommonStyle.textStyle]}>
                            {language.beneficiary_Email_Address}
                            {this.state.transVal === 0 ? <Text
                                style={{color: themeStyle.THEME_COLOR}}>*</Text> : null}
                        </Text>
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle, {
                                alignItems: "flex-end",
                                textAlign: 'right',
                                flex: 1,
                                marginLeft: 10
                            }]}
                            placeholder={this.state.transVal === 0 ? language.please_enter : ""}
                            onChangeText={text => this.setState({
                                errorEmail: "",
                                emailTxt: Utility.userInput(text)
                            })}
                            value={this.state.emailTxt}
                            multiline={false}
                            numberOfLines={1}
                            editable={this.state.transVal === 0}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}
                        /></View>
                    {this.state.errorEmail !== "" ?
                        <Text style={CommonStyle.errorStyle}>{this.state.errorEmail}</Text> : null}
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
                                {language.beneficiary_mobile_number}
                            </Text>
                            <TextInput
                                selectionColor={themeStyle.THEME_COLOR}
                                style={[CommonStyle.textStyle, {
                                    alignItems: "flex-end",
                                    textAlign: 'right',
                                    flex: 1,
                                    marginLeft: 10
                                }]}
                                placeholder={this.state.transVal === 0 ? language.please_enter : ""}
                                onChangeText={text => this.setState({
                                    errorMobile: "",
                                    mobile_number: Utility.input(text, "0123456789")
                                })}
                                value={this.state.mobile_number}
                                multiline={false}
                                numberOfLines={1}
                                contextMenuHidden={true}
                                keyboardType={"number-pad"}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}
                                editable={false}
                                maxLength={11}/>
                        </View>
                    </View>
                    {this.state.errorMobile !== "" ?
                        <Text style={CommonStyle.errorStyle}>{this.state.errorMobile}</Text> : null}
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
                            onPress={() => this.openModal("fromAccountType", language.sel_act_card_no, this.state.accountArr, language)}>
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
                    </View>
                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>


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
                        <Text style={CommonStyle.textStyle}>
                            {language.currency}
                        </Text>
                        <Text
                            style={CommonStyle.viewText}>{this.state.currency}</Text>
                    </View>
                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                    <View style={{
                        flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                        marginEnd: 10,
                    }}>
                        <Text style={[CommonStyle.textStyle]}>
                            {language.transfer_amount}
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
                                errorTransferAmount: "",
                                transferAmount: Utility.input(text, "0123456789.")
                            })}
                            value={this.state.transferAmount}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            keyboardType={"number-pad"}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}
                            returnKeyType={"next"}
                            onSubmitEditing={() => {
                                this.sel_act_card_noRef.focus();
                            }}
                            onFocus={() => this.setState({focusAmount: true})}
                            onBlur={() => {
                                if (this.state.focusAmount) {
                                    this.setState({focusAmount: false}, async () => {
                                        await this.calculateVat();
                                    });
                                }
                            }}
                            maxLength={13}/>
                    </View>
                    {this.state.errorTransferAmount !== "" ?
                        <Text style={CommonStyle.errorStyle
                        }>{this.state.errorTransferAmount}</Text> : null}
                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>


                    <View style={{
                        flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                        marginEnd: 10,
                    }}>
                        <Text style={[CommonStyle.textStyle]}>
                            {language.security_questions}
                            <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                        </Text>
                        <TextInput
                            ref={(ref) => this.sel_act_card_noRef = ref}
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle, {
                                alignItems: "flex-end",
                                textAlign: 'right',
                                flex: 1,
                                marginLeft: 10
                            }]}
                            placeholder={language.security_pl_holder}
                            onChangeText={text => this.setState({
                                error_security: "",
                                securityQuestions: text
                            })}
                            value={this.state.securityQuestions}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}
                            returnKeyType={"next"}
                            onSubmitEditing={() => {
                                this.answerRef.focus();
                            }}/>
                    </View>
                    {this.state.error_security !== "" ?
                        <Text style={CommonStyle.errorStyle
                        }>{this.state.error_security}</Text> : null}
                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                    <View style={{
                        flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                        marginEnd: 10,
                    }}>
                        <Text style={[CommonStyle.textStyle]}>
                            {language.answer}
                            <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                        </Text>
                        <TextInput
                            ref={(ref) => this.answerRef = ref}
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle, {
                                alignItems: "flex-end",
                                textAlign: 'right',
                                flex: 1,
                                marginLeft: 10
                            }]}
                            placeholder={language.answer_pl}
                            onChangeText={text => this.setState({
                                errorAnswer: "",
                                answer: text
                            })}
                            value={this.state.answer}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}
                            returnKeyType={"next"}
                            onSubmitEditing={() => {
                                this.remarksRef.focus();
                            }}/>
                    </View>
                    {this.state.errorAnswer !== "" ?
                        <Text style={CommonStyle.errorStyle
                        }>{this.state.errorAnswer}</Text> : null}
                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>


                    <View style={{
                        flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                        marginEnd: 10,
                    }}>
                        <Text style={[CommonStyle.textStyle]}>
                            {language.remarks}
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
                            placeholder={language.et_remarks}
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

                    <View style={{
                        flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                        marginEnd: 10,
                    }}>
                        <Text style={[CommonStyle.textStyle]}>
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
                        <Text
                            style={CommonStyle.viewText}>{this.state.vat}</Text>
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
                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
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
                    <Text style={CommonStyle.mark_mandatory}>*{language.mark_field_mandatory}</Text>
                    <View style={{marginStart: 10, marginEnd: 10}}>
                        <Text style={CommonStyle.themeMidTextStyle}>{language.notes}</Text>
                        <Text style={CommonStyle.themeTextStyle}>{language.email_transfer_note1}</Text>
                        <Text style={CommonStyle.themeTextStyle}>{language.email_transfer_note2}</Text>
                        <Text style={CommonStyle.themeTextStyle}>{language.email_transfer_note3}</Text>
                        <Text style={CommonStyle.themeTextStyle}>{language.email_transfer_note4}</Text>
                    </View>

                    <View style={{
                        flexDirection: "row",
                        marginStart: Utility.setWidth(10),
                        marginRight: Utility.setWidth(10),
                        marginTop: Utility.setHeight(20)
                    }}>
                        <TouchableOpacity style={{flex: 1}} onPress={() => this.props.navigation.goBack()}>
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
                                    style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{this.state.stateVal === 3 ? language.submit_txt : language.next}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        )
    }

    async calculateVat() {
        const {selectFromAccountVal, transferAmount} = this.state;

        if (selectFromAccountVal === -1) {
            this.setState({transferAmount: ""})
            Utility.alert(this.props.language.error_select_from_type, this.props.language.ok);
            return;
        } else if (this.state.transferAmount === "") {
            this.setState({error_transferAmount: this.props.language.errAmt});
            return;
        }

        this.setState({isProgress: true});
        await CHARGEVATAMT(this.props.userDetails, "EMAIL", selectFromAccountVal.APP_INDICATOR,
            selectFromAccountVal.ACCT_UNMASK, transferAmount, this.props)
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

    waitingOption(language) {
        return (
            <View key={"waitingOption"}>
                <View style={[CommonStyle.selectionBg, {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: 10,
                    paddingBottom: 10
                }]}>
                    <Text style={[CommonStyle.midTextStyle, {
                        color: themeStyle.BLACK
                    }]}>
                        {language.description}
                    </Text>
                    <Text style={[CommonStyle.midTextStyle, {
                        color: themeStyle.BLACK,
                    }]}>
                        {language.amount}
                    </Text>
                </View>
                {this.state.requestList === null ? null : this.state.requestList.length > 0 ?
                    <FlatList data={this.state.requestList}
                              renderItem={this._renderItem}
                              keyExtractor={(item, index) => index + ""}
                    /> :
                    <View style={{marginTop: Utility.setHeight(50), justifyContent: "center", alignItems: "center"}}>
                        <Text style={CommonStyle.textStyle}>{language.noRecord}</Text>
                    </View>}

            </View>
        )
    }

    render() {
        let language = this.props.language;
        return (
            <View style={{
                flex: 1,
                backgroundColor: themeStyle.BG_COLOR
            }}>
                <SafeAreaView/>
                <View style={CommonStyle.toolbar}>
                    <TouchableOpacity
                        style={CommonStyle.toolbar_back_btn_touch}
                        onPress={() => this.props.navigation.goBack(null)}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../../resources/images/ic_back_android.png") : require("../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.email_transfer}</Text>
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
                <View style={[CommonStyle.headerLabel, {
                    marginTop: 10, marginStart: 10,
                    marginEnd: 10, height: Utility.setHeight(40),
                }]}>
                    <TouchableOpacity
                        onPress={() => this.changeCard(0)}
                        style={{
                            flex: 1,
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            borderBottomLeftRadius: this.state.stateVal === 1 ? 3 : 0,
                            borderTopLeftRadius: this.state.stateVal === 1 ? 3 : 0,
                            backgroundColor: this.state.stateVal === 0 ? themeStyle.THEME_COLOR : "#F4F4F4",
                        }}>
                        <Text style={[CommonStyle.langText, {
                            fontFamily: fontStyle.RobotoMedium,
                            fontSize: FontSize.getSize(11),
                            color: this.state.stateVal === 0 ? themeStyle.WHITE : themeStyle.BLACK
                        }]}>{this.props.language.send}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.changeCard(1)}
                        style={{
                            flex: 1,
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            borderBottomRightRadius: this.state.stateVal === 1 ? 5 : 0,
                            borderTopRightRadius: this.state.stateVal === 1 ? 5 : 0,
                            backgroundColor: this.state.stateVal === 1 ? themeStyle.THEME_COLOR : "#F4F4F4",
                        }}>
                        <Text style={[CommonStyle.langText, {
                            fontFamily: fontStyle.RobotoMedium,
                            fontSize: FontSize.getSize(11),
                            color: this.state.stateVal === 1 ? themeStyle.WHITE : themeStyle.BLACK
                        }]}>{this.props.language.waiting}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{flex: 1, paddingBottom: 30}}>
                    {this.state.stateVal === 0 ? this.sendOption(language) : this.waitingOption(language)}
                </View>

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
                <BusyIndicator visible={this.state.isProgress}/>

            </View>)
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

        await this.getOwnAccounts("EMAILTRF");
        await this.getAmtLabel("EMAIL");
        await this.getNickList();
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

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isERequestCancel) {
            this.props.dispatch({
                type: actions.account.CANCEL_EMAIL_TRANSFER_REQUEST,
                payload: {
                    isERequestCancel: false,
                },
            });
            await this.getRequestList();
        }
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
        this.props.navigation.goBack();
    }
}

const mapStateToProps = (state) => {
        return {
            isERequestCancel: state.accountReducer.isERequestCancel,
            userDetails: state.accountReducer.userDetails,
            langId: state.accountReducer.langId,
            language: state.accountReducer.language,
        };
    }
;

export default connect(mapStateToProps)(EmailTransfer);

