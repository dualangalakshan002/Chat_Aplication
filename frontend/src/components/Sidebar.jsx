import React, { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Ellipsis } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers, deleteUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // Track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState(null);

  // Ref for detecting outside clicks
  const dropdownRef = useRef(null);

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isUsersLoading) return <SidebarSkeleton />;

  const toggleDropdown = (userId) => {
    setOpenDropdown((prev) => (prev === userId ? null : userId));
  };

  return (
    <aside
      className="
        h-full border-r border-base-300 flex flex-col transition-all duration-200
        w-16 sm:w-20 md:w-56 lg:w-72
      "
    >
      {/* Header */}
      <div className="border-b border-base-300 w-full p-3 sm:p-5">
        <div className="flex items-center gap-2">
          <Users className="size-5 sm:size-6" />
          <span className="font-medium hidden md:block">Contacts</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      {/* User List */}
      <div className="w-full py-2 sm:py-3">
        {users.length === 0 && (
          <div className="text-center text-gray-400 text-sm sm:text-base">
            No users found
          </div>
        )}

        {filteredUsers.map((user) => (
          <div key={user._id} className="relative w-full">
            <div
              className={`
                w-full px-2 py-2 sm:p-3 flex items-center gap-2 sm:gap-3 justify-between
                hover:bg-base-300 transition-colors cursor-pointer
                ${
                  selectedUser?._id === user._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }
              `}
            >
              {/* Left side (Avatar + User info) */}
              <div
                onClick={() => setSelectedUser(user)}
                className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                    className="size-10 sm:size-12 object-cover rounded-full"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 size-2.5 sm:size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                  )}
                </div>
                <div className="hidden md:block text-left min-w-0">
                  <div className="font-medium truncate text-sm sm:text-base">
                    {user.fullName}
                  </div>
                  <div className="text-xs sm:text-sm text-zinc-400">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </div>

              {/* Right side (Ellipsis dropdown trigger) */}
              <div className="relative" ref={dropdownRef}>
                <button
                  className="btn btn-ghost btn-xs text-zinc-500"
                  onClick={() => toggleDropdown(user._id)}
                  type="button"
                >
                  <Ellipsis className="text-zinc-500 size-4 sm:size-5" />
                </button>

                {/* Dropdown menu */}
                {openDropdown === user._id && (
                  <ul className="absolute right-0 mt-1 z-10 menu w-36 sm:w-40 rounded-box bg-base-100 shadow-sm text-sm">
                    <li>
                      <a onClick={() => alert(`Viewing ${user.fullName}`)}>
                        View Profile
                      </a>
                    </li>
                    <li>
                      <a onClick={() => alert(`Blocking ${user.fullName}`)}>
                        Block
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete ${user.fullName}?`
                            )
                          ) {
                            deleteUser(user._id);
                          }
                        }}
                      >
                        Delete
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
