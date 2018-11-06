//删除数组指定下标
Array.prototype.removeIndex = function (from, to) {
  let rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

//删除指定元素
Array.prototype.remove = function (item) {
  let index = this.indexOf(item);
  if (index >= 0) {
    this.splice(index, 1);
  }
};

Array.prototype.max = function () {
  return Math.max.apply(null, this);
};

Array.prototype.min = function () {
  return Math.min.apply(null, this);
};

Array.prototype.maxIndex = function () {
  let max = Math.max.apply(null, this);
  return this.indexOf(max);
};

Array.prototype.minIndex = function () {
  let min = Math.min.apply(null, this);
  return this.indexOf(min);
};


//清空数组
Array.prototype.clear = function () {
  if (this.length > 0) {
    this.splice(0, this.length);
  }
};

