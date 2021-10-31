import { timer } from '../../src';

jest.useFakeTimers();

describe('timer', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  test('timer 0 will complete', async () => {
    const due = 0;
    const generator = timer(due);

    jest.advanceTimersByTime(due);
    await generator.next();

    expect(true).toBeTruthy();
  });

  test('timer 1000 will complete', async () => {
    const due = 1000;
    const generator = timer(due);

    jest.advanceTimersByTime(due);
    await generator.next();

    expect(true).toBeTruthy();
  });
});
