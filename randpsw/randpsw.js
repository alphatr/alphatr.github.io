/* global BigInteger, md5 */
(function (ns) {
    'use strict';

    /**
     * 生成随机密码
     * @param  {[type]} value 初始密码值
     * @param  {[type]} uri   密码使用的网页
     * @param  {[type]} salt  salt值
     */
    function randpsw(value, domain, salt) {
        salt = salt || '';
        value = value.toString();

        var hash = new BigInteger('0x' + md5(value + domain + salt)),
            pswArr = value.match(/./g) || [],
            i = 0, length = pswArr.length,
            randpswArr = new Array(length),

            // 替换密码算法
            replacePswChar = function (index, type) {
                var charList = [
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                    '0123456789',
                    '~!@#$%^&*'

                ],
                length = charList[type].length,
                aryNum = hash.toString(length);

                index = index % aryNum.length;
                return charList[type].charAt(parseInt(aryNum.charAt(index), length));
            },
            single;

        // 循环替换
        for (i = 0; i < length; i++) {
            if (pswArr[i].search(/[A-Z]/) === 0) {
                single = replacePswChar(i, 0).toUpperCase();
            } else if (pswArr[i].search(/[a-z]/) === 0) {
                single = replacePswChar(i, 0).toLowerCase();
            } else if (pswArr[i].search(/[0-9]/) === 0) {
                single = replacePswChar(i, 1);
            } else {
                single = replacePswChar(i, 2);
            }

            randpswArr[i] = single;
        }

        // 打乱
        for (i = 0; i < length; i++) {
            randpswArr = randpswArr.sort(function (a, b) {
                a = parseInt(md5(a + hash.toString(16)).substr(0, 8), 16);
                b = parseInt(md5(b + hash.toString(16)).substr(0, 8), 16);
                return a - b;
            });
        }

        return randpswArr.join('');
    }

    ns.randpsw = randpsw;
})(this);
