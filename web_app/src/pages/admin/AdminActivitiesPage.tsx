import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Plus, Edit2, Trash2, ToggleLeft, ToggleRight, AlertTriangle,
  Loader2, Clock, Star, Users, User, Play, Pause, RotateCcw,
  Monitor, Timer, Square,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { DifficultyBadge } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { extractList, extractMeta } from '@/api/client';
import {
  useActivitiesQuery,
  useToggleActivityStatusMutation,
  useDeleteActivityMutation,
  useUpdateActivityMutation,
} from '@/hooks/queries/useActivities';
import { useUsersQuery } from '@/hooks/queries/useUsers';
import { useTeamsQuery } from '@/hooks/queries/useTeams';
import type { Activity, Difficulty, ActivityStatus, ActivityType, User as UserType, Team } from '@/types';
import { Tooltip } from '@/components/ui/Tooltip';
import { tooltips } from '@/data/tooltip';
import { ReactSelect } from '@/components/ui/ReactSelect';
import {
  TIMER_CHANNEL,
  playTickSound,
  playAlertSound,
} from '@/context/TimerContext';
import type { TimerMessage, TimerStatus, TimerTarget } from '@/context/TimerContext';

// ─── helpers ──────────────────────────────────────────────────────────────────

function capitalize(str?: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function toTitleCase(str?: string): string {
  if (!str) return '';
  return str
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function fmtTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Normalize snake_case -> camelCase fields that the backend might return */
function normalizeActivity(a: any): Activity {
  return {
    ...a,
    maxScore:     a.maxScore     ?? a.max_score      ?? 0,
    passingScore: a.passingScore ?? a.passing_score  ?? 0,
    timeLimit:    a.timeLimit    ?? a.time_limit      ?? 0,
    activityType: a.activityType ?? a.activity_type  ?? 'individual',
    avgScore:     a.avgScore     ?? a.avg_score       ?? 0,
    completions:  a.completions  ?? 0,
  };
}

// ─── react-select option lists ────────────────────────────────────────────────

const difficultyOptions: { value: Difficulty; label: string }[] = [
  { value: 'Easy',   label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard',   label: 'Hard' },
];

const statusOptions: { value: ActivityStatus; label: string }[] = [
  { value: 'active',   label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const activityTypeOptions: { value: ActivityType; label: string }[] = [
  { value: 'individual', label: 'Individual' },
  { value: 'group',      label: 'Group' },
];

const categoryOptions = [
  'Engineering', 'Architecture', 'Debugging', 'Security', 'Cloud',
  'DevOps', 'Database', 'Performance', 'Tools', 'Quality', 'Process', 'API Design',
].map((c) => ({ value: c, label: c }));

// ─── default form state ────────────────────────────────────────────────────────

const defaultForm = {
  name:         '',
  description:  '',
  instructions: '',
  difficulty:   'Easy'       as Difficulty,
  timeLimit:    300,
  maxScore:     100,
  passingScore: 60,
  status:       'active'     as ActivityStatus,
  category:     'Engineering',
  activityType: 'individual' as ActivityType,
};

type ActivityForm = typeof defaultForm;

// ─── ActivityTimerPanel ───────────────────────────────────────────────────────

interface TimerPanelProps {
  activities: Activity[];
  isLoadingActivities: boolean;
}

function ActivityTimerPanel({ activities, isLoadingActivities }: TimerPanelProps) {
  // ── Local timer state (authoritative) ────────────────────────────────────
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<TimerTarget | null>(null);
  const [duration, setDuration] = useState(300);
  const [remaining, setRemaining] = useState(300);
  const [status, setStatus] = useState<TimerStatus>('idle');

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const remainingRef = useRef(remaining);
  remainingRef.current = remaining;

  const channelRef = useRef<BroadcastChannel | null>(null);

  // ── fetch users & teams ───────────────────────────────────────────────────
  const { data: usersData } = useUsersQuery();
  const { data: teamsData } = useTeamsQuery();

  const userList: UserType[] = Array.isArray(usersData)
    ? usersData
    : (usersData as any)?.items ?? [];

  const teamList: Team[] = Array.isArray(teamsData)
    ? teamsData
    : (teamsData as any)?.items ?? [];

  // ── BroadcastChannel setup ────────────────────────────────────────────────
  useEffect(() => {
    const ch = new BroadcastChannel(TIMER_CHANNEL);
    channelRef.current = ch;
    // Reply to SYNC requests from the Big Screen tab
    ch.onmessage = (e: MessageEvent<TimerMessage>) => {
      if (e.data.type === 'SYNC') {
        ch.postMessage({
          type: 'SYNC',
          state: {
            activity: selectedActivity,
            target: selectedTarget,
            duration,
            remaining: remainingRef.current,
            status,
          },
        } satisfies TimerMessage);
      }
    };
    return () => { ch.close(); channelRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedActivity, selectedTarget, duration, status]);

  const broadcast = (msg: TimerMessage) => channelRef.current?.postMessage(msg);

  // ── Activity selection ────────────────────────────────────────────────────
  const handleSelectActivity = (a: Activity | null) => {
    clearTimer();
    setSelectedActivity(a);
    setSelectedTarget(null);
    const d = a?.timeLimit ?? 300;
    setDuration(d);
    setRemaining(d);
    setStatus('idle');
  };

  // ── Duration change ───────────────────────────────────────────────────────
  const handleDurationChange = (val: number) => {
    setDuration(val);
    if (status === 'idle') setRemaining(val);
  };

  // ── Timer controls ────────────────────────────────────────────────────────
  const clearTimer = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const startInterval = (initRem: number) => {
    clearTimer();
    let rem = initRem;
    intervalRef.current = setInterval(() => {
      rem -= 1;
      if (rem <= 10 && rem > 0) playTickSound();
      if (rem <= 0) {
        rem = 0;
        clearTimer();
        setRemaining(0);
        setStatus('finished');
        broadcast({ type: 'FINISH' });
        playAlertSound();
      } else {
        setRemaining(rem);
        broadcast({ type: 'TICK', remaining: rem });
      }
    }, 1000);
  };

  const handleStart = () => {
    if (!selectedActivity) { toast.warning('Please select an activity first'); return; }
    const newState = {
      activity: selectedActivity,
      target: selectedTarget,
      duration,
      remaining: remainingRef.current,
      status: 'running' as TimerStatus,
    };
    setStatus('running');
    broadcast({ type: 'START', state: newState });
    startInterval(remainingRef.current);
  };

  const handlePause = () => {
    clearTimer();
    setStatus('paused');
    broadcast({ type: 'PAUSE', remaining: remainingRef.current });
  };

  const handleResume = () => {
    setStatus('running');
    broadcast({ type: 'RESUME', remaining: remainingRef.current });
    startInterval(remainingRef.current);
  };

  const handleReset = () => {
    clearTimer();
    setRemaining(duration);
    setStatus('idle');
    broadcast({ type: 'RESET' });
  };

  const handleStop = () => {
    clearTimer();
    setRemaining(duration);
    setStatus('idle');
    broadcast({ type: 'RESET' });
  };

  useEffect(() => () => clearTimer(), []);

  // ── Derived state ─────────────────────────────────────────────────────────
  const isWarning = remaining <= 10 && remaining > 0 && status === 'running';
  const isFinished = status === 'finished';
  const progress = duration > 0 ? remaining / duration : 0;

  const activityOptions = activities.map((a) => ({
    value: a.id,
    label: a.name,
    activity: a,
  }));

  const userOptions = userList.map((u) => ({
    value: u.id,
    label: `${u.name} (${u.teamName ?? 'No team'})`,
    target: { type: 'user' as const, id: u.id, name: u.name, color: u.avatarColor },
  }));

  const teamOptions = teamList.map((t) => ({
    value: t.id,
    label: t.name,
    target: { type: 'group' as const, id: t.id, name: t.name, color: t.color },
  }));

  const openBigScreen = () => {
    window.open('/admin/timer/bigscreen', '_blank', 'noopener');
  };

  // ── Ring dimensions ───────────────────────────────────────────────────────
  const R = 88;
  const circ = 2 * Math.PI * R;
  const offset = circ * (1 - progress);
  const ringColor = isFinished ? '#EF4444' : isWarning ? '#F97316' : '#7C3AED';

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      {/* ── Left: configuration panel ─────────────────────────────────── */}
      <div className="card p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Timer Setup</h2>
          <p className="text-xs text-slate-400">Select an activity, set a target, configure duration, then start.</p>
        </div>

        {/* Step 1 – Activity */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-xs font-bold text-purple-400">1</span>
            <label className="text-sm font-semibold text-slate-200">Select Activity</label>
          </div>
          <ReactSelect
            options={activityOptions}
            value={activityOptions.find((o) => o.value === selectedActivity?.id) ?? null}
            onChange={(opt: any) => opt && handleSelectActivity(opt.activity)}
            isLoading={isLoadingActivities}
            placeholder="Choose an activity..."
            isSearchable
            menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
          />
          {selectedActivity && (
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="badge bg-[#1C2742] text-slate-300 border border-[#26324A] text-xs">
                {selectedActivity.category}
              </span>
              <span className="flex items-center gap-1 badge bg-[#1C2742] text-slate-300 border border-[#26324A] text-xs">
                {selectedActivity.activityType === 'group'
                  ? <Users className="h-3 w-3 text-blue-400" />
                  : <User className="h-3 w-3 text-purple-400" />}
                {toTitleCase(selectedActivity.activityType)}
              </span>
              <DifficultyBadge difficulty={selectedActivity.difficulty} />
            </div>
          )}
        </div>

        {/* Step 2 – Group or User selector (conditional) */}
        {selectedActivity && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-xs font-bold text-purple-400">2</span>
              <label className="text-sm font-semibold text-slate-200">
                {selectedActivity.activityType === 'group' ? 'Select Group / Team' : 'Select User'}
              </label>
            </div>
            {selectedActivity.activityType === 'group' ? (
              <ReactSelect
                options={teamOptions}
                value={teamOptions.find((o) => o.value === selectedTarget?.id) ?? null}
                onChange={(opt: any) => opt && setSelectedTarget(opt.target)}
                placeholder="Choose a team..."
                isSearchable
                menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
              />
            ) : (
              <ReactSelect
                options={userOptions}
                value={userOptions.find((o) => o.value === selectedTarget?.id) ?? null}
                onChange={(opt: any) => opt && setSelectedTarget(opt.target)}
                placeholder="Choose a user..."
                isSearchable
                menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
              />
            )}
          </div>
        )}

        {/* Step 3 – Duration */}
        {selectedActivity && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-xs font-bold text-purple-400">3</span>
              <label className="text-sm font-semibold text-slate-200">Timer Duration (seconds)</label>
            </div>
            <input
              type="number"
              min={10}
              max={7200}
              value={duration}
              onChange={(e) => handleDurationChange(Number(e.target.value))}
              disabled={status !== 'idle'}
              className="input"
            />
            <p className="text-xs text-slate-500">
              = {fmtTime(duration)} · Pre-filled from activity's time limit ({selectedActivity.timeLimit}s)
            </p>
          </div>
        )}

        {/* Controls */}
        {selectedActivity && (
          <div className="flex flex-wrap gap-3 pt-2 border-t border-[#26324A]">
            {status === 'idle' && (
              <button
                onClick={handleStart}
                className="btn-primary flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start Timer
              </button>
            )}
            {status === 'running' && (
              <button
                onClick={handlePause}
                className="btn-secondary flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                Pause
              </button>
            )}
            {status === 'paused' && (
              <button
                onClick={handleResume}
                className="btn-primary flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Resume
              </button>
            )}
            {(status === 'running' || status === 'paused') && (
              <button
                onClick={handleStop}
                className="btn-danger flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Stop
              </button>
            )}
            {(status !== 'idle') && (
              <button
                onClick={handleReset}
                className="btn-secondary flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            )}
            <button
              onClick={openBigScreen}
              className="btn-secondary flex items-center gap-2 ml-auto"
              title="Open Big Screen Timer in a new tab"
            >
              <Monitor className="h-4 w-4 text-amber-400" />
              Big Screen
            </button>
          </div>
        )}

        {!selectedActivity && (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-[#26324A] bg-[#0B1020] p-4 text-slate-500">
            <Timer className="h-5 w-5 shrink-0" />
            <p className="text-sm">Select an activity above to configure the timer.</p>
          </div>
        )}
      </div>

      {/* ── Right: live countdown display ─────────────────────────────── */}
      <div
        className="card p-6 flex flex-col items-center justify-center gap-4 text-center"
        style={{
          background: isFinished
            ? 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, #151E33 100%)'
            : isWarning
            ? 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, #151E33 100%)'
            : undefined,
          transition: 'background 0.5s ease',
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Countdown Preview
        </p>

        {/* Circular progress ring */}
        <div className="relative flex items-center justify-center">
          <svg width="210" height="210" viewBox="0 0 210 210">
            <circle cx="105" cy="105" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
            <circle
              cx="105" cy="105" r={R}
              fill="none"
              stroke={ringColor}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              transform="rotate(-90 105 105)"
              style={{
                transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s ease',
                filter: `drop-shadow(0 0 8px ${ringColor}80)`,
              }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            {isFinished ? (
              <div className="flex flex-col items-center" style={{ animation: 'time-up-admin 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
                <span className="text-2xl font-black text-red-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>TIME'S</span>
                <span className="text-2xl font-black text-red-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>UP!</span>
              </div>
            ) : (
              <span
                className="font-mono font-black tabular-nums"
                style={{
                  fontSize: '2.4rem',
                  color: isWarning ? '#F97316' : '#F8FAFC',
                  textShadow: isWarning ? '0 0 16px rgba(249,115,22,0.8)' : undefined,
                  animation: isWarning ? 'warn-flash 0.8s ease-in-out infinite' : undefined,
                }}
              >
                {fmtTime(remaining)}
              </span>
            )}
          </div>
        </div>

        {/* Activity / Target info */}
        {selectedActivity ? (
          <div className="space-y-1">
            <p className="font-semibold text-white text-sm">{selectedActivity.name}</p>
            {selectedTarget && (
              <div className="flex items-center justify-center gap-2">
                {selectedTarget.color && (
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: selectedTarget.color }} />
                )}
                <p className="text-xs text-slate-400">{selectedTarget.name}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-600">No activity selected</p>
        )}

        {/* Status badge */}
        <div className={`badge text-xs font-semibold ${
          status === 'running' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
          status === 'paused'  ? 'bg-amber-500/15  text-amber-400  border border-amber-500/30'  :
          status === 'finished'? 'bg-rose-500/15   text-rose-400   border border-rose-500/30'   :
                                 'bg-slate-500/15  text-slate-400  border border-slate-500/30'
        }`}>
          {status === 'running' ? '⏵ Running' :
           status === 'paused'  ? '⏸ Paused'  :
           status === 'finished'? '✔ Finished' : '— Idle'}
        </div>

        <button
          onClick={openBigScreen}
          className="mt-2 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-400 transition-all hover:bg-amber-500/20"
        >
          <Monitor className="h-4 w-4" />
          Open Big Screen
        </button>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes warn-flash {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.06); }
        }
        @keyframes time-up-admin {
          0%   { transform: scale(0.6); opacity: 0; }
          60%  { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Main Page component ───────────────────────────────────────────────────────

export function AdminActivitiesPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'manage' | 'timer'>('manage');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // edit modal
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState<ActivityForm>(defaultForm);

  // delete confirm modal
  const [deletingActivity, setDeletingActivity] = useState<Activity | null>(null);

  const { data: activitiesData, isLoading, isFetching } = useActivitiesQuery(true, {
    page: currentPage,
    page_size: pageSize,
  });

  const rawList = extractList(activitiesData);
  const activitiesList: Activity[] = rawList.map(normalizeActivity);
  const activitiesMeta = extractMeta(activitiesData);

  const toggleMutation = useToggleActivityStatusMutation();
  const deleteMutation = useDeleteActivityMutation();
  const updateMutation = useUpdateActivityMutation();

  // ── handlers ──────────────────────────────────────────────────────────────

  const handleToggleStatus = async (id: string) => {
    try {
      const updated = await toggleMutation.mutateAsync(id);
      toast.info(`Status changed to ${capitalize(updated.status)}`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update status');
    }
  };

  const handleOpenEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setForm({
      name:         activity.name,
      description:  activity.description  ?? '',
      instructions: activity.instructions ?? '',
      difficulty:   activity.difficulty,
      timeLimit:    activity.timeLimit,
      maxScore:     activity.maxScore,
      passingScore: activity.passingScore,
      status:       activity.status,
      category:     activity.category,
      activityType: activity.activityType,
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity) return;
    if (!form.name.trim()) {
      toast.error('Activity name is required');
      return;
    }
    try {
      await updateMutation.mutateAsync({ id: editingActivity.id, payload: form });
      toast.success(`Activity "${form.name}" updated successfully`);
      setIsEditOpen(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save activity');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingActivity) return;
    try {
      await deleteMutation.mutateAsync(deletingActivity.id);
      toast.success(`Activity "${deletingActivity.name}" deleted`);
      setDeletingActivity(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete activity');
    }
  };

  // ── columns ───────────────────────────────────────────────────────────────

  const columns: Column<Activity>[] = [
    {
      key: 'name',
      header: 'Activity',
      sortable: true,
      sortValue: (a) => a.name,
      render: (a) => (
        <div>
          <p className="font-semibold text-white">{a.name}</p>
          {a.description && (
            <p className="text-xs text-slate-500 mt-0.5 max-w-[220px] truncate">{a.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (a) => (
        <span className="rounded-md bg-[#1C2742] px-2 py-0.5 text-xs font-medium text-slate-300 border border-[#26324A]">
          {a.category}
        </span>
      ),
    },
    {
      key: 'activityType',
      header: 'Type',
      sortable: true,
      render: (a) => (
        <span className="flex items-center gap-1.5 text-xs text-slate-300">
          {a.activityType === 'group' ? (
            <Users className="h-3.5 w-3.5 text-blue-400" />
          ) : (
            <User className="h-3.5 w-3.5 text-purple-400" />
          )}
          {toTitleCase(a.activityType)}
        </span>
      ),
    },
    {
      key: 'difficulty',
      header: 'Difficulty',
      sortable: true,
      render: (a) => (
        <Tooltip content={tooltips.activities.difficulty} position="top">
          <DifficultyBadge difficulty={a.difficulty} />
        </Tooltip>
      ),
    },
    {
      key: 'maxScore',
      header: 'Max Score',
      sortable: true,
      sortValue: (a) => a.maxScore,
      render: (a) => (
        <Tooltip content={tooltips.activities.maxScore} position="top">
          <span className="flex items-center gap-1 font-bold text-purple-400">
            <Star className="h-3.5 w-3.5" />
            {a.maxScore} pts
          </span>
        </Tooltip>
      ),
    },
    {
      key: 'timeLimit',
      header: 'Time (s)',
      sortable: true,
      sortValue: (a) => a.timeLimit,
      render: (a) => (
        <span className="flex items-center gap-1 text-xs text-slate-300">
          <Clock className="h-3.5 w-3.5 text-amber-400" />
          {a.timeLimit}s
        </span>
      ),
    },
    {
      key: 'completions',
      header: 'Completions',
      sortable: true,
      sortValue: (a) => a.completions,
      render: (a) => (
        <Tooltip content={tooltips.activities.completions} position="top">
          <span className="text-slate-300">{a.completions}</span>
        </Tooltip>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (a) => (
        <Tooltip content={tooltips.activities.status} position="top">
          <button
            onClick={() => handleToggleStatus(a.id)}
            disabled={toggleMutation.isPending}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-80 ${
              a.status === 'active' ? 'text-emerald-400' : 'text-slate-500'
            }`}
          >
            {a.status === 'active' ? (
              <ToggleRight className="h-5 w-5 text-emerald-400" />
            ) : (
              <ToggleLeft className="h-5 w-5 text-slate-500" />
            )}
            {capitalize(a.status)}
          </button>
        </Tooltip>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (a) => (
        <div className="flex justify-end gap-2">
          <Tooltip content={tooltips.activities.editActivity} position="top">
            <button onClick={() => handleOpenEdit(a)} className="btn-icon">
              <Edit2 className="h-4 w-4 text-slate-400 hover:text-white" />
            </button>
          </Tooltip>
          <Tooltip content="Delete activity" position="top">
            <button
              onClick={() => setDeletingActivity(a)}
              disabled={deleteMutation.isPending}
              className="btn-icon"
            >
              <Trash2 className="h-4 w-4 text-rose-400 hover:text-rose-300" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Activities</h1>
          <p className="mt-1 text-sm text-slate-400">Manage challenges or launch a countdown timer.</p>
        </div>
        {activeTab === 'manage' && (
          <Tooltip content={tooltips.activities.createActivity} position="left">
            <button
              onClick={() => navigate({ to: '/admin/activities/new' })}
              className="btn-primary"
            >
              <Plus className="h-4 w-4" />
              Create Activity
            </button>
          </Tooltip>
        )}
      </div>

      {/* ── Tab switcher ─────────────────────────────────────────────────── */}
      <div className="flex gap-1 rounded-xl border border-[#26324A] bg-[#111625] p-1 w-fit">
        <button
          id="tab-manage"
          onClick={() => setActiveTab('manage')}
          className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-200 ${
            activeTab === 'manage'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Manage
        </button>
        <button
          id="tab-timer"
          onClick={() => setActiveTab('timer')}
          className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-200 ${
            activeTab === 'timer'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="h-4 w-4" />
          Timer
        </button>
      </div>

      {/* ── Manage tab ───────────────────────────────────────────────────── */}
      {activeTab === 'manage' && (
        <DataTable
          columns={columns}
          data={activitiesList}
          isLoading={isLoading}
          isFetching={isFetching}
          searchable
          searchPlaceholder="Search by name or category..."
          searchFields={(a) => [a.name, a.category, a.activityType]}
          meta={activitiesMeta}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          pageSizeOptions={[5, 10, 20, 50]}
          emptyMessage="No activities found."
        />
      )}

      {/* ── Timer tab ────────────────────────────────────────────────────── */}
      {activeTab === 'timer' && (
        <ActivityTimerPanel activities={activitiesList} isLoadingActivities={isLoading} />
      )}

      {/* ── Edit Modal ───────────────────────────────────────────────────── */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Activity"
        subtitle={editingActivity?.name}
        size="lg"
      >
        <form onSubmit={handleSaveEdit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">Activity Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="input resize-none py-2"
              placeholder="Short description shown on card"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">Instructions</label>
            <textarea
              value={form.instructions}
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
              rows={3}
              className="input resize-none py-2"
              placeholder="Detailed instructions for participants"
            />
          </div>

          {/* Type / Difficulty / Category */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">Activity Type</label>
              <ReactSelect
                options={activityTypeOptions}
                value={activityTypeOptions.find((o) => o.value === form.activityType)}
                onChange={(opt: any) => opt && setForm({ ...form, activityType: opt.value })}
                isSearchable={false}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">Difficulty</label>
              <ReactSelect
                options={difficultyOptions}
                value={difficultyOptions.find((o) => o.value === form.difficulty)}
                onChange={(opt: any) => opt && setForm({ ...form, difficulty: opt.value })}
                isSearchable={false}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">Category</label>
              <ReactSelect
                options={categoryOptions}
                value={categoryOptions.find((o) => o.value === form.category)}
                onChange={(opt: any) => opt && setForm({ ...form, category: opt.value })}
                isSearchable
                menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
              />
            </div>
          </div>

          {/* Timing & scoring */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">Time Limit (s)</label>
              <input
                type="number"
                value={form.timeLimit}
                onChange={(e) => setForm({ ...form, timeLimit: Number(e.target.value) })}
                className="input"
                min={30}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">Max Score</label>
              <input
                type="number"
                value={form.maxScore}
                onChange={(e) => setForm({ ...form, maxScore: Number(e.target.value) })}
                className="input"
                min={1}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">Passing Score</label>
              <input
                type="number"
                value={form.passingScore}
                onChange={(e) => setForm({ ...form, passingScore: Number(e.target.value) })}
                className="input"
                min={1}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">Status</label>
              <ReactSelect
                options={statusOptions}
                value={statusOptions.find((o) => o.value === form.status)}
                onChange={(opt: any) => opt && setForm({ ...form, status: opt.value })}
                isSearchable={false}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex justify-end gap-3 border-t border-[#26324A] pt-4">
            <button type="button" onClick={() => setIsEditOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn-primary flex items-center gap-2"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Confirmation Modal ────────────────────────────────────── */}
      <Modal
        isOpen={!!deletingActivity}
        onClose={() => setDeletingActivity(null)}
        title="Delete Activity"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">Confirm Deletion</h4>
              <p className="text-xs text-slate-400">This action cannot be undone.</p>
            </div>
          </div>
          <p className="text-sm text-slate-300">
            Are you sure you want to delete activity{' '}
            <span className="font-bold text-white">"{deletingActivity?.name}"</span>?
          </p>
          <div className="flex justify-end gap-3 border-t border-[#26324A] pt-4">
            <button type="button" onClick={() => setDeletingActivity(null)} className="btn-secondary">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="btn-danger flex items-center gap-2"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Activity'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
