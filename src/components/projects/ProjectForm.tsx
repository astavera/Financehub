import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Project } from '@/lib/types';

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (project: Omit<Project, 'id'>) => void;
  initialData?: Project | null;
}

export function ProjectForm({ open, onOpenChange, onSave, initialData }: ProjectFormProps) {
  const [form, setForm] = useState({
    project_name: '',
    target_amount: '',
    current_amount: '',
    currency: 'USD' as 'USD' | 'COP',
    country_tag: 'US',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        project_name: initialData.project_name,
        target_amount: String(initialData.target_amount),
        current_amount: String(initialData.current_amount),
        currency: initialData.currency,
        country_tag: initialData.country_tag || 'US',
        notes: initialData.notes || '',
      });
    } else {
      setForm({ project_name: '', target_amount: '', current_amount: '0', currency: 'USD', country_tag: 'US', notes: '' });
    }
  }, [initialData, open]);

  const handleSave = () => {
    if (!form.project_name || !form.target_amount) return;
    onSave({
      project_name: form.project_name,
      target_amount: +form.target_amount,
      current_amount: +form.current_amount || 0,
      currency: form.currency,
      country_tag: form.country_tag,
      notes: form.notes || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{initialData ? 'Edit Goal' : 'Add Goal'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Project Name</Label>
            <Input value={form.project_name} onChange={(e) => setForm({ ...form, project_name: e.target.value })} className="bg-secondary/30 mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Currency</Label>
              <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as any, country_tag: e.target.value === 'COP' ? 'CO' : 'US' })} className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm mt-1">
                <option value="USD">USD</option>
                <option value="COP">COP</option>
              </select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Country</Label>
              <select value={form.country_tag} onChange={(e) => setForm({ ...form, country_tag: e.target.value })} className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm mt-1">
                <option value="US">🇺🇸 US</option>
                <option value="CO">🇨🇴 Colombia</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Target Amount</Label>
              <Input type="number" value={form.target_amount} onChange={(e) => setForm({ ...form, target_amount: e.target.value })} className="bg-secondary/30 mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Current Saved</Label>
              <Input type="number" value={form.current_amount} onChange={(e) => setForm({ ...form, current_amount: e.target.value })} className="bg-secondary/30 mt-1" />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="bg-secondary/30 mt-1 min-h-[60px]" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave}>{initialData ? 'Save Changes' : 'Add Goal'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
