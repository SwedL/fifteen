const coordsVictory = [
    ['25', '25'], ['125', '25'], ['225', '25'], ['325', '25'],
    ['25', '125'], ['125', '125'], ['225', '125'], ['325', '125'],
    ['25', '225'], ['125', '225'], ['225', '225'], ['325', '225'],
    ['25', '325'], ['125', '325'], ['225', '325']
]

const button = document.querySelector('.button');
const tags = document.querySelectorAll('.tag');
tags.forEach(t => t.addEventListener('click', handleMove));
button.addEventListener('click', handleButton);

/** Функция получает массив элементов костяшек и возвращает список координат костяшек */
function getCoordTags(array) {
    const output = [];
    for (i of array) {
        output.push([i.dataset.x, i.dataset.y]);
    }
    return output;
}

/* Функция сравнивает текущие координаты костяшек с выигрышной комбинацией и возвращает true/false */
function checkVictory() {
    const allCoordsTags = getCoordTags(document.querySelectorAll('.tag'));
    return JSON.stringify(allCoordsTags) == JSON.stringify(coordsVictory);
}

/* Функция получает элемент - костяшку для передвижения, анимированно передвигая, меняет её позицию */
function doMove(movedTag, deltaX, deltaY) {
    let [value, currentX, currentY] = Object.values(movedTag.dataset);
    const newX = Number(currentX) + deltaX;
    const newY = Number(currentY) + deltaY;
    movedTag.dataset.x = newX;
    movedTag.dataset.y = newY;
    anime({
        targets: movedTag,
        duration: 300,
        left: `${newX}px`,
        top: `${newY}px`,
        easing: 'linear',
    });
    setTimeout(() => console.log(checkVictory()), 300);
}

/**
* Функция получает координаты всех костяшек, нажатую костяшку и её координаты
* Проверяет крайняя ли она сверху, если нет - то ищет костяшки которые стоят выше на один шаг в том же столбце
* и помешают её ходу вверх.
* Если список мешающихся костяшек пуст, то выполняет функцию перемещения.
*/
function stepTop(tagsCoords, clickTag, clickTagX, clickTagY) {
    if (clickTagY > 25) {
        const findTag = tagsCoords.filter(c => {return (c[0] == Number(clickTagX) && c[1] == Number(clickTagY) - 100)});
        if (!findTag.length) {
            doMove(clickTag, deltaX=0, deltaY=-100);
            return true;
        }
    }
    return false;
}

/** Функция выполняет все процедуры как и у функции stepTop но при ходе вправо */
function stepRight(tagsCoords, clickTag, clickTagX, clickTagY) {
    if (clickTagX < 325) {
        const findTag = tagsCoords.filter(c => {return (c[0] == Number(clickTagX) + 100 && c[1] == Number(clickTagY))});
        if (!findTag.length) {
            doMove(clickTag, deltaX=100, deltaY=0);
            return true;
        }
    }
    return false;
}

/** Функция выполняет все процедуры как и у функции stepTop но при ходе вниз */
function stepBottom(tagsCoords, clickTag, clickTagX, clickTagY) {
    if (clickTagY < 325) {
        const findTag = tagsCoords.filter(c => {return (c[0] == Number(clickTagX) && c[1] == Number(clickTagY) + 100)});
        if (!findTag.length) {
            doMove(clickTag, deltaX=0, deltaY=100);
            return true;
        }
    }
    return false
}

/** Функция выполняет все процедуры как и у функции stepTop но при ходе влево */
function stepLeft(tagsCoords, clickTag, clickTagX, clickTagY) {
    if (clickTagX > 25) {
        const findTag = tagsCoords.filter(c => {return (c[0] == Number(clickTagX) - 100 && c[1] == Number(clickTagY))});
        if (!findTag.length) {
            doMove(clickTag, deltaX=-100, deltaY=0);
            return true;
        }
    }
    return false;
}

/* Функция отрабатывает при нажатии на костяшку и пытается сделать ход выбранной костяшки в свободный слот */
function handleMove(event) {
    const tags = document.querySelectorAll('.tag');  // получаем элементы всех костяшек document
    const allCoordsTags = getCoordTags(tags);        // получаем координаты всех костяшек
    const clickTag = event.srcElement                // получаем элемент нажатой костяшки
    let [_, currentTagX, currentTagY] = Object.values(clickTag.dataset);

    // пытаемся у выбранной костяшки сделать ходы на 4 стороны
    for (step of [stepTop, stepRight, stepBottom, stepLeft]) {
        const flag = step(allCoordsTags, clickTag, currentTagX, currentTagY);
        if (flag) {
            break;
        }
    }
}

function handleButton(event) {
    console.log('start game');
}
