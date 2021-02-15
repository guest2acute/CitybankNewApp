import React, {Component} from "react";
import {connect} from "react-redux";
import {
    FlatList,
    Image,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text, TextInput,
    TouchableOpacity,
    View
} from "react-native";
import themeStyle from "../resources/theme.style";
import CommonStyle from "../resources/CommonStyle";
import Utility from "../utilize/Utility";
import {BusyIndicator} from "../resources/busy-indicator";
import FontSize from "../resources/ManageFontSize";
import fontStyle from "../resources/FontStyle";
import DocumentPicker from "react-native-document-picker";
import RNFetchBlob from "rn-fetch-blob";

class UploadSupportDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            DocumentRequiredFor: props.language.changeFor,
            selectTypeVal: -1,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            documentType: props.language.selectDocument,
            docTypeVal: -1,
            documentNo: "",
            errorDocumentNo: "",
            select_file: "",
            file_name: "",
            errorDocumentAttach: ""
        }
    }

    componentDidMount() {
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

    openModal(option, title, data, language) {
        if (data.length > 0) {
            this.setState({
                modelSelection: option,
                modalTitle: title,
                modalData: data, modalVisible: true
            });
        } else {
            Utility.alert(language.noRecord);
        }
    }


    onSelectItem(item) {
        const {modelSelection} = this.state;
        if (modelSelection === "documentFor") {
            this.setState({DocumentRequiredFor: item.label, selectTypeVal: item.value, modalVisible: false})
        } else if (modelSelection === "documentType") {
            this.setState({documentType: item.label, docTypeVal: item.value, modalVisible: false})
        }
    }

    async onSubmit(language, navigation) {
        Utility.alertWithBack(language.ok_txt, language.success_saved, navigation);
    }

    mainView(language) {
        return (<View>
            <Text style={[CommonStyle.labelStyle, {
                color: themeStyle.THEME_COLOR,
                marginStart: 10,
                marginEnd: 10,
                marginTop: 6,
                marginBottom: 4
            }]}>
                {language.select_request + "*"}
            </Text>
            <TouchableOpacity
                onPress={() => this.openModal("documentFor", language.select_request, language.DocumentRequiredForArr, language)}>

                <View style={styles.selectionBg}>
                    <Text style={[CommonStyle.midTextStyle, {
                        color: this.state.DocumentRequiredFor === language.changeFor ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                        flex: 1
                    }]}>
                        {this.state.DocumentRequiredFor}
                    </Text>
                    <Image resizeMode={"contain"} style={styles.arrowStyle}
                           source={require("../resources/images/ic_arrow_down.png")}/>
                </View>
            </TouchableOpacity>

            <Text style={[CommonStyle.labelStyle, {
                color: themeStyle.THEME_COLOR,
                marginStart: 10,
                marginEnd: 10,
                marginTop: 6,
                marginBottom: 4
            }]}>
                {language.supportDocument + "*"}
            </Text>

            <TouchableOpacity
                onPress={() => this.openModal("documentType", language.selectDocument, language.documentTypeArr, language)}>

                <View style={styles.selectionBg}>
                    <Text style={[CommonStyle.midTextStyle, {
                        color: this.state.documentType === language.selectDocument ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                        flex: 1
                    }]}>
                        {this.state.documentType}
                    </Text>
                    <Image resizeMode={"contain"} style={styles.arrowStyle}
                           source={require("../resources/images/ic_arrow_down.png")}/>
                </View>
            </TouchableOpacity>
            <View>
                <View style={{
                    flexDirection: "row",
                    marginStart: 10,
                    height: Utility.setHeight(50),
                    alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.documentNo}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.documentNo}
                        onChangeText={text => this.setState({documentNo: Utility.input(text, "0123456789")})}
                        value={this.state.documentNo}
                        multiline={false}
                        numberOfLines={1}
                        keyboardType={"number-pad"}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}/>
                </View>
                {this.state.errorDocumentNo !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorDocumentNo}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View>
                <View style={{
                    flexDirection: "row",
                    marginStart: 10,
                    height: Utility.setHeight(50),
                    alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.upload_docs}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>
                    <TouchableOpacity style={{ flex: 1}} onPress={() => this.uploadPdf()}>
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle, {
                                alignItems: "flex-end",
                                textAlign: 'right',

                                marginLeft: 10
                            }]}
                            editable={false}
                            placeholder={language.select_file}
                            value={this.state.file_name}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}/>
                    </TouchableOpacity>
                </View>
                {this.state.errorDocumentAttach !== "" ?
                    <Text style={{
                        marginLeft: 5,
                        marginRight: 10,
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                        alignSelf: "flex-end",
                        marginBottom: 10,
                    }}>{this.state.errorDocumentAttach}</Text> : null}
            </View>
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
        </View>)
    }

    async uploadPdf() {
        this.setState({select_file: "", file_name: "",errorDocumentAttach:""});
        const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
            content: true
        });
        console.log("result", res);
        let response = await RNFetchBlob.fs.readFile(res.uri, "base64");
        if (res.type === "application/pdf" && res.size > 1000000) {
            this.setState({errorDocumentAttach:this.props.language.maxOneMB})
            return;
        } else if (res.type.indexOf("image/") !== -1 && res.size > 200000) {
            this.setState({errorDocumentAttach:this.props.language.max200KB})
            return;
        }

        this.setState({select_file: response, file_name: res.name});
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
                                   require("../resources/images/ic_back_android.png") : require("../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.upload_documents}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        {this.mainView(language)}
                        {this.state.selectTypeVal === -1 || this.state.docTypeVal === -1? null : <View style={{
                            flexDirection: "row",
                            marginStart: Utility.setWidth(10),
                            marginRight: Utility.setWidth(10),
                            marginTop: Utility.setHeight(20)
                        }}>
                            <TouchableOpacity style={{flex: 1}}
                                              onPress={() => this.onSubmit(language, this.props.navigation)}>
                                <View style={{
                                    flex: 1,
                                    alignSelf: "center",
                                    justifyContent: "center",
                                    height: Utility.setHeight(46),
                                    width: Utility.getDeviceWidth() / 3,
                                    borderRadius: Utility.setHeight(23),
                                    backgroundColor: themeStyle.THEME_COLOR
                                }}>
                                    <Text
                                        style={[CommonStyle.midTextStyle, {
                                            color: themeStyle.WHITE,
                                            textAlign: "center"
                                        }]}>{language.submit}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>}
                    </View>
                </ScrollView>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({modalVisible: false})
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{
                                width: "100%",
                                backgroundColor: themeStyle.THEME_COLOR,
                                height: Utility.setHeight(30),
                                justifyContent: "center"
                            }}>
                                <Text style={[CommonStyle.midTextStyle, {
                                    textAlign: "center",
                                    color: themeStyle.WHITE,

                                }]}>{this.state.modalTitle}</Text>
                            </View>

                            <FlatList style={{backgroundColor: themeStyle.WHITE, width: "100%"}}
                                      data={this.state.modalData} keyExtractor={(item, index) => item.key}
                                      renderItem={({item}) =>
                                          <TouchableOpacity onPress={() => this.onSelectItem(item)}>
                                              <View
                                                  style={{height: Utility.setHeight(35), justifyContent: "center"}}>
                                                  <Text
                                                      style={[CommonStyle.textStyle, {
                                                          color: themeStyle.THEME_COLOR,
                                                          marginStart: 10
                                                      }]}>{item.label}</Text>
                                              </View>
                                          </TouchableOpacity>
                                      }
                                      ItemSeparatorComponent={this.renderSeparator}
                                      keyExtractor={(item, index) => index + ""}
                                      />
                        </View>
                    </View>
                </Modal>
                <BusyIndicator visible={this.state.isProgress}/>
            </View>
        )
    }

}

const
    styles = {
        arrowStyle: {
            tintColor: themeStyle.BLACK,
            width: Utility.setWidth(35),
            height: Utility.setHeight(30)
        },
        selectionBg: {
            paddingStart: 10,
            paddingBottom: 4,
            paddingTop: 4,
            paddingEnd: 10,
            flexDirection: "row",
            backgroundColor: themeStyle.SELECTION_BG,
            alignItems: "center"
        },
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        modalView: {
            width: Utility.getDeviceWidth() - 30,
            overflow: "hidden",
            borderRadius: 10,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
        }

    }

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(UploadSupportDoc);
