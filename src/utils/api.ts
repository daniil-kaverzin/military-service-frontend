import { Dictionary } from '@vkontakte/vkjs';

export const sendRequest = (
  urn: string,
  method?: 'GET' | 'POST',
  body?: object,
): Promise<Dictionary<any>> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method || 'GET', 'https://military.lkptman.ru/api' + urn);
    xhr.setRequestHeader('x-launch-params', window.location.href);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(body));

    xhr.onload = () => {
      if (String(xhr.status)[0] === '2') {
        resolve(JSON.parse(xhr.response));
      } else {
        reject();
      }
    };

    xhr.onerror = () => {
      reject();
    };
  });
};
