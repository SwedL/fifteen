declare const anime: any;

const largeVictoryCoords = [
  [25, 25], [125, 25], [225, 25], [325, 25],
  [25, 125], [125, 125], [225, 125], [325, 125],
  [25, 225], [125, 225], [225, 225], [325, 225],
  [25, 325], [125, 325], [225, 325]
];

const smallVictoryCoords = [
  [20, 20], [95, 20], [170, 20], [245, 20],
  [20, 95], [95, 95], [170, 95], [245, 95],
  [20, 170], [95, 170], [170, 170], [245, 170],
  [20, 245], [95, 245], [170, 245]
];

/* координаты дырки на поле */
const hole: Record<string, number> = {
    XCoord: window.innerWidth >= 900 ? 325 : 245,
    YCoord: window.innerWidth >= 900 ? 325 : 245,
  }
export const victoryCoords = window.innerWidth >= 900 ? largeVictoryCoords : smallVictoryCoords;
const tagStep = window.innerWidth >= 900 ? 100 : 75;

/* Функция получает элемент - костяшку для передвижения, анимированно передвигая, меняет её позицию */
function doMove(movedTag: HTMLElement, deltaX: number, deltaY: number): void {
  let [_, currentX, currentY] = Object.values(movedTag.dataset);
  let newX, newY;
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

function getClickedTagData(event: MouseEvent | TouchEvent): getClickedTagDataReturnRecord {
  const clickTag = event.target as HTMLElement;           // получаем элемент нажатой костяшки
  let [_, clickTagXCoord, clickTagYCoord] = Object.values(clickTag?.dataset);
  return {
    clickTag: clickTag,
    clickTagXCoord: Number(clickTagXCoord),
    clickTagYCoord: Number(clickTagYCoord),
  }
}


export class TagsMover {
  tryMoveTagUp(event: MouseEvent | TouchEvent): void {
    const { clickTag, clickTagXCoord, clickTagYCoord } = getClickedTagData(event);
    if (clickTagXCoord === hole.XCoord && clickTagYCoord - tagStep === hole.YCoord) {
      hole.YCoord = clickTagYCoord;
      doMove(clickTag, 0, -tagStep);
    }
  }

  tryMoveTagDown(event: MouseEvent | TouchEvent): void {
    const { clickTag, clickTagXCoord, clickTagYCoord } = getClickedTagData(event);
    if (clickTagXCoord === hole.XCoord && clickTagYCoord + tagStep === hole.YCoord) {
      hole.YCoord = clickTagYCoord;
      doMove(clickTag, 0, tagStep);
    }
  }

  tryMoveTagLeft(event: MouseEvent | TouchEvent): void {
    const { clickTag, clickTagXCoord, clickTagYCoord } = getClickedTagData(event);
    if (clickTagXCoord - tagStep === hole.XCoord && clickTagYCoord === hole.YCoord) {
      hole.XCoord = clickTagXCoord;
      doMove(clickTag, -tagStep, 0);
    }
  }

  tryMoveTagRight(event: MouseEvent | TouchEvent): void {
    const { clickTag, clickTagXCoord, clickTagYCoord } = getClickedTagData(event);
    if (clickTagXCoord + tagStep === hole.XCoord && clickTagYCoord === hole.YCoord) {
      hole.XCoord = clickTagXCoord;
      doMove(clickTag, tagStep, 0);
    }
  }
}

export class TagsMixer {
  /** Функция правильно перемешивает костяшки */
  static shuffleArray(): number[] {
    hole.XCoord = window.innerWidth >= 900 ? 325 : 245;
    hole.YCoord = window.innerWidth >= 900 ? 325 : 245;

    while (true) {
      let array = Array.from({ length: 15 }, (_, i) => i + 1);
      let checkSum = 0;

      // Перемешивание костяшек
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
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
  static doMix(): void {
    let mixedTagsList = this.shuffleArray();

    for (let tagValue of mixedTagsList) {
      let tag: HTMLElement | null = document.getElementById(String(tagValue));
      let [newTagCordX, newTagCordY] = victoryCoords[mixedTagsList.indexOf(tagValue)];
      let deltaX, deltaY;

      if (tag instanceof HTMLElement) {
        deltaX = Number(newTagCordX) - Number(tag.dataset.x);
        deltaY = Number(newTagCordY) - Number(tag.dataset.y);
        doMove(tag=tag, deltaX=deltaX, deltaY=deltaY);
      }
    }
  }
}

export class Congratulations {
  static appearanceLetters() {
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
    setTimeout(() => this.jumpingLetters(), 5000);
  }

  static jumpingLetters() {
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

type getClickedTagDataReturnRecord = {
  clickTag: HTMLElement,
  clickTagXCoord: number,
  clickTagYCoord: number,
}