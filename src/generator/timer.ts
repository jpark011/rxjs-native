import { buildPromiseTask } from '../utils';

/**
 * setTimeout() wrapped in an async generator
 *
 * @param due timeout due in milliseconds (ms)
 * @returns
 */
export function timer(due: number): AsyncGenerator<void> {
  const task = buildPromiseTask<void>();
  const timeout = setTimeout(() => {
    task.resolveFn();
  }, due);

  return (async function* () {
    try {
      yield await task.promise;
    } finally {
      clearTimeout(timeout);
    }
  })();
}
