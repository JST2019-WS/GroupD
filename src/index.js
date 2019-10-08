let poly = require("preact-cli/lib/lib/webpack/polyfills");

import { h, render } from "preact";
import Router from 'preact-router';
import RecommendedStocksWidget from "./components/recommended-stocks";

const props = {
  "user": 12345678,
  "portfolio": 87654321
};

const Main = () => (
	<Router>
		<RecommendedStocksWidget user={props.user} portfolio={props.portfolio} path="/"/>
	</Router>
);

render(<Main />, document.body);
