import React, {Component} from "react";
import {
    BackHandler,
    FlatList,
    Image,
    Platform,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import themeStyle from "../../../resources/theme.style";
import CommonStyle from "../../../resources/CommonStyle";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginScreen from "../../LoginScreen";
import TermConditionScreen from "../../TermConditionScreen";
import {connect} from "react-redux";
import Utility from "../../../utilize/Utility";
import FontSize from "../../../resources/ManageFontSize";


class BeneficiaryManagement extends Component {
    constructor(props) {
        super(props);
        let language = props.language;
        this.state={
            data: [
                {
                    id: "add",
                    title: language.add_beneficiary,
                    icon: require("../../../resources/images/ic_profile.png")
                },
                {
                    id: "delete",
                    title: language.delete_beneficiary,
                    icon: require("../../../resources/images/contact_icon.png")
                }
            ]
        }
    }

    moveScreen(item) {
        switch (item.id) {
            case "add":
                this.props.navigation.navigate("Beneficiary");
                break;
            case "delete":
                this.props.navigation.navigate("ViewDeleteBeneficiary");
                break;
        }
    }

    backAction = () => {
        this.backEvent();
        return true;
    }

    backEvent() {
        this.props.navigation.goBack();
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
                           source={require("../../../resources/images/arrow_right_ios.png")}/>
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
                                   require("../../../resources/images/ic_back_android.png") : require("../../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.beneficiary_management}</Text>
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
                               source={require("../../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>

                <View>
                    <FlatList data={this.state.data}
                              renderItem={this._renderItem}
                              ItemSeparatorComponent={() => this.bottomLine()}
                              ListFooterComponent={this.bottomLine()}
                              keyExtractor={(item, index) => index + ""}
                    />
                </View>

            </View>)
    }

    componentDidMount() {
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
        // bottom tab management
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
}

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(BeneficiaryManagement);

