import {
  createNotesObject,
  createOctavesObject,
  createModifiersObject,
} from '../../../function/createMusicObject';

import { musicCompressor } from './musicCompressor';

const notesObject: { [keys: string]: string } = createNotesObject();
const modifiers: {
  [keys: string]: string;
} = createModifiersObject();
let octavesObject: { [keys: string]: string } = {};

const notesKeys: string[] = Object.keys(notesObject);
const octavesKeys: string[] = Object.keys(octavesObject);
const modifiersKeys: string[] = Object.keys(modifiers);

const checker = (data: string): boolean => {
  const arr = data.split('-').filter((x: string): boolean => {
    return (
      notesKeys.indexOf(x[0]) === -1 &&
      octavesKeys.indexOf(x[1]) === -1 &&
      modifiersKeys.indexOf(x) === -1
    );
  });
  if (arr.length === 0) {
    return true;
  } else {
    console.error('error', arr);
    return false;
  }
};

/**
 *
 * @param {string} data input data in form of music pitches string (note-octave)
 * ex. R0-E4-G4-F4-H-G4-C4-H-G4-D4-A4-G4-F4-D4-R0
 * H for Hold
 * R0 for repeat no. 0
 */
const musicToBin = (
  data: string,
  [min, max]: [number, number],
): string => {
  //console.log(data.match(/[A-Ga-g]+(#?)+(\d)/g));
  octavesObject = createOctavesObject(min, max);
  console.log('💻 Convert to Binaries\n');
  if (checker(data)) {
    data = data
      .split('-')
      .map((x: string): string => {
        if (x.indexOf('#') !== -1) {
          return x[0].toLowerCase() + x[2];
        }
        return x;
      })
      .join('-');
    data = musicCompressor(data);
    const binaries: string = data
      .split('-')
      .map((x: string): string => {
        if (!modifiersKeys.includes(x)) {
          let note: string, octave: string;
          if (x.indexOf('#') === -1) {
            [note, octave] = x.split('');
          } else {
            note = x.slice(0, 2);
            octave = x.slice(2, 3);
          }
          //NOTE: Full log
          /*console.log(
            note,
            octave,
            '->',
            notesObject[note],
            octavesObject[octave],
          );*/
          const set = notesObject[note] + octavesObject[octave];
          return set;
        } else {
          return modifiers[x];
        }
      })
      .join('');
    console.log('\n👾 Binaries: ', binaries, '\n');
    return binaries;
  }
  return 'error';
};

export { musicToBin };
