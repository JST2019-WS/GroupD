import { h, Component } from "preact";
import "./style.scss";

function renderColored(classname, value) {
    return `${classname} ${classname}--${value >= 0.0 ? 'positive' : 'negative'}`;
}

/**
 * Stock table row: Renders a single stock as a table row
 */
export default class StockTableRow extends Component {
    render({stock, onClick, onHover}, {}) {
        return (
            <tr onClick={onClick} onMouseOver={onHover} class='stock-table-row'>
                <td class='stock-table-row__name'>
                    <a onClick={(evt) => { evt.preventDefault(); onClick(evt); }} href={stock.stock.url}>
                        {stock.stock.name}
                    </a>
                </td>
                <td class='stock-table-row__category'><a href={stock.category.url}>{stock.category.name}</a></td>
                <td class='stock-table-row__value'>{stock.value} EUR</td>
                <td class={renderColored('stock-table-row__absolute', stock.absolute)}>{stock.absolute} EUR</td>
                <td class={renderColored('stock-table-row__relative', stock.relative)}>{stock.relative} EUR</td>
                <td class='stock-table-row__timestamp'>{new Date(stock.updated_at)}</td>
                <td class='stock-table-row__exchange'>{stock.exchange}</td>
                <td class='stock-table-row__revenue'>{stock.revenue}</td>
            </tr>
        );
    }
}
