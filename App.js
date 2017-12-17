import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button
} from 'react-native';
import MapView from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';

const {
  width,
  height
} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0;
const LONGITUDE_DELTA = 0;

export default class App extends React.Component {
  watchId;

  constructor(props) {
    super(props);
    this.state = {
      region: null,
      marker: {
        latlng: {
          latitude: LATITUDE,
          longitude: LONGITUDE
        },
        title: '',
        description: ''
      }
    };
    this.onRegionChange = this.onRegionChange.bind(this);
  }

  onRegionChange(region) {
    // this.setState({
    //   region
    // });
  }

  regionFrom(lat, lon) {
    this.setState({
      marker: {
        latlng: {
          latitude: lat,
          longitude: lon
        },
        title: '',
        description: ''
      }
    })

    return result = {
      latitude: lat,
      longitude: lon,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }
  }

  openSearchModal() {
    RNGooglePlaces.openAutocompleteModal()
      .then((place) => {
        console.log(place);
        const tempRegion = {
          latitude: place.latitude,
          longitude: place.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };

        this.setState({
          marker: {
            latlng: {
              latitude: place.latitude,
              longitude: place.longitude
            },
            title: place.name,
            description: place.address
          }
        });
        
        //this.onRegionChange(tempRegion);
        var region = this.regionFrom(place.latitude, place.longitude);
        this.setState({
          region
        });        
      })
      .catch(error => console.log(error.message));
  }


  render() {
    const { region } = this.props;    
    return (
      <View style={styles.container}>
        <MapView style={styles.map} region={this.state.region} onRegionChange={region => this.onRegionChange(region)}>
        <MapView.Marker
            coordinate={this.state.marker.latlng}
            title={this.state.marker.title}
            description={this.state.marker.description}
          />
        </MapView>
        <Button
          onPress={() => this.openSearchModal()}
          title="Pick Place"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    );
  }

  componentDidMount() {
    //Getting Current Position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var region = this.regionFrom(position.coords.latitude, position.coords.longitude);
        this.setState({
          region: region
        });
      },
      (error) => this.setState({
        error: error.message
      }), {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    );


    //Watching Current Position
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        var region = this.regionFrom(position.coords.latitude, position.coords.longitude);
        this.setState({
          region: region
        });
      },
      (error) => this.setState({
        error: error.message
      }), {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10
      },
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchBox: {

  }
});