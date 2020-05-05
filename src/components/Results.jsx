import React from "react";
import { SelectedFilters, ReactiveList } from "@appbaseio/reactivesearch";
import PropTypes from "prop-types";

import Popup from "./Popup";

import MyCard from "./MyCard";

import "./styles/Results.css";

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      offer: null,
    };
  }

  render() {
    return (
      <div className="result-list">
        {this.state.showPopup ? (
          <Popup
            offer={this.state.offer}
            closePopup={this.togglePopup.bind(this)}
          />
        ) : null}

        <SelectedFilters
          className="m1"
          showClearAll={"default"}
          onClear={(component, value) => {
            console.log(`${component} has been removed with value as ${value}`);
            if (component === "myColorPicker" || !component) {
            }
          }}
        />

        <ReactiveList
          componentId="results"
          dataField="Title"
          size={18}
          pagination={true}
          react={{
            and: [
              "search",
              "price",
              "category",
              "myCustomSwitch",
              "filtroPais",
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
