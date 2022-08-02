import "ol/ol.css";
import { useEffect, useRef } from "react";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import View from "ol/View";
import XYZ from "ol/source/XYZ";
import { Feature } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Point from "ol/geom/Point";
import { Coordinate } from "ol/coordinate";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import { Circle as CircleStyle, Stroke } from "ol/style";

/**
 * No SSR
 */
const Atlas = () => {
  const mapEl = useRef(null);

  useEffect(() => {
    const map = new Map({
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
          }),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    const layer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({
            color: "#6ab04c",
          }),
          stroke: new Stroke({
            color: "white",
            width: 2,
          }),
        }),
      }),
    });

    map.addLayer(layer);

    map.setTarget(mapEl.current as unknown as HTMLElement);

    map.addEventListener("singleclick", (event: any) => {
      const result = confirm("Do you want to add a marker?");

      if (!result) return;

      fetch(`/api/point`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coord: event.coordinate,
        }),
      }).then(getPoints);
    });

    const getPoints = () =>
      fetch(`/api/point`)
        .then((response) => response.json())
        .then((points) =>
          points.map((coord: Coordinate) => new Feature(new Point(coord)))
        )
        .then((features) => {
          layer.getSource()?.clear();
          layer.getSource()?.addFeatures(features);
        });

    getPoints();

    return () => map.dispose();
  }, []);

  return (
    <div>
      <div
        style={{
          width: "100vw",
          height: "100vh",
        }}
        ref={mapEl}
      />
    </div>
  );
};

export default Atlas;
