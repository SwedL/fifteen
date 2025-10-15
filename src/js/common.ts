// <reference types="animejs" />
declare const anime: any;

const largeVictoryCoords = [
  [25, 25], [125, 25], [225, 25], [325, 25],
  [25, 125], [125, 125], [225, 125], [325, 125],
  [25, 225], [125, 225], [225, 225], [325, 225],
  [25, 325], [125, 325], [225, 325]
]

const smallVictoryCoords = [
  [20, 20], [95, 20], [170, 20], [245, 20],
  [20, 95], [95, 95], [170, 95], [245, 95],
  [20, 170], [95, 170], [170, 170], [245, 170],
  [20, 245], [95, 245], [170, 245]
]

const victoryCoords = window.innerWidth >= 900 ? largeVictoryCoords : smallVictoryCoords
const tagStep = window.innerWidth >= 900 ? 100 : 75
const upperAndLeftEdge = window.innerWidth >= 900 ? 25 : 20
const bottomAndRightEdge = window.innerWidth >= 900 ? 325 : 245

/* Функция получает элемент - костяшку для передвижения, анимированно передвигая, меняет её позицию */
function doMove(movedTag: HTMLElement, deltaX: number, deltaY: number): void {
  let [_, currentX, currentY] = Object.values(movedTag.dataset);
  let newX, newY
  if (currentX && currentY) {
    newX = Number(currentX) + deltaX;
    newY = Number(currentY) + deltaY;
  };
  movedTag.dataset.x = String(newX);
  movedTag.dataset.y = String(newY);
  anime({
    targets: movedTag,
    duration: 200,
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
  static moveTop(tagsCoords: number[][], clickTagX: number, clickTagY: number): [number, number] | undefined {
    if (clickTagY > upperAndLeftEdge) {
      const findTag = tagsCoords.filter(c => {return (c[0] == clickTagX && c[1] == clickTagY - tagStep)});
      if (!findTag.length) {
        return [0, -tagStep];
      }
    }
  }

  /** Функция выполняет все процедуры как и у функции stepTop но при ходе вправо */
  static moveRight(tagsCoords: number[][], clickTagX: number, clickTagY: number): [number, number] | undefined {
    if (clickTagX < bottomAndRightEdge) {
      const findTag = tagsCoords.filter(c => {return (c[0] == Number(clickTagX) + tagStep && c[1] == Number(clickTagY))});
      if (!findTag.length) {
        return [tagStep, 0];
      }
    }
  }

  /** Функция выполняет все процедуры как и у функции stepTop но при ходе вниз */
  static moveBottom(tagsCoords: number[][], clickTagX: number, clickTagY: number): [number, number] | undefined {
    if (clickTagY < bottomAndRightEdge) {
      const findTag = tagsCoords.filter(c => {return (c[0] == Number(clickTagX) && c[1] == Number(clickTagY) + tagStep)});
      if (!findTag.length) {
        return [0, tagStep];
      }
    }
  }

  /** Функция выполняет все процедуры как и у функции stepTop но при ходе влево */
  static moveLeft(tagsCoords: number[][], clickTagX: number, clickTagY: number): [number, number] | undefined {
    if (clickTagX > upperAndLeftEdge) {
      const findTag = tagsCoords.filter(c => {return (c[0] == Number(clickTagX) - tagStep && c[1] == Number(clickTagY))});
      if (!findTag.length) {
        return [-tagStep, 0];
      }
    }
  }

  /** Функция возвращает список всех функций проверок доступного перемещения выбранной костяшки */
  static getAllMoveCheckers() {
    return [this.moveTop, this.moveRight, this.moveBottom, this.moveLeft]
  }
}

class TagsMixer {
  /** Функция правильно перемешивает костяшки */
  static shuffleArray(): number[] {
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
      let tag: HTMLElement | null = document.getElementById(String(tagValue));
      let [newTagCordX, newTagCordY] = victoryCoords[mixedTagsList.indexOf(tagValue)]
      let deltaX, deltaY
      if (tag instanceof HTMLElement) {
        deltaX = Number(newTagCordX) - Number(tag.dataset.x);
        deltaY = Number(newTagCordY) - Number(tag.dataset.y);
        doMove(tag=tag, deltaX=deltaX, deltaY=deltaY);
      }
    }
  }
}

class Congratulations {
  static firstHappy() {
    anime(
      {
        targets: '.letter',
        opacity: 1,
        rotate: {
          value: 360,
          duration: 2000,
          easing: 'easeInExpo',
        }, 
        delay: anime.stagger(100, {start: 0}), 
        translateX: [-2300, 0],
      }
    );
    setTimeout(() => this.secondHappy(), 5000);
  }

  static secondHappy() {
    let animation = anime.timeline({
      duration: 3000,
      easing: 'easeInOutSine',
      loop: true,
    });

    animation.add(
      {
        targets: '.one',
        keyframes: [
          {translateY: -20},
          {translateY: 0},
        ],
      }
    ).add(
      {
        targets: '.two',
        keyframes: [
          {translateY: -20},
          {translateY: 0},
        ],
      },
      '-=2500',
    ).add(
      {
        targets: '.three',
        keyframes: [
          {translateY: -20},
          {translateY: 0},
        ],
      },
      '-=2500',
    );
  }
}

export {
  MoveChecker,
  TagsMixer,
  Congratulations,
  doMove,
  victoryCoords,
}