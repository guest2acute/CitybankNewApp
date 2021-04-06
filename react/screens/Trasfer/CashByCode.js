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

class CashByCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: "",
            accountNo: "",
            mobileNumber: "",
            error_nickname: "",
            focusUid: false,
            focusPwd: false,
            isProgress: false,
            selectDebitType: props.language.cash_select_acct,
            // selectTypeAccount: props.language.select_type_account,
            selectTypeVal: -1,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            otp_type: 0,
            availableBalance: "",
            error_availableBal: "",
            transferAmount: "",
            error_amount: "",
            remarks: "",
            error_remarks: "",
            errorMobile: "",
            servicesCharge:"",
            services_charge: "",
            vat: "",
            grandTotal: "",
            screenSwitcher: false,
            caseCodeType: 0,
            transferArray:[]
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

    backEvent() {
        if (this.state.screenSwitcher) {
            this.setState({
                screenSwitcher: false
            })
        } else {
            this.props.navigation.goBack();
            console.log("else part back event")
        }
    }

    onSelectItem(item) {
        const {modelSelection,} = this.state;
       if (modelSelection === "cardType") {
            this.setState({selectDebitType: item.label, selectTypeVal: item.value, modalVisible: false})
        }
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


    async onSubmit(language, navigation) {
        const {selectDebitType,availableBalance,transferAmount, mobileNumber, remarks,servicesCharge,vat,grandTotal} = this.state;
        let tempArr = [];
        tempArr.push(
            {key: language.select_card_title, value: selectDebitType},
            {key: language.available_bal, value: availableBalance},
            {key: language.case_code_via, value:language.bkash_otp_props[this.state.caseCodeType].label},
            {key: language.transfer_amount, value: transferAmount},
            {key: language.beneficiary_mobile_number, value: mobileNumber},
            {key:language.remarks,value:remarks},
            {key:language.services_charge,value:servicesCharge},
            {key:language.vat,value:vat},
            {key:language.grand_total,value:grandTotal},
            {key:language.otpType,value:language.otp_props[this.state.otp_type].label},
            )
        console.log("tempArr", tempArr)
        this.setState({
            transferArray:tempArr
        })
        if (this.state.selectDebitType === language.cash_select_acct) {
            Utility.alert(language.error_debit_card, language.ok);
            return;
        } else if (this.state.transferAmount === "") {
            this.setState({error_amount: language.error_amount})
            return;
        } else if (this.state.mobileNumber === "") {
            this.setState({errorMobile: language.error_mobile})
            return;
        } else if (!Utility.ValidateMobileNumber(this.state.mobileNumber)) {
            this.setState({errorMobile: language.error_mobile_number})
            return;
        } else if (this.state.remarks === "") {
            this.setState({error_remarks: language.errRemarks})
            return;
        } else if (this.state.screenSwitcher) {
         /*   this.props.navigation.navigate("SecurityVerification", {
                REQUEST_CD: "",
                transType: "fund",
                routeVal: [{name: 'Transfer'}, {name: 'CashByCode'}],
                routeIndex: 1
            })*/
             this.props.navigation.navigate("Receipt",{title:language.transfer_bkash,transferArray:this.state.transferArray});
            // this.props.navigation.navigate("Otp");
        } else {
            console.log("else part")
        }
        this.setState({
            screenSwitcher: true
        })
    }

    getListViewItem = (item) => {
        this.setState({transferAmount: item.label})
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


    cashByCodeView(language) {
        return (<View>
            <View style={{flex: 1}}>
                {<Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                    marginBottom: 4
                }]}>
                    {language.select_card_title}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                </Text>
                }
                <TouchableOpacity
                    onPress={() => this.openModal("cardType", language.select_card, language.accountTypeArr, language)}>
                    <View style={CommonStyle.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectDebitType === language.cash_select_acct ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selectDebitType}
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
                <Text style={[CommonStyle.textStyle, {flex: 1}]}>
                    {language.available_bal}
                </Text>
                <TextInput
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {alignItems: "flex-end", textAlign: 'right', marginLeft: 10}]}
                    placeholder={"00.00"}
                    onChangeText={text => this.setState({
                        error_availableBal: "",
                        availableBalance: Utility.userInput(text)
                    })}
                    value={this.state.availableBalance}
                    multiline={false}
                    numberOfLines={1}
                    onFocus={() => this.setState({focusUid: true})}
                    onBlur={() => this.setState({focusUid: false})}
                    contextMenuHidden={true}
                    keyboardType={"number-pad"}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    editable={false}
                    returnKeyType={"next"}
                    onSubmitEditing={(event) => {
                        this.amountRef.focus();
                    }}
                    maxLength={10}
                />
                <Text style={{paddingLeft: 5}}>BDT</Text>
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
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
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.cash_amount}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                </Text>
                <TextInput
                    ref={(ref) => this.amountRef = ref}
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
                        transferAmount: Utility.userInput(text)
                    })}
                    value={this.state.transferAmount}
                    multiline={false}
                    numberOfLines={1}
                    contextMenuHidden={true}
                    keyboardType={"number-pad"}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    returnKeyType={"next"}
                    onSubmitEditing={(event) => {
                        this.mobileNumberRef.focus();
                    }}
                    maxLength={13}/>
                <Text style={{paddingLeft: 5}}>BDT</Text>
            </View>
            {this.state.error_amount !== "" ?
                <Text style={CommonStyle.errorStyle}>{this.state.error_amount}</Text> : null}
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
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    {/*
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("BeneficiaryMobileNumber")}>
                        <Image style={{
                            height: Utility.setHeight(20),
                            width: Utility.setWidth(20),
                            marginLeft: Utility.setWidth(10),
                            marginRight: Utility.setWidth(10),
                        }} resizeMode={"contain"}
                               source={require("../../resources/images/ic_beneficiary.png")}/>
                    </TouchableOpacity>
*/}
                    <TextInput
                        ref={(ref) => this.mobileNumberRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={"01********"}
                        onChangeText={text => this.setState({errorMobile: "", mobileNumber: Utility.userInput(text)})}
                        value={this.state.mobileNumber}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.remarksRef.focus();
                        }}
                        maxLength={11}/>
                </View>
                {this.state.errorMobile !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errorMobile}</Text> : null}
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
                    maxLength={30}/>
            </View>
            {this.state.error_remarks !== "" ?
                <Text style={CommonStyle.errorStyle}>{this.state.error_remarks}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View style={{
                marginStart: 10, marginEnd: 10, marginTop: 10, borderColor: themeStyle.BORDER,
                borderRadius: 5,
                overflow: "hidden",
                borderWidth: 2
            }}>
                <Text style={[CommonStyle.textStyle, {marginStart: 10, marginTop: 10}]}>
                    {language.case_code_via}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                </Text>
                <RadioForm
                    radio_props={language.bkash_otp_props}
                    initial={this.state.caseCodeType}
                    buttonSize={9}
                    selectedButtonColor={themeStyle.THEME_COLOR}
                    formHorizontal={false}
                    labelHorizontal={true}
                    borderWidth={1}
                    buttonColor={themeStyle.GRAY_COLOR}
                    labelColor={themeStyle.BLACK}
                    labelStyle={[CommonStyle.textStyle, {marginRight: 15}]}
                    style={{marginStart: 5, marginTop: 5, marginLeft: Utility.setWidth(20)}}
                    animation={true}
                    onPress={(value) => {
                        this.setState({caseCodeType: value});
                    }}
                />
            </View>

            {/*
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
*/}
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle, {flex: 1,}]}>
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
                <Text style={[CommonStyle.textStyle, {flex: 1}]}>
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

            <Text style={CommonStyle.mark_mandatory}>*{language.mark_field_mandatory}</Text>
            <View style={{marginStart: 10, marginEnd: 10}}>
                <Text style={CommonStyle.themeMidTextStyle}>{language.notes}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.cashBy_code_notes1}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.cashBy_code_notes2}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.cashBy_code_notes3}</Text>
            </View>
        </View>)
    }

    cashByCodeConfirm(language) {
        return (
            <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.select_card_title}
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.selectDebitType}</Text>
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
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.transferAmount}</Text>
                    <Text style={{paddingLeft: 5}}>BDT</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.beneficiary_mobile_number}
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.mobileNumber}</Text>
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
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.case_code_via}
                    </Text>
                    <Text style={CommonStyle.viewText}>{language.bkash_otp_props[this.state.caseCodeType].label}</Text>
                </View>
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
                                      }}
                                      onPress={() => Utility.logout(this.props.navigation, language)}>
                        <Image resizeMode={"contain"} style={{
                            width: Utility.setWidth(30),
                            height: Utility.setHeight(30),
                        }}
                               source={require("../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        {this.state.screenSwitcher ? this.cashByCodeConfirm(language) : this.cashByCodeView(language)}

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
            BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
        }
        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.transfer
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

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(CashByCode);
