import { h, Component } from "preact";
import style from "./style.module.scss";
import DialogPane from "../dialog-pane";

/**
 * Displays potential errors
 */
export default class ErrorPane extends Component {

    render({error, refreshCallback}) {
        return (
            <DialogPane dialogStyle={'background-color: darkred;'}>
                {error}
                <br/>
                <div className={style['error-pane-dialog__button']} onClick={refreshCallback}>
                    Retry
                </div>
            </DialogPane>
        );
    }
}
