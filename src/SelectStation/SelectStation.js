import React, { Component } from 'react';
import * as axios from 'axios';
import Select from 'react-select';
import './SelectStation.css';

class SelectStation extends Component {
  state = {
    selectedStation: null,
    stations: [],
  }

  handleSelectStation = (selectedStation) => {
    this.setState({ selectedStation })
    this.props.onSelectStation(selectedStation.value);
  };

  componentDidMount() {
    axios
      .get(`https://gbfs.bluebikes.com/gbfs/en/station_information.json`)
      .then(res => this.setState({
        stations: res.data.data.stations
          .map(station => ({ value: station, label: station.name })),
      }));
  }

  render() {
    return (
      <Select
        className="select-station"
        value={this.state.selectedStation}
        onChange={this.handleSelectStation}
        options={this.state.stations}
      >
      </Select>
    );
  }
}

export default SelectStation;
