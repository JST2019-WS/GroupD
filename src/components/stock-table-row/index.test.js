/* eslint-env node, jest */

import { h } from "preact";
import StockTableRow from "./index";
import {shallow, mount} from 'enzyme'
import stocks from '../../../test/stocks.json'

const stock = stocks[0];

describe('Stock Table Row', () => {
    it('should display the stock', () => {
        const component = shallow(<StockTableRow stock={stock}/>);
        expect(component.html()).toMatchSnapshot()
    });

    it('should render negative/positive numbers with the correct class', () => {
        const component = shallow(<StockTableRow stock={stock}/>);

        const testFormat = (num, node, prop) => {
            stock[prop] = num;
            component.update();
            const format = num >= 0.0 ? 'positiveNumber' : 'negativeNumber';
            expect(node.hasClass(format))
        };

        for(const [childID, prop] of [[3, 'absolute'], [4, 'relative']]) {
            for(const num in [-1.0, 1.0, 0.0]) {
                testFormat(1.0, component.find('td').at(childID), prop)
            }
        }
    });

    it('should render an error on passing a null stock', () => {
        const component = shallow(<StockTableRow stock={null}/>);
        expect(component.html()).toMatchSnapshot('null-stock')
    });

    it('should render an error on passing a empty stock', () => {
        const component = shallow(<StockTableRow stock={{}}/>);
        expect(component.html()).toMatchSnapshot('null-stock')
    });

    it('should render default values', () => {
        const component = shallow(<StockTableRow stock={{name: 'Test'}}/>);
        expect(component.html()).toMatchSnapshot('default-stock')
    });

    it('should propagate click/hover events', () => {
        const onClick = jest.fn();
        const onHover = jest.fn();
        const component = shallow(<StockTableRow stock={stock} onClick={onClick} onHover={onHover}/>);

        component.simulate('click');
        expect(onClick.mock.calls.length).toBe(1); // Only one event should be raised
        expect(onClick.mock.calls[onClick.mock.calls.length-1][1]).toBe('row');

        component.find('a').first().simulate('click');
        expect(onClick.mock.calls.length).toBe(2); // Clicking on a link does not raise a row event
        expect(onClick.mock.calls[onClick.mock.calls.length-1][1]).toBe('link');

        component.simulate('mouseover');
        expect(onHover.mock.calls.length).toBe(1)
    })
});