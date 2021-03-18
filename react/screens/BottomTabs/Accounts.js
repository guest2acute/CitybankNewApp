import React, {Component} from 'react';
import {
    LayoutAnimation,
    Image,
    StyleSheet,
    View,
    Text,
    ScrollView,
    UIManager,
    TouchableOpacity,
    Platform, SafeAreaView, StatusBar, ActivityIndicator, BackHandler
} from 'react-native';

import NestedListView, {NestedRow} from 'react-native-nested-listview'
import CommonStyle from "../../resources/CommonStyle";
import themeStyle from "../../resources/theme.style";
import Utility from "../../utilize/Utility";
import {connect} from "react-redux";
import fontStyle from "../../resources/FontStyle";
import FontSize from "../../resources/ManageFontSize";
import ApiRequest from "../../config/ApiRequest";
import {BusyIndicator} from "../../resources/busy-indicator";
import themesStyle from "../../resources/theme.style";
import Config from "../../config/Config";

let balanceArr = [];
let that;

class Accounts extends Component {
    constructor(props) {
        super(props);
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        that = this;
        this.state = {dataList: null, contentVisible: false};


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

        // bottom tab management
        /* this.props.navigation.setOptions({
             tabBarLabel: this.props.language.account
         });*/

        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.account
        });


        await this.getAccounts(this.props.language, this.props.navigation)
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
                tabBarLabel: this.props.language.account
            });
        }
    }

    backAction = () => {
        Utility.exitApp(this.props.language);
        return true;
    }

    level1(node) {
        return (
            <View key={"level1"} style={{
                backgroundColor: themeStyle.THEME_COLOR,
                height: Utility.setHeight(35),
                alignItems: "center",
                marginTop: 10,
                paddingStart: 10,
                paddingEnd: 10,
                flexDirection: "row"
            }}>
                <Text
                    style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{node.title}</Text>
            </View>)
    }

    level2(node) {
        return (<View key={"level2"}>
            <View style={{
                backgroundColor: themeStyle.TITLE_BG,
                height: Utility.setHeight(35),
                alignItems: "center",
                paddingStart: 10,
                paddingEnd: 10,
                flexDirection: "row"
            }}>
                <Text
                    style={[CommonStyle.midTextStyle, {flex: 1}]}>{node.title}</Text>
                <Text style={[CommonStyle.midTextStyle]}>{this.props.language.avail_balance}</Text>
            </View>
        </View>)
    }

    level3(account) {
        return (
            <View key={"level3"}>
                <TouchableOpacity disabled={true} onPress={() => this.props.navigation.navigate("AccountDetails")}>
                    <View style={{
                        backgroundColor: themeStyle.WHITE,
                        marginLeft: 10,
                        marginRight: 10,
                        marginTop: 13,
                        marginBottom: 13
                    }}>
                        <Text style={CommonStyle.midTextStyle}>{account.PRODUCTNAME}</Text>
                        <View style={{flexDirection: "row", marginTop: 2}}>
                            <Text style={[CommonStyle.textStyle, {
                                flex: 1,
                                color: themeStyle.DIMCOLOR
                            }]}>{account.ACCOUNTORCARDNO}</Text>
                            {account.BALANCE ? <Text style={[CommonStyle.textStyle, {
                                    color: themeStyle.THEME_COLOR
                                }]}>{account.BALANCE}</Text>
                                : <View style={{
                                    width: Utility.setWidth(100),
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}><ActivityIndicator size="small" color={themesStyle.THEME_COLOR}/>
                                </View>}
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            </View>)
    }

    async getAccounts(language, navigation) {
        let userDetails = this.props.userDetails;
        this.setState({isProgress: true});
        let actReq = {
            ACTION: "GETTYPEWISEACLIST",
            CUSTOMER_DTL: userDetails.CUSTOMER_DTL_LIST,
            SCREEN_TYPE: "DASHBOARD",
            ...Config.userRequest,
            ...Config.commonReq,
        }
        let result = await ApiRequest.apiRequest.callApi(actReq, {});
        if (result.STATUS === "0") {
            await this.processSummary(result.RESPONSE);
        } else {
            this.setState({isProgress: false});
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
        }
    }


    async processSummary(responseArr) {
        let mainArray = [];
        let actArr = [];
        if (responseArr.length > 1) {
            responseArr = responseArr.sort((a, b) => {
                return parseInt(a.DISPLAY_ORDER) - parseInt(b.DISPLAY_ORDER)
            })
        }

        await responseArr.map(async (level1) => {
            let level1Obj = {title: level1.HEADER_NAME, opened: mainArray.length === 0};
            let items = [];
            let level2Arr = level1.HEADER_ACCT_DTL;
            if (level2Arr.length > 1) {
                level2Arr = level2Arr.sort(function (a, b) {
                    return parseInt(a.DISPLAY_ORDER) - parseInt(b.DISPLAY_ORDER)
                });
            }
            await level2Arr.map((level2) => {
                let level3Arr = level2.ACCT_LIST;
                if (level3Arr.length > 1) {
                    level3Arr = level3Arr.sort(function (a, b) {
                        return parseInt(a.DISPLAY_ORDER) - parseInt(b.DISPLAY_ORDER)
                    });
                }
                if (level3Arr.length > 0) {
                    let level2Obj = {
                        title: level2.PARENTPRODUCTNAME,
                        code: level2.PARENTPRODUCTCODE,
                        opened: true,
                        items: level3Arr
                    };
                    actArr = [...actArr, ...level3Arr];
                    let headerName = level2.PARENTPRODUCTNAME;
                    let index = headerName.indexOf("(#TOTAL#)");
                    if (index !== 1) {
                        headerName = headerName.substring(0, index) + " (" + level3Arr.length + ")";
                        level2Obj = {...level2Obj, title: headerName}
                    }
                    items.push(level2Obj);
                }
            });

            if (items.length > 0) {
                let headerName = level1.HEADER_NAME;
                let index = headerName.indexOf("(#TOTAL#)");
                if (index !== 1) {
                    headerName = headerName.substring(0, index) + " (" + items.length + ")";
                    level1Obj = {...level1Obj, title: headerName}
                }
                mainArray.push({...level1Obj, items});
            }

        });

        this.setState({isProgress: false, dataList: mainArray}, async () => {
            console.log("actArr", actArr.length);
            actArr.map((account) => {
                this.getBalance(account);
            });
        });
    }

    async getBalance(account) {
        let accountNo = account.ACCOUNTORCARDNO;
        let balanceReq = {
            ACCT_NO: accountNo,
            ACTION: account.PARENTPRODUCTCODE === "FD_ACCOUNT" ? "GETTERMDEPACCTDTL" : account.PARENTPRODUCTCODE === "LOAN_ACCOUNT" ? "GETLOANACCTDTL" : "GETACCTBALDETAIL",
            SOURCE: account.SOURCE,
            RES_FLAG: "B", CURRENCYCODE: "BDT",
            APPCUSTOMER_ID: account.APPCUSTOMER_ID,
            ...Config.commonReq,
        }

        if (account.PRODUCTTYPE === "SBA") {
            balanceReq = {...balanceReq, RES_FLAG: "B", CURRENCYCODE: ""}
        } else {
            balanceReq = {...balanceReq}
        }

        await ApiRequest.apiRequest.callApi(balanceReq, {}).then(result => {
            if (result.STATUS === "0") {
                if (accountNo === "4541407554008")
                    console.log("responseArr", result);
                let response = result.RESPONSE.filter((e) => e.ACCOUNTNUMBER === accountNo || e.ACCOUNT === accountNo);
                if (response.length > 0)
                    this.processBalance(account.PARENTPRODUCTCODE === "LOAN_ACCOUNT" ? response[0].TOTALOUTSTANDING : response[0].BALANCE, accountNo, "");
            } else {
                this.processBalance("", accountNo, "");
            }
        }).catch(error => {
            Utility.alert(error);
            console.log("error", error);
        });

    }

    processBalance(balance, accountNo, message) {
        balance = balance === "" ? this.props.language.notAvailable : balance;
        let dataList = this.state.dataList;
        let objectPos = -1;
        let object;
        let level1Pos = -1;
        let level2Pos = -1;
        for (let l1 = 0; l1 < dataList.length; l1++) {
            let dataItem = dataList[l1].items;
            for (let l2 = 0; l2 < dataItem.length; l2++) {
                objectPos = dataItem[l2].items.findIndex(item => item.ACCOUNTORCARDNO === accountNo);
                if (objectPos > -1) {
                    level1Pos = l1;
                    level2Pos = l2;
                    object = dataItem[l2].items[objectPos];
                    break;
                }
            }
            if (objectPos > -1) {
                break;
            }
        }

        let level3Arr = dataList[level1Pos].items[level2Pos].items;
        object = {...object, BALANCE: balance};
        level3Arr[objectPos] = object;
        dataList[level1Pos].items[level2Pos] = {...dataList[level1Pos].items[level2Pos], items: level3Arr};
        dataList[level1Pos] = {...dataList[level1Pos], items: dataList[level1Pos].items};
        this.setState({dataList: dataList});
    }

    render() {
        let language = this.props.language;
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={[styles.toolbar, {marginBottom: 0}]}>
                    <Image resizeMode={"contain"}
                           style={{width: Utility.setWidth(90), height: Utility.setHeight(50)}}
                           source={require("../../resources/images/citytouch_header.png")}/>
                    <TouchableOpacity
                        style={{
                            width: Utility.setWidth(35),
                            height: Utility.setHeight(35),
                            position: "absolute",
                            right: Utility.setWidth(10),
                            top: Utility.setHeight(15),
                        }}
                        onPress={() => Utility.logout(this.props.navigation, language)}>
                        <Image resizeMode={"contain"} style={{
                            width: Utility.setWidth(35),
                            height: Utility.setHeight(35),
                        }}
                               source={require("../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                    <Text style={styles.title}>{language.goodEvening + this.props.userDetails.CUSTOMER_NM}</Text>
                </View>

                {this.state.dataList !== null ? <NestedListView
                    data={this.state.dataList}
                    getChildrenName={(node) => 'items'}
                    onNodePressed={(node) => this.setState({contentVisible: !this.state.contentVisible})}
                    renderNode={(node, level, isLastLevel) => {
                        return (
                            <NestedRow
                                paddingLeftIncrement={0}
                                level={level}>
                                {level === 1 ? this.level1(node) : level === 2 ? this.level2(node) : this.level3(node)}
                            </NestedRow>
                        )
                    }
                    }
                /> : null}
                <BusyIndicator visible={this.state.isProgress}/>
            </View>
        );
    }
}


const
    styles = StyleSheet.create({
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 5,
            backgroundColor: "blue"
        },

        toolbar: {
            justifyContent: "center",
            backgroundColor: themeStyle.THEME_COLOR,
            alignItems: "center",
            paddingBottom: 7
        },
        title: {
            fontFamily: fontStyle.RobotoMedium,
            fontSize: FontSize.getSize(12),
            color: themeStyle.WHITE
        },

    });


const
    mapStateToProps = (state) => {
        return {
            userDetails: state.accountReducer.userDetails,
            langId: state.accountReducer.langId,
            language: state.accountReducer.language,
        };
    };

export default connect(mapStateToProps)

(
    Accounts
)
;
