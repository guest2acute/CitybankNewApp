import React, {Component} from "react";
import {Platform, StatusBar, View, Image, TouchableOpacity, Modal, Text, FlatList,} from "react-native";
import {connect} from "react-redux";
import themeStyle from "../../resources/theme.style";
import Utility from "../../utilize/Utility";
import FontSize from "../../resources/ManageFontSize";
import fontStyle from "../../resources/FontStyle";
import CommonStyle from "../../resources/CommonStyle";
import CheckBox from "@react-native-community/checkbox";


class AccountDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            isDeposit: false,
            isWithdraw: false
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
        // bottom tab management
        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.account
        });
    }

    _renderItem = ({item, index}) => {
        return (
            <View style={{
                paddingTop: 5,
                paddingBottom: 5,
                width: Utility.getDeviceWidth(),
                flexDirection: "row",
                backgroundColor: index % 2 === 0 ? null : themeStyle.SEPARATOR
            }}>
                <Text style={[styles.textStyle, {width: Utility.setWidth(90), textAlign: "center"}]}>{item.Date}</Text>
                <Text style={[styles.textStyle, {flex: 1, fontSize: 9}]}>{item.Description}</Text>
                <Text style={[styles.textStyle, {
                    color: themeStyle.THEME_COLOR,
                    textAlign: "center",
                }]}>{item.Type}</Text>
                <Text style={[styles.textStyle, {
                    color: themeStyle.THEME_COLOR,
                    width: Utility.setWidth(60),
                    textAlign: "center",
                }]}>{item.Amount}</Text>
            </View>
        );
    };

    render() {
        let language = this.props.language;
        return (
            <View style={styles.viewStyles}>
                <View style={styles.toolbar}>
                    <TouchableOpacity
                        style={[CommonStyle.toolbar_back_btn_touch, {
                            position: "absolute",
                            left: Utility.setWidth(10),
                            top: Utility.setHeight(10),
                        }]}
                        onPress={() => this.props.navigation.goBack()}>
                        <Image resizeMode={"contain"} style={
                            CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../../resources/images/ic_back_android.png") : require("../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>

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
                    <Text style={styles.title}>GENRAL SAVINGS STAFF A/C</Text>
                    <Text style={styles.title}>157,596,48</Text>
                    <Text style={styles.title}>{language.current_balance}</Text>
                </View>
                <View style={{
                    flexDirection: "row",
                    marginTop: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 20
                }}>
                    <TouchableOpacity style={{
                        backgroundColor: themeStyle.THEME_COLOR,
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 5,
                        paddingBottom: 5
                    }}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: themeStyle.WHITE,
                        }]}>{language.recent_trans}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        this.setState({isVisible: !this.state.isVisible})
                    }}>
                        <Image resizeMode={"contain"} style={{
                            width: Utility.setWidth(30),
                            height: Utility.setHeight(30),
                        }}
                               source={require("../../resources/images/ic_filter_red.png")}/>
                    </TouchableOpacity>
                </View>

                <View style={{
                    width: "100%",
                    paddingTop: 5,
                    paddingBottom: 5,
                    marginRight: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: themeStyle.SEPARATOR,
                    flexDirection: "row",
                }}>
                    <Text style={[styles.midTextStyle, {
                        width: Utility.setWidth(90),
                        textAlign: "center"
                    }]}>{language.dateTitle}</Text>
                    <Text
                        style={[styles.midTextStyle, {flex: 1, textAlign: "center"}]}>{language.descriptionTitle}</Text>
                    <Text style={[styles.midTextStyle, {
                        width: Utility.setWidth(60),
                        textAlign: "center"
                    }]}>{language.typeTitle}</Text>
                    <Text style={[styles.midTextStyle, {
                        width: Utility.setWidth(60),
                        textAlign: "center"
                    }]}>{language.amountTitle}
                    </Text>
                </View>
                <FlatList
                    data={[
                        {
                            Date: '22-AUG-2020',
                            Description: 'PURCHASE CARD CHIRONTON FASION GULSHAN MODEL T',
                            Type: 'withdraw',
                            Amount: '20.00'
                        },
                        {
                            Date: '22-AUG-2020',
                            Description: 'PURCHASE CARD CHIRONTON FASION GULSHAN MODEL T',
                            Type: 'withdraw',
                            Amount: '90.00'
                        },
                        {
                            Date: '22-AUG-2020',
                            Description: 'PURCHASE CARD CHIRONTON FASION GULSHAN MODEL T',
                            Type: 'withdraw',
                            Amount: '45.00'
                        },
                        {
                            Date: '22-AUG-2020',
                            Description: 'PURCHASE CARD CHIRONTON FASION GULSHAN MODEL T',
                            Type: 'withdraw',
                            Amount: '89.00'
                        },
                        {
                            Date: '22-AUG-2020',
                            Description: 'PURCHASE CARD CHIRONTON FASION GULSHAN MODEL T',
                            Type: 'withdraw',
                            Amount: '60.00'
                        }
                    ]}
                    keyExtractor={(item, index) => index + ""}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={() => <View style={{
                        height: 1,
                        width: "100%",
                        backgroundColor: themeStyle.SEPARATOR
                    }}/>}
                />
                <Modal
                    animationType={"none"}
                    transparent={true}
                    visible={this.state.isVisible}
                    onRequestClose={() => {
                        this.setState({isVisible: false})
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text
                                style={[CommonStyle.midTextStyle, {
                                    marginLeft: 20,
                                    paddingTop: 10,
                                    fontSize: 18
                                }]}>Options...
                            </Text>

                            <View style={styles.checkboxContainer}>
                                <View style={{flexDirection: "row", paddingBottom: 20, paddingLeft: 20}}>
                                    <CheckBox
                                        disabled={false}
                                        onValueChange={(newValue) => this.setState({
                                            isDeposit: newValue,
                                        })}
                                        value={this.state.isDeposit}
                                        style={styles.checkbox}
                                        tintColors={{true: themeStyle.THEME_COLOR, false: themeStyle.GRAY_COLOR}}
                                    />

                                    <Text style={[styles.midTextStyle, {
                                        fontSize: 16,
                                        paddingLeft: 15
                                    }]}>{this.props.language.depositChk}</Text>
                                </View>
                                <View style={{flexDirection: "row", paddingLeft: 20}}>
                                    <CheckBox
                                        disabled={false}
                                        onValueChange={(newValue) => this.setState({
                                            isWithdraw: newValue,
                                        })}
                                        value={this.state.isWithdraw}
                                        style={styles.checkbox}
                                        tintColors={{true: themeStyle.THEME_COLOR, false: themeStyle.GRAY_COLOR}}
                                    />
                                    <Text style={[styles.midTextStyle, {
                                        fontSize: 16,
                                        paddingLeft: 15,
                                    }]}>{this.props.language.withdrawChk}</Text>
                                </View>
                            </View>
                            <TouchableOpacity title="Click To Close Modal" onPress={() => {
                                this.setState({isVisible: !this.state.isVisible})
                            }}/>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = {
    viewStyles: {
        flex: 1,
        // alignItems: "center",
        //justifyContent: "center",
        backgroundColor: themeStyle.BG_COLOR,
    },
    toolbar: {
        justifyContent: "center",
        backgroundColor: themeStyle.THEME_COLOR,
        alignItems: "center",
        paddingTop: 7,
        paddingBottom: 7
    },
    title: {
        fontFamily: fontStyle.RobotoMedium,
        fontSize: FontSize.getSize(12),
        color: themeStyle.WHITE
    },
    midTextStyle: {
        fontFamily: fontStyle.RobotoMedium,
        fontSize: FontSize.getSize(11),
    },
    textStyle: {
        fontFamily: fontStyle.RobotoRegular,
        fontSize: FontSize.getSize(10),
        color: themeStyle.BLACK
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: Utility.getDeviceWidth() - 30,
        height: 140,
        backgroundColor: themeStyle.WHITE,
        overflow: "hidden",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    checkboxContainer: {
        flexDirection: "column",
        marginTop: Utility.setHeight(20),
    },
    checkbox: {
        height: 10,
        marginTop: 7,
    }
};

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(AccountDetails);

