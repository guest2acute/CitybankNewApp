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
import {StackActions} from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

class FundTransfer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: "",
            currency: "",
            accountNo: "",
            mobile_number: "",
            emailTxt: "",
            errorEmail: "",
            error_nickname: "",
            error_accountNo: "",
            focusUid: false,
            focusPwd: false,
            isProgress: false,
            selectNicknameType: props.language.select_nickname,
            selectAcctType: props.language.select_from_account,
            selectToAcctType: props.language.select_to_acct,
            selectPaymentType: props.language.select_payment,
            selectDistrictType: props.language.select_district_type,
            selectBranchType: props.language.select_branch_type,
            // selectTypeAccount: props.language.select_type_account,
            selectTypeVal: -1,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            otp_type: 0,
            availableBalance: "",
            transferAmount: "",
            error_transferAmount: "",
            servicesCharge: "",
            error_servicesCharge: "",
            grandtotal: "",
            error_grandtotal: "",
            remarks: "",
            error_remarks: "",
            error_vat: "",
            vat: "",
            options: [
                {id: 0, title: props.language.ownAccount, selected: false},
                {id: 1, title: props.language.cityAccount, selected: true},
            ],
            show: false,
            mode: "date",
            dateVal: new Date(),
            errorpaymentdate: "",
            paymentdate: "",
            numberPayment: "",
            error_numberPayment: "",
            c: 0,
            stateVal: 0,
            error_toAccount: "",
            toAccount: "",
            firstAvailableBalance: "",
            error_availablebal: "",
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
            Utility.alert(language.noRecord,language.ok);
        }
    }

    showDatepicker = (id) => {
        this.setState({errorpaymentdate: "", currentSelection: id, show: true, mode: "date"});
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

    onSelectItem(item) {
        const {modelSelection} = this.state;
        if (modelSelection === "type") {
            this.setState({selectNicknameType: item.label, selectTypeVal: item.value, modalVisible: false})
        } else if (modelSelection === "fromAccountType") {
            this.setState({selectAcctType: item.label, selectTypeVal: item.value, modalVisible: false})
        } else if (modelSelection === "accountType") {
            this.setState({selectToAcctType: item.label, selectTypeVal: item.value, modalVisible: false})
        } else if (modelSelection === "paymentType") {
            this.setState({selectPaymentType: item.label, selectTypeVal: item.value, modalVisible: false})
        }
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

    getListViewItem = (item) => {
        this.setState({transferAmount: item.label})
    }

    backAction = () => {
        this.backEvent();
        return true;
    }

    backEvent() {
        const {stateVal} = this.state;
        console.log("log", stateVal);
        if (stateVal === 0)
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

    async onSubmit(language, navigation) {
        if (this.state.stateVal === 0) {
            if (this.state.selectAcctType === language.selectAccountType) {
                Utility.alert(language.error_select_from_type,language.ok);
            } else if (this.state.selectToAcctType === language.select_to_acct) {
                Utility.alert(language.error_select_to_type,language.ok);
            } else if (this.state.transferAmount === "") {
                this.setState({error_transferAmount: language.errtransferammt})
            } else if (this.state.transferAmount <= 500) {
                this.setState({error_transferAmount: language.error_less_ammt})
            } else if (this.state.remarks === "") {
                this.setState({error_remarks: language.errRemarks})
                return;
            }else{
                this.setState({stateVal: this.state.stateVal + 2});
            }
        } else if (this.state.stateVal === 1) {
            if (this.state.selectAcctType === language.selectAccountType) {
                Utility.alert(language.error_select_from_type,language.ok);
            }else if(this.state.selectNicknameType === language.select_nickname){
                Utility.alert(language.error_select_nickname_type,language.ok);
            }else if (this.state.transferAmount === "") {
                this.setState({error_transferAmount: language.errtransferammt})
            } else if (this.state.transferAmount <= 500) {
                this.setState({error_transferAmount: language.error_less_ammt})
            } else if (this.state.remarks === "") {
                this.setState({error_remarks: language.errRemarks})
            }else{
                this.setState({stateVal: this.state.stateVal + 3});
            }
        } else if (this.state.otp_type === 1) {
            console.log(this.state.paymentdate)
            if (this.state.paymentdate === "") {
                this.setState({errorpaymentdate: language.error_payment_date});
            }else if (this.state.selectPaymentType === language.select_payment) {
                Utility.alert(language.select_payment,language.ok);
            }else if(this.state.numberPayment===""){
                this.setState({error_numberPayment:language.error_numberPayment})
            }
        }
    }

    FundTransferDetails(language, flag) {
        console.log("fund transfer details", this.state.stateVal)
        return (
            <View style={{flex: 1}}>
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
                        /* onChangeText={text => this.setState({
                             firstAvailableBalance: Utility.userInput(text)
                         })}*/
                        value={this.state.firstAvailableBalance}
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
                        /*onChangeText={text => this.setState({
                            currency: Utility.userInput(text)
                        })}*/
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
                {this.state.stateVal === 2 ?
                    <>
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
                                     error_availablebal: "",
                                     availablebalance: Utility.userInput(text)
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
                    </>
                    :
                    <>
                        <View style={{
                            flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.nick_name}
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
                                    nickname: text
                                })}
                                value={this.state.nickname}
                                multiline={false}
                                numberOfLines={1}
                                editable={false}
                                contextMenuHidden={true}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}
                                returnKeyType={"next"}
                                onSubmitEditing={(event) => {
                                    this.accountNoRef.focus();
                                }}
                            />
                        </View>
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                        <View style={{
                            flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.to_account}
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
                                placeholder={""}
                                onChangeText={text => this.setState({
                                    error_toAccount: "",
                                    toAccount: Utility.userInput(text)
                                })}
                                value={this.state.toAccount}
                                multiline={false}
                                numberOfLines={1}
                                onFocus={() => this.setState({focusUid: true})}
                                onBlur={() => this.setState({focusUid: false})}
                                contextMenuHidden={true}
                                keyboardType={"number-pad"}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}
                                editable={false}
                                maxLength={13}/>
                        </View>
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                    </>
                }
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
                        /* onChangeText={text => this.setState({
                             transferAmount: Utility.userInput(text)
                         })}*/
                        value={this.state.transferAmount}
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
                    />
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
                        /*onChangeText={text => this.setState({
                            vat: Utility.userInput(text)
                        })}*/
                        value={this.state.vat}
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
                        /* onChangeText={text => this.setState({
                             grandtotal: Utility.userInput(text)
                         })}*/
                        value={this.state.grandtotal}
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
                        /*  onChangeText={text => this.setState({
                              remarks: Utility.userInput(text)
                          })}*/
                        value={this.state.remarks}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        editable={false}
                        maxLength={30}/>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            </View>
        )
    }

    accountNoOption(language, flag) {
        return (
            <View>
                <View style={{flex: 1}}>
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
                        onPress={() => this.openModal("fromAccountType", language.bkash_selectfrom_acct, language.cardNumber, language)}>
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
                            firstAvailableBalance: Utility.userInput(text)
                        })}
                        value={this.state.firstAvailableBalance}
                        multiline={false}
                        numberOfLines={1}
                        /* onFocus={() => this.setState({focusUid: true})}
                         onBlur={() => this.setState({focusUid: false})}*/
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
                        /*onChangeText={text => this.setState({
                            currency: Utility.userInput(text)
                        })}*/
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
                {this.state.stateVal === 0 ?
                    <>
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
                                onPress={() => this.openModal("accountType", language.bkash_selectfrom_acct, language.cardNumber, language)}>
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
                                     error_availablebal: "",
                                     availablebalance: Utility.userInput(text)
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
                        {this.state.error_availablebal !== "" ?
                            <Text style={CommonStyle.errorStyle}>{this.state.error_availablebal}</Text> : null}
                    </>
                    :
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
                            flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.to_account}
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
                                placeholder={""}
                                onChangeText={text => this.setState({
                                    error_toAccount: "",
                                    toAccount: Utility.userInput(text)
                                })}
                                value={this.state.toAccount}
                                multiline={false}
                                numberOfLines={1}
                                onFocus={() => this.setState({focusUid: true})}
                                onBlur={() => this.setState({focusUid: false})}
                                contextMenuHidden={true}
                                keyboardType={"number-pad"}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}
                                editable={false}
                                maxLength={13}/>
                        </View>
                    </>
                }
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                {/*   <View style={{ flexDirection: 'row',justifyContent:"space-around",paddingTop:10}}>*/}
                <FlatList horizontal={true}
                          data={language.balanceTypeArr}
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
                                      >{item.label}</Text>
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
                            transferAmount: Utility.userInput(text)
                        })}
                        value={this.state.transferAmount}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
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
                    <Text style={[CommonStyle.textStyle]}>
                        {language.services_charge}
                    </Text>
                    <TextInput
                        ref={(ref) => this.servicesChargeRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={"00.00"}
                        onChangeText={text => this.setState({
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
                    />
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
                    />
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
                            grandtotal: Utility.userInput(text)
                        })}
                        value={this.state.grandtotal}
                        multiline={false}
                        numberOfLines={1}
                        onFocus={() => this.setState({focusUid: true})}
                        onBlur={() => this.setState({focusUid: false})}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        editable={false}
                    />
                </View>
                {this.state.error_grandtotal !== "" ?
                    <Text style={CommonStyle.errorStyle
                    }>{this.state.error_grandtotal}</Text> : null}
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
                        ref={(ref) => this.grandtotalRef = ref}
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
                        maxLength={30}/>
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
                            this.setState({otp_type: value});
                        }}
                    />
                </View>

                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
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
                        {this.state.errorpaymentdate !== "" ?
                            <Text style={{
                                marginLeft: 5,
                                marginRight: 10,
                                color: themeStyle.THEME_COLOR,
                                fontSize: FontSize.getSize(11),
                                fontFamily: fontStyle.RobotoRegular,
                                alignSelf: "flex-end",
                                marginBottom: 10,
                            }}>{this.state.errorpaymentdate}</Text> : null}
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
                            flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
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
                                onFocus={() => this.setState({focusUid: true})}
                                onBlur={() => this.setState({focusUid: false})}
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
                <Text style={CommonStyle.mark_mandatory}>*{language.mark_field_mandatory}</Text>
                <View style={{marginStart: 10, marginEnd: 10}}>
                    <Text style={CommonStyle.themeMidTextStyle}>{language.notes}</Text>
                    {this.state.stateVal === 0 ?
                        <View>
                            <Text style={CommonStyle.themeTextStyle}>{language.fund_transfer_note1}</Text>
                            <Text style={CommonStyle.themeTextStyle}>{language.fund_transfer_note2}</Text>
                        </View>
                        :
                        <>
                            <Text style={CommonStyle.themeTextStyle}>{language.fund_transferCity_note1}</Text>
                            <Text style={CommonStyle.themeTextStyle}>{language.fund_transferCity_note2}</Text>
                        </>
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
        console.log("cardCode", cardCode)
        this.setState({
            stateVal: cardCode
        })
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
                                      }}
                                      onPress={() => Utility.logout(this.props.navigation, language)}>
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
                                //width: Utility.setWidth(65),
                                paddingLeft: 40,
                                paddingRight: 40,
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
                                //width: Utility.setWidth(65),
                                paddingLeft: 40,
                                paddingRight: 40,
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
                        {this.state.stateVal === 2 || this.state.stateVal === 4 ? this.FundTransferDetails(language, false) : this.accountNoOption(language, true)}
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
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{this.state.stateVal === 3 ? language.submit_txt : this.state.stateVal === 2 || this.state.stateVal === 4 ? language.transfer : language.next}</Text>
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
                        value={this.state.dateVal}
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
    headerLabel: {
        flexDirection: "row",
        //backgroundColor: themeStyle.THEME_COLOR,
        height: Utility.setHeight(40),
        borderRadius: 5,
        borderWidth: 1,
        borderColor: themeStyle.WHITE,
        overflow: "hidden"
    },
}

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(FundTransfer);
