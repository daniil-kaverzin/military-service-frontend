import { LaunchParams } from '../types/launchParams';
import { ActiveUser } from './reducers/activeUser';
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
  activeUser: ActiveUser;
  launchParams: Partial<LaunchParams>;
}
