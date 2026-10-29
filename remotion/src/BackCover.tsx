// Back cover of the book, on the same page as the front (CoverPage): title over
// a rule, key facts next to a photo, the abstract, then the partner logos.

import { Img } from "remotion";
import { Barcode } from "./Barcode";
import { CORNER_WIDTH, CoverPage, resolve } from "./Cover";
import { Icon } from "./icons";
import type { BackCoverProps } from "./schema";

export function BackCover(p: BackCoverProps) {
  return (
    <CoverPage {...p} corner={p.isbn.trim() && <Barcode isbn={p.isbn} width={CORNER_WIDTH} color={p.barcodeColor} background={p.barcodeBackground} />}>
      <h1 className="back-title">{p.title}</h1>

      <div className="back-row">
        <div className="back-card back-facts">
          {p.infos.map((info, i) => (
            <div key={i} className="back-fact">
              <span className="back-label"><Icon name={info.icon} />{info.label}</span>
              <span className="back-value">{info.value}</span>
            </div>
          ))}
        </div>
        {p.photo && <Img className="back-photo" src={resolve(p.photo)} style={{ objectPosition: `50% ${p.photoFocus}%` }} />}
      </div>

      <div className="back-card back-abstract">
        <span className="back-label">{p.abstractLabel}</span>
        {p.abstract.split(/\n\s*\n/).map((paragraph, i) => <p key={i}>{paragraph}</p>)}
      </div>
    </CoverPage>
  );
}
