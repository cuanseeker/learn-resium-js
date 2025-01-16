import { useState, useEffect, useRef } from "react";

import {
  Viewer,
  Entity,
  PointGraphics,
  EntityDescription,
  ImageryLayer,
  Model,
} from "resium";
import { Cartesian3, Color, UrlTemplateImageryProvider } from "cesium";

import { parseXMLFileToJSONCivil3D } from "./Utilities/XmlParser";

const position = Cartesian3.fromDegrees(-74.0707383, 40.7117244, 1000);
const positionTwo = Cartesian3.fromDegrees(-74, 41, 1);

// Define an array of geographic coordinates [longitude, latitude, height, longitude, latitude, height, ...]
const coordinates = [
  -75.59777, 40.03883, -1,
  // Point 1
  -80.5, 35.14, 1000,
  // Point 2
  -120.84, 47.04, 1000,
  // Point 3
];

// Convert the coordinates into an array of Cartesian3 positions
const positions = Cartesian3.fromDegreesArrayHeights(coordinates);

// const imageryProvider = new UrlTemplateImageryProvider({
//   url: "https://{s}.google.com/vt/lyrs=s,h,p&x={x}&y={y}&z={z}",
//   subdomains: ["mt0", "mt1", "mt2", "mt3"], // Specify subdomains
// });

function App() {
  // const [data, setData] = useState([]);
  // const [entitySet, setEntitySet] = useState([]);

  // useEffect(() => {
  //   const entities = [];

  //   if (data.length > 0) {
  //     data.map(({ lon, lat, alt }) => {
  //       entities.push({
  //         position: Cartesian3.fromDegrees(lon, lat, alt),
  //         point: {
  //           pixelSize: 10,
  //           color: Color.RED,
  //         },
  //       });
  //     });

  //     setEntitySet(entities);
  //   }
  // }, [data]);

  // useEffect(() => {
  //   console.info(entitySet);
  // }, [entitySet]);

  // useEffect(() => {
  //   let init = true;

  //   if (init) {
  //     // const responseC3D = fetch("/DataSource/CIVIL_3D_KEDIRI_Kontur.xml")
  //     //   .then((data) => data.text())
  //     //   .then((data) => {
  //     //     // const test = parseXMLFileToJSONCivil3D(data);
  //     //     // console.info(test);
  //     //     setData(parseXMLFileToJSONCivil3D(data));
  //     //   });

  //     // const responseMc = fetch("/DataSource/mc.xml")
  //     //   .then((data) => data.text())
  //     //   .then((data) => {
  //     //     const test = parseXMLFileToJSON(data);
  //     //     console.info(test);
  //     //   });

  //     fetch("/DataSource/CIVIL_3D_KEDIRI_Kontur.xml")
  //       .then((data) => data.text())
  //       .then((data) => {
  //         setData(parseXMLFileToJSONCivil3D(data));
  //       });
  //   }

  //   return () => {
  //     init = false;
  //   };
  // }, []);

  // const viewerRef = useRef(null);

  // useEffect(() => {
  //   const viewer = viewerRef.current?.cesiumElement;

  //   if (viewer && viewer.baseLayerPicker) {
  //     console.info(viewer);
  //     console.info(viewer.baseLayerPicker);

  //     const baseLayerPickerViewModel = viewer.baseLayerPicker.viewModel;

  //     // Create a custom imagery provider
  //     const customImageryProvider = new UrlTemplateImageryProvider({
  //       url: "https://{s}.google.com/vt/lyrs=s,h,p&x={x}&y={y}&z={z}",
  //       subdomains: ["mt0", "mt1", "mt2", "mt3"],
  //     });

  //     // Create a new layer entry in the baseLayerPicker
  //     baseLayerPickerViewModel.imageryProviderViewModels.push({
  //       name: "Custom Layer asdasdasdasdsdasdas",
  //       tooltip: "Custom satellite imagery layer",
  //       iconUrl: "path/to/your/icon.png", // Optional icon for display in the picker
  //       creationFunction: () => customImageryProvider,
  //     });
  //   }
  // }, []);

  return (
    <Viewer
      full
      timeline={false}
      sceneModePicker={true}
      creditContainer={document.createElement("div")}
      animation={false}
      baseLayerPicker={true}
      // ref={viewerRef}
    >
      {/* <ImageryLayer imageryProvider={imageryProvider} /> */}
      <div className="p-5 rounded-xl bg-white absolute top-10 left-10 z-[1000]">
        <div>asdas</div>
        <div>asdas</div>
        <div>asdas</div>
        <div>asdas</div>
      </div>
      <Entity>
        <Model
          uri="./pertagas.glb" // Path to your GLTF file
          scale={1.0} // Scale of the model
          minimumPixelSize={128} // Minimum size of the model in pixels
          maximumScale={2000} // Maximum scale of the model
          position={position}
        />
      </Entity>
      <Entity position={position} name="Test 1">
        <PointGraphics pixelSize={10} />
        <EntityDescription>
          <h1>Hello, world.</h1>
          <p>JSX is available here!</p>
          <div>asdasdas</div>
        </EntityDescription>
      </Entity>
      {/* {entitySet.length > 0 &&
        entitySet.map((data, i) => <Entity key={i} {...data} />)} */}
      {positions.map((position, i) => (
        <Entity
          key={i}
          position={position}
          point={{ pixelSize: 10, color: Color.RED }} // Customize the point's appearance
          description={`Point Test ${i + 1}`} // Optional description
        />
      ))}
      <Entity position={positionTwo} name="Test 2">
        <PointGraphics pixelSize={10} />
        <EntityDescription>
          <h1>Hello, world.</h1>
          <p>JSX is available here!</p>
          <div>asdasdas</div>
        </EntityDescription>
      </Entity>
    </Viewer>
  );
}

export default App;
