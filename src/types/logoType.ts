export interface IDefaultSiteLogos {
  lightLargeLogo: string;
  darkLargeLogo: string;
  smallLogo: string;
}

// Main document interface
export interface ISiteLogos {
  lightLargeLogo: string;
  darkLargeLogo: string;
  smallLogo: string;
  defaultLogos: IDefaultSiteLogos;
  createdAt: Date;
  updatedAt: Date;
}