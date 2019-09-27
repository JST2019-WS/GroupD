import { h, Component } from "preact";
import "./style.scss";
import {Line} from 'preact-chartjs-2'

function renderColored(classname, value) {
    return `${classname} ${classname}--${value >= 0.0 ? 'positive' : 'negative'}`;
}

/**
 * Renders details for a given stock item
 */
export default class StockDetail extends Component {

    componentWillUpdate(nextProps, nextState, nextContext) {
        const next_stock = nextProps.stock || {};
        const cur_stock = this.props.stock || {};
        return !(next_stock.isin === cur_stock.isin
            && next_stock.currency === cur_stock.currency
            && next_stock.exchange === cur_stock.exchange);
    }


    componentWillReceiveProps({stock}, nextContext) {
        if(!stock || !stock.isin || stock === this.props.stock) {
            return;
        }
        fetch(`${process.env.STOCK_DETAIL_ENDPOINT}${stock.isin}?exchange=${encodeURIComponent(stock.exchange)}&currency=EUR`).then(
            (response) => {
                if(response.status !== 200) {
                    return Promise.reject(response.status)
                }
                return response.json()
            }
        ).then((stock_history) => {
            // Process and convert to dataset
            const data = {
                labels: stock_history.history.map(({closed_at}) => ( new Date(closed_at).toLocaleDateString() )),
                datasets: [{
                    label: stock_history.name,
                    data: stock_history.history.map((prices) => ( prices.close ))
                }]
            };
            const options = {
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: `Closing value in ${stock_history.currency}`
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        }
                    }]
                }
            };
            this.setState((state) => ({
                data,
                options
            }))
        }).catch((err) => {
            console.log(`Could not request details for stock ${nextProps.stock.name}`)
        })
    }

    render({stock}, {data, options}) {
        if(!stock) {
            return null
        }
        console.log(options);
        return (
            <div class="stock-detail__container">
                <h2 class="stock-detail__header">{stock.name}</h2>
                <Line data={data} options={options}></Line>
            </div>
        );
    }
}
