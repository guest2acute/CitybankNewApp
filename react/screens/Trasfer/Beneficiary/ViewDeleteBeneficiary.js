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
let imeiNo = "";

class ViewDeleteBeneficiary extends Component {
    constructor(props) {
        super(props);
        let language = props.language;
        console.log("language", language.bkash_account)
        this.state = {
            data: [
                {
                    id: 0,
                    name: language.my_phone,
                    beneficiaryType: language.transfer_wcb,
                    nickName: "test",
                    account_number: "2702240346001",
                    account_holder_name: "test",
                    currency: "10.00",
                    mobile_number: "8849380088",
                    email: "test@email.com"
                },
                {
                    id: 1,
                    name: language.donation,
                    beneficiaryType: language.transfer_ob,
                    nickName: "test",
                    account_number: "2702240346001",
                    account_holder_name: "test",
                    currency: "10.00",
                    mobile_number: "8849380088",
                    email: "test@email.com"
                }
            ],

            /* updateTitle: props.route.params.title*/
        }
    }

    /**
     * redirect to landing screen
     */

    async componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.THEME_COLOR);
                StatusBar.setBarStyle("light-content");
            });
        }
        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.more
        });
    }

    _renderItem = (data, rowMap) => (
        <TouchableOpacity
            onPress={() => console.log('You touched me')}
            style={styles.rowFront}
        >
            <View style={{flexDirection: "row", justifyContent: "space-between", marginStart: 10, marginEnd: 10}}>
                <Text style={CommonStyle.textStyle}>{data.item.name}</Text>
                <Text style={CommonStyle.textStyle}>{data.item.account_number}</Text>
            </View>
            <View style={{flexDirection: "column", justifyContent: "space-around", marginStart: 10, marginEnd: 10}}>
                <Text style={CommonStyle.textStyle}>{data.item.account_holder_name}</Text>
                <Text style={CommonStyle.textStyle}>{data.item.currency}</Text>
                <Text style={CommonStyle.textStyle}>{data.item.mobile_number}</Text>
                <Text style={CommonStyle.textStyle}>{data.item.email}</Text>
            </View>
        </TouchableOpacity>
    )

    onItemOpen = rowKey => {
        console.log('This row opened', rowKey);
    }

    bottomLine() {
        return (<View style={{
            height: 1,
            marginLeft: 10,
            marginRight: 10,
            backgroundColor: "#D3D1D2"
        }}/>)
    }

    deleteRow = (data, rowMap) => {
        Alert.alert(
            "",
            this.props.language.deleteAlert,
            [
                {text: this.props.language.no_txt},
                {text: this.props.language.yes_txt, onPress: () => this.deleteValue(data)},
            ]
        );
    }

    deleteValue(data) {
        const filterArray = this.state.data.filter(e => e.id !== data.item.id)
        this.setState({data: filterArray})
    }

    render() {
        let language = this.props.language;
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
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
                    <Text style={CommonStyle.title}>{language.view_delete_beneficiary}</Text>
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
                               source={require("../../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                <View style={{alignItems: "center", paddingTop: 10, paddingBottom: 10}}>
                    <Text style={styles.title}>{language.favoriteTitle}</Text>
                </View>
                {this.state.data.length > 0 ?
                    <SwipeListView
                        data={this.state.data}
                        renderItem={this._renderItem} 
                        keyExtractor={(item,index) => index+""}
                        renderHiddenItem={(data, rowMap) => (
                            <View style={styles.rowBack}>
                                <TouchableOpacity
                                    style={[styles.backRightBtn, styles.backRightBtnRight]}
                                    onPress={() => this.deleteRow(data, rowMap)}
                                >
                                    <Text style={styles.backTextWhite}>{language.delete}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        rightOpenValue={-75}
                        disableRightSwipe={true}
                    />
                :
                <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                    <Text style={CommonStyle.textStyle}>{language.noBeneficiaryAdded}</Text>
                </View>
                }
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
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        // justifyContent: 'center',
        flex: 1
    },
    rowBack: {
        alignItems: 'center',
        // backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
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
