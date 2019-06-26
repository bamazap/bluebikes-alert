import React, { Component } from 'react';
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
    fetch(`https://gbfs.bluebikes.com/gbfs/en/station_information.json`)
      .then(res => res.json())
      .catch(() => {
        alert('Could not connect to Blue Bikes servers.');
        return { data: { stations: [] } };
      })
      .then(data => this.setState({
        stations: data.data.stations
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
