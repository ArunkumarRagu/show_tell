import { useState } from 'react';
import { Plus, Edit2, Trash2, Shield, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { extractList, extractMeta } from '@/api/client';
import {
  useUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '@/hooks/queries/useUsers';
import { useTeamsQuery } from '@/hooks/queries/useTeams';
import type { User, Role, UserStatus } from '@/types';
import { Tooltip, InfoTooltip } from '@/components/ui/Tooltip';
import { tooltips } from '@/data/tooltip';
import { ReactSelect } from '@/components/ui/ReactSelect';

const roleOptions = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
];

const userStatusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

function capitalize(str?: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function normalizeUser(u: any): User {
  return {
    ...u,
    employeeId: u.employeeId || u.employee_id || '',
    teamId: u.teamId || u.team_id || '',
    teamName: u.teamName || u.team_name || '',
    avatarColor: u.avatarColor || u.avatar_color || '#7C3AED',
    activitiesCompleted: u.activitiesCompleted ?? u.activities_completed ?? 0,
    joinedDate: u.joinedDate || u.joined_date || '',
    lastActive: u.lastActive || u.last_active || '',
  };
}

export function AdminUsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const { data: usersData, isLoading: isLoadingUsers, isFetching: isFetchingUsers } = useUsersQuery({
    page: currentPage,
    page_size: pageSize,
  });
  const usersList = extractList(usersData).map(normalizeUser);
  const usersMeta = extractMeta(usersData);

  const { data: teamsData = [] } = useTeamsQuery();
  const teamsList = extractList(teamsData);

  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const deleteUserMutation = useDeleteUserMutation();

  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    password: '',
    teamId: '',
    role: 'user' as Role,
    status: 'active' as UserStatus,
  });

  const handleOpenModal = (u?: User) => {
    if (u) {
      setEditingUser(u);
      setFormData({
        name: u.name,
        employeeId: u.employeeId,
        email: u.email,
        password: '',
        teamId: u.teamId || '',
        role: u.role,
        status: u.status,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        employeeId: `EMP${Math.floor(100 + Math.random() * 900)}`,
        email: '',
        password: '',
        teamId: teamsList[0]?.id || '',
        role: 'user',
        status: 'active',
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.employeeId.trim()) {
      toast.error('Name, Employee ID, and Email are required');
      return;
    }
    try {
      const payload: Record<string, any> = { ...formData };
      if (editingUser && !payload.password) {
        delete payload.password;
      }

      if (editingUser) {
        await updateUserMutation.mutateAsync({ id: editingUser.id, payload });
        toast.success('User updated successfully');
      } else {
        await createUserMutation.mutateAsync(payload);
        toast.success('User created successfully');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || 'Operation failed');
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      await deleteUserMutation.mutateAsync(deletingUser.id);
      toast.success(`User "${deletingUser.name}" deleted successfully`);
      setDeletingUser(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete user');
    }
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'User',
      sortable: true,
      sortValue: (u) => u.name,
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar name={u.name} color={u.avatarColor} size="sm" />
          <div>
            <p className="font-semibold text-white">{u.name}</p>
            <p className="text-xs text-slate-400">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'employeeId',
      header: 'Employee ID',
      sortable: true,
      render: (u) => (
        <Tooltip content={tooltips.users.employeeId} position="top">
          <span className="font-mono text-xs text-purple-300 cursor-pointer">{u.employeeId}</span>
        </Tooltip>
      ),
    },
    {
      key: 'teamName',
      header: 'Team',
      sortable: true,
      render: (u) => <span className="text-slate-300">{u.teamName || 'Unassigned'}</span>,
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (u) => (
        <Tooltip content={tooltips.users.role} position="top">
          <span
            className={`badge ${
              u.role === 'admin'
                ? 'bg-purple-950/80 text-purple-300 border border-purple-700/50'
                : 'bg-slate-800/80 text-slate-300 border border-slate-700/50'
            }`}
          >
            {u.role === 'admin' && <Shield className="mr-1 h-3 w-3 text-purple-400" />}
            {capitalize(u.role)}
          </span>
        </Tooltip>
      ),
    },
    {
      key: 'score',
      header: 'Score',
      sortable: true,
      sortValue: (u) => u.score,
      render: (u) => (
        <Tooltip content={tooltips.users.score} position="top">
          <span className="font-bold text-purple-400">{u.score} pts</span>
        </Tooltip>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (u) => (
        <Tooltip content={tooltips.users.status} position="top">
          <span
            className={`badge ${
              u.status === 'active'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                : 'bg-rose-950/80 text-rose-300 border border-rose-800/50'
            }`}
          >
            {capitalize(u.status)}
          </span>
        </Tooltip>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (u) => (
        <div className="flex justify-end gap-2">
          <Tooltip content={tooltips.users.editUser} position="top">
            <button onClick={() => handleOpenModal(u)} className="btn-icon">
              <Edit2 className="h-4 w-4 text-slate-400 hover:text-white" />
            </button>
          </Tooltip>
          <Tooltip content={tooltips.users.toggleUserStatus} position="top">
            <button
              onClick={() => setDeletingUser(u)}
              disabled={deleteUserMutation.isPending}
              className="btn-icon"
            >
              <Trash2 className="h-4 w-4 text-rose-400 hover:text-rose-300" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Users</h1>
          <p className="mt-1 text-sm text-slate-400">View, add, edit, and assign roles to platform members.</p>
        </div>
        <Tooltip content={tooltips.users.addUser} position="left">
          <button onClick={() => handleOpenModal()} className="btn-primary">
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </Tooltip>
      </div>

      <DataTable
        columns={columns}
        data={usersList}
        isLoading={isLoadingUsers}
        isFetching={isFetchingUsers}
        searchable
        searchPlaceholder="Search by name, email or employee ID..."
        searchFields={(u) => [u.name, u.email, u.employeeId, u.teamName]}
        meta={usersMeta}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
        pageSizeOptions={[5, 10, 20, 50]}
        emptyMessage="No users found."
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div>
            <div className="mb-1 flex items-center gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <InfoTooltip content={tooltips.users.name} />
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="mb-1 flex items-center gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Employee ID</label>
                <InfoTooltip content={tooltips.users.employeeId} />
              </div>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="input font-mono"
                required
              />
            </div>
            <div>
              <div className="mb-1 flex items-center gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Email</label>
                <InfoTooltip content={tooltips.users.email} />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                required
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center gap-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {editingUser ? 'New Password (optional)' : 'Password'}
              </label>
              <InfoTooltip content={tooltips.users.resetPassword} />
            </div>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input"
              placeholder={editingUser ? 'Leave blank to keep current password' : 'Enter new user password'}
              required={!editingUser}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="mb-1 flex items-center gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Team</label>
                <InfoTooltip content={tooltips.users.team} />
              </div>
              <ReactSelect
                options={[{ value: '', label: 'None' }, ...teamsList.map((t) => ({ value: t.id, label: t.name }))]}
                value={
                  formData.teamId
                    ? {
                        value: formData.teamId,
                        label: teamsList.find((t) => t.id === formData.teamId)?.name || 'None',
                      }
                    : { value: '', label: 'None' }
                }
                onChange={(option) => setFormData({ ...formData, teamId: option?.value || '' })}
                isSearchable
              />
            </div>
            <div>
              <div className="mb-1 flex items-center gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Role</label>
                <InfoTooltip content={tooltips.users.role} />
              </div>
              <ReactSelect
                options={roleOptions}
                value={roleOptions.find((opt) => opt.value === formData.role)}
                onChange={(option) => setFormData({ ...formData, role: (option?.value || 'user') as Role })}
                isSearchable={false}
              />
            </div>
            <div>
              <div className="mb-1 flex items-center gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Status</label>
                <InfoTooltip content={tooltips.users.status} />
              </div>
              <ReactSelect
                options={userStatusOptions}
                value={userStatusOptions.find((opt) => opt.value === formData.status)}
                onChange={(option) => setFormData({ ...formData, status: (option?.value || 'active') as UserStatus })}
                isSearchable={false}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={createUserMutation.isPending || updateUserMutation.isPending}
              className="btn-primary"
            >
              {createUserMutation.isPending || updateUserMutation.isPending ? 'Saving...' : 'Save User'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete User Confirmation Modal */}
      <Modal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        title="Delete User"
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
            Are you sure you want to delete user <span className="font-bold text-white">"{deletingUser?.name}"</span> ({deletingUser?.email})?
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#26324A]">
            <button
              type="button"
              onClick={() => setDeletingUser(null)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDeleteUser}
              disabled={deleteUserMutation.isPending}
              className="btn-danger flex items-center gap-2"
            >
              {deleteUserMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete User'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
