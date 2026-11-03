import Image from 'next/image';

export function LaxitechWordmark({ className = '', symbolOnly = false, monument = false }: {
  className?: string;
  symbolOnly?: boolean;
  monument?: boolean;
}) {
  if (monument) return <span className={`lx-brand-monument ${className}`}>Laxitech</span>;
  return (
    <span className={`lx-wordmark ${className}`}>
      <Image src="/brand/laxitech-symbol.webp" width={45} height={30} alt={symbolOnly ? 'Laxitech' : ''} loading="eager" />
      {!symbolOnly && <span>Laxitech</span>}
    </span>
  );
}
