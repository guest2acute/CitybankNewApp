import React, {Component} from "react";
import {
    BackHandler,
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
import fontStyle from "../../resources/FontStyle";

class Receipt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.route.params.transferArray,
            title:this.props.route.params.title,
        }
    }

    onSubmit(language, navigation) {
        if (this.state.isMainScreen) {
        } else {

        }
    }

    receiptView(language){
        return (
            this.state.data.map((item) => {
                    return (
                        <View>
                            <View style={{
                                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                                marginEnd: 10,
                            }}>
                                <Text style={[CommonStyle.textStyle,{color:themeStyle.THEME_COLOR}]}>
                                    {item.key}
                                </Text>
                                <Text style={[CommonStyle.viewText,{color:themeStyle.PLACEHOLDER_COLOR}]}>{item.value}</Text>
                            </View>
                            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                        </View>
                    )
                }
            )
        )
    }


    render() {
        let language = this.props.language;
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.toolbar}>
                        <View style={{flexDirection:"column",justifyContent:"space-between"}}>
                            <Text style={[CommonStyle.textStyle,{textAlign:"center",color: themeStyle.WHITE,fontSize: FontSize.getSize(16)}]}>{language.receipt}</Text>
                            <Text style={[CommonStyle.textStyle,{marginTop:10,marginBottom:5,textAlign:"center",fontSize: FontSize.getSize(20),  fontFamily: fontStyle.RobotoBold,color: themeStyle.WHITE}]}>{language.thank_you}</Text>
                            <Text style={[CommonStyle.textStyle,{textAlign:"center",fontSize: FontSize.getSize(17),color: themeStyle.WHITE}]}>{language.transaction_success}</Text>
                            <Text style={[CommonStyle.textStyle,{marginBottom:10,textAlign:"center",color: themeStyle.DIM_DIM_COLOR}]}>{language.approval_id}</Text>
                        </View>
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
                    {this.receiptView(language)}
                    <View style={{
                        flexDirection: "row",
                        marginStart: Utility.setWidth(10),
                        marginRight: Utility.setWidth(10),
                        marginTop: Utility.setHeight(20),
                        marginBottom:Utility.setHeight(20)
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
                                    style={[CommonStyle.midTextStyle, {color: themeStyle.THEME_COLOR}]}>{language.addToFavorite}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{width: Utility.setWidth(20)}}/>

                        <TouchableOpacity style={{flex: 1}}
                                          onPress={() => {}}>
                            <View style={{
                                alignItems: "center",
                                justifyContent: "center",
                                height: Utility.setHeight(46),
                                borderRadius: Utility.setHeight(23),
                                backgroundColor: themeStyle.THEME_COLOR
                            }}>
                                <Text
                                    style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{language.save_share}</Text>
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
            tabBarLabel: this.props.language.transfer
        });

    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener(
                "hardwareBackPress", this.backAction)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("this.props.language.account", this.props.language.account);
        if (prevProps.langId !== this.props.langId) {
            this.props.navigation.setOptions({
                tabBarLabel: this.props.language.transfer
            });
        }
    }
}

const styles = {
    toolbar: {
        flexDirection: "row",
         justifyContent: "center",
        height: Utility.setHeight(130),
        backgroundColor: themeStyle.THEME_COLOR,
         // alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15
    },
}

const mapStateToProps = (state) => {
        return {
            userDetails: state.accountReducer.userDetails,
            langId: state.accountReducer.langId,
            language: state.accountReducer.language,
        };
    }
;

export default connect(mapStateToProps)(Receipt);