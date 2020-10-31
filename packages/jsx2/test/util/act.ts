// import { act } from '../../src/jsx2';

describe('act', () => {
  describe('with async callback', () => {
    it.todo('does not process until cb promise resolves');
    it.todo('processes mutations before resolving');
    it.todo('return promise resolves after cb promise');
    it.todo('processes mutations after rejection');

    describe('reentrancy', () => {
      it.todo('does not process mutations after inner sync cb');
      it.todo('does not process mutations after inner async cb');
    });
  });

  describe('with sync callback', () => {
    it.todo('processes mutations before returning');
    it.todo('processes mutations after error');

    describe('reentrancy', () => {
      it.todo('does not process mutations after inner sync cb');
      it.todo('does not process mutations after inner async cb');
    });
  });
});
