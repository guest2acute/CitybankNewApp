import React, {Component} from "react";
import {
    Platform,
    StatusBar,
    View,
    Image,
    Text,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    ScrollView,BackHandler
} from "react-native";

import {actions} from "../../redux/actions";
import {connect} from "react-redux";
import Config from "../../config/Config";

import themeStyle from "../../resources/theme.style";
import Utility from "../../utilize/Utility";
import CommonStyle from "../../resources/CommonStyle";
import fontStyle from "../../resources/FontStyle";
import FontSize from "../../resources/ManageFontSize";
import StorageClass from "../../utilize/StorageClass";
import { ValueAddedServicesDetails } from "../Requests/CommonRequest";

class ValueAddedServices extends Component {

    constructor(props) {
        super(props);
        let language = props.language;
        this.state = {
            stateVal: 0,
            data: [],
        }
    }

    moveScreen(item) {
        console.log("redirectScreen", item.redirectScreen)
        this.props.navigation.navigate(item.redirectScreen, {title: item.title, subCategory: item.subCategory});
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
            tabBarLabel: this.props.language.payments
        });
        this.setState({data: ValueAddedServicesDetails(this.props.language)});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.langId !== this.props.langId) {
            this.setState({data: ValueAddedServicesDetails(this.props.language)});
            this.props.navigation.setOptions({
                tabBarLabel: this.props.language.payments
            });
        }
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener("hardwareBackPress", this.backAction);
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
                <View style={styles.renderView}>
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
        console.log("cardCode", cardCode);
        this.setState({
            stateVal: cardCode
        })
    }


    payeeCategory(language){
        return(
                <FlatList scrollEnabled={true}
                          data={this.state.data}
                          renderItem={this._renderItem}
                          ItemSeparatorComponent={() => this.bottomLine()}
                          ListFooterComponent={this.bottomLine()}
                          keyExtractor={(item, index) => index + ""}
                />
        )
    }

    payeeList(language){
        return(
            <View>
                <Text>payee list</Text>
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
                    <Text style={CommonStyle.title}>{language.value_added_service_title}</Text>
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
                               source={require("../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                <View style={[styles.headerLabel, {
                    marginTop: 10, marginStart: 10,
                    marginEnd: 10,
                }]}>
                    <TouchableOpacity
                        onPress={() => this.changeCard(0)}
                        style={{
                            height: "100%",
                            alignItems: "center",
                            flex: 1,
                            justifyContent: "center",
                            borderBottomLeftRadius: this.state.stateVal === 1 ? 3 : 0,
                            borderTopLeftRadius: this.state.stateVal === 1 ? 3 : 0,
                            backgroundColor: this.state.stateVal === 0 ? themeStyle.THEME_COLOR : "#F4F4F4",
                        }}>
                        <Text style={[styles.langText, {
                            color: this.state.stateVal === 0 ? themeStyle.WHITE : themeStyle.BLACK,
                            fontFamily: fontStyle.RobotoMedium,
                            fontSize: FontSize.getSize(11),
                        }]}>{this.props.language.payee_category}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.changeCard(1)}
                        style={{
                            height: "100%",
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            borderBottomRightRadius: this.state.stateVal === 1 ? 5 : 0,
                            borderTopRightRadius: this.state.stateVal === 1 ? 5 : 0,
                            backgroundColor: this.state.stateVal === 1 ? themeStyle.THEME_COLOR : "#F4F4F4",
                        }}>
                        <Text style={[styles.langText, {
                            color: this.state.stateVal === 1 ? themeStyle.WHITE : themeStyle.BLACK,
                            fontFamily: fontStyle.RobotoMedium,
                            fontSize: FontSize.getSize(11),
                        }]}>{this.props.language.payee_list}</Text>
                    </TouchableOpacity>
                </View>
                {this.state.stateVal === 0 ? this.payeeCategory(language) : this.payeeList(language)}
            </View>
        );
    }
}


const styles = {
    toolbar: {
        justifyContent: "center",
        backgroundColor: themeStyle.THEME_COLOR,
        alignItems: "center",
        paddingBottom: 7
    },
    renderView: {
        flexDirection: "row",
        marginTop: 17,
        marginBottom: 17,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: "center"
    },
    headerLabel: {
        flexDirection: "row",
        height: Utility.setHeight(40),
        borderRadius: 5,
        borderWidth: 1,
        borderColor: themeStyle.WHITE,
        overflow: "hidden"
    }
}


const mapStateToProps = (state) => {
    return {
        userDetails: state.accountReducer.userDetails,
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(ValueAddedServices);

