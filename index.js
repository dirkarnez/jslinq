class MyArray extends Array {
  singleOrDefault = callback => {
    var foundFirst = this.findIndex(callback);
    if (foundFirst > -1) {
      var foundSecond = 
      this
      .slice(foundFirst + 1)
      .findIndex(callback);
      if (foundSecond > -1) {
        return undefined;
      } else {
        return this[foundFirst];
      }
    }
    return undefined;
  }
}

console.log(
  MyArray
  .of(1, 2, 14, 15)
  .singleOrDefault((element) => element > 13)
);
