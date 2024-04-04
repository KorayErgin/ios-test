import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';
import {
    ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { IReduxState, IStore } from '../../../app/types';
import Avatar from '../../../base/avatar/components/Avatar';
import { translate } from '../../../base/i18n/functions';
import Icon from '../../../base/icons/components/Icon';
import { IconArrowRight } from '../../../base/icons/svg';
import JitsiScreen from '../../../base/modal/components/JitsiScreen';
import { getLocalParticipant } from '../../../base/participants/functions';
import { navigate } from '../../../mobile/navigation/components/settings/SettingsNavigationContainerRef';
import { screen } from '../../../mobile/navigation/routes';
import { shouldShowModeratorSettings } from '../../functions.native';
import ProfileView from './ProfileView';
import AdvancedSection from './AdvancedSection';
import ConferenceSection from './ConferenceSection';
import GeneralSection from './GeneralSection';
import LinksSection from './LinksSection';
import ModeratorSection from './ModeratorSection';
import NotificationsSection from './NotificationsSection';
import { AVATAR_SIZE } from './constants';
import styles from './styles';

/**
 * The type of the React {@code Component} props of
 * {@link SettingsView}.
 */
interface IProps extends WithTranslation {

    _displayName?: string;

    /**
     * The ID of the local participant.
     */
    _localParticipantId?: string;

    /**
     * Flag indicating whether the moderator settings are available.
     */
    _showModeratorSettings: boolean;

    /**
     * Whether {@link SettingsView} is visible.
     *
     * @protected
     */
    _visible?: boolean;

    /**
     * Redux store dispatch function.
     */
    dispatch: IStore['dispatch'];

    /**
     * Flag indicating whether the settings is launched inside welcome page.
     */
    isInWelcomePage?: boolean;

    /**
     * Default prop for navigating between screen components(React Navigation).
     */
    navigation?: Object;
}

/**
 * The native container rendering the app settings page.
 */
class SettingsView extends Component<IProps> {
    _urlField: Object;

    /**
     * Opens the profile settings screen.
     *
     * @returns {void}
     */
    _onPressProfile() {
        navigate(screen.settings.profile);
    }

    /**
     * Implements React's {@link Component#render()}, renders the settings page.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const {
            _displayName
        } = this.props;

        const {
            isInWelcomePage,
            _showModeratorSettings
        } = this.props;

        const addBottomInset = !isInWelcomePage;
        const scrollBounces = Boolean(isInWelcomePage);

        return (
            <JitsiScreen
                disableForcedKeyboardDismiss = { true }

                safeAreaInsets = { [ addBottomInset && 'bottom', 'left', 'right' ].filter(Boolean) }
                style = { styles.settingsViewContainer }>
                <ScrollView bounces = { scrollBounces }>
                  <ProfileView isInWelcomePage = { true } />
                  <GeneralSection />
                  <NotificationsSection />
                  { _showModeratorSettings && <>  <ModeratorSection /> </> }
                  <AdvancedSection />
                </ScrollView>
            </JitsiScreen>
        );
    }
}

/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function _mapStateToProps(state: IReduxState) {
    const localParticipant = getLocalParticipant(state);

    return {
        _localParticipantId: localParticipant?.id,
        _displayName: state['features/base/settings'].displayName,
        _visible: state['features/settings'].visible,
        _showModeratorSettings: shouldShowModeratorSettings(state)
    };
}

export default translate(connect(_mapStateToProps)(SettingsView));
