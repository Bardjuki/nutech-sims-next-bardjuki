export const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
// helperUtils.js
const helperUtils = {
  // 1. map
  map: (arr, callback) => arr.map(callback),

  // 2. flatMap
  flatMap: (arr, callback) => arr.flatMap(callback),

  // 3. filter
  filter: (arr, callback) => arr.filter(callback),

  // 4. reduce
  reduce: (arr, callback, initialValue) => arr.reduce(callback, initialValue),

  // 5. forEach
  forEach: (arr, callback) => arr.forEach(callback),

  // 6. find
  find: (arr, callback) => arr.find(callback),

  // 7. findIndex
  findIndex: (arr, callback) => arr.findIndex(callback),

  // 8. some
  some: (arr, callback) => arr.some(callback),

  // 9. every
  every: (arr, callback) => arr.every(callback),

  // 10. sort
  sort: (arr, compareFn) => [...arr].sort(compareFn),

  // 11. slice
  slice: (arr, start, end) => arr.slice(start, end),

  // 12. concat
  concat: (...arrays) => [].concat(...arrays),

  // 13. includes
  includes: (arr, value) => arr.includes(value),
};

// =====================
// Example usage & console output
// =====================
const numbers = [1, 2, 3, 4];

console.log('map:', helperUtils.map(numbers, n => n * 2)); 
// [2, 4, 6, 8]

console.log('flatMap:', helperUtils.flatMap(numbers, n => [n, n*2]));
// [1,2,2,4,3,6,4,8]

console.log('filter:', helperUtils.filter(numbers, n => n % 2 === 0));
// [2, 4]

console.log('reduce (sum):', helperUtils.reduce(numbers, (sum, n) => sum + n, 0));
// 10

console.log('forEach:');
helperUtils.forEach(numbers, n => console.log(n * 2));
// 2, 4, 6, 8

console.log('find (first even):', helperUtils.find(numbers, n => n % 2 === 0));
// 2

console.log('findIndex (first > 2):', helperUtils.findIndex(numbers, n => n > 2));
// 2

console.log('some (>3):', helperUtils.some(numbers, n => n > 3));
// true

console.log('every (>0):', helperUtils.every(numbers, n => n > 0));
// true

console.log('sort ascending:', helperUtils.sort([4,2,3,1], (a,b) => a-b));
// [1, 2, 3, 4]

console.log('slice (1,3):', helperUtils.slice(numbers, 1, 3));
// [2, 3]

console.log('concat:', helperUtils.concat(numbers, [5,6], [7]));
// [1,2,3,4,5,6,7]

console.log('includes 3:', helperUtils.includes(numbers, 3));
// true
console.log('includes 10:', helperUtils.includes(numbers, 10));
// false

export default helperUtils;
