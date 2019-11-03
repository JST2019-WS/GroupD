/**
 * Setup testing environment (i.e. JSDOM)
 */
import { JSDOM } from 'jsdom'
import fetch from 'jest-fetch-mock'
import Adapter from "enzyme-adapter-preact-pure";
import {configure} from 'enzyme'

const { window } = new JSDOM('<!doctype html><html><body></body></html>');

global.window = window;
global.document = window.document;
global.navigator = {
    userAgent: 'node.js',
};
global.requestAnimationFrame = function (callback) {
    return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
    clearTimeout(id);
};

// Make window props available in global scope
Object.defineProperties(global, {
    ...Object.getOwnPropertyDescriptors(window),
    ...Object.getOwnPropertyDescriptors(global)
});

// Mock fetch
global.fetch = fetch;

configure({adapter: new Adapter});