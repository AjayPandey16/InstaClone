import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BottomNav from '../components/BottomNav';
import NavBar from '../components/NavBar';
import { api_base_url } from '../helper';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80';

const Search = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(api_base_url + '/getUsers', {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
        }),
      });

      const data = await res.json();
      if (data.success) {
        const currentUserId = localStorage.getItem('userId');
        const mappedUsers = (data.data || []).map((user) => ({
          ...user,
          followersCount: user.followers ? user.followers.length : 0,
          isYouFollowed: user.followers ? user.followers.some((follower) => follower.userId === currentUserId) : false,
        }));
        setUsers(mappedUsers);
      } else {
        toast.error(data.msg || 'Unable to load users');
      }
    } catch (error) {
      toast.error('Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return users;
    }

    return users.filter((user) => {
      const fullName = `${user.username || ''} ${user.name || ''}`.toLowerCase();
      return fullName.includes(search);
    });
  }, [query, users]);

  const toggleFollow = async (userId) => {
    const currentUser = users.find((user) => user._id === userId);

    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user._id !== userId) {
          return user;
        }

        return {
          ...user,
          isYouFollowed: !user.isYouFollowed,
          followersCount: user.isYouFollowed ? Math.max(0, user.followersCount - 1) : user.followersCount + 1,
        };
      })
    );

    try {
      const res = await fetch(api_base_url + '/toggleFollow', {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: localStorage.getItem('token'),
          userId,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        toast.error(data.msg || 'Action failed');
        setUsers((prevUsers) =>
          prevUsers.map((user) => {
            if (user._id !== userId) {
              return user;
            }

            return {
              ...user,
              isYouFollowed: currentUser.isYouFollowed,
              followersCount: currentUser.followersCount,
            };
          })
        );
      }
    } catch (error) {
      toast.error('Action failed');
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user._id !== userId) {
            return user;
          }

          return {
            ...user,
            isYouFollowed: currentUser.isYouFollowed,
            followersCount: currentUser.followersCount,
          };
        })
      );
    }
  };

  return (
    <>
      <NavBar />
      <div className="mx-auto max-w-4xl px-2.5 pb-24">
        <div className="sticky top-0 z-10 mb-4 rounded-xl border border-[#27272a] bg-[#121212]/90 p-3 backdrop-blur-sm">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people"
            className="w-full rounded-xl border border-[#27272a] bg-black px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-400"
          />
        </div>

        {loading ? (
          <div className="mt-8 text-center text-sm text-gray-400">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="mt-8 text-center text-sm text-gray-400">No users found.</div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div key={user._id} className="flex items-center justify-between rounded-xl border border-[#27272a] bg-[#121212] p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={DEFAULT_AVATAR}
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_AVATAR;
                    }}
                    alt={user.username}
                    className="h-12 w-12 rounded-full object-cover"
                  />

                  <div
                    className="min-w-0 cursor-pointer"
                    onClick={() => navigate(`/profile/${user._id}`)}
                  >
                    <p className="truncate font-medium">{user.username}</p>
                    <p className="truncate text-sm text-gray-400">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.followersCount} followers</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFollow(user._id)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    user.isYouFollowed ? 'bg-gray-700 text-white' : 'bg-[#3797EF] text-white'
                  }`}
                >
                  {user.isYouFollowed ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </>
  );
};

export default Search;
