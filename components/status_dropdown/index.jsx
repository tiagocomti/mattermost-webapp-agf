// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {setStatus, unsetCustomStatus} from 'mattermost-redux/actions/users';
import {Client4} from 'mattermost-redux/client';
import {Preferences} from 'mattermost-redux/constants';

import {get} from 'mattermost-redux/selectors/entities/preferences';
import {getUserTimezone} from 'mattermost-redux/selectors/entities/timezone';
import {getCurrentUser, getStatusForUserId} from 'mattermost-redux/selectors/entities/users';

import {openModal} from 'actions/views/modals';
import {setStatusDropdown} from 'actions/views/status_dropdown';

import {areTimezonesEnabledAndSupported} from 'selectors/general';

import StatusDropdown from 'components/status_dropdown/status_dropdown.jsx';
import {makeGetCustomStatus, isCustomStatusEnabled, showStatusDropdownPulsatingDot} from 'selectors/views/custom_status';
import {isStatusDropdownOpen} from 'selectors/views/status_dropdown';
import {getMyRoles, getMySystemRoles} from "mattermost-redux/selectors/entities/roles";

function mapStateToProps(state) {
    const currentUser = getCurrentUser(state);
    const getCustomStatus = makeGetCustomStatus();

    if (!currentUser) {
        return {};
    }

    const userId = currentUser.id;

    return {
        userId,
        profilePicture: Client4.getProfilePictureUrl(userId, currentUser.last_picture_update),
        autoResetPref: get(state, Preferences.CATEGORY_AUTO_RESET_MANUAL_STATUS, userId, ''),
        status: getStatusForUserId(state, userId),
        userTimezone: getUserTimezone(state, userId),
        isTimezoneEnabled: areTimezonesEnabledAndSupported(state),
        customStatus: getCustomStatus(state, userId),
        isCustomStatusEnabled: isCustomStatusEnabled(state),
        isStatusDropdownOpen: isStatusDropdownOpen(state),
        showCustomStatusPulsatingDot: showStatusDropdownPulsatingDot(state),
        roles: Array.from(getMySystemRoles(state)).join(' '),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            openModal,
            setStatus,
            unsetCustomStatus,
            setStatusDropdown,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusDropdown);
