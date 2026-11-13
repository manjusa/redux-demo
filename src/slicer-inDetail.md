## Lets get into details

## Update - i think readme.md explains things in details now. Below may be redundant

### Q) When we create slice does that mean it exposes "reducer" and "actions" ?

### A)

Yes. createSlice builds both and puts them on the slice object. Your file then exports them.

```JSX
const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value += 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});
export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;

```

You pass in `reducers`: one function per case (`increment`, `decrement`, `incrementByAmount`).
From those names, `createSlice` produces:

- **`counterSlice.actions`** — action creators with the same names. Calling `increment()` returns an action like:

  ```js
  {
    type: "counter/increment";
  }
  ```

  Calling `incrementByAmount(5)` returns:

  ```js
  { type: "counter/incrementByAmount", payload: 5 }
  ```

  The `counter/` prefix comes from `name: "counter"`.

- **`counterSlice.reducer`** — one reducer function. When the store sends it an action, it runs the matching case and returns the next state.

### MFupQ) can you explain below a bit more ? i.e below

```
counterSlice.reducer — one reducer function. When the store sends it an action, it runs the matching case and returns the next state. ..i mean where is reducer fn here? in our eg
```

### A)

The single reducer function is not written in your file. _createSlice_ builds it and stores it on **counterSlice.reducer**.

What you wrote are the cases, under the key reducers:

```JS
reducers: {
  increment: (state) => {
    state.value += 1;
  },
  decrement: (state) => {
    state.value += 1;
  },
  incrementByAmount: (state, action) => {
    state.value += action.payload;
  },
},
```

Each of those is a small function for one action. _**createSlice**_ wraps them into one function, roughly like this:

```JSX
function reducer(state = { value: 0 }, action) {
  switch (action.type) {
    case "counter/increment":
      // runs your increment function
      return nextState;
    case "counter/decrement":
      // runs your decrement function
      return nextState;
    case "counter/incrementByAmount":
      // runs your incrementByAmount function
      return nextState;
    default:
      return state;
  }
}
```

That generated function is **counterSlice.reducer**. This line is where you hand it to the rest of the app:

```JSX
export default counterSlice.reducer;
```
