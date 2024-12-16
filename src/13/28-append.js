const newElement = document.createElement("p");
newElement.textContent = "新しく追加されました";

const content = document.querySelector(".content");
content.append(newElement);
