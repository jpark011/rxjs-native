# RxJS Native

Use [RxJS](https://rxjs.dev/) in native JavaScript!

### Install

`rxjs-native` requires `rxjs@^7.0.0`

```bash
npm i --save rxjs rxjs-native
```

### Usage

Use it with `for await` or as a plain [`async generator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)

```ts
import { eachValueFrom } from 'rxjs-native';
const list$ = from([1, 2, 3, 4, 5]);

for await (const value of eachValueFrom(list$)) {
  console.log(value);
}

console.log('done!');

// 1
// 2
// 3
// 4
// 5
// done!
```

### Caution

- This is an experimental project.
- NOT recommended to be used in production.
- If an observable does not complete, the generator never completes either (potential infinite loop & memory leak)
