import { Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { toObservable } from '../src';

describe('to', () => {
  describe('toObservable', () => {
    const destroy$ = new Subject<void>();

    afterEach(() => {
      destroy$.next();
    });

    test('blank async generator will complete', (done) => {
      async function* test() {}

      const obs$ = toObservable(test());

      obs$
        .pipe(
          takeUntil(destroy$),
          finalize(() => done())
        )
        .subscribe();
    });

    test('async generator with single value will emit a single value', (done) => {
      const value = 1;
      async function* test() {
        return value;
      }

      const obs$ = toObservable(test());

      obs$
        .pipe(
          takeUntil(destroy$),
          finalize(() => done())
        )
        .subscribe((v) => expect(v).toEqual(value));
    });

    test('async generator with delayed value will emit multiple values', (done) => {
      const value = 1;
      async function* test() {
        yield await new Promise((resolve) =>
          setTimeout(() => resolve(value), 100)
        );
      }

      const obs$ = toObservable(test());

      obs$
        .pipe(
          takeUntil(destroy$),
          finalize(() => done())
        )
        .subscribe((v) => expect(v).toEqual(value));
    });

    test('async generator with multiple value will emit multiple value', (done) => {
      const values = [1, 2, 3, 4];
      async function* test() {
        yield* values;
      }

      const obs$ = toObservable(test());
      const result: typeof values = [];

      obs$
        .pipe(
          tap((v) => result.push(v)),
          takeUntil(destroy$),
          finalize(() => done())
        )
        .subscribe({ complete: () => expect(result).toEqual(values) });
    });

    test('when exception is thrown, exception is raised', (done) => {
      const error = new Error('test');
      async function* test() {
        throw error;
      }

      const obs$ = toObservable(test());

      obs$
        .pipe(
          takeUntil(destroy$),
          finalize(() => done())
        )
        .subscribe({
          error: (err) => expect(err).toEqual(error),
        });
    });

    test('when exception is thrown in the middle, values are emitted and exception is raised', (done) => {
      const values = [1, 2, 3, 4];
      const error = new Error('test');
      async function* test() {
        yield* values;
        throw new Error('test');
        yield* values;
      }

      const obs$ = toObservable(test());
      const result: typeof values = [];

      obs$
        .pipe(
          tap((v) => result.push(v)),
          takeUntil(destroy$),
          finalize(() => done())
        )
        .subscribe({
          error: (err) => expect(err instanceof Error).toBeTruthy(),
          complete: () => expect(result).toEqual(values),
        });
    });
  });
});
