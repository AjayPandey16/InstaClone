import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiJson } from '../api';
import { api_base_url, getAvatarForUser } from '../helper';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80';

const TopUsers = () => {
    const navigate = useNavigate();
    const [stories, setStories] = useState([]);
    const [activeStory, setActiveStory] = useState(null);

    useEffect(() => {
        apiJson('/getStories', {}).then((data) => setStories(data.data || []))
            .catch((error) => toast.error(error.message));
    }, []);

    const storyImage = (story) => story.image ? `${api_base_url}/uploads/${story.image}` : DEFAULT_AVATAR;

    return <>
        <div className="topUsers flex w-full items-start gap-3.75 overflow-x-auto overflow-y-hidden p-2.5 pb-2">
            {stories.length === 0 ? <button type="button" onClick={() => navigate('/create')} className="user flex min-w-16 shrink-0 flex-col items-center justify-center"><div className="flex h-12.5 w-12.5 items-center justify-center rounded-full border-2 border-dashed border-pink-500 text-xl text-pink-400">+</div><p className="mt-1 text-[11px] text-gray-300">Your story</p></button> : stories.map((story) => {
                const user = story.userId;
                const avatar = getAvatarForUser(user, DEFAULT_AVATAR);
                return <button type="button" key={story._id} onClick={() => setActiveStory({ ...story, user })} className="user flex min-w-16 shrink-0 flex-col items-center justify-center gap-1"><div className="rounded-full bg-gradient-to-tr from-pink-500 via-orange-400 to-yellow-300 p-[2px]"><img className="h-12.5 w-12.5 rounded-full object-cover bg-black" src={avatar} alt={user.username} onError={(event) => { event.currentTarget.src = DEFAULT_AVATAR; }} /></div><p className="max-w-16 truncate text-[11px] text-gray-300">{user.username}</p></button>;
            })}
        </div>
        {activeStory && <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4" role="dialog" aria-label={`${activeStory.user.username}'s story`}><button type="button" aria-label="Close story" onClick={() => setActiveStory(null)} className="absolute right-5 top-5 text-2xl text-white">&times;</button><div className="relative max-h-[85vh] max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-black"><img className="max-h-[85vh] w-full object-contain" src={storyImage(activeStory)} alt={activeStory.caption || 'Story'} /><div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-4"><div className="flex items-center gap-2"><img className="h-9 w-9 rounded-full object-cover" src={getAvatarForUser(activeStory.user, DEFAULT_AVATAR)} alt={activeStory.user.username} /><span className="text-sm font-medium">{activeStory.user.username}</span></div><span className="text-xs text-gray-300">{new Date(activeStory.date).toLocaleDateString()}</span></div><p className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 to-transparent p-4 text-sm text-gray-100">{activeStory.caption || `Story by ${activeStory.user.username}`}</p></div></div>}
    </>;
};

export default TopUsers;
