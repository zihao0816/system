// 获取box2
var box2 = document.querySelector('#box2');
// 获取_top
var _top = document.querySelector('#_top');
// 获取box2距离页面顶部的间距
var v1 = box2.offsetTop;

// 给窗口window注册onscroll事件
window.onscroll = function () {
  // 特殊情况：若将来给window注册onscroll事件，在去获取页面被卷去间距时。 通过以下两种方式：
  // ① document.documentElement.scrollTop
  // ② document.body.scrollTop
  var v2 = document.documentElement.scrollTop || document.body.scrollTop;
  console.log(v2);

  // 若被卷去的间距大于等于v1 则给box2添加类名active固定，并且给top添加类名active显示
  if (v2 >= v1) {
    box2.className = 'box2 active';
    _top.className = 'top active';
  } else {
    box2.className = 'box2';
    _top.className = 'top';
  }
};

// 给top注册点击事件回到顶部
// _top.onclick = function () {
//   // document.documentElement.scrollTop = 值
//   // document.body.scrollTop = 值
//   document.documentElement.scrollTop = 0;
//   document.body.scrollTop = 0;
// };

var flag;
_top.onclick = function () {
    // document.documentElement.scrollTop = 值
    // document.body.scrollTop = 值
    // document.documentElement.scrollTop = 0;
    // document.body.scrollTop = 0;
  clearInterval(flag);
  flag = setInterval(function () {
      // 获取原有值
    var y = document.documentElement.scrollTop || document.body.scrollTop;
    // 判断是否到达目标
    if (y <= 0) {
      clearInterval(flag);
      return;
    }
    y = y - 50;
    // 重新赋值
    document.documentElement.scrollTop = y;
    document.body.scrollTop = y;
    console.log(y);
    }, 10);
  };
