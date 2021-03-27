import bridge from '@vkontakte/vk-bridge';

import { generateProgress } from './canvas';

export const openStoryBox = async (title: string, initialPercents: number, url: string) => {
  const percents = initialPercents > 100 ? 100 : initialPercents < 0 ? 0 : initialPercents;

  let fill = '#e64646';

  if (percents > 33) {
    fill = '#ecd71d';
  }

  if (percents > 66) {
    fill = '#4bb34b';
  }

  const progress = await generateProgress(title, percents, fill);

  bridge.send('VKWebAppShowStoryBox', {
    background_type: 'none',
    camera_type: 'front',
    attachment: {
      type: 'url',
      text: 'learn_more',
      url,
    },
    stickers: [
      {
        sticker_type: 'renderable',
        sticker: {
          blob: progress.image,
          content_type: 'image',
          can_delete: false,
          original_height: progress.height,
          original_width: progress.width,
          transform: { relation_width: 0.5 },
        },
      },
    ],
  });
};
