/* Node module for converting words to numerals.
  Convert words to numbers. Optionally fuzzy match the words to numbers.
  `npm install words-to-numbers`
  If the whole string passed is a number then it will return a Number type otherwise it will return the original string with all instances of numbers replaced.
*/

import itsSet from 'its-set';
import clj_fuzzy from 'clj-fuzzy';
import ohm from 'ohm-js';

import converter from './converters';

const UNIT = converter.UNIT;

const TEN = converter.TEN;

const MAGNITUDE = converter.MAGNITUDE;

// all words found in number phrases
const NUMBER_WORDS = ['and', 'point', 'dot']
  .concat(Object.keys(UNIT))
  .concat(Object.keys(TEN))
  .concat(Object.keys(MAGNITUDE));

const PUNCTUATION = /[.,\/#!$%\^&\*;:{}=\-_`~()]/g;

const grammar = ohm.grammar(`
  WordsToNumbers {
    Number = Section* ("point" | "dot")? unit*
    Section = TenAndMagnitude | UnitAndMagnitude | TenUnitAndMagnitude | Unit | Ten | TenAndUnit | Magnitude
    Ten = ten ~unit ~magnitude
    TenAndUnit = ten unit ~magnitude
    TenAndMagnitude = ten ~unit magnitude
    UnitAndMagnitude = ~ten unit magnitude
    TenUnitAndMagnitude = ten unit magnitude
    Unit = ~ten unit ~magnitude
    Magnitude = ~ten ~unit magnitude
    ten = ${Object.keys(TEN).map(key => `"${key}" | `).join('').slice(0, -2)}
    unit = ${Object.keys(UNIT).map(key => `"${key}" | `).join('').slice(0, -2)}
    magnitude = ${Object.keys(MAGNITUDE).map(key => `"${key}" | `).join('').slice(0, -2)}
  }
`);

const semantics = grammar
  .createSemantics()
  .addOperation('eval', {
    Number: (sections, point, decimal) => {
      const ints = sections.children.reduce((sum, child) => sum + child.eval(), 0);
      if (point.children.length) {
        const decimals = decimal.children
          .reduce((acc, d) => `${acc}${d.eval()}`, '')
          .replace(/\s/g, '');
        return parseFloat(`${ints}.${decimals}`);
      }
      return ints;
    },
    Ten: ten => ten.eval(),
    Unit: (unit) => unit.eval(),
    TenAndUnit: (ten, unit) => ten.eval() + unit.eval(),
    TenAndMagnitude: (ten, magnitude) => ten.eval() * magnitude.eval(),
    UnitAndMagnitude: (unit, magnitude) => unit.eval() * magnitude.eval(),
    TenUnitAndMagnitude: (ten, unit, magnitude) =>
      (ten.eval() + unit.eval()) * magnitude.eval(),
    Magnitude: magnitude => magnitude.eval(),
    unit: (value) => UNIT[value.primitiveValue],
    ten: (value) => TEN[value.primitiveValue],
    magnitude: (value) => MAGNITUDE[value.primitiveValue],
  });

// try coerce a word into a NUMBER_WORD using fuzzy matching
const fuzzyMatch = word => {
  return NUMBER_WORDS
    .map(numberWord => ({
      word: numberWord,
      score: clj_fuzzy.metrics.jaro(numberWord, word)
    }))
    .reduce((acc, stat) => !itsSet(acc.score) || stat.score > acc.score ? stat : acc, {})
    .word;
};

const isUnit = word => Object.keys(UNIT).indexOf(word) !== -1;
const isTen = word => Object.keys(TEN).indexOf(word) !== -1;
const isMag = word => Object.keys(MAGNITUDE).indexOf(word) !== -1;

const formatAccents = (str) => {
  //Especially for french !
  return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
};

const findRegions = (text, fuzzy) => {
  const words = formatAccents(text)
    .split(/[ -]/g)
    .map(word => fuzzy ? fuzzyMatch(word) : word)
    .reduce((acc, word, i) => {
      const start = acc.length ? acc[i - 1].end + 1 : 0;
      return acc.concat({
        text: word,
        start,
        end: start + word.length,
      });
    }, [])
    .map(word =>
      Object.assign({}, word, {
        isNumberWord: NUMBER_WORDS.indexOf(
          word.text.replace(PUNCTUATION, '').toLowerCase()
        ) !== -1,
      })
    );

  return words
    .reduce((regions, word, index) => {
      if (!word.isNumberWord) return regions;
      if (!regions.length) return [word];
      if (word.text === 'point' || word.text === 'dot') {
        const newRegions = regions.slice();
        newRegions[regions.length - 1].pointReached = true;
        newRegions[regions.length - 1].end = word.end;
        newRegions[regions.length - 1].text += ` ${word.text}`;
        return newRegions;
      }
      const prevRegion = regions[regions.length - 1];
      const prevWord = words[index - 1] || '';
      if (
        prevRegion.end === word.start - 1 &&
        !(isUnit(word.text) && isUnit(prevWord.text) || prevRegion.pointReached) &&
        !(isTen(word.text) && isTen(prevWord.text)) &&
        !(isMag(word.text) && isMag(prevWord.text)) &&
        !(isTen(word.text) && isUnit(prevWord.text)) ||
        (prevRegion.pointReached && isUnit(word.text)) ||
        word === 'and' ||
        prevWord === 'and' ||
        word === 'et' ||
        prevWord === 'et'
      ) {
        const newRegions = regions.slice();
        newRegions[regions.length - 1].end = word.end;
        newRegions[regions.length - 1].text += ` ${word.text}`;
        return newRegions;
      }
      return regions.concat(word);
    }, []);
};

const evaluateNumberRegion = text => {
  const textIsOnlyHelperWord = ['a', 'and', 'un', 'et'].reduce((acc, word) => acc || text === word, false);
  if (textIsOnlyHelperWord) return text;
  var m = grammar.match(text.replace(PUNCTUATION, ' ').replace(/\band\b/g, ''));
  if (m.succeeded()) {
    console.log('###DEBUG ' + text);
    return semantics(m).eval();
  }
  else {
    console.log(m.message);
    return text;
  }
};

function splice (str, index, count, add) {
  let i = index;
  if (i < 0) {
    i = str.length + i;
    if (i < 0) {
      i = 0;
    }
  }
  return str.slice(0, i) + (add || '') + str.slice(i + count);
}


// replace all number words in a string with actual numerals.
// If string contains multiple separate numbers then replace each one individually.
// If option `fuzzy` = true then try coerce words into numbers before conversion to numbers.
export function wordsToNumbers (text, options) {

  const opts = Object.assign({fuzzy: false}, options);
  const regions = findRegions(text, opts.fuzzy);
  if (!regions.length) return text;
  if (regions.length === 1 && regions[0].start === 0 && regions[0].end === regions[0].text.length) {
    return evaluateNumberRegion(regions[0].text);
  }
  return regions
    .map(region => evaluateNumberRegion(region.text))
    .reverse()
    .reduce((acc, number, index) => {
      const region = regions[regions.length - index - 1];
      return splice(
        acc,
        region.start,
        region.end - region.start,
        `${number}`
      );
    }, text);
}

export default wordsToNumbers;
