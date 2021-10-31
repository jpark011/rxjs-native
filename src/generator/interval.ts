import { buildPromiseTask } from '../utils';

/**
 * setInterval() wrapped in an async generator
 *
 * @param due interval period in milliseconds (ms) > 0
 * @returns
 */
export function interval(period: number): AsyncGenerator<number, void> {
  if (period <= 0) {
    throw new Error('period should be over 0');
  }

  let i = 0;
  const task = buildPromiseTask<number>();
  const interval = setInterval((v) => {
    task.resolveFn(i++);
  }, period);

  return (async function* () {
    try {
      while (true) {
        yield await task.promise;
        buildPromiseTask(task);
      }
    } finally {
      clearInterval(interval);
    }
  })();
}
