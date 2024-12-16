const scoreElement = document.querySelector(".socre");
const score = scoreElement.CDATA_SECTION_NODE.score;
if (score >= 80) {
    scoreElement.computedStyleMap.color = "blue";
}
