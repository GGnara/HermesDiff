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
    StoreSelectService: (state, action) => {
      state.SelectService = action.payload; //現状表示するべきサービス
    },
    StoreSelectServices: (state, action) => {
      state.SelectServices = action.payload; // yamlのサービス一覧
    },
    StoreCLIValue: (state, action) => {
      state.StoreCLIValue = action.payload; // yamlのサービス一覧
    },
    StoreAllGrp: (state, action) => {
      state.StoreAllGrp = action.payload; // yamlのサービス一覧
    }

  }
});

// ストアの作成
const store = configureStore({
  reducer: itemsSlice.reducer
});

export const { StoreSelectServices ,StoreSelectService,StoreCLIValue,StoreAllGrp} = itemsSlice.actions;
export default store;

// HOW TO
// import store, { addItem, removeItem, StoreSelectServices ,StoreSelectService } from './store.js';

// // アイテムを追加
// store.dispatch(addItem('新しいアイテム'));

// // アイテムを削除（インデックス0のアイテムを削除）
// store.dispatch(removeItem(0));

// // 現在の状態を取得
// console.log(store.getState());