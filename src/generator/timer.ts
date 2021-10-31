import { buildPromiseTask } from '../utils';

/**
 * setTimeout() wrapped in an async generator
 *
 * @param due timeout due in milliseconds (ms)
 * @returns
 */
export async function* timer(due: number): AsyncGenerator<void> {
  const task = buildPromiseTask<void>();

  setTimeout(() => task.resolveFn(), due);

  return (async function* () {
    await task.promise;
    yield;
  })();
}
