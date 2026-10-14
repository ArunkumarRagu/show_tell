import { useState, useEffect } from 'react';
import { Save, Settings as SettingsIcon, Shield, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSettingsQuery, useUpdateSettingsMutation } from '@/hooks/queries/useSettings';
import type { SystemSettingsData } from '@/api/settings';
import { Tooltip, InfoTooltip } from '@/components/ui/Tooltip';
import { tooltips } from '@/data/tooltip';

export function AdminSettingsPage() {
  const { data: remoteSettings, isLoading } = useSettingsQuery();
  const updateSettingsMutation = useUpdateSettingsMutation();

  const [settings, setSettings] = useState<SystemSettingsData>({
    competitionName: 'HAT Show & Tell',
    allowSelfRegistration: false,
    maxTeamSize: 10,
    defaultPassingScore: 60,
    enableLeaderboard: true,
  });

  useEffect(() => {
    if (remoteSettings) {
      setSettings(remoteSettings);
    }
  }, [remoteSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettingsMutation.mutateAsync(settings);
      toast.success('System settings saved successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update settings');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">System Settings</h1>
          <p className="mt-1 text-sm text-ink-400">Configure global application behavior and competition rules.</p>
        </div>
        <Tooltip content={tooltips.settings.saveSettings} position="left">
          <Button onClick={handleSave} disabled={updateSettingsMutation.isPending}>
            {updateSettingsMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Settings
          </Button>
        </Tooltip>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6">
          <CardHeader title="General Settings" icon={<SettingsIcon className="h-5 w-5" />} />
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink-300">Platform / Competition Name</label>
              <input
                type="text"
                value={settings.competitionName}
                onChange={(e) => setSettings({ ...settings, competitionName: e.target.value })}
                className="input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-300">Max Team Size</label>
                <input
                  type="number"
                  value={settings.maxTeamSize}
                  onChange={(e) => setSettings({ ...settings, maxTeamSize: Number(e.target.value) })}
                  className="input"
                />
              </div>
              <div>
                <div className="mb-1.5 flex items-center gap-1.5">
                  <label className="text-xs font-semibold text-ink-300">Default Passing Score (pts)</label>
                  <InfoTooltip content={tooltips.settings.passThreshold} />
                </div>
                <input
                  type="number"
                  value={settings.defaultPassingScore}
                  onChange={(e) => setSettings({ ...settings, defaultPassingScore: Number(e.target.value) })}
                  className="input"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <CardHeader title="Security & Access Control" icon={<Shield className="h-5 w-5" />} />
          <div className="mt-4 space-y-4">
            <label className="flex items-center justify-between rounded-xl border border-ink-800 bg-ink-900/60 p-4 cursor-pointer">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-white text-sm">Allow Self Registration</p>
                  <InfoTooltip content={tooltips.settings.maintenanceMode} />
                </div>
                <p className="text-xs text-ink-400">If enabled, new users can sign up without admin invitation.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowSelfRegistration}
                onChange={(e) => setSettings({ ...settings, allowSelfRegistration: e.target.checked })}
                className="h-5 w-5 rounded border-ink-700 bg-ink-800 text-brand-500 focus:ring-brand-500"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-ink-800 bg-ink-900/60 p-4 cursor-pointer">
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-white text-sm">Enable Public Leaderboard</p>
                  <InfoTooltip content={tooltips.leaderboard.individualVsTeam} />
                </div>
                <p className="text-xs text-ink-400">Display real-time team and user standings on user dashboard.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableLeaderboard}
                onChange={(e) => setSettings({ ...settings, enableLeaderboard: e.target.checked })}
                className="h-5 w-5 rounded border-ink-700 bg-ink-800 text-brand-500 focus:ring-brand-500"
              />
            </label>
          </div>
        </Card>
      </form>
    </div>
  );
}
