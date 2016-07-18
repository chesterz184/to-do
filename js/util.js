// 判断arr是否为一个数组，返回一个bool值
function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}

// 判断fn是否为一个函数，返回一个bool值
function isFunction(fn) {
    return Object.prototype.toString.call(fn) === '[object Function]';
    //return (typeof(fn) === 'function');
}

// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function cloneObject(src, newobj) {
    newobj = newobj || {};
    for (var i in src) {
        if (typeof src[i] === 'object') {
            newobj[i] = (src[i].constructor === Array) ? [] : {};
            cloneObject(src[i], newobj[i]);
        } else {
            newobj[i] = src[i];
        }
    }
    return newobj;
}

// 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
function uniqArray(arr) {
    var result = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        if (!isInArray(result, arr[i])) {
            result.push(arr[i]);
        }
    }
    return result;
}

function isInArray(arr, e) {
    for (var i in arr) {
        if (arr[i] === e)
            return true;
    }
    return false;
}

// 对字符串头尾进行空格字符的去除、包括全角半角空格、Tab等，返回一个字符串
// 尝试使用一行简洁的正则表达式完成该题目
function trim(str) {
    // your implement
    var exp = new RegExp("(^[\\s\\t\\u3000]+)|([\\s\\t\\u3000]+\$)", "g");
    return String(str).replace(exp, '');
}

// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function each(arr, fn) {
    // your implement
    for (var i = 0, len = arr.length; i < len; i++) {
        fn(arr[i], i);
    }
}

// 获取一个对象里面第一层元素的数量，返回一个整数
function getObjectLength(obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            size++;
        }
    }
    return size;
}

// 判断是否为邮箱地址
function isEmail(emailStr) {
    return /^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/.test(emailStr);
}

// 判断是否为手机号
function isMobilePhone(phone) {
    return /^1\d{10}$/.test(phone);
}


// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName) {
    var blank = (element.className !== '') ? ' ' : ''; //若element无类，则不加空格
    if (!hasClass(element, newClassName) && typeof newClassName === 'string') {
        element.className += (blank + newClassName);
    }
}

function hasClass(element, className) {
    var classNames = element.className;
    if (!classNames) {
        return false;
    }
    classNames = classNames.split(/\s+/);
    for (var i = 0, len = classNames.length; i < len; i++) {
        if (classNames[i] === className) {
            return true;
        }
    }
    return false;
}


// 移除element中的样式oldClassName
function removeClass(element, oldClassName) {
    if (hasClass(element, oldClassName) && typeof oldClassName === 'string') {
        var temp = element.className + ' ';
        oldClassName += ' ';
        temp = temp.replace(oldClassName, '');
        element.className = temp.replace(/(^\s+)|(\s+$)/g, '');
    }
}

// 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
function isSiblingNode(element, siblingNode) {
    return element.parentNode === siblingNode.parentNode;
}

// 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
function getPosition(element) {
    var x = 0;
    var y = 0;
    var current = element;
    var pre = null;

    while (current !== null) { //遍历到根节点
        x += current.offsetLeft; //相对于父节点的x, y值求和
        y += current.offsetTop;
        pre = current;
        current = current.offsetParent;
    }
    return {
        x: x,
        y: y
    };
}

function $(selector) {
    var idReg = /^#([\w_\-]+)/;
    var classReg = /^\.([\w_\-]+)/;
    var tagReg = /^\w+$/i;
    // [data-log]
    // [data-log="test"]
    // [data-log=test]
    // [data-log='test']
    var attrReg = /(\w+)?\[([^=\]]+)(?:=(["'])?([^\]"']+)\3?)?\]/;

    // 不考虑'>' 、`~`等嵌套关系
    // 父子选择器之间用空格相隔
    var context = document;

    function blank() {}

    function direct(part, actions) {
        actions = actions || {
            id: blank,
            className: blank,
            tag: blank,
            attribute: blank
        };
        var fn;
        var params = [].slice.call(arguments, 2);
        // id
        if (result = part.match(idReg)) {
            fn = 'id';
            params.push(result[1]);
        }
        // class
        else if (result = part.match(classReg)) {
            fn = 'className';
            params.push(result[1]);
        }
        // tag
        else if (result = part.match(tagReg)) {
            fn = 'tag';
            params.push(result[0]);
        }
        // attribute
        else if (result = part.match(attrReg)) {
            fn = 'attribute';
            var tag = result[1];
            var key = result[2];
            var value = result[4];
            params.push(tag, key, value);
        }
        return actions[fn].apply(null, params);
    }

    function find(parts, context) {
        var part = parts.pop(); //parts中最后一个元素

        var actions = {
            id: function (id) {
                return [
                    document.getElementById(id)
                ];
            },
            className: function (className) {
                var result = [];
                if (context.getElementsByClassName) { //IE 9.0+
                    result = context.getElementsByClassName(className)
                } else {
                    var temp = context.getElementsByTagName('*');
                    for (var i = 0, len = temp.length; i < len; i++) {
                        var node = temp[i];
                        if (hasClass(node, className)) {
                            result.push(node);
                        }
                    }
                }
                return result;
            },
            tag: function (tag) {
                return context.getElementsByTagName(tag);
            },
            attribute: function (tag, key, value) {
                var result = [];
                var temp = context.getElementsByTagName(tag || '*');

                for (var i = 0, len = temp.length; i < len; i++) {
                    var node = temp[i];
                    if (value) {
                        var v = node.getAttribute(key);
                        (v === value) && result.push(node);
                    } else if (node.hasAttribute(key)) {
                        result.push(node);
                    }
                }
                return result;
            }
        };

        var ret = direct(part, actions);

        // to array
        ret = [].slice.call(ret);

        return parts[0] && ret[0] ? filterParents(parts, ret) : ret;
    }

    function filterParents(parts, ret) {
        var parentPart = parts.pop();
        var result = [];

        for (var i = 0, len = ret.length; i < len; i++) {
            var node = ret[i];
            var p = node;

            while (p = p.parentNode) {
                var actions = {
                    id: function (el, id) {
                        return (el.id === id);
                    },
                    className: function (el, className) {
                        return hasClass(el, className);
                    },
                    tag: function (el, tag) {
                        return (el.tagName.toLowerCase() === tag);
                    },
                    attribute: function (el, tag, key, value) {
                        var valid = true;
                        if (tag) {
                            valid = actions.tag(el, tag);
                        }
                        valid = valid && el.hasAttribute(key);
                        if (value) {
                            valid = valid && (value === el.getAttribute(key))
                        }
                        return valid;
                    }
                };
                var matches = direct(parentPart, actions, p);

                if (matches) {
                    break;
                }
            }

            if (matches) {
                result.push(node);
            }
        }

        return parts[0] && result[0] ? filterParents(parts, result) : result;
    }

    var result = find(selector.split(/\s+/), context);

    return result;
}

$.event = {
    listeners: []
};

// 给一个element绑定一个针对event事件的响应，响应函数为listener
$.event.addEvent = function (element, event, listener) {
    event = event.replace(/^on/i, '').toLowerCase();
    var lis = $.event.listeners;

    var realListener = function (e) {
        if (typeof listener === 'function') {
            listener.call(element, e);
        }
    };

    if (element.addEventListener) {
        element.addEventListener(event, realListener, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event, realListener);
    }

    lis[lis.length] = [element, event, listener, realListener];

    return element;
}

$.event.removeEvent = function (element, type, listener) {
    type = type.replace(/^on/i, '').toLowerCase();

    var lis = $.event.listeners;
    var len = lis.length;

    while (len--) {
        var item = lis[len];
        var isRemoveAll = !listener;

        // listener存在时，移除element的所有以listener监听的type类型事件
        // listener不存在时，移除element的所有type类型事件
        if (item[1] === type &&
            item[0] === element &&
            (isRemoveAll || item[2] === listener)) {
            var realListener = item[3];

            if (element.removeEventListener) {
                element.removeEventListener(type, realListener, false);
            } else if (element.detachEvent) {
                element.detachEvent('on' + type, realListener);
            }

            lis.splice(len, 1);
        }
    }

    return element;
};

// 实现对click事件的绑定
function addClickEvent(element, listener) {
    return $.event.addEvent(element, 'click', listener);
}

// 实现对于按Enter键时的事件绑定
function addEnterEvent(element, listener) {
    return $.event.addEvent(element, 'keypress', function (e) {
        var event = e || window.event;
        var keyCode = event.which || event.keyCode;

        if (keyCode === 13) {
            listener.call(element, event);
        }
    });
}

// 事件代理
$.event.delegateEvent = function (element, tag, eventName, listener) {
    $.event.addEvent(element, eventName, function (e) {
        var event = e || window.event;
        var target = event.target || event.srcElement;

        if (target && target.tagName === tag.toUpperCase()) {
            listener.call(target, event);
        }
    });
}

$.on = function (selector, event, listener) {
    return $.event.addEvent($(selector), event, listener);
};

$.click = function (selector, listener) {
    return $.event.addEvent($(selector), 'click', listener);
};

$.un = function (selector, event, listener) {
    return $.event.removeEvent($(selector), 'click', listener);
};

$.delegate = function (selector, tag, event, listener) {
    return $.event.delegateEvent($(selector), tag, event, listener);
};

function ajax(url, options) {
    var options = options || {};
    var data = stringifyData(options.data || {});
    var type = (options.type || 'GET').toUpperCase();
    var xhr;
    var eventHandlers = {
        onsuccess: options.onsuccess,
        onfail: options.onfail
    };

    try {
        if (type === 'GET' && data) {
            url += (url.indexOf('?') >= 0 ? '&' : '?') + data;
            data = null;
        }

        xhr = getXHR();
        xhr.open(type, url, true);
        xhr.onreadystatechange = stateChangeHandler;

        // 在open之后再进行http请求头设定
        if (type === 'POST') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(data);
    } catch (ex) {
        fire('fail');
    }

    return xhr;

    function stringifyData(data) {
        // 此方法只是简单示意性实现，并未考虑数组等情况。
        var param = [];
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                param.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
            }
        }
        return param.join('&');
    }

    function stateChangeHandler() {
        var stat;
        if (xhr.readyState === 4) {
            try {
                stat = xhr.status;
            } catch (ex) {
                // 在请求时，如果网络中断，Firefox会无法取得status
                fire('fail');
                return;
            }

            fire(stat);

            // http://www.never-online.net/blog/article.asp?id=261
            // case 12002: // Server timeout
            // case 12029: // dropped connections
            // case 12030: // dropped connections
            // case 12031: // dropped connections
            // case 12152: // closed by server
            // case 13030: // status and statusText are unavailable

            // IE error sometimes returns 1223 when it
            // should be 204, so treat it as success
            if ((stat >= 200 && stat < 300) ||
                stat === 304 ||
                stat === 1223) {
                fire('success');
            } else {
                fire('fail');
            }

            /*
             * NOTE: Testing discovered that for some bizarre reason, on Mozilla, the
             * JavaScript <code>XmlHttpRequest.onreadystatechange</code> handler
             * function maybe still be called after it is deleted. The theory is that the
             * callback is cached somewhere. Setting it to null or an empty function does
             * seem to work properly, though.
             *
             * On IE, there are two problems: Setting onreadystatechange to null (as
             * opposed to an empty function) sometimes throws an exception. With
             * particular (rare) versions of jscript.dll, setting onreadystatechange from
             * within onreadystatechange causes a crash. Setting it from within a timeout
             * fixes this bug (see issue 1610).
             *
             * End result: *always* set onreadystatechange to an empty function (never to
             * null). Never set onreadystatechange from within onreadystatechange (always
             * in a setTimeout()).
             */
            window.setTimeout(
                function () {
                    xhr.onreadystatechange = new Function();
                    xhr = null;
                },
                0
            );
        }
    }

    function getXHR() {
        if (window.ActiveXObject) {
            try {
                return new ActiveXObject('Msxml2.XMLHTTP');
            } catch (e) {
                try {
                    return new ActiveXObject('Microsoft.XMLHTTP');
                } catch (e) {}
            }
        }
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
    }

    function fire(type) {
        type = 'on' + type;
        var handler = eventHandlers[type];

        if (!handler) {
            return;
        }
        if (type !== 'onsuccess') {
            handler(xhr);
        } else {
            //处理获取xhr.responseText导致出错的情况,比如请求图片地址.
            try {
                xhr.responseText;
            } catch (error) {
                return handler(xhr);
            }
            handler(xhr, xhr.responseText);
        }
    }
}