import { structureCountingPipe } from './structure-counting.pipe';

describe('Pipes\structureCountingPipe', () => {
  it('create an instance', () => {
    const pipe = new structureCountingPipe();
    expect(pipe).toBeTruthy();
  });
});
