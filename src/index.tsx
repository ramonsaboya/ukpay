import React from "react";
import ReactDOM from "react-dom/client";

import { pdfjs } from "react-pdf";
import workerContent from "./pdf.worker.min.json";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "src/pages/Home";
import PastTaxYear from "src/pages/PastTaxYear";
import CurrentTaxYear from "src/pages/CurrentTaxYear";
import { loadTaxYears } from "src/hmrc/tax-year";

let workerBlob = new Blob([workerContent], { type: "text/javascript" });
let workerBlobURL = URL.createObjectURL(workerBlob);

pdfjs.GlobalWorkerOptions.workerSrc = workerBlobURL;

loadTaxYears();

const router = createBrowserRouter([
  {
    path: "/ukpay/",
    element: <Home />,
  },
  {
    path: "/ukpay/past-tax-year",
    element: <PastTaxYear />,
  },
  {
    path: "/ukpay/current-tax-year",
    element: <CurrentTaxYear />,
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
