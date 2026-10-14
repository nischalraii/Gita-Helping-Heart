import reportsData from "../data/reports.json";
import type { ReportItem } from "../data/siteData";
import { SectionHeader } from "./SectionHeader";
import { DocIcon } from "./icons";

const reports = reportsData as ReportItem[];

export function Reports() {
  return (
    <section id="reports" className="alt">
      <div className="wrap reports-grid">
        <SectionHeader
          eyebrow="Transparency"
          title="Reports, Notices & Governance"
          text="Create a simple document library for annual reports, audit reports, notices, policies and other approved publications."
        />

        <div className="doc-list reveal">
          {reports.map((report, i) => (
            <div className="doc-row" key={report.title}>
              <span className="doc-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{report.title}</h3>
                <p>{report.text}</p>
              </div>
              <span className="doc-ico" aria-hidden="true">
                <DocIcon />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
