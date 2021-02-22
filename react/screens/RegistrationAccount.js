import React, {Component} from "react";
import {
    Alert, BackHandler,
    FlatList,
    Image,
    Platform,
    SafeAreaView,
    ScrollView, SectionList,
    StatusBar,
    Text, TextInput, TextPropTypes,
    TouchableOpacity,
    View
} from "react-native";
import themeStyle from "../resources/theme.style";
import {connect} from "react-redux";
import CommonStyle from "../resources/CommonStyle";
import Utility from "../utilize/Utility";
import fontStyle from "../resources/FontStyle";
import FontSize from "../resources/ManageFontSize";
import RadioForm from "react-native-simple-radio-button";
import CheckBox from "@react-native-community/checkbox";
import Icon from "react-native-vector-icons/FontAwesome";
import Config from "../config/Config";
import {CommonActions, StackActions} from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import MonthPicker from "react-native-month-year-picker";


class RegistrationAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accountNo: "",
            actName: "",
            conf_mobile: "",
            errorMobile: "",
            conf_email: "",
            cardExpiry: "",
            debitPin: "",
            errorEmail: "",
            errorUserId: "",
            userId: "",
            userId_type: 0,
            otp_type: 0,
            otpVal: "",
            isTerm: false,
            debitPin: "",
            errorPin: "",
            errorExpiry: "",
            errorFather: "",
            errorMother: "",
            errorDob: "",
            errorTransDate: "",
            errorTransAmt: "",
            transAmt:"",
            errorAccount_no: "",
            error_conf_mobile: "",
            transDate: "",
            dob: "",
            password: "",
            fatherName: "",
            motherName: "",
            transPin: "",
            loginPin:"",
            errorTransPin: "",
            errorLoginPin:"",
            errorpassword:"",
            stateVal: 0,
            options: [
                {title: props.language.signupWithAccount, selected: true},
                {title: props.language.signupWithCard, selected: false},
            ],
            show: false,
            mode: "date",
            dateVal: new Date(),
            showMonthPicker: false,
            expiryDate: "",
        }
    }


    componentDidMount() {
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

    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener("hardwareBackPress", this.backHandler);
        }
    }

    backAction = () => {
        this.backEvent();
        return true;
    }

    backEvent() {
        const {stateVal} = this.state;
        if (stateVal === 0)
            this.props.navigation.goBack(null);
        else
            this.setState({stateVal: stateVal !== 3 ? stateVal - 1 : stateVal - 2});
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

    passwordSet(language) {
        return (<View style={{
            borderColor: themeStyle.BORDER,
            width: Utility.getDeviceWidth() - 20,
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
                        {language.transactionPin}
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
                        placeholder={language.enterTransactionPin}
                        onChangeText={text => this.setState({
                            errorTransPin: "",
                            transPin: Utility.input(text, "0123456789")
                        })}
                        value={this.state.transPin}
                        multiline={false}
                        numberOfLines={1}
                        keyboardType={"number-pad"}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        returnKeyType={"next"}
                        onSubmitEditing={(event)=>{
                            this.loginPinRef.focus();
                        }}
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
                        {language.loginPin}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TextInput
                        ref={(ref)=>this.loginPinRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.setLoginPIn}
                        onChangeText={text => this.setState({errorLoginPin:"",loginPin: Utility.input(text, "0123456789/")})}
                        value={this.state.loginPin}
                        multiline={false}
                        numberOfLines={1}
                        keyboardType={"number-pad"}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        returnKeyType={"next"}
                        onSubmitEditing={ (event)=>{
                            this.passwordRef.focus();
                        }}
                        maxLength={6}/>
                </View>
                {this.state.errorLoginPin !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorLoginPin}</Text> : null}
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
                        {language.setPwdTxt}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TextInput
                        ref ={(ref)=> this.passwordRef=ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.etPasswordTxt}
                        onChangeText={text => this.setState({errorpassword:"",password: Utility.userInput(text)})}
                        value={this.state.password}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        secureTextEntry={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={6}/>
                </View>
                {this.state.errorpassword !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorpassword}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
        </View>)
    }

    listView(value) {
        let item = value.item;
        console.log("item", value.item);
        return (
            <TouchableOpacity disabled={value.index === 0} style={{height: Utility.setHeight(40)}}
                              onPress={() => this.props.navigation.dispatch(
                                  StackActions.replace('RegistrationCard')
                              )}>
                <View style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    paddingLeft: 10,
                    borderBottomLeftRadius: value.index === 0 ? 5 : 0,
                    borderTopLeftRadius: value.index === 0 ? 5 : 0,
                    borderBottomRightRadius: value.index + 1 === this.state.options.length ? 5 : 0,
                    borderTopRightRadius: value.index + 1 === this.state.options.length ? 5 : 0,
                    overflow: "hidden",
                    paddingRight: 10,
                    backgroundColor: item.selected ? themeStyle.THEME_COLOR : "#CCCCCC",
                }}>
                    <Text style={{
                        fontFamily: fontStyle.RobotoMedium,
                        fontSize: FontSize.getSize(11),
                        color: item.selected ? themeStyle.WHITE : themeStyle.BLACK,
                    }}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    otpEnter(language) {
        return (<View>
            <Text style={[CommonStyle.textStyle, {
                marginStart: Utility.setWidth(10),
                marginEnd: Utility.setWidth(10),
                marginTop: Utility.setHeight(10),
                marginBottom: Utility.setHeight(20),
            }]}> {language.otp_description + language.otp_signup}</Text>
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

    otpView(language) {
        return (<View>
            <View>
                <View style={{
                    flexDirection: "row",
                    marginStart: 10,
                    marginEnd: 10,
                }}>

                    <RadioForm
                        radio_props={language.userIdOption}
                        initial={0}
                        buttonSize={9}
                        selectedButtonColor={themeStyle.THEME_COLOR}
                        formHorizontal={false}
                        labelHorizontal={true}
                        borderWidth={1}
                        buttonColor={themeStyle.GRAY_COLOR}
                        labelColor={themeStyle.BLACK}
                        labelStyle={CommonStyle.textStyle}
                        style={{marginStart: 5, marginTop: 10}}
                        animation={true}
                        onPress={(value) => {
                            this.setState({userId_type: value});
                        }}
                    />

                    <View style={{alignItems: "flex-end", flex: 1,}}>
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle, {
                                textAlign: 'right',
                                marginLeft: 10,
                            }]}
                            placeholder={language.enterUserId}
                            onChangeText={text => this.setState({errorUserId:"",userId: Utility.userInput(text)})}
                            value={this.state.userId}
                            multiline={false}
                            editable={this.state.userId_type !== 0}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}/>
                        {this.state.errorUserId !== "" ?
                            <Text style={{
                                marginLeft: 5,
                                marginRight: 10,
                                color: themeStyle.THEME_COLOR,
                                fontSize: FontSize.getSize(11),
                                fontFamily: fontStyle.RobotoRegular,
                                alignSelf: "flex-end",
                                marginBottom: 10,
                            }}>{this.state.errorUserId}</Text> : null}
                    </View>
                </View>

            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View style={[CommonStyle.checkboxContainer]}>
                <CheckBox
                    disabled={false}
                    onValueChange={(newValue) => this.setState({
                        isTerm: newValue,
                    })}
                    value={this.state.isTerm}
                    style={CommonStyle.checkbox}
                    tintColor={themeStyle.THEME_COLOR}
                    tintColors={{true: themeStyle.THEME_COLOR, false: themeStyle.GRAY_COLOR}}
                />
                <Text style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                    flexWrap: 'wrap',
                    justifyContent: "center"
                }}>
                    <Text style={[CommonStyle.textStyle, {
                        textAlign: "center",
                        marginRight: 3,
                    }]}>{language.read_term}</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("TermConditionScreen", {
                        showButton: false
                    })}>
                        <Text style={[CommonStyle.textStyle, {
                            textDecorationLine: "underline",
                        }]}>{language.term_condition}
                        </Text>
                    </TouchableOpacity>
                </Text>

            </View>
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
        </View>)

    }

    accountView(language) {
        return (
            <View>
                <View style={{
                    borderColor: themeStyle.BORDER,
                    width: Utility.getDeviceWidth() - 20,
                    borderRadius: 5,
                    marginTop: 10,
                    overflow: "hidden",
                    borderWidth: 2
                }}>

                    <View style={{
                        flexDirection: "row",
                        height: Utility.setHeight(50),
                        marginStart: 10,
                        alignItems: "center",
                        marginEnd: 10,
                    }}>
                        <Text style={[CommonStyle.textStyle]}>
                            {language.actNo}
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
                            placeholder={language.actNo_here}
                            onChangeText={text => this.setState({
                                errorAccount_no: "",
                                accountNo: Utility.input(text, "0123456789")
                            })}
                            value={this.state.accountNo}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            keyboardType={"number-pad"}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}
                            maxLength={13}/>
                    </View>
                    {this.state.errorAccount_no !== "" ?
                        <Text style={{
                            marginLeft: 5,
                            marginRight: 10,
                            color: themeStyle.THEME_COLOR,
                            fontSize: FontSize.getSize(11),
                            fontFamily: fontStyle.RobotoRegular,
                            alignSelf: "flex-end",
                            marginBottom: 10,
                        }}>{this.state.errorAccount_no}</Text> : null}
                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                    <View style={{
                        flexDirection: "row",
                        height: Utility.setHeight(50),
                        marginStart: 10,
                        alignItems: "center",
                        marginEnd: 10,
                    }}>
                        <Text style={[CommonStyle.textStyle]}>
                            {language.actName}
                        </Text>
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle, {
                                alignItems: "flex-end",
                                textAlign: 'right',
                                flex: 1,
                                marginLeft: 10
                            }]}
                            value={this.state.actName}
                            editable={false}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}/>
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
                                {language.conf_mobile}
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
                                placeholder={"01********"}
                                onChangeText={text => this.setState({
                                    errorMobile: "",
                                    conf_mobile: Utility.input(text, "0123456789")
                                })}
                                value={this.state.conf_mobile}
                                multiline={false}
                                numberOfLines={1}
                                contextMenuHidden={true}
                                keyboardType={"number-pad"}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}
                                returnKeyType={"next"}
                                onSubmitEditing={(event)=>{
                                    this.emailref.focus();
                                }}
                                maxLength={14}/>
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
                                {language.conf_email}
                                <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                            </Text>
                            <TextInput
                                ref ={(ref)=> this.emailref  = ref}
                                selectionColor={themeStyle.THEME_COLOR}
                                style={[CommonStyle.textStyle, {
                                    alignItems: "flex-end",
                                    textAlign: 'right',
                                    flex: 1,
                                    marginLeft: 10
                                }]}
                                placeholder={"a********@gmail.com"}
                                onChangeText={text => this.setState({
                                    errorEmail: "",
                                    conf_email: Utility.userInput(text)
                                })}
                                value={this.state.conf_email}
                                multiline={false}
                                numberOfLines={1}
                                contextMenuHidden={true}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}/>
                        </View>
                        {this.state.errorEmail !== "" ?
                            <Text style={{
                                marginLeft: 5,
                                marginRight: 10,
                                color: themeStyle.THEME_COLOR,
                                fontSize: FontSize.getSize(11),
                                fontFamily: fontStyle.RobotoRegular,
                                alignSelf: "flex-end",
                                marginBottom: 10,
                            }}>{this.state.errorEmail}</Text> : null}
                    </View>
                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                </View>
            </View>);
    }


    userPersonal(language) {
        return (<View style={{
            borderColor: themeStyle.BORDER,
            width: Utility.getDeviceWidth() - 20,
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
                        placeholder={language.et_father_name}
                        onChangeText={text => this.setState({errorFather:"",fatherName: Utility.userInput(text)})}
                        value={this.state.fatherName}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.motherRef.focus();
                        }}
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
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TextInput
                        ref={(ref) => this.motherRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.et_mother_name}
                        onChangeText={text => this.setState({errorMother:"",motherName: Utility.userInput(text)})}
                        value={this.state.motherName}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.dobRef.focus();
                        }}
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
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TextInput
                        ref={(ref) => this.dobRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={"MM/YY"}
                        onChangeText={text => this.setState({errorDob:"",dob: Utility.input(text, "0123456789/")})}
                        value={this.state.dob}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        returnKeyType={"true"}
                        onSubmitEditing={(event) => {
                            this.transDateRef.focus();
                        }}
                        maxLength={5}/>
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
            <View>
                <View style={{
                    flexDirection: "row",
                    marginStart: 10,
                    height: Utility.setHeight(50),
                    alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.last_trans_date}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TextInput
                        ref={(ref) => this.transDateRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={"dd/MM/YYYY"}
                        onChangeText={text => this.setState({ errorTransDate:"",transDate: Utility.input(text, "0123456789/")})}
                        value={this.state.transDate}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.transAmtRef.focus();
                        }}
                        maxLength={10}/>
                </View>
                {this.state.errorTransDate !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorTransDate}</Text> : null}
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
                        {language.last_trans_amount}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TextInput
                        ref={(ref) => this.transAmtRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        onChangeText={text => this.setState({errorTransAmt:"",transAmt: Utility.input(text, "0123456789.")})}
                        value={this.state.transAmt}
                        multiline={false}
                        numberOfLines={1}
                        keyboardType={"number-pad"}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={10}/>
                </View>
                {this.state.errorTransAmt !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorTransAmt}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            {this.otpView(language)}

        </View>)
    }

    debitCardUI(language) {
        return (<View style={{
            borderColor: themeStyle.BORDER,
            width: Utility.getDeviceWidth() - 20,
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
/*                        onChangeText={text => this.setState({
                            errorExpiry: "",
                            expiryDate: Utility.input(text, "0123456789/")
                        })}*/
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
            <View>
                <View style={{
                    flexDirection: "row",
                    marginStart: 10,
                    height: Utility.setHeight(50),
                    alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.enterCardPin}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TextInput
                        ref={(ref)=>this.debitPinRef= ref }
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
                            debitPin: Utility.input(text, "0123456789")
                        })}
                        value={this.state.debitPin}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        keyboardType={"number-pad"}
                        maxLength={6}/>
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
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            {this.otpView(language)}
        </View>)
    }

    submit(language, navigation) {
        const {stateVal} = this.state;
        console.log(stateVal)
            if(stateVal === 0){
                if(this.state.accountNo.length !== 13){
                    this.setState({errorAccount_no: language.require_account_no});
                    return;
                }
                else if(this.state.conf_mobile === ""){
                    this.setState({errorMobile: language.require_mobile});
                    return;
                }else if(this.state.conf_email === ""){
                    this.setState({errorEmail: language.require_email});
                    return;
                }else if(this.state.UserId === ""){
                    this.setState({errorUserId: language.require_email});
                    return;
                }
            }

            else if(stateVal === 1) {
                if(this.state.expiryDate === ""){
                    this.setState({errorExpiry: language.errExpiryDate});
                    return;
                }
                else if (this.state.debitPin === "") {
                    this.setState({errorPin: language.errCardPin});
                    return;
                }else if(this.state.userId === "") {
                    this.setState({errorUserId: language.errorUserId});
                    return;
                }
            }
            else if(stateVal === 2) {
                if (this.state.fatherName === "") {
                    this.setState({errorFather: language.et_father_name});
                    return;
                } else if (this.state.motherName === "") {
                    console.log("error mother")
                    this.setState({errorMother: language.errorMother});
                    return;
                } else if (this.state.dob === "") {
                    this.setState({errorDob: language.errorDob})
                    return;
                } else if (this.state.transDate === "") {
                    this.setState({errorTransDate: language.errorTransDate})
                    return;
                }else if (this.state.transAmt === "") {
                    this.setState({errorTransAmt: language.errorTransAmt})
                    return;
                }else if (this.state.UserId === "") {
                    this.setState({errorUserId: language.errorUserId})
                    return;
                }

            }
            else if(stateVal === 3) {
                 if(this.state.otpVal.length !== 4) {
                    Utility.alert(language.errOTP);
                    return;
                }
            }
            else if(stateVal === 4){
                if(this.state.transPin === ""){
                    this.setState({errorTransPin: language.errTransPin});
                    return;
                }else if(this.state.loginPin===""){
                    this.setState({errorLoginPin:language.errValidPin})
                    return;
                }
                else if(this.state.password === ""){
                    this.setState({errorpassword:language.errorpassword})
                    return;
                }
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
                                   require("../resources/images/ic_back_android.png") : require("../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.register_title}</Text>
                </View>
                <FlatList
                    horizontal
                    contentContainerStyle={{paddingLeft: 10, paddingRight: 10}}
                    showsHorizontalScrollIndicator={false}
                    legacyImplementation={false}
                    data={this.state.options}
                    renderItem={(item) => this.listView(item)}
                    keyExtractor={(item, index) => index + ""}
                    style={{width: Utility.getDeviceWidth(), flexGrow: 0, height: Utility.setHeight(40), marginTop: 10}}
                />
                <View style={{flex: 1}}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{marginLeft: 10, marginRight: 10}}>
                            {this.state.stateVal === 3 ? null : <Text style={[CommonStyle.textStyle, {
                                marginTop: 15,
                                marginLeft: 10,
                                marginRight: 10
                            }]}>{this.state.stateVal === 0 ? language.welcome_signup + language.accountNo : this.state.stateVal === 1 ? language.welcome_signup + language.debitCard : language.provideDetails}</Text>}
                            {this.state.stateVal === 0 ? this.accountView(language) : this.state.stateVal === 1 ? this.debitCardUI(language) : this.state.stateVal === 2 ? this.userPersonal(language) : this.state.stateVal === 3 ? this.otpEnter(language) : this.passwordSet(language)}
                            <View style={{
                                flexDirection: "row",
                                marginStart: Utility.setWidth(10),
                                marginRight: Utility.setWidth(10),
                                marginTop: Utility.setHeight(20),

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
                                                  onPress={() => this.submit(language, this.props.navigation)}>
                                    <View style={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: Utility.setHeight(46),
                                        borderRadius: Utility.setHeight(23),
                                        backgroundColor: themeStyle.THEME_COLOR
                                    }}>
                                        <Text
                                            style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{this.state.stateVal === 4 ? language.submit_txt : language.next}</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </ScrollView>
                </View>
                {this.state.showMonthPicker ? <MonthPicker
                    onChange={this.onValueChange}
                    value={new Date()}
                    minimumDate={new Date()}
                    maximumDate={new Date(new Date().getFullYear() + 10, 12)}
                    locale="en"
                    mode="number"
                /> : null}
            </View>);
    }
}

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(RegistrationAccount);
