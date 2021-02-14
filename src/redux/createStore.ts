import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { userReducer } from './reducers/user';
import { friendsReducer } from './reducers/friends';
import { activeFriendReducer } from './reducers/activeFriend';

const reducers = combineReducers({
  user: userReducer,
  friends: friendsReducer,
  activeFriend: activeFriendReducer,
});

export const store = createStore(reducers, applyMiddleware(thunk));

export type State = ReturnType<typeof reducers>;
