import { Observable, queueScheduler, scheduled } from 'rxjs';
import { buildPromiseTask, PromiseTask } from './utils';

export async function* eachValueFrom<T>(
  obs$: Observable<T>
): AsyncGenerator<T, boolean, void> {
  let taskQueue: PromiseTask<T>[] = [];
  let ready: PromiseTask<void> | null = null;
  let done = false;

  scheduled(obs$, queueScheduler).subscribe({
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

  while (true) {
    if (taskQueue.length === 0 && done) {
      return done;
    } else if (taskQueue.length === 0) {
      ready = buildPromiseTask<void>(ready);
    }

    await ready?.promise;

    yield await taskQueue.shift()!.promise;
  }
}
