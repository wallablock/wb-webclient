import React, { Component } from "react";

import "./styles/PopupContactInfo.css";

class PopupContactInfo extends Component {
    render() {
        return(
            <div className="popup_contact_background" onClick={this.props.close}>
                <div className="popup_contact_content" onClick={(e) => {e.stopPropagation();}}>
                    <div className="popup_contact_wrapper">
                        <div className="popup_contact_info">
                            <p>ContactInfo: {this.props.contactInfo}</p>

                        </div>
                        <div className="popup_contact_cerrar">
                            <button onClick={this.props.close}>Cerrar</button>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PopupContactInfo;
