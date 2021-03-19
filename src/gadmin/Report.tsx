import { Dialog } from "@blueprintjs/core";
import React from "react";
import IReport from "../types/IReport";

interface IReportProps {
  open: boolean
  report: IReport
}

function Report(props: IReportProps): JSX.Element {
  return (
    <Dialog isOpen={props.open}>
      
    </Dialog>
  );
}

export default Report;