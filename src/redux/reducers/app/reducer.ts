import { PromoBannerProps } from '@vkontakte/vkui';
import { ofType, unionize, UnionOf } from 'unionize';

import { unionizeConfig } from '../../config';

export interface App {
  baseLoading: boolean;
  error: boolean;
  promoBannerProps: PromoBannerProps | null;
  idFromHash?: number;
}

export const appActions = unionize(
  {
    setBaseLoading: ofType<App['baseLoading']>(),
    setError: ofType<App['error']>(),
    setPromoBannerProps: ofType<App['promoBannerProps']>(),
  },
  unionizeConfig,
);

type AppActions = UnionOf<typeof appActions>;

const initialState: App = {
  baseLoading: true,
  error: false,
  promoBannerProps: null,
  idFromHash: undefined,
};

export function appReducer(state: App = initialState, action: AppActions) {
  return appActions.match(action, {
    setBaseLoading: (baseLoading) => {
      return {
        ...state,
        baseLoading,
      };
    },

    setError: (error) => {
      return {
        ...state,
        error,
      };
    },

    setPromoBannerProps: (props) => {
      return {
        ...state,
        promoBannerProps: props,
      };
    },

    default: () => state,
  });
}
