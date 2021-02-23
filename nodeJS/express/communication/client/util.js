var utils = {
  getParam: function (url, name, defaultValue) {
    if (typeof (url) == 'undefined' || !url) {
      url = window.location.search.substr(1);
    }
    var i = url.indexOf('#');
    if (i != -1) {
      url = url.substring(0, i);
    }
    i = url.indexOf('?');
    if (i != -1) {
      url = url.substring(i + 1);
    }
    url = '&' + url + '&';
    var key = '&' + name + '=';
    var i = url.indexOf(key);
    if (i != -1) {
      var j = url.indexOf('&', i + key.length);
      if (j != -1) {
        return url.substring(i + key.length, j);
      }
    }
    return defaultValue;
  },
  getParent: function (dom, num) {
    var parent = dom;
    for (var i = 0; i < num && parent; i++) {
      parent = parent.parentElement
    }
    return parent;
  },
  getSingleton: function () {
    var instance;
    return function () {
      if (!instance) {
        instance = this;
      }
      return instance;
    }
  },
  storage: {
    getUser: function (username) {
      var userInfoString = '',
        storageObj = null,
        userArray = [];
      if (username && username !== '') {
        userInfoString = window.localStorage.getItem('USER-' + username);
        return JSON.parse(userInfoString)
      } else {
        storageObj = window.localStorage;
        for (var item in storageObj) {
          if (storageObj.hasOwnProperty(item) && item.indexOf('USER-') === 0) {
            userArray.push(JSON.parse(window.localStorage.getItem(item)))
          }
        }
        return userArray
      }
    },
    addUser: function (username, infoObj) {
      window.localStorage.setItem('USER-' + username, JSON.stringify(infoObj))
    },
    getItem: function (item) {
      return window.localStorage.getItem(item)
    },
    setItem: function (item, value) {
      window.localStorage.setItem(item, value);
    }
  },
  time: {
    getCurrentTimestamp: function () {
      return new Date().getTime();
    },
    getTimeByStamp: function (stamp) {
      var date = new Date();
      date.setTime(stamp);
      return this.getTimeByDate(date);
    },
    getTimeByDate: function (date) {
      date || (date = new Date())
      var year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        time = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) +
        " " + (hour < 10 ? '0' + hour : hour) + ":" + (minute < 10 ? '0' + minute : minute) +
        ":" + (second < 10 ? '0' + second : second);
      return time;
    },
    getYMDTimeByDate: function (date) {
      date || (date = new Date())
      var year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        // hour = date.getHours(),
        // minute = date.getMinutes(),
        // second = date.getSeconds(),
        time = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
      return time;
    }
  }
}

const asyncAxios = {
  async get(url, data) {
    try {
      let res = await axios.get(url, {
        params: data
      })
      res = res.data
      return new Promise((resolve) => {
        if (res.result) {
          resolve(res)
        } else {
          resolve(res)
        }
      })
    } catch (err) {
      // alert('服务器出错')
      console.log(err)
    }
  },
  async post(url, data) {
    try {
      let res = await axios.post(url, data)
      res = res.data
      return new Promise((resolve, reject) => {
        if (res.result) {
          resolve(res)
        } else {
          resolve(res)
        }
      })
    } catch (err) {
      // return (e.message)
      // alert('服务器出错')
      console.log(err)
    }
  },
}
// 获取指定类第一个元素
function getDom(className) {
  return document.getElementsByClassName(className)[0];
}
// 显示元素
function setDisplayBlock(dom) {
  dom.style.display = "block";
}
// 隐藏元素
function setDisplayNone(dom) {
  dom.style.display = "none";
}
// 增加active类
function addActive(dom) {
  dom.classList.add("active");
}
// 去除active类
function removeActive(dom) {
  dom.classList.remove("active");
}
// 验证手机号
function checkPhone(phone) {
  return /^1[3456789]\d{9}$/.test(phone);
}
// 验证邮箱号
function checkMail(phone) {
  return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(phone);
}
// 倒数
function countDown(dom, second) {
  var text = dom.innerText;
  var seconds = setInterval(() => {
    dom.innerText = second;
    if (second-- <= 0) {
      dom.innerText = text;
      clearInterval(seconds);
    }
  }, 1000);
}
// toast提示
function toast(text, milliseconds) {
  var el = document.createElement("div");
  el.setAttribute("id", "toast");
  el.innerHTML = text;
  document.body.appendChild(el);
  el.classList.add("fadeIn");
  setTimeout(function () {
    el.classList.remove("fadeIn");
    el.classList.add("fadeOut");
    el.addEventListener("animationend", function () {
      el.classList.add("hide");
      el.parentElement.removeChild(el);
    });
  }, milliseconds);
}