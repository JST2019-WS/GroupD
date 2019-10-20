import { h, Component } from "preact";
import style from "./style.module.scss";
import StockTable from "../stock-table";
import ErrorPane from "../error-pane";
import { Bar } from 'styled-loaders';
import DialogPane from "../dialog-pane";

/**
 * Fetches recommended stocks for the passed user.
 */
export default class RecommendedRecommendedStocks extends Component {
    state = { recommendation: null, error: null, selected: null, hovered: null, loading: null };

    constructor(props) {
        super(props);

        this.updateRecommendation(props.user, props.portfolio)
    }

    updateRecommendation(user, portfolio) {
        this.setState((state, props) => ({
            error: null,
            loading: true
        }));
        // Fetch recommendation
        fetch(`${process.env.RECOMMENDATION_ENDPOINT}${user}?portfolio=${portfolio}`)
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
        }).catch((err) => {
            this.setState((state, props) => ({
                error: err
            }))
        }).finally(() => {
            this.setState(() => ({
                loading: false
            }))
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

    render({user, portfolio}, { recommendation, selected, hovered, error, loading }) {
        if (error && !loading) {
            return (
                <ErrorPane error={error} refreshCallback={() => this.updateRecommendation(user, portfolio)} />
            );
        } else if (loading) {
            return (
                <DialogPane dialogStyle={'background-color: transparent;'}>
                    <Bar bgBar={'#507B62'} color={'#ffffff'} />
                </DialogPane>
            )
        } else {
            return (
                <div class={style['recommendation-container']}>
                    <StockTable stocks={recommendation} onStockClicked={this.stockClicked.bind(this)}
                                onStockHovered={this.stockHovered.bind(this)}/>
                </div>
            );
        }
    }
}
