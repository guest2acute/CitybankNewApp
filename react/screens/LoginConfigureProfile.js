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

class LoginConfigureProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactionPin: "",
            confirmTransactionPin:"",
            alias:""
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

    accountNoOption(language) {
        return (<View>
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.alias}
                </Text>
                <TextInput
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {alignItems: "flex-end", textAlign: 'right',flex:1,marginLeft:10}]}
                    placeholder={language.et_alias}
                    onChangeText={text => this.setState({alias:text})}
                    value={this.state.alias}
                    multiline={false}
                    numberOfLines={1}
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
                    {language.set_transaction_pin}
                    <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                </Text>
                <TextInput
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {alignItems: "flex-end", textAlign: 'right',flex:1,marginLeft:10}]}
                    placeholder={language.Transaction_Pin}
                    onChangeText={text => this.setState({transactionPin: Utility.input(text, "0123456789")})}
                    value={this.state.transactionPin}
                    multiline={false}
                    numberOfLines={1}
                    keyboardType={"number-pad"}
                    contextMenuHidden={true}
                    secureTextEntry={true}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    maxLength={4}/>
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.Confirm_Pin}
                    <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                </Text>
                <TextInput
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {alignItems: "flex-end", textAlign: 'right',flex:1,marginLeft:10}]}
                    placeholder={language.enterPinHere}
                    onChangeText={text => this.setState({confirmTransactionPin: Utility.input(text, "0123456789")})}
                    value={this.state.confirmTransactionPin}
                    multiline={false}
                    numberOfLines={1}
                    contextMenuHidden={true}
                    keyboardType={"number-pad"}
                    secureTextEntry={true}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    maxLength={4}/>
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View style={{
                flexDirection: "row", alignItems: "center", marginTop: 15
            }}>
                <Text style={[CommonStyle.textStyle, {marginRight: 15,marginStart:10}]}>
                    {language.Language_P}
                    <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                </Text>
                <RadioForm
                    radio_props={language.Language_M}
                    initial={0}
                    buttonSize={8}
                    selectedButtonColor={themeStyle.THEME_COLOR}
                    formHorizontal={true}
                    labelHorizontal={true}
                    borderWidth={1}
                    buttonColor={themeStyle.GRAY_COLOR}
                    labelColor={themeStyle.BLACK}
                    labelStyle={[CommonStyle.textStyle, {marginEnd: 15, marginStart: -5,marginTop:-1}]}
                    style={{marginTop: 8}}
                    animation={true}
                    onPress={(value) => {
                        this.setState({otp_type: value});
                    }}
                />
            </View>

            <View style={{
                flexDirection: "row", alignItems: "center", marginTop: 15
            }}>
                <Text style={[CommonStyle.textStyle, {marginRight: 15,marginStart:10}]}>
                    {language.Login_W}
                    <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                </Text>
                <RadioForm
                    radio_props={language.Login_M}
                    initial={0}
                    buttonSize={8}
                    selectedButtonColor={themeStyle.THEME_COLOR}
                    formHorizontal={true}
                    labelHorizontal={true}
                    borderWidth={1}
                    buttonColor={themeStyle.GRAY_COLOR}
                    labelColor={themeStyle.BLACK}
                    labelStyle={[CommonStyle.textStyle, {marginEnd: 8, marginStart: -7,marginTop:-1}]}
                    style={{marginTop: 8}}
                    animation={true}
                    onPress={(value) => {
                        this.setState({otp_type: value});
                    }}
                />
            </View>
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
                    <Text style={CommonStyle.title}>{language.login_configure_profile}</Text>
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
                            {language.config_information}
                        </Text>
                        { this.accountNoOption(language) }
                        <View style={{
                            flexDirection: "row",
                            marginStart: Utility.setWidth(10),
                            marginRight: Utility.setWidth(10),
                            marginTop: Utility.setHeight(20)
                        }}>
                            <TouchableOpacity style={{flex: 1}}
                                              onPress={() => this.submit(language, this.props.navigation)}>
                                <View style={{
                                    flex:1,
                                    alignSelf: "center",
                                    justifyContent: "center",
                                    height: Utility.setHeight(46),
                                    width:Utility.getDeviceWidth()/2.5,
                                    borderRadius: Utility.setHeight(23),
                                    backgroundColor: themeStyle.THEME_COLOR
                                }}>
                                    <Text
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE,textAlign:"center"}]}>{language.submit}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Text style={{marginStart: 10, marginTop: 20, color: themeStyle.THEME_COLOR}}>*{language.mark_field_mandatory}
                        </Text>
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

export default connect(mapStateToProps)(LoginConfigureProfile);
