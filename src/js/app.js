let num = 3;
const needTag = document.querySelector(`.tag${num}`);

const tags = document.querySelectorAll('.tag');
tags.forEach(t => t.addEventListener('click', handleMove));


function getCoordTags(array) {
    const output = [];
    for (i of array) {
        output.push([i.dataset.x, i.dataset.y]);
    }
    return output;
}


function stepTop(coords, curX, curY) {
    if (curY > 25) {
        const findTag = coords.filter(c => {return (c[0] == Number(curX) && c[1] == Number(curY) - 100)});
        return findTag.length ? false : true
    }
    return false;
}
function stepRight(coords, curX, curY) {
    if (curX < 325) {
        const findTag = coords.filter(c => {return (c[0] == Number(curX) + 100 && c[1] == Number(curY))});
        return findTag.length ? false : true
    }
    return false;
}
function stepBottom(coords, curX, curY) {
    if (curY < 325) {
        const findTag = coords.filter(c => {return (c[0] == Number(curX) && c[1] == Number(curY) + 100)});
        return findTag.length ? false : true
    }
    return false
}
function stepLeft(coords, curX, curY) {
    if (curX > 25) {
        const findTag = coords.filter(c => {return (c[0] == Number(curX) - 100 && c[1] == Number(curY))});
        return findTag.length ? false : true
    }
    return false;
}

function handleMove(event) {
    const tags = document.querySelectorAll('.tag');
    const tagsCoords = getCoordTags(tags);
    let [value, currentTagX, currentTagY] = Object.values(event.srcElement.dataset);
    for (step of [stepTop, stepRight, stepBottom, stepLeft]) {
        const flag = step(tagsCoords, currentTagX, currentTagY);
        console.log(flag, step.name);
        if (flag) {
            break;
        }
    }
}
