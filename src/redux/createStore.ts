import { createStore, combineReducers, applyMiddleware, Store } from 'redux';
import thunk from 'redux-thunk';

import { userReducer } from './reducers/user';
import { friendsReducer } from './reducers/friends';
import { activeFriendReducer } from './reducers/activeFriend';
import { launchParamsReducer } from './reducers/launchParams';
import { ReduxState } from './types';
import { appReducer } from './reducers/app';

const reducers = combineReducers<ReduxState>({
  app: appReducer,
  user: userReducer,
  friends: friendsReducer,
  activeFriend: activeFriendReducer,
  launchParams: launchParamsReducer,
});

export function createReduxStore(state?: Partial<ReduxState>): Store<ReduxState> {
  return createStore(reducers, state, applyMiddleware(thunk));
}
