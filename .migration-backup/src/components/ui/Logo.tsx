import { useI18n } from '../../lib/i18n';

type LogoProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'mark';
  color?: 'ink' | 'brand' | 'white' | 'gradient';
};

const sizes = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
};

const solidColors = {
  ink: 'text-ink-950',
  brand: 'text-brand-700',
  white: 'text-white',
};

export function Logo({ className = '', size = 'md', color = 'ink' }: LogoProps) {
  const { language } = useI18n();
  const isZh = language === 'zh';
  const sizeClass = sizes[size];
  const isGradient = color === 'gradient';

  return (
    <span
      className={`inline-block font-logo font-extrabold leading-none ${sizeClass} ${
        isZh ? 'tracking-[0.02em]' : 'tracking-[-0.03em]'
      } ${className} ${
        isGradient
          ? 'bg-gradient-to-r from-xisync-blue-700 via-xisync-cyan-600 to-xisync-green-500 bg-clip-text text-transparent'
          : solidColors[color as 'ink' | 'brand' | 'white']
      }`}
    >
      {isZh ? '犀同步' : 'XiSync'}
    </span>
  );
}
