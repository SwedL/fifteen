const victoryCoords = [
    ['25', '25'], ['125', '25'], ['225', '25'], ['325', '25'],
    ['25', '125'], ['125', '125'], ['225', '125'], ['325', '125'],
    ['25', '225'], ['125', '225'], ['225', '225'], ['325', '225'],
    ['25', '325'], ['125', '325'], ['225', '325']
]

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
}

class MoveChecker {
        /**
    * Функция получает координаты всех костяшек, нажатую костяшку и её координаты
    * Проверяет крайняя ли она сверху, если нет - то ищет костяшки которые стоят выше на один шаг в том же столбце
    * и помешают её ходу вверх.
    * Если список мешающихся костяшек пуст, то выполняет функцию перемещения.
    */
    static moveTop(tagsCoords, clickTagX, clickTagY) {
        if (clickTagY > 25) {
            const findTag = tagsCoords.filter(c => {return (c[0] == Number(clickTagX) && c[1] == Number(clickTagY) - 100)});
            if (!findTag.length) {
                return [0, -100];
            }
        }
        return false;
    }

    /** Функция выполняет все процедуры как и у функции stepTop но при ходе вправо */
    static moveRight(tagsCoords, clickTagX, clickTagY) {
        if (clickTagX < 325) {
            const findTag = tagsCoords.filter(c => {return (c[0] == Number(clickTagX) + 100 && c[1] == Number(clickTagY))});
            if (!findTag.length) {
                return [100, 0];
            }
        }
        return false;
    }

    /** Функция выполняет все процедуры как и у функции stepTop но при ходе вниз */
    static moveBottom(tagsCoords, clickTagX, clickTagY) {
        if (clickTagY < 325) {
            const findTag = tagsCoords.filter(c => {return (c[0] == Number(clickTagX) && c[1] == Number(clickTagY) + 100)});
            if (!findTag.length) {
                return [0, 100];
            }
        }
        return false
    }

    /** Функция выполняет все процедуры как и у функции stepTop но при ходе влево */
    static moveLeft(tagsCoords, clickTagX, clickTagY) {
        if (clickTagX > 25) {
            const findTag = tagsCoords.filter(c => {return (c[0] == Number(clickTagX) - 100 && c[1] == Number(clickTagY))});
            if (!findTag.length) {
                return [-100, 0];
            }
        }
        return false;
    }

    /** Функция возвращает список всех функций проверок доступного перемещения выбранной костяшки */
    static getAllMoveCheckers() {
        return [this.moveTop, this.moveRight, this.moveBottom, this.moveLeft]
    }
}

class TagsMixer {
    /** Функция правильно перемешивает костяшки */
    static shuffleArray() {
        while (true) {
            let array = Array.from({ length: 15 }, (_, i) => i + 1);
            let checkSum = 0;

            // Перемешивание костяшек
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; // Обмен значениями
            }
            
            // Проверка перемешивания костяшек на собираемость
            for (let index1 = 0; index1 < 14; index1++) {
                for (let index2 = index1 + 1; index2 < 15; index2++) {
                    if (array[index1] > array[index2]) {
                        checkSum++;
                    }
                }
            }
            if (checkSum % 2 === 0) {
                return array;
            }
        }
    }

    /** Функция выполняет перестроение костяшек на поле */
    static doMix() {
        let mixedTagsList = this.shuffleArray();

        for (let tagValue of mixedTagsList) {
            let tag = document.getElementById(tagValue);
            let [newTagCordX, newTagCordY] = victoryCoords[mixedTagsList.indexOf(tagValue)]
            let deltaX = newTagCordX - tag.dataset.x;
            let deltaY = newTagCordY - tag.dataset.y;
            doMove(tag=tag, deltaX=deltaX, deltaY=deltaY);
        }
    }
}

class Congratulations {
    static firstHappy() {
        anime({
        targets: '.letter',
        opacity: 1,
        rotate: {
            value: 360,
            duration: 2000,
            easing: 'easeInExpo'
        }, 
        delay: anime.stagger(100, {start: 0}), 
        translateX: [-2300, 0]
        });
        setTimeout(() => this.secondHappy(), 6000);
    }


    static secondHappy() {
        anime.timeline({
        duration: 3000,
        easing: 'easeInOutSine',
        loop: true
        });
        animation.add({
        targets: '.one',
        keyframes: [
            {translateY: -20},
            {translateY: 0}
        ]
        }).add({
        targets: '.two',
        keyframes: [
            {translateY: -20},
            {translateY: 0},
        ]
        }, '-=2500').add({
        targets: '.three',
        keyframes: [
            {translateY: -20},
            {translateY: 0},
        ]
        }, '-=2500');
    }
}

export {
    MoveChecker,
    TagsMixer,
    Congratulations,
    doMove,
    victoryCoords,
}