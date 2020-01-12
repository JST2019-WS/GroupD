/* eslint-env node, jest */

import StockTable from "./index";
import {shallow, mount} from "enzyme";
import stocks from '../../../test/stocks.json'

describe('Stock Table', () => {
    it('should render as many stocks as passed', () => {
        const table = shallow(<StockTable stocks={['a', 'b', 'c']}/>);
        expect(table.find('StockTableRow')).toHaveLength(3);
        expect(table.debug()).toMatchSnapshot();
    });

    it('should handle empty/null stock arrays', () => {
        let table = shallow(<StockTable stocks={null}/>);
        expect(table.html()).toMatchSnapshot('null-stocks');

        table = shallow(<StockTable stocks={[]}/>);
        expect(table.html()).toMatchSnapshot('null-stocks');
    });

    it('should propagate stock click/hover events', () => {
        const onClick = jest.fn();
        const onHover = jest.fn();
        const table = mount(<StockTable stocks={stocks} onStockClicked={onClick} onStockHovered={onHover} />);

        stocks.forEach((elem, id) => {
            table.find('StockTableRow').at(id).prop('onClick')();
            expect(onClick.mock.calls).toHaveLength(id+1);
            expect(onClick.mock.calls[id][0]).toBe(elem);
        });

        stocks.forEach((elem, id) => {
            table.find('StockTableRow').at(id).prop('onHover')();
            expect(onHover.mock.calls).toHaveLength(id+1);
            expect(onHover.mock.calls[id][0]).toBe(elem);
        });
    });

    it('should handle null click/hover callbacks', () => {
        const table = mount(<StockTable stocks={stocks} onStockClicked={null} onStockHovered={null} />);
        expect(table.html()).toMatchSnapshot('valid-stocks');

        // Click / Hover should not throw
        stocks.forEach((elem, id) => {
            table.find('StockTableRow').at(id).prop('onClick')();
            table.find('StockTableRow').at(id).prop('onHover')();
        });
    })
});