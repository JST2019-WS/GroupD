import { h, Component } from "preact";
import style from "./style.module.scss";

function renderColored(value) {
    return value >= 0.0 ? style.positiveNumber : style.negativeNumber;
}

function formatTime(date) {
    if (!date) {
        return '-'
    }
    const _format = (num) => ( num.toFixed(0).padStart(2, '0') );
    return `${_format(date.getHours())}:${_format(date.getMinutes())}:${_format(date.getSeconds())}`
}

function formatNumber(value, options = {}) {
    if (!Number.isFinite(value)) {
        return '-'
    }
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
        if(!stock || stock.name === undefined) {
            return (
                <tr>
                    <td className={style.name}>Error: Could not load stock</td>
                    <td className={style.category}>-</td>
                    <td className={style.value}>-</td>
                    <td className={style.absolute}>-</td>
                    <td className={style.relative}>-</td>
                    <td className={[style.timestamp, style.small].join(' ')}>-</td>
                    <td className={[style.exchange, style.small].join(' ')}>-</td>
                    <td className={[style.revenue, style.small].join(' ')}>-</td>
                </tr>
            )
        }
        return (
            <tr onClick={(evt) => {onClick(evt, 'row')}} onMouseOver={onHover} className={style['stock-table-row']}>
                <td className={style.name}>
                    <a onClick={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation();
                        onClick(evt, 'link');
                    }} href={stock.url}>
                        {stock.name}
                    </a>
                </td>
                <td className={style.category}><a href={stock.category ? stock.category.url : ''}>{stock.category ? stock.category.name : 'uncategorized'}</a></td>
                <td className={style.value}>{formatNumber(stock.value)} {stock.currency || '-'}</td>
                <td className={[style.absolute, renderColored(stock.absolute)].join(' ')}>{formatNumber(stock.absolute, {includeSign: true})} {stock.currency || ''}</td>
                <td className={[style.relative, renderColored(stock.relative)].join(' ')}>{formatNumber(stock.relative, {includeSign: true})} %</td>
                <td className={[style.timestamp, style.small].join(' ')}>{formatTime(stock.updated_at ? new Date(stock.updated_at) : null)}</td>
                <td className={[style.exchange, style.small].join(' ')}>{stock.exchange || '-'}</td>
                <td className={[style.revenue, style.small].join(' ')}>{formatNumber(stock.volume, {precision: 0})} {stock.currency || ''}</td>
            </tr>
        );
    }
}
