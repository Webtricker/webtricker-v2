type InlineNode =
  | { type: 'text'; text: string }
  | { type: 'bold'; children: InlineNode[] }
  | { type: 'link'; href: string; children: InlineNode[] }
  | { type: 'li'; children: InlineNode[] };

export type Block =
  | { type: 'paragraph'; children: InlineNode[] }
  | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; children: InlineNode[] }
  | { type: 'list'; ordered: boolean; children: InlineNode[]  }
  | { type: 'image'; width:number;height:number; src: string; alt: string }
  | { type: 'link'; href: string; children: InlineNode[]}
  | { type: 'span'; children: InlineNode[] }
  | { type: 'br' };
  