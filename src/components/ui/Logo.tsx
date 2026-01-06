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

  if (variant === 'icon') {
    return (
      <div className={`font-bold ${sizeConfig.text} ${className}`}>
        <span className="bg-gradient-to-r from-xisync-blue-900 via-xisync-cyan-500 to-xisync-lime-500 bg-clip-text text-transparent">
          X
        </span>
      </div>
    );
  }

  return (
    <div className={`font-bold ${sizeConfig.text} ${className}`}>
      <span className="bg-gradient-to-r from-xisync-blue-900 via-xisync-cyan-500 to-xisync-lime-500 bg-clip-text text-transparent">
        XiSync
      </span>
    </div>
  );
}
