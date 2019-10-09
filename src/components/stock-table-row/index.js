import { h, Component } from "preact";
import style from "./style.module.scss";

function renderColored(value) {
    return value >= 0.0 ? style.positiveNumber : style.negativeNumber;
}

function formatTime(date) {
    const _format = (num) => ( num.toFixed(0).padStart(2, '0') );
    return `${_format(date.getHours())}:${_format(date.getMinutes())}:${_format(date.getSeconds())}`
}

function formatNumber(value, options = {}) {
    options = Object.assign({includeSign: false, precision: 2 }, options);
    return `${options.includeSign && value >= 0.0 ? '+' : ''}` + value
        .toFixed(options.precision)
        .replace('.', ',')
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

/**
 * Stock table row: Renders a single stock as a table row
 */
export default class StockTableRow extends Component {
    render({stock, onClick, onHover}, {}) {
        return (
            <tr onClick={onClick} onMouseOver={onHover} class={`${style['stock-table-row']} ${ stock.highlight ? style['stock-table-row--highlighted'] : ''}`}>
                <td class={style.name}>
                    <a onClick={(evt) => { evt.preventDefault(); onClick(evt); }} href={stock.url}>
                        {stock.name}
                    </a>
                </td>
                <td class={style.category}><a href={stock.category.url}>{stock.category.name}</a></td>
                <td class={style.value}>{formatNumber(stock.value)} {stock.currency}</td>
                <td class={`${style.absolute} ${renderColored(stock.absolute)}`}>{formatNumber(stock.absolute, {includeSign: true})} {stock.currency}</td>
                <td class={`${style.relative} ${renderColored(stock.relative)}`}>{formatNumber(stock.relative, {includeSign: true})} %</td>
                <td class={[style.timestamp, style.small].join(' ')}>{formatTime(new Date(stock.updated_at))}</td>
                <td class={[style.exchange, style.small].join(' ')}>{stock.exchange}</td>
                <td class={[style.revenue, style.small].join(' ')}>{formatNumber(stock.volume, { precision: 0 })} {stock.currency}</td>
            </tr>
        );
    }
}
