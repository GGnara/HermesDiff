import { configureStore, createSlice } from '@reduxjs/toolkit';

// 初期状態
const initialState = {
  items: [], // 配列を初期状態として設定
  SelectService //表示するサービス
};

// スライスの作成
const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setSelectService: (state, action) => {
      state.SelectService = action.payload;
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item, index) => index !== action.payload);
    }
  }
});

// ストアの作成
const store = configureStore({
  reducer: itemsSlice.reducer
});

export const { addItem, removeItem } = itemsSlice.actions;
export default store;

// HOW TO
// import store, { addItem, removeItem } from './src/store';

// // アイテムを追加
// store.dispatch(addItem('新しいアイテム'));

// // アイテムを削除（インデックス0のアイテムを削除）
// store.dispatch(removeItem(0));

// // 現在の状態を取得
// console.log(store.getState());