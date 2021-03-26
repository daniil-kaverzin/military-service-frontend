import { PureComponent } from 'react';
import { Store } from 'redux';
import { Provider as StoreProvider } from 'react-redux';
import { RouterProps, withRouter } from '@happysanta/router';

import { App } from '../App';
import { createReduxStore } from '../../redux/createStore';
import { LaunchParams } from '../../types/launchParams';
import { ReduxState } from '../../redux/types';
import { PAGE_SHARED } from '../../router';

export interface AppRootProps extends RouterProps {
  launchParamsDictionary: LaunchParams;
}

export interface AppRootState {}

class AppRoot extends PureComponent<AppRootProps, AppRootState> {
  store: Store<ReduxState> = createReduxStore();

  constructor(props: AppRootProps) {
    super(props);

    const { launchParamsDictionary, router } = this.props;

    this.store = createReduxStore({
      launchParams: launchParamsDictionary,
    });

    const sharedId = Number(router.startHash.replace('#', ''));

    if (sharedId && !isNaN(sharedId)) {
      router.replacePage(PAGE_SHARED);
    }
  }

  render() {
    return (
      <StoreProvider store={this.store}>
        <App />
      </StoreProvider>
    );
  }
}

export const AppRootWithRouter = withRouter(AppRoot);
