import { h, Component } from "preact";
import "./style.scss";

function renderColored(classname, value) {
    return `${classname} ${classname}--${value >= 0.0 ? 'positive' : 'negative'}`;
}

/**
 * Renders details for a given stock item
 */
export default class StockDetail extends Component {
    render({stock}, {}) {
        if(!stock) {
            return null
        }
        return (
            <div class="stock-detail__container">
                <h2 class="stock-detail__header">{stock.stock.name}</h2>
            </div>
        );
    }
}
