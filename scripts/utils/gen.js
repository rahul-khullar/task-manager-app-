// function initCount() {
//   let counter = 0;
//   return function () {
//     counter++;
//     return counter;
//   };
// }

function* autoInc() {
  let counter = 0;
  while (true) {
    counter++;
    yield counter;
  }
}


