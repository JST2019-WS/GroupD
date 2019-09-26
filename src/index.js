let poly = require("preact-cli/lib/lib/webpack/polyfills");

import { h } from "preact";
import habitat from "preact-habitat";

import RecommendedStocksWidget from "./components/recommended-stocks";

let _habitat = habitat(RecommendedStocksWidget);

_habitat.render({
  selector: '[data-widget-host="habitat"]',
  clean: true
});
