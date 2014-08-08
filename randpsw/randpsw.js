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

            // 打乱密码算法
            randArr = function (arr) {
                var len = arr.length,
                    i, j,
                    tmp, md5r,
                    key1, key2;
                for (i = 0; i <= len; i++) {
                    for (j = 0; j <= len - 1; j++) {
                        md5r = md5(arr[j] + arr[j + 1]);
                        key1 = parseInt(md5r.substr(0, 4), 16) % len;
                        key2 = parseInt(md5r.substr(4, 8), 16) % len;
                        if (key1 === key2) {
                            continue;
                        }
                        tmp = arr[key1];
                        arr[key1] = arr[key2];
                        arr[key2] = tmp;
                    }
                }
                return arr;
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
        return randArr(randpswArr).join('');
    }

    ns.randpsw = randpsw;
})(this);
