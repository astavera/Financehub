import { useAppStore } from '@/lib/store';
import { formatUSD, formatCOP, copToUsd } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Globe, DollarSign, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';
import { Progress } from '@/components/ui/progress';
import type { Project } from '@/lib/types';
import { toast } from 'sonner';

export default function Projects() {
  const { projects, addProject, updateProject, deleteProject, exchangeRate } = useAppStore();
  const [viewMode, setViewMode] = useState<'both' | 'COP' | 'USD'>('both');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const usdProjects = projects.filter((p) => p.currency === 'USD');
  const copProjects = projects.filter((p) => p.currency === 'COP');
  const rate = exchangeRate.rate_cop_per_usd;

  const totalCopTarget = copProjects.reduce((s, p) => s + p.target_amount, 0);
  const totalCopSaved = copProjects.reduce((s, p) => s + p.current_amount, 0);

  const handleSave = (data: Omit<Project, 'id'>) => {
    if (editingProject) {
      updateProject(editingProject.id, data);
      toast.success('Goal updated');
    } else {
      addProject({ ...data, id: `p-${Date.now()}` } as Project);
      toast.success('Goal created');
    }
    setEditingProject(null);
  };

  const handleEdit = (p: Project) => {
    setEditingProject(p);
    setShowForm(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight mb-1">Projects & Goals</h1>
          <p className="text-muted-foreground text-sm">Track your savings goals across currencies</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-secondary/30 rounded-xl p-1">
            {(['both', 'USD', 'COP'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn('px-3 py-1.5 text-xs font-medium rounded-lg transition-colors', viewMode === mode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
              >
                {mode === 'both' ? 'Both' : mode}
              </button>
            ))}
          </div>
          <Button size="sm" className="gap-2" onClick={() => { setEditingProject(null); setShowForm(true); }}>
            <Plus className="w-4 h-4" /> Add Goal
          </Button>
        </div>
      </div>

      {/* Colombia Summary */}
      {viewMode !== 'USD' && copProjects.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-accent" />
            <h3 className="font-display font-semibold">Colombia Goals Summary</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent ml-2">Rate: {rate.toLocaleString()} COP/USD</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-secondary/30 rounded-xl p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase">Total Target</p>
              <p className="font-display font-bold">{formatCOP(totalCopTarget)}</p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase">Total Saved</p>
              <p className="font-display font-bold text-positive">{formatCOP(totalCopSaved)}</p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase">≈ USD Saved</p>
              <p className="font-display font-bold">{formatUSD(copToUsd(totalCopSaved, rate))}</p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-3 text-center">
              <p className="text-[10px] text-muted-foreground uppercase">Progress</p>
              <p className="font-display font-bold">{totalCopTarget > 0 ? ((totalCopSaved / totalCopTarget) * 100).toFixed(1) : 0}%</p>
            </div>
          </div>
          <Progress value={totalCopTarget > 0 ? (totalCopSaved / totalCopTarget) * 100 : 0} className="h-2" />
        </div>
      )}

      {/* USD Goals */}
      {viewMode !== 'COP' && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-success" />
            <h2 className="font-display font-semibold text-xl">USD Goals</h2>
            <span className="text-xs text-muted-foreground">({usdProjects.length})</span>
          </div>
          {usdProjects.length === 0 ? (
            <div className="glass-card p-8 text-center text-muted-foreground text-sm">No USD goals yet. Add one above!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {usdProjects.map((p) => (
                <ProjectCard key={p.id} project={p} exchangeRate={rate} onEdit={handleEdit} onDelete={setDeleteId} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* COP Goals */}
      {viewMode !== 'USD' && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-accent" />
            <h2 className="font-display font-semibold text-xl">Colombia Goals (COP) 🇨🇴</h2>
            <span className="text-xs text-muted-foreground">({copProjects.length})</span>
          </div>
          {copProjects.length === 0 ? (
            <div className="glass-card p-8 text-center text-muted-foreground text-sm">No Colombia goals yet. Add one above!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {copProjects.map((p) => (
                <ProjectCard key={p.id} project={p} exchangeRate={rate} onEdit={handleEdit} onDelete={setDeleteId} />
              ))}
            </div>
          )}
        </section>
      )}

      <ProjectForm
        open={showForm}
        onOpenChange={(v) => { setShowForm(v); if (!v) setEditingProject(null); }}
        onSave={handleSave}
        initialData={editingProject}
      />

      <DeleteConfirmation
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Goal"
        description="This will permanently remove this savings goal."
        onConfirm={() => { if (deleteId) { deleteProject(deleteId); toast.success('Goal deleted'); setDeleteId(null); } }}
      />
    </div>
  );
}
