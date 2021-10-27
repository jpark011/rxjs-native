import {
  asapScheduler,
  asyncScheduler,
  Observable,
  queueScheduler,
  scheduled,
} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { buildPromiseTask, PromiseTask } from './utils';

export async function* eachValueFrom<T>(
  obs$: Observable<T>
): AsyncGenerator<T, boolean, void> {
  let taskQueue: PromiseTask<T>[] = [];
  let index = 0;
  const ready = buildPromiseTask<boolean>();
  let done = false;

  const tick = () => {
    if (!taskQueue.length) {
      ready.resolveFn(true);
    }

    taskQueue.push(buildPromiseTask());
  };

  scheduled(obs$, queueScheduler)
    .pipe(
      tap(() => {
        tick();
      }),
      catchError((err) => {
        tick();

        throw err;
      })
    )
    .subscribe({
      next(value: T) {
        console.log('next');
        taskQueue[index].resolveFn(value);
        index++;
      },
      error(err: any) {
        console.log('error');
        taskQueue[index].rejectFn(err);
        index++;
      },
      complete() {
        console.log('complete');

        if (!taskQueue.length) {
          ready.resolveFn(true);
        }

        done = true;
      },
    });

  while (true) {
    if (!taskQueue.length && done) {
      return done;
    } else if (!taskQueue.length) {
      console.log('await idle');
      await ready.promise;

      if (done) {
        return done;
      }

      buildPromiseTask(ready);
    }

    console.log('await task');
    const result = await taskQueue.shift()!.promise;

    console.log('yield', result);
    yield result;
  }
}
