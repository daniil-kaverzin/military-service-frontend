import 'core-js/features/map';
import 'core-js/features/set';
import 'core-js/features/promise';
import 'core-js/features/symbol';
import 'core-js/features/object';
import ReactDOM from 'react-dom';
import { AdaptivityProvider, AppRoot, ConfigProvider } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { Provider as StoreProvider } from 'react-redux';

import './css/index.css';
import { RouterProvider } from './router';
import { LanguageProvider } from './components/providers/LanguageProvider';
import { App } from './components/App';
import { store } from './redux/createStore';

ReactDOM.render(
  <StoreProvider store={store}>
    <RouterProvider>
      <ConfigProvider>
        <AdaptivityProvider>
          <LanguageProvider>
            <AppRoot>
              <App />
            </AppRoot>
          </LanguageProvider>
        </AdaptivityProvider>
      </ConfigProvider>
    </RouterProvider>
  </StoreProvider>,
  document.getElementById('root'),
);
