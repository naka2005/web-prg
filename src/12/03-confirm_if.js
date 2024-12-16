const result = confirm("本当に削除してよいですか?");

if (result) {
    // 削除する結果
    console.log("削除しました");
}
else {
    console.log("キャンセルしました");
}
