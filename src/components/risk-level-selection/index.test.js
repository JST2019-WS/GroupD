/* eslint-env node, jest */

import { shallow } from "enzyme"
import {riskLevels} from "../../models/riskLevels";
import RiskLevelSelection from "./index";

describe("Risk Selection", () => {
    it("should display the correct value as selected", () => {
        const selection = riskLevels[1];
        const component = shallow(<RiskLevelSelection riskLevel={selection.value} />);

        expect(component.find('.risk-level-selection__option--selected')).toHaveLength(1);
        expect(component.find('.risk-level-selection__option--selected').text()).toBe(`${selection.value*100}%`)
    });

    it("should display all risk levels", () => {
        const selection = riskLevels[1];
        const component = shallow(<RiskLevelSelection riskLevel={selection.value} />);

        expect(component.find('.risk-level-selection__option')).toHaveLength(riskLevels.length);
    });

    it("should display the first option on invalid risk level", () => {
        for (let risk of [1, null, undefined]) {
            const component = shallow(<RiskLevelSelection riskLevel={1}/>);

            expect(component.find('.risk-level-selection__option--selected')).toHaveLength(1);
            expect(component.find('.risk-level-selection__option--selected').text()).toBe(`${riskLevels[0].value * 100}%`)
        }
    });

    it("should not emit when selected risk level is clicked", () => {
        const selection = riskLevels[2];
        const onUpdate = jest.fn();
        const component = shallow(<RiskLevelSelection riskLevel={selection.value} onUpdate={onUpdate} />);

        component.find('.risk-level-selection__option--selected').simulate('click');
        expect(onUpdate.mock.calls).toHaveLength(0);
    });

    it("should emit an event when a risk level is selected", () => {
        const selection = riskLevels[2];
        const onUpdate = jest.fn();
        const component = shallow(<RiskLevelSelection riskLevel={selection.value} onUpdate={onUpdate} />);

        component.find('.risk-level-selection__option').first().simulate('click');
        expect(onUpdate.mock.calls).toHaveLength(1);
        expect(onUpdate.mock.calls[0][0]).toBe(riskLevels[0].value)
    })

});
