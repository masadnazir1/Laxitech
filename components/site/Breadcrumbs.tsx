import React from 'react';
import Link from 'next/link';
import { BreadcrumbItem, getBreadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/JsonLd';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(items)} />
      <nav aria-label="Breadcrumb" className={`site-breadcrumbs ${className}`}>
        <ol className="site-breadcrumbs-list">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.item} className="site-breadcrumb-item">
                {isLast ? (
                  <span aria-current="page" className="site-breadcrumb-current">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.item} className="site-breadcrumb-link">
                      {item.name}
                    </Link>
                    <span className="site-breadcrumb-separator" aria-hidden="true">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
