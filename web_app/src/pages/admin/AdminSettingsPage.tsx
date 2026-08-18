import { Settings, Save, Bell, Shield, Clock, Trophy } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export function AdminSettingsPage() {
  const [competitionName, setCompetitionName] = useState('HAT Show & Tell 2026');
  const [maxTeamSize, setMaxTeamSize] = useState(5);
  const [passingThreshold, setPassingThreshold] = useState(60);
  const [timerDefault, setTimerDefault] = useState(300);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [activityAlerts, setActivityAlerts] = useState(true);
  const [leaderboardPublic, setLeaderboardPublic] = useState(true);

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const handleReset = () => {
    setCompetitionName('HAT Show & Tell 2026');
    setMaxTeamSize(5);
    setPassingThreshold(60);
    setTimerDefault(300);
    setEmailNotifications(true);
    setActivityAlerts(true);
    setLeaderboardPublic(true);
    toast.info('Settings reset to defaults');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-ink-400">Configure competition rules and platform preferences.</p>
      </div>

      {/* Competition settings */}
      <Card className="p-6">
        <CardHeader title="Competition Settings" subtitle="General competition configuration" icon={<Trophy className="h-5 w-5" />} />
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600">Competition Name</label>
            <input type="text" value={competitionName} onChange={(e) => setCompetitionName(e.target.value)} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">Max Team Size</label>
              <input type="number" value={maxTeamSize} onChange={(e) => setMaxTeamSize(Number(e.target.value))} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">Passing Threshold (%)</label>
              <input type="number" value={passingThreshold} onChange={(e) => setPassingThreshold(Number(e.target.value))} className="input-field" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600">Default Timer (seconds)</label>
            <input type="number" value={timerDefault} onChange={(e) => setTimerDefault(Number(e.target.value))} className="input-field" />
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <CardHeader title="Notifications" subtitle="Alert and notification preferences" icon={<Bell className="h-5 w-5" />} />
        <div className="mt-4 space-y-4">
          <ToggleRow
            label="Email Notifications"
            description="Send email alerts for activity completions and rank changes"
            checked={emailNotifications}
            onChange={setEmailNotifications}
          />
          <ToggleRow
            label="Activity Alerts"
            description="Real-time alerts when new activities are published"
            checked={activityAlerts}
            onChange={setActivityAlerts}
          />
          <ToggleRow
            label="Public Leaderboard"
            description="Make the leaderboard visible to all users"
            checked={leaderboardPublic}
            onChange={setLeaderboardPublic}
          />
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6">
        <CardHeader title="Security" subtitle="Access and authentication settings" icon={<Shield className="h-5 w-5" />} />
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600">Session Timeout (minutes)</label>
            <input type="number" defaultValue={30} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600">Minimum Password Length</label>
            <input type="number" defaultValue={8} className="input-field" />
          </div>
        </div>
      </Card>

      {/* Save */}
      <div className="flex justify-end gap-3 pb-4">
        <Button variant="secondary" onClick={handleReset}>Reset to Defaults</Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}


function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-ink-800">{label}</p>
        <p className="text-xs text-ink-400">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-brand-600' : 'bg-ink-200'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}
