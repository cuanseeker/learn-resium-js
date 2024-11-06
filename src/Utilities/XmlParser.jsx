import proj4 from "proj4";

// Constants for UTM to lat/lon conversion
const R_MAJOR = 6378137.0; // Major radius of the WGS84 ellipsoid
const R_MINOR = 6356752.314245179; // Minor radius of the WGS84 ellipsoid

const utmToLatLon = (utmX, utmY, zoneNumber, northernHemisphere = true) => {
  const k0 = 0.9996;
  const e = Math.sqrt(1 - Math.pow(R_MINOR / R_MAJOR, 2));
  const e1sq = (e * e) / (1 - e * e);
  const x = utmX - 500000.0; // Remove 500,000 meter offset for longitude
  let y = utmY;

  if (!northernHemisphere) {
    y -= 10000000.0; // Remove 10,000,000 meter offset used for southern hemisphere
  }

  const longOrigin = (zoneNumber - 1) * 6 - 180 + 3; // Longitude of the central meridian
  const m = y / k0;
  const mu =
    m /
    (R_MAJOR *
      (1 -
        Math.pow(e, 2) / 4 -
        (3 * Math.pow(e, 4)) / 64 -
        (5 * Math.pow(e, 6)) / 256));

  const phi1Rad =
    mu +
    ((3 * e1sq) / 2 - (27 * Math.pow(e1sq, 3)) / 32) * Math.sin(2 * mu) +
    ((21 * e1sq * e1sq) / 16 - (55 * Math.pow(e1sq, 4)) / 32) *
      Math.sin(4 * mu) +
    ((151 * Math.pow(e1sq, 3)) / 96) * Math.sin(6 * mu);

  const n = R_MAJOR / Math.sqrt(1 - Math.pow(e * Math.sin(phi1Rad), 2));
  const t = Math.pow(Math.tan(phi1Rad), 2);
  const c = e1sq * Math.pow(Math.cos(phi1Rad), 2);
  const r =
    (R_MAJOR * (1 - e * e)) /
    Math.pow(1 - Math.pow(e * Math.sin(phi1Rad), 2), 1.5);
  const d = x / (n * k0);

  const latitude =
    phi1Rad -
    ((n * Math.tan(phi1Rad)) / r) *
      (Math.pow(d, 2) / 2 -
        ((5 + 3 * t + 10 * c - 4 * Math.pow(c, 2) - 9 * e1sq) *
          Math.pow(d, 4)) /
          24 +
        ((61 +
          90 * t +
          298 * c +
          45 * Math.pow(t, 2) -
          252 * e1sq -
          3 * Math.pow(c, 2)) *
          Math.pow(d, 6)) /
          720);

  const longitude =
    longOrigin +
    (d -
      ((1 + 2 * t + c) * Math.pow(d, 3)) / 6 +
      ((5 -
        2 * c +
        28 * t -
        3 * Math.pow(c, 2) +
        8 * e1sq +
        24 * Math.pow(t, 2)) *
        Math.pow(d, 5)) /
        120) /
      Math.cos(phi1Rad);

  // Convert latitude and longitude from radians to degrees
  return {
    latitude: latitude * (180 / Math.PI),
    longitude: longitude * (180 / Math.PI),
  };
};

const parseXMLFileToJSON = (xmlString) => {
  // Parse the XML string into an XML document
  const xmlDoc = new DOMParser().parseFromString(xmlString, "application/xml");

  // Handle any potential XML parsing errors
  if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
    throw new Error("Error parsing the XML file");
  }

  // Initialize an array to hold the parsed coordinates
  const coordinatesArray = [];

  // Select all <PntList3D> elements
  const pointLists = xmlDoc.getElementsByTagName("PntList3D");

  // Iterate over each <PntList3D> element and extract coordinates
  for (let i = 0; i < pointLists.length; i++) {
    const points = pointLists[i].textContent.trim().split(/\s+/);

    for (let j = 0; j < points.length; j += 3) {
      const lon = parseFloat(points[j]);
      const lat = parseFloat(points[j + 1]);
      const alt = parseFloat(points[j + 2]);

      if (!isNaN(lon) && !isNaN(lat) && !isNaN(alt)) {
        coordinatesArray.push({ lat, lon, alt });
      }
    }
  }

  // Return the array as JSON
  // return JSON.stringify(coordinatesArray, null, 2);
  return coordinatesArray;
};

const parseXMLFileToJSONCivil3D = (xmlString) => {
  // Parse the XML string into an XML document
  const xmlDoc = new DOMParser().parseFromString(xmlString, "application/xml");

  // Handle any potential XML parsing errors
  if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
    throw new Error("Error parsing the XML file");
  }

  // Initialize an array to hold the parsed coordinates
  const coordinatesArray = [];

  const x = [],
    y = [];

  const pntsElements = xmlDoc.getElementsByTagName("Pnts");

  // Iterate over each <Pnts> element and extract points
  for (let i = 0; i < pntsElements.length; i++) {
    const pElements = pntsElements[i].getElementsByTagName("P");

    // Iterate over each <P> child element
    for (let j = 0; j < pElements.length; j++) {
      const pointText = pElements[j].textContent.trim().split(/\s+/); // Split the text content by whitespace

      for (let k = 0; k < pointText.length; k += 3) {
        const northing = parseFloat(pointText[k]);
        const easting = parseFloat(pointText[k + 1]);
        const alt = parseFloat(pointText[k + 2]);

        // If using in Node.js, include proj4
        // const proj4 = require('proj4');

        // Determine the UTM zone based on easting
        const zoneNumber = Math.floor(easting / 1000000 + 1); // Calculate zone number

        // Define the UTM projection for the Northern Hemisphere
        const utmProjection = `+proj=utm +zone=${zoneNumber} +north +datum=WGS84 +units=m +no_defs`;

        // Define the WGS84 geographic projection (latitude/longitude)
        const wgs84Projection = "+proj=longlat +datum=WGS84 +no_defs";

        // Convert UTM to WGS84 (latitude and longitude)
        const [longitude, latitude] = proj4(utmProjection, wgs84Projection, [
          easting,
          northing,
        ]);

        // Print the results
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

        if (!isNaN(northing) && !isNaN(easting) && !isNaN(alt)) {
          coordinatesArray.push({
            lat: northing,
            lon: easting,
            alt,
          });
        }
      }
    }
  }

  console.info(Math.max.apply(Math, x));
  console.info(Math.max.apply(Math, y));

  return coordinatesArray;
};

export { parseXMLFileToJSON, parseXMLFileToJSONCivil3D };
