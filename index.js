class MyArray extends Array {
  singleOrDefault = callback => {
    var foundFirst = this.findIndex(callback);
    if (foundFirst > -1) {
      var foundSecond = 
      this
      .slice(foundFirst + 1)
      .findIndex(callback);
      
      return foundSecond > -1 ? undefined : this[foundFirst];
    }
    return undefined;
  }
}

console.log(
  MyArray
  .of(1, 2, 14, 15)
  .singleOrDefault((element) => element > 13)
);


function wrapped(arr) {
  return {
    _data: arr,
    get data() { 
      return this._data;
    },
    set data(newArr) {
      this._data = newArr;
    }
  };
}

const warr = wrapped([1, 2, 14, 15]);
warr.data = [1, 3];
