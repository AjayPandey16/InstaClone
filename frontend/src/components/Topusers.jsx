import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiJson } from '../api';
import { api_base_url } from '../helper';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80';

const TopUsers = () => {
    const navigate = useNavigate();
    const [stories, setStories] = useState([]);
    const [activeStory, setActiveStory] = useState(null);

    useEffect(() => {
        apiJson('/getStories', {}).then((data) => setStories(data.data || []))
            .catch((error) => toast.error(error.message));
    }, []);

    return <>
        <div className="topUsers flex w-full items-start gap-3.75 overflow-x-auto overflow-y-hidden p-2.5 pb-1">
            {stories.length === 0 ? <button type="button" onClick={() => navigate('/create')} className="user flex min-w-16 shrink-0 flex-col items-center justify-center"><div className="flex h-12.5 w-12.5 items-center justify-center rounded-full border-2 border-dashed border-pink-500 text-xl text-pink-400">+</div><p className="mt-1 text-[11px] text-gray-300">Your story</p></button> : stories.map((story) => {
                const user = story.userId;
                const image = story.image ? `${api_base_url}/uploads/${story.image}` : DEFAULT_AVATAR;
                return <button type="button" key={story._id} onClick={() => setActiveStory({ ...story, user })} className="user flex min-w-16 shrink-0 flex-col items-center justify-center"><img className="h-12.5 w-12.5 rounded-full object-cover ring-2 ring-pink-500" src={user.avatar || image} alt={user.username} onError={(event) => { event.currentTarget.src = DEFAULT_AVATAR; }} /><p className="mt-1 max-w-16 truncate text-[11px] text-gray-300">{user.username}</p></button>;
            })}
        </div>
        {activeStory && <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4" role="dialog" aria-label={`${activeStory.user.username}'s story`}><button type="button" aria-label="Close story" onClick={() => setActiveStory(null)} className="absolute right-5 top-5 text-2xl text-white">&times;</button><div className="relative max-h-[85vh] max-w-lg overflow-hidden rounded-2xl"><img className="max-h-[85vh] w-full object-contain" src={`${api_base_url}/uploads/${activeStory.image}`} alt={activeStory.caption || 'Story'} /><p className="absolute bottom-0 w-full bg-black/60 p-4 text-sm">{activeStory.caption || `Story by ${activeStory.user.username}`}</p></div></div>}
    </>;
};

export default TopUsers;
