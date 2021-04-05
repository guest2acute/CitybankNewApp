import React, {Component} from "react";
import {
    Platform,
    StatusBar,
    View,
    Image,
    Text,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    SectionList, BackHandler, TextInput, TouchableWithoutFeedback
} from "react-native";

import {actions} from "../../redux/actions";
import {connect} from "react-redux";
import Config from "../../config/Config";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import FontSize from "../../resources/ManageFontSize";
import Utility from "../../utilize/Utility";
import {BusyIndicator} from "../../resources/busy-indicator";
import CheckBox from "@react-native-community/checkbox";
import fontStyle from "../../resources/FontStyle";
import {CARDINSERT, CARDUPDATE} from "../Requests/QRRequest";


class QRMerchantPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            isSelected: false,
            selection_type: 0,
            limit: "",
            error_limit: "",
            dataList: null,
            cardResult: null

        }
    }

    checkBoxUpdate(item, index) {
        console.log("index", item)
        this.setState({
            isSelected: !item,
        })
    }

    FlatListItemSeparator = () => {
        return (
            <View
                style={{height: 1, width: '100%', backgroundColor: themeStyle.SEPARATOR}}
            />
        );
    };

    bottomLine() {
        return (<View style={{
            height: 1,
            marginLeft: 10,
            marginRight: 10,
            backgroundColor: "#D3D1D2"
        }}/>)
    }

    _renderItem = ({item, index}) => {
        console.log("index is", item);
        return (
            <View style={[{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: 10,
                paddingRight: 10,
                marginTop: 10,
                marginBottom: 10,
            },]}>
                <View style={{flex: 1, flexDirection: "column", justifyContent: "space-around"}}>
                    <Text style={{}}>{item.CARD_NAME}</Text>
                    <Text style={{color: themeStyle.DIM_TEXT_COLOR}}>{item.SOURCE_NO}</Text>
                </View>
                <CheckBox
                    disabled={false}
                    onValueChange={(newValue) => {

                    }}
                    value={item.ACTIVE === "Y"}
                    style={CommonStyle.checkbox}
                    tintColor={themeStyle.THEME_COLOR}
                    tintColors={{true: themeStyle.THEME_COLOR, false: themeStyle.GRAY_COLOR}}
                />
            </View>
        )
    }

    qrMerchantPayment(language) {
        return (
            <View>
                <View style={{
                    margin: 10, marginEnd: 10, marginTop: 10, borderColor: themeStyle.BORDER,
                    borderRadius: 5,
                    overflow: "hidden",
                    borderWidth: 2
                }}>
                    <Text style={[CommonStyle.labelStyle, {marginStart: 10, marginTop: 10}]}>
                        {language.type_selection}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TouchableWithoutFeedback
                        accessible={false} onPress={() => {
                        this.setState({selection_type: 0});
                    }}>
                        <View style={{
                            flexDirection: "row", marginStart: 10,
                            marginEnd: 10,
                            alignItems: "center",
                            marginTop: 5, marginBottom: 5
                        }}>
                            <Image style={{
                                height: Utility.setHeight(15),
                                width: Utility.setWidth(15),
                                tintColor: themeStyle.DARK_LABEL,
                                marginEnd: 5,
                            }} resizeMode={"contain"}
                                   source={this.state.selection_type === 0 ? require("../../resources/images/check.png") : require("../../resources/images/uncheck.png")}/>
                            <Text style={[CommonStyle.textStyle]}>
                                {language.transLogin}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{
                        flexDirection: "row", marginStart: 10,
                        marginEnd: 10, alignItems: "center",
                        marginBottom: 10
                    }}>
                        <TouchableWithoutFeedback
                            accessible={false}
                            onPress={() => {
                                this.setState({selection_type: 1}, () => {
                                    this.limitRef.focus();
                                });
                            }}>
                            <View style={{
                                flexDirection: "row",
                                flex: 1, marginEnd: 10
                            }}>
                                <Image style={{
                                    height: Utility.setHeight(15),
                                    width: Utility.setWidth(15),
                                    marginEnd: 5,
                                    marginTop: 3,
                                    tintColor: themeStyle.DARK_LABEL
                                }} resizeMode={"contain"}
                                       source={this.state.selection_type === 1 ? require("../../resources/images/check.png") : require("../../resources/images/uncheck.png")}/>

                                <Text style={CommonStyle.textStyle}>
                                    {language.transLimit}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            ref={(ref) => this.limitRef = ref}
                            style={[{
                                height: Utility.setHeight(25),
                                width: Utility.setWidth(35),
                                borderWidth: 1,
                                marginLeft: 10,
                                paddingVertical: 0,
                                fontFamily: fontStyle.RobotoRegular,
                                fontSize: FontSize.getSize(11),
                                color: themeStyle.BLACK,
                                textAlign: "center"
                            }]}
                            placeholder={""}
                            onChangeText={text => this.setState({
                                error_limit: "",
                                limit: Utility.userInput(text)
                            })}
                            value={this.state.limit}
                            keyboardType={"number-pad"}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}
                            editable={this.state.selection_type === 1}
                            maxLength={2}/>
                    </View>
                    {this.state.error_limit !== "" ?
                        <Text style={CommonStyle.errorStyle}>{this.state.error_limit}</Text> : null}
                </View>
                <View style={{marginTop: 5, height: 10, backgroundColor: "#f5f4f4"}}/>
                <View style={[{
                    height: Utility.setHeight(35),
                    marginHorizontal: 10,
                    justifyContent: "center",
                }]}>
                    <Text style={[CommonStyle.textStyle, {
                        fontSize: FontSize.getSize(12),
                    }]}>{language.select_card_qr}</Text>
                </View>
                <View style={{height: 10, backgroundColor: "#f5f4f4",}}/>
            </View>
        )
    }


    async getCardList() {
        this.setState({isProgress: true});
        await CARDINSERT(this.props.userDetails, this.props)
            .then((response) => {
                console.log("response", response);
                this.setState({
                    isProgress: false,
                });
                this.processList(response);

            }, (error) => {
                this.setState({isProgress: false});
                console.log("error", error);
            });
    }

    async cardUpdate(language) {
        if (this.state.selection_type === 1 && this.state.limit === "") {
            this.setState({error_limit: language.errorTransactionLimit});
            return;
        }
        this.setState({isProgress: true});
        await CARDUPDATE(this.props.userDetails, this.state.cardResult, this.state.selection_type === 0 ? "Y" : "N", this.state.limit, this.props)
            .then((response) => {
                console.log("response", response);
                this.setState({
                    isProgress: false,
                });
                Utility.alert(language.success_updated,language.ok);
            }, (error) => {
                this.setState({isProgress: false});
                console.log("error", error);
            });
    }

    processList(result) {

        if (result.CARD_LIST.length === 0) {
            this.setState({dataList: [], cardResult: result});
            return;
        }
        let debitCardList = result.CARD_LIST.filter((e) => e.CARD_TYPE === "DEBIT CARD");
        let creditCardList = result.CARD_LIST.filter((e) => e.CARD_TYPE === "CREDIT CARD");

        let dataArr = [];
        if (debitCardList.length > 0) {
            dataArr.push({title: "Debit Card", data: debitCardList});
        }

        if (creditCardList.length > 0) {
            dataArr.push({title: "Credit Card", data: creditCardList});
        }

        this.setState({dataList: dataArr, cardResult: result}, () => {
            console.log("dataList", JSON.stringify(this.state.dataList));
        });
    }

    footer = () => {
        let language = this.props.language;
        return (<View>
            <Text style={CommonStyle.mark_mandatory}>*{language.mark_field_mandatory}</Text>
            <View style={{marginStart: 10, marginEnd: 10}}>
                <Text style={CommonStyle.themeMidTextStyle}>{language.note}</Text>
                <Text style={CommonStyle.textStyle}>{language.qr_notes}</Text>
            </View>
            <TouchableOpacity style={{flex: 1}}
                              onPress={() => this.cardUpdate(language)}>
                <View style={{
                    alignSelf: "center",
                    justifyContent: "center",
                    height: Utility.setHeight(46),
                    width: Utility.getDeviceWidth() / 2.5,
                    borderRadius: Utility.setHeight(23),
                    marginBottom: 10,
                    marginTop: 40,
                    backgroundColor: themeStyle.THEME_COLOR
                }}>
                    <Text
                        style={[CommonStyle.midTextStyle, {
                            color: themeStyle.WHITE,
                            textAlign: "center"
                        }]}>{language.update}</Text>
                </View>
            </TouchableOpacity>
        </View>)
    }

    backAction = () => {
        this.backEvent();
        return true;
    }

    backEvent() {
        this.props.navigation.goBack(null);
    }

    async componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.THEME_COLOR);
                StatusBar.setBarStyle("light-content");
            });

            BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
        }
        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.more
        });

        await this.getCardList();
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener("hardwareBackPress", this.backAction);
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
                        onPress={() => this.backEvent()}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../../resources/images/ic_back_android.png") : require("../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.qr_merchant_payment}</Text>
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
                        }} source={require("../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                {this.qrMerchantPayment(language)}

                {this.state.dataList != null && this.state.dataList.length > 0 ? <SectionList
                        ItemSeparatorComponent={this.FlatListItemSeparator}
                        sections={this.state.dataList}
                        contentContainerStyle={{paddingBottom: 30}}
                        keyExtractor={(item, index) => index + ""}
                        ListFooterComponent={this.footer}
                        renderItem={this._renderItem}
                        renderSectionHeader={({section}) => <Text
                            style={[CommonStyle.selectionBg, styles.sectionHeader]}>{section.title}</Text>}/> :
                    null}
                <BusyIndicator visible={this.state.isProgress}/>
            </View>
        );
    }
}

const styles = {
    viewStyles: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themeStyle.BG_COLOR,
    },
    sectionHeader: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 14,
    }, item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
};


const mapStateToProps = (state) => {
    return {
        userDetails: state.accountReducer.userDetails,
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(QRMerchantPayment);

