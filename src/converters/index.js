import en from './en.convert';
import fr from './fr.convert';

const all = {
  UNIT: Object.assign({}, en.UNIT, fr.UNIT),
  TEN: Object.assign({}, en.TEN, fr.TEN),
  MAGNITUDE: Object.assign({}, en.MAGNITUDE, fr.MAGNITUDE)
};

export default all;

export {
    en,
    fr,
    all
};
