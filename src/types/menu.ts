export type DbMenuType = 'header' | 'footer';
export type DbLinkTarget = '_self' | '_blank';

export interface DbMenuLink {
  label: string;
  url: string;
  target: DbLinkTarget;
}