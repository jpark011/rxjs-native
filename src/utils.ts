export interface PromiseTask<T> {
  promise: Promise<T>;
  resolveFn: (value: T) => void;
  rejectFn: (err: any) => void;
}

export function buildPromiseTask<T>(
  task: PromiseTask<T> | null = null
): PromiseTask<T> {
  let resolveFn!: (value: T) => void;
  let rejectFn!: (err: any) => void;
  let promise = new Promise<T>((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });

  if (task) {
    task.promise = promise;
    task.resolveFn = resolveFn;
    task.rejectFn = rejectFn;

    return task;
  }

  return { promise, resolveFn, rejectFn };
}
