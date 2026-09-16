import { useEffect, useState } from 'react';
import { FaHeart, FaUserPlus } from 'react-icons/fa';
import { FaRegComment } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import BottomNav from '../components/BottomNav';
import NavBar from '../components/NavBar';
import { apiJson } from '../api';

const notificationCopy = {
  like: ['liked your post', FaHeart],
  comment: ['commented on your post', FaRegComment],
  follow: ['started following you', FaUserPlus],
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiJson('/getNotifications', {}).then((data) => setNotifications(data.data || []))
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-2xl px-4 pb-24">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-pink-400">Your activity</p>
            <h1 className="mt-1 text-2xl font-semibold">Notifications</h1>
          </div>
          <span className="text-sm text-gray-500">{notifications.length} recent</span>
        </div>
        {loading ? <p className="text-gray-400">Loading activity...</p> : notifications.length === 0 ? (
          <div className="rounded-2xl border border-[#27272a] bg-[#121212] p-8 text-center text-gray-400">Your activity will show up here.</div>
        ) : (
          <div className="divide-y divide-[#27272a] rounded-2xl border border-[#27272a] bg-[#121212]">
            {notifications.map((notification) => {
              const [copy, Icon] = notificationCopy[notification.type] || notificationCopy.like;
              return <div key={notification._id} className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/15 text-pink-400"><Icon /></div>
                <p className="text-sm"><b>{notification.actor?.username || 'Someone'}</b> {copy}<span className="ml-2 text-xs text-gray-500">{new Date(notification.date).toLocaleDateString()}</span></p>
              </div>;
            })}
          </div>
        )}
      </main>
      <BottomNav />
    </>
  );
};

export default Notifications;
