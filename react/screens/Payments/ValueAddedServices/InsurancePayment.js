import React, {Component} from "react";
import {connect} from "react-redux";
import {
    BackHandler, FlatList,
    Image, Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text, TextInput,
    TouchableOpacity,
    View
} from "react-native";
import themeStyle from "../../../resources/theme.style";
import CommonStyle from "../../../resources/CommonStyle";
import Utility from "../../../utilize/Utility";
import {BusyIndicator} from "../../../resources/busy-indicator";
import RadioForm from "react-native-simple-radio-button";
import FontSize from "../../../resources/ManageFontSize";
import fontStyle from "../../../resources/FontStyle";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

class InsurancePayment extends Component {

    constructor(props) {
        super(props);
        this.state={
            SelectInsuranceName: props.language.select_insurance_name,
            SelectInsurancePaid: props.language.select_insurance_paid,
            SelectFromAccount:props.language.select_from_account,
            selectPaymentType: props.language.select_payment,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            isProgress: false,
            policyNumber:"",
            error_policyNumber:"",
            policyHoldersName:"",
            error_policyHoldersName:"",
            availableBalance:"",
            totalAmount:"",
            amount:"",
            error_amount:"",
            servicesCharge:"",
            vat:"",
            grandTotal:"",
            accountNumber:"",
            otp_type:0,
            transferType: 0,
            errorPaymentDate: "",
            paymentDate: "",
            mode: "date",
            dateVal: new Date(),
            numberPayment: "",
            error_numberPayment: "",
        }
    }


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


    onSelectItem(item) {
        let language = this.props.language;
        const {modelSelection} = this.state;
        console.log("modelSelection is this", item)
        if (modelSelection === "insuranceType") {
            this.setState({SelectInsuranceName: item.label, selectCompanyTypeVal: item.value, modalVisible: false})
        }if (modelSelection === "insurancePaidType") {
            this.setState({SelectInsurancePaid: item.label, selectCompanyTypeVal: item.value, modalVisible: false})
        }else if (modelSelection === "accountType") {
            this.setState({SelectFromAccount: item.label, selectFromTypeVal: item.value, modalVisible: false})
        }else if(modelSelection === "paymentType"){
            this.setState({selectPaymentType: item.label, selectTypeVal: item.value, modalVisible: false})
        }else{
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

    resetVal(language) {
        this.setState({
            SelectInsuranceName: this.props.language.select_insurance_name,
            SelectInsurancePaid: this.props.language.select_insurance_paid,
            SelectFromAccount:this.props.language.select_from_account,
            selectPaymentType: this.props.language.select_payment,
            policyNumber:"",
            policyHoldersName:"",
            availableBalance:"",
            amount: "",
            servicesCharge:"",
            vat:"",
            grandTotal:"",
            otp_type:0,
            transferType:0
        })
    }


    async onSubmit(language, navigation) {
        console.log("submit called")
        if (this.state.SelectInsuranceName === language.select_insurance_name) {
            Utility.alert(language.error_select_insurance_name, language.ok);
        }else if(this.state.policyNumber===""){
            this.setState({error_policyNumber: language.require_policy_number})
        }else if(this.state.policyHoldersName === ""){
            this.setState({error_policyHoldersName: language.require_policy_holder})
        }else if(this.state.SelectInsurancePaid === language.select_insurance_paid) {
            Utility.alert(language.error_select_insurance_paid, language.ok);
        }else if(this.state.SelectFromAccount === language.select_from_account) {
            Utility.alert(language.error_select_from_type, language.ok);
        }else if (this.state.amount === "") {
            this.setState({error_amount: language.error_amount})
        }else if (this.state.transferType === 1) {
            if (this.state.paymentDate === "") {
                this.setState({errorPaymentDate: language.error_payment_date});
            } else if (this.state.selectPaymentType === language.select_payment) {
                Utility.alert(language.select_payment, language.ok);
            } else if (this.state.numberPayment === "") {
                this.setState({error_numberPayment: language.error_numberPayment})
            } else {
                this.processRequest(language,1)
                // this.setState({ screenSwitcher:true})
            }
        }
        else{
            this.processRequest(language,0)
        }
    }

    processRequest(language,val) {
        let tempArr = [];
        tempArr.push(
            {key: language.insurance_name, value: this.state.SelectInsuranceName},
            {key: language.policy_number, value: this.state.policyNumber},
            {key: language.policy_holder_name, value: this.state.policyHoldersName},
            {key: language.insurance_paid, value: this.state.SelectInsurancePaid},
            {key: language.fromAccount, value: this.state.SelectFromAccount},
            {key: language.available_bal, value: this.state.availableBalance},
            {key: language.cash_amount, value: this.state.amount},
            {key: language.services_charge, value: this.state.servicesCharge},
            {key: language.vat, value: this.state.vat},
            {key: language.grand_total, value: this.state.grandTotal},
            {key: language.otpType, value: language.otp_props[this.state.otp_type].label},
            {key: language.TransferType, value: language.transfer_pay_props[this.state.transferType].label},
        )

        if(val===1) {
            tempArr.push(
                {key: language.payment_date, value: this.state.paymentDate},
                {key: language.Frequency, value: this.state.selectPaymentType},
                {key: language.number_of_payment, value: this.state.numberPayment}
            )
        }

        console.log("tempArray is  this",tempArr)
        this.props.navigation.navigate("TransferConfirm", {
            routeVal: [{name: 'Payments'},{name: 'InsurancePayment'}],
            routeIndex: 1,
            title: language.insurance_payment,
            transferArray:tempArr,
            screenName:"SecurityVerification",
            transType:"payments"
        });

    }


    insurancePayment(language){
        return(
            <View style={{flex: 1}}>
                <View style={{flex: 1}}>
                    {
                        <Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.THEME_COLOR,
                            marginStart: 10,
                            marginEnd: 10,
                            marginTop: 6,
                            marginBottom: 4
                        }]}>
                            {language.insurance_name}
                            <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                        </Text>
                    }
                    <TouchableOpacity
                        onPress={() => this.openModal("insuranceType", language.select_insurance_name, language.insurance_props, language)}>
                        <View style={CommonStyle.selectionBg}>
                            <Text style={[CommonStyle.midTextStyle, {
                                color: this.state.SelectInsuranceName === language.select_insurance_name ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                flex: 1
                            }]}>
                                {this.state.SelectInsuranceName}
                            </Text>
                            <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                   source={require("../../../resources/images/ic_arrow_down.png")}/>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.policy_number}
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
                        placeholder={language.et_policy_no_placeholder}
                        onChangeText={text => this.setState({
                            error_policyNumber:"",
                            policyNumber:  Utility.input(text, "0123456789")}
                        )}
                        value={this.state.policyNumber}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.policyHolderNameRef.focus();
                        }}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    />
                </View>
                {this.state.error_policyNumber !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.error_policyNumber}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.policy_holder_name}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>
                    <TextInput
                        ref={(ref) => this.policyHolderNameRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.et_policy_name_placeholder}
                        onChangeText={text => this.setState({
                            error_policyHoldersName:"",
                            policyHoldersName: Utility.userInput(text)}
                        )}
                        value={this.state.policyHoldersName}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    />
                </View>
                {this.state.error_policyHoldersName !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.error_policyHoldersName}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <View style={{flex: 1}}>
                    {
                        <Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.THEME_COLOR,
                            marginStart: 10,
                            marginEnd: 10,
                            marginTop: 6,
                            marginBottom: 4
                        }]}>
                            {language.insurance_paid}
                            <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                        </Text>
                    }
                    <TouchableOpacity
                        onPress={() => this.openModal("insurancePaidType", language.select_insurance_paid, language.insurance_paid_props, language)}>
                        <View style={CommonStyle.selectionBg}>
                            <Text style={[CommonStyle.midTextStyle, {
                                color: this.state.SelectInsurancePaid === language.select_insurance_paid ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                flex: 1
                            }]}>
                                {this.state.SelectInsurancePaid}
                            </Text>
                            <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                   source={require("../../../resources/images/ic_arrow_down.png")}/>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{flex: 1}}>
                    {
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
                    }
                    <TouchableOpacity
                        onPress={() => this.openModal("accountType", language.select_from_account, language.cardNumber, language)}>
                        <View style={CommonStyle.selectionBg}>
                            <Text style={[CommonStyle.midTextStyle, {
                                color: this.state.SelectFromAccount === language.select_from_account ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                flex: 1
                            }]}>
                                {this.state.SelectFromAccount}
                            </Text>
                            <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                   source={require("../../../resources/images/ic_arrow_down.png")}/>
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


                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.cash_amount}
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
                        placeholder={language.enter_amount}
                        onChangeText={text => this.setState({
                            error_amount: "",
                            amount: Utility.userInput(text)
                        })}
                        value={this.state.amount}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={13}/>
                    <Text style={{paddingLeft: 5}}>BDT</Text>
                </View>
                {this.state.error_amount !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.error_amount}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                {/*                    <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.totalAmount}
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.totalAmount}</Text>
                    <Text style={{paddingLeft: 5}}>BDT</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>*/}


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
                        key={this.state.otp_type}
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
                                           source={require("../../../resources/images/ic_arrow_down.png")}/>
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
                                   require("../../../resources/images/ic_back_android.png") : require("../../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.insurance_payment}</Text>
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
                               source={require("../../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        {this.insurancePayment(language)}
                        <View style={{
                            flexDirection: "row",
                            marginStart: Utility.setWidth(10),
                            marginRight: Utility.setWidth(10),
                            marginTop: Utility.setHeight(20)
                        }}>
                            <TouchableOpacity style={{flex: 1}}  onPress={() => this.resetVal(language)}>
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
                                      data={this.state.modalData} keyExtractor={(item, index) => index+""}
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

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(InsurancePayment);