/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable no-useless-return */
/* eslint-disable prefer-object-spread */
/* eslint-disable no-unused-vars */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable quotes */
import { cloneDeep } from "lodash";

import {
  useElement,
  useState,
  useStaleLayout,
  useSelections,
  useRect,
  useEffect,
  useConstraints,
} from "@nebula.js/stardust";
import picassojs from "picasso.js";
import picassoQ from "picasso-plugin-q";

import properties from "./object-properties";
import data from "./data";
import picSelections from "./pic-selections";
import definition from "./pic-definition";

export default function supernova(/* env */) {
  const picasso = picassojs();
  picasso.use(picassoQ);

  return {
    qae: {
      properties,
      data,
    },
    component() {
      const selections = useSelections();
      const layout = useStaleLayout();
      const rect = useRect();
      const constraints = useConstraints();
      const element = useElement();

      const years = [
        ...new Set(
          layout.qHyperCube.qDataPages[0].qMatrix.map((item) => item[0].qText)
        ),
      ];

      const copyLayout = cloneDeep(layout);
      const lastYear = Math.max(...years);
      const bucket = 30;
      const firstYears = years.slice(0, bucket);

      const initializeData = () => {
        const initialData = copyLayout.qHyperCube.qDataPages[0].qMatrix.filter(
          (item) => firstYears.includes(item[0].qText)
        );
        copyLayout.qHyperCube.qDataPages[0].qMatrix = initialData;
        return copyLayout;
      };

      const [genData, setGenData] = useState(() => initializeData());
      const [instance, setInstance] = useState();
      const [pause, setPause] = useState(true);

      const onPlayPause = () => {
        setPause((prevState) => !prevState);
      };

      function updateData() {
        const newItems = cloneDeep(genData);

        const upcomingYear = (
          2 +
          parseInt(
            newItems.qHyperCube.qDataPages[0].qMatrix[
              newItems.qHyperCube.qDataPages[0].qMatrix.length - 1
            ][0].qText,
            10
          )
        ).toString();

        const upcomingYearData = layout.qHyperCube.qDataPages[0].qMatrix.filter(
          (item) => upcomingYear.includes(item[0].qText)
        );

        if (upcomingYearData.length) {
          const startYear =
            newItems.qHyperCube.qDataPages[0].qMatrix[0][0].qText;
          const firstYearData =
            newItems.qHyperCube.qDataPages[0].qMatrix.filter((item) =>
              startYear.includes(item[0].qText)
            );

          // const afterStartYearRemoved =
          // newItems.qHyperCube.qDataPages[0].qMatrix;

          const afterStartYearRemoved =
            newItems.qHyperCube.qDataPages[0].qMatrix.slice(
              firstYearData.length
            );

          // if (newItems.qHyperCube.qDataPages[0].qMatrix.length < 170) {
          //   afterStartYearRemoved = newItems.qHyperCube.qDataPages[0].qMatrix;
          // } else {
          //   afterStartYearRemoved =
          //     newItems.qHyperCube.qDataPages[0].qMatrix.slice(
          //       firstYearData.length
          //     );
          // }

          const afterUpcomingYearAdded =
            afterStartYearRemoved.concat(upcomingYearData);

          newItems.qHyperCube.qDataPages[0].qMatrix = afterUpcomingYearAdded;

          setTimeout(() => {
            setGenData(newItems);
          }, 200);
        } else {
          return;
        }
      }

      const onReplay = () => {
        setGenData(() => initializeData());
      };

      useEffect(() => {
        const playBtn = document.createElement("button");
        playBtn.innerText = "⏵︎Play/⏸︎Pause";
        playBtn.onclick = onPlayPause;
        playBtn.style.display = "inline-block";
        playBtn.style.margin = "0 0 0 50px";
        playBtn.style.cursor = "pointer";
        playBtn.style.backgroundColor = "#FFFFFF";
        playBtn.style.padding = "2px 5px 4px 2px";
        playBtn.style.color = "#000000";
        playBtn.style.border = "1px solid #eee";
        element.appendChild(playBtn);

        const replayBtn = document.createElement("button");
        replayBtn.innerText = "↶ Replay";
        replayBtn.onclick = onReplay;
        replayBtn.style.display = "inline-block";
        replayBtn.style.margin = "0 0 0 5px";
        replayBtn.style.cursor = "pointer";
        replayBtn.style.backgroundColor = "#FFFFFF";
        replayBtn.style.padding = "4px 5px 3px 1px";
        replayBtn.style.color = "#000000";
        replayBtn.style.border = "1px solid #eee";
        element.appendChild(replayBtn);
      }, [instance]);

      useEffect(() => {
        const p = picasso.chart({
          element,
          data: [],
          settings: {},
        });

        const s = picSelections({
          selections,
          brush: p.brush("selection"),
          picassoQ,
        });

        setInstance(p);

        return () => {
          s.release();
          p.destroy();
        };
      }, []);

      useEffect(() => {
        if (!instance) {
          return;
        }

        if (pause === false) {
          updateData();
        }

        instance.update({
          data: [
            {
              type: "q",
              key: "qHyperCube",
              data: genData.qHyperCube,
            },
          ],
          settings: definition({ copyLayout, constraints }),
        });
      }, [instance, genData, pause]);

      useEffect(() => {
        if (!instance) {
          return;
        }

        instance.update();
      }, [rect.width, rect.height, instance]);
    },
  };
}
