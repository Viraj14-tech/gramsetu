import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-[#69766F]">
      <Home className="h-3.5 w-3.5 shrink-0 text-[#236A52]" />
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${idx}`}>
            {idx > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#69766F]/60" />}
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="font-medium text-[#69766F] transition-colors hover:text-[#174C3C] hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="truncate max-w-[260px] font-semibold text-[#1E2925]">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
