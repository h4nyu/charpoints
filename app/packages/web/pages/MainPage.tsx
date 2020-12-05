import React, { useState } from "react";
import Header from "../components/Header";
import Tag from "../components/Tag"
import { observer } from "mobx-react-lite";
import { Map } from "immutable";
import PageLayout from "../components/PageLayout";
import store from "../store";
import { List } from "immutable";
import { keyBy } from "lodash";
import { v4 as uuid } from "uuid";
import { parseISO } from "date-fns";
import SvgCharPlot from "../components/SvgCharPlot";
import Upload from "../components/FileUpload";

const Content = observer(() => {
  const { history } = store;
  const [ mode, setMode ] = useState("Empty")
  const { charImages } = store.data.state;
  const { deleteChartImage } = store.data;
  const { init } = store.editCharImage;
  const { uploadFiles } = store.charImage;
  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateRows: "50px 1fr 110px",
        width: "100%",
        height: "100%"
      }}
    >
      <div
        style={{
          display: "flex",
          flexFlow: "row wrap",
          alignContent: "flex-start",
          gridRow: "2"
        }}
      >
        {charImages
          .toList()
          .map((x) => {
            return {
              ...x,
              points: Map((x.points || []).map((x, i) => [`${i}`, x])),
              boxes: Map((x.boxes || []).map((x, i) => [`${i}`, x])),
            };
          })
          .filter(x => {
            if(mode === "Point"){
              return x.points.size > 0
            }else if(mode === "Box"){
              return x.boxes.size > 0
            }else {
              return x.boxes.size === 0 || x.points.size === 0
            }
          })
          .sortBy((x) => -parseISO(x.createdAt))
          .sortBy((x) => x.points.size + x.boxes.size  )
          .map((x) => (
            <div className="card m-1"
              key={x.id}
              style={{
                cursor:"pointer", 
                position: "relative",
                width:128, 
                height:128,
              }}
              onClick={() => init(x.id)}
            >
              <div style={{ position: "absolute" }}>
                <SvgCharPlot
                  data={x.data}
                  size={128}
                />
              </div>
              <div style={{ position: "absolute"}}>
                {x.points.size > 0 && <Tag value="Point"/>}
                {x.boxes.size > 0 && <Tag value="Box"/>}
              </div>
            </div>
          ))}
      </div>

      <div
        style={{
          gridRow: "1"
        }}
      >
        <div className="tabs is-toggle is-fullwidth" >
          <ul>
            <li className={ mode === "Empty" && "is-active" || undefined } >
              <a onClick={() => setMode("Empty")}>Empty</a>
            </li>
            <li className={ mode === "Box" && "is-active" || undefined } >
              <a onClick={() => setMode("Box")}>Box</a>
            </li>
            <li className={ mode === "Point" && "is-active" || undefined } >
              <a onClick={() => setMode("Point")}>Points</a>
            </li>
          </ul>
        </div>
      </div>

      <div 
        style={{gridRow:"3"}}
      >
        <Upload accept={"application/json, image/*"} onChange={uploadFiles} />
      </div>
    </div>
  );
});

export default function MainPage() {
  return <PageLayout header={<Header />} content={<Content />} />;
}
