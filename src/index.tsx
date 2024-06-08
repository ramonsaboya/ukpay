import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { pdfjs } from "react-pdf";
import workerContent from "./pdf.worker.min.json";

let workerBlob = new Blob([workerContent], { type: "text/javascript" });
let workerBlobURL = URL.createObjectURL(workerBlob);

pdfjs.GlobalWorkerOptions.workerSrc = workerBlobURL;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
