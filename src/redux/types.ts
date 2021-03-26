import { LaunchParams } from '../types/launchParams';
import { Friend } from './reducers/activeFriend';
import { App } from './reducers/app';
import { Friends } from './reducers/friends';
import { User } from './reducers/user';

/**
 * Redux state fields description
 */
export interface ReduxState {
  app: App;
  user: User;
  friends: Friends;
  activeFriend: Friend;
  launchParams: Partial<LaunchParams>;
}
