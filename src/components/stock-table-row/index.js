import { h, Component } from "preact";
import style from "./style.module.scss";

function renderColored(classname, value) {
    return `${classname} ${classname}--${value >= 0.0 ? 'positive' : 'negative'}`;
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
            <tr onClick={onClick} onMouseOver={onHover} class={{[style['stock-table-row']]: true, [style['stock-table-row--highlighted']]: stock.highlight}}>
                <td class={style['stock-table-row__name']}>
                    <a onClick={(evt) => { evt.preventDefault(); onClick(evt); }} href={stock.stock.url}>
                        {stock.stock.name}
                    </a>
                </td>
                <td class={style['stock-table-row__category']}><a href={stock.category.url}>{stock.category.name}</a></td>
                <td class={style['stock-table-row__value']}>{formatNumber(stock.value)}</td>
                <td class={style[renderColored('stock-table-row__absolute', stock.absolute)]}>{formatNumber(stock.absolute, {includeSign: true})}</td>
                <td class={style[renderColored('stock-table-row__relative', stock.relative)]}>{formatNumber(stock.relative, {includeSign: true})}</td>
                <td class={style['stock-table-row__timestamp']}>{formatTime(new Date(stock.updated_at))}</td>
                <td class={style['stock-table-row__exchange']}>{stock.exchange}</td>
                <td class={style['stock-table-row__revenue']}>{formatNumber(stock.revenue, { precision: 0 })}</td>
            </tr>
        );
    }
}
