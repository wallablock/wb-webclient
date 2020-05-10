import React, {Component} from "react";
import "./styles/YourOffers.css";

class YourOffers extends Component {
    constructor(props) {
        super(props);

        console.log("constructor your offers")
    }

    render() {
        console.log("render your offers")
        return (
            <div className="offers_popup_background" onClick={this.props.close}>
                <div
                    className="offers_popup"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >


                    
                </div>
            </div>
        )
    }
}

export default YourOffers;