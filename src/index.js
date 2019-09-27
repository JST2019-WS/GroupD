let poly = require("preact-cli/lib/lib/webpack/polyfills");

import { h, render } from "preact";
import Router from 'preact-router';
import RecommendedStocksWidget from "./components/recommended-stocks";
import SwaggerUIComponent from "./components/swagger-ui";

const props = { 
  "user": "test-user",
  "portfolio": [
  {
    "id": 1,
    "since": "2019-01-01"
  },
  {
    "id": 2,
    "since": "2019-03-01"
  },
  {
    "id": 3,
    "since": "2019-02-01"
  }
]
}

const Main = () => (
	<Router>
		<RecommendedStocksWidget user={props.user} portfolio={props.portfolio} path="/"/>
		<SwaggerUIComponent path="/swaggerui"/>
	</Router>
);

render(<Main />, document.body);
