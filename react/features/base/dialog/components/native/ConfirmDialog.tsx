import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WithTranslation } from 'react-i18next';
import Dialog from 'react-native-dialog';
import { connect } from 'react-redux';

import { translate } from '../../../i18n/functions';
import { renderHTML } from '../functions.native';

import AbstractDialog, { IProps as AbstractProps } from './AbstractDialog';
import styles from './styles';


/**
 * The type of the React {@code Component} props of
 * {@link ConfirmDialog}.
 */
interface IProps extends AbstractProps, WithTranslation {

    /**
     * The i18n key of the text label for the cancel button.
     */
    cancelLabel?: string;

    /**
     * The React {@code Component} children.
     */
    children?: React.ReactNode;

    /**
     * The i18n key of the text label for the confirm button.
     */
    confirmLabel?: string;

    /**
     * Dialog description key for translations.
     */
    descriptionKey?: string | { key: string; params: string; };

    /**
     * Whether or not the nature of the confirm button is destructive.
     */
    isConfirmDestructive?: Boolean;

    /**
     * Dialog title.
     */
    title?: string;
}

/**
 * React Component for getting confirmation to stop a file recording session in
 * progress.
 *
 * @augments Component
 */
class ConfirmDialog extends AbstractDialog<IProps> {
    /**
     * Default values for {@code ConfirmDialog} component's properties.
     *
     * @static
     */
    static defaultProps = {
        isConfirmDestructive: false
    };

    /**
     * Renders the dialog description.
     *
     * @returns {React$Component}
     */
    _renderDescription() {
        const { descriptionKey, t } = this.props;
        const description
            = typeof descriptionKey === 'string'
                ? t(descriptionKey)
                : renderHTML(
                    t(descriptionKey?.key ?? '', descriptionKey?.params)
                );

        return (
            <Dialog.Description style = { dialogStyles.content }>
                { description }
            </Dialog.Description>
        );
    }

    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const {
            cancelLabel,
            children,
            confirmLabel,
            isConfirmDestructive,
            t,
            title
        } = this.props;

        const dialogButtonStyle
            = isConfirmDestructive
                ? styles.destructiveDialogButton : styles.dialogButton;

        return (
            <Dialog.Container
                coverScreen = { false }
                contentStyle = { dialogStyles.container }
                visible = { true }>
                {
                    title && <Dialog.Title style = { dialogStyles.title }>
                        { t(title) }
                    </Dialog.Title>
                }
                { this._renderDescription() }
                { children }
                <View style = { dialogStyles.actions.content }>
                    <Dialog.Button
                        label = { t(cancelLabel || 'dialog.confirmNo') }
                        onPress = { this._onCancel }
                        /*style = { styles.dialogButton } />*/
                        style = { dialogStyles.actions.secondaryButton } />
                    <Dialog.Button
                        label = { t(confirmLabel || 'dialog.confirmYes') }
                        onPress = { this._onSubmit }
                        /*style = { dialogButtonStyle } />*/
                        style = { dialogStyles.actions.primaryButton } />
                </View>
            </Dialog.Container>
        );
    }
}

export default translate(connect()(ConfirmDialog));

const dialogStyles = StyleSheet.create({
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
    color: '#FFFFFF'
  },
  content: {
    width: 272,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
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
        marginTop: 16
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
        color: '#00CCCC'
    },
  }
});
