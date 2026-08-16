import { useI18n } from '../../lib/i18n';

type LogoProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
};

const sizes = {
  sm: { text: 'text-xl', height: 'h-6' },
  md: { text: 'text-2xl', height: 'h-8' },
  lg: { text: 'text-3xl', height: 'h-10' },
  xl: { text: 'text-4xl', height: 'h-12' },
};

export function Logo({ className = '', size = 'md', variant = 'full' }: LogoProps) {
  const sizeConfig = sizes[size];
  const { language } = useI18n();

  if (variant === 'icon') {
    return (
      <div className={`font-extrabold ${sizeConfig.text} ${className}`}>
        <span className="bg-gradient-to-r from-xisync-blue-500 via-xisync-cyan-400 to-xisync-lime-400 bg-clip-text text-transparent">
          {language === 'zh' ? '犀' : 'X'}
        </span>
      </div>
    );
  }

  return (
    <div className={`font-extrabold tracking-tight ${sizeConfig.text} ${className}`}>
      <span className="bg-gradient-to-r from-xisync-blue-500 via-xisync-cyan-400 to-xisync-lime-400 bg-clip-text text-transparent">
        {language === 'zh' ? '犀同步' : 'XiSync'}
      </span>
    </div>
  );
}
