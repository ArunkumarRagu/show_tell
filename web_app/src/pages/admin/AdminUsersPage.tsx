import { useState } from 'react';
import { UserPlus, Pencil, ArrowRightLeft, Power, Eye, ShieldCheck, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge, RankBadge, RoleBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { users as initialUsers, teams, activityLogs } from '@/data/mockData';
import type { User, Role } from '@/types';

export function AdminUsersPage() {
  const [userList, setUserList] = useState<User[]>(initialUsers);
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [changeTeam, setChangeTeam] = useState<User | null>(null);

  // Form states for adding user
  const [newName, setNewName] = useState('');
  const [newEmpId, setNewEmpId] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTeamId, setNewTeamId] = useState(teams[0]?.id || '');
  const [newRole, setNewRole] = useState<Role>('user');

  // Form states for editing user
  const [editName, setEditName] = useState('');
  const [editEmpId, setEditEmpId] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'inactive'>('active');
  const [editRole, setEditRole] = useState<Role>('user');

  // Form state for changing team
  const [selectedTeamId, setSelectedTeamId] = useState('');

  const filteredUsers = userList.filter((u) => {
    if (roleFilter === 'all') return true;
    return u.role === roleFilter;
  });

  const handleAddUser = () => {
    if (!newName.trim() || !newEmail.trim() || !newEmpId.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const team = teams.find((t) => t.id === newTeamId) || teams[0];
    const newUser: User = {
      id: `u_${Date.now()}`,
      name: newName,
      employeeId: newEmpId,
      email: newEmail,
      teamId: team.id,
      teamName: team.name,
      score: 0,
      rank: userList.length + 1,
      status: 'active',
      role: newRole,
      activitiesCompleted: 0,
      avatarColor: '#3366ff',
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
    };

    setUserList([newUser, ...userList]);
    setAddOpen(false);
    setNewName('');
    setNewEmpId('');
    setNewEmail('');
    toast.success(`User "${newUser.name}" added successfully as ${newUser.role}!`);
  };

  const handleOpenEdit = (user: User) => {
    setEditUser(user);
    setEditName(user.name);
    setEditEmpId(user.employeeId);
    setEditEmail(user.email);
    setEditStatus(user.status);
    setEditRole(user.role);
  };

  const handleSaveEdit = () => {
    if (!editUser) return;
    setUserList((prev) =>
      prev.map((u) =>
        u.id === editUser.id
          ? { ...u, name: editName, employeeId: editEmpId, email: editEmail, status: editStatus, role: editRole }
          : u
      )
    );
    setEditUser(null);
    toast.success(`User "${editName}" updated successfully!`);
  };

  const handleOpenChangeTeam = (user: User) => {
    setChangeTeam(user);
    const available = teams.filter((t) => t.id !== user.teamId);
    if (available.length > 0) {
      setSelectedTeamId(available[0].id);
    }
  };

  const handleSaveTeam = () => {
    if (!changeTeam) return;
    const targetTeam = teams.find((t) => t.id === selectedTeamId);
    if (!targetTeam) return;

    setUserList((prev) =>
      prev.map((u) =>
        u.id === changeTeam.id ? { ...u, teamId: targetTeam.id, teamName: targetTeam.name } : u
      )
    );
    toast.success(`Moved ${changeTeam.name} to team ${targetTeam.name}!`);
    setChangeTeam(null);
  };

  const handleToggleStatus = (user: User) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    setUserList((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );
    if (nextStatus === 'active') {
      toast.info(`Account for ${user.name} activated`);
    } else {
      toast.warning(`Account for ${user.name} deactivated`);
    }
  };

  const handleToggleRole = (user: User) => {
    const nextRole: Role = user.role === 'admin' ? 'user' : 'admin';
    setUserList((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u))
    );
    toast.info(`Role for ${user.name} changed to ${nextRole.toUpperCase()}`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User & Admin Management</h1>
          <p className="mt-1 text-sm text-ink-400">Manage all accounts, assign user vs admin roles, and change team groups.</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <UserPlus className="h-4 w-4" />
          Add Account
        </Button>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#26324A] pb-4">
        <button
          onClick={() => setRoleFilter('all')}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
            roleFilter === 'all'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-[#151E33] text-slate-300 border border-[#26324A] hover:bg-[#1C2742] hover:text-white'
          }`}
        >
          All Accounts ({userList.length})
        </button>
        <button
          onClick={() => setRoleFilter('user')}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
            roleFilter === 'user'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-[#151E33] text-slate-300 border border-[#26324A] hover:bg-[#1C2742] hover:text-white'
          }`}
        >
          Users ({userList.filter((u) => u.role === 'user').length})
        </button>
        <button
          onClick={() => setRoleFilter('admin')}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
            roleFilter === 'admin'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-[#151E33] text-slate-300 border border-[#26324A] hover:bg-[#1C2742] hover:text-white'
          }`}
        >
          Admins ({userList.filter((u) => u.role === 'admin').length})
        </button>
      </div>

      <Card className="overflow-hidden border border-[#26324A]">
        <Table<User>
          columns={[
            {
              key: 'name',
              header: 'Name',
              render: (row) => (
                <div className="flex items-center gap-3">
                  <Avatar name={row.name} color={row.avatarColor} size="sm" />
                  <div>
                    <p className="font-bold text-white">{row.name}</p>
                    <p className="text-xs text-slate-400">{row.email}</p>
                  </div>
                </div>
              ),
            },
            { key: 'empId', header: 'Employee ID', render: (row) => <span className="font-mono text-xs font-semibold text-cyan-300">{row.employeeId}</span> },
            {
              key: 'role',
              header: 'Users / Role',
              render: (row) => (
                <div className="flex items-center gap-2">
                  <RoleBadge role={row.role} />
                  <button
                    onClick={() => handleToggleRole(row)}
                    className="text-xs text-purple-400 hover:text-purple-300 underline"
                    title="Toggle Role"
                  >
                    Switch
                  </button>
                </div>
              ),
            },
            { key: 'team', header: 'Groups / Team', render: (row) => <span className="font-medium text-slate-200">{row.teamName}</span> },
            { key: 'score', header: 'Score', render: (row) => <span className="font-display font-extrabold text-white">{row.score.toLocaleString()}</span> },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) => (
                <div className="flex items-center gap-1">
                  <button onClick={() => setViewUser(row)} className="rounded-lg p-1.5 text-slate-400 hover:bg-[#1C2742] hover:text-purple-400" title="View Details">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleOpenEdit(row)} className="rounded-lg p-1.5 text-slate-400 hover:bg-[#1C2742] hover:text-purple-400" title="Edit Account">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleOpenChangeTeam(row)} className="rounded-lg p-1.5 text-slate-400 hover:bg-[#1C2742] hover:text-purple-400" title="Change Group/Team">
                    <ArrowRightLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(row)}
                    className={`rounded-lg p-1.5 ${row.status === 'active' ? 'text-slate-400 hover:bg-rose-500/20 hover:text-rose-400' : 'text-emerald-400 hover:bg-emerald-500/20'}`}
                    title={row.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                  >
                    <Power className="h-4 w-4" />
                  </button>
                </div>
              ),
            },
          ]}
          data={filteredUsers}
        />
      </Card>


      {/* Add user modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Account"
        subtitle="Create a new user or admin account"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Create Account</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">Full Name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">Employee ID</label>
              <input
                type="text"
                placeholder="EMP025"
                value={newEmpId}
                onChange={(e) => setNewEmpId(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-600">Email Address</label>
            <input
              type="email"
              placeholder="jane.doe@hat.co"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">Role / Type</label>
              <select
                className="input-field"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as Role)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">Group / Team</label>
              <select
                className="input-field"
                value={newTeamId}
                onChange={(e) => setNewTeamId(e.target.value)}
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit user modal */}
      <Modal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        title="Edit Account"
        subtitle={editUser?.name}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </>
        }
      >
        {editUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-600">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-600">Employee ID</label>
                <input
                  type="text"
                  value={editEmpId}
                  onChange={(e) => setEditEmpId(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">Email Address</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-600">Role / Type</label>
                <select
                  className="input-field"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as Role)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-600">Status</label>
                <select
                  className="input-field"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as 'active' | 'inactive')}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Change team modal */}
      <Modal
        open={!!changeTeam}
        onClose={() => setChangeTeam(null)}
        title="Change Group / Team"
        subtitle={changeTeam ? `Move ${changeTeam.name} to a new team` : ''}
        footer={
          <>
            <Button variant="secondary" onClick={() => setChangeTeam(null)}>Cancel</Button>
            <Button onClick={handleSaveTeam}>Change Team</Button>
          </>
        }
      >
        {changeTeam && (
          <div className="space-y-3">
            <div className="rounded-xl bg-ink-50 p-3">
              <p className="text-sm text-ink-500">Current Group / Team</p>
              <p className="text-base font-bold text-ink-900">{changeTeam.teamName}</p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-600">New Group / Team</label>
              <select
                className="input-field"
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
              >
                {teams.filter((t) => t.id !== changeTeam.teamId).map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Modal>

      {/* View user details modal */}
      <Modal
        open={!!viewUser}
        onClose={() => setViewUser(null)}
        title="Account Details"
        subtitle={viewUser?.name}
        size="lg"
      >
        {viewUser && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar name={viewUser.name} color={viewUser.avatarColor} size="lg" />
              <div>
                <h3 className="text-lg font-bold text-ink-900">{viewUser.name}</h3>
                <p className="text-sm text-ink-500">{viewUser.email}</p>
                <div className="mt-2 flex items-center gap-2">
                  <RoleBadge role={viewUser.role} />
                  <StatusBadge status={viewUser.status} />
                  {viewUser.role === 'user' && <RankBadge rank={viewUser.rank} />}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-brand-50 p-3 text-center">
                <p className="text-xs text-ink-400">Score</p>
                <p className="text-lg font-bold text-ink-900">{viewUser.score.toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-success-50 p-3 text-center">
                <p className="text-xs text-ink-400">Activities</p>
                <p className="text-lg font-bold text-ink-900">{viewUser.activitiesCompleted}</p>
              </div>
              <div className="rounded-xl bg-accent-50 p-3 text-center">
                <p className="text-xs text-ink-400">Group / Team</p>
                <p className="text-lg font-bold text-ink-900">{viewUser.teamName}</p>
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-bold text-ink-900">Recent Activity</h4>
              <div className="space-y-2">
                {activityLogs.filter((l) => l.userId === viewUser.id).slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center justify-between rounded-xl bg-ink-50 p-3">
                    <div>
                      <p className="text-sm font-medium text-ink-800">{log.activityName}</p>
                      <p className="text-xs text-ink-400">{log.date}</p>
                    </div>
                    <span className="text-sm font-bold text-ink-900">{log.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

