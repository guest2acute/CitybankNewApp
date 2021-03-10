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
    TextInput, FlatList
} from "react-native";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import React, {Component} from "react";
import {BusyIndicator} from "../../resources/busy-indicator";
import Utility from "../../utilize/Utility";
import FontSize from "../../resources/ManageFontSize";
import fontStyle from "../../resources/FontStyle";
import RadioForm from "react-native-simple-radio-button";


class TagCreditCardInCityTouch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            selectType: props.language.select_type_transfer,
            selectTypeVal: -1,
            selectActCard: props.language.TypeOfTransferArr[0],
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            CardNumber: "",
            cardMemberName: "",
            errorCardNo: "",
            errorCardMemberName: "",
            sms: "",
            email: "",
            otp_type: 0,
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

    onSelectItem(item) {
        const {modelSelection} = this.state;
        console.log("modelSelection is this", item)
        if (modelSelection === "type") {
            this.setState({selectType: item.label, selectTypeVal: item.value, modalVisible: false})
        }
    }

    tagCreditCard(language) {
        return (
            <View key={"tagCreditCard"}>
                <View style={{
                    borderColor: themeStyle.BORDER,
                    borderRadius: 5,
                    marginTop: 10,
                    overflow: "hidden",
                    borderWidth: 2
                }}>
                    <View style={{
                        flexDirection: "row",
                        marginStart: 10,
                        height: Utility.setHeight(50),
                        alignItems: "center",
                        marginEnd: 10,
                    }}>
                        <Text style={[CommonStyle.textStyle]}>
                            {language.enter_Card_Number}
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
                            placeholder={language.cardNo_placeholder}
                            onChangeText={text => this.setState({
                                errorCardNo: "",
                                CardNumber: Utility.input(text, "0123456789")
                            })}
                            value={this.state.CardNumber}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}
                            keyboardType={"number-pad"}
                            maxLength={15}/>

                    </View>
                    {this.state.errorCardNo !== "" ?
                        <Text style={{
                            marginLeft: 5,
                            marginRight: 10,
                            color: themeStyle.THEME_COLOR,
                            fontSize: FontSize.getSize(11),
                            fontFamily: fontStyle.RobotoRegular,
                            alignSelf: "flex-end",
                            marginBottom: 10,
                        }}>{this.state.errorCardNo}</Text> : null}
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
                                {language.card_Member_Name}
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
                                onChangeText={text => this.setState({errorCardMemberName: "", cardMemberName: text})}
                                value={this.state.cardMemberName}
                                multiline={false}
                                numberOfLines={1}
                                contextMenuHidden={true}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                editable={false}
                                autoCorrect={false}/>
                        </View>
                        {this.state.errorCardMemberName !== "" ?
                            <Text style={{
                                marginLeft: 5,
                                marginRight: 10,
                                color: themeStyle.THEME_COLOR,
                                fontSize: FontSize.getSize(11),
                                fontFamily: fontStyle.RobotoRegular,
                                alignSelf: "flex-end",
                                marginBottom: 10,
                            }}>{this.state.errorCardMemberName}</Text> : null}
                    </View>
                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                    <View style={{
                        marginStart: 10, marginEnd: 10, marginTop: 10, marginBottom: 10, borderColor: themeStyle.BORDER,
                        borderRadius: 5,
                        overflow: "hidden",
                        borderWidth: 2
                    }}>
                        <Text style={[CommonStyle.textStyle, {marginStart: 10, marginTop: 10}]}>
                            {language.otpType}
                            <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                        </Text>
                        <View style={{
                            flexDirection: "row",
                            marginStart: 10,
                            height: Utility.setHeight(50),
                            alignItems: "center",
                        }}>
                            <RadioForm
                                radio_props={language.otp_props_mobile}
                                initial={0}
                                buttonSize={9}
                                selectedButtonColor={this.state.otp_type === 0 ? themeStyle.THEME_COLOR : themeStyle.LIGHT_GREY}
                                formHorizontal={false}
                                labelHorizontal={true}
                                borderWidth={1}
                                buttonColor={this.state.otp_type === 0 ? themeStyle.LIGHT_GREY : themeStyle.THEME_COLOR}
                                labelColor={themeStyle.BLACK}
                                labelStyle={[CommonStyle.textStyle, {marginRight: 15}]}
                                style={{marginStart: 5, marginTop: 5, marginLeft: Utility.setWidth(20)}}
                                animation={true}
                                onPress={(value) => {
                                    this.setState({otp_type: value});
                                }}
                            />
                            <TextInput
                                selectionColor={themeStyle.THEME_COLOR}
                                style={[CommonStyle.textStyle, {
                                    alignItems: "flex-end",
                                    textAlign: 'left',
                                    flex: 1,
                                    marginLeft: 10,
                                    marginRight: 10,
                                    paddingTop: 10,
                                    height: Utility.setHeight(40),
                                    backgroundColor: themeStyle.OFF_WHITE_COLOR
                                }]}
                                placeholder={""}
                                onChangeText={text => this.setState({
                                    sms: Utility.input(text, "0123456789")
                                })}
                                value={this.state.sms}
                                multiline={false}
                                numberOfLines={1}
                                keyboardType={"number-pad"}
                                contextMenuHidden={true}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}
                                editable={this.state.otp_type === 0 ? true : false}
                                maxLength={15}/>
                        </View>
                        <View style={{
                            flexDirection: "row",
                            marginStart: 10,
                            height: Utility.setHeight(50),
                            alignItems: "center",
                        }}>
                            <RadioForm
                                radio_props={language.otp_props_email}
                                initial={0}
                                buttonSize={9}
                                selectedButtonColor={this.state.otp_type === 1 ? themeStyle.THEME_COLOR : themeStyle.LIGHT_GREY}
                                formHorizontal={true}
                                labelHorizontal={true}
                                borderWidth={1}
                                buttonColor={this.state.otp_type === 1 ? themeStyle.LIGHT_GREY : themeStyle.THEME_COLOR}
                                labelColor={themeStyle.BLACK}
                                labelStyle={[CommonStyle.textStyle, {marginRight: 10}]}
                                style={{marginStart: 5, marginTop: 10, marginLeft: Utility.setWidth(20)}}
                                animation={true}
                                onPress={(value) => {
                                    this.setState({otp_type: value});
                                }}
                            />
                            <TextInput
                                selectionColor={themeStyle.THEME_COLOR}
                                style={[CommonStyle.textStyle, {
                                    alignItems: "flex-end",
                                    textAlign: 'left',
                                    flex: 1,
                                    marginRight: 10,
                                    paddingTop: 10,
                                    height: Utility.setHeight(40),
                                    backgroundColor: themeStyle.OFF_WHITE_COLOR
                                }]}
                                placeholder={""}
                                onChangeText={text => this.setState({email: text})}
                                value={this.state.email}
                                multiline={false}
                                numberOfLines={1}
                                contextMenuHidden={true}
                                placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                                autoCorrect={false}
                                editable={this.state.otp_type === 1 ? true : false}
                            />
                        </View>

                    </View>
                </View>
            </View>
        )
    }

    submit(language, navigation) {
        let otpMsg = "", successMsg = "";
        if (this.state.CardNumber === "") {
            this.setState({errorCardNo: language.error_card_number});
            return;
        } else {
            Utility.alertWithBack(language.ok_txt, language.success_saved, navigation)
        }
    }

    render() {
        console.log("otp_type is this", this.state.otp_type)
        let language = this.props.language;
        return (<View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={CommonStyle.toolbar}>
                    <TouchableOpacity
                        style={CommonStyle.toolbar_back_btn_touch}
                        onPress={() => this.props.navigation.goBack(null)}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../../resources/images/ic_back_android.png") : require("../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.tag_credit_card}</Text>
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
                    <Text style={{
                        marginTop: Utility.setWidth(10),
                        marginStart: Utility.setWidth(10),
                        marginEnd: Utility.setWidth(10)
                    }}>{language.tagCreditTitle}</Text>
                    <Text style={{marginStart: 10, marginEnd: 10}}>{language.tagCreditTitle1}</Text>
                    <Text style={{marginStart: 10, marginEnd: 10}}>{language.tagCreditTitle2}</Text>
                    <View style={{marginLeft: 10, marginRight: 10}}>
                        {this.tagCreditCard(language)}
                        <View style={{flex: 1, paddingBottom: 30}}>
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
                            <Text style={{
                                marginStart: Utility.setWidth(10),
                                marginTop: Utility.setWidth(10),
                                marginBottom: Utility.setWidth(10),
                                color: themeStyle.THEME_COLOR
                            }}>*{language.mark_field_mandatory}</Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={{position: "absolute", bottom: 0}}>
                    <View style={{width: "100%", height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                    <Text style={{marginStart: 10, marginTop: 10}}>{language.tagCreditBottom} </Text>
                    <Text style={{marginStart: 10,}}>{language.call} </Text>
                </View>
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
        maxHeight: Utility.getDeviceHeight() - 100,
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

export default connect(mapStateToProps)(TagCreditCardInCityTouch);
