import React from "react";

export default function Progress() {
  return <progress 
    className="progress is-small is-primary" 
    max="100" 
    style={{margin:0, borderRadius: 0}}
  />;
}
