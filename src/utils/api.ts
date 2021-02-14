import { Dictionary } from '@vkontakte/vkjs';

export const sendRequest = (url: string): Promise<Dictionary<any>> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://lkptman.ru/api/military-service/methods/' + url);
    xhr.setRequestHeader('x-launch-params', window.location.href);
    xhr.send();

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
