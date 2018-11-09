
import React, { Component } from 'react';

const WIDTH = 600;
const HEIGHT = 300;

class ShowStation extends Component {
  render() {
    const showStation = this.props.lat !== undefined && this.props.lon !== undefined;
    const lat = showStation ? parseFloat(this.props.lat) : 42.3616357609158;
    const lon = showStation ? parseFloat(this.props.lon) : -71.0906195640564;
    let uri =
      'https://image.maps.api.here.com/mia/1.6/mapview'
      + '?app_id=U9umRZloTL1NlnFVh5yy'
      + '&app_code=ysINLh115zGxmmSBeofNNg'
      + `&w=${WIDTH}`
      + `&h=${HEIGHT}`
      + '&z=14'
      + `&c=${lat},${lon}`
      + (showStation ? '' : '&nodot');
    return (
      <img src={uri} alt={'Station on Map'}/>
    );
  }
}

export default ShowStation;
