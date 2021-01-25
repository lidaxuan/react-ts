export const handleArray = function<T>(arr = []): Array<any> {
  let newArr = [];
  arr.forEach((ele, index) => {
    ele.key = ele.id || index;
  });
  newArr = [].concat(newArr, arr);
  return newArr;
};