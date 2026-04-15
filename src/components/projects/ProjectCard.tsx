import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatUSD, formatCOP, copToUsd } from '@/lib/currency';
import { ProgressRing } from '@/components/ProgressRing';
import { Progress } from '@/components/ui/progress';
import { Pencil, Trash2 } from 'lucide-react';
import type { Project } from '@/lib/types';

interface Props {
  project: Project;
  exchangeRate: number;
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, exchangeRate, onEdit, onDelete }: Props) {
  const progress = project.target_amount > 0 ? (project.current_amount / project.target_amount) * 100 : 0;
  const remaining = project.target_amount - project.current_amount;
  const isCOP = project.currency === 'COP';
  const fmt = isCOP ? formatCOP : formatUSD;

  return (
    <div className="glass-card-hover p-5 group">
      <div className="flex items-start justify-between mb-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-semibold truncate">{project.project_name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn('text-[10px] px-2 py-0.5 rounded-full', isCOP ? 'bg-accent/20 text-accent' : 'bg-success/20 text-success')}>
              {project.currency} {project.country_tag === 'CO' && '🇨🇴'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 mr-2">
            <button onClick={() => onEdit(project)} className="p-1 rounded hover:bg-secondary/50 text-muted-foreground hover:text-foreground">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDelete(project.id)} className="p-1 rounded hover:bg-secondary/50 text-muted-foreground hover:text-destructive">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <ProgressRing value={project.current_amount} max={project.target_amount} size={50} strokeWidth={4} />
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Target</span>
          <span className="font-semibold">{fmt(project.target_amount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Saved</span>
          <span className="font-semibold text-positive">{fmt(project.current_amount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Remaining</span>
          <span className="font-semibold text-negative">{fmt(remaining)}</span>
        </div>
        {isCOP && (
          <>
            <div className="flex justify-between border-t border-border/30 pt-2">
              <span className="text-muted-foreground">≈ USD Saved</span>
              <span className="font-semibold">{formatUSD(copToUsd(project.current_amount, exchangeRate))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">≈ USD Target</span>
              <span className="font-semibold">{formatUSD(copToUsd(project.target_amount, exchangeRate))}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-muted-foreground">Rate</span>
              <span>{exchangeRate.toLocaleString()} COP/USD</span>
            </div>
          </>
        )}
      </div>

      <Progress value={Math.min(progress, 100)} className="h-1.5 mt-4" />
      {project.notes && <p className="text-[10px] text-muted-foreground mt-2">{project.notes}</p>}
    </div>
  );
}
