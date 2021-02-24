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
import fontStyle from "../resources/FontStyle";
import FontSize from "../resources/ManageFontSize";
import CommonStyle from "../resources/CommonStyle";
import React, {Component} from "react";
import {BusyIndicator} from "../resources/busy-indicator";
import Utility from "../utilize/Utility";
import RadioForm from "react-native-simple-radio-button";
import StorageClass from "../utilize/StorageClass";
import Config from "../config/Config";
import {actions} from "../redux/actions";

class CrediCardDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            card_number: "",
            statementdate: "",
            paymentdate:"",
            lastbalance:"",
            minimum_payment:"",
            previous_bal:"",
            interest_charge:"",
            emailTxt: "",
            errorEmail: "",
            error_name:"",
            error_account:"",
            error_accountNo:"",
            focusUid: false,
            focusPwd: false,
            error_email: "",
            stateVal: 0,
            cardnumber:"",
        }
    }

    userInput(text) {
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        this.setState({name: text, error_name: ""})
    }
    accountchange(text){
        console.log("acccount change",text)
        if (text.indexOf(" ") !== -1)
            text = text.replace(/\s/g, '');
        this.setState({statementdate: text, error_accountNo: ""})
    }

    async changeCard(cardCode) {
        console.log("cardcode is this",cardCode)
        this.setState({
            stateVal:cardCode
        })
        console.log("statevalue is this", this.state.stateVal);
    }

    async onSubmit(language, navigation) {
        if (this.state.card_number === "") {
            this.setState({error_name: language.require_bname});
            return;
        }
        else if(this.state.statementdate===""){
            this.setState({error_account:language.require_bkash})
            return;
        }
        Utility.alertWithBack(language.ok_txt, language.success_saved, navigation)
    }


    unbilleView(language) {
        return (<View>
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.card_number}
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
                    placeholder={"474867********6433"}
                    onChangeText={text => this.setState({
                        error_name: "",
                        cardnumber: Utility.userInput(text)
                    })}
                    value={this.state.cardnumber}
                    multiline={false}
                    onFocus={() => this.setState({focusUid: true})}
                    onBlur={() => this.setState({focusUid: false})}
                    numberOfLines={1}
                    contextMenuHidden={true}
                    keyboardType={"number-pad"}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    maxLength={13}
                />
            </View>
            {this.state.error_name !==  "" ?
                <Text style={{
                    marginStart: 10, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                    fontFamily: fontStyle.RobotoRegular,
                }}>{this.state.error_name}</Text> : null}
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
                        {language.statement_date}
                    </Text>
                    <TextInput
                        ref={(ref) => this.emailRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        onChangeText={text => this.setState({
                            error_account: "",
                            statementdate: Utility.userInput(text)
                        })}
                       // onChangeText={text => this.setState({emailTxt: Utility.userInput(text)})}
                        value={this.state.statementdate}
                        multiline={false}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.mobileRef.focus();
                        }}
                        numberOfLines={1}
                        editable={false}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}/>
                </View>
                {this.state.error_account !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.error_account}</Text> : null}
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
                        {language.payment_date}
                    </Text>
                    <TextInput
                        ref={(ref) => this.mobileRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        onChangeText={text => this.setState({paymentdate: Utility.input(text, "0123456789")})}
                        value={this.state.paymentdate}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        editable={false}
                        maxLength={14}/>
                </View>
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
                        {language.last_balance}
                    </Text>
                    <TextInput
                        ref={(ref) => this.emailRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        onChangeText={text => this.setState({
                            error_account: "",
                            lastbalance: Utility.userInput(text)
                        })}
                        // onChangeText={text => this.setState({emailTxt: Utility.userInput(text)})}
                        value={this.state.lastbalance}
                        multiline={false}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.mobileRef.focus();
                        }}
                        numberOfLines={1}
                        editable={false}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}/>
                </View>
                {this.state.error_account !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.error_account}</Text> : null}
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
                        {language.minimum_payment}
                    </Text>
                    <TextInput
                        ref={(ref) => this.mobileRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        onChangeText={text => this.setState({minimum_payment: Utility.input(text, "0123456789")})}
                        value={this.state.minimum_payment}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        editable={false}
                        maxLength={14}/>
                </View>
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
                        {language.previous_bal}
                    </Text>
                    <TextInput
                        ref={(ref) => this.emailRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        onChangeText={text => this.setState({
                            error_account: "",
                            previous_bal: Utility.userInput(text)
                        })}
                        // onChangeText={text => this.setState({emailTxt: Utility.userInput(text)})}
                        value={this.state.previous_bal}
                        multiline={false}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.mobileRef.focus();
                        }}
                        numberOfLines={1}
                        editable={false}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}/>
                </View>
                {this.state.error_account !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.error_account}</Text> : null}
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
                        {language.interest_charge}
                    </Text>
                    <TextInput
                        ref={(ref) => this.emailRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.b_email}
                        onChangeText={text => this.setState({
                            error_account: "",
                            interest_charge: Utility.userInput(text)
                        })}
                        // onChangeText={text => this.setState({emailTxt: Utility.userInput(text)})}
                        value={this.state.interest_charge}
                        multiline={false}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.mobileRef.focus();
                        }}
                        numberOfLines={1}
                        editable={false}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}/>
                </View>
                {this.state.error_account !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.error_account}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
        </View>)
    }

    currentView(language) {
        return (<View>
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.card_number}
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
                    //placeholder={"01********"}
                    placeholder={"474867********6433"}
                    onChangeText={text => this.setState({
                        error_name: "",
                        card_number: Utility.userInput(text)
                    })}
                    value={this.state.card_number}
                    multiline={false}
                    onFocus={() => this.setState({focusUid: true})}
                    onBlur={() => this.setState({focusUid: false})}
                    numberOfLines={1}
                    keyboardType={"number-pad"}
                    contextMenuHidden={true}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    maxLength={13}
                />
            </View>
            {this.state.error_name !==  "" ?
                <Text style={{
                    marginStart: 10, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                    fontFamily: fontStyle.RobotoRegular,
                }}>{this.state.error_name}</Text> : null}
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
                        {language.total_credit}
                    </Text>
                    <TextInput
                        ref={(ref) => this.emailRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        onChangeText={text => this.setState({
                            error_account: "",
                            accountNo: Utility.userInput(text)
                        })}
                        // onChangeText={text => this.setState({emailTxt: Utility.userInput(text)})}
                        value={this.state.accountNo}
                        multiline={false}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.mobileRef.focus();
                        }}
                        numberOfLines={1}
                        editable={false}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}/>
                </View>
                {this.state.error_account !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.error_account}</Text> : null}
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
                        {language.credit_available}
                    </Text>
                    <TextInput
                        ref={(ref) => this.mobileRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        onChangeText={text => this.setState({mobile_number: Utility.input(text, "0123456789")})}
                        value={this.state.mobile_number}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        editable={false}
                        maxLength={14}/>
                </View>
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
                        {language.outstanding_bal}
                    </Text>
                    <TextInput
                        ref={(ref) => this.mobileRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        onChangeText={text => this.setState({mobile_number: Utility.input(text, "0123456789")})}
                        value={this.state.mobile_number}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        editable={false}
                        maxLength={14}/>
                </View>
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
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
                        onPress={() => this.props.navigation.goBack(null)}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../resources/images/ic_back_android.png") : require("../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.credit_card_det}</Text>
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
                               source={require("../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        <View style={[styles.headerLabel,{  marginTop:10,marginStart: 20,
                            marginEnd: 10,}]}>
                            <TouchableOpacity
                                onPress={() => this.changeCard(0)}
                                style={{
                                    height: "100%",
                                    //width: Utility.setWidth(65),
                                    paddingLeft:10,
                                    paddingRight:10,
                                    justifyContent: "center",
                                    borderBottomLeftRadius:this.state.stateVal === 1 ? 3 : 0,
                                    borderTopLeftRadius:this.state.stateVal === 1 ? 3 : 0,
                                    backgroundColor: this.state.stateVal === 0 ? themeStyle.THEME_COLOR : "#F4F4F4",
                                }}>
                                <Text style={[styles.langText, {
                                    color: this.state.stateVal === 0 ? themeStyle.WHITE : themeStyle.BLACK
                                }]}>{this.props.language.unbilled}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.changeCard(1)}
                                style={{
                                    height: "100%",
                                    //width: Utility.setWidth(65),
                                    paddingLeft:10,
                                    paddingRight:10,
                                    justifyContent: "center",
                                    borderBottomRightRadius:this.state.stateVal === 1 ? 5 : 0,
                                    borderTopRightRadius:this.state.stateVal === 1 ? 5 : 0,
                                    backgroundColor: this.state.stateVal === 1 ? themeStyle.THEME_COLOR : "#F4F4F4",
                                }}>
                                <Text style={[styles.langText, {
                                    color: this.state.stateVal === 1 ? themeStyle.WHITE : themeStyle.BLACK
                                }]}>{this.props.language.current}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {}}
                                style={{
                                    width: Utility.setWidth(65),
                                    height: Utility.setHeight(35),
                                    justifyContent: "center",
                                    borderRadius: 3,
                                    position: "absolute",
                                    right: Utility.setWidth(10),
                                    backgroundColor: themeStyle.THEME_COLOR
                                }}>
                                <Text style={[CommonStyle.midTextStyle, {
                                    color: themeStyle.WHITE,
                                    textAlign: "center"
                                }]}>{this.props.language.bdt}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.selectionBg,{marginTop:10}]}>
                            <Text style={[CommonStyle.midTextStyle, {
                                color: themeStyle.BLACK,
                                flex: 1,
                                margin:5
                            }]}>
                                {this.props.language.visa}
                            </Text>
                        </View>
                        {this.state.stateVal === 0 ? this.currentView(language) : this.unbilleView(language)  }
                        <View style={{
                            flexDirection: "row",
                            marginStart: Utility.setWidth(10),
                            marginRight: Utility.setWidth(10),
                            marginTop: Utility.setHeight(20)
                        }}>
                            <TouchableOpacity style={{flex: 1}}
                                              onPress={() => this.onSubmit(language, this.props.navigation)}>
                                <View style={{
                                    flex: 1,
                                    alignSelf: "flex-end",
                                    height: Utility.setHeight(46),
                                   // width: Utility.getDeviceWidth() / 2.5,
                                    borderRadius: Utility.setHeight(23),
                                    borderWidth: 1,
                                    borderColor: themeStyle.THEME_COLOR,
                                }}>
                                    <View style={{flex:1,flexDirection:"row",justifyContent: "center",alignItems:"center",padding:5}}>
                                    <Image resizeMode={"contain"} style={{
                                        width: Utility.setWidth(30),
                                        height: Utility.setHeight(30),
                                    }}
                                            source={require("../resources/images/ic_payment_checked.png")}/>
                                    <Text
                                        style={[CommonStyle.midTextStyle, {
                                            borderColor: themeStyle.THEME_COLOR,
                                            textAlign: "center",
                                            color:themeStyle.THEME_COLOR
                                        }]}>{language.pay_now}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.selectionBg,{marginTop:10,justifyContent:"space-between"}]}>
                            <Text style={[CommonStyle.midTextStyle, {
                                color: themeStyle.BLACK,margin:5
                            }]}>
                                {this.props.language.date}
                            </Text>
                            <Text style={[CommonStyle.midTextStyle, {
                                color: themeStyle.BLACK,
                            }]}>
                                {this.props.language.amount}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
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
    headerLabel: {
        flexDirection: "row",
        //backgroundColor: themeStyle.THEME_COLOR,
        height: Utility.setHeight(35),
        borderRadius: 5,
        borderWidth: 1,
        borderColor: themeStyle.WHITE,
        overflow: "hidden"
    },
    langText: {
        fontFamily: fontStyle.RobotoRegular,
        fontSize: FontSize.getSize(12),
        textAlign: 'center',
        width: Utility.setWidth(65),
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

export default connect(mapStateToProps)(CrediCardDetails);
