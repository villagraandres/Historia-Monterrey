const markerIconSources = {
  generic: require('../../assets/images/icons-small/generic.png'),
  genericS: require('../../assets/images/icons-small/camera.png'),
  genericB: require('../../assets/images/icons-small/bridge.png'),
  cinema: require('../../assets/images/icons-small/cinema.png'),
  church: require('../../assets/images/icons-small/church.png'),
  store: require('../../assets/images/icons-small/store.png'),
  park: require('../../assets/images/icons-small/park.png'),
  hotel: require('../../assets/images/icons-small/hotel.png'),
};

export function getMarkerIconSource(iconKey) {
  return markerIconSources[iconKey] ?? markerIconSources.generic;
}

export function getMarkerIconUrl(iconKey) {
  const source = getMarkerIconSource(iconKey);
  if (typeof source === 'string') {
    return source;
  }

  return source?.uri ?? source?.default ?? source;
}