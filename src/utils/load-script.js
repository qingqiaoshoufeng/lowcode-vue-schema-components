export function loadScript(src) {
  return new Promise(function (resolve, reject) {
    let shouldAppend = false;
    let el = document.querySelector('script[src="' + src + '"]');
    if (!el) {
      el = document.createElement("script");
      el.type = 'text/javascript';
      el.async = true;
      el.src = src;
      shouldAppend = true;
    } else if (el.hasAttribute("data-loaded")) {
      resolve(el);
      return;
    } else {
      resolve(el);
      return;
    }

    el.addEventListener("error", reject);
    el.addEventListener("abort", reject);
    el.addEventListener("load", function loadScriptHandler() {
      el.setAttribute("data-loaded", true);
      resolve(el);
    });

    if (shouldAppend) document.head.appendChild(el);
  });
}

export function loadStyle(href) {
  return new Promise(function (resolve, reject) {
    let shouldAppend = false;
    let el = document.querySelector('link[href="' + href + '"]');
    if (!el) {
      el = document.createElement("link");
      el.rel = 'stylesheet';
      el.href = href;
      shouldAppend = true;
    } else if (el.hasAttribute("data-loaded")) {
      resolve(el);
      return;
    } else {
      resolve(el);
      return;
    }

    el.addEventListener("error", reject);
    el.addEventListener("abort", reject);
    el.addEventListener("load", function loadScriptHandler() {
      el.setAttribute("data-loaded", true);
      resolve(el);
    });

    if (shouldAppend) document.head.appendChild(el);
  });
}

export function unloadScript(src) {
  return new Promise(function (resolve, reject) {
    const el = document.querySelector('script[src="' + src + '"]');

    if (!el) {
      reject();
      return;
    }

    document.head.removeChild(el);

    resolve();
  });
}


export function unloadStyle(src) {
  return new Promise(function (resolve, reject) {
    const el = document.querySelector('link[href="' + src + '"]');

    if (!el) {
      reject();
      return;
    }

    document.head.removeChild(el);

    resolve();
  });
}


export function removeDuplicateScriptTags() {
  // 使用Set来存储已经遇到的script src值
  const uniqueScripts = new Set();

  // 遍历所有的script标签
  Array.from(document.querySelectorAll('script')).forEach(script => {
    // 获取当前script标签的src属性
    const src = script.src;

    // 如果Set中已经有这个src，则表示是重复的，可以移除
    if (uniqueScripts.has(src)) {
      script.remove();
    } else {
      // 否则，将src添加到Set中，并继续检查下一个
      uniqueScripts.add(src);
    }
  });
}