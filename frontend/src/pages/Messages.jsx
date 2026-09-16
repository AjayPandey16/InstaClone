import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import BottomNav from '../components/BottomNav';
import NavBar from '../components/NavBar';
import { apiJson } from '../api';

const Messages = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiJson('/getMessageUsers', {}).then((data) => setUsers(data.data || []))
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedUser) return undefined;
    apiJson('/getMessages', { userId: selectedUser._id })
      .then((data) => setMessages(data.data || []))
      .catch((error) => toast.error(error.message));
    return undefined;
  }, [selectedUser]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!text.trim() || !selectedUser) return;
    try {
      const data = await apiJson('/sendMessage', { userId: selectedUser._id, text });
      setMessages((current) => [...current, { ...data.data, sender: { _id: localStorage.getItem('userId') } }]);
      setText('');
    } catch (error) { toast.error(error.message); }
  };

  return <>
    <NavBar />
    <main className="mx-auto flex max-w-4xl flex-col px-3 pb-24 sm:h-[calc(100vh-100px)] sm:flex-row sm:gap-4">
      <section className={`${selectedUser ? 'hidden sm:block' : 'block'} w-full overflow-y-auto rounded-2xl border border-[#27272a] bg-[#121212] sm:w-80`}>
        <div className="border-b border-[#27272a] p-4"><h1 className="text-xl font-semibold">Messages</h1><p className="text-xs text-gray-500">Start a conversation</p></div>
        {loading ? <p className="p-4 text-sm text-gray-400">Loading people...</p> : users.length === 0 ? <p className="p-4 text-sm text-gray-400">No other users yet.</p> : users.map((user) => <button type="button" key={user._id} onClick={() => setSelectedUser(user)} className={`flex w-full items-center gap-3 border-b border-[#27272a] p-3 text-left hover:bg-white/5 ${selectedUser?._id === user._id ? 'bg-white/10' : ''}`}><div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/20 text-sm font-semibold text-pink-300">{user.username?.[0]?.toUpperCase()}</div><span><b className="block text-sm">{user.username}</b><small className="text-gray-500">{user.name}</small></span></button>)}
      </section>
      <section className={`${selectedUser ? 'block' : 'hidden sm:block'} flex min-h-105 flex-1 flex-col rounded-2xl border border-[#27272a] bg-[#0d0d0d]`}>
        {!selectedUser ? <div className="m-auto text-center text-gray-500"><p className="text-lg text-gray-300">Your messages</p><p className="text-sm">Choose someone to start chatting.</p></div> : <>
          <header className="flex items-center gap-3 border-b border-[#27272a] p-4"><button type="button" className="sm:hidden" onClick={() => setSelectedUser(null)} aria-label="Back to conversations"><FaArrowLeft /></button><div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500/20 text-pink-300">{selectedUser.username?.[0]?.toUpperCase()}</div><b>{selectedUser.username}</b></header>
          <div className="flex-1 space-y-2 overflow-y-auto p-4">{messages.length === 0 ? <p className="text-center text-sm text-gray-500">No messages yet. Say hello.</p> : messages.map((message) => <div key={message._id} className={`flex ${message.sender?._id === localStorage.getItem('userId') ? 'justify-end' : 'justify-start'}`}><p className="max-w-[75%] rounded-2xl bg-white/10 px-3 py-2 text-sm">{message.text}</p></div>)}</div>
          <form onSubmit={sendMessage} className="flex gap-2 border-t border-[#27272a] p-3"><input value={text} onChange={(event) => setText(event.target.value)} maxLength="1000" placeholder="Message..." className="min-w-0 flex-1 rounded-xl border border-[#27272a] bg-black px-3 py-2 text-sm outline-none" /><button type="submit" className="rounded-xl bg-pink-500 px-4 text-white" aria-label="Send message"><FaPaperPlane /></button></form>
        </>}
      </section>
    </main>
    <BottomNav />
  </>;
};

export default Messages;
