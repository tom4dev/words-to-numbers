/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import wtn from '../';
const { it, describe } = global;


/* French */
export default () => {

  describe('### Test French converter ###', function () {
    it('one hundred', () => {
      expect(wtn('cent')).to.equal(100);
    });

    it('one hundred and five', () => {
      expect(wtn('cent cinq')).to.equal(105);
    });

    it('one hundred and twenty five', () => {
      expect(wtn('cent vingt cinq')).to.equal(125);
    });

    it('four thousand and thirty', () => {
      expect(wtn('quatre mille trente')).to.equal(4030);
    });

    it('six million five thousand and two', () => {
      expect(wtn('six million cinq mille deux')).to.equal(6005002);
    });

    it('a thousand one hundred and eleven', () => {
      expect(wtn('mille cent onze')).to.equal(1111);
    });

    it('sixty nine', () => {
      expect(wtn('soixante-neuf')).to.equal(69);
    });

    it('twenty thousand five hundred and sixty nine', () => {
      expect(wtn('vingt mille cinq cent soixante neuf')).to.equal(20569);
    });

    it('five quintillion', () => {
      expect(wtn('cinq trillion')).to.equal(5000000000000000000);
    });

    it('one-hundred', () => {
      expect(wtn('cent')).to.equal(100);
    });

    it('one-hundred and five', () => {
      expect(wtn('cent-cinq')).to.equal(105);
    });

    it('one-hundred and twenty-five', () => {
      expect(wtn('cent vingt-cinq')).to.equal(125);
    });

    it('four-thousand and thirty', () => {
      expect(wtn('quatre-mille trente')).to.equal(4030);
    });

    it('six-million five-thousand and two', () => {
      expect(wtn('six-million cinq-mille deux')).to.equal(6005002);
    });

    it('a thousand, one-hundred and eleven', () => {
      expect(wtn('mille, cent-onze')).to.equal(1111);
    });

    it('twenty-thousand, five-hundred and sixty-nine', () => {
      expect(wtn('vingt-milled, centq-cent-soixante-neuf')).to.equal(20569);
    });

    it('there were twenty-thousand, five-hundred and sixty-nine X in the five quintillion Y', () => {
      expect(
        wtn(
          'il y avait vingt-mille, cinq-cent soixante-neuf X dans les cinq trillion Y'
        )
      ).to.equal('il y avait 20569 X dans les 5000000000000000000 Y');
    });

    it('one two three', () => {
      expect(wtn('un deux trois')).to.equal('1 2 3');
    });

    it('test one two three test', () => {
      expect(wtn('test un deux trois test')).to.equal('test 1 2 3 test');
    });

    it('won huntred', () => {
      expect(wtn('cant', { fuzzy: true })).to.equal(100);
    });

    it('tu thousant and faav', () => {
      expect(wtn('deu malle conq', { fuzzy: true })).to.equal(2005);
    });

    it('tree millyon sefen hunderd ant twinty sex', () => {
      expect(
        wtn('trois millyon seft cant vingt sex', { fuzzy: true })
      ).to.equal(3000726);
    });

    it('forty two point five', () => {
      expect(wtn('quarante deux point cinq')).to.equal(42.5);
    });

    it('ten point five', () => {
      expect(wtn('dix point cinq')).to.equal(10.5);
    });

    it('three point one four one five nine two six', () => {
      expect(wtn('trois point un quatre un cinq neuf deux six')).to.equal(3.1415926);
    });

    /* testing for ordinal numbers */

    it('first', () => {
      expect(wtn('premier')).to.equal(1);
    });

    it('second', () => {
      expect(wtn('second')).to.equal(2);
    });

    it('third', () => {
      expect(wtn('troisième')).to.equal(3);
    });

    it('fourteenth', () => {
      expect(wtn('quatorzième')).to.equal(14);
    });

    it('twenty fifth', () => {
      expect(wtn('vingt-cinquième')).to.equal(25);
    });

    it('thirty fourth', () => {
      expect(wtn('trente quatrième')).to.equal(34);
    });

    it('forty seventh', () => {
      expect(wtn('quarante septième')).to.equal(47);
    });

    it('fifty third', () => {
      expect(wtn('cinquante troisième')).to.equal(53);
    });

    it('sixtieth', () => {
      expect(wtn('soixantième')).to.equal(60);
    });

    it('seventy second', () => {
      expect(wtn('soixante-douzième')).to.equal(72);
    });

    it('eighty ninth', () => {
      expect(wtn('quatre-vingt-neuvième')).to.equal(89);
    });

    it('ninety sixth', () => {
      expect(wtn('quatre-vingt-seizième')).to.equal(96);
    });

    it('one hundred and eighth', () => {
      expect(wtn('cent huitième')).to.equal(108);
    });

    it('one hundred and tenth', () => {
      expect(wtn('cent dizième')).to.equal(110);
    });

    it('one hundred and ninety ninth', () => {
      expect(wtn('cent et quatre vingt dix neuf')).to.equal(199);
    });

    it('digit one', () => {
      expect(wtn('digit one')).to.equal('digit 1');
    });

    it('digit one ', () => {
      expect(wtn('digit un ')).to.equal('digit 1 ');
    });

    it('one thirty', () => {
      expect(wtn('un trente')).to.equal('1 30');
    });

    it('thousand', () => {
      expect(wtn('mille')).to.equal(1000);
    });

    it('million', () => {
      expect(wtn('million')).to.equal(1000000);
    });

    it('billion', () => {
      expect(wtn('milliard')).to.equal(1000000000);
    });

    it('xxxxxxx one hundred', () => {
      expect(wtn('xxxxxxx cent')).to.equal('xxxxxxx 100');
    });

    it('and', () => {
      expect(wtn('et')).to.equal('et');
    });

    it('a', () => {
      expect(wtn('un')).to.equal('un');
    });

    it('junkvalue', () => {
      expect(wtn('junkvalue')).to.equal('junkvalue');
    });

    it('eleven dot one', () => {
      expect(wtn('onze point un')).to.eq(11.1);
    });

  });

};
