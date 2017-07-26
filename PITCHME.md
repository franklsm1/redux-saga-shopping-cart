## Redux-Saga Lunch and learn with an overview of ES6 generator functions

---

### Redux-Saga
- A Redux middleware for handling side effects (asynchronous and impure things)

- Being a middleware means it has access to the full application state and can dispatch redux actions

- Uses generator functions as opposed to using `async/await` since testing generators is easier

- Similar to `redux-thunk`, but eliminates getting stuck in callback hell as well as being simpler to test

---

### ES6 Generators Overview
- Very similar to the Python term [generator](https://docs.python.org/3/glossary.html#term-generator)

- Halt execution of a function for an indefinite period of time when the `yield` keyword is used inside of a `function*`

- Every time execution stops you can return, "yield", a value back to the function to continue execution with

- Provides essentially the same functionality as ES7 `async/await` keywords (which are built on top of generators), but slightly more complex

+++

Take code we are used to writing like:
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
@[1,8-9]
@[1,8-10]
@[1-2,8-10](`start here`)
@[1-3,8-10]
@[1-3,8-11](`{value: "first yield", done: false}`)
@[1-3,8-12]
@[1-4,8-12](`I am now the a variable`)
@[1-5,8-12]
@[1-5,8-13](`{value: "second yield", done: false}`)
@[1-5,8-14]
@[1-6,8-14](`I am now the b variable`)
@[1-14]
@[1-15](`{value: "all finished", done: true}`)
<br>

---

**Saga Helpers / Effects Example** (fetchSaga.js)
 ```javascript
import { call, put, takeEvery } from 'redux-saga/effects'
export function* fetchData(action) {
   try {
      const data = yield call(Api.fetchUser, action.url)
      yield put({type: 'SUCCEEDED', data})
   } catch (error) {
      yield put({type: 'FAILED', error})
   }
}
export function* watchFetchData() {
  yield takeEvery('REQUESTED', fetchData)
}
 ```
@[10-12](function to listen for every 'FETCH_REQUESTED' action dispatched)
@[11](console.log of the effect:<br>{ '@@redux-saga/IO': true,<br> FORK: { context: null, fn: [Function: takeEvery], args: [ 'REQUESTED', [Function: fetchData] ] }})
@[2-9]
@[4](console.log of the effect:<br>{ '@@redux-saga/IO': true,<br> CALL: { context: null, fn: [Function: Api.fetchUser], args: [action.url] }})
@[5](console.log of the effect:<br>{ '@@redux-saga/IO': true,<br> PUT: { channel: null, action: { type: 'SUCCEEDED', data: [1] }}})
@[6-8](If an error occurred perform a different action)  
@[7](console.log of the effect:<br>{ '@@redux-saga/IO': true,<br> PUT: { channel: null, action: { type: 'FAILED', error: 'error occurred' }}})
<br><br><br><br>

+++

**Unit Testing Sagas**
```javascript
import { call, put, takeEvery } from 'redux-saga/effects';
import { fetchData, watchFetchData } from '../fetchSaga';
const data = [1];
it('fetchData Saga test', () => {
  const generator = fetchData();
  let next = generator.next();
  expect(next.value).toEqual(call(Api.fetchUser, action.url));
  next = generator.next(data);
  expect(next.value).toEqual(put({type: 'SUCCEEDED', data}));
});
it('watchFetchData Saga test', () => {
  const generator = watchFetchData();
  let next = generator.next();
  expect(next.value).toEqual(takeEvery('REQUESTED', fetchData));
});
```
@[4-10]
@[11-15]
<br>

---

### Implementing Redux-saga walkthrough
You've seen something like the following in a react component to get data before your app loads:
```javascript
function fetchData(url){
  let { dispatch } = this.props;
  return fetch(url)
    .then(response => response.json())
    .then(items => dispatch(actions.receiveItems(items)))
    .catch(() => dispatch(actions.fetchFailure()));
}
```
**This is bad!**
- Components shouldn't include logic to fetch data
- Not easy to test without significant mocking

+++

### Steps to correct this with Redux-Saga
1. Install redux-saga: `npm install redux-saga`

2. Create a `sagas` dir with a new js file within it

3. Move the fetch function into the new saga file (or a separate location then import it in)

4. Create a new generator function that will call `fetchData` then dispatch an action w/ the response

5. Wire up the redux store with the saga middleware

6. Remove the initial fetch call from the component

+++

### Example Saga file
**src/sagas/items.js**
```javascript
import { put, call } from 'redux-saga/effects';
import * as actions from '../actions/items';

function fetchData(url){
  return fetch(url).then(response => response.json());
}
export function* getItems() {
  try {
    const items = yield call(fetchData, "http://item.fetch/api");
    yield put(actions.receiveItems(items));
  } catch {
    yield put(actions.fetchFailure());
  }
}
```

+++

### Root Saga to communicate w/ the middleware
**src/sagas/index.js**
```javascript
import { fork } from 'redux-saga/effects';
import { getItems } from './items'

export default function* root(){
  yield fork(getItems);
}
```

+++

### Wiring the store with the saga middleware
Where your react-redux `Provider` is add the following:
```javascript
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(rootSaga);
```

---

# Live Demo

---

### Useful links
- [redux-saga API](https://redux-saga.js.org/docs/api/)
- [intro to ES6 generator functions](http://thejsguy.com/2016/10/15/a-practical-introduction-to-es6-generator-functions.html)
- [moving API requests in React to Redux-Saga's](https://hackernoon.com/moving-api-requests-to-redux-saga-21780f49cbc8)
- [interview with the writer of redux-saga](https://survivejs.com/blog/redux-saga-interview)
