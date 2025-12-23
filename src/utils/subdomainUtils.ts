// Subdomain detection utilities

const LOTTERY_SUBDOMAIN = 'lottery.germanexilesrl.co.uk';
const MAIN_DOMAIN = 'www.germanexilesrl.co.uk';

export const isLotterySubdomain = (): boolean => {
  const hostname = window.location.hostname;
  return hostname === LOTTERY_SUBDOMAIN || hostname === 'lottery.germanexilesrl.co.uk';
};

export const isMainDomain = (): boolean => {
  const hostname = window.location.hostname;
  return hostname === MAIN_DOMAIN || 
         hostname === 'germanexilesrl.co.uk' ||
         hostname.endsWith('.lovable.app') ||
         hostname === 'localhost';
};

export const getLotteryUrl = (path: string = ''): string => {
  // In development or on lovable.app, use relative paths
  if (window.location.hostname === 'localhost' || window.location.hostname.endsWith('.lovable.app')) {
    return `/lottery${path}`;
  }
  
  // On production, use the lottery subdomain
  return `https://${LOTTERY_SUBDOMAIN}${path}`;
};

export const getMainSiteUrl = (path: string = ''): string => {
  // In development or on lovable.app, use relative paths
  if (window.location.hostname === 'localhost' || window.location.hostname.endsWith('.lovable.app')) {
    return path || '/';
  }
  
  // On production, use the main domain
  return `https://${MAIN_DOMAIN}${path}`;
};
