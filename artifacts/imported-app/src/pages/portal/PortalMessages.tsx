import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { xisyncDb } from '../../lib/xisync-db';
import { useAuth } from '../../lib/auth-context';
import {
  Send,
  Paperclip,
  Languages,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react';

type Message = {
  id: string;
  content: string;
  translation?: string;
  sender: 'customer' | 'supplier';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
};

export function PortalMessages() {
  const { profile, tenant } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showTranslation, setShowTranslation] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenant || !profile) return;
    (async () => {
      setLoading(true);
      const { data: conversations } = await xisyncDb
        .from('conversations')
        .select('id')
        .eq('tenant_id', tenant.id)
        .eq('contact_id', profile.id)
        .order('last_message_at', { ascending: false })
        .limit(1);

      if (!conversations || conversations.length === 0) {
        setLoading(false);
        return;
      }

      const conversationId = (conversations[0] as { id: string }).id;
      const { data: msgs } = await xisyncDb
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (msgs) {
        setMessages(
          msgs.map((row: Record<string, unknown>) => ({
            id: row.id as string,
            content: (row.content as string) || '',
            translation: (row.content_translated as string) || undefined,
            sender: ((row.sender_type as string) === 'agent' ? 'supplier' : 'customer') as 'customer' | 'supplier',
            timestamp: row.created_at ? new Date(row.created_at as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            status: (row.status as Message['status']) || 'sent',
          })),
        );
      }
      setLoading(false);
    })();
  }, [tenant, profile]);

  const handleSend = async () => {
    if (!newMessage.trim() || !tenant || !profile) return;
    const content = newMessage.trim();
    setNewMessage('');

    let conversationId: string | null = null;
    const { data: existing } = await xisyncDb
      .from('conversations')
      .select('id')
      .eq('tenant_id', tenant.id)
      .eq('contact_id', profile.id)
      .limit(1);

    if (existing && existing.length > 0) {
      conversationId = (existing[0] as { id: string }).id;
    } else {
      const { data: newConv } = await xisyncDb
        .from('conversations')
        .insert({
          tenant_id: tenant.id,
          contact_id: profile.id,
          channel_type: 'webchat',
          status: 'open',
        })
        .select('id')
        .single();
      if (newConv) conversationId = (newConv as { id: string }).id;
    }

    if (!conversationId) return;

    const { data } = await xisyncDb
      .from('messages')
      .insert({
        conversation_id: conversationId,
        direction: 'inbound',
        sender_type: 'customer',
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
        sender: 'customer',
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
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-xisync-blue-500 to-xisync-cyan-500 flex items-center justify-center text-white font-semibold">
              XS
            </div>
            <div>
              <div className="font-semibold text-gray-900">XiSync Supplier</div>
              <div className="text-sm text-gray-500">{tenant?.name || '—'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${
                showTranslation ? 'bg-xisync-cyan-100 text-xisync-cyan-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Languages className="w-4 h-4" />
              Auto-translate
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No messages yet. Start a conversation below.
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md rounded-2xl px-4 py-3 ${
                  message.sender === 'customer'
                    ? 'bg-xisync-cyan-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.translation && showTranslation && (
                  <div className={`mt-2 pt-2 border-t ${
                    message.sender === 'customer' ? 'border-white/20' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center gap-1 mb-1">
                      <Languages className="w-3 h-3 opacity-60" />
                      <span className="text-xs opacity-60">Translation</span>
                    </div>
                    <p className="text-sm opacity-90">{message.translation}</p>
                  </div>
                )}
                <div className={`flex items-center justify-end gap-1 mt-2 ${
                  message.sender === 'customer' ? 'text-white/60' : 'text-gray-400'
                }`}>
                  <span className="text-xs">{message.timestamp}</span>
                  {message.sender === 'customer' && (
                    message.status === 'read' ? (
                      <CheckCircle2 className="w-3 h-3 text-white/80" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-3">
          <div className="flex-1 bg-gray-100 rounded-xl px-4 py-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Type your message... (will be translated automatically)"
              className="w-full bg-transparent text-sm resize-none outline-none min-h-[60px]"
              rows={2}
            />
            <div className="flex items-center justify-between mt-2">
              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded">
                <Paperclip className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-400">
                Messages are automatically translated
              </span>
            </div>
          </div>
          <Button icon={<Send className="w-4 h-4" />} onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  );
}
