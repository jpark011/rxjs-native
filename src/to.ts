import { Observable } from 'rxjs';
import { iterateValues } from './utils';

export function toObservable<T>(
  asyncGenerator: AsyncGenerator<T>
): Observable<T> {
  return new Observable((subscriber) => {
    iterateValues(asyncGenerator, subscriber);
  });
}
