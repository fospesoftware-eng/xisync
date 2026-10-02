interface LogoProps {
  className?: string;
  size?: number;
}

export function GoogleAdsLogo({ className = '', size = 20 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${className}`}>
      <path d="M4.32 15.65a5.82 5.82 0 0 1-1.32-3.65c0-3.21 2.61-5.82 5.82-5.82 1.3 0 2.5.42 3.47 1.13l2.84-2.84A9.78 9.78 0 0 0 8.82 2.2C4.05 2.2.18 6.07.18 10.84c0 1.94.57 3.75 1.55 5.27l2.59-.46z" fill="#EA4335" />
      <path d="M23.18 12c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.17-2 3.4-4.94 3.4-8.7z" fill="#4285F4" />
      <path d="M21.5 5.5l-9.8 17-3.4-2 9.8-17 3.4 2z" fill="#FBBC04" />
      <path d="M18.1 3.5a3.9 3.9 0 1 0-5.5 5.5 3.9 3.9 0 0 0 5.5-5.5z" fill="#4285F4" />
    </svg>
  );
}

export function MetaLogo({ className = '', size = 20 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${className}`}>
      <path
        d="M12 2C6.48 2 2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.5C10 7.01 11.49 5.6 13.72 5.6c1.07 0 2.18.19 2.18.19v2.4h-1.23c-1.23 0-1.62.77-1.62 1.56V12h2.72l-.43 3h-2.29v6.8C18.56 20.87 22 16.84 22 12c0-5.52-4.48-10-10-10z"
        fill="#1877F2"
      />
    </svg>
  );
}

export function InstagramLogo({ className = '', size = 20 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${className}`}>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig-grad)" />
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
      <defs>
        <linearGradient id="ig-grad" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD600" />
          <stop offset="0.3" stopColor="#FF0100" />
          <stop offset="0.7" stopColor="#D800B9" />
          <stop offset="1" stopColor="#7000FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function TikTokLogo({ className = '', size = 20 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${className}`}>
      <rect width="24" height="24" rx="6" fill="#000000" />
      <path
        d="M16.6 8.2c-1.1-.7-1.8-1.9-2-3.2h-2.4v10.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5c0-1.4 1.1-2.5 2.5-2.5.3 0 .5.1.7.2V10.7c-.2 0-.5-.1-.7-.1-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5V9.4c1.2.9 2.7 1.4 4.2 1.4V8.4c-.6 0-1.2-.1-1.8-.2z"
        fill="white"
      />
      <path
        d="M16.6 8.2c-.6-.4-1.1-.9-1.4-1.5v.3c.3.6.8 1.1 1.4 1.2z"
        fill="#25F4EE"
      />
      <path
        d="M12.2 15.5v-10.5h.3v10.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5c0-.4.1-.7.3-1-.3.3-.5.7-.5 1 0 1.4 1.1 2.5 2.5 2.5s2.4-1.1 2.4-2.5z"
        fill="#FE2C55"
      />
    </svg>
  );
}

export function WeChatLogo({ className = '', size = 20 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${className}`}>
      <rect width="24" height="24" rx="6" fill="#07C160" />
      <path
        d="M9.5 5.5c-3.6 0-6.5 2.5-6.5 5.5 0 1.8 1 3.3 2.5 4.3l-.6 1.9 2.2-1.1c.8.2 1.6.4 2.4.4.2 0 .4 0 .6-.1-.2-.6-.2-1.2-.2-1.9 0-3.3 3.1-6 7-6 .4 0 .7 0 1.1.1C16.8 6.9 13.4 5.5 9.5 5.5zm-2 3.5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm4 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"
        fill="white"
      />
      <path
        d="M15.5 10.5c-3 0-5.5 2.2-5.5 5s2.5 5 5.5 5c.7 0 1.4-.1 2-.3l1.8.9-.5-1.6c1.3-.9 2.2-2.3 2.2-4 0-2.8-2.5-5-5.5-5zm-1.8 3c.5 0 .8.4.8.8s-.3.8-.8.8-.8-.4-.8-.8.3-.8.8-.8zm3.5 0c.5 0 .8.4.8.8s-.3.8-.8.8-.8-.4-.8-.8.3-.8.8-.8z"
        fill="white"
      />
    </svg>
  );
}

export function AlipayLogo({ className = '', size = 20 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${className}`}>
      <rect width="24" height="24" rx="6" fill="#1677FF" />
      <path
        d="M18.2 14.8c-.8-.4-2.1-1.1-3.6-1.8 1.1-1.9 1.9-4.1 2.2-5.5H13V6.2h5.2V5h-5.2V3.5h-1.5V5H6.2v1.2h5.3v1.3H7.8v1.2h7.3c-.3 1.1-.9 2.7-1.7 4.2-2.1-.7-4-.7-5.3-.2-1.8.7-2.7 2.2-2.4 3.7.3 1.4 1.6 2.4 3.6 2.4 2.2 0 4.2-1.3 5.6-3.4 1.5.8 2.8 1.5 3.6 2l1.3-1.6zm-11.4 1.5c-.2-.7.2-1.4 1.2-1.8.8-.3 2.2-.3 3.8.3-1.1 1.7-2.6 2.7-4.1 2.7-1.1 0-1.8-.5-1.9-1.2h1z"
        fill="white"
      />
    </svg>
  );
}
