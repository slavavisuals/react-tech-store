import React from "react";
import loading from '../assets/loading.gif';

export default function Loading() {
  return (
      <div className="loading">
        <img src={loading} alt="loading gif" />
        <h2>loading...</h2>
      </div>
  );
}
