let poly = require("preact-cli/lib/lib/webpack/polyfills");

import habitat from 'preact-habitat'
import RecommendedStocksWidget from "./components/recommended-stocks";
const { render } = habitat(RecommendedStocksWidget);

function renderStockRecommendation(root_elem, user_id, portfolio_id) {
    // Set properties
    root_elem.dataset.propUser = user_id;
    root_elem.dataset.propPortfolio = portfolio_id;
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
