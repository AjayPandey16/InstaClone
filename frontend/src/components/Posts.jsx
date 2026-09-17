import { useEffect, useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { FaHeart, FaRegBookmark, FaRegComment, FaRegHeart } from 'react-icons/fa6';
import { FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { apiJson } from '../api';
import { api_base_url, getAvatarForUser } from '../helper';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80';
const DEFAULT_POST_IMAGE = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80';

const Posts = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentOpen, setCommentOpen] = useState(null);
  const [commentText, setCommentText] = useState('');

  const getPosts = async () => {
    try { setData((await apiJson('/getPosts', {})).data || []); }
    catch (error) { toast.error(error.message); }
    finally { setLoading(false); }
  };

  const toggleLike = async (id) => {
    setData((previous) => previous.map((item) => item.post._id === id ? { ...item, post: { ...item.post, isYouLiked: !item.post.isYouLiked, likes: item.post.likes + (item.post.isYouLiked ? -1 : 1) } } : item));
    try { await apiJson('/toggleLike', { postId: id }); } catch (error) { toast.error(error.message); getPosts(); }
  };

  const toggleSave = async (id) => {
    setData((previous) => previous.map((item) => item.post._id === id ? { ...item, post: { ...item.post, isYouSaved: !item.post.isYouSaved } } : item));
    try { await apiJson('/toggleSave', { postId: id }); } catch (error) { toast.error(error.message); getPosts(); }
  };

  const addComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      await apiJson('/addComment', { postId, text: commentText });
      setData((previous) => previous.map((item) => item.post._id === postId ? { ...item, post: { ...item.post, comments: item.post.comments + 1 } } : item));
      setCommentText('');
      setCommentOpen(null);
    } catch (error) { toast.error(error.message); }
  };

  useEffect(() => { getPosts(); }, []);

  if (loading) return <div className="py-12 text-center text-sm text-gray-400">Loading your feed...</div>;
  if (data.length === 0) return <div className="mx-auto max-w-2xl px-4 py-12 text-center text-sm text-gray-400">Follow people or share your first post to fill your feed.</div>;

  return <div className="Posts mt-5 w-full pb-15">
    {data.map((item) => {
      const postImage = item.post.image ? `${api_base_url}/uploads/${item.post.image}` : DEFAULT_POST_IMAGE;
      const avatar = getAvatarForUser(item.user, DEFAULT_AVATAR);
      return <article key={item.post._id} className="post mx-auto mb-5 max-w-2xl overflow-hidden rounded-2xl border border-[#27272a] bg-[#0d0d0d] pb-4">
        <div className="flex items-center justify-between px-4 py-3">
          <button type="button" className="flex items-center gap-2.5 text-left" onClick={() => navigate(`/profile/${item.user._id}`)}>
            <img className="h-10 w-10 rounded-full object-cover ring-1 ring-pink-500/70" src={avatar} alt={item.user.username} onError={(event) => { event.currentTarget.src = DEFAULT_AVATAR; }} />
            <span><b className="block text-sm">{item.user.username}</b><small className="text-gray-500">{new Date(item.post.date).toLocaleDateString()}</small></span>
          </button>
          <HiDotsVertical className="text-xl text-gray-500" />
        </div>
        <img className="aspect-square w-full object-cover" src={postImage} alt={item.post.caption || 'Post image'} onError={(event) => { event.currentTarget.src = DEFAULT_POST_IMAGE; }} />
        <div className="px-4">
          <div className="mt-3 flex items-center justify-between text-xl">
            <div className="flex items-center gap-4"><button type="button" aria-label="Like post" onClick={() => toggleLike(item.post._id)} className={item.post.isYouLiked ? 'text-pink-500' : ''}>{item.post.isYouLiked ? <FaHeart /> : <FaRegHeart />}</button><button type="button" aria-label="Comment on post" onClick={() => setCommentOpen(commentOpen === item.post._id ? null : item.post._id)}><FaRegComment /></button><button type="button" aria-label="Share post"><FiSend /></button></div>
            <button type="button" aria-label="Save post" onClick={() => toggleSave(item.post._id)} className={item.post.isYouSaved ? 'text-yellow-400' : ''}><FaRegBookmark /></button>
          </div>
          <p className="my-2 text-sm font-medium">{item.post.likes} likes <span className="ml-2 text-gray-500">{item.post.comments} comments</span></p>
          <p className="text-sm text-gray-300"><b className="text-white">{item.user.username}</b> {item.post.caption}</p>
          {commentOpen === item.post._id && <form className="mt-3 flex gap-2" onSubmit={(event) => { event.preventDefault(); addComment(item.post._id); }}><input value={commentText} onChange={(event) => setCommentText(event.target.value)} maxLength="300" placeholder="Add a comment..." className="min-w-0 flex-1 rounded-lg border border-[#27272a] bg-black px-3 py-2 text-sm outline-none" /><button type="submit" className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-black">Post</button></form>}
        </div>
      </article>;
    })}
  </div>;
};

export default Posts;
