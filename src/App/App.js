import React, { Component } from 'react';
import './App.css';
import SelectStation from '../SelectStation/SelectStation';
import ShowStation from '../ShowStation/ShowStation';
import ShowCounts from '../ShowCounts/ShowCounts';

const PERIOD = 15000;

const bell = new Audio('bell.wav');

// handle browsers which do not have the notification API
// eslint-disable-next-line no-use-before-define
var Notification = Notification || { permission: 'denied' };

function notify(message) {
  if (Notification.permission === 'denied') {
    alert(message);
  } else {
    new Notification(message);
  }
}

class App extends Component {
  state = {
    station: {},
    pollInterval: NaN,
    waitInterval: NaN,
    bike: undefined,
    dock: undefined,
  };

  handleSelectStation = station => {
    station = station || {};
    this.setState({ station });
    this.poll(station.station_id);
    this.wait(null);
  }

  poll(stationID) {
    clearInterval(this.state.pollInterval);
    const pollAPI = () => {
      fetch('https://gbfs.bluebikes.com/gbfs/en/station_status.json')
        .then(res => res.json())
        .catch(() => {
          notify('Could not connect to Blue Bikes servers.');
          return { data: { stations: [] } };
        })
        .then(data => {
          const stations = data.data.stations
            .filter(s => s.station_id === stationID);
          if (stations.length === 1) {
            this.setState({
              bike: stations[0].num_bikes_available,
              dock: stations[0].num_docks_available,
            });
          } else {
            clearInterval(this.state.pollInterval);
            this.setState( { pollInterval: NaN });
          }
        });
    };
    const pollInterval = setInterval(pollAPI, PERIOD);
    pollAPI();
    this.setState({ pollInterval });
  }

  wait(what) {
    clearInterval(this.state.waitInterval);
    let waitInterval = NaN;
    if (what) {
      const checkCounts = () => {
        if (this.state[what] > 0) {
          bell.play();
          notify(`There is now a ${what} available.`);
          this.wait(null);
        }
      };
      waitInterval = setInterval(checkCounts, PERIOD);
      checkCounts();
    }
    this.setState({ waitInterval });
  }
  
  componentDidMount() {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.pollInterval);
    clearInterval(this.state.waitInterval);
  }

  render() {
    let waitFor = '';
    if (this.state.bike === 0) waitFor = 'bike';
    if (this.state.dock === 0) waitFor = 'dock';
    const waiting = !Number.isNaN(this.state.waitInterval);
    return (
      <div id="app" className="flow">
        <header>
          <h1>BLUEbikes Watcher</h1>
        </header>
        <main className="flow">
          <SelectStation
            onSelectStation={this.handleSelectStation}
          />
          <ShowStation
            lat={this.state.station.lat}
            lon={this.state.station.lon}
          />
          <ShowCounts
            bike={this.state.bike}
            dock={this.state.dock}
          />
          {waitFor ? (
            <button
              onClick={() => this.wait(waiting ? null : waitFor)}
            >{waiting ? 'Stop waiting' : 'Wait'} for {waitFor}.</button>
          ) : (<div />)}
        </main>
      </div>
    );
  }
}

export default App;
