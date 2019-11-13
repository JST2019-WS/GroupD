import { h, Component } from "preact";
import style from "./style.module.scss";
import {riskLevels} from "../../models/riskLevels";

/**
 * Risk level slider: Shows and allows modification of risk level
 */
export default class RiskLevelSelection extends Component {
    state = { selectedValue: null };

    constructor({riskLevel}) {
        super(riskLevel);
    }

    updateSelection(riskLevel) {
        if(this.props.onUpdate) {
            this.props.onUpdate(riskLevel.value);
        }
    }

    render({onUpdate, riskLevel}) {
        const _selectedLevel = (riskLevel === null || riskLevel === undefined || !riskLevels.map((elem) => elem.value).includes(riskLevel)) ? riskLevels[0].value : riskLevel;
        return (
            <form className={style['risk-level-selection__container']}>
                {
                    riskLevels.map((riskLevel) => {
                        const classPrefix = 'risk-level-selection__option';
                        const classes = [style[classPrefix]];
                        if(style[`${classPrefix}--${riskLevel.value}`]) {
                            classes.push(style[`${classPrefix}--${riskLevel.value}`])
                        }
                        if(_selectedLevel === riskLevel.value) {
                            classes.push(style[`${classPrefix}--selected`])
                        }
                        return (
                            <span class={classes.join(' ')} key={riskLevel.value} onClick={() => {
                                if(_selectedLevel !== riskLevel.value) {
                                    this.updateSelection(riskLevel)
                                }
                            } }>
                                {riskLevel.label}
                            </span>
                        )
                    })
                }
            </form>
        )
        /*return (
            <label className={style['risk-level-slider__container']}>
                <input className={style['risk-level-slider__slider']}
                       type="range" min="1" max="10" step={"1"} value={selectedValue} onChange={(evt) => { this.updateSelection(evt.target.value, onUpdate) }} onInput={(evt) => { this.updateSelection(evt.target.value) }}/>
                <span className={style['risk-level-slider__label']}>Risk level: {selectedValue}</span>
            </label>
        )*/
    }
}
