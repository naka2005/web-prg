const today = new Date().toLocaleString("ja-JP", { dateStyle: "long" });
console.log(today);

const formattter = Intl.DateTimeFormat("ja-JP", { dateStyle: "long" });
const today2 = formattter.format(new Date());
console.log(today2);
