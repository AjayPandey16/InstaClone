import React, { useEffect, useState } from 'react';
import { HiDotsVertical } from "react-icons/hi";
import { FaHeart, FaRegBookmark, FaRegComment, FaRegHeart } from "react-icons/fa6";
import { FiSend } from "react-icons/fi";
import { api_base_url } from '../helper';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80';
const DEFAULT_POST_IMAGE = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80';

const Posts = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(api_base_url + "/getPosts", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
        })
      });

      const response = await res.json();
      if (response.success) {
        setData(response.data || []);
      } else {
        toast.error(response.msg || 'Unable to load posts');
      }
    } catch (error) {
      toast.error('Unable to load posts');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (id) => {
    const previousData = data;
    setData((prev) =>
      prev.map((item) =>
        item.post._id === id
          ? {
              ...item,
              post: {
                ...item.post,
                isYouLiked: !item.post.isYouLiked,
                likes: item.post.isYouLiked ? Math.max(0, item.post.likes - 1) : item.post.likes + 1,
              },
            }
          : item
      )
    );

    try {
      const res = await fetch(api_base_url + "/toggleLike", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          postId: id
        })
      });

      const response = await res.json();
      if (!response.success) {
        setData(previousData);
        toast.error(response.msg || 'Like update failed');
      }
    } catch (error) {
      setData(previousData);
      toast.error('Like update failed');
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <div className="Posts mt-5 w-full pb-15">
        {loading ? (
          <div className="text-center text-sm text-gray-400">Loading posts...</div>
        ) : data.length === 0 ? (
          <div className="text-center text-sm text-gray-400">No posts yet.</div>
        ) : (
          data.map((item, index) => {
            const postImage = item.post.image ? `${api_base_url}/uploads/${item.post.image}` : DEFAULT_POST_IMAGE;
            const avatar = DEFAULT_AVATAR;

            return (
              <div key={item.post._id || index} className="post mx-auto mb-2 max-w-4xl border-b border-[#27272a] pb-4">
                <div className="flex items-center justify-between px-2.5 sm:px-4">
                  <div className="flex items-center gap-2.5">
                    <img
                      onClick={() => navigate(`/profile/${item.user._id}`)}
                      className='h-10 w-10 cursor-pointer rounded-full object-cover'
                      src={avatar}
                      alt={item.user.username}
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR;
                      }}
                    />
                    <div>
                      <p>{item.user.username}</p>
                      <p className='-mt-1 text-[13px] text-[gray]'>Join In {new Date(item.user.date).toDateString()}</p>
                    </div>
                  </div>

                  <i className='cursor-pointer text-[20px]'><HiDotsVertical /></i>
                </div>

                <img
                  className='mt-4 h-auto w-full max-h-[70vh] object-cover'
                  src={postImage}
                  alt={item.post.caption || 'Post image'}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_POST_IMAGE;
                  }}
                />

                <div className='px-2.5 sm:px-4'>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3.75">
                      <i onClick={() => toggleLike(item.post._id)} className={`cursor-pointer text-[20px] ${item.post.isYouLiked === true ? "text-pink-600" : ""}`}>
                        {item.post.isYouLiked === true ? <FaHeart /> : <FaRegHeart />}
                      </i>
                      <i className='cursor-pointer text-[20px]'><FaRegComment /></i>
                      <i className='cursor-pointer text-[20px]'><FiSend /></i>
                    </div>
                    <i className='cursor-pointer text-[20px]'><FaRegBookmark /></i>
                  </div>
                  <p className='my-2 text-[14px] text-[gray]'>{item.post.likes} Likes</p>

                  <p className='text-[14px] text-[gray]'><b className='text-white'>{item.user.username} </b> {item.post.caption}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  )
}

export default Posts
