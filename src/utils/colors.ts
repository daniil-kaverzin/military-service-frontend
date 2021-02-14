const parseColor = (input: string) => {
  if (input.substr(0, 1) === '#') {
    const collen = (input.length - 1) / 3;
    const fact = [17, 1, 0.062272][collen - 1];

    return [
      Math.round(parseInt(input.substr(1, collen), 16) * fact),
      Math.round(parseInt(input.substr(1 + collen, collen), 16) * fact),
      Math.round(parseInt(input.substr(1 + 2 * collen, collen), 16) * fact),
    ];
  } else return input.split('(')[1].split(')')[0].split(',').map(Number).map(Math.round);
};

export const blacked = (target: string, opacity: number) => {
  const [r1, g1, b1] = parseColor('#000000');
  const [r2, g2, b2] = parseColor(target);

  const r3 = r2 + (r1 - r2) * opacity;
  const g3 = g2 + (g1 - g2) * opacity;
  const b3 = b2 + (b1 - b2) * opacity;

  return `#${[r3, g3, b3]
    .map(Math.round)
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')}`;
};
