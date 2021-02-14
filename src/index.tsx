import 'core-js/features/map';
import 'core-js/features/set';
import React from 'react';
import ReactDOM from 'react-dom';
import { AdaptivityProvider, AppRoot, ConfigProvider } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { Provider as StoreProvider } from 'react-redux';

import './css/index.css';
import { RouterProvider } from './router';
import { LanguageProvider } from './components/providers/LanguageProvider';
import { App } from './components/App';
import { store } from './redux/createStore';
import { OverlayProvider } from './components/providers/OverlayProvider';

ReactDOM.render(
  <StoreProvider store={store}>
    <RouterProvider>
      <ConfigProvider>
        <AdaptivityProvider>
          <LanguageProvider>
            <AppRoot>
              <OverlayProvider>
                <App />
              </OverlayProvider>
            </AppRoot>
          </LanguageProvider>
        </AdaptivityProvider>
      </ConfigProvider>
    </RouterProvider>
  </StoreProvider>,
  document.getElementById('root'),
);
