/**
* This function divides two numbers
* @param {number} a - The numerator
* @param {number} b - The denominator
* @returns {number} The division of the numerator by the denominator
* @throws {DivideByZeroException} When attempt is made to divide by zero
*/
function divideNumbers(a, b){
    if(b == 0) throw "DivideByZeroException";
      return a/b;
  }

const res = divideNumbers(3, 0);
console.log(res);