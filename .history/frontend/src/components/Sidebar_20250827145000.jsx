import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, deleteUser } = useChatStore();
  const { onlineUsers,de } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      {/* Users List */}
      <div className="overflow-y-auto w-full py-3">
        {users.length === 0 && (
          <div className="text-center text-gray-400">No users found</div>
        )}

        {users.map((user) => (
          <div
            key={user._id}
            className={`group relative w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""
            }`}
          >
            {/* Avatar */}
            <div
              className="relative mx-auto lg:mx-0 flex-1 cursor-pointer"
              onClick={() => setSelectedUser(user)}
            >
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            {/* User Info */}
            <div
              className="hidden lg:block text-left min-w-0 flex-1 cursor-pointer"
              onClick={() => setSelectedUser(user)}
            >
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>

            {/* Delete Button (only visible on hover) */}
            <button
              onClick={() => deleteUser(user._id)}
              className="hidden group-hover:flex items-center justify-center p-2 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
