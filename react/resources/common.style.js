import {Platform, StatusBar, StyleSheet, Text} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import dimen from './Dimens';
import fontStyle from './FontStyle';
import React from 'react';
import theme from './theme.style';
import FontSize from './ManageFontSize';


export default StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop:hp(dimen.dim_h50),
        marginBottom:hp(dimen.dim_h20),
    },
    statusBar: {
        height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    },
    bgGray: {
        backgroundColor: theme.LIGHT_GREY,
        paddingTop: '1%',
        paddingBottom: '1%',
    }, bgWhite: {
        backgroundColor: theme.WHITE,
        paddingTop: '1%',
        paddingBottom: '1%',
    }, CheckIconStyle: {
        width: hp(dimen.dim_h18),
        height: hp(dimen.dim_h18),
    }, checkBoxStyle: {
        fontSize: hp('2.5'),
        color: theme.BLACK,
        fontWeight: 'normal',
    }, PinIconStyle: {
        width: wp('7.00%'),
        height: wp('7.00%'),
    }, textBlack16: {
        color: theme.BLACK,
        fontSize: hp('1.56%'),
        fontFamily: fontStyle.SFProTextMedium,
    },
    btnBg: {
        backgroundColor: 'white',
        borderRadius: hp(dimen.dim_h41) / 2,
        justifyContent: 'center',
        height: hp(dimen.dim_h41),
        alignItems: 'center',
    },

    btnBgRedColor: {
        backgroundColor: theme.PRIMARY_COLOR,
        borderRadius: hp(dimen.dim_h52 / 2),
        justifyContent: 'center',
        height: hp(dimen.dim_h52),
        alignItems: 'center',
    },

    btnBgRedOutLineColor: {
        backgroundColor: theme.WHITE,
        borderRadius: hp(dimen.dim_h52 / 2),
        justifyContent: 'center',
        height: hp(dimen.dim_h52),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.PRIMARY_COLOR,
    },

    borderLineColor: {
        borderWidth: 1,
        borderColor: theme.BORDER_LINE_COLOR,
        borderRadius: 5,
        opacity: 66,
    },

    btnBgOutLing: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: hp(dimen.dim_h41) / 2,
        justifyContent: 'center',
        height: hp(dimen.dim_h41),
        alignItems: 'center',
    },

    bottomGrayButton: {
        backgroundColor: theme.BUTTON_BACKGROUND_COLOR,
        borderRadius: hp(dimen.dim_h60 / 2),
        justifyContent: 'center',
        height: hp(dimen.dim_h52),
        alignItems: 'center',
    },


    // Landing Screen Button Text Style
    loginButtonText: {
        color: theme.PRIMARY_COLOR,
        textAlign: 'center',
        fontSize: FontSize.getSize(11),
        fontFamily: fontStyle.GothamBook,
        paddingTop: Platform.OS === 'ios' ? hp('0.5') : 0,
    },

    singUpButtonText: {
        color: theme.WHITE,
        textAlign: 'center',
        fontSize: FontSize.getSize(11),
        fontFamily: fontStyle.GothamBook,
        paddingTop: Platform.OS === 'ios' ? hp('0.5') : 0,
    },

    continueGuestButtonText: {
        color: theme.WHITE,
        textAlign: 'center',
        fontSize: FontSize.getSize(12),
        fontFamily: fontStyle.GothamLight,
    },

    //Filter Screen Style

    textFilterTitle: {
        color: theme.BLACK,
        fontFamily: fontStyle.GothamMedium,
        fontSize: FontSize.getSize(13),
        marginLeft: wp(3),
        marginTop: wp(5),
        alignItems: 'center',
    },

    textFilterList: {
        color: theme.BLACK,
        fontFamily: fontStyle.GothamBook,
        fontSize: FontSize.getSize(13),
        marginLeft: wp(10),
        marginTop: wp(3),
        alignItems: 'center',
    },

    // Products Screen Style

    textTitle: {
        color: theme.TEXT_DARK_GRAY,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: hp(1.5),
        fontFamily: fontStyle.GothamMedium,
        fontSize: FontSize.getSize(17),
    },

    textSubTitle: {
        color: theme.TEXT_DARK_GRAY,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: fontStyle.GothamMedium,
        fontSize: FontSize.getSize(10),
    },

    textPriceTitle: {
        color: theme.RED_COLOR_DARK,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: fontStyle.GothamBold,
        fontSize: FontSize.getSize(17),
        marginTop: hp(dimen.dim_h2),
    },

    textOffersListTitle: {
        color: theme.BLACK_43,
        fontFamily: fontStyle.GothamBold,
        fontSize: FontSize.getSize(8),
        paddingTop: hp(2),
        paddingBottom: hp(0.5),
    },

    textOffersList: {
        color: theme.TEXT_DARK_GRAY,
        fontFamily: fontStyle.GothamMedium,
        fontSize: FontSize.getSize(8),
        paddingTop: hp(0.5),
        paddingLeft: hp(0.5),
    },

    bluebutton: {
        // width: 'auto',
        backgroundColor: theme.Theme_color,
        borderRadius: hp(dimen.dim_h20 / 2),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        paddingLeft: wp(dimen.dim_w30),
        paddingRight: wp(dimen.dim_w30),
        paddingBottom: hp(dimen.dim_h8),
        paddingTop: hp(dimen.dim_h8),
        marginBottom: hp(dimen.dim_h2),
        marginTop: hp(dimen.dim_h5),
    },

    textBtn:{
        color:'#FFFFFF',fontSize:FontSize.getSize(15),
        fontFamily:fontStyle.RobotoRegular
    },

    errorText:{
        color:'#FF0000',fontSize:FontSize.getSize(13),
        fontFamily:fontStyle.RobotoRegular,
        marginLeft:10

    },

    textSellTag: {
        color: theme.WHITE,
        textAlign: 'center',
        fontFamily: fontStyle.GothamMedium,
        fontSize: hp(dimen.dim_h7),
        marginTop: 17,
        marginLeft: -15,
        // justifyContent:'center'
    },

    trapezoid: {
        width: 70,
        height: 28,
        borderBottomWidth: 15,
        borderBottomColor: theme.RED_COLOR_DARK,
        borderLeftWidth: 15,
        borderLeftColor: 'transparent',
        borderRightWidth: 15,
        borderRightColor: 'transparent',
        borderStyle: 'solid',
        borderTopColor: 'transparent',
        marginLeft: -21,
    },

    inputTextStyle: {
        fontFamily: fontStyle.RobotoRegular,
        fontSize: FontSize.getSize(14),
        color: theme.LIGHT_BLACK,
    },

    viewShadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    text: {
        color: '#007AFF',
        fontSize: FontSize.getSize(10),
        fontFamily: fontStyle.GothamBold,
    },
    headerTitle: {
        color:'#0B5AA1',
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: FontSize.getSize(18),
        fontFamily: fontStyle.RobotoBold,
        marginBottom: hp(dimen.dim_h20),
    },
    headerTitleWithBackButton: {
        flex: 1,
        color: theme.BLACK,
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: FontSize.getSize(16),
        fontFamily: fontStyle.GothamMedium,
    },

    TextShadowStyle: {
        textShadowColor: theme.PRIMARY_COLOR,
        textShadowOffset: {width: 1, height: 4},
        textShadowRadius: 5,
    },
});

export const headingText = {
    fontSize: theme.FONT_SIZE_MEDIUM,
    alignSelf: 'flex-start',
    padding: 10,
    fontWeight: theme.FONT_WEIGHT_BOLD,
};

export const textInput = {
    padding: theme.TEXT_INPUT_PADDING,
    backgroundColor: theme.BACKGROUND_COLOR_LIGHT,
    alignSelf: 'stretch',
};
