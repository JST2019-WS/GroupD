/* eslint-env node, jest */

import DialogPane from "./index";
import {shallow} from 'enzyme';

describe('Dialog Pane', () => {
    it('should render all children', () => {
        const children = (<div><span>Test</span></div>);
        const component = shallow(<DialogPane>{children}</DialogPane>);

        expect(component.children().html()).toMatch(shallow(children).html());
    });

    it('should work for null children', () => {
        const component = shallow(<DialogPane/>);
        expect(component.children()).toHaveLength(0);
    });
});
