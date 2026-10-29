// EAN-13 barcode of an ISBN, as printed on the back of a book: the ISBN in
// text above, the bars, and the 13 digits under them.

// Encodings of the digits 0-9: L and G on the left half, R on the right.
const L = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
const G = ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"];
const R = ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"];
// The first digit is not drawn: it sets which left digits use G instead of L.
const PARITY = ["LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG", "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"];

const eanCheck = (twelve: string) =>
  (10 - ([...twelve].reduce((sum, d, i) => sum + Number(d) * (i % 2 ? 3 : 1), 0) % 10)) % 10;

/**
 * The 13 digits of the EAN of an ISBN, or null if it is not valid.
 * Accepts an ISBN-13 (or its first 12 digits: the check digit is added) and
 * an ISBN-10, with or without hyphens and spaces.
 */
export function isbnToEan(isbn: string): string | null {
  const raw = isbn.replace(/[\s-]/g, "").toUpperCase();
  if (/^\d{12}$/.test(raw)) return raw + eanCheck(raw);
  if (/^\d{13}$/.test(raw)) return eanCheck(raw.slice(0, 12)) === Number(raw[12]) ? raw : null;
  if (/^\d{9}[\dX]$/.test(raw)) {
    const sum = [...raw].reduce((s, c, i) => s + (c === "X" ? 10 : Number(c)) * (10 - i), 0);
    if (sum % 11 !== 0) return null;
    const twelve = "978" + raw.slice(0, 9);
    return twelve + eanCheck(twelve);
  }
  return null;
}

/** The 95 modules of an EAN-13, "1" for a bar. */
function modules(ean: string): string {
  const d = [...ean].map(Number);
  const left = d.slice(1, 7).map((n, i) => (PARITY[d[0]][i] === "L" ? L : G)[n]).join("");
  const right = d.slice(7).map((n) => R[n]).join("");
  return `101${left}01010${right}101`;
}

// In modules: quiet zones, bar heights (guards go lower), digits under them.
const QUIET_LEFT = 11;
const QUIET_RIGHT = 7;
const BAR = 60;
const GUARD = 65;
const GUARDS = new Set([0, 1, 2, 45, 46, 47, 48, 49, 92, 93, 94]);

export function Barcode({ isbn, width, color, background }: {
  isbn: string;
  width: number;
  color: string;
  background: string;
}) {
  const ean = isbnToEan(isbn);
  if (!ean) return <div className="barcode barcode--invalid" style={{ background }}>Invalid ISBN: {isbn}</div>;

  const bits = modules(ean);
  const total = QUIET_LEFT + bits.length + QUIET_RIGHT;
  const bars = [...bits].flatMap((bit, i) =>
    bit === "1" ? [`M${QUIET_LEFT + i} 0h1v${GUARDS.has(i) ? GUARD : BAR}h-1z`] : [],
  );
  const digit = (char: string, x: number, key: number) => (
    <text key={key} x={x} y={BAR + 9.5} textAnchor="middle">{char}</text>
  );

  return (
    <div className="barcode" style={{ width, color, background }}>
      <span className="barcode-isbn">ISBN {isbn.trim()}</span>
      <svg viewBox={`0 0 ${total} ${BAR + 11}`} shapeRendering="crispEdges" role="img" aria-label={`EAN ${ean}`}>
        <path d={bars.join("")} />
        {digit(ean[0], QUIET_LEFT / 2, 0)}
        {[...ean.slice(1, 7)].map((c, i) => digit(c, QUIET_LEFT + 3 + 7 * i + 3.5, i + 1))}
        {[...ean.slice(7)].map((c, i) => digit(c, QUIET_LEFT + 50 + 7 * i + 3.5, i + 7))}
      </svg>
    </div>
  );
}
