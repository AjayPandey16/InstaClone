import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import BottomNav from '../components/BottomNav';
import { api_base_url } from '../helper';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80';
const DEFAULT_POST_IMAGE = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80';

const Profile = () => {
  let { id } = useParams();

  const [userDetails, setUserDetails] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isYouFollowed, setIsYouFollowed] = useState(false);

  const getUserDetails = async () => {
    try {
      const res = await fetch(api_base_url + "/getUserDetails", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: id,
          token: localStorage.getItem("token")
        })
      });

      const data = await res.json();
      if (data.success) {
        setUserDetails(data.data);
        setIsYouFollowed(data.data.isYouFollowed);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      toast.error('Unable to get user details');
    }
  };

  const getMyPosts = async () => {
    try {
      const res = await fetch(api_base_url + "/getMyPosts", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: id,
          token: localStorage.getItem("token")
        })
      });

      const data = await res.json();
      if (data.success) {
        setPosts(data.data || []);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      toast.error('Unable to load posts');
    }
  };

  const toggleFollow = async () => {
    try {
      const res = await fetch(api_base_url + "/toggleFollow", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: id,
          token: localStorage.getItem("token")
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`${data.action} Successfully !`);
        setIsYouFollowed(data.action === "Follow" ? true : false);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      toast.error('Unable to update follow status');
    }
  };

  useEffect(() => {
    getUserDetails();
    getMyPosts();
  }, [id]);

  return (
    <>
      <NavBar />
      <div className="flex w-full items-center gap-3.75 px-2.5 sm:px-4">
        <img
          src={DEFAULT_AVATAR}
          alt={userDetails ? userDetails.username : 'Profile'}
          className='h-16 w-16 shrink-0 rounded-full object-cover border border-[#27272a]'
          onError={(e) => {
            e.currentTarget.src = DEFAULT_AVATAR;
          }}
        />
        <div className='min-w-0 flex-1'>
          <h3 className='break-all'>{userDetails ? userDetails.username : ""}</h3>
          <p className='text-[14px] text-[gray]'>Join In {userDetails ? new Date(userDetails.date).toDateString() : ""}</p>
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
              <div key={post._id || index} className="post h-[100px] w-full sm:h-[140px] md:h-[180px]">
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