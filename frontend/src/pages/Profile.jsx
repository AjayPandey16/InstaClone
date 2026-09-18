import React, { useCallback, useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { FaRegBookmark, FaRegComment, FaRegHeart } from 'react-icons/fa6';
import { FiGrid } from 'react-icons/fi';
import NavBar from '../components/NavBar';
import BottomNav from '../components/BottomNav';
import { apiJson } from '../api';
import { api_base_url, getAvatarForUser } from '../helper';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80';
const DEFAULT_POST_IMAGE = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isYouFollowed, setIsYouFollowed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', avatar: '' });

  const getUserDetails = useCallback(async () => {
    try {
      const data = await apiJson('/getUserDetails', { userId: id });
      setUserDetails(data.data);
      setIsYouFollowed(data.data.isYouFollowed);
      setEditForm({ name: data.data.name || '', bio: data.data.bio || '', avatar: data.data.avatar || '' });
    } catch (error) {
      toast.error(error.message || 'Unable to get user details');
    }
  }, [id]);

  const getMyPosts = useCallback(async () => {
    try {
      const data = await apiJson('/getMyPosts', { userId: id });
      setPosts(data.data || []);
    } catch (error) {
      toast.error(error.message || 'Unable to load posts');
    }
  }, [id]);

  const toggleFollow = async () => {
    try {
      const data = await apiJson('/toggleFollow', { userId: id });
      toast.success(data.action === 'Follow' ? 'Following' : 'Unfollowed');
      setIsYouFollowed(data.action === 'Follow');
      setUserDetails((previous) => previous ? { ...previous, followers: data.followers } : previous);
    } catch (error) {
      toast.error(error.message || 'Unable to update follow status');
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    try {
      setIsSaving(true);
      const data = await apiJson('/updateProfile', editForm);
      setUserDetails((previous) => ({ ...previous, ...data.data }));
      setIsEditing(false);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.message || 'Unable to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      await Promise.all([getUserDetails(), getMyPosts()]);
      setIsLoading(false);
    };

    loadProfile();
  }, [getMyPosts, getUserDetails]);

  if (isLoading) return <div className="min-h-screen bg-[#08090b]"><NavBar /><div className="mx-auto max-w-4xl animate-pulse px-4 py-10"><div className="h-28 w-28 rounded-full bg-white/10" /><div className="mt-8 h-5 w-48 rounded bg-white/10" /><div className="mt-4 h-4 w-72 rounded bg-white/10" /></div><BottomNav /></div>;

  if (!userDetails) return <div className="min-h-screen bg-[#08090b] text-center"><NavBar /><p className="px-4 py-20 text-gray-400">This profile could not be found.</p><BottomNav /></div>;

  return (
    <main className="min-h-screen bg-[#08090b] pb-24 md:pb-10">
      <NavBar />
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        <header className="border-b border-white/10 py-8 sm:py-12">
          <div className="flex items-start gap-5 sm:gap-12">
            <img src={getAvatarForUser(userDetails, DEFAULT_AVATAR)} alt={userDetails.username} className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-pink-400/70 ring-offset-4 ring-offset-[#08090b] sm:h-36 sm:w-36" onError={(event) => { event.currentTarget.src = DEFAULT_AVATAR; }} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="truncate text-xl font-semibold sm:text-2xl">{userDetails.username}</h1>
                {userDetails.isThisYou ? <button type="button" onClick={() => setIsEditing(true)} className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold transition hover:bg-white/10">Edit profile</button> : <button type="button" onClick={toggleFollow} className={`rounded-lg px-5 py-2 text-xs font-semibold transition ${isYouFollowed ? 'border border-white/15 bg-transparent text-white hover:bg-white/10' : 'bg-pink-400 text-black hover:bg-pink-300'}`}>{isYouFollowed ? 'Following' : 'Follow'}</button>}
                <button type="button" className="icon-button h-9 w-9 text-lg text-gray-400" aria-label="Profile settings"><BsThreeDots /></button>
              </div>
              <div className="mt-6 hidden gap-8 text-sm sm:flex"><span><b>{posts.length}</b> posts</span><span><b>{userDetails.followers}</b> followers</span><span><b>{userDetails.following || 0}</b> following</span></div>
              <div className="mt-5 hidden sm:block"><p className="font-semibold">{userDetails.name}</p><p className="mt-1 max-w-md whitespace-pre-wrap text-sm text-gray-300">{userDetails.bio || 'No bio yet.'}</p></div>
            </div>
          </div>
          <div className="mt-6 sm:hidden"><p className="font-semibold">{userDetails.name}</p><p className="mt-1 whitespace-pre-wrap text-sm text-gray-300">{userDetails.bio || 'No bio yet.'}</p><div className="mt-5 grid grid-cols-3 border-y border-white/10 py-3 text-center text-xs text-gray-400"><span><b className="block text-base text-white">{posts.length}</b>posts</span><span><b className="block text-base text-white">{userDetails.followers}</b>followers</span><span><b className="block text-base text-white">{userDetails.following || 0}</b>following</span></div></div>
        </header>

        <div className="flex items-center justify-center border-b border-white/10"><button type="button" className="flex items-center gap-2 border-t-2 border-white px-8 py-4 text-xs font-semibold uppercase tracking-widest"><FiGrid /> Posts</button><button type="button" className="flex items-center gap-2 px-8 py-4 text-xs uppercase tracking-widest text-gray-500"><FaRegBookmark /> Saved</button></div>

        {posts.length ? <div className="grid grid-cols-3 gap-1 sm:gap-3">{posts.map((post, index) => { const postImage = post.image ? `${api_base_url}/uploads/${post.image}` : DEFAULT_POST_IMAGE; return <button type="button" key={post._id || index} className="group relative aspect-square overflow-hidden bg-white/5" onClick={() => navigate('/')}><img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={postImage} alt={post.caption || 'User post'} onError={(event) => { event.currentTarget.src = DEFAULT_POST_IMAGE; }} /><span className="absolute inset-0 flex items-center justify-center gap-4 bg-black/60 text-sm opacity-0 transition group-hover:opacity-100"><span className="flex items-center gap-1"><FaRegHeart /> {post.likes?.length || 0}</span><span className="flex items-center gap-1"><FaRegComment /> {post.comments?.length || 0}</span></span></button>; })}</div> : <div className="py-20 text-center"><FiGrid className="mx-auto text-3xl text-gray-600" /><h2 className="mt-4 text-lg font-semibold">No posts yet</h2><p className="mt-2 text-sm text-gray-500">When {userDetails.username} shares photos, they will appear here.</p></div>}
      </div>
      <BottomNav />

      {isEditing && <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"><form onSubmit={saveProfile} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#15161b] p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Edit profile</h2><button type="button" onClick={() => setIsEditing(false)} className="icon-button h-9 w-9 text-xl text-gray-400" aria-label="Close edit profile">&times;</button></div><div className="mt-6 space-y-4"><label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Name<input value={editForm.name} onChange={(event) => setEditForm({ ...editForm, name: event.target.value })} className="inputBox mt-2 w-full px-3 py-2 text-sm" /></label><label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Bio<textarea value={editForm.bio} onChange={(event) => setEditForm({ ...editForm, bio: event.target.value })} maxLength="150" className="inputBox mt-2 min-h-24 w-full px-3 py-2 text-sm" /></label><label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Avatar URL<input value={editForm.avatar} onChange={(event) => setEditForm({ ...editForm, avatar: event.target.value })} className="inputBox mt-2 w-full px-3 py-2 text-sm" /></label></div><button type="submit" disabled={isSaving} className="btnNormal mt-6 w-full disabled:opacity-50">{isSaving ? 'Saving...' : 'Save changes'}</button></form></div>}
    </main>
  );
}

export default Profile