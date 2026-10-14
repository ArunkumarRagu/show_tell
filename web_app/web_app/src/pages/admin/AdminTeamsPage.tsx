import { useState } from 'react';
import { Users, Eye, Pencil, Plus, LayoutGrid, List, Trophy, Target, Crown, Power } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge, RankBadge, DifficultyBadge, ResultBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ReactSelect } from '@/components/ui/ReactSelect';
import { teams as initialTeams, users, activityLogs } from '@/data/mockData';
import type { Team } from '@/types';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export function AdminTeamsPage() {
  const [teamList, setTeamList] = useState<Team[]>(initialTeams);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  // Add team form state
  const [newGroupName, setNewGroupName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newColor, setNewColor] = useState('#3366ff');

  // Edit team form state
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'inactive'>('active');

  const teamMembers = selectedTeam ? users.filter((u) => u.teamId === selectedTeam.id && u.role === 'user') : [];
  const teamLogs = selectedTeam ? activityLogs.filter((l) => teamMembers.some((m) => m.id === l.userId)) : [];

  const handleAddGroup = () => {
    if (!newGroupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }
    const newTeam: Team = {
      id: `t_${Date.now()}`,
      name: newGroupName,
      description: newDescription || 'Newly established team group.',
      color: newColor,
      score: 0,
      activitiesCompleted: 0,
      rank: teamList.length + 1,
      status: 'active',
    };
    setTeamList([...teamList, newTeam]);
    setAddOpen(false);
    setNewGroupName('');
    setNewDescription('');
    toast.success(`Group "${newTeam.name}" created successfully!`);
  };

  const handleOpenEdit = (team: Team) => {
    setEditTeam(team);
    setEditName(team.name);
    setEditDesc(team.description);
    setEditColor(team.color);
    setEditStatus(team.status);
  };

  const handleSaveEdit = () => {
    if (!editTeam) return;
    setTeamList((prev) =>
      prev.map((t) =>
        t.id === editTeam.id
          ? { ...t, name: editName, description: editDesc, color: editColor, status: editStatus }
          : t
      )
    );
    setEditTeam(null);
    toast.success(`Group "${editName}" updated successfully!`);
  };

  const handleToggleStatus = (team: Team) => {
    const nextStatus = team.status === 'active' ? 'inactive' : 'active';
    setTeamList((prev) =>
      prev.map((t) => (t.id === team.id ? { ...t, status: nextStatus } : t))
    );
    if (nextStatus === 'active') {
      toast.info(`Group "${team.name}" status set to Active`);
    } else {
      toast.warning(`Group "${team.name}" status set to Inactive`);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Groups & Team Management</h1>
          <p className="mt-1 text-sm text-ink-400">Manage all team groups, track member rosters, and analyze performance.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center rounded-xl bg-ink-100/10 p-1 border border-ink-100/10">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'table' ? 'bg-brand-600 text-white shadow-soft' : 'text-ink-400 hover:text-white'
              }`}
            >
              <List className="h-4 w-4" />
              Table View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === 'grid' ? 'bg-brand-600 text-white shadow-soft' : 'text-ink-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Grid View
            </button>
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Group
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        /* Team cards grid view */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teamList.map((team) => {
            const memberCount = users.filter((u) => u.teamId === team.id && u.role === 'user').length;
            return (
              <Card key={team.id} className="p-5 card-hover border border-[#26324A]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md font-bold" style={{ backgroundColor: team.color }}>
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{team.name}</h3>
                      <p className="text-xs text-slate-400">{memberCount} members</p>
                    </div>
                  </div>
                  <RankBadge rank={team.rank} />
                </div>
                <p className="mt-3 text-sm text-slate-300 line-clamp-2">{team.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#0B1020] border border-[#26324A] p-3">
                    <p className="text-xs font-medium text-slate-400">Team Score</p>
                    <p className="text-lg font-display font-extrabold text-white">{team.score.toLocaleString()}</p>
                  </div>
                  <div className="rounded-xl bg-[#0B1020] border border-[#26324A] p-3">
                    <p className="text-xs font-medium text-slate-400">Activities</p>
                    <p className="text-lg font-display font-extrabold text-white">{team.activitiesCompleted}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => setSelectedTeam(team)}>
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleOpenEdit(team)}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Team Groups Table View */
        <Card className="overflow-hidden border border-[#26324A]">
          <Table<Team>
            columns={[
              {
                key: 'group',
                header: 'Groups / Team',
                render: (row) => (
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl text-white font-bold shadow-sm text-xs" style={{ backgroundColor: row.color }}>
                      {row.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white">{row.name}</p>
                      <p className="text-xs text-slate-400 line-clamp-1">{row.description}</p>
                    </div>
                  </div>
                ),
              },
              {
                key: 'members',
                header: 'Members',
                render: (row) => {
                  const count = users.filter((u) => u.teamId === row.id && u.role === 'user').length;
                  return <span className="font-semibold text-slate-300">{count} Members</span>;
                },
              },
              {
                key: 'score',
                header: 'Total Score',
                render: (row) => <span className="font-display font-extrabold text-white">{row.score.toLocaleString()} pts</span>,
              },
              {
                key: 'activities',
                header: 'Activities Completed',
                render: (row) => <span className="font-medium text-slate-300">{row.activitiesCompleted}</span>,
              },
              {
                key: 'rank',
                header: 'Rank',
                render: (row) => <RankBadge rank={row.rank} />,
              },
              {
                key: 'status',
                header: 'Status',
                render: (row) => <StatusBadge status={row.status} />,
              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) => (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedTeam(row)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-[#1C2742] hover:text-purple-400"
                      title="View Group Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(row)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-[#1C2742] hover:text-purple-400"
                      title="Edit Group"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(row)}
                      className={`rounded-lg p-1.5 ${row.status === 'active' ? 'text-slate-400 hover:bg-rose-500/20 hover:text-rose-400' : 'text-emerald-400 hover:bg-emerald-500/20'}`}
                      title={row.status === 'active' ? 'Deactivate Group' : 'Activate Group'}
                    >
                      <Power className="h-4 w-4" />
                    </button>
                  </div>
                ),
              },
            ]}
            data={teamList}
          />
        </Card>
      )}


      {/* Add group modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Group / Team"
        subtitle="Create a new team group for users"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddGroup}>Create Group</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600">Group Name</label>
            <input
              type="text"
              placeholder="e.g. CyberKnights"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600">Description</label>
            <textarea
              placeholder="Short group mission or slogan..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={3}
              className="input-field resize-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600">Group Color</label>
            <div className="flex gap-2">
              {['#ef4444', '#3366ff', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewColor(c)}
                  className={`h-8 w-8 rounded-lg transition-all ${c === newColor ? 'ring-2 ring-offset-2 ring-brand-500 scale-105' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Team details modal */}
      <Modal
        open={!!selectedTeam}
        onClose={() => setSelectedTeam(null)}
        title={selectedTeam ? `${selectedTeam.name} Group` : ''}
        subtitle="Group details and member performance"
        size="lg"
      >
        {selectedTeam && (
          <div className="space-y-5">
            {/* Team stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-brand-50 p-3 text-center">
                <Trophy className="mx-auto h-5 w-5 text-brand-600" />
                <p className="mt-1 text-xs text-ink-400">Total Score</p>
                <p className="text-lg font-bold text-ink-900">{selectedTeam.score.toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-success-50 p-3 text-center">
                <Target className="mx-auto h-5 w-5 text-success-600" />
                <p className="mt-1 text-xs text-ink-400">Activities</p>
                <p className="text-lg font-bold text-ink-900">{selectedTeam.activitiesCompleted}</p>
              </div>
              <div className="rounded-xl bg-accent-50 p-3 text-center">
                <Crown className="mx-auto h-5 w-5 text-accent-600" />
                <p className="mt-1 text-xs text-ink-400">Rank</p>
                <p className="text-lg font-bold text-ink-900">#{selectedTeam.rank}</p>
              </div>
            </div>

            {/* Members */}
            <div>
              <h4 className="mb-3 text-sm font-bold text-ink-900">Group Members ({teamMembers.length})</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {teamMembers.length === 0 ? (
                  <p className="text-xs text-ink-400 py-2">No members assigned to this group yet.</p>
                ) : (
                  teamMembers.map((m) => (
                    <div key={m.id} className="flex items-center gap-3 rounded-xl border border-ink-100 p-3">
                      <Avatar name={m.name} color={m.avatarColor} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink-800">{m.name}</p>
                        <p className="text-xs text-ink-400">{m.employeeId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-ink-900">{m.score.toLocaleString()}</p>
                        <p className="text-xs text-ink-400">{m.activitiesCompleted} activities</p>
                      </div>
                      <RankBadge rank={m.rank} />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Activity performance */}
            <div>
              <h4 className="mb-3 text-sm font-bold text-ink-900">Recent Group Activity</h4>
              <div className="space-y-2">
                {teamLogs.length === 0 ? (
                  <p className="text-xs text-ink-400 py-2">No activity logs recorded for this group.</p>
                ) : (
                  teamLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center gap-3 rounded-xl bg-ink-50 p-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink-800">{log.activityName}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <DifficultyBadge difficulty={log.difficulty} />
                          <span className="text-xs text-ink-400">{log.userName}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-ink-900">{log.score}</span>
                      <ResultBadge status={log.status} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit team modal */}
      <Modal
        open={!!editTeam}
        onClose={() => setEditTeam(null)}
        title="Edit Group / Team"
        subtitle={editTeam?.name}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditTeam(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </>
        }
      >
        {editTeam && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">Group Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">Description</label>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={3}
                className="input-field resize-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">Group Color</label>
              <div className="flex gap-2">
                {['#ef4444', '#3366ff', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setEditColor(c)}
                    className={`h-8 w-8 rounded-lg transition-all ${c === editColor ? 'ring-2 ring-offset-2 ring-brand-500 scale-105' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Status</label>
              <ReactSelect
                options={statusOptions}
                value={statusOptions.find((opt) => opt.value === editStatus)}
                onChange={(option) => setEditStatus((option?.value || 'active') as 'active' | 'inactive')}
                isSearchable={false}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

