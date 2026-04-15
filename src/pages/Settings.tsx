import { useAppStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Settings as SettingsIcon, Users, DollarSign, Globe, RotateCcw,
  Sun, Moon, Pencil, Check, X, Plus, Trash2, Wallet, Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { DeleteConfirmation } from '@/components/common/DeleteConfirmation';
import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { formatUSD } from '@/lib/currency';

export default function SettingsPage() {
  const store = useAppStore();
  const { theme, toggle } = useTheme();
  const [showReset, setShowReset] = useState(false);

  // Editing states
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserRole, setEditUserRole] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('Member');
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const [editingIncome, setEditingIncome] = useState(false);
  const [incomeValue, setIncomeValue] = useState(store.weeklyIncome);

  const [editingRate, setEditingRate] = useState(false);
  const [rateValue, setRateValue] = useState(store.exchangeRate.rate_cop_per_usd);
  const [rateNotes, setRateNotes] = useState(store.exchangeRate.notes || '');

  const monthlyEstimate = store.weeklyIncome * 4;

  const startEditUser = (u: { id: string; name: string; role: string }) => {
    setEditingUser(u.id);
    setEditUserName(u.name);
    setEditUserRole(u.role);
  };

  const saveUser = () => {
    if (!editingUser || !editUserName.trim()) return;
    store.updateUser(editingUser, { name: editUserName.trim(), role: editUserRole.trim() });
    setEditingUser(null);
    toast.success('Member updated');
  };

  const addUser = () => {
    if (!newUserName.trim()) return;
    store.addUser({ id: `u-${Date.now()}`, name: newUserName.trim(), role: newUserRole.trim() || 'Member' });
    setNewUserName('');
    setNewUserRole('Member');
    setShowAddUser(false);
    toast.success('Member added');
  };

  const confirmDeleteUser = () => {
    if (!deleteUserId) return;
    store.deleteUser(deleteUserId);
    setDeleteUserId(null);
    toast.success('Member removed');
  };

  const saveIncome = () => {
    if (incomeValue <= 0) return;
    store.setWeeklyIncome(incomeValue);
    setEditingIncome(false);
    toast.success('Weekly income updated');
  };

  const saveRate = () => {
    if (rateValue <= 0) return;
    store.setExchangeRate({
      ...store.exchangeRate,
      rate_cop_per_usd: rateValue,
      notes: rateNotes,
      last_updated: new Date().toISOString().slice(0, 10),
      source: 'manual',
    });
    setEditingRate(false);
    toast.success('Exchange rate updated');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your household, preferences, and app configuration</p>
      </div>

      {/* ── Household Members ── */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="font-display font-semibold">Household Members</h3>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => setShowAddUser(true)}>
            <Plus className="w-3 h-3" /> Add
          </Button>
        </div>
        <div className="space-y-3">
          {store.users.map((u) => (
            <div key={u.id} className="flex items-center gap-4 bg-secondary/30 rounded-xl p-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-display font-bold text-primary shrink-0">
                {u.name[0]}
              </div>
              {editingUser === u.id ? (
                <div className="flex-1 flex items-center gap-2 flex-wrap">
                  <Input value={editUserName} onChange={(e) => setEditUserName(e.target.value)}
                    className="h-8 w-36 bg-secondary/50 text-sm" placeholder="Name" maxLength={30} />
                  <Input value={editUserRole} onChange={(e) => setEditUserRole(e.target.value)}
                    className="h-8 w-28 bg-secondary/50 text-sm" placeholder="Role" maxLength={20} />
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={saveUser}>
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingUser(null)}>
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.role}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEditUser(u)}>
                      <Pencil className="w-3 h-3 text-muted-foreground" />
                    </Button>
                    {store.users.length > 1 && (
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setDeleteUserId(u.id)}>
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {showAddUser && (
            <div className="flex items-center gap-3 bg-secondary/30 rounded-xl p-4 border border-primary/20">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Plus className="w-4 h-4" />
              </div>
              <Input value={newUserName} onChange={(e) => setNewUserName(e.target.value)}
                className="h-8 w-36 bg-secondary/50 text-sm" placeholder="Name" maxLength={30} autoFocus />
              <Input value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}
                className="h-8 w-28 bg-secondary/50 text-sm" placeholder="Role" maxLength={20} />
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={addUser}>
                <Check className="w-3.5 h-3.5 text-primary" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setShowAddUser(false)}>
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Income & Budget ── */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold">Income & Budget</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-4">
            <span className="text-sm">Weekly Income</span>
            {editingIncome ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">$</span>
                <Input type="number" value={incomeValue} onChange={(e) => setIncomeValue(+e.target.value)}
                  className="h-8 w-28 bg-secondary/50 text-sm text-right" min={0} />
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={saveIncome}>
                  <Check className="w-3.5 h-3.5 text-primary" />
                </Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditingIncome(false); setIncomeValue(store.weeklyIncome); }}>
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-semibold">{formatUSD(store.weeklyIncome)}</span>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setIncomeValue(store.weeklyIncome); setEditingIncome(true); }}>
                  <Pencil className="w-3 h-3 text-muted-foreground" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-4">
            <span className="text-sm">Monthly Estimate (4 weeks)</span>
            <span className="font-semibold">{formatUSD(monthlyEstimate)}</span>
          </div>
          <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-4">
            <span className="text-sm">Biweekly Paycheck</span>
            <span className="font-semibold text-muted-foreground">{formatUSD(store.weeklyIncome * 2)}</span>
          </div>
        </div>
      </div>

      {/* ── Currency Settings ── */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold">Currency Settings</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-4">
            <span className="text-sm">Primary Household Currency</span>
            <span className="font-semibold" style={{ color: 'hsl(var(--success))' }}>USD 🇺🇸</span>
          </div>
          <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-4">
            <span className="text-sm">Secondary Project Currency</span>
            <span className="font-semibold" style={{ color: 'hsl(var(--accent))' }}>COP 🇨🇴</span>
          </div>
        </div>
      </div>

      {/* ── Exchange Rate ── */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" style={{ color: 'hsl(var(--accent))' }} />
            <h3 className="font-display font-semibold">Default Exchange Rate</h3>
          </div>
          {!editingRate && (
            <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => { setRateValue(store.exchangeRate.rate_cop_per_usd); setRateNotes(store.exchangeRate.notes || ''); setEditingRate(true); }}>
              <Pencil className="w-3 h-3" /> Edit
            </Button>
          )}
        </div>
        {editingRate ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Label className="text-sm text-muted-foreground w-20">1 USD =</Label>
              <Input type="number" value={rateValue} onChange={(e) => setRateValue(+e.target.value)}
                className="w-36 bg-secondary/30" min={0} />
              <span className="text-sm text-muted-foreground">COP</span>
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-sm text-muted-foreground w-20">Notes</Label>
              <Input value={rateNotes} onChange={(e) => setRateNotes(e.target.value)}
                className="flex-1 bg-secondary/30" placeholder="e.g. Remitly standard rate" maxLength={100} />
            </div>
            <div className="flex gap-2 pt-1">
              <Button size="sm" className="gap-1.5" onClick={saveRate}><Check className="w-3 h-3" /> Save</Button>
              <Button size="sm" variant="ghost" onClick={() => setEditingRate(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-secondary/30 rounded-xl p-4">
              <span className="text-sm">1 USD =</span>
              <span className="font-display font-bold text-lg">{store.exchangeRate.rate_cop_per_usd.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">COP</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-secondary" style={{ color: 'hsl(var(--info))' }}>
                {store.exchangeRate.source === 'live' ? 'Live' : 'Manual'}
              </span>
            </div>
            {store.exchangeRate.notes && (
              <p className="text-xs text-muted-foreground pl-1">{store.exchangeRate.notes}</p>
            )}
            <p className="text-xs text-muted-foreground pl-1">
              <Calendar className="w-3 h-3 inline mr-1" />
              Last updated: {store.exchangeRate.last_updated}
            </p>
          </div>
        )}
      </div>

      {/* ── App Preferences ── */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <SettingsIcon className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-display font-semibold">App Preferences</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4" style={{ color: 'hsl(var(--warning))' }} />}
              <span className="text-sm">Theme</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{theme === 'dark' ? 'Dark' : 'Light'}</span>
              <Switch checked={theme === 'dark'} onCheckedChange={toggle} />
            </div>
          </div>
          <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-4">
            <span className="text-sm">Data Persistence</span>
            <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'hsl(var(--info) / 0.15)', color: 'hsl(var(--info))' }}>Local Storage</span>
          </div>
          <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-4">
            <span className="text-sm">Number of Weeks per Month</span>
            <span className="font-semibold">4</span>
          </div>
        </div>
      </div>

      {/* ── Reset ── */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-destructive">Reset Sample Data</h3>
            <p className="text-xs text-muted-foreground mt-1">Restore all data to original seeded values</p>
          </div>
          <Button variant="destructive" size="sm" className="gap-2" onClick={() => setShowReset(true)}>
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>
      </div>

      {/* Delete user confirmation */}
      <DeleteConfirmation
        open={!!deleteUserId}
        onOpenChange={(open) => !open && setDeleteUserId(null)}
        title="Remove Member"
        description="This member will be removed from the household. Their existing expense records will remain."
        onConfirm={confirmDeleteUser}
      />

      {/* Reset confirmation */}
      <DeleteConfirmation
        open={showReset}
        onOpenChange={setShowReset}
        title="Reset All Data"
        description="This will restore all data to the original sample values. All your changes will be lost."
        onConfirm={() => { store.resetToDefaults(); toast.success('Data reset to defaults'); setShowReset(false); }}
      />
    </div>
  );
}
