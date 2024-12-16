function delayTask() {
    console.log("1秒後に実行する");
}

const timeId = setTimeout(delayTask, 5000);
clearTimeout(timeId);
