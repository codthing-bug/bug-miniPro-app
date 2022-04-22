
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { fetchCount } from './counterAPI';

export interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CounterState = {
  value: 0,
  status: 'idle',
};

// 下面的函数称为 thunk，它允许执行异步逻辑。 
// 它可以像常规操作一样调度：`dispatch(incrementAsync(10))`。

// 这将使用 `dispatch` 函数作为第一个参数调用 thunk。 
// 然后可以执行异步代码并可以调度其他操作。 Thunk 通常用于发出异步请求。

export const incrementAsync = createAsyncThunk(
  'counter/fetchCount',
  async (amount: number) => {
    const response = await fetchCount(amount);
    // 返回的值成为 “已完成” 操作负载（action payload）
    return response.data;
  }
);

export const counterSlice = createSlice({
  name: 'counter', //这里的 `counter` 是 store 中的 reducer 字段的 counter
  initialState,
  // `reducers` 字段可以定义 reducer 并生成相关的操作
  reducers: {
    increment: (state) => {
      // Redux Toolkit 允许在 reducer 中编写“变异”逻辑。
      // 它实际上并没有改变状态，因为它使用了 Immer 库，
      // 它检测 “draft state（草稿状态）” 的变化，并根据这些变化产生一个全新的不可变状态
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // 使用 PayloadAction 类型声明 `action.payload` 的内容
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  // `extraReducers` 字段让切片处理在别处（reducers 字段之外）定义的动作，包括由 createAsyncThunk 或其他切片生成的动作。
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value += action.payload;
      });
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// 下面的函数称为选择器，它允许从状态中选择一个值。 
// 也可以在使用它们的地方而不是在切片文件中内联定义选择器。 
// 例如：`useSelector((state: RootState) => state.counter.value)`
export const selectCount = (state: RootState) => state.counter.value;

// 也可以手工编写 thunk，它可能包含同步和异步逻辑。
// 这是一个基于当前状态有条件地分派动作的例子。
export const incrementIfOdd = (amount: number): AppThunk => (
  dispatch,
  getState
) => {
  const currentValue = selectCount(getState());
  if (currentValue % 2 === 1) {
    dispatch(incrementByAmount(amount));
  }
};

export default counterSlice.reducer;