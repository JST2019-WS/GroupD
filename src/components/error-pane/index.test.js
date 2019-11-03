/* eslint-env node, jest */

import { h } from "preact";
import ErrorPane from "./index";
import { shallow } from 'enzyme'

describe('error-pane', () => {
    it('should render null errors', () => {
        let component = shallow(<ErrorPane error={null}/>);
        expect(component.html()).toMatchSnapshot('null-error-with-callback');

        component = shallow(<ErrorPane error={null} refreshCallback={() => {}}/>);
        expect(component.html()).toMatchSnapshot('null-error-without-callback');
    });

    it('should render ordinary errors', () => {
        let component = shallow(<ErrorPane error={new Error('Test')}/>);
        expect(component.html()).toMatchSnapshot('orindary-error');
    });

    it('should not render refresh if no callback is passed', () => {
        const component = shallow(<ErrorPane error={'Test'}/>);
        expect(component.html()).not.toContain('Retry');
    });
});
