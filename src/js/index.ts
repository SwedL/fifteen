import { TagsMover, TagsMixer, Congratulations, victoryCoords } from "./common.js";


const startGameButtonHTMLElement: HTMLElement | null = document.querySelector('.button');
const tagsHTMLElements: HTMLElement[] = Array.from(document.querySelectorAll<HTMLElement>('.tag'));
const gameFieldHTMLElement: HTMLElement | null = document.querySelector('.game-field');
const gameTitleHTMLElement: HTMLElement | null = document.querySelector('.game-title');
const congratulationsHTMLElement: HTMLElement | null = document.querySelector('.congratulations');
const tagSize = window.innerWidth >= 900 ? 100 : 75;
const tagsMover = new TagsMover();
let initialClickX = 0;
let initialClickY = 0;
let hasMoved = false;

gameFieldHTMLElement?.classList.add(window.innerWidth >= 900 ? 'large-game-field' : 'small-game-field');
startGameButtonHTMLElement?.addEventListener('mousedown', () => handlerStartGameButton('mousedown', 'mousemove'));
startGameButtonHTMLElement?.addEventListener(
  'touchstart',
  (e) => {
    handlerStartGameButton('touchstart', 'touchmove');
    e.preventDefault();
  },
  { passive: false },
);

// динамически задаём стили и расположение для каждой костяшки
for (let tag of tagsHTMLElements) {
  tag.classList.add(`tag${tagSize}`);
  tag.style.backgroundImage = `url(./img/tags-${tagSize}/tag${tag.dataset.value}-${tagSize}.png)`;
  let [x, y] = victoryCoords[Number(tag.dataset.value) - 1];
  tag.dataset.x = String(x);
  tag.dataset.y = String(y);
  tag.style.left = `${x}px`;
  tag.style.top = `${y}px`;
}

// обработчик косания костяшки мышью или пальцем (стилусом)
function mouseOrTouchClickHandler(event: MouseEvent | TouchEvent): void {
  initialClickX = (event instanceof MouseEvent) ? event.clientX : event.touches[0].clientX;
  initialClickY = (event instanceof MouseEvent) ? event.clientY : event.touches[0].clientY;
  hasMoved = false;
}

// обработчик передвижения мыши или пальца (стилуса)
function mouseOrTouchMoveHandler(event: MouseEvent | TouchEvent): void {
  if (hasMoved) return;
  
  const diffX = initialClickX - Number((event instanceof MouseEvent) ? event.clientX : event.touches[0].clientX);
  const diffY = initialClickY - Number((event instanceof MouseEvent) ? event.clientY : event.touches[0].clientY);
  let direction: Direction;

  if (Math.abs(diffX) >= 4 || Math.abs(diffY) >= 4) {
    hasMoved = true;
    if (Math.abs(diffX) < Math.abs(diffY)) {
      direction = diffY > 0 ? 'tryMoveTagUp' : 'tryMoveTagDown';
    } else {
      direction = diffX > 0 ? 'tryMoveTagLeft' : 'tryMoveTagRight';
    }
    tagsMover[direction](event);
    checkVictory();
  }
}

/* Функция обработчик нажатия кнопки <<Старт игры>> */
function handlerStartGameButton(clickEventType: 'mousedown' | 'touchstart', moveEventType: 'mousemove' | 'touchmove') {
  tagsHTMLElements.forEach(tag => {
    tag.addEventListener(`${clickEventType}`, mouseOrTouchClickHandler);
    tag.addEventListener(`${moveEventType}`, mouseOrTouchMoveHandler);
  });
  changeHTMLElementInnerText(startGameButtonHTMLElement, 'Перемешать');
  returnInitialGameTitle();
  TagsMixer.doMix();
}

// функция возвращает начальное изображение заголовка игры
function returnInitialGameTitle() {
  if (!congratulationsHTMLElement?.classList.contains('hide')) {
      congratulationsHTMLElement?.classList.add('hide');
  }
  if (gameTitleHTMLElement?.classList.contains('hide')) {
      gameTitleHTMLElement.classList.remove('hide');
  }
}

function changeHTMLElementInnerText(htmlElement: HTMLElement | null, innerText: string) {
  if (htmlElement) htmlElement.innerText = innerText;
}

/* Функция сравнивает текущие координаты костяшек с выигрышной комбинацией, 
   если они равны - запускает поздравления */
function checkVictory(): void {
  const array: HTMLElement[] = Array.from(document.querySelectorAll('.tag'));
  const tagsCoordsArray: [number, number][] = array.map(tag => [Number(tag.dataset.x), Number(tag.dataset.y)]);

  if (JSON.stringify(tagsCoordsArray) == JSON.stringify(victoryCoords)) {
    congratulationsOnVictory();
  }
}

/* функция прячет начальное изображение заголовка игры,
   изменяет содержимое кнопки startGameButtonHTMLElement,
   запускает анимированное поздравление */
function congratulationsOnVictory() {
  gameTitleHTMLElement?.classList.add('hide');
  congratulationsHTMLElement?.classList.remove('hide');
  changeHTMLElementInnerText(startGameButtonHTMLElement, 'Старт игры');
  Congratulations.appearanceLetters();
}


type Direction = 'tryMoveTagUp' | 'tryMoveTagDown' | 'tryMoveTagLeft' | 'tryMoveTagRight';