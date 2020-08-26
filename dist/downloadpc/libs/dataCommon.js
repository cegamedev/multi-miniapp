//rem适配不同宽度屏幕
(function (doc, win) {
    var docEl = doc.documentElement,
        // resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if (clientWidth >= 1440) {
                clientWidth = 1440;
            }
            if (clientWidth <= 220) {
                clientWidth = 220;
            }
            docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
        };
    // if (!doc.addEventListener) return;
    // win.addEventListener(resizeEvt, recalc, false);
    // doc.addEventListener('DOMContentLoaded', recalc, false);
    recalc();
})(document, window);

//格式化日期为0000-00-00
function FORMAT_DATE(val) {
    var arr = val.split('-');
    var year = arr[0];
    var month = arr[1];
    var day = arr[2];
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    return year + '-' + month + '-' + day;
}

