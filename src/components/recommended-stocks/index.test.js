/* eslint-env node, jest */

import { h } from "preact";
import { shallow, mount } from 'enzyme'
import { parse as url } from 'url'
import RecommendedStocks from "./index";
import ErrorPane from "../error-pane";
import mockStocks from '../../../test/stocks.json'
import mockUser from '../../../test/user.json'
import delay from 'delay'
import { Bar } from 'styled-loaders';

function didRequestUser(call, user) {
    expect(url(call[0]).pathname.split('/').pop()).toEqual(user);
}

function didRequestStock(call, user, portfolio) {
    expect(url(call[0]).pathname.split('/').pop()).toEqual(user);
    expect(url(call[0], true).query.portfolio).toEqual(portfolio);
}

function setStateAsync(component, state) {
    return new Promise(function(resolve) {
        component.setState(state, resolve);
    });
}

const config = {
    userID: mockUser.name,
    portfolioID: mockUser.portfolios[0]
};

describe('Recommended Stocks', () => {
    beforeEach(() => { fetch.resetMocks() });

    it('should display error pane only on error', async () => {
        fetch.mockResponses(JSON.stringify(mockUser), JSON.stringify(mockStocks));
        const component = shallow(<RecommendedStocks user={config.userID} portfolio={config.portfolioID}/>);
        await delay(100);
        await setStateAsync(component, {
                error: {
                    error: new Error('test'), callback: () => {
                    }
                }
            });
        expect(component.find(ErrorPane)).toHaveLength(1);
        await setStateAsync(component, {error: null});
        expect(component.find(ErrorPane)).toHaveLength(0);
    });

    it('should display loading bar only when loading', async () => {
        fetch.mockResponses(JSON.stringify(mockUser), JSON.stringify(mockStocks));
        const component = shallow(<RecommendedStocks user={config.userID} portfolio={config.portfolioID}/>);
        await delay(100);
        await setStateAsync(component, {
            loading: true
        });
        expect(component.find(Bar)).toHaveLength(1);
        await setStateAsync(component, {loading: false});
        expect(component.find(Bar)).toHaveLength(0);
    });

    it('should request user data on load', done => {
        fetch
            .once(JSON.stringify(mockUser))
            .once(JSON.stringify(mockStocks));

        const component = shallow(<RecommendedStocks user={config.userID} portfolio={config.portfolioID} />);
        setTimeout(() => {
            // user data should have been requested first
            didRequestUser(fetch.mock.calls[0], config.userID);
            // And state should be updated accordingly
            expect(component.state('user')).toEqual(mockUser);

            // Stocks should have been requested for passed portfolio
            didRequestStock(fetch.mock.calls[1], config.userID, config.portfolioID);
            // And state should be updated accordingly
            expect(component.state('recommendation')).toEqual(mockStocks);

            done()
        }, 1000);
    });

    it('should correctly display errors', () => {

    });

    it('should handle failing requests', done => {
        fetch.mockReject(new Error('Testing timeout'));

        const component = mount(<RecommendedStocks user={config.userID} portfolio={config.portfolioID} />);
        delay(500).then(() => {
            component.update();
            // user data should have been requested
            didRequestUser(fetch.mock.calls[0], config.userID);
            // User data is not set
            expect(component.state('user')).toBeNull();
            // Error is set
            expect(component.state('error')).not.toBeNull();
            expect(component.state('loading')).toBeFalsy();
            expect(component.find(ErrorPane).prop('error')).not.toBeNull();
            // Callback should be bound
            const errorCallback = component.find(ErrorPane).prop('refreshCallback');
            expect(errorCallback).not.toBeNull();

            // Callback invokes another request
            errorCallback();
            return delay(500);
        }).then(() => {
            expect(fetch.mock.calls).toHaveLength(2);
            didRequestUser(fetch.mock.calls[1], config.userID);

            // Should work if request succeeds
            fetch.resetMocks();
            fetch.once(JSON.stringify(mockUser));
            fetch.mockRejectOnce(new Error('Timeout test'));

            component.find(ErrorPane).prop('refreshCallback')();

            return delay(500)
        }).then(() => {
            component.update();
            didRequestUser(fetch.mock.calls[0], config.userID);
            expect(component.state('user')).toEqual(mockUser);

            didRequestStock(fetch.mock.calls[1], config.userID, config.portfolioID);
            expect(component.state('error')).not.toBeNull();
            // Stock data is not set
            expect(component.state('recommendation')).toBeNull();
            expect(component.state('loading')).toBeFalsy();
            expect(component.find(ErrorPane).prop('error')).not.toBeNull();
            // Callback should be bound
            const errorCallback = component.find(ErrorPane).prop('refreshCallback');
            expect(errorCallback).not.toBeNull();

            // Callback invokes another request
            fetch.resetMocks();
            fetch.once(JSON.stringify(mockStocks));
            errorCallback();
            return delay(500);
        }).then(() => {
            component.update();
            didRequestStock(fetch.mock.calls[0], config.userID, config.portfolioID);
            expect(component.state('error')).toBeNull();
            expect(component.state('recommendation')).toEqual(mockStocks);
            done();
        })
    })
});
