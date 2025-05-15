import { MoveChecker, TagsMixer, doMove, victoryCoords } from "./common.js";


const button = document.querySelector('.button');
const tags = document.querySelectorAll('.tag');

button.addEventListener('click', handleButton);

/** Функция получает массив элементов костяшек и возвращает список координат костяшек */
function getTagsCoords(array) {
    const output = [];
    for (let i of array) {
        output.push([i.dataset.x, i.dataset.y]);
    }
    return output;
}

/* Функция сравнивает текущие координаты костяшек с выигрышной комбинацией и возвращает true/false */
function checkVictory() {
    const tagsCoords = getTagsCoords(document.querySelectorAll('.tag'));
    return JSON.stringify(tagsCoords) == JSON.stringify(victoryCoords);
}

/* Функция отрабатывает при нажатии на костяшку и пытается сделать ход выбранной костяшки в свободный слот */
function handleMove(event) {
    const tags = document.querySelectorAll('.tag');  // получаем элементы всех костяшек document
    const tagsCoords = getTagsCoords(tags);        // получаем координаты всех костяшек
    const clickTag = event.srcElement                // получаем элемент нажатой костяшки
    let [_, clickTagX, clickTagY] = Object.values(clickTag.dataset);

    // пытаемся у выбранной костяшки сделать ходы на 4 стороны
    for (let step of MoveChecker.getAllMoveCheckers()) {
        const availableCoordsDelts = step(tagsCoords, clickTagX, clickTagY);
        if (availableCoordsDelts) {
            doMove(clickTag, ...availableCoordsDelts);
            if (checkVictory()) {
                tags.forEach(t => t.removeEventListener('click', handleMove));
                console.log(checkVictory());
            }
            break;
        }
    }
}

/* Функция отрабатывает при нажатии на кнопку <<Старт игры>> и перемешивает костяшки */
function handleButton(event) {
    tags.forEach(t => t.addEventListener('click', handleMove));
    TagsMixer.doMix();
}
