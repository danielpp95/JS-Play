export const $ = selector => document.querySelector(selector);
export const $$ = selector => document.querySelectorAll(selector);

export const Extends = function (type, name, callback) {
    Object.defineProperty(type, name, {
        value: function() { return callback(this)},
        writable: true,
        configurable: false,
    });
}