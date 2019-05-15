import { Record } from 'immutable';

const InitialState = Record({
   teamList: [],
   teamError: '',
   favTeamIdForStatusMap: {}
});

export default new InitialState();
