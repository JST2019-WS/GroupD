import { h, Component } from "preact";
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import openapi from "../../../doc/openapi.json"

/**
 * Renders Rest API documentation using Swagger UI.
 */
export default class SwaggerUIComponent extends Component {
    render() {
        return (
            <SwaggerUI spec={openapi} />
        );
    }
}
