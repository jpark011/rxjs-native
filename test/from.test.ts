import { from, merge, of, throwError, timer } from 'rxjs';
import { eachValueFrom } from '../src';

describe('from', () => {
  describe('eachValueFrom', () => {
    test('empty observable will complete', async () => {
      const obs$ = of();

      for await (const val of eachValueFrom(obs$)) {
        expect(true).toBeFalsy();
      }

      expect(true).toBeTruthy();
    });

    test('observable with single value will emit a single value', async () => {
      const value = 1;
      const obs$ = of(value);

      for await (const val of eachValueFrom(obs$)) {
        expect(val).toEqual(value);
      }

      expect(true).toBeTruthy();
    });

    test('observable with delayed value will emit multiple values', async () => {
      const obs$ = timer(100);

      for await (const val of eachValueFrom(obs$)) {
        expect(val).toEqual(0);
      }

      expect(true).toBeTruthy();
    });

    test('observable with multiple value will emit a single value', async () => {
      const values = [1, 2, 3, 4];
      const obs$ = from(values);
      const result = [];

      for await (const val of eachValueFrom(obs$)) {
        result.push(val);
      }

      expect(result).toEqual(values);
    });

    test('when exception is thrown, exception is raised', async () => {
      const error = new Error('test');
      const obs$ = throwError(() => error);

      try {
        for await (const val of eachValueFrom(obs$)) {
          expect(val).toBeUndefined();
        }
      } catch (err) {
        expect(err).toEqual(error);
      }
    });

    test('when exception is thrown in the middle, values are emitted and exception is raised', async () => {
      const values = [1, 2, 3, 4];
      const error = new Error('test');
      const obs$ = merge(
        values,
        throwError(() => error)
      );
      const result = [];

      try {
        for await (const val of eachValueFrom(obs$)) {
          result.push(val);
        }
      } catch (err) {
        expect(err).toEqual(error);
      }

      expect(result).toEqual(values);
    });
  });
});
