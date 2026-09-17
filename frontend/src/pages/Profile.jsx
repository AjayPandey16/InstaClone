import React, { useCallback, useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import BottomNav from '../components/BottomNav';
import { api_base_url, getAvatarForUser } from '../helper';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80';
const DEFAULT_POST_IMAGE = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80';

const Profile = () => {
  const { id } = useParams();

  const [userDetails, setUserDetails] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isYouFollowed, setIsYouFollowed] = useState(false);

  const getUserDetails = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(api_base_url + "/getUserDetails", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          userId: id,
          token,
        })
      });

      const data = await res.json();
      if (data.success) {
        setUserDetails(data.data);
        setIsYouFollowed(data.data.isYouFollowed);
      } else {
        toast.error(data.msg);
      }
    } catch {
      toast.error('Unable to get user details');
    }
  }, [id]);

  const getMyPosts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(api_base_url + "/getMyPosts", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          userId: id,
          token,
        })
      });

      const data = await res.json();
      if (data.success) {
        setPosts(data.data || []);
      } else {
        toast.error(data.msg);
      }
    } catch {
      toast.error('Unable to load posts');
    }
  }, [id]);

  const toggleFollow = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(api_base_url + "/toggleFollow", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          userId: id,
          token,
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`${data.action} Successfully !`);
        setIsYouFollowed(data.action === "Follow" ? true : false);
      } else {
        toast.error(data.msg);
      }
    } catch {
      toast.error('Unable to update follow status');
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      await Promise.all([getUserDetails(), getMyPosts()]);
    };

    loadProfile();
  }, [getMyPosts, getUserDetails]);

  return (
    <>
      <NavBar />
      <div className="flex w-full items-center gap-3.75 px-2.5 sm:px-4">
        <img
          src={getAvatarForUser(userDetails, DEFAULT_AVATAR)}
          alt={userDetails ? userDetails.username : 'Profile'}
          className='h-16 w-16 shrink-0 rounded-full object-cover border border-[#27272a]'
          onError={(e) => {
            e.currentTarget.src = DEFAULT_AVATAR;
          }}
        />
        <div className='min-w-0 flex-1'>
          <h3 className='break-all'>{userDetails ? userDetails.username : ""}</h3>
          <p className='text-[14px] text-[gray]'>Joined on {userDetails ? new Date(userDetails.date).toDateString() : ""}</p>
          <p className='text-[14px] text-[gray]'><b>{userDetails ? userDetails.followers : ""}</b> Followers | <b>{userDetails ? userDetails.posts : ""}</b> Posts</p>
          {
            userDetails && userDetails.isThisYou === false ? (
              <button className={`btnNormal mt-3 w-full p-2 text-[14px] ${isYouFollowed ? "bg-red-500" : ""}`} onClick={toggleFollow}>
                {isYouFollowed ? "Un Follow" : "Follow"}
              </button>
            ) : ""
          }
        </div>
      </div>
      <div className="posts mt-6">
        {
          posts.length > 0 ? posts.map((post, index) => {
            const postImage = post.image ? `${api_base_url}/uploads/${post.image}` : DEFAULT_POST_IMAGE;
            return (
              <div key={post._id || index} className="post h-25 w-full sm:h-35 md:h-45">
                <img
                  className='h-full w-full object-cover'
                  src={postImage}
                  alt='User post'
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_POST_IMAGE;
                  }}
                />
              </div>
            )
          }) : "No Posts Found !"
        }
      </div>

      <BottomNav />
    </>
  )
}

export default Profile