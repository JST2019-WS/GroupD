import { h, Component } from "preact";
import "./style.scss";
import StockTableRow from "../stock-table-row";

/**
 * Displays the passed stocks in a table.
 */
export default class StockTable extends Component {

    render({stocks, onStockClicked = () => {}, onStockHovered}, {}) {
        return (
            <table class="stock-table">
                <thead class="stock-table-head">
                    <tr>
                        <th>Wertpapier</th>
                        <th>Branche</th>
                        <th>(Letzter) Kurs</th>
                        <th>Absolut</th>
                        <th>Perf. %</th>
                        <th>Zeit</th>
                        <th>Börse</th>
                        <th>Umsatz</th>
                    </tr>
                </thead>
                <tbody class="stock-table-body">
                    {(stocks ? stocks : []).map(stock => (
                        <StockTableRow
                            stock={stock}
                            onClick={onStockClicked && onStockClicked.bind(null, stock)}
                            onHover={onStockHovered && onStockHovered.bind(null, stock)}
                            key={stock.id} />
                    ))}
                </tbody>
            </table>
        );
    }
}
