import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth-context';
import {
  Search,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Languages,
  Star,
  Archive,
  AlertCircle,
  Loader2,
} from 'lucide-react';

type Conversation = {
  id: string;
  contact: string;
  company: string;
  channel: 'whatsapp' | 'email' | 'wechat' | 'instagram' | 'facebook' | 'webchat' | 'sms';
  lastMessage: string;
  lastMessageTime: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  unread: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
};

type Message = {
  id: string;
  content: string;
  translation?: string;
  sender: 'customer' | 'agent';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
};

const channelIcons: Record<Conversation['channel'], string> = {
  whatsapp: 'WA',
  email: '@',
  wechat: 'WC',
  instagram: 'IG',
  facebook: 'FB',
  webchat: 'WC',
  sms: 'SM',
};

const channelColors: Record<Conversation['channel'], string> = {
  whatsapp: 'bg-green-100 text-green-700',
  email: 'bg-blue-100 text-blue-700',
  wechat: 'bg-emerald-100 text-emerald-700',
  instagram: 'bg-pink-100 text-pink-700',
  facebook: 'bg-indigo-100 text-indigo-700',
  webchat: 'bg-cyan-100 text-cyan-700',
  sms: 'bg-gray-100 text-gray-700',
};

export function InboxPage() {
  const { tenant } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showTranslation, setShowTranslation] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (tenant) {
          const { data, error } = await supabase
            .from('conversations')
            .select('*, contact:contacts(first_name,last_name,account:accounts(name))')
            .eq('tenant_id', tenant.id)
            .order('last_message_at', { ascending: false });
          if (!error && data && data.length > 0) {
            const mapped: Conversation[] = data.map((row: Record<string, unknown>) => {
              const contact = row.contact as { first_name?: string; last_name?: string; account?: { name?: string } | null } | null;
              return {
                id: row.id as string,
                contact: contact ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || 'Unknown' : 'Unknown',
                company: contact?.account?.name || '—',
                channel: (row.channel_type as Conversation['channel']) || 'email',
                lastMessage: (row.subject as string) || '—',
                lastMessageTime: row.last_message_at ? new Date(row.last_message_at as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                status: row.status as Conversation['status'],
                unread: false,
                priority: (row.priority as Conversation['priority']) || 'normal',
              };
            });
            setConversations(mapped);
            if (mapped.length > 0) setSelectedConversation(mapped[0]);
          }
        }
      } catch (err) {
        console.error('InboxPage fetch error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [tenant]);

  useEffect(() => {
    if (!selectedConversation) return;
    (async () => {
      setLoadingMessages(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', selectedConversation.id)
        .order('created_at', { ascending: true });
      if (!error && data) {
        setMessages(
          data.map((row: Record<string, unknown>) => ({
            id: row.id as string,
            content: (row.content as string) || '',
            translation: (row.content_translated as string) || undefined,
            sender: (row.sender_type as 'customer' | 'agent') || 'customer',
            timestamp: row.created_at ? new Date(row.created_at as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            status: (row.status as Message['status']) || 'sent',
          })),
        );
      }
      setLoadingMessages(false);
    })();
  }, [selectedConversation]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversation || !tenant) return;
    const content = newMessage.trim();
    setNewMessage('');
    const { data } = await supabase
      .from('messages')
      .insert({
        conversation_id: selectedConversation.id,
        direction: 'outbound',
        sender_type: 'agent',
        content,
        content_type: 'text',
        status: 'sent',
      })
      .select('*')
      .single();
    if (data) {
      setMessages(prev => [...prev, {
        id: data.id as string,
        content: (data.content as string) || content,
        translation: (data.content_translated as string) || undefined,
        sender: 'agent',
        timestamp: new Date(data.created_at as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
      }]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-xisync-cyan-500" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500"
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button className="flex-1 px-3 py-1.5 text-sm font-medium text-xisync-cyan-700 bg-xisync-cyan-50 rounded-lg">
              All ({conversations.length})
            </button>
            <button className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
              Open ({conversations.filter(c => c.status === 'open').length})
            </button>
            <button className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
              Pending ({conversations.filter(c => c.status === 'pending').length})
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">No conversations</div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedConversation?.id === conv.id ? 'bg-xisync-cyan-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-xisync-blue-400 to-xisync-cyan-400 flex items-center justify-center text-white text-sm font-semibold">
                      {conv.contact.charAt(0)}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${channelColors[conv.channel]}`}>
                      {channelIcons[conv.channel]}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium text-gray-900 ${conv.unread ? 'font-semibold' : ''}`}>
                        {conv.contact}
                      </span>
                      <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-1">{conv.company}</div>
                    <p className={`text-sm truncate ${conv.unread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread && (
                    <div className="w-2 h-2 rounded-full bg-xisync-cyan-500 mt-2" />
                  )}
                </div>
                {conv.priority === 'urgent' || conv.priority === 'high' ? (
                  <div className="mt-2 flex items-center gap-1">
                    <AlertCircle className={`w-3 h-3 ${conv.priority === 'urgent' ? 'text-red-500' : 'text-orange-500'}`} />
                    <span className={`text-xs font-medium ${conv.priority === 'urgent' ? 'text-red-600' : 'text-orange-600'}`}>
                      {conv.priority === 'urgent' ? 'Urgent' : 'High priority'}
                    </span>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-xisync-blue-400 to-xisync-cyan-400 flex items-center justify-center text-white text-sm font-semibold">
                  {selectedConversation.contact.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{selectedConversation.contact}</div>
                  <div className="text-sm text-gray-500">{selectedConversation.company}</div>
                </div>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${channelColors[selectedConversation.channel]}`}>
                  {selectedConversation.channel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Star className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Archive className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {loadingMessages ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-xisync-cyan-500" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-gray-400 text-sm">No messages yet</div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md rounded-2xl px-4 py-3 ${
                        message.sender === 'agent'
                          ? 'bg-gradient-to-br from-xisync-blue-600 to-xisync-cyan-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.translation && showTranslation && (
                        <div className={`mt-2 pt-2 border-t ${message.sender === 'agent' ? 'border-white/20' : 'border-gray-200'}`}>
                          <div className="flex items-center gap-1 mb-1">
                            <Languages className="w-3 h-3 opacity-60" />
                            <span className="text-xs opacity-60">Translation</span>
                          </div>
                          <p className="text-sm opacity-90">{message.translation}</p>
                        </div>
                      )}
                      <div className={`flex items-center justify-end gap-1 mt-1 ${message.sender === 'agent' ? 'text-white/60' : 'text-gray-400'}`}>
                        <span className="text-xs">{message.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                    showTranslation ? 'bg-xisync-cyan-100 text-xisync-cyan-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Languages className="w-3 h-3" />
                  Auto-translate
                </button>
                <span className="text-xs text-gray-500">Replying in Chinese (CN)</span>
              </div>
              <div className="flex items-end gap-3">
                <div className="flex-1 bg-gray-100 rounded-xl px-4 py-3">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Type your message..."
                    className="w-full bg-transparent text-sm resize-none outline-none"
                    rows={2}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded">
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded">
                        <Smile className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-400">Press Enter to send</span>
                  </div>
                </div>
                <Button icon={<Send className="w-4 h-4" />} onClick={handleSend}>Send</Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>

      <div className="w-72 border-l border-gray-200 p-4 bg-gray-50">
        {selectedConversation && (
          <>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Info</h3>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-xisync-blue-400 to-xisync-cyan-400 flex items-center justify-center text-white text-xl font-semibold mx-auto mb-3">
                {selectedConversation.contact.charAt(0)}
              </div>
              <div className="font-semibold text-gray-900">{selectedConversation.contact}</div>
              <div className="text-sm text-gray-500">{selectedConversation.company}</div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase mb-1">Status</div>
                <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" defaultValue={selectedConversation.status}>
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase mb-1">Priority</div>
                <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" defaultValue={selectedConversation.priority}>
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors">
                  View in CRM
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors">
                  Create Task
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors">
                  Create Quote
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors">
                  View Shipments
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
