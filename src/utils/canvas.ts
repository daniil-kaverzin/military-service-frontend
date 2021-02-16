const roundRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();

  context.fill();
};

const loadImage = (url: string): Promise<CanvasImageSource> => {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => {
      resolve(image);
    };

    image.src = url;
  });
};

const changeColor = async (
  image: string,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
) => {
  const localCanvas = document.createElement('canvas');
  const localContext = localCanvas.getContext('2d')!;
  localCanvas.width = width;
  localCanvas.height = height;

  localContext.drawImage(await loadImage(image), 0, 0);

  localContext.globalCompositeOperation = 'source-in';

  localContext.fillStyle = color;
  localContext.fillRect(x, y, width, height);

  return localCanvas.toDataURL();
};

export const generateProgress = async (value: number, progressColor: string) => {
  const wrapperCanvas = document.createElement('canvas');
  const wrapperContext = wrapperCanvas.getContext('2d')!;
  wrapperCanvas.width = 1200;
  wrapperCanvas.height = 500;

  const progressCanvas = document.createElement('canvas');
  const progressContext = progressCanvas.getContext('2d')!;
  progressCanvas.width = wrapperCanvas.width;
  progressCanvas.height = wrapperCanvas.height;

  const percent = wrapperCanvas.width / 100;

  wrapperContext.fillStyle = '#ffffff';
  roundRect(wrapperContext, 0, 0, wrapperCanvas.width - 0, 490, 60);

  progressContext.fillStyle = '#e2e3e6';
  roundRect(progressContext, 100, 250, wrapperCanvas.width - 200, 140, 30);

  wrapperContext.drawImage(await loadImage(progressCanvas.toDataURL()), 0, 0);

  if (value) {
    const newImage = await changeColor(
      progressCanvas.toDataURL(),
      0,
      0,
      percent * value,
      wrapperCanvas.height,
      progressColor,
    );

    wrapperContext.drawImage(await loadImage(newImage), 0, 0);
  }

  wrapperContext.font = 'bold 128px arial';
  wrapperContext.fillStyle = progressColor;
  wrapperContext.textAlign = 'center';
  wrapperContext.fillText(`${value}%`, wrapperCanvas.width / 2, 200);

  return {
    image: wrapperCanvas.toDataURL(),
    width: wrapperCanvas.width,
    height: wrapperCanvas.height,
  };
};
