import React from "react";

/**
 * Code-drawn service illustrations (inline SVG, 640x400) for the Studio theme.
 * Colours come from the card's `--c` accent plus the theme tokens; motion lives in studio-extra.css (.sart).
 */
const A = "var(--c, var(--amber))";
const B = "var(--sky)";
const G = "var(--green)";
const R = "var(--crimson)";
const INK = "rgba(255,255,255,.14)";
const FAINT = "rgba(255,255,255,.07)";
const PANEL = "#17171b";

const Line = ({ x, y, w, c = "rgba(255,255,255,.14)", h = 7 }: { x: number; y: number; w: number; c?: string; h?: number }) => (
  <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={c} />
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

const Chip = ({ x, y, w = 92, label, c = A, cls = "fl" }: { x: number; y: number; w?: number; label: string; c?: string; cls?: string }) => (
  <g className={cls}>
    <rect x={x} y={y} width={w} height={34} rx={12} fill="#1e1e23" stroke={c} />
    <text x={x + w / 2} y={y + 22} textAnchor="middle" fill={c} fontSize={14} fontFamily="var(--mono, monospace)">
      {label}
    </text>
  </g>
);

const Mountain = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={10} fill={FAINT} stroke={INK} />
    <circle cx={x + w * 0.74} cy={y + h * 0.3} r={9} fill={A} opacity={0.9} />
    <path d={`M${x + 8} ${y + h - 8} L${x + w * 0.38} ${y + h * 0.42} L${x + w * 0.58} ${y + h * 0.68} L${x + w * 0.74} ${y + h * 0.52} L${x + w - 8} ${y + h - 8} Z`} fill={B} opacity={0.35} />
  </g>
);

const art: Record<string, () => React.ReactElement> = {
  "web-development": () => (
    <>
      <Win x={90} y={64} w={380} h={262}>
        <Line x={120} y={112} w={170} c={A} h={14} />
        <Line x={120} y={136} w={120} c="rgba(255,255,255,.5)" h={14} />
        <Line x={120} y={170} w={210} />
        <Line x={120} y={184} w={176} />
        <rect x={120} y={210} width={96} height={28} rx={14} fill={A} />
        <Mountain x={316} y={108} w={134} h={116} />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={120 + i * 114} y={262} width={102} height={42} rx={10} fill={FAINT} stroke={INK} />
        ))}
      </Win>
      <Chip x={440} y={40} label="</>" />
      <Chip x={410} y={310} w={118} label="responsive" c={B} cls="fl fl2" />
    </>
  ),
  "wordpress-development": () => (
    <>
      <Win x={80} y={60} w={400} h={270}>
        <rect x={100} y={96} width={92} height={214} rx={10} fill={FAINT} />
        {[0, 1, 2, 3, 4].map((i) => (
          <Line key={i} x={112} y={114 + i * 24} w={i === 1 ? 52 : 68} c={i === 1 ? A : "rgba(255,255,255,.16)"} />
        ))}
        <rect x={208} y={96} width={252} height={64} rx={10} fill={FAINT} stroke={INK} />
        <Line x={224} y={114} w={130} c={A} h={12} />
        <Line x={224} y={136} w={190} />
        {[0, 1].map((i) => (
          <g key={i}>
            <rect x={208 + i * 130} y={174} width={122} height={92} rx={10} fill={FAINT} stroke={INK} />
            <Mountain x={216 + i * 130} y={182} w={106} h={44} />
            <Line x={218 + i * 130} y={238} w={86} />
            <Line x={218 + i * 130} y={252} w={54} />
          </g>
        ))}
        <rect x={208} y={278} width={252} height={22} rx={8} fill={FAINT} />
      </Win>
      <g className="fl">
        <circle cx={508} cy={86} r={36} fill="#1e1e23" stroke={B} strokeWidth={2} />
        <text x={508} y={99} textAnchor="middle" fill={B} fontSize={38} fontFamily="Georgia, serif" fontWeight={700}>
          W
        </text>
      </g>
      <Chip x={430} y={312} w={120} label="themes · blocks" c={A} cls="fl fl2" />
    </>
  ),
  "shopify-development": () => (
    <>
      <Win x={70} y={60} w={410} h={270}>
        <Line x={96} y={100} w={90} c={A} h={12} />
        <Line x={380} y={102} w={70} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={96 + i * 124} y={132} width={112} height={150} rx={12} fill={FAINT} stroke={INK} />
            <rect x={104 + i * 124} y={140} width={96} height={72} rx={8} fill={[A, B, G][i]} opacity={0.22} />
            <circle cx={152 + i * 124} cy={176} r={14} fill={[A, B, G][i]} opacity={0.8} />
            <Line x={106 + i * 124} y={226} w={70} />
            <rect x={106 + i * 124} y={246} width={44} height={20} rx={10} fill={[A, B, G][i]} />
          </g>
        ))}
      </Win>
      <g className="fl">
        <circle cx={520} cy={96} r={34} fill="#1e1e23" stroke={A} strokeWidth={2} />
        <path d="M506 88h6l5 18h16l4-13h-24" fill="none" stroke={A} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={518} cy={113} r={2.6} fill={A} />
        <circle cx={532} cy={113} r={2.6} fill={A} />
        <circle cx={540} cy={68} r={11} fill={G} />
        <text x={540} y={73} textAnchor="middle" fill="#0b0b0d" fontSize={13} fontWeight={700} fontFamily="var(--mono, monospace)">
          3
        </text>
      </g>
      <Chip x={420} y={312} w={116} label="$ checkout" c={G} cls="fl fl2" />
    </>
  ),
  "other-cms-development": () => (
    <>
      <g className="pulse-lines" stroke={INK} strokeWidth={2} fill="none">
        <path className="dash" d="M320 200 L160 120M320 200 L480 120M320 200 L160 290M320 200 L480 290" />
      </g>
      <g>
        <rect x={250} y={160} width={140} height={80} rx={16} fill={PANEL} stroke={A} strokeWidth={2} />
        <Line x={270} y={182} w={70} c={A} h={9} />
        <Line x={270} y={202} w={100} />
        <Line x={270} y={216} w={60} />
      </g>
      {[
        [96, 84, B, "pages"],
        [416, 84, G, "media"],
        [96, 254, A, "users"],
        [416, 254, R, "plugins"],
      ].map(([x, y, c, t], i) => (
        <g key={i} className={`fl fl${(i % 3) + 1}`}>
          <rect x={x as number} y={y as number} width={128} height={64} rx={14} fill="#1e1e23" stroke={c as string} />
          <rect x={(x as number) + 14} y={(y as number) + 14} width={24} height={24} rx={7} fill={c as string} opacity={0.85} />
          <text x={(x as number) + 48} y={(y as number) + 31} fill={c as string} fontSize={14} fontFamily="var(--mono, monospace)">
            {t as string}
          </text>
          <Line x={(x as number) + 14} y={(y as number) + 46} w={92} />
        </g>
      ))}
    </>
  ),
  "mern-stack-development": () => (
    <>
      {[
        ["MongoDB", G, 296],
        ["Express", "rgba(255,255,255,.8)", 240],
        ["React", B, 184],
        ["Node.js", A, 128],
      ].map(([t, c, y], i) => (
        <g key={t as string} className={`fl fl${(i % 3) + 1}`}>
          <rect x={150} y={y as number} width={340} height={46} rx={14} fill="#1a1a1f" stroke={c as string} strokeWidth={1.5} />
          <circle cx={178} cy={(y as number) + 23} r={9} fill={c as string} opacity={0.9} />
          <text x={204} y={(y as number) + 28} fill={c as string} fontSize={16} fontFamily="var(--mono, monospace)">
            {t as string}
          </text>
          <Line x={370} y={(y as number) + 19} w={96} c={FAINT} h={8} />
        </g>
      ))}
      <path className="dash" d="M320 126 V80 M320 80 l-8 10 M320 80 l8 10" stroke={A} strokeWidth={2} fill="none" strokeLinecap="round" />
      <Chip x={100} y={60} w={110} label="full stack" c={A} />
      <Chip x={440} y={60} w={100} label="JSON" c={B} cls="fl fl2" />
    </>
  ),
  "api-development": () => (
    <>
      <g stroke={INK} strokeWidth={2} fill="none">
        <path className="dash" d="M320 200 L130 100M320 200 L510 100M320 200 L130 300M320 200 L510 300" />
      </g>
      <g>
        <circle className="ring" cx={320} cy={200} r={62} fill="none" stroke={A} opacity={0.35} />
        <circle cx={320} cy={200} r={48} fill="#1a1a1f" stroke={A} strokeWidth={2} />
        <text x={320} y={212} textAnchor="middle" fill={A} fontSize={34} fontFamily="var(--mono, monospace)" fontWeight={600}>
          {"{ }"}
        </text>
      </g>
      {[
        [130, 100, B, "GET"],
        [510, 100, G, "POST"],
        [130, 300, A, "PUT"],
        [510, 300, R, "DEL"],
      ].map(([x, y, c, t], i) => (
        <g key={i} className={`fl fl${(i % 3) + 1}`}>
          <circle cx={x as number} cy={y as number} r={34} fill="#1e1e23" stroke={c as string} strokeWidth={1.5} />
          <text x={x as number} y={(y as number) + 5} textAnchor="middle" fill={c as string} fontSize={14} fontFamily="var(--mono, monospace)">
            {t as string}
          </text>
        </g>
      ))}
      <Chip x={268} y={300} w={104} label="200 OK" c={G} cls="fl fl2" />
    </>
  ),
  "web-app-development": () => (
    <>
      <Win x={70} y={56} w={500} h={288}>
        <rect x={86} y={90} width={92} height={238} rx={10} fill={FAINT} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={98} y={106 + i * 30} width={14} height={14} rx={4} fill={i === 0 ? A : "rgba(255,255,255,.22)"} />
            <Line x={120} y={109 + i * 30} w={44} c={i === 0 ? A : "rgba(255,255,255,.14)"} />
          </g>
        ))}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={194 + i * 122} y={90} width={112} height={56} rx={10} fill={FAINT} stroke={INK} />
            <Line x={206 + i * 122} y={104} w={44} />
            <Line x={206 + i * 122} y={122} w={64} c={[A, B, G][i]} h={12} />
          </g>
        ))}
        <rect x={194} y={160} width={236} height={168} rx={10} fill={FAINT} stroke={INK} />
        <path className="draw" d="M206 300 L252 262 L292 280 L340 222 L384 240 L420 190" fill="none" stroke={A} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M206 300 L252 262 L292 280 L340 222 L384 240 L420 190 V318 H206 Z" fill={A} opacity={0.1} />
        <rect x={442} y={160} width={116} height={168} rx={10} fill={FAINT} stroke={INK} />
        <circle cx={500} cy={226} r={34} fill="none" stroke={INK} strokeWidth={12} />
        <circle className="ring" cx={500} cy={226} r={34} fill="none" stroke={B} strokeWidth={12} strokeDasharray="130 214" transform="rotate(-90 500 226)" />
        <Line x={458} y={284} w={84} />
        <Line x={458} y={300} w={56} />
      </Win>
      <Chip x={450} y={30} w={110} label="real-time" c={G} />
    </>
  ),
  "seo-development": () => (
    <>
      <g>
        <rect x={70} y={70} width={330} height={44} rx={22} fill={PANEL} stroke={A} strokeWidth={1.5} />
        <circle cx={100} cy={92} r={8} fill="none" stroke={A} strokeWidth={2} />
        <path d="M106 98l7 7" stroke={A} strokeWidth={2} strokeLinecap="round" />
        <Line x={126} y={88} w={140} c="rgba(255,255,255,.3)" h={9} />
      </g>
      {[0, 1, 2].map((i) => (
        <g key={i} className={i === 0 ? "" : ""}>
          <rect x={70} y={134 + i * 66} width={330} height={56} rx={12} fill={i === 0 ? "#1d1d22" : PANEL} stroke={i === 0 ? G : INK} />
          <Line x={88} y={150 + i * 66} w={i === 0 ? 150 : 120} c={i === 0 ? B : "rgba(255,255,255,.3)"} h={9} />
          <Line x={88} y={168 + i * 66} w={250} h={6} />
          <text x={374} y={172 + i * 66} textAnchor="end" fill={i === 0 ? G : "rgba(255,255,255,.4)"} fontSize={16} fontFamily="var(--mono, monospace)">
            #{i + 1}
          </text>
        </g>
      ))}
      <g>
        <rect x={426} y={96} width={160} height={196} rx={16} fill={PANEL} stroke={INK} />
        {[0, 1, 2, 3].map((i) => (
          <rect className="grow" key={i} style={{ animationDelay: `${i * 0.15}s` }} x={444 + i * 34} y={268 - (i + 1) * 38} width={22} height={(i + 1) * 38} rx={6} fill={i === 3 ? G : A} opacity={i === 3 ? 1 : 0.5 + i * 0.12} />
        ))}
      </g>
      <g className="fl">
        <circle cx={540} cy={86} r={30} fill="#1e1e23" stroke={G} strokeWidth={2} />
        <path d="M526 94l10-10 8 8 12-14" fill="none" stroke={G} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </>
  ),
  "digital-marketing": () => (
    <>
      <g>
        <path d="M110 80 H400 L360 150 H150 Z" fill={B} opacity={0.22} stroke={B} />
        <path d="M150 160 H360 L330 226 H180 Z" fill={A} opacity={0.26} stroke={A} />
        <path d="M180 236 H330 L305 300 H205 Z" fill={G} opacity={0.3} stroke={G} />
        <text x={255} y={122} textAnchor="middle" fill="#e9e7e1" fontSize={15} fontFamily="var(--mono, monospace)">
          reach
        </text>
        <text x={255} y={198} textAnchor="middle" fill="#e9e7e1" fontSize={15} fontFamily="var(--mono, monospace)">
          leads
        </text>
        <text x={255} y={272} textAnchor="middle" fill="#e9e7e1" fontSize={15} fontFamily="var(--mono, monospace)">
          sales
        </text>
      </g>
      <g>
        <rect x={430} y={80} width={150} height={220} rx={16} fill={PANEL} stroke={INK} />
        <Line x={448} y={98} w={60} />
        <text x={448} y={140} fill={A} fontSize={30} fontFamily="var(--mono, monospace)" fontWeight={600}>
          +248%
        </text>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect className="grow" key={i} style={{ animationDelay: `${i * 0.12}s` }} x={448 + i * 26} y={270 - [30, 48, 40, 70, 96][i]} width={16} height={[30, 48, 40, 70, 96][i]} rx={5} fill={i === 4 ? G : B} opacity={0.5 + i * 0.1} />
        ))}
      </g>
      <Chip x={60} y={320} w={110} label="ROI ↑" c={G} />
      <Chip x={190} y={330} w={104} label="CTR 4.8%" c={B} cls="fl fl2" />
    </>
  ),
  training: () => (
    <>
      <Win x={60} y={60} w={330} h={250}>
        {[
          [90, 108, 120, A],
          [106, 128, 90, "rgba(255,255,255,.3)"],
          [106, 148, 140, B],
          [106, 168, 70, "rgba(255,255,255,.3)"],
          [90, 188, 100, G],
          [106, 208, 130, "rgba(255,255,255,.3)"],
          [90, 228, 60, A],
        ].map(([x, y, w, c], i) => (
          <g key={i}>
            <text x={78} y={(y as number) + 6} fill="rgba(255,255,255,.25)" fontSize={11} fontFamily="var(--mono, monospace)" textAnchor="end">
              {i + 1}
            </text>
            <Line x={x as number} y={y as number} w={w as number} c={c as string} h={8} />
          </g>
        ))}
        <rect className="caret" x={152} y={224} width={3} height={16} fill={A} />
      </Win>
      <g>
        <path className="dash" d="M440 320 C440 260 560 260 560 200 C560 150 440 150 440 100" stroke={INK} strokeWidth={3} fill="none" strokeDasharray="4 8" />
        {[
          [440, 320, G],
          [560, 200, A],
          [440, 100, B],
        ].map(([x, y, c], i) => (
          <g key={i} className={`fl fl${(i % 3) + 1}`}>
            <circle cx={x as number} cy={y as number} r={24} fill="#1e1e23" stroke={c as string} strokeWidth={2} />
            <path d={`M${(x as number) - 8} ${y} l6 6 l10 -12`} fill="none" stroke={c as string} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}
      </g>
      <g className="fl">
        <path d="M486 56 l44 -20 l44 20 l-44 20 z" fill={A} />
        <path d="M502 70 v16 c0 8 56 8 56 0 v-16" fill="none" stroke={A} strokeWidth={3} />
      </g>
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
