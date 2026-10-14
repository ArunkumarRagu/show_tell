import { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  Loader2,
  AlertTriangle,
  X,
  ChevronRight,
  Trophy,
  Star,
  UserMinus,
  UserPlus,
  Activity,
  Info,
} from 'lucide-react';
import { toast } from 'react-toastify';

import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { Avatar } from '@/components/ui/Avatar';
import { extractList, extractMeta } from '@/api/client';
import {
  useTeamsQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} from '@/hooks/queries/useTeams';
import { useUsersQuery, useUpdateUserMutation } from '@/hooks/queries/useUsers';
import type { Team, User } from '@/types';
import { Tooltip, InfoTooltip } from '@/components/ui/Tooltip';
import { tooltips } from '@/data/tooltip';
import { ReactSelect } from '@/components/ui/ReactSelect';

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

// ─── Team Detail Drawer (Slide-over overlay) ──────────────────────────────────
interface TeamDetailDrawerProps {
  team: Team | null;
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void;
  onClose: () => void;
  allUsers: User[];
  usersLoading: boolean;
}

function TeamDetailDrawer({
  team,
  onEdit,
  onDelete,
  onClose,
  allUsers,
  usersLoading,
}: TeamDetailDrawerProps) {
  const updateUserMutation = useUpdateUserMutation();
  const [addingMember, setAddingMember] = useState(false);
  const [selectedNewMember, setSelectedNewMember] = useState<{ value: string; label: string } | null>(null);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);

  // Reset add member state when team changes
  useEffect(() => {
    setAddingMember(false);
    setSelectedNewMember(null);
  }, [team?.id]);

  const teamMembers = useMemo(
    () =>
      team
        ? allUsers
            .filter((u) => u.teamId && u.teamId === team.id)
            .sort((a, b) => b.score - a.score)
        : [],
    [allUsers, team]
  );

  const availableUsers = useMemo(
    () =>
      allUsers
        .filter((u) => !u.teamId || u.teamId !== team?.id)
        .map((u) => ({ value: u.id, label: `${u.name} (${u.employeeId})` })),
    [allUsers, team]
  );

  const handleAddMember = async () => {
    if (!selectedNewMember || !team) return;
    try {
      await updateUserMutation.mutateAsync({
        id: selectedNewMember.value,
        payload: { teamId: team.id },
      });
      toast.success(`User added to ${team.name}`);
      setSelectedNewMember(null);
      setAddingMember(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (user: User) => {
    setRemovingUserId(user.id);
    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        payload: { teamId: '' },
      });
      toast.success(`${user.name} removed from ${team?.name}`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to remove member');
    } finally {
      setRemovingUserId(null);
    }
  };

  const topMember = teamMembers[0];
  const isOpen = !!team;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: '#0F172A' }}
      >
        {team && (
          <>
            {/* Header */}
            <div
              className="relative flex items-start justify-between px-5 py-5 shrink-0"
              style={{
                background: `linear-gradient(135deg, ${team.color}25 0%, ${team.color}08 60%, transparent 100%)`,
                borderBottom: `1px solid ${team.color}35`,
              }}
            >
              {/* Colored left accent bar */}
              <div
                className="absolute inset-y-0 left-0 w-1"
                style={{ backgroundColor: team.color }}
              />

              <div className="flex items-center gap-3 pl-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold text-white shadow-lg"
                  style={{ backgroundColor: team.color, boxShadow: `0 4px 20px ${team.color}60` }}
                >
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">{team.name}</h2>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        team.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                          : 'bg-slate-500/15 text-slate-400 border border-slate-500/25'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${team.status === 'active' ? 'bg-emerald-400' : 'bg-slate-400'}`}
                      />
                      {team.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-slate-400">Rank #{team.rank}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Tooltip content={tooltips.teams.editTeam} position="bottom">
                  <button
                    onClick={() => onEdit(team)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 transition-all hover:border-brand-500/40 hover:text-white"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </Tooltip>
                <Tooltip content={tooltips.teams.toggleStatus} position="bottom">
                  <button
                    onClick={() => onDelete(team)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-red-400 transition-all hover:border-red-500/40 hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </Tooltip>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 transition-all hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-0 border-b border-slate-800 shrink-0">
              {[
                {
                  icon: <Star className="h-3.5 w-3.5" />,
                  label: 'Score',
                  value: team.score.toLocaleString(),
                  color: 'text-brand-400',
                },
                {
                  icon: <Activity className="h-3.5 w-3.5" />,
                  label: 'Activities',
                  value: team.activitiesCompleted,
                  color: 'text-cyan-400',
                },
                {
                  icon: <Users className="h-3.5 w-3.5" />,
                  label: 'Members',
                  value: teamMembers.length,
                  color: 'text-amber-400',
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center py-4 ${i < 2 ? 'border-r border-slate-800' : ''}`}
                >
                  <div className={`flex items-center gap-1 ${stat.color} mb-0.5`}>
                    {stat.icon}
                    <span className="text-base font-extrabold">{stat.value}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="px-5 py-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-1.5 mb-2">
                <Info className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                  Description
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {team.description || <span className="italic text-slate-500">No description provided.</span>}
              </p>
            </div>

            {/* Members Section */}
            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                    Members
                  </span>
                  <span className="flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-brand-500/20 px-1 text-[10px] font-bold text-brand-400">
                    {teamMembers.length}
                  </span>
                </div>
                <button
                  onClick={() => setAddingMember((v) => !v)}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    addingMember
                      ? 'bg-slate-700 text-white'
                      : 'bg-brand-500/15 text-brand-400 hover:bg-brand-500/25'
                  }`}
                >
                  {addingMember ? (
                    <>
                      <X className="h-3 w-3" /> Cancel
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3 w-3" /> Add Member
                    </>
                  )}
                </button>
              </div>

              {/* Add Member Row */}
              {addingMember && (
                <div className="flex items-center gap-2 px-5 py-3 bg-slate-900/80 border-b border-slate-800 shrink-0">
                  <div className="flex-1">
                    <ReactSelect
                      options={availableUsers}
                      value={selectedNewMember}
                      onChange={(opt) => setSelectedNewMember(opt as any)}
                      placeholder="Search & select user..."
                      isSearchable
                    />
                  </div>
                  <button
                    onClick={handleAddMember}
                    disabled={!selectedNewMember || updateUserMutation.isPending}
                    className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    {updateUserMutation.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <UserPlus className="h-3 w-3" />
                    )}
                    Add
                  </button>
                </div>
              )}

              {/* Members List */}
              <div className="flex-1 overflow-y-auto">
                {usersLoading ? (
                  <div className="flex h-24 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
                  </div>
                ) : teamMembers.length === 0 ? (
                  <div className="flex h-48 flex-col items-center justify-center gap-3 text-center px-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
                      <Users className="h-7 w-7 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-400">No members yet</p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Click "Add Member" to assign users to this team.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/60">
                    {teamMembers.map((member, idx) => (
                      <div
                        key={member.id}
                        className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-800/40"
                      >
                        {/* Rank badge */}
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                          {idx === 0 ? (
                            <Trophy className="h-4 w-4 text-amber-400" />
                          ) : (
                            <span className="text-[11px] font-bold text-slate-500">#{idx + 1}</span>
                          )}
                        </div>

                        <Avatar name={member.name} color={member.avatarColor} size="sm" />

                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-semibold text-white">{member.name}</p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-500">{member.employeeId}</span>
                            {member.role === 'admin' && (
                              <span className="rounded px-1 py-0 text-[9px] font-bold bg-brand-500/20 text-brand-400">
                                ADMIN
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm font-extrabold text-brand-400">
                              {member.score.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-slate-500">pts</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-semibold text-cyan-400">
                              {member.activitiesCompleted}
                            </p>
                            <p className="text-[10px] text-slate-500">acts</p>
                          </div>
                          <Tooltip content="Remove from team" position="left">
                            <button
                              onClick={() => handleRemoveMember(member)}
                              disabled={removingUserId === member.id}
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-600 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/15 hover:text-red-400 disabled:opacity-50"
                            >
                              {removingUserId === member.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <UserMinus className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top performer callout */}
              {topMember && (
                <div
                  className="flex items-center gap-3 border-t border-slate-800 px-5 py-3.5 shrink-0"
                  style={{ background: `${team.color}12` }}
                >
                  <Trophy className="h-4 w-4 text-amber-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-slate-500 uppercase tracking-wider">Top Performer</p>
                    <p className="truncate text-sm font-bold text-white">{topMember.name}</p>
                  </div>
                  <span className="text-sm font-extrabold text-amber-400">
                    {topMember.score.toLocaleString()} pts
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export function AdminTeamsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deletingTeam, setDeletingTeam] = useState<Team | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const pageSize = 9;

  const { data: teamsData, isLoading } = useTeamsQuery({ page: currentPage, page_size: pageSize });
  const teamsList = extractList(teamsData);
  const teamsMeta = extractMeta(teamsData);

  // Fetch ALL users with a large page_size to populate member lists
  const { data: usersData, isLoading: usersLoading } = useUsersQuery({ page_size: 1000 });
  const allUsers = extractList(usersData);

  const createMutation = useCreateTeamMutation();
  const updateMutation = useUpdateTeamMutation();
  const deleteMutation = useDeleteTeamMutation();

  const [formData, setFormData] = useState({
    name: '',
    color: '#7C3AED',
    description: '',
    status: 'active' as 'active' | 'inactive',
  });

  const handleOpenModal = (team?: Team) => {
    if (team) {
      setEditingTeam(team);
      setFormData({
        name: team.name,
        color: team.color,
        description: team.description,
        status: team.status,
      });
    } else {
      setEditingTeam(null);
      setFormData({
        name: '',
        color: '#7C3AED',
        description: '',
        status: 'active',
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Team name is required');
      return;
    }
    try {
      if (editingTeam) {
        await updateMutation.mutateAsync({ id: editingTeam.id, payload: formData });
        toast.success('Team updated successfully');
        // Sync the detail panel if the edited team is currently selected
        if (selectedTeam?.id === editingTeam.id) {
          setSelectedTeam({ ...selectedTeam, ...formData });
        }
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('Team created successfully');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || 'Operation failed');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingTeam) return;
    try {
      await deleteMutation.mutateAsync(deletingTeam.id);
      toast.success(`Team "${deletingTeam.name}" deleted successfully`);
      if (selectedTeam?.id === deletingTeam.id) setSelectedTeam(null);
      setDeletingTeam(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete team');
    }
  };

  const filteredTeams = teamsList.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Keep selectedTeam in sync with fresh data
  const liveSelectedTeam = selectedTeam
    ? teamsList.find((t) => t.id === selectedTeam.id) ?? selectedTeam
    : null;

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Teams</h1>
          <p className="mt-1 text-sm text-slate-400">
            Create, update, and monitor team performance.
          </p>
        </div>
        <Tooltip content={tooltips.teams.addTeam} position="left">
          <button onClick={() => handleOpenModal()} className="btn-primary">
            <Plus className="h-4 w-4" />
            Create Team
          </button>
        </Tooltip>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search teams..."
          className="input pl-10"
        />
      </div>

      {/* Team Cards Grid */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTeams.map((team) => {
              const memberCount = allUsers.filter((u) => u.teamId && u.teamId === team.id).length;
              const isSelected = liveSelectedTeam?.id === team.id;
              return (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeam(isSelected ? null : team)}
                  className={`group relative w-full rounded-2xl border p-5 text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-brand-500/60 bg-[#1C2742] shadow-lg shadow-brand-500/10'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/60 hover:shadow-md'
                  }`}
                >
                  {/* Selected indicator */}
                  {isSelected && (
                    <div
                      className="absolute inset-y-0 left-0 w-1 rounded-l-2xl"
                      style={{ backgroundColor: team.color }}
                    />
                  )}

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white shadow-sm transition-transform group-hover:scale-105"
                        style={{
                          backgroundColor: team.color,
                          boxShadow: `0 4px 12px ${team.color}40`,
                        }}
                      >
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white leading-tight">{team.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${team.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500'}`}
                          />
                          <p className="text-xs text-slate-400 capitalize">{team.status}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Tooltip content={tooltips.teams.editTeam} position="top">
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(team);
                          }}
                          onKeyDown={(e) => e.key === 'Enter' && (e.stopPropagation(), handleOpenModal(team))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-slate-700 hover:text-white"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </span>
                      </Tooltip>
                      <Tooltip content={tooltips.teams.toggleStatus} position="top">
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingTeam(team);
                          }}
                          onKeyDown={(e) => e.key === 'Enter' && (e.stopPropagation(), setDeletingTeam(team))}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </span>
                      </Tooltip>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-400 line-clamp-2 min-h-[2rem]">
                    {team.description || 'No description.'}
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-950/60 px-3 py-2">
                    <div className="text-center">
                      <p className="text-xs font-extrabold text-brand-400">
                        {team.score.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-500">pts</p>
                    </div>
                    <div className="text-center border-x border-slate-800">
                      <p className="text-xs font-extrabold text-cyan-400">
                        {team.activitiesCompleted}
                      </p>
                      <p className="text-[10px] text-slate-500">acts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-extrabold text-amber-400">{memberCount}</p>
                      <p className="text-[10px] text-slate-500">members</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-slate-600">
                      Rank #{team.rank}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 group-hover:text-brand-400 transition-colors">
                      {isSelected ? 'Close panel' : 'View details'}
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredTeams.length === 0 && (
            <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-800">
              <Users className="h-10 w-10 text-slate-600" />
              <p className="text-sm text-slate-500">No teams found</p>
            </div>
          )}

          <Pagination meta={teamsMeta} onPageChange={setCurrentPage} />
        </div>
      )}

      {/* ── Right-side slide-over drawer ── */}
      <TeamDetailDrawer
        team={liveSelectedTeam}
        onEdit={(team) => {
          handleOpenModal(team);
        }}
        onDelete={setDeletingTeam}
        onClose={() => setSelectedTeam(null)}
        allUsers={allUsers}
        usersLoading={usersLoading}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTeam ? 'Edit Team' : 'Create Team'}
      >
        <form onSubmit={handleSaveTeam} className="space-y-4">
          <div>
            <div className="mb-1 flex items-center gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Team Name</label>
              <InfoTooltip content={tooltips.teams.teamName} />
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="e.g. Phoenix"
              required
            />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Team Color</label>
              <InfoTooltip content={tooltips.teams.teamColor} />
            </div>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="h-10 w-16 rounded border border-slate-700 bg-slate-900 cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="input flex-1"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input h-20 py-2"
              placeholder="Team motto or focus..."
            />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Status</label>
              <InfoTooltip content={tooltips.teams.teamStatus} />
            </div>
            <ReactSelect
              options={statusOptions}
              value={statusOptions.find((opt) => opt.value === formData.status)}
              onChange={(option) =>
                setFormData({
                  ...formData,
                  status: (option?.value || 'active') as 'active' | 'inactive',
                })
              }
              isSearchable={false}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="btn-primary"
            >
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Team'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingTeam}
        onClose={() => setDeletingTeam(null)}
        title="Delete Team"
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
            Are you sure you want to delete team{' '}
            <span className="font-bold text-white">"{deletingTeam?.name}"</span>? All associated
            settings and data will be permanently removed.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setDeletingTeam(null)}
              className="btn-secondary"
            >
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
                'Delete Team'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
