import axios from 'axios';
import TEAM_CONSTANTS from './teamConstatnts'
import { createAction } from '../../common/createAction'

export function fetchTeamData() {
    return async dispatch => {
        try {
            const response = await axios.get('https://api.opendota.com/api/teams');
            if (response.data) {
                let favTeamIdForStatusMap = {};
                const favTeamFromLocalStorage = JSON.parse(window.localStorage.getItem('favTeamIdForStatusMap'))
                if (favTeamFromLocalStorage) {
                    favTeamIdForStatusMap = favTeamFromLocalStorage;
                }
                dispatch(createAction(TEAM_CONSTANTS.SET_TEAM_DATA, { teamList: response.data, favTeamIdForStatusMap }));
            }
        } catch (err) {
            dispatch(createAction(TEAM_CONSTANTS.SET_TEAM_ERROR, err));
        }
    };

}

export function setFavouriteTeam(teamId, favTeamIdForStatusMap) {
    return async dispatch => {
        try {
            const cloneTeamIdForStatusMap = JSON.parse(JSON.stringify(favTeamIdForStatusMap));
            cloneTeamIdForStatusMap[teamId] = !cloneTeamIdForStatusMap[teamId];
            window.localStorage.setItem("favTeamIdForStatusMap", JSON.stringify(cloneTeamIdForStatusMap));
            dispatch(createAction(TEAM_CONSTANTS.SET_FAV_TEAM_ID_FOR_STATUS_MAP, cloneTeamIdForStatusMap));
        } catch (err) {
            dispatch(createAction(TEAM_CONSTANTS.SET_TEAM_ERROR, err));
        }
    };

}
