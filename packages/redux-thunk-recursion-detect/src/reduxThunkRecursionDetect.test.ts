import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware, { isNestedThunkSymbol } from './reduxThunkRecursionDetect';

describe('recursion detection thunk middleware', () => {
  test('top level thunk does not get marked with isNestedThunk symbol', () => {
    const store = createStore(() => {}, applyMiddleware(thunkMiddleware));
    const topThunkFn = topThunk({ type: 'test' });
    store.dispatch(topThunkFn as any);
    expect(topThunkFn[isNestedThunkSymbol]).toBe(undefined);
    function topThunk(data: any) : any {
      return (dispatch: any) : any => {
        dispatch(data);
      };
    }
  });

  test('second level and beyond thunks functions do get marked with isNestedThunk symbol', () => {
    const store = createStore(() => {}, applyMiddleware(thunkMiddleware));
    let nestedThunkFn: any;
    let doubleNestedThunkFn: any;
    const topThunkFn: any = topThunk({ type: 'test' });
    store.dispatch(topThunkFn as any);
    expect(topThunkFn[isNestedThunkSymbol]).toBe(undefined);
    expect(nestedThunkFn[isNestedThunkSymbol]).toBe(true);
    expect(doubleNestedThunkFn[isNestedThunkSymbol]).toBe(true);
    function topThunk(data: any) : any {
      return (dispatch: any) => {
        nestedThunkFn = nestedThunk(data);
        dispatch(nestedThunkFn);
      };
    }
    function nestedThunk(data: any) {
      return (dispatch: any) => {
        doubleNestedThunkFn = doubleNestedThunk(data);
        dispatch(doubleNestedThunkFn);
      };
    }
    function doubleNestedThunk(data: any) {
      return (dispatch: any) => {
        dispatch(data);
      };
    }
  });
});
