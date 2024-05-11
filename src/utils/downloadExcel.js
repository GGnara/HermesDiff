// utils/downloadExcel.js
import XLSX from 'xlsx-js-style';

const downloadExcel = (data, filename = 'data.xlsx') => {
    const ws = XLSX.utils.json_to_sheet(data, { origin: "B2" });
    // 省略: 罫線のスタイル適用ロジック

    // 罫線のスタイルを定義
    const borderAll = {
        top: { style: 'thin', color: { rgb: "000000" } },
        bottom: { style: 'thin', color: { rgb: "000000" } },
        left: { style: 'thin', color: { rgb: "000000" } },
        right: { style: 'thin', color: { rgb: "000000" } }
    };

    const startRow = 1; // B2から始めるため、1行目をスキップ
    const startCol = 1; // B列から始める

    // data配列の最初のオブジェクトからキーの数を列数として取得
    const numberOfCols = Object.keys(data[0]).length;

    // // 全てのデータセルに罫線スタイルを適用
    for (let row = 0; row < data.length + 1; row++) { //1行目はタイトルなので罫線するrow+1
        for (let col = 0; col < numberOfCols; col++) { // 列数を動的に設定
            let cellRef = XLSX.utils.encode_cell({ c: col + startCol, r: row + startRow });
            if (!ws[cellRef]) ws[cellRef] = {};
            ws[cellRef].s = {
                border: borderAll,
            };
        }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filename, { bookType: 'xlsx', type: 'binary', cellStyles: true });
};

export default downloadExcel;
