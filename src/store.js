import { configureStore, createSlice } from '@reduxjs/toolkit';

// 初期状態
const initialState = {
  items: [], // アイテムの配列を初期状態として設定
  SelectService: "", // 選択されたサービスを初期化
  SelectServices: [], // サービス一覧の配列を初期状態として設定
  processingFlag: false, // 処理中フラグを初期化
  StackName: "Nodata", // スタック名を初期化、初期値の場合はメインメニューに強制変遷
  LogicalID: "", // 論理IDを初期化
  CLIDiffKey: "", // CLI比較用の現状のkey
  SelectCFn: false // StoreSelectCFnの初期値をfalseに設定
};

// スライスの作成
const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    StoreSelectService: (state, action) => {
      state.SelectService = action.payload; // 選択されたサービスを保存
    },
    StoreSelectServices: (state, action) => {
      state.SelectServices = action.payload; // サービス一覧を保存
    },
    StoreCLIValue: (state, action) => {
      state.StoreCLIValue = action.payload; // CLIの値を保存
    },
    StoreAllGrp: (state, action) => {
      state.StoreAllGrp = action.payload; // 全グループを保存
    },
    StoreTaggleCLIValuesFlg: (state) => {
      state.processingFlag = !state.processingFlag; // 処理中フラグを反転
    },
    StoreStackName: (state, action) => {
      state.StackName = action.payload; // スタック名を保存
    },
    StoreLogicalID: (state, action) => {
      state.LogicalID = action.payload; // 論理IDを保存
    },
    StoreCLIDiffKey: (state, action) => {
      state.CLIDiffKey = action.payload; // CLIの差分キーを保存
    },
    StoreSelectCFn: (state, action) => {
      state.SelectCFn = action.payload;
    }
  }
});

// ストアの作成
const store = configureStore({
  reducer: itemsSlice.reducer
});

export const { StoreSelectServices, StoreSelectService, StoreCLIValue, StoreAllGrp, StoreTaggleCLIValuesFlg, StoreStackName, StoreLogicalID, StoreCLIDiffKey, StoreSelectCFn } = itemsSlice.actions;
export default store;

// 使用方法
// import store, { addItem, removeItem, StoreSelectServices, StoreSelectService } from './store.js';

// アイテムを追加
// store.dispatch(addItem('新しいアイテム'));

// アイテムを削除（インデックス0のアイテムを削除）
// store.dispatch(removeItem(0));

// 現在の状態を取得
// console.log(store.getState());