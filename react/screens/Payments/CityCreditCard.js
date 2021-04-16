import React, {Component} from "react";
import {
    FlatList,
    Image, Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text, TextInput,
    TouchableOpacity,
    View,BackHandler
} from "react-native";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import {connect} from "react-redux";
import Utility from "../../utilize/Utility";
import {BusyIndicator} from "../../resources/busy-indicator";
import RadioForm from "react-native-simple-radio-button";
import FontSize from "../../resources/ManageFontSize";
import fontStyle from "../../resources/FontStyle";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

class CityCreditCard extends Component {
    constructor(props) {
        super(props);
        let language = props.language;
        this.state = {
            stateVal: 0,
            selectCreditCardType: props.language.selectCreditCard,
            selectAcctType: props.language.select_acct,
            selectPaymentType: props.language.select_payment,
            selectNicknameType: props.language.select_nickname,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            isProgress: false,
            availableBalance: "",
            errorPaymentAmount:"",
            paymentAmount: "",
            grandTotal: "",
            paymentNarration: "",
            minimumPayment: "",
            lastOutStandingBalance: "",
            otp_type: 0,
            transferType: 0,
            cardNumber: "",
            cardHolderName: "",
            remarks:"",
            error_remarks:"",
            numberPayment: "",
            error_numberPayment: "",
            paymentDate: "",
            mode: "date",
            show:false,
            errorPaymentDate:"",
            cardStatus:"",
            cardType:"",
            errorCard_number:"",
            servicesCharge:"",
            vat:"",
            grandTotal:"",
        }
    }


    async changeCard(cardCode) {
        this.setState({
            stateVal: cardCode
        })
    }


    openModal(option, title, data, language) {
        if (data.length > 0) {
            this.setState({
                modelSelection: option,
                modalTitle: title,
                modalData: data, modalVisible: true
            });
        } else {
            Utility.alert(language.noRecord,language.ok);
        }
    }

    resetVal(language){
        this.setState({
            selectAcctType:this.props.language.select_acct,
            availableBalance:"",
            paymentAmount:"",
            services_charge:"",
            vat:"",
            grand_total:"",
            remarks:"",
            otp_type:0,
            transferType:0
        })
        if(this.state.stateVal===0){
            if(this.state.transferType === 1){
                this.setState({
                    paymentDate:"",
                    selectPaymentType:this.props.language.select_payment,
                    numberPayment:""
                })
            }
            this.setState({
                selectCreditCardType:this.props.language.selectCreditCard,
                minimumPayment:"",
                lastOutStandingBalance:"",
            })
        }else if(this.state.stateVal===1) {
            if (this.state.transferType === 1) {
                this.setState({
                    paymentDate:"",
                    selectPaymentType:"",
                    numberPayment:"",
                })
            }
            this.setState({
                cardNumber:"",
                cardHolderName:"",
                cardStatus:"",
                cardType:"",
            })
        }

    }

    onSelectItem(item) {
        const {modelSelection} = this.state;
    if (modelSelection === "type") {
            this.setState({selectCreditCardType: item.label, selectTypeVal: item.value, modalVisible: false})
        } else if (modelSelection === "accountType") {
            this.setState({selectAcctType: item.label, selectTypeVal: item.value, modalVisible: false})
        } else if (modelSelection === "paymentType") {
            this.setState({selectPaymentType: item.label, selectTypeVal: item.value, modalVisible: false})
        } else if (modelSelection === "nickType") {
            this.setState({selectNicknameType: item.label, selectTypeVal: item.value, modalVisible: false})
        }
    }

    submit(language, navigation) {
        if(this.state.stateVal === 0) {
            if (this.state.selectCreditCardType === language.selectCreditCard) {
                Utility.alert(language.error_select_credit_card,language.ok);
            }else if (this.state.selectAcctType === language.select_acct) {
                Utility.alert(language.error_select_from_type,language.ok);
            }else if (this.state.paymentAmount === "") {
                this.setState({errorPaymentAmount: language.err_payment_amount})

            }else if (this.state.remarks === "") {
                this.setState({error_remarks: language.errRemarks})
            }
            else if (this.state.transferType === 1) {
                 if (this.state.paymentDate === "") {
                    this.setState({errorPaymentDate: language.error_payment_date});
                } else if (this.state.selectPaymentType === language.select_payment) {
                    Utility.alert(language.select_payment, language.ok);
                } else if (this.state.numberPayment === "") {
                    this.setState({error_numberPayment: language.error_numberPayment})
                }
                else{
                    this.processRequest(language,0)
                }
            }else {
                this.processRequest(language, 0)
            }
        }else if(this.state.stateVal === 1){
            if(this.state.cardNumber === ""){
                this.setState({errorCard_Number: language.error_card_number})
                return;
            }
              else if (this.state.selectAcctType === language.select_acct) {
                  Utility.alert(language.error_select_from_type,language.ok);
                  return;
              }else if (this.state.paymentAmount === "") {
                  this.setState({errorPaymentAmount: language.err_payment_amount})
                  return;
              }else if (this.state.transferType === 1) {
                  if (this.state.paymentDate === "") {
                      this.setState({errorPaymentDate: language.error_payment_date});
                  } else if (this.state.selectPaymentType === language.select_payment) {
                      Utility.alert(language.select_payment, language.ok);
                  } else if (this.state.numberPayment === "") {
                      this.setState({error_numberPayment: language.error_numberPayment})
                  }else{
                      this.processRequest(language,1)
                  }
              }
                  this.processRequest(language,1)
        }
        // Utility.alertWithBack(language.ok_txt, language.success_saved, navigation)
    }

    processRequest(language,val) {
        console.log("otp props",language.otp_props[this.state.otp_type].label)
        let tempArr = [];
        tempArr.push(
        {key: language.fromAccount, value: this.state.selectAcctType},
        {key: language.available_bal, value: this.state.availableBalance},
        {key: language.payment_Amount, value: this.state.paymentAmount},
        {key: language.services_charge, value: this.state.servicesCharge},
        {key: language.vat, value: this.state.vat},
        {key: language.grand_total, value: this.state.grandTotal},
        {key: language.remarks, value: this.state.remarks},
        {key: language.otpType, value: language.otp_props[this.state.otp_type].label},
        {key: language.TransferType, value: language.transfer_pay_props[this.state.transferType].label},
        )
        if(val===0){
            tempArr.push(
                {key: language.creditCard, value: this.state.selectCreditCardType},
                {key: language.minimum_paymentDue, value: this.state.minimumPayment},
                {key: language.last_outstanding_bal, value: this.state.lastOutStandingBalance},
            )
            if(this.state.transferType === 1){
                tempArr.push(
                    {key: language.payment_date, value: this.state.paymentDate},
                    {key: language.Frequency, value: this.state.selectPaymentType},
                    {key: language.card_status, value: this.state.card_status},
                    {key: language.number_of_payment, value: this.state.numberPayment}
                )
            }
        }else if(val===1){
            tempArr.push(
                {key: language.card_number, value: this.state.cardNumber},
                {key: language.card_holder_name, value: this.state.cardHolderName},
                {key: language.card_status, value: this.state.cardStatus},
                {key: language.card_type, value: this.state.cardType}
            )
            if(this.state.transferType === 1){
                tempArr.push(
                    {key: language.payment_date, value: this.state.paymentDate},
                    {key: language.Frequency, value: this.state.selectPaymentType},
                    {key: language.card_status, value: this.state.card_status},
                    {key: language.number_of_payment, value: this.state.numberPayment}
                )
            }
        }

        console.log("tempArr is this==>",tempArr)
        this.props.navigation.navigate("TransferConfirm", {
            routeVal: [{name: 'Payments'},{name: 'CityCreditCard'}],
            routeIndex: 1,
            title: language.creditCardTitle,
            transferArray:tempArr,
            screenName:"Otp",
            transType:"payments"
        });

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

    ownCreditCardPaymentOption(language) {
        return (
            <View style={{flex: 1, paddingBottom: 30}}>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10
                }}>
                    <RadioForm
                        radio_props={language.bdtType_props}
                        initial={0}
                        buttonSize={9}
                        selectedButtonColor={themeStyle.THEME_COLOR}
                        formHorizontal={true}
                        labelHorizontal={true}
                        borderWidth={1}
                        buttonColor={themeStyle.GRAY_COLOR}
                        labelColor={themeStyle.BLACK}
                        labelStyle={[CommonStyle.textStyle, {marginRight: 10}]}
                        style={{marginTop: 10}}
                        animation={true}
                    />
                </View>
                {this.state.stateVal === 0 ?
                    <View>
                        <Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.THEME_COLOR,
                            marginStart: 10,
                            marginEnd: 10,
                            marginTop: 6,
                            marginBottom: 4
                        }]}>
                            {language.creditCard}
                        </Text>
                        <TouchableOpacity
                            onPress={() => this.openModal("type", language.selectCreditCard, language.transferTypeArr, language)}>
                            <View style={CommonStyle.selectionBg}>
                                <Text style={[CommonStyle.midTextStyle, {
                                    color: this.state.selectCreditCardType === language.selectCreditCard ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                    flex: 1
                                }]}>
                                    {this.state.selectCreditCardType}
                                </Text>
                                <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                       source={require("../../resources/images/ic_arrow_down.png")}/>
                            </View>
                        </TouchableOpacity>

                        <View style={{
                            flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.minimum_paymentDue}
                            </Text>
                            <Text style={CommonStyle.viewText}>{this.state.minimumPayment}</Text>
                        </View>
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                        <View style={{
                            flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.last_outstanding_bal}
                            </Text>
                            <Text style={CommonStyle.viewText}>{this.state.lastOutStandingBalance}</Text>
                            <Text style={{paddingLeft: 5}}>BDT</Text>
                        </View>
                    </View>
                    :
                    <View>
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                        <View style={{
                            flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.card_number}
                            </Text>
                            <TextInput
                                selectionColor={themeStyle.THEME_COLOR}
                                style={[CommonStyle.textStyle, {
                                    alignItems: "flex-end",
                                    textAlign: 'right',
                                    flex: 1,
                                    marginLeft: 10
                                }]}
                                placeholder={language.enter_Card_Number}
                                onChangeText={text => this.setState({
                                    errorCard_number:"",
                                    cardNumber: Utility.userInput(text)
                                })}
                                value={this.state.cardNumber}
                                multiline={false}
                                numberOfLines={1}
                                onFocus={() => this.setState({focusUid: true})}
                                onBlur={() => this.setState({focusUid: false})}
                                contextMenuHidden={true}
                                keyboardType={"number-pad"}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}
                                maxLength={13}/>
                        </View>
                        {this.state.errorCard_number !== "" ?
                            <Text style={CommonStyle.errorStyle}>{this.state.errorCard_number}</Text> : null}
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                        <View style={{
                            flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.card_holder_name}
                            </Text>
                            <Text style={CommonStyle.viewText}>{this.state.cardHolderName}</Text>
                        </View>
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                        <View style={{
                            flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.card_status}
                            </Text>
                            <Text style={CommonStyle.viewText}>{this.state.cardStatus}</Text>
                        </View>
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                        <View style={{
                            flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.card_type}
                            </Text>
                            <Text style={CommonStyle.viewText}>{this.state.cardType}</Text>
                        </View>
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                    </View>
                }
                <View>
                    {<Text style={[CommonStyle.labelStyle, {
                        color: themeStyle.THEME_COLOR,
                        marginStart: 10,
                        marginEnd: 10,
                        marginTop: 6,
                        marginBottom: 4
                    }]}>
                        {language.fromAccount}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    }
                    <TouchableOpacity
                        onPress={() => this.openModal("accountType", language.select_from_account, language.cardNumber, language)}>
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
                    <Text style={[CommonStyle.textStyle]}>
                        {language.available_bal}
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.availableBalance}</Text>
                    <Text style={{paddingLeft: 5}}>BDT</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.payment_Amount}
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
                        placeholder={"00.00"}
                        onChangeText={text => this.setState({
                            errorPaymentAmount:"",
                            paymentAmount: Utility.userInput(text)
                        })}
                        value={this.state.paymentAmount}
                        multiline={false}
                        numberOfLines={1}
                        onFocus={() => this.setState({focusUid: true})}
                        onBlur={() => this.setState({focusUid: false})}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={13}/>
                    <Text style={{paddingLeft: 5}}>BDT</Text>
                </View>
                {this.state.errorPaymentAmount !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errorPaymentAmount}</Text> : null}
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
                    <Text style={[CommonStyle.textStyle]}>
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
                        maxLength={100}/>
                </View>
                {this.state.error_remarks !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.error_remarks}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
{/*
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.payment_narration}
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
                            paymentNarration: Utility.userInput(text)
                        })}
                        value={this.state.paymentNarration}
                        multiline={false}
                        numberOfLines={1}
                        onFocus={() => this.setState({focusUid: true})}
                        onBlur={() => this.setState({focusUid: false})}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    />
                </View>
*/}

{/*
                {this.state.otp_type === 1 ?
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
                    : null
                }
*/}
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
                <Text style={CommonStyle.mark_mandatory}>*{language.mark_field_mandatory}</Text>
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
                    <Text style={CommonStyle.title}>{language.creditCardTitle}</Text>
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
                    marginEnd: 10
                }]}>
                    <TouchableOpacity
                        onPress={() => this.changeCard(0)}
                        style={{
                            flex: 1,
                            height: "100%",
                            // width: Utility.setWidth(65),
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingTop:10,
                            paddingBottom:10,
                            justifyContent: "center",
                            borderBottomLeftRadius: this.state.stateVal === 1 ? 3 : 0,
                            borderTopLeftRadius: this.state.stateVal === 1 ? 3 : 0,
                            backgroundColor: this.state.stateVal === 0 ? themeStyle.THEME_COLOR : "#F4F4F4",
                        }}>
                        <Text style={[styles.langText, { textAlign:"center",
                            color: this.state.stateVal === 0 ? themeStyle.WHITE : themeStyle.BLACK
                        }]}>{this.props.language.own_creditCardPayment}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.changeCard(1)}
                        style={{
                            flex: 1,
                            height: "100%",
                            //width: Utility.setWidth(65),
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingTop:10,
                            paddingBottom:10,
                            justifyContent: "center",
                            borderBottomRightRadius: this.state.stateVal === 1 ? 5 : 0,
                            borderTopRightRadius: this.state.stateVal === 1 ? 5 : 0,
                            backgroundColor: this.state.stateVal === 1 ? themeStyle.THEME_COLOR : "#F4F4F4",
                        }}>
                        <Text style={[styles.langText, {textAlign:"center",
                            color: this.state.stateVal === 1 ? themeStyle.WHITE : themeStyle.BLACK
                        }]}>{this.props.language.other_creditCardPayment}</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.state.stateVal === 0 ? this.ownCreditCardPaymentOption(language) : this.ownCreditCardPaymentOption(language)}
                    <View style={{
                        flexDirection: "row",
                        marginStart: Utility.setWidth(10),
                        marginRight: Utility.setWidth(10),
                        marginTop: Utility.setHeight(10),
                        marginBottom: Utility.setHeight(20)

                    }}>
                        <TouchableOpacity style={{flex: 1}} onPress={() => this.resetVal(language)}>
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
                                    style={[CommonStyle.midTextStyle, {color: themeStyle.THEME_COLOR}]}>{language.reset_txt}</Text>
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
                                    style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{language.next}</Text>
                            </View>
                        </TouchableOpacity>
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
                        is24Hour={false}
                        display="default"
                        onChange={this.onChange}
                    />
                )}
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
            tabBarLabel: this.props.language.payments
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

    backEvent() {
        this.props.navigation.goBack();
    }

}

const styles = {
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
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(CityCreditCard);

