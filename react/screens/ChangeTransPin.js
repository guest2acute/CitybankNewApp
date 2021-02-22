import React, {Component} from "react";
import {connect} from "react-redux";
import {
    FlatList,
    Image,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text, TextInput,
    TouchableOpacity,
    View,
    BackHandler
} from "react-native";
import themeStyle from "../resources/theme.style";
import CommonStyle from "../resources/CommonStyle";
import Utility from "../utilize/Utility";
import {BusyIndicator} from "../resources/busy-indicator";
import FontSize from "../resources/ManageFontSize";
import fontStyle from "../resources/FontStyle";
import ApiRequest from "../config/ApiRequest";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import Config from "../config/Config";


class ChangeTransPin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: 0,
            select_actNo: props.language.select_actNo,
            selectTypeVal: -1,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            fatherName: "",
            errorFather: "",
            motherName: "",
            errorMother: "",
            isProgress: false,
            dateVal: new Date(),
            mode: "date",
            show: false,
            dob: "",
            errorDob: "",
            pinVal: "",
            errorPinVal: "",
            ConfirmPinVal: "",
            errorConfirmPinVal: "",
            actNoList: [],
            verifyRes: "",
            otpVal: ""
        }
    }

    backAction = () => {
        this.backBtn();
        return true;
    }

    async backBtn() {
        const {stage} = this.state;
        if (stage > 0) {
            this.setState({
                stage: 0, pinVal: "",
                errorPinVal: "",
                ConfirmPinVal: "",
                errorConfirmPinVal: "",
                otpVal: ""
            });
        }else {
            this.props.navigation.goBack();
        }
    }


    async componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.THEME_COLOR);
                StatusBar.setBarStyle("light-content");
            });
            this.backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
        }
        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.more
        });
        await this.getAccountDetails();
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener(
                "hardwareBackPress", this.backHandler)
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
            Utility.alert(language.noRecord);
        }
    }

    async getAccountDetails() {
        let userDetails = this.props.userDetails;
        this.setState({isProgress: true});
        let result = await ApiRequest.apiRequest.getAccountDetails(userDetails, {});
        console.log("result", result);
        if (result.STATUS === "0") {
            let response = result.RESPONSE[0];
            console.log("response", response);
            this.setState({actNoList: response.ACCOUNT_DTL, isProgress: false});
        } else {
            this.setState({isProgress: false});
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }
    }

    enterPIN(language) {
        return (<View style={{
            borderColor: themeStyle.BORDER,
            marginStart: 10,
            marginEnd: 10,
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
                        {language.enterTransactionPin}
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
                            errorPinVal: "",
                            pinVal: Utility.input(text, "0123456789")
                        })}
                        value={this.state.pinVal}
                        multiline={false}
                        numberOfLines={1}
                        keyboardType={"number-pad"}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={4}/>
                </View>
                {this.state.errorPinVal !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorPinVal}</Text> : null}

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
                        {language.confirm_pin_txt}
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
                        placeholder={language.et_confirm_pin_txt}
                        onChangeText={text => this.setState({
                            errorConfirmPinVal: "",
                            ConfirmPinVal: Utility.input(text, "0123456789")
                        })}
                        value={this.state.ConfirmPinVal}
                        multiline={false}
                        numberOfLines={1}
                        keyboardType={"number-pad"}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={4}/>
                </View>
                {this.state.errorConfirmPinVal !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorConfirmPinVal}</Text> : null}

            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
        </View>);
    }

    otpEnter(language) {
        return (<View>
            <Text style={[CommonStyle.textStyle, {
                marginStart: Utility.setWidth(10),
                marginEnd: Utility.setWidth(10),
                marginTop: Utility.setHeight(10),
                marginBottom: Utility.setHeight(20),
            }]}> {language.otp_description + language.otp_change_tPin}</Text>
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


    userPersonal(language) {
        return (
            <View>
                <Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                    marginBottom: 4
                }]}>
                    {language.actNo + "*"}
                </Text>
                <TouchableOpacity
                    onPress={() => this.openModal("account", language.select_actNo, this.state.actNoList, language)}>
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
                {this.state.selectTypeVal !== -1 ?
                    <View style={{
                        borderColor: themeStyle.BORDER,
                        marginStart: 10,
                        marginEnd: 10,
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
                                    {language.fatherName}
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
                                    placeholder={language.et_father_name}
                                    onChangeText={text => this.setState({
                                        errorFather: "",
                                        fatherName: Utility.userInput(text)
                                    })}
                                    value={this.state.fatherName}
                                    multiline={false}
                                    numberOfLines={1}
                                    contextMenuHidden={true}
                                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                    autoCorrect={false}/>
                            </View>
                            {this.state.errorFather !== "" ?
                                <Text style={{
                                    marginLeft: 5,
                                    marginRight: 10,
                                    color: themeStyle.THEME_COLOR,
                                    fontSize: FontSize.getSize(11),
                                    fontFamily: fontStyle.RobotoRegular,
                                    alignSelf: "flex-end",
                                    marginBottom: 10,
                                }}>{this.state.errorFather}</Text> : null}
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
                                    {language.motherName}
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
                                    placeholder={language.et_mother_name}
                                    onChangeText={text => this.setState({
                                        errorMother: "",
                                        motherName: Utility.userInput(text)
                                    })}
                                    value={this.state.motherName}
                                    multiline={false}
                                    numberOfLines={1}
                                    contextMenuHidden={true}
                                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                    autoCorrect={false}/>
                            </View>
                            {this.state.errorMother !== "" ?
                                <Text style={{
                                    marginLeft: 5,
                                    marginRight: 10,
                                    color: themeStyle.THEME_COLOR,
                                    fontSize: FontSize.getSize(11),
                                    fontFamily: fontStyle.RobotoRegular,
                                    alignSelf: "flex-end",
                                    marginBottom: 10,
                                }}>{this.state.errorMother}</Text> : null}
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
                                    {language.et_dob}
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
                                        placeholder={language.select_date}
                                        editable={false}
                                        value={this.state.dob}
                                        multiline={false}
                                        numberOfLines={1}
                                        contextMenuHidden={true}
                                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                        autoCorrect={false}/>
                                </TouchableOpacity>
                            </View>
                            {this.state.errorDob !== "" ?
                                <Text style={{
                                    marginLeft: 5,
                                    marginRight: 10,
                                    color: themeStyle.THEME_COLOR,
                                    fontSize: FontSize.getSize(11),
                                    fontFamily: fontStyle.RobotoRegular,
                                    alignSelf: "flex-end",
                                    marginBottom: 10,
                                }}>{this.state.errorDob}</Text> : null}
                        </View>
                        <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                    </View> : null}
            </View>)
    }


    onSelectItem(item) {
        const {modelSelection} = this.state;
        if (modelSelection === "account") {
            this.setState({
                select_actNo: item.ACCOUNT_NO,
                selectTypeVal: parseInt(item.ACCOUNT_NO),
                modalVisible: false
            })
        }
    }

    resetAll() {
        this.setState({
            stage: 0,
            fatherName: "",
            errorFather: "",
            motherName: "",
            errorMother: "",
            isProgress: false,
            dateVal: new Date(),
            mode: "date",
            show: false,
            dob: "",
            pinVal: "",
            ConfirmPinVal: "",
            verifyRes: "",
            otpVal: ""
        });
    }

    async changeTransPin(language, navigation) {
        let userDetails = this.props.userDetails;
        this.setState({isProgress: true});
        let changeReq = {
            CUSTOMER_ID: userDetails.CUSTOMER_ID,
            USER_ID: userDetails.USER_ID,
            AUTH_FLAG: userDetails.AUTH_FLAG,
            ACCT_NO: this.state.select_actNo,
            NEW_PIN: this.state.pinVal,
            REQ_FLAG: "R",
            PASS_TYPE: "T",
            REQUEST_CD: this.state.verifyRes.REQUEST_CD.toString(),
            REQ_TYPE: "V",
            ACTION: "CHANGETXNPIN",
            ACTIVITY_CD: userDetails.ACTIVITY_CD,
            DEVICE_ID: await Utility.getDeviceID(),
            ...Config.commonReq
        }
        console.log("request", changeReq);

        let result = await ApiRequest.apiRequest.callApi(changeReq, {});
        result = result[0];

        if (result.STATUS === "0") {
            this.resetAll();
            Utility.alert(result.MESSAGE);
        } else {
            this.setState({isProgress: false});
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }
    }

    async onSubmit(language, navigation) {
        if (this.state.fatherName === "") {
            this.setState({errorFather: "Please enter father name"});
        } else if (this.state.motherName === "") {
            this.setState({errorMother: "Please enter mother name"});
        } else if (this.state.dob === "") {
            this.setState({errorDob: "Please select date of birth"});
        } else if (this.state.stage === 2) {
            if (this.state.pinVal === "") {
                this.setState({errorPinVal: language.errTransactionPin})
            } else if (this.state.ConfirmPinVal === "") {
                this.setState({errorConfirmPinVal: language.errTConfPin})
            } else {
                await this.changeTransPin(language, navigation);
            }
        } else if (this.state.stage === 1) {
            if (this.state.otpVal.length !== 4) {
                Utility.alert(language.errOTP);
            } else {
                await this.processOTP(language, navigation);
            }
        } else {
            await this.verifyTransPin();
        }
    }


    async processOTP(language, navigation) {
        let verifyRes = this.state.verifyRes;
        let userDetails = this.props.userDetails;
        this.setState({isProgress: true});
        let otpReq = {
            OTP_NO: this.state.otpVal,
            USER_ID: userDetails.USER_ID,
            AUTH_FLAG: userDetails.AUTH_FLAG,
            REQ_FLAG: "R",
            REQUEST_CD: verifyRes.REQUEST_CD.toString(),
            MOBILE_NO: userDetails.MOBILE_NO,
            REQ_TYPE: "O",
            CUSTOMER_ID: userDetails.CUSTOMER_ID,
            ACTION: "CHANGETXNPIN",
            ACTIVITY_CD: userDetails.ACTIVITY_CD,
            DEVICE_ID: await Utility.getDeviceID(),
            ...Config.commonReq
        }

        console.log("request", otpReq);

        let result = await ApiRequest.apiRequest.callApi(otpReq, {});
        result = result[0];
        if (result.STATUS === "0") {
            console.log("response", result.RESPONSE[0]);
            this.setState({isProgress: false, stage: this.state.stage + 1});
        } else {
            this.setState({isProgress: false});
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }

    }

    showDatepicker = (id) => {
        console.log("click");
        this.setState({currentSelection: id, show: true, mode: "date"});
    };

    onChange = (event, selectedDate) => {
        if (event.type !== "dismissed" && selectedDate !== undefined) {
            console.log("selectedDate-", selectedDate);
            let currentDate = selectedDate === "" ? new Date() : selectedDate;
            currentDate = moment(currentDate).format("DD-MMM-YYYY");
            this.setState({dateVal: selectedDate, dob: currentDate, show: false});
        } else {
            this.setState({show: false});
        }
    };

    async verifyTransPin() {
        let userDetails = this.props.userDetails;
        this.setState({isProgress: true});
        let verifyReq = {
            USER_ID: userDetails.USER_ID,
            AUTH_FLAG: userDetails.AUTH_FLAG,
            ACCT_NO: this.state.select_actNo,
            REQ_FLAG: "R",
            PASS_TYPE: "T",
            REQ_TYPE: "A",
            MOTHER_NM: this.state.motherName,
            BIRTH_DATE: this.state.dob,
            CUSTOMER_ID: userDetails.CUSTOMER_ID,
            ACTION: "CHANGETXNPIN",
            ACTIVITY_CD: userDetails.ACTIVITY_CD,
            FATHER_NM: this.state.fatherName,
            DEVICE_ID: await Utility.getDeviceID(),
            ...Config.commonReq
        }
        console.log("actRequest", verifyReq);
        let result = await ApiRequest.apiRequest.callApi(verifyReq, {});
        result = result[0];
        console.log("response", result.RESPONSE[0]);

        if (result.STATUS === "0") {
            console.log("response", result.RESPONSE[0]);
            this.setState({isProgress: false, stage: this.state.stage + 1, verifyRes: result.RESPONSE[0]});
        } else {
            this.setState({isProgress: false});
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }

    }

    render() {
        let language = this.props.language;
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={CommonStyle.toolbar}>
                    <TouchableOpacity
                        style={CommonStyle.toolbar_back_btn_touch}
                        onPress={() => this.backBtn()}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../resources/images/ic_back_android.png") : require("../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.change_transaction_pin}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>

                        {this.state.stage === 0 ? this.userPersonal(language) :
                            this.state.stage === 1 ? this.otpEnter(language) : this.enterPIN(language)}

                        {this.state.selectTypeVal === -1 ? null : <View style={{
                            flexDirection: "row",
                            marginStart: Utility.setWidth(10),
                            marginRight: Utility.setWidth(10),
                            marginTop: Utility.setHeight(20)
                        }}>
                            <TouchableOpacity style={{flex: 1}}
                                              onPress={() => this.onSubmit(language, this.props.navigation)}>
                                <View style={{
                                    flex: 1,
                                    alignSelf: "center",
                                    justifyContent: "center",
                                    height: Utility.setHeight(46),
                                    width: Utility.getDeviceWidth() / 3,
                                    borderRadius: Utility.setHeight(23),
                                    backgroundColor: themeStyle.THEME_COLOR
                                }}>
                                    <Text
                                        style={[CommonStyle.midTextStyle, {
                                            color: themeStyle.WHITE,
                                            textAlign: "center"
                                        }]}>{this.state.stage === 2 ? language.submit : language.next}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>}
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
                                                      }]}>{item.ACCOUNT_NO}</Text>
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

}

const
    styles = {
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

export default connect(mapStateToProps)(ChangeTransPin);
