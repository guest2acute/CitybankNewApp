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
import {AddBeneficiary, GETACCTBALDETAIL} from "../Requests/RequestBeneficiary";

class OtherBankAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: "",
            accountNo: "2101636171001",
            mobile_number: "",
            emailTxt: "",
            errorEmail: "",
            error_nickname: "",
            error_accountNo: "",
            focusUid: false,
            focusPwd: false,
            isProgress: false,
            selectNicknameType: props.language.select_nickname,
            selectAcctType: props.language.bkash_select_acct,
            selectPaymentType: props.language.select_payment,
            selectDistrictType: props.language.select_district_type,
            selectBranchType: props.language.select_branch_type,
            selectTypeVal: -1,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            otp_type: 0,
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
            paymentdate:"",
            errorPaymentDate: "",
            mode: "date",
            dateVal: new Date(),
            selected:false,
            stageVal:0,
            transferMode:false,
            accountDetails:"",
            type_act: "",
            account_holder_name:"",
            currency:""
        }
    }
    backAction = () => {
        this.backEvent();
        return true;
    }

    backEvent() {
        const {stageVal} = this.state;
        console.log("log", stageVal);
        if (stageVal === 0)
            this.props.navigation.goBack();
        else
            this.setState({stageVal: stageVal - 1});
    }

    componentWillUnmount(){
        if (Platform.OS === "android") {
            BackHandler.removeEventListener("hardwareBackPress", this.backAction);
        }
    }

    showDatepicker = (id) => {
        console.log("click");
        this.setState({errorPaymentDate: "", currentSelection: id, show: true, mode: "date"});
    };

    onChange = (event, selectedDate) => {
        if (event.type !== "dismissed" && selectedDate !== undefined) {
            console.log("selectedDate-", selectedDate);
            let currentDate = selectedDate === "" ? new Date() : selectedDate;
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
                modalData: data, modalVisible: true,selected:false
            });
        } else {
            Utility.alert(language.noRecord);
        }
    }

    onSelectItem(item) {
        const {modelSelection} = this.state;
        if (modelSelection === "type") {
            console.log("selected value is this",item.value)
            this.setState({selectNicknameType: item.label,selectTypeVal: item.value, modalVisible: false})
            this.alertToNavigate();
        } else if (modelSelection === "bankType") {
            this.setState({selectAcctType: item.label, selectTypeVal: item.value, modalVisible: false})
        } else if (modelSelection === "district_type") {
            this.setState({selectDistrictType: item.label, selectTypeVal: item.value, modalVisible: false})
        } else if (modelSelection === "branch_type") {
            this.setState({selectBranchType: item.label, selectTypeVal: item.value, modalVisible: false})
        }else if (modelSelection === "paymentType") {
            this.setState({selectPaymentType: item.label, selectTypeVal: item.value, modalVisible: false})
        }
    }

     alertToNavigate(){
                  Alert.alert(
                     Config.appName,
                     this.props.language.update_beneficiary_alert,
                     [
                         {text: this.props.language.yes_txt, onPress: () => this.props.navigation.navigate("BeneficiaryOtherBank",{title:this.props.language.update_beneficiary})},
                         {text: this.props.language.no_txt},
                     ]
                 );
    }

    userInput(text) {
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        this.setState({nickname: text, error_nickname: ""})
    }

    accountchange(text) {
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        this.setState({accountNo: text, error_accountNo: ""})
    }

    async onSubmit(language, navigation) {
        console.log("stageVal next screen",this.state.stageVal)
        console.log("otp_type is this",this.state.otp_type)
        if(this.state.stageVal===0) {
            if (this.state.selectAcctType === language.bkash_select_acct) {
                Utility.alert(language.error_select_from_type);
                return;
            } else if (this.state.selectNicknameType === language.selectNickType) {
                Utility.alert(language.error_select_nickname);
                return;
            } else if (this.state.transferAmount === "") {
                this.setState({errorTransferAmount: language.errtransferammt})
                return;
            }
            else if (this.state.remarks === "") {
                this.setState({error_remarks: language.errRemarks})
                return;
            }
            else if(this.state.otp_type ===1) {
                console.log("payment date is this",this.state.paymentdate)
                if (this.state.paymentdate === "") {
                    this.setState({errorPaymentDate: language.error_payment_date});
                }
            else if (this.state.selectPaymentType === language.select_payment) {
                    Utility.alert(language.select_payment);
                    return;
                }else if(this.state.numberPayment===""){
                    this.setState({error_numberPayment:language.error_numberPayment})
                    return;
                }
            }else {
                    //this.setState({stageVal: this.state.stageVal + 1});
                this.getActDetails(language);
                this.beneficiaryAdd(language);
                }
        }else if(this.state.stageVal === 1) {
            this.getActDetails(language);
            this.beneficiaryAdd(language);
        }
        // Utility.alertWithBack(language.ok_txt, language.success_saved, navigation)
    }

    getActDetails(language) {
        console.log("get account details",this.state.accountNo)
        if (this.state.accountNo.length !== 13) {
            this.setState({error_accountNo: language.require_accnumber})
            return;
        }
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
                mobile_number: "",
                emailTxt: "",
                stageVal: 0,
                accountDetails: null,
            })
        }
    }


    beneficiaryAdd(language) {
        this.props.navigation.navigate("SecurityVerification", {
            REQUEST_CD: "",
            transType: "O",
            actNo: this.state.accountNo,
            resetScreen: this.resetScreen
        })
    }


    getListViewItem = (item) => {
        this.setState({transferAmount: item.label})
    }

    transferModeShow(text){
        console.log("show",text)
        if(text.length !== 0 ){
            this.setState({
                transferAmount:text,
                transferMode:true
            })
        }
        else if(text > 100000 || text <= 100000){
            console.log("text is this",text)
            this.setState({
                transferAmount:text,
                transferMode:true
            })
        }
        else{
            this.setState({
                transferAmount:text,
                transferMode:true
            })
        }
    }

    otherBankAccount(language){
        return(
            <View>
                <Text>other bank account</Text>
            </View>
        )
    }

    accountNoOption(language,flag) {
        console.log(flag)
        return (<View>
            {flag?
            <View style={{flex: 1}}>
                {<Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                    marginBottom: 4
                }]}>
                    {language.fromAccount}
                    <Text style={{color: themeStyle.THEME_COLOR}}> {flag?"*":""}</Text>
                </Text>
                }
                <TouchableOpacity
                    onPress={() => this.openModal("bankType", language.bkash_selectfrom_acct, language.cardNumber, language)}>
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
            </View>:
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.fromAccount}
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
                        /* onChangeText={text => this.setState({
                             nickname: text
                         })}*/
                        value={this.state.fromAccount}
                        multiline={false}
                        numberOfLines={1}
                        editable={false}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    />
                </View>
            }
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.available_bal}
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
                <Text style={[CommonStyle.textStyle]}>
                    {language.currency}
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
            {flag?
                <>
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
                    onPress={() => this.openModal("type", language.selectNickType, language.nickTypeArr, language)}>
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
                <FlatList horizontal={true}
                          data={language.balanceTypeArr}
                          renderItem={({item}) =>
                              <View>
                                  <TouchableOpacity onPress={this.getListViewItem.bind(this, item)} style={{
                                      marginRight: 10,
                                      marginLeft: 10,
                                      marginTop: 10,
                                      marginBottom:10,
                                      borderRadius: 3,
                                      padding: 7,
                                      flexDirection: 'row',
                                      justifyContent: "space-around",
                                      backgroundColor: themeStyle.THEME_COLOR
                                  }}>
                                      <Text style={[CommonStyle.textStyle, {color: themeStyle.WHITE}]}>{item.label}</Text>
                                  </TouchableOpacity>
                              </View>
                          }
                />
                </>
                :
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
            }
            {/*<View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>*/}

            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.transfer_amount}
                    <Text style={{color: themeStyle.THEME_COLOR}}>{flag ? "*" : ""}</Text>
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
                    editable={flag?true:false}
                    autoCorrect={false}
                    />
            </View>
            {this.state.errorTransferAmount !== "" ?
                <Text style={CommonStyle.errorStyle}>{this.state.errorTransferAmount}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

            {flag ?
                <View style={{flexDirection: "row", marginStart: 10, marginEnd: 10}}>
                    <Text style={[CommonStyle.textStyle, {marginTop: 10}]}>
                        {language.transfer_mode}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>
                    <RadioForm
                        radio_props={language.other_bank_props}
                        initial={0}
                        buttonSize={9}
                        selectedButtonColor={themeStyle.THEME_COLOR}
                        formHorizontal={false}
                        labelHorizontal={true}
                        borderWidth={1}
                        borderColor={themeStyle.PLACEHOLDER_COLOR}
                        buttonColor={themeStyle.GRAY_COLOR}
                        labelColor={themeStyle.PLACEHOLDER_COLOR}
                        labelStyle={[CommonStyle.textStyle, {color: this.state.transferMode ? themeStyle.BLACK : themeStyle.PLACEHOLDER_COLOR}]}
                        style={{marginStart: 15, marginTop: 10, marginBottom: 10}}
                        animation={true}
                        onPress={(value) => {
                            this.setState({otp_type: value});
                        }}
                    />
                </View>
            :
                <View style={{flexDirection: "row", marginStart: 10, marginEnd: 10}}>
                    <Text style={[CommonStyle.textStyle, {marginTop: 10}]}>
                        {language.transfer_mode}
                        <Text style={{color: themeStyle.THEME_COLOR}}>{flag ? "*" : ""}</Text>
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
                        value={this.state.transfermode}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        editable={false}
                    />
                </View>
            }
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.to_account}
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
                    editable={false}
                    maxLength={13}/>
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.bank_name}
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
                        bankName: Utility.userInput(text)
                    })}
                    value={this.state.bankName}
                    multiline={false}
                    numberOfLines={1}
                    contextMenuHidden={true}
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
                    {language.account_type}
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
                        accountType: Utility.userInput(text)
                    })}
                    value={this.state.accountType}
                    multiline={false}
                    numberOfLines={1}
                    contextMenuHidden={true}
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
                <Text style={[CommonStyle.textStyle]}>
                    {language.district_type}
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
                        districtName: Utility.userInput(text)
                    })}
                    value={this.state.districtName}
                    multiline={false}
                    numberOfLines={1}
                    onFocus={() => this.setState({focusUid: true})}
                    onBlur={() => this.setState({focusUid: false})}
                    contextMenuHidden={true}
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
                <Text style={[CommonStyle.textStyle]}>
                    {language.branch_name}
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
                        branchName: Utility.userInput(text)
                    })}
                    value={this.state.branchName}
                    multiline={false}
                    numberOfLines={1}
                    contextMenuHidden={true}
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
                <Text style={[CommonStyle.textStyle]}>
                    {language.services_charge}
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
                <Text style={[CommonStyle.textStyle]}>
                    {language.vat}
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
                <Text style={[CommonStyle.textStyle]}>
                    {language.grand_total}
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
                    <Text style={{color: themeStyle.THEME_COLOR}}> {flag?"*":""}</Text>
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
                    onFocus={() => this.setState({focusUid: true})}
                    onBlur={() => this.setState({focusUid: false})}
                    contextMenuHidden={true}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    editable={flag?true:false}
                    maxLength={30}/>
            </View>
            {this.state.error_remarks !== "" ?
                <Text style={CommonStyle.errorStyle
                }>{this.state.error_remarks}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            {flag?
                <>
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
                        this.setState({otp_type: value});
                    }}
                />
            </View>
                </>
                :
                <>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.otpType}
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
                        value={this.state.otpType}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={13}/>
                </View>
                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                    <View style={{
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
                </View>
                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                </>

            }

            {this.state.otp_type === 1 ?
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

            {flag?
            <Text style={CommonStyle.mark_mandatory}>*{language.mark_field_mandatory}</Text>:null}
            {flag?
            <View style={{marginStart:10,marginEnd:10}}>
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
            </View>:
            null}
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
                    <Text style={CommonStyle.title}>{this.state.stageVal===0?language.other_bank_account_title:language.fund_transfer_bank}</Text>
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
                        {this.state.stageVal===0?this.accountNoOption(language,true):this.accountNoOption(language,false)}

                        <View style={{
                            flexDirection: "row",
                            marginStart: Utility.setWidth(10),
                            marginRight: Utility.setWidth(10),
                            marginTop: Utility.setHeight(20)
                        }}>
                            <TouchableOpacity style={{flex: 1}}  onPress={() => this.backEvent()}>
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
}

const mapStateToProps = (state) => {
    return {
        userDetails: state.accountReducer.userDetails,
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(OtherBankAccount);
