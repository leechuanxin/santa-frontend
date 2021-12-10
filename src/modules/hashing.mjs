import jssha from 'jssha';

const getHash = (input1, input2) => {
  // eslint-disable-next-line new-cap
  const shaObj = new jssha('SHA-512', 'TEXT', { encoding: 'UTF8' });
  const unhasedString = `${input1}-${input2}`;
  shaObj.update(unhasedString);

  return shaObj.getHash('HEX');
};

export default getHash;
