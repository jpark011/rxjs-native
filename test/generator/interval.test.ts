import { interval } from '../../src';

jest.useFakeTimers();

describe('interval', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  test('interval 0 will throw error', async () => {
    const due = 0;

    expect(() => interval(due)).toThrow();
  });

  test('interval 1000 will complete', async () => {
    const due = 1000;
    const generator = interval(due);

    jest.advanceTimersByTime(due);
    const { value: i } = await generator.next();
    generator.return();

    expect(i).toEqual(0);
  });
});
