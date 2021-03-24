import React, {Component} from "react";
import {
    BackHandler, FlatList,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text, TextInput,
    TouchableOpacity,
    View
} from "react-native";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import Utility from "../../utilize/Utility";
import {connect} from "react-redux";
import {AddBeneficiary} from "../Requests/RequestBeneficiary";
import {BusyIndicator} from "../../resources/busy-indicator";
import FontSize from "../../resources/ManageFontSize";

class PaymentDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            nickname: "",
            error_nickname: "",
            isMainScreen: true,
            emailTxt: "",
            errorEmail: "",
            mobileNo: "",
            errorMobileNo: "",
            merchantName:"",
            merchantCity:"",
            paymentAmount:"",
            grandTotal:"",
            billNumber:"",
            storeLabel:"",
            terminalLabel:"",
            remarks:"",
            error_remarks:"",
            errorPaymentAmount:"",
            data:[
                {
                    "cardNumber": "AMEX CITY MAXX DEBIT",
                    "isSelected": "false",
                    "images": "https:\/\/images.unsplash.com\/photo-1494790108377-be9c29b29330?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=707b9c33066bf8808c934c8ab394dff6"
                },
                {
                    "cardNumber": "MASTER CARD DEBIT",
                    "isSelected": "false",
                    "images": "https:\/\/randomuser.me\/api\/portraits\/women\/44.jpg"
                },
                {
                    "cardNumber": "VISA PLATINUM",
                    "isSelected": "false",
                    "images": "https:\/\/randomuser.me\/api\/portraits\/women\/68.jpg"
                },
                {
                    "cardNumber": "AMEX AGORA",
                    "isSelected": "false",
                    "images": "https:\/\/randomuser.me\/api\/portraits\/women\/65.jpg"
                }
                ]
        }
    }

    onSubmit(language, navigation) {
        if (this.state.isMainScreen) {
            if (this.state.paymentAmount === "") {
                console.log("is main screen")
                this.setState({errorPaymentAmount: language.error_payment_ammt});
            }else {
                this.setState({
                    isMainScreen:false
                })
            }
        } else {

        }
    }

    backAction = () => {
        this.backEvent();
        return true;
    }

    backEvent() {
        const {isMainScreen} = this.state;
        if (isMainScreen) {
            console.log("1");
            this.props.navigation.goBack();
        } else {
            console.log("2");
            this.setState({isMainScreen: true})
        }
    }

    paymentDetails(language){
       return(
           <View style={{flex: 1, paddingBottom: 30}}>
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.merchant_name}
                </Text>
                <TextInput
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {
                        alignItems: "flex-end",
                        textAlign: 'right',
                        flex: 1,
                        marginLeft: 10
                    }]}
                    placeholder={this.state.isMainScreen ? language.please_enter : ""}
                    onChangeText={text => this.setState({
                        merchantName: text
                    })}
                    value={this.state.merchantName}
                    multiline={false}
                    editable={false}
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
                    {language.merchant_city}
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
                    onChangeText={text => this.setState({
                        merchantCity: Utility.userInput(text)
                    })}
                    value={this.state.merchantCity}
                    multiline={false}
                    editable={false}
                    numberOfLines={1}
                    contextMenuHidden={true}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                /></View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
               <View style={{
                   flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                   marginEnd: 10,
               }}>
                   <Text style={[CommonStyle.textStyle]}>
                       {language.payment_amount}
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
                       placeholder={""}
                       onChangeText={text => this.setState({
                           errorPaymentAmount:"",
                           paymentAmount: Utility.userInput(text)
                       })}
                       value={this.state.paymentAmount}
                       multiline={false}
                       numberOfLines={1}
                       contextMenuHidden={true}
                       keyboardType={"number-pad"}
                       placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                       autoCorrect={false}
                   />
               </View>
               {this.state.errorPaymentAmount !== "" ?
                   <Text style={CommonStyle.errorStyle}>{this.state.errorPaymentAmount}</Text> : null}
               <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
               <View style={{
                   flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                   marginEnd: 10,
               }}>
                   <Text style={[CommonStyle.textStyle]}>
                       {language.grandTotal_bdt}
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
                       value={this.state.grandTotal}
                       multiline={false}
                       numberOfLines={1}
                       contextMenuHidden={true}
                       keyboardType={"number-pad"}
                       placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                       autoCorrect={false}
                       editable={false}
                   />
               </View>
               <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
               <View style={{
                   flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                   marginEnd: 10,
               }}>
                   <Text style={[CommonStyle.textStyle]}>
                       {language.bill_number}
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
                       value={this.state.billNumber}
                       multiline={false}
                       numberOfLines={1}
                       contextMenuHidden={true}
                       keyboardType={"number-pad"}
                       placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                       autoCorrect={false}
                       editable={false}
                   />
               </View>
               <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
               <View style={{
                   flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                   marginEnd: 10,
               }}>
                   <Text style={[CommonStyle.textStyle]}>
                       {language.store_label}
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
                       onChangeText={text => this.setState({
                           storeLabel: Utility.userInput(text)
                       })}
                       value={this.state.storeLabel}
                       multiline={false}
                       editable={false}
                       numberOfLines={1}
                       contextMenuHidden={true}
                       placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                       autoCorrect={false}
                   /></View>
               <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
               <View style={{
                   flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                   marginEnd: 10,
               }}>
                   <Text style={[CommonStyle.textStyle]}>
                       {language.terminal_label}
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
                       onChangeText={text => this.setState({
                           terminal_label: Utility.userInput(text)
                       })}
                       value={this.state.terminalLabel}
                       multiline={false}
                       editable={false}
                       numberOfLines={1}
                       contextMenuHidden={true}
                       placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                       autoCorrect={false}
                   /></View>
               <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
               <View style={{
                   flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                   marginEnd: 10,
               }}>
                   <Text style={[CommonStyle.textStyle]}>
                       {language.remarks}
                   </Text>
                   <TextInput
                       selectionColor={themeStyle.THEME_COLOR}
                       style={[CommonStyle.textStyle, {
                           alignItems: "flex-end",
                           textAlign: 'right',
                           flex: 1,
                           marginLeft: 10
                       }]}
                       placeholder={language.et_placeholder}
                       onChangeText={text => this.setState({
                           error_remarks: "",
                           remarks: Utility.userInput(text)
                       })}
                       value={this.state.remarks}
                       multiline={false}
                       numberOfLines={1}
                       onFocus={() => this.setState({focusUid: true})}
                       onBlur={() => this.setState({focusUid: false})}
                       contextMenuHidden={true}
                       placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                       autoCorrect={false}
                       maxLength={30}/>
               </View>
               {this.state.error_remarks !== "" ?
                   <Text style={CommonStyle.errorStyle
                   }>{this.state.error_remarks}</Text> : null}
               <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
               <Text style={CommonStyle.mark_mandatory}>*{language.mark_field_mandatory}</Text>
               <View style={{marginStart:10,marginEnd:10}}>
                   <Text style={CommonStyle.themeMidTextStyle}>{language.notes}</Text>
                   <Text style={CommonStyle.themeTextStyle}>{language.payment_details_note1}</Text>
               </View>
           </View>
)
    }

    _renderItem = ({item, index}) => {
        console.log(item.images)
        return (
            <TouchableOpacity onPress={() => this.moveScreen(item)}>
                <View style={styles.renderView}>
                    <Image style={{
                        height: Utility.setHeight(20),
                        width: Utility.setWidth(20),
                        marginLeft: Utility.setWidth(10),
                        marginRight: Utility.setWidth(10),
                    }} resizeMode={"contain"}
                           source={item.images}/>
                    <Text style={[CommonStyle.labelStyle, {
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(12),
                        flex: 1,
                    }]}>{item.cardNumber}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    bottomLine() {
        return (<View style={{
            height: 1,
            marginLeft: 10,
            marginRight: 10,
            backgroundColor: "#D3D1D2"
        }}/>)

    }

    nextPaymentDetails(){
        return(
            <View>
                <FlatList scrollEnabled={true}
                          data={this.state.data}
                          renderItem={this._renderItem}
                          ItemSeparatorComponent={() => this.bottomLine()}
                          ListFooterComponent={this.bottomLine()}
                          keyExtractor={(item, index) => index + ""}
                />
            </View>
        )
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
                    <Text style={CommonStyle.title}>{language.payment_details}</Text>
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.state.isMainScreen ?this.paymentDetails(language):this.nextPaymentDetails(language)}
                    <View style={{
                        flexDirection: "row",
                        marginStart: Utility.setWidth(10),
                        marginRight: Utility.setWidth(10),
                        marginTop: Utility.setHeight(20),
                        marginBottom:Utility.setHeight(20),
                    }}>
                        <TouchableOpacity style={{flex: 1}}
                                          onPress={() => this.backEvent()}>
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
                                          onPress={() => this.onSubmit(language, this.props.navigation)}>
                            <View style={{
                                alignItems: "center",
                                justifyContent: "center",
                                height: Utility.setHeight(46),
                                borderRadius: Utility.setHeight(23),
                                backgroundColor: themeStyle.THEME_COLOR
                            }}><Text
                                style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{this.state.isMainScreen ? language.next : language.confirm}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
                <BusyIndicator visible={this.state.isProgress}/>
            </View>
        )
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
            tabBarLabel: this.props.language.city_pay
        });

    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener(
                "hardwareBackPress", this.backAction)
        }
    }

 /*   componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("this.props.language.account", this.props.language.account);
        if (prevProps.langId !== this.props.langId) {
            this.props.navigation.setOptions({
                tabBarLabel: this.props.language.transfer
            });
        }
    }*/

}

const styles = {
    renderView: {
        flexDirection: "row",
        justifyContent:"space-around",
        marginTop: 17,
        marginBottom: 17,
        paddingLeft: 10,
        paddingRight: 10,
        // alignItems: "center"
    }
}



const mapStateToProps = (state) => {
        return {
            userDetails: state.accountReducer.userDetails,
            langId: state.accountReducer.langId,
            language: state.accountReducer.language,
        };
    }
;

export default connect(mapStateToProps)(PaymentDetails);