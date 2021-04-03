import 'core-js/features/map';
import 'core-js/features/set';
import 'core-js/features/promise';
import 'core-js/features/symbol';
import 'core-js/features/object';
import ReactDOM from 'react-dom';
import { ConfigProvider, AdaptivityProvider, AppRoot as VKUIAppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from '@vkontakte/vk-bridge';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import './css/index.css';
import { RouterProvider } from './router';
import { AppRootWithRouter } from './components/AppRoot';
import { getLaunchParams } from './utils/launchParams';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

window.onload = () => {
  const launchParamsString = window.location.search.slice(1);
  const launchParamsDictionary = getLaunchParams(launchParamsString);

  // require('eruda').init();

  ReactDOM.render(
    <RouterProvider>
      <ConfigProvider>
        <AdaptivityProvider>
          <VKUIAppRoot>
            <AppRootWithRouter launchParamsDictionary={launchParamsDictionary} />
          </VKUIAppRoot>
        </AdaptivityProvider>
      </ConfigProvider>
    </RouterProvider>,
    document.getElementById('root'),
  );
};
