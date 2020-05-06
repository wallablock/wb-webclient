import { Component } from "react";
import { useParams } from "react-router-dom";

class OfferDetail extends Component {
    constructor(props) {
        super(props);
        const { offerId } = useParams();
        this.offerId = offerId;
    }
}

export default OfferDetail;
