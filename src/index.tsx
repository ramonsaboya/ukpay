import React from "react";
import ReactDOM from "react-dom/client";

import { pdfjs } from "react-pdf";
import workerContent from "./pdf.worker.min.json";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import Home from "src/pages/Home";
import PastTaxYear from "src/pages/PastTaxYear";

let workerBlob = new Blob([workerContent], { type: "text/javascript" });
let workerBlobURL = URL.createObjectURL(workerBlob);

pdfjs.GlobalWorkerOptions.workerSrc = workerBlobURL;

const router = createBrowserRouter([
  {
    path: "/ukpay",
    element: <Home />,
  },
  {
    path: "/past-tax-year",
    element: <PastTaxYear />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
