import { Component } from "preact";
import style from "./style.module.scss";

/**
 * Displays a dialog
 */
export default class DialogPane extends Component {

    render(props) {
        return (
            <div className={style['dialog-pane-background']}>
                <div className={style['dialog-pane-dialog']} style={props.dialogStyle}>
                    {props.children}
                </div>
            </div>
        );
    }
}
