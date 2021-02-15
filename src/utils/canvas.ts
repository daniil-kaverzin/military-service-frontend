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

export const generateProgress = async (
  value: number,
  backgroundColor: string,
  progressColor: string,
) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.width = 1200;
  canvas.height = 300;

  const percent = canvas.width / 100;

  context.fillStyle = backgroundColor;
  roundRect(context, 0, 150, canvas.width - 0, 140, 40);

  if (value) {
    const newImage = await changeColor(
      canvas.toDataURL(),
      0,
      0,
      percent * value,
      canvas.height,
      progressColor,
    );

    context.drawImage(await loadImage(newImage), 0, 0);
  }

  context.font = 'bold 128px arial';
  context.fillStyle = progressColor;
  context.textAlign = 'center';
  context.fillText(`${value}%`, canvas.width / 2, 100);

  return {
    image: canvas.toDataURL(),
    width: canvas.width,
    height: canvas.height,
  };
};
