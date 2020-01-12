/* eslint-env node, jest */

import LoadingPane from "./index";
import { shallow } from 'enzyme'

describe('loading-pane', () => {
    it('should render as expected', () => {
        const component = shallow(<LoadingPane/>);
        expect(component.html()).toMatchSnapshot();
    })
});
