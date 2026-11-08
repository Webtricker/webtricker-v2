import React from "react";
import "./studio.css";
import "./studio-extra.css";
import { studioFontClass } from "./fonts";
import Header from "./Header";
import Footer from "./Footer";
import StudioRuntime from "./StudioRuntime";

const BLANK =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

/** Persistent frame around every public page: grain, cursor, loader, route wipe, header, footer. */
export default function StudioShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={`stu ${studioFontClass}`} data-stu-root>
      <div className="grain" aria-hidden="true" />
      <div className="cursor" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true">
        <span>View</span>
      </div>
      <div className="preview" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" src={BLANK} />
        <span>Project</span>
      </div>
      <div className="progress" aria-hidden="true" />
      <div className="wipe" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="wipe__label" aria-hidden="true" />

      <div className="loader" aria-hidden="true">
        <div className="loader__in">
          <div className="gems5">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="loader__count">0</div>
          <div className="loader__bar">
            <i />
          </div>
          <div className="mono mute">Webtricker</div>
        </div>
      </div>

      <Header />
      {children}
      <Footer />

      <button className="totop" type="button" aria-label="Back to top">
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle className="totop__bg" cx="24" cy="24" r="22" />
          <circle className="totop__fg" cx="24" cy="24" r="22" />
        </svg>
        <span aria-hidden="true">↑</span>
      </button>

      <StudioRuntime />
    </div>
  );
}
