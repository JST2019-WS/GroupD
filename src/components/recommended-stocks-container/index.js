import { h, Component } from "preact";
import style from "./style.module.scss";
import StockTable from "../stock-table";
import ErrorPane from "../error-pane";
import RiskLevelSelection from "../risk-level-selection";
import LoadingPane from "../loading-pane";

/**
 * Fetches recommended stocks for the passed user.
 */
export default class RecommendedStocksContainer extends Component {
    state = { recommendation: null, error: null, selected: null, hovered: null
        , loading: false, user: null, showSettings: false };
    pending = false; // setState() is async, hence we need pending to prevent race conditions

    constructor(props) {
        super(props);

        this.refreshCachedData(props.user, props.portfolio)
    }

    refreshCachedData(user_id, portfolio_id, clearCache=false) {
        if(this.state.loading || this.pending) { // There may be a request pending
            return;
        }
        this.pending = true;
        // Clear any errors and set loading
        this.setState(() => ({
            loading: true,
            error: null
        }));

        const request = (!this.state.user || clearCache)
            ? this.requestUserData(user_id)
            : Promise.resolve();

        request.then(() => {
            return this.requestRecommendation(user_id, portfolio_id)
        }).catch((err) => {
            this.setState(() => ({
                error: {error: err, callback: () => { this.refreshCachedData(user_id, portfolio_id, clearCache); }}
            }))
        }).finally(() => {
            this.setState(() => ({
                loading: false
            }));
            this.pending = false;
        })
    }

    requestUserData(user_id) {
        // Query backend for any additional user data
        return fetch(`${process.env.API_BASE_URL}${process.env.USER_INFO_ENDPOINT}`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'userId': user_id,
                'action': 'getUser',
                'securityKey': SECURITY_KEY
            })
        }).then((response) => {
                if(!response.ok) {
                    return Promise.reject(`Error: ${response.status}`)
                }
                return response.json()
            }).then((user_info) => {
                const current_portfolio = user_info.portfolios.find((elem) => elem.id === this.props.portfolio);
                if(!current_portfolio) {
                    return Promise.reject(`Error: User ${user_info.user.id} does not have a portfolio with id ${this.props.portfolio}!`);
                }

                // Handle actual data
                this.setState(() => {
                    return {user: {portfolios: user_info.portfolios, ...user_info.user}, portfolio: current_portfolio}
                })
            })
    }

    requestRecommendation(user, portfolio) {
        // Fetch recommendation
        return fetch(`${process.env.API_BASE_URL}${process.env.RECOMMENDATION_ENDPOINT}`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'userId': user.id,
                'portfolioId': portfolio.id,
                'riskClass': portfolio.risk,
                'action': 'fetch',
                'securityKey': SECURITY_KEY
            })
        }).then((response) => {
                if(!response.ok) {
                    return Promise.reject(`Error: ${response.status}`)
                }
                return response.json()
            }).then((response) => {
                // Further process response
                const recommendations = response.map(stock => ({
                    isin: stock.isin,
                    name: stock.name,
                    updated_at: stock.date
                }));
                this.setState((state, props) => {
                    return { recommendation: recommendations }
                })
        })
    }

    stockClicked(stock, _evt, mode) {
        if(this.state.loading || this.pending) {
            return
        }
        this.pending = true;

        this.setState((state, props) => {
            return {
                selected: (state.selected && stock.id === state.selected.id) ? null : stock,
            }
        });
        const navigate = mode === 'link';
        // Send post
        fetch(`${process.env.API_BASE_URL}${process.env.FEEDBACK_ENDPOINT}`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'notify',
                userId: this.user.id,
                isin: stock.isin,
                clickType: navigate
            })
        }).finally(() => { // Ignore failed updates
            this.pending = false;
            if(navigate) {
                window.location = stock.url;
            }
        })
    }

    stockHovered(stock) {
        this.setState(() => ({
            hovered: stock
        }))
    }

    riskLevelUpdated(riskLevel) {
        if(this.state.loading || this.pending) {
            return
        }
        this.pending = true; // Prevent potential race conditions
        // Notify backend
        fetch(`${process.env.API_BASE_URL}${process.env.PORTFOLIO_ENDPOINT}`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'risk': riskLevel,
                'action': 'setPortfolioRisk',
                'userId': this.props.user,
                'portfolioId': this.props.portfolio,
                'securityKey': SECURITY_KEY
            })
        }).then((resp) => {
            if(!resp.ok) {
                return Promise.reject('Could not update risk level!')
            }
        }).then(() => {
            // Only update when the request was successfull
            this.setState(() => ({
                user: {...this.state.user, riskLevel: riskLevel}
            }));

            this.refreshCachedData(this.props.user, this.props.portfolio);
        }).catch((err) => {
            this.setState(() => ({
                error: {error: err, callback: () => { this.riskLevelUpdated(riskLevel) } }
            }));
        }).finally(() => {
            this.pending = false;
        })
    }

    render({user, portfolio}, { recommendation, selected, hovered, error, loading, showSettings}) {
        if (error && !loading) {
            return (
                <ErrorPane error={error.error} refreshCallback={error.callback} />
            );
        } else if (loading) {
            return (
                <LoadingPane/>
            )
        } else {
            return (
                <div class={style['recommendation-container']}>
                    <div class={style['recommendation-container__table']}>
                        <StockTable stocks={recommendation} onStockClicked={this.stockClicked.bind(this)}
                                    onStockHovered={this.stockHovered.bind(this)}/>
                    </div>
                    <RiskLevelSelection riskLevel={this.state.portfolio ? this.state.portfolio.risk : 0.03} onUpdate={(level) => this.riskLevelUpdated(level)} class={style['recommendation-container']} />
                </div>
            );
        }
    }
}
