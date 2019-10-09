import { h, Component } from "preact";
import style from "./style.scss";
import StockTable from "../stock-table";

/**
 * Fetches recommended stocks for the passed user.
 */
export default class RecommendedRecommendedStocks extends Component {
    state = { recommendation: null, error: null, selected: null, hovered: null };

    constructor(props) {
        super(props);
        // Fetch recommendation
        fetch(`${process.env.RECOMMENDATION_ENDPOINT}${props.user}?portfolio=${props.portfolio}`)
            .then((response) => {
                if(response.status !== 200) {
                    return Promise.reject(response.text())
                }
                return response.json()
            }).then((recommendation) => {
                // Further process response
                this.setState((state, props) => {
                    return { recommendation: recommendation }
                });
            }).catch((err) => {
                this.setState((state, props) => {
                    state.error = err
                });
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
        fetch(`${process.env.FEEDBACK_ENDPOINT}${this.props.user}`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                choice: stock,
                offered: this.state.recommendation.map((stock) => ( stock.id )),
                switchedPage: navigate
            }
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

    render({user, portfolio}, { recommendation, selected, hovered }) {
        return (
            <div class={style.recommendationContainer}>
                <StockTable stocks={recommendation} onStockClicked={this.stockClicked.bind(this)} onStockHovered={this.stockHovered.bind(this)} />
            </div>
        );
    }
}
