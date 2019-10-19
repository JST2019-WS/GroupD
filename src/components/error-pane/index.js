import { h, Component } from "preact";
import style from "./style.module.scss";

/**
 * Displays potential errors
 */
export default class ErrorPane extends Component {

    render({error, refreshCallback}) {
        return (
            <div className={style['error-pane-background']}>
                <div className={style['error-pane-dialog']}>
                    {error}
                    <br/>
                    <div className={style['error-pane-dialog__button']} onClick={refreshCallback}>
                        Retry
                    </div>
                </div>
            </div>
        );
    }
}
