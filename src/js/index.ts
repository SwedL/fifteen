import { MoveChecker, TagsMixer, Congratulations, doMove, victoryCoords } from "./common.js";


const button: HTMLElement | null = document.querySelector('.button');
const tags: HTMLElement[] = Array.from(document.querySelectorAll<HTMLElement>('.tag'));
const gameField: HTMLElement | null = document.querySelector('.game-field');
const gameTitle: HTMLElement | null = document.querySelector('.game-title');
const congratulations: HTMLElement | null = document.querySelector('.congratulations');
const tagSize = window.innerWidth >= 900 ? 100 : 75;

button?.addEventListener('click', handleButton);
gameField?.classList.add(window.innerWidth >= 900 ? 'large-game-field' : 'small-game-field');


for (let tag of tags) {
  const class_name = `tag${tag.dataset.value}-${tagSize}`
  // tag.classList.add(`tag${tag.dataset.value}-${tagSize}.png`)
  tag.classList.add(class_name);
  tag.classList.add(`tag${tagSize}`);
  if (tag.dataset.value) {
    let [x, y] = victoryCoords[Number(tag.dataset.value) - 1]
    tag.dataset.x = String(x)
    tag.dataset.y = String(y)
  }
}


/** Функция получает массив элементов костяшек и возвращает список координат костяшек */
function getTagsCoords(array: HTMLElement[]) {
  const output = [];
  for (let i of array) {
      output.push([Number(i.dataset.x), Number(i.dataset.y)]);
  }
  return output;
}

/* Функция сравнивает текущие координаты костяшек с выигрышной комбинацией и возвращает true/false */
function checkVictory(): boolean {
  const tagsCoords = getTagsCoords(Array.from(document.querySelectorAll('.tag')));
  return JSON.stringify(tagsCoords) == JSON.stringify(victoryCoords);
}

/* Функция отрабатывает при нажатии на костяшку и пытается сделать ход выбранной костяшки в свободный слот */
function handleMove(event: Event): null | void {
  // const tags: HTMLElement[] = Array.from(document.querySelectorAll('.tag'));    // получаем элементы всех костяшек document
  const tagsCoords: number[][] = getTagsCoords(tags);   // получаем координаты всех костяшек
  const clickTag = event.target as HTMLElement;         // получаем элемент нажатой костяшки

  if (!(clickTag instanceof HTMLElement) || !clickTag.dataset) {
    return
  };
  let [_, clickTagX, clickTagY] = Object.values(clickTag?.dataset);

  // пытаемся у выбранной костяшки сделать ходы на 4 стороны
  for (let step of MoveChecker.getAllMoveCheckers()) {
    const availableCoordsDelts: [number, number] | undefined = step(tagsCoords, Number(clickTagX), Number(clickTagY));
    if (availableCoordsDelts) {
      doMove(clickTag, ...availableCoordsDelts);
      if (checkVictory()) {
        tags.forEach(t => t.removeEventListener('click', handleMove));
        gameTitle?.classList.add('hide');
        congratulations?.classList.remove('hide');
        if (button) button.innerText = 'Старт игры';
        Congratulations.firstHappy();
      }
      break;
    }
  }
}

/* Функция отрабатывает при нажатии на кнопку <<Старт игры>> и перемешивает костяшки */
function handleButton(event: Event) {
  tags.forEach(t => t.addEventListener('click', handleMove));
  if (button) button.innerText = 'Перемешать';
  if (!congratulations?.classList.contains('hide')) {
      congratulations?.classList.add('hide');
  }
  if (gameTitle?.classList.contains('hide')) {
      gameTitle.classList.remove('hide');
  }
  TagsMixer.doMix();
}
