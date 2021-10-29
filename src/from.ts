import { Observable, queueScheduler, scheduled } from 'rxjs';
import { buildPromiseTask, PromiseTask } from './utils';

/**
 * Observable => async generator
 *
 * Pass an RxJS Observable and transform into an async generator,
 * so that you can use them natively.
 *
 * Example:
 *
 * ```ts
 * const list$ = from([1,2,3,4,5])
 *
 * for await (const value of eachValueFrom(list$)) {
 *    console.log(value);
 * }
 *
 * console.log('done!');
 *
 * ```
 *
 * CAUTION: If the `obs$` never completes, it will hang eternally.
 *
 * (like infinite loop)
 *
 * @param obs$ Observable to turn into an async generator
 * @returns
 */
export async function* eachValueFrom<T>(
  obs$: Observable<T>
): AsyncGenerator<T, boolean, void> {
  let taskQueue: PromiseTask<T>[] = [];
  let ready: PromiseTask<void> | null = null;
  let done = false;

  const sub = scheduled(obs$, queueScheduler).subscribe({
    next(value: T) {
      const task = buildPromiseTask<T>();

      task.resolveFn(value);
      taskQueue.push(task);
      ready?.resolveFn();
    },
    error(err: any) {
      const task = buildPromiseTask<T>();

      task.rejectFn(err);
      taskQueue.push(task);
      ready?.resolveFn();
    },
    complete() {
      done = true;
      ready?.resolveFn();
    },
  });

  try {
    while (true) {
      if (taskQueue.length === 0 && done) {
        return done;
      } else if (taskQueue.length === 0) {
        ready = buildPromiseTask<void>(ready);
      }

      await ready?.promise;

      yield await taskQueue.shift()!.promise;
    }
  } finally {
    sub.unsubscribe();
  }
}
