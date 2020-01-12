/**
 * Setup testing environment (i.e. JSDOM)
 */
import { JSDOM } from 'jsdom'
import fetch from 'jest-fetch-mock'
import Adapter from "enzyme-adapter-preact-pure";
import {configure} from 'enzyme'
import { readFileSync, existsSync } from 'fs';

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
global.window.fetch = fetch;
global.fetch = fetch;

delete global.window.location;
global.window = {};

configure({adapter: new Adapter});

require('dotenv').config({
    path: require('find-config')('.testing.env')
});

let securityKeyFile = 'securityKey.txt';
if (existsSync('testing-securityKey.txt')) {
    securityKeyFile = 'testing-securityKey.txt';
}

try {
    global.SECURITY_KEY = readFileSync(securityKeyFile, 'UTF8');
} catch (err) {
    throw Error(`Could not load security key from securityKey.txt! Make sure this file exists and is readable.`);
}
