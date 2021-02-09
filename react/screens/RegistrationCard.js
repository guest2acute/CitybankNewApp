import React, {Component} from "react";
import {
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


class RegistrationCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cardNo: "",
            cardName: "",
            conf_mobile: "",
            cardPin: "",
            errorMobile: "",
            conf_email: "",
            errorEmail: "",
            errorUserId: "",
            errorPin: "",
            errorExpiry: "",
            userId: "",
            otp_type: 0,

            isTerm: false,
            options: [
                {title: props.language.signupWithAccount, selected: false},
                {title: props.language.signupWithCard, selected: true},
            ]
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

    listView(value) {
        let item = value.item;
        console.log("item", value.item);
        return (
            <TouchableOpacity disabled={value.index === 1} style={{height: Utility.setHeight(40)}}
                              onPress={() => this.props.navigation.navigate("RegistrationAccount")}>
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
                            {language.credit_card_no}
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
                            onChangeText={text => this.setState({cardNo: Utility.input(text, "0123456789")})}
                            value={this.state.cardNo}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            secureTextEntry={true}
                            keyboardType={"number-pad"}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}
                            maxLength={13}/>
                    </View>
                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                    <View style={{
                        flexDirection: "row",
                        height: Utility.setHeight(50),
                        marginStart: 10,
                        alignItems: "center",
                        marginEnd: 10,
                    }}>
                        <Text style={[CommonStyle.textStyle]}>
                            {language.cardName}
                        </Text>
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle, {
                                alignItems: "flex-end",
                                textAlign: 'right',
                                flex: 1,
                                marginLeft: 10
                            }]}
                            value={this.state.cardName}
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
                                onChangeText={text => this.setState({conf_mobile: Utility.input(text, "0123456789")})}
                                value={this.state.conf_mobile}
                                multiline={false}
                                numberOfLines={1}
                                contextMenuHidden={true}
                                keyboardType={"number-pad"}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}
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
                            </Text>
                            <TextInput
                                selectionColor={themeStyle.THEME_COLOR}
                                style={[CommonStyle.textStyle, {
                                    alignItems: "flex-end",
                                    textAlign: 'right',
                                    flex: 1,
                                    marginLeft: 10
                                }]}
                                placeholder={"a********@gmail.com"}
                                onChangeText={text => this.setState({conf_email: Utility.userInput(text)})}
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
                            </Text>
                            <TextInput
                                selectionColor={themeStyle.THEME_COLOR}
                                style={[CommonStyle.textStyle, {
                                    alignItems: "flex-end",
                                    textAlign: 'right',
                                    flex: 1,
                                    marginLeft: 10
                                }]}
                                placeholder={language.enterCardExpiry}
                                onChangeText={text => this.setState({cardExpiry: Utility.input(text, "0123456789")})}
                                value={this.state.cardExpiry}
                                multiline={false}
                                numberOfLines={1}
                                contextMenuHidden={true}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}
                                maxLength={5}/>
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
                                onChangeText={text => this.setState({cardPin: Utility.input(text, "0123456789")})}
                                value={this.state.cardPin}
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

                    <View>
                        <View style={{
                            flexDirection: "row",
                            marginStart: 10,
                            height: Utility.setHeight(50),
                            alignItems: "center",
                            marginEnd: 10,
                        }}>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.user_id}
                            </Text>
                            <TextInput
                                selectionColor={themeStyle.THEME_COLOR}
                                style={[CommonStyle.textStyle, {
                                    alignItems: "flex-end",
                                    textAlign: 'right',
                                    flex: 1,
                                    marginLeft: 10
                                }]}
                                placeholder={language.user_id_enter}
                                onChangeText={text => this.setState({userId: Utility.input(text, "0123456789")})}
                                value={this.state.userId}
                                multiline={false}
                                numberOfLines={1}
                                contextMenuHidden={true}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}
                                maxLength={12}/>
                        </View>
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
                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

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


                </View>
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
                                style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{language.next}</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </View>);
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, marginLeft: 10, marginRight: 10,}}>
                        <Text style={[CommonStyle.textStyle, {
                            marginTop: 15,
                            marginLeft: 10,
                            marginRight: 10
                        }]}>{language.welcome_signup}</Text>
                        {this.accountView(language)}
                    </View>
                </ScrollView>
            </View>);
    }
}

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(RegistrationCard);
