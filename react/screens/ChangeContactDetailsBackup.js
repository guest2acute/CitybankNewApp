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
    TextInput, FlatList, Platform, StatusBar, Alert
} from "react-native";
import themeStyle from "../resources/theme.style";
import CommonStyle from "../resources/CommonStyle";
import React, {Component} from "react";
import {BusyIndicator} from "../resources/busy-indicator";
import Utility from "../utilize/Utility";
import RadioForm from "react-native-simple-radio-button";
import Config from "../config/Config";
import {CommonActions} from "@react-navigation/native";
import FontSize from "../resources/ManageFontSize";
import fontStyle from "../resources/FontStyle";
import MonthPicker from "react-native-month-year-picker";
import ApiRequest from "../config/ApiRequest";

let cardNumber = [{key: "0", label: "1234567890123456", value: 1234567890123456}, {
    key: "1",
    label: "4567890123456123",
    value: 4567890123456123
}];


class ChangeContactDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            select_contact_type: {label: props.language.select_contact_type, value: -1},
            select_actNo: props.language.select_actNo,
            selectType: props.language.selectType,
            selectTypeVal: -1,
            selectCard: props.language.selectCard,
            selectActCard: props.language.accountTypeArr[0],
            accountNo: "",
            cardPin: "",
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            expiryDate: "",
            creditCardNo: "",
            transactionPin: "",
            stateVal: 0,
            newPwd: "",
            errorNewPwd: "",
            conf_new_pwd: "",
            errorConfCredential: "",
            errorCredential: "",
            errorMobile:"",
            newCredential:"",
            confNewCredential:"",
            errorTransPin: "",
            errorExpiry:"",
            errorPin: "",
            otpVal: "",
            dateVal: new Date(),
            showMonthPicker: false,
            errorConfMobile:"",
            errorConfEmail:"",
            errorEmail:"",
            actNoList: [],
            responseArr:[],
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

    accountNoOption(language) {
        return (<View>
            <TouchableOpacity style={{marginTop: 20}}
                              onPress={() => this.openModal("accountListType", language.selectCard,this.state.actNoList, language)}>
                <View style={styles.selectionBg}>
                    <Text style={[CommonStyle.midTextStyle, {
                        color: this.state.select_actNo === language.select_actNo ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                        flex: 1
                    }]}>
                        {this.state.select_actNo}
                    </Text>
                    <Image resizeMode={"contain"} style={styles.arrowStyle}
                           source={require("../resources/images/ic_arrow_down.png")}/>
                </View>
            </TouchableOpacity>
            {this.state.select_actNo !== language.select_actNo ? <View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.transactionPin}
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
                            errorTransPin: "",
                            transactionPin: Utility.input(text, "0123456789")
                        })}
                        value={this.state.transactionPin}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={4}/>
                </View>
                {this.state.errorTransPin !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorTransPin}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            </View> : null}
        </View>)
    }

    creditCardOption(language) {
        return (<View>
            <TouchableOpacity style={{marginTop: 20}}
                              onPress={() => this.openModal("cardType", language.selectCard, this.state.actNoList, language)}>
                <View style={styles.selectionBg}>
                    <Text style={[CommonStyle.midTextStyle, {
                        color: this.state.select_actNo === language.select_actNo ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                        flex: 1
                    }]}>
                        {this.state.selectCard}
                    </Text>
                    <Image resizeMode={"contain"} style={styles.arrowStyle}
                           source={require("../resources/images/ic_arrow_down.png")}/>
                </View>
            </TouchableOpacity>


            <View>
                <View style={{
                    flexDirection: "row",
                    marginStart: 10,
                    height: Utility.setHeight(50),
                    alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.enterExpiry}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TouchableOpacity style={{
                        flex: 1,
                        marginLeft: 10
                    }} onPress={() => this.setState({errorExpiry: "",showMonthPicker: true})}>
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle, {
                                alignItems: "flex-end",
                                textAlign: 'right',
                                flex: 1,
                                marginLeft: 10
                            }]}
                            placeholder={language.enterCardExpiry}
                            editable={false}
                            value={this.state.expiryDate}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}
                            returnKeyType={"next"}
                            onSubmitEditing={(event)=>{
                                this.debitPinRef.focus();
                            }}
                            maxLength={5}/>
                    </TouchableOpacity>
                </View>
                {this.state.errorExpiry !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorExpiry}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
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
                        errorPin: "",
                        cardPin: Utility.input(text, "0123456789")})}
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
            {this.state.errorPin !== "" ?
                <Text style={{
                    marginLeft: 5,
                    marginRight: 10,
                    color: themeStyle.THEME_COLOR,
                    fontSize: FontSize.getSize(11),
                    fontFamily: fontStyle.RobotoRegular,
                    alignSelf: "flex-end",
                    marginBottom: 10,
                }}>{this.state.errorPin}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
        </View>)
    }

    onSelectItem(item) {
        const {modelSelection} = this.state;
        if (modelSelection === "accountListType") {
            console.log("accountlisttype is this",item)
            this.setState({select_actNo: item.ACCOUNT_NO, modalVisible: false})
        } else if (modelSelection === "contactType") {
            console.log("contact type")
            this.setState({select_contact_type: item, modalVisible: false, stateVal: 0})
        } else if (modelSelection === "accountType") {
            console.log("value is",item.value)
            console.log("account type is this",this.state.responseArr.ACCOUNT_DTL)

            this.setState({
                actNoList:item.value===0?this.state.responseArr.ACCOUNT_DTL: this.state.responseArr.CARD_DTL,
                modalVisible: false,selectTypeVal:item.value
            })

            /*if(item.key === 0){
                console.log("label 1 is this",item.label)
                //this.setState({ACCOUNT_DTL:this.state.responseArr.ACCOUNT_DTL,)}
            }*/
            /*this.setState({
                select_actNo: item.ACCOUNT_NO,
                selectTypeVal: parseInt(item.ACCOUNT_NO),
                modalVisible: false
            })*/
            //this.setState({selectActCard: item, modalVisible: false, stateVal: 0})
        } else if (modelSelection === "cardType") {
            console.log("item is this",item.label)
            this.setState({
                actNoList:item.value===1?this.state.responseArr.CARD_DTL:this.state.responseArr.ACCOUNT_DTL ,
                selectCard: item.label, modalVisible: false, stateVal: 0,selectTypeVal:item.value})
        }
    }

    async submit(language, navigation) {
        const {stateVal} = this.state;
        console.log("this.state.selectActCard", this.state.selectActCard);
        console.log("this.state.stateVal", this.state.stateVal);
        if(stateVal === 0){
            if (this.state.selectActCard.value === 0) {
                if (this.state.select_actNo === "Select Account Number") {
                    Utility.alert("Please Select Account Number");
                    return;
                } else if (this.state.transactionPin === "") {
                    this.setState({errorTransPin: language.errTransPin});
                    return;
                }else{
                    console.log("")
                    await this.contactType(language,navigation)
                }
            } else if(this.state.selectActCard.value === 1) {
                if(this.state.expiryDate === ""){
                    this.setState({errorExpiry: language.errExpiryDate});
                    return;
                }
                else if (this.state.cardPin === "") {
                    this.setState({errorPin: language.errCardPin});
                    return;
                }
            }
        }
        else if(stateVal === 1) {
            if (this.state.selectActCard.value === 0) {
                if (this.state.otpVal.length !== 4) {
                    Utility.alert(language.errOTP);
                    return;
                }
            }
        }
        else if(stateVal === 3) {
            if (this.state.newCredential === "") {
                this.setState({errorMobile: this.state.select_contact_type.value === 0 ? language.errorNewMobNo:language.errorEmail });
                return;
            }else if (this.state.confNewCredential !== this.state.newCredential ) {
                this.setState({errorConfMobile: this.state.select_contact_type.value === 0 ?language.errorMobConfNo:language.errorConfEmail});
                return;
            }
        }
        else if(stateVal === 4){
            Alert.alert(
                Config.appName,
                language.success_register,
                [
                    {
                        text: language.ok, onPress: () => navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{name: "LoginScreen"}],
                            })
                        )
                    },
                ]
            );
            return;
        }else{
            console.log("stateVal else part",stateVal)
        }
        this.setState({stateVal: stateVal !== 1 ? stateVal + 1 : stateVal + 2});
    }

    async contactType(language,navigation){
        console.log("called contct type ")
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
        await this.getAccountDetails();
    }

    async getAccountDetails() {
        let userDetails = this.props.userDetails;
        this.setState({isProgress: true});
        let result = await ApiRequest.apiRequest.getAccountDetails(userDetails, {});
        console.log("result", result);
        if (result.STATUS === "0") {
            let response = result.RESPONSE[0];
            console.log("response", response);
            this.setState({responseArr: response, isProgress: false});
        } else {
            this.setState({isProgress: false});
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }
    }

    backEvent() {
        const {stateVal} = this.state;
        if (stateVal === 0)
            this.props.navigation.goBack(null);
        else
            this.setState({stateVal: stateVal !== 3 ? stateVal - 1 : stateVal - 2});
    }

    passwordSet(language) {
        return (<View style={{
            borderColor: themeStyle.BORDER,
            marginLeft: 10, marginRight: 10,
            borderRadius: 5,
            marginTop: 10,
            overflow: "hidden",
            borderWidth: 2
        }}>
            <View>
                <View style={{
                    flexDirection: "row",
                    marginStart: 10,
                    height: Utility.setHeight(50),
                    alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {this.state.select_contact_type.value === 0 ? language.new_mobile_no : language.new_email}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.enterHere}
                        onChangeText={text => this.setState({
                            errorMobile:"",
                            errorEmail:"",
                            newCredential: this.state.select_contact_type.value === 0 ? Utility.input(text, "0123456789") : Utility.userInput(text)})}
                        value={this.state.newCredential}
                        multiline={false}
                        numberOfLines={1}
                        keyboardType={this.state.select_contact_type.value === 0 ? "number-pad" : "email-address"}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}/>
                </View>
                {this.state.errorMobile !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorMobile}</Text> : null}

                {/*{this.state.errorEmail !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorEmail}</Text> : null}*/}
            </View>
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
                        {this.state.select_contact_type.value === 0 ? language.conf_new_mobile_no : language.conf_new_email}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.enterHere}
                        onChangeText={text => this.setState({errorConfMobile:"",errorConfEmail:"",confNewCredential: this.state.select_contact_type.value === 0 ? Utility.input(text, "0123456789") : Utility.userInput(text)})}
                        value={this.state.confNewCredential}
                        multiline={false}
                        numberOfLines={1}
                        keyboardType={this.state.select_contact_type.value === 0 ? "number-pad" : "email-address"}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}/>
                </View>
                    {this.state.errorConfMobile !== "" ?
                        <Text style={{
                            marginLeft: 5,
                            marginRight: 10,
                            color: themeStyle.THEME_COLOR,
                            fontSize: FontSize.getSize(11),
                            fontFamily: fontStyle.RobotoRegular,
                            alignSelf: "flex-end",
                            marginBottom: 10,
                        }}>{this.state.errorConfMobile} </Text> : null }

            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
        </View>)
    }

    processStage(language) {
        if (this.state.selectActCard.value === 0)
            return this.state.stateVal === 0 ? this.accountNoOption(language) : this.state.stateVal === 1 ? this.otpEnter(language) : this.passwordSet(language);
        else
            return this.state.stateVal === 0 ? this.creditCardOption(language) : this.passwordSet(language);
    }

    otpEnter(language) {
        return (<View>
            <Text style={[CommonStyle.textStyle, {
                marginStart: Utility.setWidth(10),
                marginEnd: Utility.setWidth(10),
                marginTop: Utility.setHeight(10),
                marginBottom: Utility.setHeight(20),
            }]}> {language.otp_description + language.otp_pwd}</Text>
            <View style={{
                borderColor: themeStyle.BORDER,
                width: Utility.getDeviceWidth() - 30,
                marginStart: Utility.setWidth(10),
                marginEnd: Utility.setWidth(10),
                borderRadius: 5,
                overflow: "hidden",
                borderWidth: 2,
            }}>
                <View style={{
                    marginStart: 10, marginEnd: 10, marginTop: 10
                }}>
                    <Text style={[CommonStyle.labelStyle]}>
                        {language.otp}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle]}
                        placeholder={language.otp_input_placeholder}
                        onChangeText={text => this.setState({otpVal: Utility.input(text, "0123456789")})}
                        value={this.state.otpVal}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        secureTextEntry={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={4}/>
                </View>
            </View>
            <View style={{
                marginTop: Utility.setHeight(15),
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Text style={[CommonStyle.textStyle, {
                    textAlign: "center"
                }]}>{language.dnReceiveOTP}</Text>
                <TouchableOpacity>
                    <Text style={[CommonStyle.midTextStyle, {
                        textDecorationLine: "underline"
                    }]}>{language.sendAgain}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>)

    }

    mainLayout(language) {
        return (<View>
            <Text style={[CommonStyle.labelStyle, {
                color: themeStyle.THEME_COLOR,
                marginStart: 10,
                marginEnd: 10,
                marginTop: 6,
                marginBottom: 4
            }]}>
                {language.type_contact}
            </Text>

            <TouchableOpacity
                onPress={() => this.openModal("contactType", language.select_contact_type, language.contactList, language)}>
                <View style={styles.selectionBg}>
                    <Text style={[CommonStyle.midTextStyle, {color: themeStyle.BLACK, flex: 1}]}>
                        {this.state.select_contact_type.label}
                    </Text>
                    <Image resizeMode={"contain"} style={styles.arrowStyle}
                           source={require("../resources/images/ic_arrow_down.png")}/>
                </View>
            </TouchableOpacity>


            {this.state.select_contact_type.value !== -1 ? <View>
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
            </View> : null}
        </View>)
    }

    render() {
        let language = this.props.language;
        return (<View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={CommonStyle.toolbar}>
                    <TouchableOpacity
                        style={CommonStyle.toolbar_back_btn_touch}
                        onPress={() =>  this.backEvent()}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../resources/images/ic_back_android.png") : require("../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.change_contact}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        {this.state.stateVal === 0 ? this.mainLayout(language) : null}
                        {this.state.select_contact_type.value !== -1 ? this.processStage(language) : null}
                        {this.state.select_contact_type.value !== -1 ? <View style={{
                            flexDirection: "row",
                            marginStart: Utility.setWidth(10),
                            marginRight: Utility.setWidth(10),
                            marginTop: Utility.setHeight(20)
                        }}>
                            <TouchableOpacity style={{flex: 1}}
                                              onPress={() => this.submit(language, this.props.navigation)}>
                                <View style={{
                                    alignSelf: "center",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: Utility.getDeviceWidth() / 3,
                                    height: Utility.setHeight(46),
                                    borderRadius: Utility.setHeight(23),
                                    backgroundColor: themeStyle.THEME_COLOR
                                }}>
                                    <Text
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{this.state.stateVal !== 2 ? language.next : language.submit}</Text>
                                </View>
                            </TouchableOpacity>
                        </View> : null}
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
                                      data={this.state.modalData} keyExtractor={(item, index) => index + ""}
                                      renderItem={({item}) =>
                                          <TouchableOpacity onPress={() => this.onSelectItem(item)}>
                                              <View
                                                  style={{height: Utility.setHeight(35), justifyContent: "center"}}>
                                                  <Text
                                                      style={[CommonStyle.textStyle, {
                                                          color: themeStyle.THEME_COLOR,
                                                          marginStart: 10
                                                      }]}>{ this.state.selectTypeVal === 0 ? item.ACCOUNT_NO : null }</Text>
                                              </View>
                                              <View>
                                                  <Text>{item.label}</Text>
                                              </View>

                                          </TouchableOpacity>
                                      }
                                      ItemSeparatorComponent={this.renderSeparator}/>
                        </View>
                    </View>
                </Modal>
                {this.state.showMonthPicker ? <MonthPicker
                    onChange={this.onValueChange}
                    value={new Date()}
                    minimumDate={new Date()}
                    maximumDate={new Date(new Date().getFullYear() + 10, 12)}
                    locale="en"
                    mode="number"
                /> : null}
                <BusyIndicator visible={this.state.isProgress}/>
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
        userDetails: state.accountReducer.userDetails,
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(ChangeContactDetails);
