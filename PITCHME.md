## Redux-Saga Lunch and learn with an overview of ES6 generator functions

---

### ES6 Generators Overview
- Very similar to the Python term [generator](https://docs.python.org/3/glossary.html#term-generator)

- Halt execution of a function for an indefinite period of time when the `yield` keyword is used inside of a `function*`

- Every time execution stops you can return, "yield", a value back to the function to continue execution with

- Provides essentially the same functionality as ES7 `async/await` keywords (which is most likely built on top of generators), but slightly more complex

+++

Take code we are used to writing like this:
```javascript
User.findbyId(id)
  .then(user => {
    user.getFavoriteIceCreams()
      .then(iceCreams => {
        console.log(iceCreams);
      });
  });
```
In a generator function it would look like:
```javascript
let user = yield User.findbyId(id);
let iceCreams = yield user.getFavoriteIceCreams();
console.log(iceCreams);
```
As you can see this makes asynchronous code look synchronous and is much easier to read

+++

### Generator Function Example
```javascript
function* generatorExample() {
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
@[9-10]
@[2](`start here`)
@[3]
@[11](`{value: "first yield", done: false}`)
@[12]
@[4](`I am now the a variable`)
@[5]
@[13](`{value: "second yield", done: false}`)
@[14]
@[6](`I am now the b variable`)
@[7]
@[15](`{value: "all finished", done: true}`)

---

### Redux-Saga Overview
- Node package that makes asynchronous things like data fetching in React/Redux apps easier and better

- Redux middleware, which means it has access to the full application state and can dispatch redux actions

- Uses generator functions as opposed to using `async/await` since testing generators is easier

- Similar to `redux-thunk`, but eliminates getting stuck in callback hell as well as being simpler to test

+++

### React example of what not to do
You've seen something like this in a react component:
```javascript
fetch(url)
  .then((response) => {
      if (!response.ok)
          throw Error(response.statusText);
      return response;
  })
  .then((response) => response.json())
  .then((items) => this.setState({ items }))
  .catch(() => this.setState({ hasErrored: true }));
```
**This is very bad!**
1. Components shouldn't include logic to fetch data
2. They shouldn't store the data in its own state

---

# Live Demo

---
### Useful links
- [redux-saga API](https://redux-saga.js.org/docs/api/)
- [into to ES6 generator functions](http://thejsguy.com/2016/10/15/a-practical-introduction-to-es6-generator-functions.html)
