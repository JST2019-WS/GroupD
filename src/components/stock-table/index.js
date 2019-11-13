import { h, Component } from "preact";
import style from "./style.module.scss";
import StockTableRow from "../stock-table-row";

/**
 * Displays the passed stocks in a table.
 */
export default class StockTable extends Component {

    render({stocks, onStockClicked = () => {}, onStockHovered}, {}) {

        const tableHeader = (
            <thead className={style['stock-table-head']}>
            <tr>
                <th>Wertpapier</th>
                <th>Branche</th>
                <th>(Letzter) Kurs</th>
                <th>Abs.</th>
                <th>Perf. %</th>
                <th>Letztes Update</th>
                <th>Börse</th>
                <th>Umsatz</th>
            </tr>
            </thead>
        );

        if(!stocks || stocks.length === 0) {
            return (
                <table className={style['stock-table']}>
                    {tableHeader}
                    <tbody className={style['stock-table-body']}>
                    <tr>
                        No stocks found.
                    </tr>
                    </tbody>
                </table>
            )
        }
        return (
            <table className={style['stock-table']}>
                {tableHeader}
                <tbody className={style['stock-table-body']}>
                    {(stocks ? stocks : []).map(stock => (
                        <StockTableRow
                            stock={stock}
                            onClick={onStockClicked ? onStockClicked.bind(null, stock) : () => {}}
                            onHover={onStockHovered ? onStockHovered.bind(null, stock) : () => {}}
                            key={stock.id} />
                    ))}
                </tbody>
            </table>
        );
    }
}
