import initialState from './teamInitialState';
import TEAM_CONSTANTS from './teamConstatnts'


export default function teamReducer(state = initialState, action) {
    switch (action.type) {
        case TEAM_CONSTANTS.SET_TEAM_DATA:
            return state.set('teamList', action.payload.teamList).set('favTeamIdForStatusMap',action.payload.favTeamIdForStatusMap);
        case TEAM_CONSTANTS.SET_FAV_TEAM_ID_FOR_STATUS_MAP:
            return state.set('favTeamIdForStatusMap', action.payload);
        case TEAM_CONSTANTS.SET_TEAM_ERROR:
            return state.set('teamError', action.payload);
        default:
            return state;
    }

}