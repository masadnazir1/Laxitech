const TECHNOLOGIES = [
  ['amazonwebservices', 'AWS'], ['kubernetes', 'Kubernetes'], ['docker', 'Docker'], ['terraform', 'Terraform'],
  ['typescript', 'TypeScript'], ['nextdotjs', 'Next.js'], ['python', 'Python'], ['postgresql', 'PostgreSQL'],
] as const;

export function LogoCloud() {
  return <div className="site-logo-grid">{TECHNOLOGIES.map(([id, name]) => <div key={id}><span className="site-tech-symbol" style={{ maskImage: `url(/tech-stack/${id}.svg)`, WebkitMaskImage: `url(/tech-stack/${id}.svg)` }} aria-hidden="true" /><span>{name}</span></div>)}</div>;
}
