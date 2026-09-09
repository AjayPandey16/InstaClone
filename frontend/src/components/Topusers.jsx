import React from 'react'

const TopUsers = () => {
    const users = [
        { name: 'Your Story', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
        { name: 'Anya', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
        { name: 'Mia', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
        { name: 'Leo', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
        { name: 'Ava', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80' },
        { name: 'Noah', image: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=300&q=80' },
        { name: 'Zoe', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80' },
        { name: 'Eli', image: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=300&q=80' },
    ];

    return (
        <>
            <div className="topUsers flex w-full items-start gap-3.75 overflow-x-auto overflow-y-hidden p-2.5 pb-1">
                {users.map((user) => (
                    <div key={user.name} className="user flex min-w-[64px] shrink-0 flex-col items-center justify-center">
                        <img
                            className='h-[50px] w-[50px] rounded-full object-cover ring-2 ring-pink-500'
                            src={user.image}
                            alt={user.name}
                            onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80';
                            }}
                        />
                        <p className='mt-1 text-[11px] text-gray-300'>{user.name}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default TopUsers