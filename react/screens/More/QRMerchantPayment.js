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
    SectionList, FlatList, TextInput
} from "react-native";

import {actions} from "../../redux/actions";
import {connect} from "react-redux";
import Config from "../../config/Config";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import FontSize from "../../resources/ManageFontSize";
import Utility from "../../utilize/Utility";
import {BusyIndicator} from "../../resources/busy-indicator";
import RadioForm from "react-native-simple-radio-button";
import CheckBox from "@react-native-community/checkbox";
import fontStyle from "../../resources/FontStyle";

class QRMerchantPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            isSelected: false,
            otp_type: 0,
            limit: "",
            error_limit:"",
            data: [
                {
                    title: "Debit Card",
                    data: [{cardname: "AMEX", cardnumber: "371599*****0875", isSelected: false}, {
                        cardname: "MASTER",
                        cardnumber: "371599*****0875", isSelected: false

                    }]
                },
                {
                    title: "Credit Card",
                    data: [{cardname: "VISA", cardnumber: "371599*****0875", isSelected: false}, {
                        cardname: "AMEX AGORA",
                        cardnumber: "371599*****0875", isSelected: false
                    }, {cardname: "AMEX", cardnumber: "371599*****0875", isSelected: false}]
                }
            ]

        }
    }

    checkBoxUpdate(item, index) {

        console.log("index", item)
            this.setState({
                isSelected: !item,
            })
        /* let counter = 0;
         let newArray = [];
         let array = this.state.data;
         array.map((item) => {
             console.log("test count",counter === index)
             if (counter === index) {
                 item = {...item, isSelected:true}
             } else {
                 item = {...item, isSelected:false}
             }
             console.log("item", item)
             newArray.push(item)
             counter++;
         })
         console.log("newArray", newArray);
         this.setState({
             data: newArray,
         })*/

    }

    FlatListItemSeparator = () => {
        return (
            //Item Separator
            <View
                style={{ height: 1, width: '100%', backgroundColor: themeStyle.SEPARATOR }}
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
        console.log("index is", this.state.isSelected)
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
                    <Text style={{}}>{item.cardname}</Text>
                    <Text style={{color: themeStyle.DIM_TEXT_COLOR}}>{item.cardnumber}</Text>
                </View>
                {/*<View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>*/}
                <CheckBox
                    disabled={false}
                    onValueChange={(newValue) => this.setState({
                        isSelected: !newValue,
                    })}
                     /*onValueChange={this.checkBoxUpdate(item,index)}*/
                    value={this.state.isSelected}
                    style={CommonStyle.checkbox}
                    tintColor={themeStyle.THEME_COLOR}
                    tintColors={{true: themeStyle.THEME_COLOR, false: themeStyle.GRAY_COLOR}}
                />
            </View>
        )
    }
    qrMerchantPayment(language){
        return(
            <View>
                <View style={{
                    marginStart: 10, marginEnd: 10, marginTop: 10, borderColor: themeStyle.BORDER,
                    borderRadius: 5,
                    overflow: "hidden",
                    borderWidth: 2
                }}>
                    <Text style={[CommonStyle.labelStyle, {marginStart: 10, marginTop: 10}]}>
                        {language.type_selection}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <View style={{
                        flexDirection: "row", marginStart: 10,
                        marginEnd: 10,
                    }}>

                        <RadioForm
                            radio_props={language.typeOfSelection_props}
                            initial={0}
                            buttonSize={9}
                            selectedButtonColor={themeStyle.THEME_COLOR}
                            formHorizontal={false}
                            labelHorizontal={true}
                            borderWidth={1}
                            buttonColor={themeStyle.GRAY_COLOR}
                            labelColor={themeStyle.BLACK}
                            labelStyle={[CommonStyle.textStyle, {marginRight: 4}]}
                            style={{marginTop: 5,}}
                            animation={true}
                            onPress={(value) => {
                                this.setState({otp_type: value});
                            }}
                        />
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[ {
                                height:Utility.setHeight(30),
                                width: Utility.setHeight(22),
                                marginTop: 22,
                                borderWidth: 1,
                                fontFamily: fontStyle.RobotoRegular,
                                fontSize: FontSize.getSize(8),
                                color: themeStyle.BLACK,
                                textAlign:"center"
                            }]}
                            placeholder={""}
                            onChangeText={text => this.setState({
                                error_limit:"",
                                limit: Utility.userInput(text)
                            })}
                            value={this.state.limit}
                            keyboardType={"number-pad"}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}
                            editable={this.state.otp_type==1?true:false}
                            maxLength={2}/>
                    </View>
                    {this.state.error_limit !== "" ?
                        <Text style={CommonStyle.errorStyle}>{this.state.error_limit}</Text> : null}
                </View>
                <View style={{marginTop: 5, height: 10, backgroundColor: "#f5f4f4",}}></View>
                <View style={[{
                    height: Utility.setHeight(35),
                    marginHorizontal:10,
                     justifyContent: "center",
                    // alignItems: "center",
                    // backgroundColor: themeStyle.GRAY_COLOR,
                }]}>
                    <Text style={[CommonStyle.textStyle, {
                        fontSize: FontSize.getSize(12),
                    }]}>{language.select_card_qr}</Text>
                </View>
                <View style={{height: 10, backgroundColor: "#f5f4f4",}}></View>
            </View>
        )
    }

    qrMerchantPaymentView(language) {
        console.log("data console", this.state.data)
        return (
            <View style={{flex: 1, paddingBottom: 30}}>
                <SectionList
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    sections={this.state.data}
                    keyExtractor={(item, index) => item + index}
                    renderItem={this._renderItem}
                    renderSectionHeader={({section}) => <Text
                        style={[CommonStyle.selectionBg, styles.sectionHeader]}>{section.title}</Text>}

                />

                <Text style={CommonStyle.mark_mandatory}>*{language.mark_field_mandatory}</Text>
                <View style={{marginStart: 10, marginEnd: 10}}>
                    <Text style={CommonStyle.themeMidTextStyle}>{language.notes}</Text>
                    <Text style={CommonStyle.textStyle}>{language.qr_notes}</Text>
                    <Text style={CommonStyle.textStyle}>{language.qr_notes1}</Text>
                </View>
            </View>
        )
    }


    onSubmit(language, navigation) {
        console.log("submit")
        if (this.state.limit === "") {
            this.setState({error_limit: language.errorTransactionLimit});
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.qrMerchantPaymentView(language)}
                    <View style={{
                        flexDirection: "row",
                        marginStart: Utility.setWidth(10),
                        marginRight: Utility.setWidth(10),
                        marginTop: Utility.setHeight(20)
                    }}>
                        <TouchableOpacity style={{flex: 1,}}
                                          onPress={() => this.onSubmit(language, this.props.navigation)}>
                            <View style={{
                                flex: 1,
                                alignSelf: "center",
                                justifyContent: "center",
                                height: Utility.setHeight(46),
                                width: Utility.getDeviceWidth() / 2.5,
                                borderRadius: Utility.setHeight(23),
                                marginBottom: 10,
                                backgroundColor: themeStyle.THEME_COLOR
                            }}>
                                <Text
                                    style={[CommonStyle.midTextStyle, {
                                        color: themeStyle.WHITE,
                                        textAlign: "center"
                                    }]}>{language.update}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
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
        // backgroundColor: 'rgba(247,247,247,1.0)',
    }, item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
};


const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(QRMerchantPayment);

