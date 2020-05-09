import React, { Component } from "react";

class CustomFilter extends Component {
    constructor(props) {
        super(props);

        let query = {
            query: {
              term: { bought: false },
            },
        };
        
        this.props.setQuery({
            query,
            value: false,
        });
    }



  render() {
      return(
          <div>
          </div>
      )
  }

}

export default CustomFilter;
