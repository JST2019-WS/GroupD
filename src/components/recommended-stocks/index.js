import { h, Component } from "preact";
import style from "./style.module.scss";
import StockTable from "../stock-table";
import ErrorPane from "../error-pane";
import { Bar } from 'styled-loaders';
import DialogPane from "../dialog-pane";
import RiskLevelSlider from "../risk-level-slider";

/**
 * Fetches recommended stocks for the passed user.
 */
export default class RecommendedRecommendedStocks extends Component {
    state = { recommendation: null, error: null, selected: null, hovered: null
        , loading: false, user: null, showSettings: false };

    constructor(props) {
        super(props);

        this.refreshCachedData(props.user, props.portfolio)
    }

    refreshCachedData(user_id, portfolio_id, clearCache=false) {
        if(this.state.loading) { // There may be a request pending
            return;
        }
        // Clear any errors and set loading
        this.setState(() => ({
            loading: true,
            error: null
        }));
        // TODO Possible race condition as setState is async!

        const request = (!this.state.user || clearCache)
            ? this.requestUserData(user_id)
            : Promise.resolve();

        request.then(() => {
            return this.requestRecommendation(user_id, portfolio_id)
        }).catch((err) => {
            this.setState(() => ({
                error: err
            }))
        }).finally(() => {
            this.setState(() => ({
                loading: false
            }))
        })
    }

    requestUserData(user_id) {
        // Query backend for any additional user data
        return fetch(`${process.env.USER_INFO_ENDPOINT}${user_id}`)
            .then((response) => {
                if(response.status !== 200) {
                    return Promise.reject(`Error: ${response.status}`)
                }
                return response.json()
            }).then((user_info) => {
                // Handle actual data
                this.setState(() => {
                    return {user: user_info}
                })
            })
    }

    requestRecommendation(user, portfolio) {
        // Fetch recommendation
        return fetch(`${process.env.RECOMMENDATION_ENDPOINT}${user}?portfolio=${portfolio}`)
            .then((response) => {
                if(response.status !== 200) {
                    return Promise.reject(`Error: ${response.status}`)
                }
                return response.json()
            }).then((recommendation) => {
                // Further process response
                this.setState((state, props) => {
                    return { recommendation: recommendation }
                })
        })
    }

    stockClicked(stock, evt) {
        this.setState((state, props) => {
            return {
                selected: (state.selected && stock.id === state.selected.id) ? null : stock,
            }
        });
        const navigate = evt.target.tagName.toLowerCase() === 'a';
        // Send post
        fetch(`${process.env.FEEDBACK_ENDPOINT}${this.props.user}?portfolio=${this.props.portfolio}`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                choice: stock,
                offered: this.state.recommendation.map((stock) => ( stock.id )),
                switchedPage: navigate
            })
        }).finally(() => {
            if(navigate) {
                window.location = stock.stock.url;
            }
        })
    }

    stockHovered(stock) {
        this.setState(() => ({
            hovered: stock
        }))
    }

    riskLevelUpdated(riskLevel) {
        // Notify backend
        fetch(`${process.env.USER_INFO_ENDPOINT}${this.props.user}?portfolio=${this.props.portfolio}`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'risk-level': riskLevel
            })
        })
    }

    render({user, portfolio}, { recommendation, selected, hovered, error, loading, showSettings}) {
        if (error && !loading) {
            return (
                <ErrorPane error={error} refreshCallback={() => this.refreshCachedData(user, portfolio)} />
            );
        } else if (loading) {
            return (
                <DialogPane dialogStyle={'background-color: transparent;'}>
                    <Bar bgBar={'#507B62'} color={'#ffffff'}/>
                </DialogPane>
            )
        } else {
            return (
                <div class={style['recommendation-container']}>
                    <div class={style['recommendation-container__table']}>
                        <StockTable stocks={recommendation} onStockClicked={this.stockClicked.bind(this)}
                                    onStockHovered={this.stockHovered.bind(this)}/>
                    </div>
                    <RiskLevelSlider riskLevel={7} onUpdate={(level) => this.riskLevelUpdated(level)} class={style['recommendation-container']} />
                </div>
            );
        }
    }
}
