#Redux-Saga w/ a brief overview of ES6 generators
---
## Redux-Saga Overview
- Node package that makes asynchronous things like data fetching in React/Redux applications easier and better
- Redux middleware, which means it has access to the full application state and can dispatch redux actions
- Uses ES6 Generator functions to allow for asynchronous things to be easy to read, write, and test
- Similar to `redux-thunk` if you have used it before, but eliminates getting stuck in callback hell as well as being much simpler to test
---
## ES6 Generators Overview
- Very similar to the Python term [generator](https://docs.python.org/3/glossary.html#term-generator)
- Will halt execution of a function for an indefinite period of time when the `yield` keyword is used inside a generator function
- The code that invoked the generator will then be able to control when it continues
- Every time execution stops you can return ("yield") a value back to the function to continue execution with
- Provide essentially the same functionality as ES7 `async/await` keywords (most likely built on top of generators), but slightly more complex
- Used by redux-saga as opposed to using `async/await` since testing generators is much much simpler
+++
For example, take code were used to writing like this:
```
User.findbyId(id)
  .then(user => {
    user.getFavoriteIceCreams()
      .then(iceCreams => {
        console.log(iceCreams);
      });
  });
```
With generators it will look like:
```
let user = yield User.findbyId(id);
let iceCreams = yield user.getFavoriteIceCreams();
console.log(iceCreams);
```
This asynchronous code looks synchronous and is easier to read
+++
Consider the following code:
```
function *generatorExample() {
  console.log('start here');
  let a = yield 'first yield';
  console.log(a);
  let b = yield 'second yield';
  console.log(b);
  return 'all finished';
}

let iterator = generatorExample();
let next = iterator.next();
console.log(next);
next = iterator.next('I am now the a variable');
console.log(next);
next = iterator.next('I am now the b variable');
console.log(next);
```
+++
It will output the following:
```
start here
{value: "first yield", done: false}
I am now the a variable
{value: "second yield", done: false}
I am now the b variable
{value: "all finished", done: true}
```
