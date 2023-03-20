/* eslint-disable consistent-return */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable quotes */
import * as d3 from "d3";

export default function ({
  layout, // eslint-disable-line no-unused-vars
  context, // eslint-disable-line no-unused-vars
}) {
  const colorScale = d3
    .scaleOrdinal()
    .domain([
      "All disasters",
      "Flood",
      "Extreme weather",
      "Drought",
      "Dry mass movement",
      "Earthquake",
      "Extreme temperature",
      "Fog",
      "Glacial lake outburst",
      "Landslide",
      "Volcanic activity",
      "Wildfire",
    ])
    .range([
      "#87205D",
      "#0066b2",
      "#10CFC9",
      "#D3D3D3",
      "#C0C0C0",
      "#A9A9A9",
      "#696969",
      "#778899",
      "#708090",
      "#555555",
      "#2F4F4F",
      "#666A6D",
    ]);
  return {
    scales: {
      y: {
        data: {
          field: "qMeasureInfo/0",
        },
        invert: true,
        // expand: 0.2,
        expand: 0.02,
      },
      y2: {
        data: {
          field: "qMeasureInfo/1",
        },
        invert: true,
        // expand: 0.2,
        expand: 0.02,
      },
      t: {
        data: {
          extract: {
            field: "qDimensionInfo/0",
          },
        },
      },
      color: {
        data: {
          extract: {
            field: "qDimensionInfo/1",
          },
        },
        type: "color",
      },
    },
    components: [
      {
        type: "axis",
        dock: "left",
        scale: "y",
      },
      {
        type: "axis",
        dock: "right",
        scale: "y2",
        formatter: {
          type: "d3-number",
          format: "0.1s",
        },
      },
      {
        type: "axis",
        dock: "bottom",
        scale: "t",
        settings: {
          labels: {
            mode: "tilted",
            tiltAngle: 25,
          },
        },
      },
      {
        key: "legend",
        type: "legend-cat",
        scale: {
          data: [
            "All disasters",
            "Flood",
            "Extreme weather",
            "Drought",
            "Dry mass movement",
            "Earthquake",
            "Extreme temperature",
            "Fog",
            "Glacial lake outburst",
            "Landslide",
            "Volcanic activity",
            "Wildfire",
          ],
          range: [
            "#87205D",
            "#0066b2",
            "#10CFC9",
            "#D3D3D3",
            "#C0C0C0",
            "#A9A9A9",
            "#696969",
            "#778899",
            "#708090",
            "#555555",
            "#2F4F4F",
            "#666A6D",
          ],
          type: "categorical-color",
        },
        settings: {
          layout: { size: 4 },
          item: {
            show: true,
            label: {
              fontSize: "20px",
              // lineHeight: "1",
              // wordBreak: "break-all",
              maxWidth: 230,
            },
          },
        },
        dock: "right",
      },
      {
        key: "lines",
        type: "line",
        data: {
          extract: {
            field: "qDimensionInfo/0",
            props: {
              v: {
                field: "qMeasureInfo/0",
              },
              series: {
                field: "qDimensionInfo/1",
              },
            },
          },
        },
        settings: {
          coordinates: {
            major: {
              scale: "t",
            },
            minor: {
              scale: "y",
              ref: "v",
            },
            layerId: {
              ref: "series",
            },
          },
          orientation: "horizontal",
          layers: {
            curve: "monotone",
            line: {
              show: false,
              // stroke: {
              //   scale: "color",
              //   ref: "series",
              // },
              // strokeWidth: 4,
              // opacity: 0.8,
            },
            area: {
              // fill: { scale: "color", ref: "series" },
              fill: (d) => colorScale(d.datum.series.label),
              opacity: 1,
            },
          },
        },
      },
      // {
      //   key: "p",
      //   type: "point",
      //   data: {
      //     extract: {
      //       field: "qDimensionInfo/0",
      //       props: {
      //         v: { field: "qMeasureInfo/0" },
      //         series: { field: "qDimensionInfo/1" },
      //         pop: {
      //           field: "qMeasureInfo/1",
      //         },
      //       },
      //     },
      //   },
      //   settings: {
      //     x: { scale: "t" },
      //     y: { scale: "y", ref: "v" },
      //     shape: "circle",
      //     // size: (d) => {
      //     //   if (d.datum.label === "1951") {
      //     //     return 0.8;
      //     //   }
      //     //   return 0.2;
      //     // },
      //     size: 0.26,
      //     strokeWidth: 0.3,
      //     fill: (d) => {
      //       if (d.datum.series.label === "All disasters") {
      //         return colorScale(d.datum.series.label);
      //       }
      //     },
      //     opacity: (d) => {
      //       if (d.datum.series.label !== "All disasters") return 0;
      //     },
      //     // fill: (d) => colorScale(d.datum.series.label),
      //   },
      // },
      {
        key: "linepop",
        type: "line",
        data: {
          extract: {
            field: "qDimensionInfo/0",
            props: {
              pop: {
                field: "qMeasureInfo/1",
              },
            },
          },
        },
        settings: {
          coordinates: {
            major: { scale: "t" },
            minor: {
              scale: "y2",
              ref: "pop",
            },
          },
          layers: {
            curve: "monotone",
            line: {
              stroke: "#060",
              strokeWidth: 4.2,
              strokeDasharray: "10 5",
            },
          },
        },
      },
      // {
      //   key: "tooltip",
      //   type: "tooltip",
      //   displayOrder: 10,
      //   settings: {
      //     // Since we only want to target the point marker
      //     filter: (nodes) => nodes.filter((node) => node.type === "circle"),
      //     // Create the data model
      //     extract: ({ node }) => {
      //       const obj = {};
      //       obj.dim1 = node.data.label;
      //       obj.dim2 = node.data.series.label;
      //       obj.meas = node.data.v.value;
      //       obj.pop = node.data.pop.value;
      //       return obj;
      //     },
      //     content: ({ h, data }) => {
      //       const els = [];

      //       data.forEach((node) => {
      //         // Title
      //         const elh = h(
      //           "div",
      //           {
      //             style: {
      //               fontSize: "16px",
      //               fontWeight: "bold",
      //               "text-align": "left",
      //               padding: "0 5px",
      //             },
      //           },
      //           node.dim1
      //         );

      //         const el1 = h(
      //           "td",
      //           { style: { fontSize: "16px", padding: "0 5px" } },
      //           node.dim2
      //         );
      //         const el2 = h(
      //           "td",
      //           { style: { fontSize: "16px", padding: "0 5px" } },
      //           node.meas
      //         );

      //         const el3 = h(
      //           "td",
      //           { style: { fontSize: "16px", padding: "0 5px" } },
      //           "Population"
      //         );
      //         const el4 = h(
      //           "td",
      //           { style: { fontSize: "16px", padding: "0 5px" } },
      //           d3.format("0.2s")(node.pop).replace("G", " B")
      //         );

      //         const elr1 = h("tr", {}, [el1, el2]);
      //         const elr2 = h("tr", {}, [el3, el4]);
      //         els.push(elh, elr1, elr2);
      //       });

      //       return h("table", { style: { padding: 1 } }, els);
      //     },
      //     placement: {
      //       type: "pointer",
      //       dock: "auto",
      //       area: "target",
      //     },
      //   },
      // },
    ],
    interactions: [
      // {
      //   type: "native",
      //   events: {
      //     mousemove(e) {
      //       this.chart.component("tooltip").emit("show", e);
      //     },
      //     mouseleave() {
      //       this.chart.component("tooltip").emit("hide");
      //     },
      //   },
      // },
    ],
  };
}
