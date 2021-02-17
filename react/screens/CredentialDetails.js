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
    TextInput, FlatList, Platform, StatusBar
} from "react-native";
import themeStyle from "../resources/theme.style";
import CommonStyle from "../resources/CommonStyle";
import React, {Component, useCallback} from "react";
import {BusyIndicator} from "../resources/busy-indicator";
import Utility from "../utilize/Utility";
import RadioForm from "react-native-simple-radio-button";
import MonthPicker from 'react-native-month-year-picker';
import ApiRequest from "../config/ApiRequest";
import StorageClass from "../utilize/StorageClass";
import Config from "../config/Config";
import {StackActions} from "@react-navigation/native";


let cardNumber = [{key: "0", label: "1234567890123456", value: 1234567890123456}, {
    key: "1",
    label: "4567890123456123",
    value: 4567890123456123
}];


class CredentialDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            selectType: props.language.selectType,
            selectTypeVal: -1,
            selectCard: props.language.selectCard,
            selectActCard: props.language.accountTypeArr[0],
            accountNo: "2101038360001",
            cardPin: "",
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            expiryDate: "",
            creditCardNo: "",
            transactionPin: "",
            cityTouchUserId: "",
            errActNo: "",
            errTransPin: "",
            errorUid: "",
            errExpiryDate: "",
            errCardNo: "",
            errCardPin: "",
            showMonthPicker: false
        }
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    marginStart: 5,
                    marginEnd: 5,
                    backgroundColor: themeStyle.SEPARATOR,
                }}
            />
        );
    };

    openModal(option, title, data, language) {
        if (data.length > 0) {
            this.setState({
                modelSelection: option,
                modalTitle: title,
                modalData: data, modalVisible: true
            });
        } else {
            Utility.alert(language.noRecord);
        }
    }

    componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.THEME_COLOR);
                StatusBar.setBarStyle("light-content");
            });
        }
    }

    accountNoOption(language) {
        return (<View>
            <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>

                    <Text style={[CommonStyle.textStyle]}>
                        {language.actNo}
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
                        placeholder={language.actNo_here}
                        onChangeText={text => this.setState({
                            errActNo: "",
                            accountNo: Utility.input(text, "0123456789")
                        })}
                        value={this.state.accountNo}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.tPinRef.focus();
                        }}
                        maxLength={13}/>
                </View>
                {this.state.errActNo !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errActNo}</Text> : null}
            </View>

            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.transactionPin}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>
                    <TextInput
                        ref={(ref) => this.tPinRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.enterPinHere}
                        onChangeText={text => this.setState({
                            errTransPin: "",
                            transactionPin: Utility.input(text, "0123456789")
                        })}
                        value={this.state.transactionPin}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        secureTextEntry={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={4}/>
                </View>
                {this.state.errTransPin !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errTransPin}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

            {/*  <Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.THEME_COLOR,
                            marginStart: 10,
                            marginEnd: 10,
                            marginTop: 10,
                            marginBottom: 5
                        }]}>
                            {language.selectCard} *
                        </Text>
                        <TouchableOpacity
                            onPress={() => this.openModal("cardType", language.selectCard, cardNumber, language)}>
                            <View style={styles.selectionBg}>
                                <Text style={[CommonStyle.midTextStyle, {
                                    color: this.state.selectCard === language.selectCard ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                    flex: 1
                                }]}>
                                    {this.state.selectCard}
                                </Text>
                                <Image resizeMode={"contain"} style={styles.arrowStyle}
                                       source={require("../resources/images/ic_arrow_down.png")}/>
                            </View>
                        </TouchableOpacity> */}
        </View>)
    }

    creditCardOption(language) {
        return (<View>
            <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.credit_card_no}
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
                        placeholder={language.enter_card_no}
                        onChangeText={text => this.setState({
                            errCardNo: "",
                            creditCardNo: Utility.input(text, "0123456789")
                        })}
                        value={this.state.creditCardNo}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={16}/>
                </View>
                {this.state.errCardNo !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errCardNo}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.enterExpiry}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>
                    <TouchableOpacity style={{
                        flex: 1,
                        marginLeft: 10
                    }} onPress={() => this.setState({showMonthPicker: true})}>
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle, {
                                alignItems: "flex-end",
                                textAlign: 'right',
                            }]}
                            placeholder={language.expiryDate}
                            editable={false}
                            value={this.state.expiryDate}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}/>
                    </TouchableOpacity>
                </View>
                {this.state.errExpiryDate !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errExpiryDate}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.enterCardPin}
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
                        placeholder={language.enterPinHere}
                        onChangeText={text => this.setState({
                            errCardPin: "",
                            cardPin: Utility.input(text, "0123456789")
                        })}
                        value={this.state.cardPin}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        secureTextEntry={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={4}/>
                </View>
                {this.state.errCardPin !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errCardPin}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

        </View>)
    }

    onSelectItem(item) {
        const {modelSelection} = this.state;
        if (modelSelection === "type") {
            this.setState({selectType: item.label, selectTypeVal: item.value, modalVisible: false})
        } else if (modelSelection === "accountType") {
            this.setState({selectActCard: item, modalVisible: false})
        } else if (modelSelection === "cardType") {
            this.setState({selectCard: item.label, modalVisible: false})
        }
    }

    async submit(language, navigation) {
        let otpMsg = "", successMsg = "";
        if (this.state.selectTypeVal === -1) {
            Utility.alert(language.errValidType);
            return;
        } else if (this.state.selectTypeVal > 0 && (this.state.cityTouchUserId.length < 8 || this.state.cityTouchUserId.length > 12)) {
            this.setState({errorUid: language.invalidUid});
            return;
        } else if (this.state.selectActCard.value === 0) {
            if (this.state.accountNo.length !== 13) {
                this.setState({errActNo: language.errActNo});
                return;
            } else if (this.state.transactionPin.length !== 4) {
                this.setState({errTransPin: language.errTransPin});
                return;
            }
        } else if (this.state.selectActCard.value === 1) {
            if (this.state.creditCardNo.length === 0) {
                this.setState({errCardNo: language.errCardNo});
                return;
            } else if (this.state.expiryDate.length !== 5) {
                this.setState({errExpiryDate: language.errExpiryDate});
                return;
            } else if (this.state.cardPin.length !== 4) {
                this.setState({errCardPin: language.errCardPin});
                return;
            }
        }

        await this.getUserID(this.state.selectActCard.value === 1);

    }

    async getUserID(isCard) {
        this.setState({isProgress: true});
        let actNo = isCard ? this.state.creditCardNo : this.state.accountNo;
        let commonReq = {
            ACCT_NO: actNo,
            ACTION: isCard ? "VERIFYCARDGETUID" : "GETUSERALLEXISTS",
            AUTHORIZATION: Config.AUTH,
            REG_WITH: isCard ? "C" : "A",
            ...Config.commonReq
        }
        if (isCard) {
            commonReq = {
                ...commonReq,
                CARD_PIN: this.state.cardPin,
                EXPIRY_DATE: this.state.expiryDate.replace("/", ""),
            }
        }

        console.log("request", commonReq);
        let result = await ApiRequest.apiRequest.callApi(commonReq, {});
        console.log("result", result);
        result = result[0];
        if (result.STATUS === "0") {
            let response = result.RESPONSE[0];
            await this.resetPwd(response.USER_ID, actNo, isCard);
        } else {
            this.setState({isProgress: false});
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }
    }

    refresh = (data) => {
        if (data === "success") {
            this.resetAll();
        }
    }

    resetAll() {
        this.setState({
            accountNo: "",
            cardPin: "",
            expiryDate: "",
            creditCardNo: "",
            transactionPin: "",
            cityTouchUserId: ""
        });
    }

    async resetPwd(responseUid, actNo, isCard) {
        let language = this.props.language;
        let resetReq = {
            DEVICE_ID: Utility.getDeviceID(),
            USER_ID: responseUid,
            RESET_BY: "U",
            AUTH_TOKEN: Config.AUTH.ACCESS_TOKEN,
            PASS_TYPE: "L",
            ACCT_NO: actNo,
            REQ_FLAG: "R",
            RESET_TYPE: "F",
            REQ_TYPE: "P",
            ACTION: "RESETPWD",
            CARD_USER_ID: responseUid,
            AUTH_TYPE: isCard ? "CP" : "TP",
            ...Config.commonReq
        }
        if (!isCard) {
            resetReq = {...resetReq, TRANSACTION_PIN: this.state.transactionPin}
        }
        console.log("request", resetReq);
        let result = await ApiRequest.apiRequest.callApi(resetReq, {});
        console.log("result", result);
        result = result[0];
        this.setState({isProgress: false});
        console.log("responseVal", result.RESPONSE[0])
        if (result.STATUS === "0"  || result.STATUS === "999") {
            if (isCard) {
                this.resetAll();
                Utility.alert(result.MESSAGE);
            } else {
                let response = result.RESPONSE[0];
                let otpMsg = "";
                if (this.state.selectTypeVal === 0) {
                    otpMsg = language.otp_fgt_uid;
                } else if (this.state.selectTypeVal === 1) {
                    otpMsg = language.otp_fgt_pwd;
                } else if (this.state.selectTypeVal === 2) {
                    otpMsg = language.otp_fgt_pin;
                }
                this.props.navigation.navigate("OTPScreen", {
                    value: isCard ? 1 : 0,
                    onGoBack: this.refresh,
                    description: otpMsg,
                    response: response
                });
            }
        } else {
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }

    }

    async processAccount(isCard) {
        this.setState({isProgress: true});
        let accountReq = {
            ACCT_NO: this.state.accountNo,
            ACTION: "GETUSERALLEXISTS",
            AUTHORIZATION: Config.AUTH,
            REG_WITH: "A",
            ...Config.commonReq
        }


        console.log("request", accountReq);
        let result = await ApiRequest.apiRequest.callApi(accountReq, {});
        console.log("result", result);
        result = result[0];
        this.setState({isProgress: false});
        console.log("responseVal", result.RESPONSE[0])
        if (result.STATUS === "0") {

        } else {
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }

    }


    onValueChange = (event, newDate) => {
        console.log("event", event + "-" + newDate);
        let dateVal = Utility.dateInFormat(newDate, "MM/YY")
        switch (event) {
            case "dateSetAction":
                console.log("event", "in");
                this.setState({expiryDate: dateVal, showMonthPicker: false});
                break;
            case "neutralAction":
                break;
            case "dismissedAction":
            default:
                this.setState({showMonthPicker: false});
        }
    }


    render() {
        let language = this.props.language;
        return (<View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={CommonStyle.toolbar}>
                    <TouchableOpacity
                        style={CommonStyle.toolbar_back_btn_touch}
                        onPress={() => this.props.navigation.goBack(null)}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../resources/images/ic_back_android.png") : require("../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.credentialDetails}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        <Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.THEME_COLOR,
                            marginStart: 10,
                            marginEnd: 10,
                            marginTop: 6,
                            marginBottom: 4
                        }]}>
                            {language.selectionType}
                        </Text>
                        <TouchableOpacity
                            onPress={() => this.openModal("type", language.selectType, language.optionTypeArr, language)}>
                            <View style={styles.selectionBg}>
                                <Text style={[CommonStyle.midTextStyle, {
                                    color: this.state.selectType === language.selectType ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                    flex: 1
                                }]}>
                                    {this.state.selectType}
                                </Text>
                                <Image resizeMode={"contain"} style={styles.arrowStyle}
                                       source={require("../resources/images/ic_arrow_down.png")}/>
                            </View>
                        </TouchableOpacity>
                        {this.state.selectTypeVal > 0 ?
                            <View>
                                <View style={{
                                    flexDirection: "row",
                                    height: Utility.setHeight(50),
                                    marginStart: 10,
                                    alignItems: "center",
                                    marginEnd: 10,
                                }}>
                                    <Text style={[CommonStyle.textStyle]}>
                                        {language.cityTouchUserId}
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
                                        placeholder={language.enterUserId}
                                        onChangeText={text => this.setState({
                                            errorUid: "",
                                            cityTouchUserId: Utility.userInput(text)
                                        })}
                                        value={this.state.cityTouchUserId}
                                        multiline={false}
                                        numberOfLines={1}
                                        contextMenuHidden={true}
                                        keyboardType={"number-pad"}
                                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                        autoCorrect={false}
                                        maxLength={12}/>
                                </View>
                                {this.state.errorUid !== "" ?
                                    <Text style={CommonStyle.errorStyle}>{this.state.errorUid}</Text> : null}
                                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                            </View> : null}

                        <Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.THEME_COLOR,
                            marginStart: 10,
                            marginEnd: 10,
                            marginTop: 6,
                            marginBottom: 4
                        }]}>
                            {language.type_act}
                        </Text>

                        <TouchableOpacity
                            onPress={() => this.openModal("accountType", language.selectActType, language.accountTypeArr, language)}>
                            <View style={styles.selectionBg}>
                                <Text style={[CommonStyle.midTextStyle, {color: themeStyle.BLACK, flex: 1}]}>
                                    {this.state.selectActCard.label}
                                </Text>
                                <Image resizeMode={"contain"} style={styles.arrowStyle}
                                       source={require("../resources/images/ic_arrow_down.png")}/>
                            </View>
                        </TouchableOpacity>
                        {this.state.selectActCard.value === 0 ? this.accountNoOption(language) : this.creditCardOption(language)}

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
                                              onPress={() => this.submit(language, this.props.navigation)}>
                                <View style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: Utility.setHeight(46),
                                    borderRadius: Utility.setHeight(23),
                                    backgroundColor: themeStyle.THEME_COLOR
                                }}>
                                    <Text
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{this.state.selectActCard.value === 0 ? language.next : language.submit}</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                        <Text style={{marginStart: 10, marginTop: 20, color: themeStyle.THEME_COLOR}}>
                            *{language.mark_field_mandatory}
                        </Text>
                    </View>
                </ScrollView>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({modalVisible: false})
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
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
                {this.state.showMonthPicker ? <MonthPicker
                    onChange={this.onValueChange}
                    value={new Date()}
                    minimumDate={new Date()}
                    maximumDate={new Date(new Date().getFullYear() + 10, 12)}
                    locale="en"
                    mode="number"
                /> : null}

            </View>
        )
    }

}

const styles = {
    arrowStyle: {
        tintColor: themeStyle.BLACK,
        width: Utility.setWidth(35),
        height: Utility.setHeight(30)
    },
    selectionBg: {
        paddingStart: 10,
        paddingBottom: 4,
        paddingTop: 4,
        paddingEnd: 10,
        flexDirection: "row",
        backgroundColor: themeStyle.SELECTION_BG,
        alignItems: "center"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: Utility.getDeviceWidth() - 30,
        overflow: "hidden",
        borderRadius: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    }

}

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(CredentialDetails);
