export function buildPromise<T>(): [
  Promise<T>,
  (value: T) => void,
  (err: any) => void
] {
  let resolveFn: (value: T) => void;
  let rejectFn: (err: any) => void;
  let promise = new Promise<T>((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });

  return [promise, resolveFn!, rejectFn!];
}
