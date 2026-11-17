import React from "react";

/**
 * Code-drawn, self-animating service illustrations (inline SVG, 640x400) for the Studio theme.
 * Colours come from the card's `--c` accent plus theme tokens. Motion is SMIL (<animate>) so each scene loops on its own.
 */
const A = "var(--c, var(--amber))";
const B = "var(--sky)";
const G = "var(--green)";
const R = "var(--crimson)";
const INK = "rgba(255,255,255,.16)";
const FAINT = "rgba(255,255,255,.07)";
const PANEL = "#17171b";
const TXT = "rgba(255,255,255,.55)";

const An = ({ a, v, d = 4, b = 0 }: { a: string; v: string; d?: number; b?: number }) => (
  <animate attributeName={a} values={v} dur={`${d}s`} begin={`${b}s`} repeatCount="indefinite" />
);
const Mv = ({ v, d = 4, b = 0 }: { v: string; d?: number; b?: number }) => {
  const n = v.split(";").length;
  return (
    <animateTransform
      attributeName="transform"
      type="translate"
      values={v}
      dur={`${d}s`}
      begin={`${b}s`}
      repeatCount="indefinite"
      calcMode="spline"
      keySplines={Array.from({ length: n - 1 }, () => ".45 0 .25 1").join(";")}
      keyTimes={Array.from({ length: n }, (_, i) => (i / (n - 1)).toFixed(3)).join(";")}
    />
  );
};
const Rot = ({ d = 8 }: { d?: number }) => (
  <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur={`${d}s`} repeatCount="indefinite" />
);

const Win = ({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children?: React.ReactNode }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={14} fill={PANEL} stroke={INK} />
    <circle cx={x + 18} cy={y + 17} r={4} fill={R} />
    <circle cx={x + 32} cy={y + 17} r={4} fill="var(--amber)" />
    <circle cx={x + 46} cy={y + 17} r={4} fill={G} />
    <rect x={x + 68} y={y + 10} width={w - 90} height={14} rx={7} fill={FAINT} />
    {children}
  </g>
);

const Bar = ({ x, y, w, h = 8, c = INK, d = 4, b = 0 }: { x: number; y: number; w: number; h?: number; c?: string; d?: number; b?: number }) => (
  <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={c}>
    <An a="width" v={`0;${w};${w};0`} d={d} b={b} />
  </rect>
);

const Cursor = ({ path, d = 6 }: { path: string; d?: number }) => (
  <g>
    <path d="M0 0 L0 20 L5 15.5 L9.5 25 L13.5 23 L9 14 L16 14 Z" fill="#fff" stroke="#111" strokeWidth={1.2} />
    <animateMotion dur={`${d}s`} repeatCount="indefinite" path={path} />
  </g>
);

const Pulse = ({ cx, cy, r = 30, c = A, d = 3, b = 0 }: { cx: number; cy: number; r?: number; c?: string; d?: number; b?: number }) => (
  <circle cx={cx} cy={cy} r={r} fill="none" stroke={c} strokeWidth={2}>
    <An a="r" v={`${r * 0.4};${r * 1.6}`} d={d} b={b} />
    <An a="opacity" v=".7;0" d={d} b={b} />
  </circle>
);

const Packet = ({ path, c = A, d = 3, b = 0, r = 7 }: { path: string; c?: string; d?: number; b?: number; r?: number }) => (
  <circle r={r} fill={c}>
    <animateMotion dur={`${d}s`} begin={`${b}s`} repeatCount="indefinite" path={path} />
    <An a="opacity" v="0;1;1;0" d={d} b={b} />
  </circle>
);

const Float = ({ children, y = 8, d = 5, b = 0 }: { children: React.ReactNode; y?: number; d?: number; b?: number }) => (
  <g>
    <Mv v={`0 0;0 ${-y};0 0`} d={d} b={b} />
    {children}
  </g>
);

const Tag = ({ x, y, w = 96, label, c = A }: { x: number; y: number; w?: number; label: string; c?: string }) => (
  <g>
    <rect x={x} y={y} width={w} height={32} rx={11} fill="#1e1e23" stroke={c} />
    <text x={x + w / 2} y={y + 21} textAnchor="middle" fill={c} fontSize={13} fontFamily="var(--mono, monospace)">
      {label}
    </text>
  </g>
);

const Grow = ({ x, y0, w, h, c, d = 3.4, b = 0, op = 0.85 }: { x: number; y0: number; w: number; h: number; c: string; d?: number; b?: number; op?: number }) => {
  const sp = ".45 0 .25 1;.45 0 .25 1";
  return (
    <rect x={x} y={y0} width={w} height={0} rx={4} fill={c} opacity={op}>
      <animate attributeName="height" values={`10;${h};10`} dur={`${d}s`} begin={`${b}s`} repeatCount="indefinite" calcMode="spline" keySplines={sp} />
      <animate attributeName="y" values={`${y0 - 10};${y0 - h};${y0 - 10}`} dur={`${d}s`} begin={`${b}s`} repeatCount="indefinite" calcMode="spline" keySplines={sp} />
    </rect>
  );
};

const art: Record<string, () => React.ReactElement> = {
  /* a page assembling itself while a cursor works on it */
  "web-development": () => (
    <>
      <Win x={80} y={56} w={400} h={270}>
        <rect x={108} y={100} width={344} height={92} rx={12} fill={A} opacity={0.2}>
          <An a="opacity" v=".12;.3;.12" d={4} />
        </rect>
        <Bar x={128} y={118} w={170} h={14} c={A} d={6} />
        <Bar x={128} y={142} w={120} h={14} c="rgba(255,255,255,.55)" d={6} b={0.3} />
        <rect x={128} y={166} width={80} height={14} rx={7} fill={A}>
          <An a="opacity" v="0;0;1;1;0" d={6} />
        </rect>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={108 + i * 118} y={212} width={106} height={90} rx={10} fill={FAINT} stroke={INK}>
              <An a="opacity" v="0;0;1;1;0" d={6} b={0.5 + i * 0.5} />
            </rect>
            <rect x={120 + i * 118} y={224} width={82} height={36} rx={6} fill={[B, A, G][i]} opacity={0}>
              <An a="opacity" v="0;0;.55;.55;0" d={6} b={0.7 + i * 0.5} />
            </rect>
            <Bar x={120 + i * 118} y={272} w={60} h={6} c={INK} d={6} b={1 + i * 0.5} />
          </g>
        ))}
        <Cursor path="M150 150 L330 150 L220 260 L150 150" d={6} />
      </Win>
      <Float y={10}>
        <g transform="translate(486 92)">
          <rect width={110} height={56} rx={16} fill="#1e1e23" stroke={A} />
          <text x={55} y={36} textAnchor="middle" fill={A} fontSize={24} fontFamily="var(--mono, monospace)">{"</>"}</text>
        </g>
      </Float>
      <Float y={12} b={-2}>
        <g transform="translate(500 220)">
          <path d="M26 0 L6 32 H24 L18 58 L44 22 H26 Z" fill={G} opacity={0.9} />
          <Pulse cx={26} cy={30} r={34} c={G} d={2.4} />
        </g>
      </Float>
    </>
  ),

  /* blocks snapping into a page, plugin piece orbiting */
  "wordpress-development": () => (
    <>
      <Win x={90} y={56} w={340} h={276}>
        <clipPath id="wpclip">
          <rect x={92} y={84} width={336} height={246} />
        </clipPath>
        <rect x={118} y={96} width={284} height={44} rx={10} fill={FAINT} stroke={INK} strokeDasharray="5 5" />
        <rect x={118} y={152} width={284} height={74} rx={10} fill={FAINT} stroke={INK} strokeDasharray="5 5" />
        <rect x={118} y={238} width={136} height={70} rx={10} fill={FAINT} stroke={INK} strokeDasharray="5 5" />
        <rect x={266} y={238} width={136} height={70} rx={10} fill={FAINT} stroke={INK} strokeDasharray="5 5" />
        <g clipPath="url(#wpclip)">
        <g>
          <Mv v="260 -120;0 0;0 0;260 -120" d={7} />
          <rect x={118} y={96} width={284} height={44} rx={10} fill={A} opacity={0.9} />
          <rect x={134} y={112} width={120} height={10} rx={5} fill="#17171b" opacity={0.6} />
        </g>
        <g>
          <Mv v="-260 60;-260 60;0 0;0 0;-260 60" d={7} />
          <rect x={118} y={152} width={284} height={74} rx={10} fill={B} opacity={0.35} stroke={B} />
          <circle cx={170} cy={189} r={14} fill={B} opacity={0.8} />
          <rect x={200} y={176} width={150} height={9} rx={4} fill={INK} />
          <rect x={200} y={194} width={100} height={9} rx={4} fill={INK} />
        </g>
        <g>
          <Mv v="0 200;0 200;0 0;0 0;0 200" d={7} />
          <rect x={118} y={238} width={136} height={70} rx={10} fill={G} opacity={0.4} stroke={G} />
        </g>
        <g>
          <Mv v="0 200;0 200;0 200;0 0;0 0;0 200" d={7} />
          <rect x={266} y={238} width={136} height={70} rx={10} fill={R} opacity={0.35} stroke={R} />
        </g>
        </g>
      </Win>
      <g transform="translate(520 200)">
        <circle r={62} fill="none" stroke={INK} strokeDasharray="3 7" />
        <g>
          <Rot d={9} />
          <g transform="translate(62 0)">
            <path d="M-14 -10 h10 a6 6 0 1 1 12 0 h10 v10 a6 6 0 1 1 0 12 v10 h-32 z" fill={A} />
          </g>
        </g>
        <circle r={34} fill="#1e1e23" stroke={A} strokeWidth={2} />
        <text y={13} textAnchor="middle" fill={A} fontSize={38} fontWeight={700} fontFamily="Georgia, serif">W</text>
      </g>
    </>
  ),

  /* products dropping into a cart, orders popping */
  "shopify-development": () => (
    <>
      <g transform="translate(120 70)">
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <Mv v={`${i * 74} -60;${i * 74} 100;${i * 74} 100;${i * 74} -60`} d={4.5} b={i * 0.7} />
            <rect width={58} height={58} rx={14} fill="#1e1e23" stroke={[A, B, G][i]} strokeWidth={2} />
            <path d="M14 38 l12 -14 l10 10 l8 -8" fill="none" stroke={[A, B, G][i]} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={42} cy={18} r={5} fill={[A, B, G][i]} />
          </g>
        ))}
      </g>
      <g transform="translate(100 214)">
        <path d="M0 0 H34 L58 92 H210 L238 24 H44" fill="none" stroke={A} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={80} cy={116} r={11} fill={A} />
        <circle cx={188} cy={116} r={11} fill={A} />
        <Pulse cx={120} cy={50} r={40} c={A} d={2.8} />
      </g>
      <Float y={8}>
        <g transform="translate(396 88)">
          <rect width={170} height={54} rx={16} fill="#1e1e23" stroke={G} />
          <circle cx={30} cy={27} r={12} fill={G} />
          <path d="M24 27 l5 5 l9 -10" stroke="#17171b" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x={52} y={32} fill="#fff" fontSize={16} fontWeight={700}>New order</text>
          <An a="opacity" v="0;1;1;0" d={4.5} />
        </g>
      </Float>
      <Float y={10} b={-1.5} d={6}>
        <g transform="translate(430 214)">
          <path d="M0 0 H58 L86 28 L58 56 H0 Z" fill="#1e1e23" stroke={A} strokeWidth={2} />
          <circle cx={14} cy={28} r={5} fill={A} />
          <text x={28} y={34} fill={A} fontSize={18} fontWeight={700}>$49</text>
        </g>
      </Float>
    </>
  ),

  /* one content hub feeding many channels */
  "other-cms-development": () => (
    <>
      <g transform="translate(110 200)">
        <ellipse cx={0} cy={-52} rx={52} ry={16} fill="#1e1e23" stroke={A} strokeWidth={2} />
        <path d="M-52 -52 v104 a52 16 0 0 0 104 0 v-104" fill="#1e1e23" stroke={A} strokeWidth={2} />
        <path d="M-52 -18 a52 16 0 0 0 104 0 M-52 16 a52 16 0 0 0 104 0" fill="none" stroke={A} strokeWidth={2} />
        <circle cx={26} cy={-30} r={4} fill={G}>
          <An a="opacity" v="1;.2;1" d={1.6} />
        </circle>
        <circle cx={26} cy={4} r={4} fill={B}>
          <An a="opacity" v=".2;1;.2" d={1.6} />
        </circle>
      </g>
      {([[470, 96, B, "WEB"], [470, 184, A, "APP"], [470, 272, G, "MAIL"]] as [number, number, string, string][]).map(([x, y, c, l], i) => (
        <g key={i}>
          <path d={`M170 200 C260 200 320 ${y} 450 ${y}`} fill="none" stroke={INK} strokeWidth={3} strokeDasharray="4 8" />
          <Packet path={`M170 200 C260 200 320 ${y} 450 ${y}`} c={c} d={3} b={i * 0.9} />
          <Float y={6} b={-i}>
            <Tag x={x - 10} y={y - 16} w={110} label={l} c={c} />
          </Float>
        </g>
      ))}
      <g transform="translate(250 66)">
        <Float y={8}>
          <rect width={90} height={60} rx={10} fill={FAINT} stroke={INK} />
          <rect x={10} y={12} width={50} height={7} rx={3} fill={A} />
          <rect x={10} y={28} width={70} height={6} rx={3} fill={INK} />
          <rect x={10} y={40} width={44} height={6} rx={3} fill={INK} />
        </Float>
      </g>
    </>
  ),

  /* M E R N ring with a travelling signal */
  "mern-stack-development": () => (
    <>
      <circle cx={320} cy={200} r={118} fill="none" stroke={INK} strokeWidth={3} strokeDasharray="4 9" />
      <circle cx={320} cy={200} r={118} fill="none" stroke={A} strokeWidth={4} strokeDasharray="60 681" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 320 200" to="360 320 200" dur="5s" repeatCount="indefinite" />
      </circle>
      {([["M", 320, 82, G], ["E", 438, 200, B], ["R", 320, 318, "#7dd3fc"], ["N", 202, 200, A]] as [string, number, number, string][]).map(([l, x, y, c], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <Pulse cx={0} cy={0} r={44} c={c} d={5} b={i * 1.25} />
          <polygon points="0,-34 30,-17 30,17 0,34 -30,17 -30,-17" fill="#1e1e23" stroke={c} strokeWidth={2.5} />
          <text y={9} textAnchor="middle" fill={c} fontSize={28} fontWeight={800} fontFamily="var(--mono, monospace)">{l}</text>
        </g>
      ))}
      <g transform="translate(320 200)">
        <circle r={36} fill={A} opacity={0.15}>
          <An a="r" v="32;42;32" d={3} />
        </circle>
        <text y={7} textAnchor="middle" fill={A} fontSize={18} fontFamily="var(--mono, monospace)">{"{ JS }"}</text>
      </g>
    </>
  ),

  /* request / response packets between a client and a server */
  "api-development": () => (
    <>
      <g transform="translate(70 120)">
        <rect width={130} height={160} rx={16} fill={PANEL} stroke={INK} />
        <rect x={16} y={20} width={98} height={12} rx={6} fill={FAINT} />
        <Bar x={16} y={50} w={80} d={3} c={A} />
        <Bar x={16} y={68} w={60} d={3} b={0.5} />
        <rect x={16} y={110} width={70} height={30} rx={15} fill={A} />
        <text x={51} y={130} textAnchor="middle" fill="#17171b" fontSize={13} fontWeight={700}>GET</text>
      </g>
      <g transform="translate(440 120)">
        <rect width={130} height={160} rx={16} fill={PANEL} stroke={INK} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={16} y={20 + i * 40} width={98} height={28} rx={8} fill={FAINT} stroke={INK} />
            <circle cx={32} cy={34 + i * 40} r={5} fill={G}>
              <An a="opacity" v="1;.2;1" d={1.4} b={i * 0.4} />
            </circle>
          </g>
        ))}
      </g>
      <path d="M212 170 C290 130 370 130 430 170" fill="none" stroke={INK} strokeWidth={3} strokeDasharray="4 8" />
      <path d="M430 230 C370 270 290 270 212 230" fill="none" stroke={INK} strokeWidth={3} strokeDasharray="4 8" />
      <Packet path="M212 170 C290 130 370 130 430 170" c={A} d={2.8} r={9} />
      <Packet path="M430 230 C370 270 290 270 212 230" c={G} d={2.8} b={1.4} r={9} />
      <Float y={6}>
        <g transform="translate(262 62)">
          <rect width={116} height={40} rx={12} fill="#1e1e23" stroke={G} />
          <text x={58} y={26} textAnchor="middle" fill={G} fontSize={16} fontWeight={700} fontFamily="var(--mono, monospace)">200 OK</text>
        </g>
      </Float>
      <Float y={6} b={-2}>
        <g transform="translate(262 300)">
          <rect width={116} height={40} rx={12} fill="#1e1e23" stroke={A} />
          <text x={58} y={26} textAnchor="middle" fill={A} fontSize={16} fontFamily="var(--mono, monospace)">{"{ json }"}</text>
        </g>
      </Float>
    </>
  ),

  /* live dashboard: bars, chart, ring */
  "web-app-development": () => (
    <>
      <Win x={70} y={52} w={500} h={288}>
        <rect x={92} y={96} width={104} height={220} rx={10} fill={FAINT} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={104} y={112 + i * 32} width={80} height={14} rx={7} fill={i === 1 ? A : INK}>
            {i === 1 ? <An a="opacity" v="1;.45;1" d={2} /> : null}
          </rect>
        ))}
        {[70, 110, 60, 130, 90, 150, 100].map((h, i) => (
          <Grow key={i} x={222 + i * 26} y0={300} w={16} h={h} c={i % 2 ? B : A} d={3.2} b={i * 0.25} />
        ))}
        <path d="M222 190 C260 160 290 200 330 150 S400 120 420 110" fill="none" stroke={G} strokeWidth={3} strokeLinecap="round" strokeDasharray="300" strokeDashoffset="300">
          <An a="stroke-dashoffset" v="300;0;0;300" d={5} />
        </path>
        <g transform="translate(494 150)">
          <circle r={36} fill="none" stroke={INK} strokeWidth={9} />
          <circle r={36} fill="none" stroke={A} strokeWidth={9} strokeLinecap="round" strokeDasharray="226" transform="rotate(-90)">
            <An a="stroke-dashoffset" v="226;60;226" d={5} />
          </circle>
        </g>
        <rect x={452} y={236} width={84} height={14} rx={7} fill={INK} />
        <rect x={452} y={260} width={56} height={14} rx={7} fill={INK} />
      </Win>
      <g transform="translate(548 60)">
        <circle r={14} fill={R}>
          <An a="r" v="12;16;12" d={1.6} />
        </circle>
        <text y={5} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={700}>3</text>
      </g>
    </>
  ),

  /* magnifier sweeping a results list, a result climbing to #1 */
  "seo-development": () => (
    <>
      <g transform="translate(86 70)">
        <rect width={300} height={260} rx={16} fill={PANEL} stroke={INK} />
        <rect x={20} y={18} width={260} height={30} rx={15} fill={FAINT} stroke={INK} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={24} y={68 + i * 46} width={26} height={26} rx={8} fill={i === 2 ? A : FAINT} stroke={i === 2 ? A : INK}>
              {i === 2 ? <An a="opacity" v="1;.5;1" d={2} /> : null}
            </rect>
            <text x={37} y={86 + i * 46} textAnchor="middle" fill={i === 2 ? "#17171b" : TXT} fontSize={14} fontWeight={700}>
              {i + 1}
            </text>
            <rect x={62} y={70 + i * 46} width={150 - i * 14} height={10} rx={5} fill={i === 2 ? A : INK} />
            <rect x={62} y={88 + i * 46} width={196 - i * 10} height={7} rx={3} fill={FAINT} />
          </g>
        ))}
      </g>
      <g>
        <Mv v="150 120;300 220;190 290;150 120" d={6} />
        <circle r={36} fill="rgba(255,255,255,.04)" stroke={B} strokeWidth={5} />
        <path d="M26 26 L50 50" stroke={B} strokeWidth={8} strokeLinecap="round" />
      </g>
      <g transform="translate(430 90)">
        <rect width={150} height={190} rx={16} fill={PANEL} stroke={INK} />
        {[40, 66, 96, 128].map((h, i) => (
          <Grow key={i} x={20 + i * 30} y0={170} w={20} h={h} c={G} d={3.6} b={i * 0.3} />
        ))}
        <path d="M20 54 L70 40 L100 48 L132 22" fill="none" stroke={A} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M120 20 h14 v14" fill="none" stroke={A} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Float y={8}>
        <g transform="translate(440 300)">
          <Tag x={0} y={0} w={130} label="RANK #1" c={A} />
        </g>
      </Float>
    </>
  ),

  /* megaphone broadcasting to people and likes */
  "digital-marketing": () => (
    <>
      <g transform="translate(140 200)">
        <path d="M0 -30 L90 -76 V76 L0 30 Z" fill={A} />
        <rect x={-34} y={-30} width={38} height={60} rx={10} fill="#1e1e23" stroke={A} strokeWidth={3} />
        <path d="M-14 30 l10 52 h26 l-8 -52" fill="#1e1e23" stroke={A} strokeWidth={3} strokeLinejoin="round" />
        {[0, 1, 2].map((i) => (
          <path key={i} d="M104 -52 Q144 0 104 52" fill="none" stroke={A} strokeWidth={4} strokeLinecap="round" opacity={0}>
            <animateTransform attributeName="transform" type="translate" values="0 0;70 0" dur="3s" begin={`${i}s`} repeatCount="indefinite" />
            <An a="opacity" v="0;.9;0" d={3} b={i} />
          </path>
        ))}
      </g>
      {([[400, 90, "♥", R], [470, 190, "★", A], [400, 280, "↗", G], [520, 110, "@", B]] as [number, number, string, string][]).map(([x, y, s, c], i) => (
        <Float key={i} y={14} d={4 + i} b={-i}>
          <g transform={`translate(${x} ${y})`}>
            <circle r={26} fill="#1e1e23" stroke={c} strokeWidth={2} />
            <text y={8} textAnchor="middle" fill={c} fontSize={22} fontWeight={700}>
              {s}
            </text>
            <Pulse cx={0} cy={0} r={34} c={c} d={3.2} b={i * 0.7} />
          </g>
        </Float>
      ))}
      <g transform="translate(250 330)">
        <rect width={170} height={10} rx={5} fill={FAINT} />
        <rect width={0} height={10} rx={5} fill={G}>
          <An a="width" v="0;170;170;0" d={5} />
        </rect>
      </g>
    </>
  ),

  /* editor typing, steps ticking off, cap on top */
  training: () => (
    <>
      <Win x={70} y={90} w={380} h={246}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <text x={92} y={136 + i * 28} fill={TXT} fontSize={11} fontFamily="var(--mono, monospace)" opacity={0.6}>
              {i + 1}
            </text>
            <Bar x={112 + (i % 3) * 18} y={128 + i * 28} w={[130, 180, 100, 160, 120, 90][i]} c={[A, B, G, A, B, G][i]} d={7} b={i * 0.5} />
          </g>
        ))}
        <rect x={112} y={300} width={3} height={16} fill={A}>
          <An a="opacity" v="1;0;1" d={0.9} />
        </rect>
      </Win>
      <g transform="translate(500 140)">
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(0 ${i * 70})`}>
            <circle r={24} fill="#1e1e23" stroke={[G, A, B][i]} strokeWidth={2} />
            <path d="M-9 0 l6 7 l12 -14" fill="none" stroke={[G, A, B][i]} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40" strokeDashoffset="40">
              <An a="stroke-dashoffset" v="40;40;0;0;40" d={6} b={i * 1.2} />
            </path>
            <Pulse cx={0} cy={0} r={32} c={[G, A, B][i]} d={6} b={i * 1.2} />
          </g>
        ))}
        <path d="M0 24 V46 M0 94 V116" stroke={INK} strokeWidth={3} strokeDasharray="4 6" />
      </g>
      <Float y={10}>
        <g transform="translate(250 30)">
          <path d="M0 40 l60 -26 l60 26 l-60 26 z" fill={A} />
          <path d="M22 54 v22 c0 12 76 12 76 0 v-22" fill="none" stroke={A} strokeWidth={4} />
          <path d="M112 44 v36" stroke={A} strokeWidth={3} strokeLinecap="round" />
          <circle cx={112} cy={84} r={5} fill={A} />
        </g>
      </Float>
    </>
  ),
};

export const hasArt = (slug?: string) => !!slug && slug in art;

export default function ServiceArt({ slug, label }: { slug: string; label?: string }) {
  const Draw = art[slug];
  if (!Draw) return null;
  return (
    <svg className="sart" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label={label || slug} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="sartgrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,.045)" />
        </pattern>
      </defs>
      <rect x="-400" y="-300" width="1440" height="1000" fill="url(#sartgrid)" />
      <Draw />
    </svg>
  );
}
