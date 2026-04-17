import "regenerator-runtime/runtime";
import "whatwg-fetch";
import _ from "underscore";
import { TextDecoder, TextEncoder } from "util";

const localStorage = {
  getItem(key) {
    return this[key];
  },
  setItem(key, value) {
    this[key] = value;
  },
  removeItem(key, value) {
    delete this[key];
  },
};

global._ = _;
global.__GJS_VERSION__ = "";
const grapesjs = require("grapesjs");
global.grapesjs = grapesjs;
global.$ = grapesjs.$;
global.localStorage = localStorage;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;