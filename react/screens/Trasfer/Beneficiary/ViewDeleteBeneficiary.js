import React, {Component} from "react";
import {
    Platform,
    StatusBar,
    View,
    Image,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    SafeAreaView,
    FlatList,
    Alert
} from "react-native";

import {actions} from "../../../redux/actions";
import {connect} from "react-redux";
import Config from "../../../config/Config";

import themeStyle from "../../../resources/theme.style";
import Utility from "../../../utilize/Utility";
import CommonStyle from "../../../resources/CommonStyle";
import fontStyle from "../../../resources/FontStyle";
import FontSize from "../../../resources/ManageFontSize";
import StorageClass from "../../../utilize/StorageClass";

import {SwipeListView} from 'react-native-swipe-list-view';

/**
 * splash page
 */

class ViewDeleteBeneficiary extends Component {
    constructor(props) {
        super(props);
        let language = props.language;
        console.log("language", language.bkash_account)
        this.state = {
            title: props.route.params.title,
            data: [
                {
                    id: 0,
                    nickName: "Shoeb",
                    account_number: "2702240346001",
                    account_holder_name: "Shoeb Khan",
                    currency: "BDT",
                    mobile_number: "8849380080",
                    email: "shoeb.khan@email.com"
                },
                {
                    id: 1,
                    nickName: "Irfan",
                    account_number: "2702240346001",
                    account_holder_name: "Irfan pathan",
                    currency: "BDT",
                    mobile_number: "8849380084",
                    email: "irfan.pathan@email.com"
                },
                {
                    id: 2,
                    nickName: "Rahim",
                    account_number: "2702240346001",
                    account_holder_name: "Rahim khan",
                    currency: "BDT",
                    mobile_number: "8849380082",
                    email: "rahim@email.com"
                },
                {
                    id: 3,
                    nickName: "Sarfraj",
                    account_number: "2702240346001",
                    account_holder_name: "Sarfraj Ahmed",
                    currency: "BDT",
                    mobile_number: "8849380085",
                    email: "rahim@email.com"
                }

            ],
        }
    }


    async componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.THEME_COLOR);
                StatusBar.setBarStyle("light-content");
            });
        }
        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.transfer
        });
    }

    _renderItem = (data) => (
        <View style={styles.rowFront}>
            <View style={{flexDirection: "row", justifyContent: "space-between", marginStart: 10, marginEnd: 10}}>
                <Text style={CommonStyle.themeMidTextStyle}>{data.item.nickName}</Text>
                <Text style={CommonStyle.themeMidTextStyle}>{data.item.currency}</Text>
            </View>
            <View style={{flexDirection: "column", justifyContent: "space-around", marginStart: 10, marginEnd: 10}}>
                <Text style={CommonStyle.midTextStyle}>{data.item.account_holder_name}</Text>
                <Text style={CommonStyle.textStyle}>{data.item.account_number}</Text>
                <Text style={CommonStyle.textStyle}>{data.item.email}</Text>
                <Text style={CommonStyle.textStyle}>{data.item.mobile_number}</Text>
            </View>
            <TouchableOpacity onPress={() => this.deleteBeneficiary(data)} style={{
                width: 25, position: "absolute",
                right: Utility.setWidth(10),
                top: Utility.setHeight(50),
                height: 25
            }}>
                <Image style={{
                    width: 20,
                    height: 20,
                    tintColor: themeStyle.THEME_COLOR,
                }} resizeMode={"contain"} source={require("../../../resources/images/icon-close.png")}/>
            </TouchableOpacity>
        </View>
    )

    onItemOpen = rowKey => {
        console.log('This row opened', rowKey);
    }

    deleteBeneficiary = (data) => {
        console.log("data", data);
        Alert.alert(
            Config.appName,
            this.props.language.deleteAlert,
            [
                {text: this.props.language.no_txt},
                {text: this.props.language.yes_txt, onPress: () => this.deleteValue(data)},
            ]
        );
    }

    deleteValue(data) {
        const filterArray = this.state.data.filter(e => e.id !== data.item.id)
        this.setState({data: filterArray});
    }

    render() {
        let language = this.props.language;
        return (
            <View style={{flex: 1, backgroundColor: "#F5F5F5"}}>
                <SafeAreaView/>
                <View style={[CommonStyle.toolbar, {flexDirection: "row"}]}>
                    <TouchableOpacity
                        style={CommonStyle.toolbar_back_btn_touch}
                        onPress={() => this.props.navigation.goBack(null)}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../../../resources/images/ic_back_android.png") :
                                   require("../../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={[CommonStyle.title, {flex: 1}]}>{this.state.title}</Text>
                    <TouchableOpacity onPress={() => this.redirect()}
                                      style={{}}>
                        <Image resizeMode={"contain"} style={{
                            width: Utility.setWidth(25),
                            height: Utility.setHeight(25),
                            tintColor: themeStyle.WHITE
                        }}
                               source={require("../../../resources/images/add_icon.png")}/>
                    </TouchableOpacity>
                </View>
                {this.state.data.length > 0 ?
                    <FlatList
                        data={this.state.data}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index + ""}
                    /> :
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                        <Text style={CommonStyle.textStyle}>{language.noBeneficiaryAdded}</Text>
                    </View>
                }
            </View>
        );
    }

    redirect() {
        this.props.navigation.navigate(this.props.route.params.screenName, {title: this.props.route.params.addTitle});
    }
}


const styles = {
    viewStyles: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themeStyle.BG_COLOR,
    },
    toolbar: {
        justifyContent: "center",
        backgroundColor: themeStyle.THEME_COLOR,
        alignItems: "center",
        paddingBottom: 7
    },
    title: {
        fontFamily: fontStyle.RobotoMedium,
        fontSize: FontSize.getSize(14),
        color: themeStyle.THEME_COLOR
    },
    rowFront: {
        // alignItems: 'center',
        backgroundColor: themeStyle.WHITE,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 10,
        paddingTop: 10,
        borderBottomColor: "#F5F5F5",
        borderBottomWidth: 5,
        flex: 1
    },
    rowBack: {
        backgroundColor: "#FF0000",
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: "#F5F5F5",
        borderBottomWidth: 5,
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: Utility.setWidth(75),
    },
    backRightBtnLeft: {
        right: Utility.setWidth(75),
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
    backTextWhite: {
        color: '#FFF',
    },
}


const mapStateToProps = (state) => {
    return {
        userDetails: state.accountReducer.userDetails,
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(ViewDeleteBeneficiary);

