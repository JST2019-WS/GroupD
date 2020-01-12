import { h, Component } from "preact";
import style from "./style.module.scss";
import DialogPane from "../dialog-pane";

/**
 * Displays potential errors
 */
export default class LoadingPane extends Component {

    render({error, refreshCallback}) {
        return (
            <DialogPane dialogStyle={'background-color: transparent;'}>
                Loading...
            </DialogPane>
        );
    }
}
