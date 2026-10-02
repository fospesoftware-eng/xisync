interface ChannelIconProps {
  channel: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ChannelIcon({ channel, size = 'md', className = '' }: ChannelIconProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-12 h-12 rounded-2xl',
    lg: 'w-16 h-16 rounded-3xl',
  }[size];

  const iconSize = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
  }[size];

  const gradientClass = `bg-gradient-to-br from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-500 text-white shadow-md shadow-xisync-cyan-500/20 hover:scale-105 transition-all duration-200 ${sizeClasses} flex items-center justify-center cursor-pointer flex-shrink-0 ${className}`;

  const name = channel.toLowerCase();

  const getSvgPath = () => {
    if (name.includes('meta') || name.includes('facebook') || name.includes('fb')) {
      return (
        <svg className={`${iconSize} fill-current drop-shadow-sm`} viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    }

    if (name.includes('google') || name.includes('g_')) {
      return (
        <svg className={`${iconSize} fill-current drop-shadow-sm`} viewBox="0 0 24 24">
          <path d="M12.24 10.285V13.4h6.887c-.58 3.005-3.13 5.249-6.887 5.249-4.14 0-7.5-3.36-7.5-7.5s3.36-7.5 7.5-7.5c1.9 0 3.61.71 4.93 1.89l2.4-2.4C17.29 1.48 14.92.5 12.24.5 5.81.5.57 5.74.57 12.17s5.24 11.67 11.67 11.67c6.7 0 11.13-4.71 11.13-11.33 0-.76-.08-1.5-.2-2.23H12.24z"/>
        </svg>
      );
    }

    if (name.includes('whatsapp') || name.includes('wa') || name.includes('waba')) {
      return (
        <svg className={`${iconSize} fill-current drop-shadow-sm`} viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.2 4.488L3 21l4.704-1.233a8.941 8.941 0 0 0 4.348 1.127h.004c4.947 0 8.975-4.027 8.977-8.977a8.92 8.92 0 0 0-2.63-6.284zM12.053 19.382h-.003a7.443 7.443 0 0 1-3.798-1.042l-.272-.162-2.824.74.753-2.753-.177-.282a7.447 7.447 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.417 7.417 0 0 1 5.276 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.349 7.462-7.462 7.462zm4.093-5.584c-.225-.113-1.327-.655-1.533-.73-.205-.075-.355-.112-.504.113-.15.224-.58.73-.711.879-.131.15-.262.169-.487.056-.225-.113-.949-.349-1.809-1.116-.669-.597-1.121-1.334-1.253-1.559-.131-.225-.014-.347.098-.459.102-.102.225-.262.338-.393.113-.131.15-.225.225-.375.075-.15.038-.281-.019-.394-.056-.113-.504-1.217-.691-1.666-.182-.438-.367-.378-.504-.385-.13-.007-.281-.008-.431-.008s-.393.056-.599.281c-.206.225-.786.768-.786 1.872 0 1.104.804 2.17 0.917 2.32.113.15 1.582 2.415 3.832 3.387.535.231.953.369 1.279.472.537.171 1.026.147 1.413.089.431-.064 1.327-.543 1.514-1.068.187-.525.187-.974.131-1.068-.056-.094-.206-.15-.431-.263z"/>
        </svg>
      );
    }

    if (name.includes('wechat') || name.includes('微信')) {
      return (
        <svg className={`${iconSize} fill-current drop-shadow-sm`} viewBox="0 0 24 24">
          <path d="M8.5 2C3.806 2 0 5.253 0 9.266c0 2.298 1.246 4.341 3.2 5.666l-.8 2.5 2.9-1.45c1.02.34 2.12.534 3.2.534.25 0 .5-.01.75-.03a6.29 6.29 0 0 1-.25-1.75c0-3.866 3.806-7 8.5-7 .55 0 1.08.044 1.6.125C18.3 4.417 13.9 2 8.5 2zm-2.5 4a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm5 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm6.5 4.5c-3.866 0-7 2.686-7 6s3.134 6 7 6c.94 0 1.84-.165 2.65-.466l2.36 1.176-.64-1.99c1.54-1.07 2.49-2.67 2.49-4.72 0-3.314-3.134-6-7-6zm-2.25 3.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4.5 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
      );
    }

    if (name.includes('email') || name.includes('邮件')) {
      return (
        <svg className={`${iconSize} fill-none stroke-current stroke-2 drop-shadow-sm`} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    }

    if (name.includes('instagram')) {
      return (
        <svg className={`${iconSize} fill-none stroke-current stroke-[2.2] drop-shadow-sm`} viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    }

    if (name.includes('tiktok') || name.includes('tt')) {
      return (
        <svg className={`${iconSize} fill-current drop-shadow-sm`} viewBox="0 0 24 24">
          <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743 2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 2.164 6.335 6.335 0 0 0 .524 8.784 6.336 6.336 0 0 0 8.33.15 6.34 6.34 0 0 0 2.003-4.568V8.7a8.232 8.232 0 0 0 4.77 1.486V6.686z"/>
        </svg>
      );
    }

    return (
      <span className="font-extrabold text-sm">{channel.charAt(0).toUpperCase()}</span>
    );
  };

  return (
    <div className={gradientClass} title={channel}>
      {getSvgPath()}
    </div>
  );
}
