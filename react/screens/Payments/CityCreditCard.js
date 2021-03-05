import React, {Component} from "react";
import {FlatList, Image, Platform, SafeAreaView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginScreen from "../LoginScreen";
import TermConditionScreen from "../TermConditionScreen";
import {connect} from "react-redux";
import Utility from "../../utilize/Utility";
import FontSize from "../../resources/ManageFontSize";


class CityCreditCard extends Component {
    constructor(props) {
        super(props);
        let language = props.language;
        this.state={
            options: [
                {id:0,title: props.language.ownAccount, selected: false},
                {id:1, title: props.language.cityAccount, selected: true},
            ],
            stateVal: 0,
        }
    }

    moveScreen(item) {
        switch (item.id) {
            case "add":
                this.props.navigation.navigate("Beneficiary");
                break;
            case "delete":
                this.props.navigation.navigate("Beneficiary");
                break;
        }
    }

    _renderItem = ({item, index}) => {
        return (
            <TouchableOpacity onPress={() => this.moveScreen(item)}>
                <View style={{
                    flexDirection: "row",
                    marginTop: 17,
                    marginBottom: 17,
                    //paddingLeft: 10,
                   // paddingRight: 10,
                    alignItems: "center"
                }}>
                    <Image style={{
                        height: Utility.setHeight(20),
                        width: Utility.setWidth(20),
                        marginLeft: Utility.setWidth(10),
                        marginRight: Utility.setWidth(10),
                    }} resizeMode={"contain"}
                           source={item.icon}/>
                    <Text style={[CommonStyle.labelStyle, {
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(12),
                        flex: 1,
                    }]}>{item.title}</Text>
                    <Image style={{
                        height: Utility.setHeight(12),
                        width: Utility.setWidth(30),
                        tintColor: "#b5bfc1"
                    }} resizeMode={"contain"}
                           source={require("../../resources/images/arrow_right_ios.png")}/>
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

    async changeCard(cardCode) {
        console.log("cardcode is this",cardCode)
        this.setState({
            stateVal:cardCode
        })
        console.log("statevalue is this", this.state.stateVal);
    }

    sendOption(language){
        return(
            <View style={{marginTop:10,marginStart:10,marginEnd:10}}>
                <Text>{language.send_message}</Text>
            </View>

        )
    }
    waitingOption(language){
        return(
            <View>
                <Text>{}</Text>
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
                        onPress={() => this.props.navigation.goBack(null)}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../../resources/images/ic_back_android.png") : require("../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.creditCardTitle}</Text>
                    <TouchableOpacity onPress={() => Utility.logout(this.props.navigation, language)}
                                      style={{
                                          width: Utility.setWidth(35),
                                          height: Utility.setHeight(35),
                                          position: "absolute",
                                          right: Utility.setWidth(10),
                                      }}
                                      >
                        <Image resizeMode={"contain"} style={{
                            width: Utility.setWidth(30),
                            height: Utility.setHeight(30),
                        }}
                               source={require("../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                <View style={[styles.headerLabel,{  marginTop:10,marginStart: 10,
                    marginEnd: 10,}]}>
                    <TouchableOpacity
                        onPress={() => this.changeCard(0)}
                        style={{
                            height: "100%",
                            //width: Utility.setWidth(65),,
                            paddingLeft:10,
                            paddingRight:10,
                            justifyContent: "center",
                            borderBottomLeftRadius:this.state.stateVal === 1 ? 3 : 0,
                            borderTopLeftRadius:this.state.stateVal === 1 ? 3 : 0,
                            backgroundColor: this.state.stateVal === 0 ? themeStyle.THEME_COLOR : "#F4F4F4",
                        }}>
                        <Text style={[styles.langText, {
                            color: this.state.stateVal === 0 ? themeStyle.WHITE : themeStyle.BLACK
                        }]}>{this.props.language.own_creditCardPayment}</Text>
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
                        }]}>{this.props.language.other_creditCardPayment}</Text>
                    </TouchableOpacity>
                </View>

                {this.state.stateVal === 0 ? this.sendOption(language) : this.waitingOption(language)}

            </View>)
    }

    componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.THEME_COLOR);
                StatusBar.setBarStyle("light-content");
            });
        }
        // bottom tab management
        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.transfer
        });
    }
}
const styles = {
    headerLabel: {
        flexDirection: "row",
        //backgroundColor: themeStyle.THEME_COLOR,
        height: Utility.setHeight(35),
        borderRadius: 5,
        borderWidth: 1,
        borderColor: themeStyle.WHITE,
        overflow: "hidden"
    },
}
const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(CityCreditCard);

