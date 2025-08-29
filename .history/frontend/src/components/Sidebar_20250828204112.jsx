import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users, Ellipsis } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers()
  }, [getUsers])

  if (isUsersLoading) return <SidebarSkeleton />

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {users.length === 0 && (
          <div className="text-center text-gray-400">No users found</div>
        )}

        {users.map((user, index) => {
          // Generate unique ids for each user dropdown
          const popoverId = `popover-${index}`;
          const anchorName = `--anchor-${index}`;

          return (
            <div key={user._id} className="relative group w-full">
              <div
                className={`
                  w-full p-3 flex items-center gap-3 justify-between
                  hover:bg-base-300 transition-colors
                  ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                `}
              >
                {/* Left side (Avatar + User info) */}
                <div
                  onClick={() => setSelectedUser(user)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.fullName}
                      className="size-12 object-cover rounded-full"
                    />
                    {onlineUsers.includes(user._id) && (
                      <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                    )}
                  </div>
                  <div className="hidden lg:block text-left min-w-0">
                    <div className="font-medium truncate">{user.fullName}</div>
                    <div className="text-sm text-zinc-400">
                      {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                    </div>
                  </div>
                </div>

                {/* Right side (Ellipsis with dropdown trigger) */}
                <button
                  className="btn btn-ghost btn-xs"className="btn btn-ghosttext-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  popoverTarget={popoverId}
                  style={{ anchorName }}
                >
                  <Ellipsis className="text-zinc-500" />
                </button>

                {/* Dropdown menu */}
                <ul
                  className="dropdown menu w-40 rounded-box bg-base-100 shadow-sm"
                  popover="auto"
                  id={popoverId}
                  style={{ positionAnchor: anchorName }}
                >
                  <li><a onClick={() => alert(`Viewing ${user.fullName}`)}>View Profile</a></li>
                  <li><a onClick={() => alert(`Blocking ${user.fullName}`)}>Block</a></li>
                  <li><a onClick={() => alert(`Deleting ${user.fullName}`)}>Delete</a></li>
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  )
}

export default Sidebar
