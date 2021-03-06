import React from "react";
import { SelectedFilters, ReactiveList } from "@appbaseio/reactivesearch";
import PropTypes from "prop-types";

//import Popup from "./Popup";

import MyCard from "./MyCard";

import "./styles/Results.css";

class Results extends React.Component {
  /*constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      offer: null,
    };
  }*/

  render() {
    return (
      <div className="result-list">
        {/*
        this.state.showPopup ? (
          <Popup
            offer={this.state.offer}
            closePopup={this.togglePopup.bind(this)}
          />
        ) : null
        */}

        <SelectedFilters
          className="m1"
          showClearAll={"default"}
        />

        <ReactiveList
          componentId="results"
          dataField="title"
          size={15}
          pagination={true}
          react={{
            and: [
              "search",
              "price",
              "category",
              "myCustomSwitch",
              "filtroPais",
              "myInvisiblFilter"
            ],
          }}
          render={({ loading, error, data }) => {
            if (loading) {
              return <div> Loading... </div>;
            }
            if (error) {
              return <div>Something went wrong.</div>;
            }
            if (data) {
              return (
                <ReactiveList.ResultCardsWrapper>
                  {data.map((item) => (
                    <MyCard
                      key={item.offer}
                      data={item}
                      onClack={this.cardClicked}
                      ipfs={this.props.ipfs}
                    />
                  ))}
                </ReactiveList.ResultCardsWrapper>
              );
            }
          }}
        />
      </div>
    );
  }
}

Results.propTypes = {
  toggleTopic: PropTypes.func,
  currentTopics: PropTypes.arrayOf(PropTypes.string),
};

export default Results;
