
import moment from 'moment'
import { Toast, Dialog } from 'vant';
import sysconfig from '@/settings'
import store from './store'
import { getChain } from '@/utils/loginapi'
var ethers = require('ethers')
var loading = null
var loadingHandl = null
Toast.setDefaultOptions({ className: 'mydialog' })
Dialog.setDefaultOptions({ className: 'mydialog' })

function isMobile() {
    var regex_match = /(nokia|iphone|android|motorola|^mot-|softbank|foma|docomo|kddi|up.browser|up.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte-|longcos|pantech|gionee|^sie-|portalmmm|jigs browser|hiptop|^benq|haier|^lct|operas*mobi|opera*mini|320x320|240x320|176x220)/i;
    var u = navigator.userAgent;
    if (null == u) {
        return true;
    }
    var result = regex_match.exec(u);

    if (null == result) {
        return false
    } else {
        return true
    }
}

function isIOS() {
    var u = navigator.userAgent;
    return /iPhone|iPad|iPod/i.test(u);
}

function showLoadingforever(timeout) {
    timeout = timeout || 0
    showLoading(null, timeout * 1000, true, false)
}

function showLoading(msg, duration, ismask, isClickClose) {
    isClickClose = typeof (isClickClose) == "undefined" ? true : isClickClose
    var opt = {
        duration: typeof (duration) != "undefined" ? duration : 10 * 1000,
        message: msg || "Loading...",
        forbidClick: isClickClose,
        overlay: ismask || false
    }
    if (typeof (msg) == "object") {
        for (var k in msg) {
            opt[k] = msg[k]
        }
    }

    loading = Toast.loading(opt)
}

function hideLoading() {
    if (loadingHandl) {
        clearTimeout(loadingHandl)
    }
    if (loading) {
        loading.clear()
    }

}

function formatDateTimeFromTable(row, column) {
    var date = row[column.property];
    if (date == undefined) {
        return "";
    }

    return moment(date).format("YYYY-MM-DD HH:mm:ss");
}

function formatDateTime(date, format) {
    format = format || 'YYYY-MM-DD HH:mm:ss'
    if (typeof (date) == "string" && date.indexOf("T")) {
        date = new Date(date)
    }
    return moment(date).format(format);
}

function repeat(str, num) {
    var result = ""
    while (num > 0) {
        result += str
        num--
    }
    return result
}
function formatFil(num, len) {
    if (num == null) {
        return "--"
    }
    len = len || 8
    var str = window.BigInt(num).toString()
    var result = ""
    if (str.length < 18) {
        result = "0." + repeat('0', 18 - str.length) + str.substring(0, str.length)
        result = result.substring(0, 2 + len)
    } else {
        var intP = str.substring(0, str.length - 18)
        var pP = str.substring(intP.length, intP.length + len)
        result = (intP.length == 0 ? "0" : intP) + "." + pP
    }
    return result.replace(/((\.0*)|0*)$/g, "")
}
function getAryPage(list, pageIndex, size) {
    if (size <= 0) {
        return []
    }
    var index = pageIndex == 1 ? 0 : (pageIndex - 1) * size
    var endIndex = index + size
    return list.slice(index, endIndex)
}
function toFil(num, len) {
    if (num == null) {
        return "--"
    }
    len = len || 8
    return num.toFixed(len).replace(/((\.0*)|0*)$/g, "")
}

function toFixed(num, len) {
    len = len || 2
    return num.toFixed(len).replace(/((\.0*)|0*)$/g, "")
}

function isEmpty(obj) {
    if (obj == null) { return true }

    if (typeof (obj) == "string" && obj.length <= 0) {
        return true
    }
    return false
}

function getCAddrUrl(addr) {
    return getChain().blockExplorerUrls + "/address/" + addr
}
function getCTxUrl(addr) {
    return getChain().blockExplorerUrls + "/tx/" + addr
}
function getNodeUrl(minerid) {
    return 'https://hyperspace.filfox.info/en/address/' + minerid
}

function isIn(o, ...olist) {
    return olist.indexOf(o) != -1
}
function tgUID(val) {
    if (val) {
        localStorage.setItem("tguid", val)
    } else {
        return localStorage.getItem("tguid") || 0
    }
}

function strFormat() {
    var formatted = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + (i - 1) + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    formatted = formatted.replace(/\{[^\\}]+\}/g, '');
    return formatted;
}
function strBind() {
    var str = arguments[0]

    var keylist = str.match(/\{[^\\}]+\}/g)
    for (var i = 0; i < keylist.length; i++) {
        var key = keylist[i].replace(/\{|\}/g, '')
        var reg = new RegExp("\\{" + key + "\\}", "g")
        var val = ""
        eval('val=typeof(arguments[1].' + key + ')=="undefined"?"":arguments[1].' + key + '.toString()')
        str = str.replace(reg, val)
    }
    return str
}


function getUrlParas(key) {
    var plist = window.location.search.replace(/^\?/, '').split('&')
    var querys = {}
    plist.forEach((kv) => {
        var k = kv.split('=')[0].toLowerCase()
        var v = kv.split('=')[1]
        querys[k] = decodeURI(decodeURI(v))
    })
    return querys[key.toLowerCase()] || ''
}

function errMsg(msg) {
    var opt = {
        message: msg,
        type: 'fail',
        duration: 5 * 1000,
        closeOnClick: true
    }
    if (typeof (msg) == "object") {
        for (var k in msg) {
            opt[k] = msg[k]
        }
    }
    loading = Toast(opt)
}

function showMsg(msg) {
    var opt = {
        message: msg,
        type: 'success',
        duration: 5 * 1000,
        closeOnClick: true
    }
    if (typeof (msg) == "object") {
        for (var k in msg) {
            opt[k] = msg[k]
        }
    }
    loading = Toast(opt)
}

function confirm(msg) {
    hideLoading()
    var opt = {
        'confirmButtonText': '确认',
        'cancelButtonText': '取消'
    }
    if (typeof (msg) == "string") {
        opt.message = msg
    } else {
        for (var k in msg) {
            opt[k] = msg[k]
        }
    }
    return Dialog.confirm(opt)
}

function alert(msg) {
    hideLoading()
    var opt = {
        'confirmButtonText': '确认',
    }
    if (typeof (msg) == "string") {
        opt.message = msg
    } else {
        for (var k in msg) {
            opt[k] = msg[k]
        }
    }
    return Dialog.alert(opt)
}

function getWinW(width) {
    if (window.innerWidth < width) {
        return '90%'
    } else {
        return width
    }
}

function getVideoOpt(src, isAutoPlay, isloop) {
    isAutoPlay = typeof (isAutoPlay) == 'undefined' ? true : isAutoPlay
    isloop = typeof (isloop) == 'undefined' ? true : isloop
    var openboxvideoopt = {
        autoplay: isAutoPlay,
        muted: true,
        loop: isloop,
        preload: "auto",
        fluid: true,
        sources: [{
            type: 'video/mp4',
            src: src
        }],
        controls: false
    }
    return openboxvideoopt
}
function getTGUrl() {
    var url = origin + "/?tid=" + store.state.user.userInfo.wid
    return url
}

function sum(list, key) {
    var total = 0
    for (var i = 0; i < list.length; i++) {
        if (typeof (key) == "string") {
            total += list[i][key]
        } else {
            total += list[i]
        }
    }
    return total
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj))
}
function backWinCloseLoading() {
    document.addEventListener("visibilitychange", function fn(e) {
        var isHidden = document.hidden
        console.log('isHidden', isHidden)
        if (!isHidden) {
            e.target.removeEventListener(e.type, fn)
            hideLoading()
        }
    }, false);
}

function eachAryAsyn(list, callfun) {
    return new Promise((r, e) => {
        var newlist = []
        if (typeof (list.length) == "undefined") {
            for (var k in list) {
                newlist.push({ key: k, val: list[k] })
            }
        } else {
            newlist = list
        }
        var act = (index) => {
            if (index < newlist.length) {
                callfun(newlist[index]).then(() => {
                    act(index + 1)
                })
            } else {
                r()
            }
        }
        act(0)
    })
}

function getDocUrl() {
    return 'https://minefi.gitbook.io/minefi/dapp-shu-zhi-xiang-jie'
}

export default {
    showLoadingforever,
    showLoading,
    hideLoading,
    formatDateTime,
    formatDateTimeFromTable,
    formatFil,
    toFil,
    toFixed,
    isEmpty,
    isIn,
    strFormat,
    strBind,
    getCAddrUrl,
    getNodeUrl,
    getUrlParas,
    showMsg,
    errMsg,
    getWinW,
    getVideoOpt,
    getTGUrl,
    isMobile,
    isIOS,
    confirm,
    alert,
    getCTxUrl,
    tgUID,
    sum,
    clone,
    getAryPage,
    backWinCloseLoading,
    eachAryAsyn,
    getDocUrl
}