/* eslint-env node, jest */

import { h } from "preact";
import { shallow, mount } from 'enzyme'
import { parse as url } from 'url'
import delay from 'delay'

import mockStocks from '../../../test/stocks.json'
import mockUser from '../../../test/user.json'
import {riskLevels} from "../../models/riskLevels";

import RecommendedStocksContainer from "./index";
import ErrorPane from "../error-pane";
import StockTable from "../stock-table";
import RiskLevelSelection from "../risk-level-selection";
import LoadingPane from "../loading-pane";

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
        fetch.once(JSON.stringify(mockUser)).once(JSON.stringify(mockStocks));
        const component = shallow(<RecommendedStocksContainer user={config.userID} portfolio={config.portfolioID}/>);
        await delay(500);
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
        fetch.once(JSON.stringify(mockUser)).once(JSON.stringify(mockStocks));
        const component = shallow(<RecommendedStocksContainer user={config.userID} portfolio={config.portfolioID}/>);
        await delay(100);
        await setStateAsync(component, {
            loading: true
        });
        expect(component.find(LoadingPane)).toHaveLength(1);
        await setStateAsync(component, {loading: false});
        expect(component.find(LoadingPane)).toHaveLength(0);
    });

    it('should request user data on load', done => {
        fetch
            .once(JSON.stringify(mockUser))
            .once(JSON.stringify(mockStocks));

        const component = shallow(<RecommendedStocksContainer user={config.userID} portfolio={config.portfolioID} />);
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

    it('should correctly display errors', async () => {
        fetch
            .once(JSON.stringify(mockUser))
            .once(JSON.stringify(mockStocks));
        const component = shallow(<RecommendedStocksContainer user={config.userID} portfolio={config.portfolioID}/>);
        await delay(100);
        await setStateAsync(component, {
            error: {
                error: new Error('test'), callback: () => {
                }
            }
        });
        expect(component.html()).toMatchSnapshot();
    });

    it('should post recommendation updates to the server', async () => {
        fetch.once(JSON.stringify(mockUser)).once(JSON.stringify(mockStocks));
        const component = mount(<RecommendedStocksContainer user={config.userID} portfolio={config.portfolioID}/>);
        await delay(1000);
        component.update();

        const checkResponse = (call, stock) => {
            expect(call[0]).toEqual(`${process.env.FEEDBACK_ENDPOINT}${config.userID}?portfolio=${config.portfolioID}`);
            const params = call[1];
            const body = JSON.parse(params.body);

            expect(params.method).toEqual('POST');
            expect(body['choice']).toEqual(stock);
            return true
        };

        fetch.resetMocks();
        fetch.mockResponse('200 OK');
        for(let i = 0; i < mockStocks.length; i+=1) {
            component.find(StockTable).prop('onStockClicked')(mockStocks[i], {}, 'row');
            expect(checkResponse(fetch.mock.calls[2*i], mockStocks[i])).toBeTruthy();
            expect(JSON.parse(fetch.mock.calls[2*i][1].body).switchedPage).toEqual(false);
            await delay(100);

            component.find(StockTable).prop('onStockClicked')(mockStocks[i], {}, 'link');
            expect(checkResponse(fetch.mock.calls[2*i+1], mockStocks[i])).toBeTruthy();
            expect(JSON.parse(fetch.mock.calls[2*i+1][1].body).switchedPage).toEqual(true);
            await delay(100);
        }
    });

    it('should post risk level updates to the server', async () => {
        fetch.once(JSON.stringify(mockUser)).once(JSON.stringify(mockStocks));
        const component = mount(<RecommendedStocksContainer user={config.userID} portfolio={config.portfolioID}/>);
        await delay(1000);
        component.update();

        fetch.resetMocks();
        fetch.mockResponse('200 OK');
        const risk = riskLevels[0].value;

        component.find(RiskLevelSelection).prop('onUpdate')(risk);
        expect(fetch.mock.calls.length).toBe(1); // API is queried
        const [url, params] = fetch.mock.calls[0];
        expect(url).toEqual(`${process.env.PORTFOLIO_ENDPOINT}`);
        expect(params.method).toBe('POST');
        const body = JSON.parse(params.body);
        expect(body['risk']).toBe(risk);
        expect(body['userId']).toBe(config.userID);
        expect(body['portfolioId']).toBe(config.portfolioID);
        expect(body['action']).toBe('setPortfolioRisk');
    });

    it('should handle failing requests', done => {
        fetch.mockReject(new Error('Testing timeout'));

        const component = mount(<RecommendedStocksContainer user={config.userID} portfolio={config.portfolioID} />);
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
