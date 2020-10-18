import React from "react";

export default function Hero({children}) {
  return <div className="hero">
    <div className="banner">
      <h1>Sample heading text</h1>
      <p>Sample paragraph text</p>
      {children}
    </div>
  </div>;
}
