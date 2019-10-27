import { h, Component } from "preact";
import style from "./style.module.scss";

/**
 * Risk level slider: Shows and allows modification of risk level
 */
export default class RiskLevelSlider extends Component {
    state = { selectedValue: null };

    constructor({riskLevel}) {
        super(riskLevel);

        this.setState(() => ({
            selectedValue: riskLevel
        }))
    }

    updateSelection(value, notify = null) {
        if(value !== this.state.selectedValue) {
            this.setState(() => ({
                selectedValue: value
            }))
        }

        if(notify) {
            notify(value)
        }
    }

    render({onUpdate}, {selectedValue}) {
        return (
            <label className={style['risk-level-slider__container']}>
                <input className={style['risk-level-slider__slider']}
                       type="range" min="1" max="10" step={"1"} value={selectedValue} onChange={(evt) => { this.updateSelection(evt.target.value, onUpdate) }} onInput={(evt) => { this.updateSelection(evt.target.value) }}/>
                <span className={style['risk-level-slider__label']}>Risk level: {selectedValue}</span>
            </label>
        )
    }
}
