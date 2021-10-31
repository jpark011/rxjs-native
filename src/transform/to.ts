import { Observable } from 'rxjs';
import { iterateValues } from '../utils';

/**
 * @deprecated RxJS already supports this internally
 *
 * async generator => Observable
 *
 * Use a native async generator with RxJS
 *
 * Example:
 *
 * ```ts
 * async function* tester() {
 *   yield 'hello';
 *   yield* [1, 2, 3, 4];
 *   throw new Error('test');
 * }
 *
 * const obs$ = toObservable(tester());
 *
 * obs$.pipe(catchError(err => of('error caught!'))).subscribe(console.log)
 * ```
 *
 * @param asyncGenerator
 * @returns
 */
export function toObservable<T>(
  asyncGenerator: AsyncGenerator<T>
): Observable<T> {
  return new Observable((subscriber) => {
    iterateValues(asyncGenerator, subscriber);
  });
}
