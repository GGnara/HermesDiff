import { configureStore, createSlice } from '@reduxjs/toolkit';

// 初期状態
const initialState = {
  items: [], // 配列を初期状態として設定
  SelectService:"",
  SelectServices: [] // 初期値を配列として設定
};

// スライスの作成
const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setSelectService: (state, action) => {
      state.SelectService = action.payload; //現状表示するべきサービス
    },
    setSelectServices: (state, action) => {
      state.SelectServices = action.payload; // yamlのサービス一覧
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

export const { addItem, removeItem, setSelectServices ,setSelectService} = itemsSlice.actions;
export default store;

// HOW TO
// import store, { addItem, removeItem, setSelectServices ,setSelectService } from './store.js';

// // アイテムを追加
// store.dispatch(addItem('新しいアイテム'));

// // アイテムを削除（インデックス0のアイテムを削除）
// store.dispatch(removeItem(0));

// // 現在の状態を取得
// console.log(store.getState());