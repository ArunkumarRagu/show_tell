import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Power, Clock, Star, Play, Pause, Square, CheckCircle2, Trophy, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { DifficultyBadge, StatusBadge, ActivityTypeBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { activities, teams } from '@/data/mockData';
import type { Activity, LiveGroupSession, Team } from '@/types';

export function AdminActivitiesPage() {
  const navigate = useNavigate();
  const [activitiesState, setActivitiesState] = useState<Activity[]>(activities);

  // Group Selection Modal state
  const [selectedActivityForLaunch, setSelectedActivityForLaunch] = useState<Activity | null>(null);
  const [targetGroupId, setTargetGroupId] = useState<string>(teams[0]?.id || '');

  // Active Live Session state on Admin Panel
  const [activeSession, setActiveSession] = useState<LiveGroupSession | null>(null);

  // Live Timer Effect
  useEffect(() => {
    if (!activeSession || activeSession.status !== 'running') return;

    const interval = setInterval(() => {
      setActiveSession((prev) => {
        if (!prev || prev.status !== 'running') return prev;
        if (prev.remainingSeconds <= 1) {
          // Timer finished! Complete activity and credit group
          handleFinishLiveSession(prev, true);
          return null;
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  const toggleStatus = (id: string) => {
    setActivitiesState((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextStatus = a.status === 'active' ? 'inactive' : 'active';
          if (nextStatus === 'active') {
            toast.info(`Activity "${a.name}" activated`);
          } else {
            toast.warning(`Activity "${a.name}" deactivated`);
          }
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  const handleOpenLaunchModal = (activity: Activity) => {
    setSelectedActivityForLaunch(activity);
    setTargetGroupId(teams[0]?.id || '');
  };

  const handleStartLiveActivity = () => {
    if (!selectedActivityForLaunch) return;
    const targetTeam = teams.find((t) => t.id === targetGroupId) || teams[0];

    const session: LiveGroupSession = {
      id: `session_${Date.now()}`,
      activityId: selectedActivityForLaunch.id,
      activityName: selectedActivityForLaunch.name,
      groupId: targetTeam.id,
      groupName: targetTeam.name,
      groupColor: targetTeam.color,
      maxScore: selectedActivityForLaunch.maxScore,
      timeLimit: selectedActivityForLaunch.timeLimit,
      remainingSeconds: selectedActivityForLaunch.timeLimit,
      status: 'running',
    };

    setActiveSession(session);
    setSelectedActivityForLaunch(null);
    toast.success(`Live Timer launched for Group "${targetTeam.name}"!`);
  };

  const handleTogglePauseSession = () => {
    if (!activeSession) return;
    const nextStatus = activeSession.status === 'running' ? 'paused' : 'running';
    setActiveSession({ ...activeSession, status: nextStatus });
    if (nextStatus === 'paused') {
      toast.info('Live Activity timer paused');
    } else {
      toast.info('Live Activity timer resumed');
    }
  };

  const handleFinishLiveSession = (sessionToFinish?: LiveGroupSession, isTimeUp = false) => {
    const session = sessionToFinish || activeSession;
    if (!session) return;

    // Credit score on Group Level
    const targetTeam = teams.find((t) => t.id === session.groupId);
    if (targetTeam) {
      targetTeam.score += session.maxScore;
      targetTeam.activitiesCompleted += 1;
    }

    // Increment activity completion count
    setActivitiesState((prev) =>
      prev.map((a) => (a.id === session.activityId ? { ...a, completions: a.completions + 1 } : a))
    );

    setActiveSession(null);
    if (isTimeUp) {
      toast.success(`⏰ Time's up! Group "${session.groupName}" completed "${session.activityName}" and earned +${session.maxScore} pts!`);
    } else {
      toast.success(`🎉 Group "${session.groupName}" completed "${session.activityName}"! Added +${session.maxScore} pts to team score.`);
    }
  };

  const handleCancelLiveSession = () => {
    if (!activeSession) return;
    setActiveSession(null);
    toast.info('Live activity session cancelled without score changes.');
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Activity Management & Live Control</h1>
          <p className="mt-1 text-sm text-ink-400">Create activities, start live group challenges with admin panel timers, and credit team scores.</p>
        </div>
        <Button onClick={() => navigate('/admin/activities/new')}>
          <Plus className="h-4 w-4" />
          Create Activity
        </Button>
      </div>

      {/* Live Activity Runner Modal (Projector View) */}
      {activeSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink-950/85 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-xl bg-gradient-to-b from-ink-900 via-ink-950 to-brand-950 border-2 border-brand-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center flex flex-col items-center overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl pointer-events-none" />

            {/* Top header bar */}
            <div className="w-full flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-success-400">PROJECTOR LIVE TIMER</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm" style={{ backgroundColor: activeSession.groupColor }}>
                  <Users className="h-3.5 w-3.5" />
                  Group: {activeSession.groupName}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 ring-1 ring-amber-500/30">
                  <Trophy className="h-3.5 w-3.5" />
                  +{activeSession.maxScore} pts
                </span>
              </div>
            </div>

            {/* Activity Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              {activeSession.activityName}
            </h2>

            {/* GIANT Circular SVG Timer */}
            {(() => {
              const totalSec = activeSession.timeLimit;
              const remSec = activeSession.remainingSeconds;
              const pct = (remSec / totalSec) * 100;
              const strokeColor = remSec <= 30 ? '#ef4444' : pct > 50 ? '#3366ff' : '#f59e0b';
              const radius = 110;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference - (pct / 100) * circumference;

              return (
                <div className="relative my-4 inline-flex items-center justify-center">
                  <svg width="270" height="270" className="-rotate-90">
                    <circle cx="135" cy="135" r={radius} fill="none" stroke="#1e293b" strokeWidth="16" />
                    <circle
                      cx="135"
                      cy="135"
                      r={radius}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="16"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      className="transition-all duration-1000 ease-linear"
                      style={{ filter: `drop-shadow(0 0 12px ${strokeColor}60)` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`font-mono text-5xl sm:text-6xl font-extrabold tracking-tight ${remSec <= 30 ? 'text-danger-400 animate-pulse' : 'text-white'}`}>
                      {formatTime(remSec)}
                    </span>
                    <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-ink-400">Time Remaining</span>
                  </div>
                </div>
              );
            })()}

            {/* Controls */}
            <div className="w-full flex flex-wrap items-center justify-center gap-3 mt-4 pt-4 border-t border-white/10">
              <Button
                variant="secondary"
                onClick={handleTogglePauseSession}
                className="bg-white/10 text-white hover:bg-white/20 py-2.5 px-4"
              >
                {activeSession.status === 'running' ? (
                  <>
                    <Pause className="h-4 w-4 text-warning-400" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 text-success-400" /> Resume
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleFinishLiveSession()}
                className="bg-success-600 hover:bg-success-500 text-white font-bold py-2.5 px-6 shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <CheckCircle2 className="h-5 w-5" />
                Complete & Credit Group (+{activeSession.maxScore} pts)
              </Button>

              <Button
                variant="ghost"
                onClick={handleCancelLiveSession}
                className="text-ink-400 hover:text-white hover:bg-white/10"
                title="Cancel Session"
              >
                <Square className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}


      {/* Activity Table */}
      <Card className="overflow-hidden border border-[#26324A]">
        <Table<Activity>
          columns={[
            {
              key: 'name',
              header: 'Activity',
              render: (row) => (
                <div>
                  <p className="font-bold text-white">{row.name}</p>
                  <p className="text-xs text-slate-400">{row.category}</p>
                </div>
              ),
            },
            {
              key: 'type',
              header: 'Type',
              render: (row) => <ActivityTypeBadge type={row.activityType} />,
            },
            { key: 'difficulty', header: 'Difficulty', render: (row) => <DifficultyBadge difficulty={row.difficulty} /> },
            {
              key: 'timer',
              header: 'Timer',
              render: (row) => (
                <span className="flex items-center gap-1.5 text-cyan-300 font-mono text-xs font-semibold">
                  <Clock className="h-3.5 w-3.5 text-cyan-400" />
                  {Math.floor(row.timeLimit / 60)}m ({row.timeLimit}s)
                </span>
              ),
            },
            { key: 'maxScore', header: 'Max Score', render: (row) => <span className="flex items-center gap-1.5 font-display font-extrabold text-white"><Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />{row.maxScore}</span> },
            { key: 'completions', header: 'Completions', render: (row) => <span className="text-slate-300 font-medium">{row.completions}</span> },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) => (
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleOpenLaunchModal(row)}
                    className="px-2.5 py-1 text-xs shadow-md shadow-purple-600/20"
                    title="Start Live Activity for Group"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Start Live
                  </Button>
                  <button onClick={() => navigate(`/admin/activities/${row.id}/edit`)} className="rounded-lg p-1.5 text-slate-400 hover:bg-[#1C2742] hover:text-purple-400" title="Edit">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => toggleStatus(row.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-[#1C2742] hover:text-amber-400" title="Activate/Deactivate">
                    <Power className="h-4 w-4" />
                  </button>
                </div>
              ),
            },
          ]}
          data={activitiesState}
        />
      </Card>


      {/* Select Group Modal for Launching Live Activity */}
      <Modal
        open={!!selectedActivityForLaunch}
        onClose={() => setSelectedActivityForLaunch(null)}
        title="Start Live Group Challenge"
        subtitle={selectedActivityForLaunch ? `Launch "${selectedActivityForLaunch.name}" for a group` : ''}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedActivityForLaunch(null)}>Cancel</Button>
            <Button onClick={handleStartLiveActivity}>
              <Play className="h-4 w-4 fill-current" />
              Start Live Timer
            </Button>
          </>
        }
      >
        {selectedActivityForLaunch && (
          <div className="space-y-4">
            <div className="rounded-xl bg-brand-50 p-4 border border-brand-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-brand-600">Selected Challenge</span>
                <DifficultyBadge difficulty={selectedActivityForLaunch.difficulty} />
              </div>
              <p className="mt-1 text-lg font-bold text-brand-900">{selectedActivityForLaunch.name}</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-brand-700">
                <span>⏱ Timer: {Math.floor(selectedActivityForLaunch.timeLimit / 60)} minutes</span>
                <span>⭐ Points: +{selectedActivityForLaunch.maxScore}</span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">Select Target Group / Team</label>
              <select
                className="input-field"
                value={targetGroupId}
                onChange={(e) => setTargetGroupId(e.target.value)}
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} Group ({t.score.toLocaleString()} pts, Rank #{t.rank})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-ink-400">
              Starting this activity will run a live timer on the Admin Panel. When finished, +{selectedActivityForLaunch.maxScore} points will be credited directly to the group score.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

