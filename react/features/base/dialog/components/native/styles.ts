import { StyleSheet } from 'react-native';

import ColorSchemeRegistry from '../../../color-scheme/ColorSchemeRegistry';
import { schemeColor } from '../../../color-scheme/functions';
import { BoxModel } from '../../../styles/components/styles/BoxModel';
import BaseTheme from '../../../ui/components/BaseTheme.native';
import { PREFERRED_DIALOG_SIZE } from '../../constants';

const BORDER_RADIUS = 5;

/**
 * NOTE: These Material guidelines based values are currently only used in
 * dialogs (and related) but later on it would be nice to export it into a base
 * Material feature.
 */
export const MD_FONT_SIZE = 16;
export const MD_ITEM_HEIGHT = 48;
export const MD_ITEM_MARGIN_PADDING = BaseTheme.spacing[3];

/**
 * Reusable (colored) style for text in any branded dialogs.
 */
const brandedDialogText = {
    color: schemeColor('text'),
    fontSize: MD_FONT_SIZE,
    textAlign: 'center',
    fontFamily: BaseTheme.typography.fontFamily,
};

const brandedDialogLabelStyle = {
    color: BaseTheme.palette.text01,
    flexShrink: 1,
    fontSize: MD_FONT_SIZE,
    opacity: 0.90,
    fontFamily: BaseTheme.typography.fontFamily,
};

const brandedDialogItemContainerStyle = {
    alignItems: 'center',
    flexDirection: 'row',
    height: MD_ITEM_HEIGHT
};

const brandedDialogIconStyle = {
    color: BaseTheme.palette.icon01,
    fontSize: 24
};

export const inputDialog = {
    formMessage: {
        alignSelf: 'flex-start',
        fontStyle: 'italic',
        fontWeight: 'bold',
        marginTop: BaseTheme.spacing[3],
        fontFamily: BaseTheme.typography.fontFamily,
    }
};

/**
 * The React {@code Component} styles of {@code BottomSheet}. These have
 * been implemented as per the Material Design guidelines:
 * {@link https://material.io/guidelines/components/bottom-sheets.html}.
 */
export const bottomSheetStyles = {
    sheetAreaCover: {
        backgroundColor: 'transparent',
        flex: 1
    },

    scrollView: {
        paddingHorizontal: 0
    },

    /**
     * Style for the container of the sheet.
     */
    sheetContainer: {
        alignItems: 'stretch',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        maxWidth: 500,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%'
    },

    sheetItemContainer: {
        flex: -1,
        maxHeight: '75%'
    },

    buttons: {
        /**
         * Style for the {@code Icon} element in a generic item of the menu.
         */
        iconStyle: {
            ...brandedDialogIconStyle
        },

        /**
         * Style for the label in a generic item rendered in the menu.
         */
        labelStyle: {
            ...brandedDialogLabelStyle,
            marginLeft: 16
        },

        /**
         * Container style for a generic item rendered in the menu.
         */
        style: {
            ...brandedDialogItemContainerStyle,
            paddingHorizontal: MD_ITEM_MARGIN_PADDING
        },

        /**
         * Additional style that is not directly used as a style object.
         */
        underlayColor: BaseTheme.palette.ui04
    },

    /**
     * Bottom sheet's base style.
     */
    sheet: {
        backgroundColor: BaseTheme.palette.ui02,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
    },

    /**
     * Bottom sheet's base style with header.
     */
    sheetHeader: {
        backgroundColor: BaseTheme.palette.ui02
    },

    /**
     * Bottom sheet's background color with footer.
     */
    sheetFooter: {
        backgroundColor: BaseTheme.palette.ui01
    }
};

export default {
    dialogButton: {
        ...BaseTheme.typography.bodyLongBold
    },

    destructiveDialogButton: {
        ...BaseTheme.typography.bodyLongBold,
        color: BaseTheme.palette.actionDanger
    },

    dialogStyles: {
      inputContainer: {
        backgroundColor: '#23233C',
        borderBottomColor: '#00FFB9',
        borderBottomWidth: 1,
        borderRadius: 2,
        fontSize: 16,
        lineHeight: 20,
        fontWeight: 400,
        letterSpacing: 0,
        color: '#FFF',
        paddingHorizontal: 16,
        height: 48,
        fontFamily: BaseTheme.typography.fontFamily
      },
      labelFontStyle : {
        color: '#FFF',
        fontFamily: BaseTheme.typography.fontFamily
      },
      container: {
        backgroundColor: '#23233C',
        width: 320,
        /*height: 280,*/
        borderRadius: 16,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom:32,
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      title: {
        width: 272,
        fontWeight: '900',
        fontSize: 18,
        lineHeight: 28,
        color: '#FFFFFF',
        fontFamily: BaseTheme.typography.fontFamily,
      },
      content: {
        width: 272,
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: '#FFFFFF',
        fontFamily: BaseTheme.typography.fontFamily,
        /*columnGap: 16*/
      },
      actions: {
        content: {
          width: 272,
          /*height: 104,*/
          paddingTop: 24
        },
        primaryButton: {
          width: 274,
          color: '#000028',
          paddingVertical: 8,
          paddingHorizontal: 18,
          fontWeight: '900',
          fontSize: 12,
          lineHeight: 20,
          backgroundColor: '#00CCCC',
          marginTop: 16,
          fontFamily: BaseTheme.typography.fontFamily,
        },
        secondaryButton: {
          width: 274,
          borderWidth: 1,
          borderColor: '#00CCCC',
          paddingVertical: 8,
          paddingHorizontal: 18,
          fontWeight: '900',
          fontSize: 12,
          lineHeight: 20,
          color: '#00CCCC',
          fontFamily: BaseTheme.typography.fontFamily,
        },
      }
    }
};

export const brandedDialog = {

    /**
     * The style of bold {@code Text} rendered by the {@code Dialog}s of the
     * feature authentication.
     */
    boldDialogText: {
        fontWeight: 'bold',
        fontFamily: BaseTheme.typography.fontFamily,
    },

    buttonFarRight: {
        borderBottomRightRadius: BORDER_RADIUS
    },

    buttonWrapper: {
        alignItems: 'stretch',
        borderRadius: BORDER_RADIUS,
        flexDirection: 'row'
    },

    mainWrapper: {
        alignSelf: 'stretch',
        padding: BoxModel.padding * 2,

        // The added bottom padding is to compensate the empty space around the
        // close icon.
        paddingBottom: BoxModel.padding * 3
    },

    overlayTouchable: {
        ...StyleSheet.absoluteFillObject
    }
};


/**
 * Color schemed styles for all the component based on the abstract dialog.
 */
ColorSchemeRegistry.register('Dialog', {
    button: {
        backgroundColor: '#44A5FF',
        flex: 1,
        padding: BoxModel.padding * 1.5
    },

    /**
     * Separator line for the buttons in a dialog.
     */
    buttonSeparator: {
        borderRightColor: schemeColor('border'),
        borderRightWidth: 1
    },

    buttonLabel: {
        color: schemeColor('buttonLabel'),
        fontSize: MD_FONT_SIZE,
        textAlign: 'center',
        fontFamily: BaseTheme.typography.fontFamily,
    },

    /**
     * Style of the close icon on a dialog.
     */
    closeStyle: {
        color: schemeColor('icon'),
        fontSize: MD_FONT_SIZE
    },

    /**
     * Base style of the dialogs.
     */
    dialog: {
        alignItems: 'stretch',
        backgroundColor: schemeColor('background'),
        borderColor: schemeColor('border'),
        borderRadius: BORDER_RADIUS,
        borderWidth: 1,
        flex: 1,
        flexDirection: 'column',
        maxWidth: PREFERRED_DIALOG_SIZE,
        fontFamily: BaseTheme.typography.fontFamily,
    },

    /**
     * Field on an input dialog.
     */
    field: {
        ...brandedDialogText,
        borderBottomWidth: 1,
        borderColor: schemeColor('border'),
        margin: BoxModel.margin,
        textAlign: 'left'
    },

    /**
     * Style for the field label on an input dialog.
     */
    fieldLabel: {
        ...brandedDialogText,
        margin: BoxModel.margin,
        textAlign: 'left'
    },

    text: {
        ...brandedDialogText,
        color: BaseTheme.palette.text01
    },

    topBorderContainer: {
        borderTopColor: BaseTheme.palette.ui07,
        borderTopWidth: 1
    }
});
