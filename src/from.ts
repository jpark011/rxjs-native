import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { buildPromise } from './utils';

export async function* eachValueFrom<T>(
  obs$: Observable<T>
): AsyncGenerator<T, boolean, never> {
  let [promise, resolveFn, rejectFn] = buildPromise<T>();
  let done = false;

  obs$.pipe().subscribe({
    next(value: T) {
      resolveFn(value);
    },
    error(err: any) {
      rejectFn(err);
    },
    complete() {
      done = true;
    },
  });

  while (true) {
    const result = await promise;

    yield result;

    if (done) {
      break;
    }

    [promise, resolveFn, rejectFn] = buildPromise<T>();
  }

  return true;
}
