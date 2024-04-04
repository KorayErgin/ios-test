import React from 'react';
import { WithTranslation } from 'react-i18next';
import { TextStyle, View, StyleSheet } from 'react-native';
import Dialog from 'react-native-dialog';
import { connect } from 'react-redux';

import { translate } from '../../../i18n/functions';
import { _abstractMapStateToProps } from '../../functions';

import AbstractDialog, {
    IProps as AbstractProps,
    IState as AbstractState
} from './AbstractDialog';
import styles from './styles';

interface IProps extends AbstractProps, WithTranslation {

    /**
     * The dialog descriptionKey.
     */
    descriptionKey?: string;

    /**
     * An optional initial value to initiate the field with.
     */
    initialValue?: string;

    /**
     * A message key to be shown for the user (e.g. An error that is defined after submitting the form).
     */
    messageKey?: string;

    /**
     * Props for the text input.
     */
    textInputProps?: Object;

    /**
     * The untranslated i18n key for the dialog title.
     */
    titleKey?: string;

    /**
     * Validating of the input.
     */
    validateInput?: Function;
}

interface IState extends AbstractState {

    /**
     * The current value of the field.
     */
    fieldValue?: string;
}

/**
 * Implements a single field input dialog component.
 */
class InputDialog extends AbstractDialog<IProps, IState> {
    /**
     * Instantiates a new {@code InputDialog}.
     *
     * @inheritdoc
     */
    constructor(props: IProps) {
        super(props);

        this.state = {
            fieldValue: props.initialValue,
            submitting: false
        };

        this._onChangeText = this._onChangeText.bind(this);
        this._onSubmitValue = this._onSubmitValue.bind(this);
    }

    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const {
            descriptionKey,
            messageKey,
            t,
            titleKey
        } = this.props;

        return (
            <Dialog.Container
                coverScreen = { false }
                contentStyle = { styles.dialogStyles.container }
                visible = { true }>
                <Dialog.Title style = { styles.dialogStyles.title }>
                    { t(titleKey ?? '') }
                </Dialog.Title>
                {
                    descriptionKey && (
                        <Dialog.Description style = { styles.dialogStyles.content }>
                            { t(descriptionKey) }
                        </Dialog.Description>
                    )
                }
                <Dialog.Input
                    autoFocus = { true }
                    onChangeText = { this._onChangeText }
                    value = { this.state.fieldValue }
                    wrapperStyle = { styles.dialogStyles.inputContainer }
                    style = { styles.dialogStyles.labelFontStyle }
                    placeholderTextColor='#FFF'
                    underlineColorAndroid = 'transparent'
                    { ...this.props.textInputProps } />
                {
                    messageKey && (
                        <Dialog.Description
                            style = { styles.dialogStyles.content }>
                            { t(messageKey) }
                        </Dialog.Description>
                    )
                }
                <View style = { styles.dialogStyles.actions.content }>
                    <Dialog.Button
                        label = { t('dialog.Cancel') }
                        onPress = { this._onCancel }
                        style = { styles.dialogStyles.actions.secondaryButton } />
                    <Dialog.Button
                        label = { t('dialog.Ok') }
                        onPress = { this._onSubmitValue }
                        style = { styles.dialogStyles.actions.primaryButton } />
                </View>
            </Dialog.Container>
        );
    }

    /**
     * Callback to be invoked when the text in the field changes.
     *
     * @param {string} fieldValue - The updated field value.
     * @returns {void}
     */
    _onChangeText(fieldValue: string) {
        if (this.props.validateInput && !this.props.validateInput(fieldValue)) {
            return;
        }

        this.setState({
            fieldValue
        });
    }

    /**
     * Callback to be invoked when the value of this dialog is submitted.
     *
     * @returns {boolean}
     */
    _onSubmitValue() {
        return this._onSubmit(this.state.fieldValue);
    }
}

export default translate(connect(_abstractMapStateToProps)(InputDialog));
