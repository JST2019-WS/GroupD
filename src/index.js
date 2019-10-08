let poly = require("preact-cli/lib/lib/webpack/polyfills");

import habitat from 'preact-habitat'
import RecommendedStocksWidget from "./components/recommended-stocks";
const { render } = habitat(RecommendedStocksWidget);

const props = {
  "user": 12345678,
  "portfolio": 87654321
};

function renderStockRecommendation(root_elem, user_id, portfolio_id) {
    // Set properties
    root_elem.dataset.propUser = props.user;
    root_elem.dataset.propPortfolio = props.portfolio;
	render({
        selector: `#${root_elem.id}`
	});
}

registerWOPlugin("SecuritiesRecommendationEngine",
    containerId => renderStockRecommendation(
        document.getElementById(containerId),
        WOPluginInfoProvider.currentUserId(),
        WOPluginInfoProvider.currentPortfolioId()
    )
);
