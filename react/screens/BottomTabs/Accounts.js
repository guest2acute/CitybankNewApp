import React, {Component} from "react";
import {Image, Platform, SafeAreaView, StatusBar, Text, TouchableOpacity, View, SectionList} from "react-native";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import {connect} from "react-redux";
import Utility from "../../utilize/Utility";
import fontStyle from "../../resources/FontStyle";
import FontSize from "../../resources/ManageFontSize";


let price = "100000";

class Accounts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            sectionList: [],
            dataList: [
                {
                    "PARENTPRODUCTCODE": "CASA_ACCOUNT",
                    "PARENTPRODUCTNAME": "Current/Savings Accounts",
                    "ACCT_LIST": [
                        {
                            "PRODUCTTYPE": "SBA",
                            "CUSTOMERID": "CB2742574",
                            "ACCTNMORNMONCARD": "ABDULLAH AL MUZAHID",
                            "SOURCE": "FINACLE",
                            "PRODUCTNAME": "GENERAL SAVINGS-STAFF A/C",
                            "ACCOUNTORCARDNO": "2252742574001"
                        }
                    ]
                },
                {
                    "PARENTPRODUCTCODE": "FD_ACCOUNT",
                    "PARENTPRODUCTNAME": "Term Deposits",
                    "ACCT_LIST": []
                },
                {
                    "PARENTPRODUCTCODE": "CARD_ACCOUNT",
                    "PARENTPRODUCTNAME": "Credit Card Accounts",
                    "ACCT_LIST": [
                        {
                            "PRODUCTTYPE": "CREDIT CARD",
                            "CUSTOMERID": "1316651",
                            "ACCTNMORNMONCARD": "ABDULLAH AL MUZAHID",
                            "SOURCE": "TRANZWARE",
                            "PRODUCTNAME": "Gold Staff Dual Primary",
                            "ACCOUNTORCARDNO": "376948010808307"
                        },
                        {
                            "PRODUCTTYPE": "CREDIT CARD",
                            "CUSTOMERID": "1316651",
                            "ACCTNMORNMONCARD": "ABDULLAH AL MUZAHID",
                            "SOURCE": "TRANZWARE",
                            "PRODUCTNAME": "Agora Co-Brand Gold Staff Primary",
                            "ACCOUNTORCARDNO": "376948120417759"
                        },
                        {
                            "PRODUCTTYPE": "CREDIT CARD",
                            "CUSTOMERID": "1316651",
                            "ACCTNMORNMONCARD": "ABDULLAH AL MUZAHID",
                            "SOURCE": "TRANZWARE",
                            "PRODUCTNAME": "Biman Co-Brand Gold Staff Primary",
                            "ACCOUNTORCARDNO": "376948140029253"
                        },
                        {
                            "PRODUCTTYPE": "DEBIT CARD",
                            "CUSTOMERID": "1288849",
                            "ACCTNMORNMONCARD": "ABDULLAH AL MUZAHID",
                            "SOURCE": "TRANZWARE",
                            "PRODUCTNAME": "VISA Classic Debit - Staff",
                            "ACCOUNTORCARDNO": "4105201010697449"
                        }
                    ]
                }

            ]

        }
    }

    updateBalance(account, balance) {
        let sectionList = this.state.sectionList;
        let objectPos = -1;
        let object;
        let sectionPos = -1;

        console.log("sectionList.length", sectionList.length);
        for (let k = 0; k < sectionList.length; k++) {
            let dataItem = sectionList[k].data;
            console.log("dataItem", dataItem);
            objectPos = dataItem.indexOf(account);
            if (objectPos !== -1) {
                sectionPos = k;
                object = dataItem[objectPos];
                break;
            }
        }
        let itemArr = sectionList[sectionPos].data;
        itemArr[objectPos] = {...itemArr[objectPos], balance: balance};
        sectionList[sectionPos].data = itemArr;

        console.log("sectionList", sectionList[0].data);
        this.setState({sectionList: sectionList});
    }

    render() {
        let language = this.props.language;
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={styles.toolbar}>

                    <Image resizeMode={"contain"} style={{width: Utility.setWidth(90), height: Utility.setHeight(50)}}
                           source={require("../../resources/images/citytouch_header.png")}/>
                    <TouchableOpacity
                        style={{
                            width: Utility.setWidth(35),
                            height: Utility.setHeight(35),
                            position: "absolute",
                            right: Utility.setWidth(10),
                            top: Utility.setHeight(15)
                        }}
                        onPress={() => Utility.logout(this.props.navigation, language)}>
                        <Image resizeMode={"contain"} style={{
                            width: Utility.setWidth(35),
                            height: Utility.setHeight(35),
                        }}
                               source={require("../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                    <Text style={styles.title}>{language.goodEvening}</Text>
                </View>

                <SectionList
                    sections={this.state.sectionList}
                    renderItem={({item}) => this.renderData(item)}
                    renderSectionHeader={({section}) => this.renderHeader(section)}
                    keyExtractor={(item, index) => index}
                />
            </View>)
    }

    renderHeader(item) {
        return (
            <View>
                <View style={{
                    backgroundColor: themeStyle.TITLE_BG,
                    height: Utility.setHeight(35),
                    alignItems: "center",
                    paddingStart: 10,
                    paddingEnd: 10,
                    flexDirection: "row"
                }}>
                    <Text style={[CommonStyle.midTextStyle, {flex: 1}]}>{item.title}</Text>
                    <Text style={[CommonStyle.midTextStyle]}>{this.props.language.avail_balance}</Text>
                </View>
            </View>
        )
    }

    renderData(account) {
        return (
            <View>
                <View style={{
                    backgroundColor: themeStyle.WHITE, marginLeft: 10, marginRight: 10, marginTop: 13, marginBottom: 13
                }}>
                    <Text style={CommonStyle.midTextStyle}>{account.PRODUCTNAME}</Text>
                    <View style={{flexDirection: "row", marginTop: 2}}>
                        <Text style={[CommonStyle.textStyle, {
                            flex: 1,
                            color: themeStyle.DIMCOLOR
                        }]}>{account.ACCOUNTORCARDNO}</Text>
                        <TouchableOpacity onPress={() => this.updateBalance(account, "10000")}>
                            <Text style={[CommonStyle.textStyle, {
                                color: themeStyle.THEME_COLOR
                            }]}>{account.balance ? account.balance : this.props.language.view_balance}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            </View>
        )
    }

    processAccounts() {
        const {sectionList, dataList} = this.state;
        let dataArr = []
        dataList.map((item, i) => {
            if (item.ACCT_LIST.length > 0)
                dataArr.push({title: item.PARENTPRODUCTNAME, data: item.ACCT_LIST})
        });
        this.setState({sectionList: dataArr});
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
            tabBarLabel: this.props.language.account
        });

        this.processAccounts();
    }

}

const styles = {
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
}

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(Accounts);

