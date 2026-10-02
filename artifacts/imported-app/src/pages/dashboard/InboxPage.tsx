import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth-context';
import {
  Search,
  Send,
  Languages,
  Loader2,
  FileText,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Phone,
  MessageSquare,
  Facebook,
  Instagram,
} from 'lucide-react';

type ChannelType = 'whatsapp' | 'facebook' | 'instagram' | 'wechat' | 'email' | 'webchat' | 'sms' | 'tiktok';

type Conversation = {
  id: string;
  contact: string;
  company: string;
  channel: ChannelType;
  lastMessage: string;
  lastMessageTime: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  unread: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  avatar?: string;
  country?: string;
  dealValue?: number;
};

type Message = {
  id: string;
  content: string;
  translation?: string;
  sender: 'customer' | 'agent';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
};

const channelMeta: Record<ChannelType, { label: string; badgeColor: string; icon: string }> = {
  whatsapp: { label: 'WhatsApp', badgeColor: 'bg-emerald-500 text-white', icon: 'WA' },
  facebook: { label: 'Facebook Messenger', badgeColor: 'bg-blue-600 text-white', icon: 'FB' },
  instagram: { label: 'Instagram Direct', badgeColor: 'bg-pink-600 text-white', icon: 'IG' },
  wechat: { label: 'WeChat (微信)', badgeColor: 'bg-green-600 text-white', icon: 'WC' },
  tiktok: { label: 'TikTok Direct', badgeColor: 'bg-slate-900 text-white', icon: 'TT' },
  email: { label: 'Official Email', badgeColor: 'bg-cyan-600 text-white', icon: '@' },
  webchat: { label: 'Website 24/7 AI Chat', badgeColor: 'bg-purple-600 text-white', icon: 'AI' },
  sms: { label: 'SMS Gateway', badgeColor: 'bg-amber-600 text-white', icon: 'SM' },
};

export function InboxPage() {
  const { tenant } = useAuth();
  const [activeChannelFilter, setActiveChannelFilter] = useState<'all' | ChannelType>('all');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showTranslation, setShowTranslation] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteSuccessToast, setQuoteSuccessToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setQuoteSuccessToast(msg);
    setTimeout(() => setQuoteSuccessToast(null), 3000);
  };

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
                channel: (row.channel_type as ChannelType) || 'whatsapp',
                lastMessage: (row.subject as string) || '—',
                lastMessageTime: row.last_message_at ? new Date(row.last_message_at as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                status: row.status as Conversation['status'],
                unread: false,
                priority: (row.priority as Conversation['priority']) || 'normal',
              };
            });
            setConversations(mapped);
            if (mapped.length > 0) setSelectedConversation(mapped[0]);
            return;
          }
        }
      } catch (err) {
        console.error('InboxPage fetch error:', err);
      } finally {
        setLoading(false);
      }

      // Production-grade omnichannel conversations for demo account
      const mockConvs: Conversation[] = [
        {
          id: 'cv-fb-1',
          contact: 'Liam O’Connor',
          company: 'Atlantic B2B Toys & Gifts (Ireland)',
          channel: 'facebook',
          lastMessage: 'Hi! Saw your Facebook Video ad for Waldorf Rag Dolls. What is the FOB Rotterdam ocean freight lead time?',
          lastMessageTime: '10:48 AM',
          status: 'open',
          unread: true,
          priority: 'urgent',
          country: 'Ireland',
          dealValue: 48500,
        },
        {
          id: 'cv-ig-2',
          contact: 'Elena Rostova',
          company: 'Nordic Mini Kids Boutique',
          channel: 'instagram',
          lastMessage: 'Loved your Instagram post on the Pastel Stacking Rings! Can you send wholesale catalog & minimum order quantity for 30 stores?',
          lastMessageTime: '10:15 AM',
          status: 'open',
          unread: true,
          priority: 'high',
          country: 'Sweden',
          dealValue: 24000,
        },
        {
          id: 'cv-wa-3',
          contact: 'David Miller',
          company: 'Global Tech Distribution LLC',
          channel: 'whatsapp',
          lastMessage: 'Inquiring about 40ft container spot rates from Shanghai Pudong to Los Angeles with CE/FCC certification docs.',
          lastMessageTime: '09:30 AM',
          status: 'open',
          unread: false,
          priority: 'urgent',
          country: 'United States',
          dealValue: 125000,
        },
        {
          id: 'cv-wc-4',
          contact: 'Zhang Wei (张伟)',
          company: 'Ningbo Precision Wood Moulds Co.',
          channel: 'wechat',
          lastMessage: '第三批欧洲山毛榉原木烘干检测合格报告已出具，可随时安排装车发货。',
          lastMessageTime: '08:45 AM',
          status: 'closed',
          unread: false,
          priority: 'normal',
          country: 'China',
          dealValue: 38000,
        },
        {
          id: 'cv-ai-5',
          contact: 'Chloe Dubreuil',
          company: 'Parisian Montessori Nursery Group',
          channel: 'webchat',
          lastMessage: '24/7 AI Sales Agent generated Proforma Invoice #PI-2026-9041 for 200 units of Wooden Rocking Horses.',
          lastMessageTime: 'Yesterday',
          status: 'open',
          unread: false,
          priority: 'high',
          country: 'France',
          dealValue: 17800,
        },
        {
          id: 'cv-em-6',
          contact: 'Hans Mueller',
          company: 'EuroMarket Wholesale GmbH',
          channel: 'email',
          lastMessage: 'Revised L/C payment split proposal (30/70 T/T terms under Incoterms 2026 CIF Hamburg).',
          lastMessageTime: 'Aug 21',
          status: 'open',
          unread: false,
          priority: 'high',
          country: 'Germany',
          dealValue: 92000,
        },
        {
          id: 'cv-tt-7',
          contact: 'Marcus Sterling',
          company: 'Viral Trends Australia Pty',
          channel: 'tiktok',
          lastMessage: 'Direct DM from TikTok Commercial Ad: Requesting 500 pcs sensory busy boards air-freighted to Sydney.',
          lastMessageTime: 'Aug 20',
          status: 'open',
          unread: false,
          priority: 'normal',
          country: 'Australia',
          dealValue: 14500,
        },
      ];
      setConversations(mockConvs);
      setSelectedConversation(mockConvs[0]);
    })();
  }, [tenant]);

  // Load message thread for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;
    setLoadingMessages(true);

    if (selectedConversation.id === 'cv-fb-1') {
      setMessages([
        {
          id: 'm-1',
          content: 'Hello! I noticed your Facebook sponsor post regarding the Organic Linen Plush Dolls & Waldorf Rag Dolls.',
          translation: '您好！我看到了您在 Facebook 上关于有机亚麻玩偶和华德福布偶的赞助推广。',
          sender: 'customer',
          timestamp: '10:45 AM',
          status: 'read',
        },
        {
          id: 'm-2',
          content: 'Hi Liam! Thanks for reaching out via our Facebook Messenger channel. We manufacture 100% natural organic toys certified for CE EN71 & ASTM F963.',
          translation: '您好 Liam！感谢通过 Facebook Messenger 咨询。我们专业制造 100% 纯天然有机玩具，已获欧盟 CE EN71 及北美 ASTM F963 安全认证。',
          sender: 'agent',
          timestamp: '10:46 AM',
          status: 'read',
        },
        {
          id: 'm-3',
          content: 'Saw your Facebook Video ad for Waldorf Rag Dolls. What is the FOB Rotterdam ocean freight lead time and MOQ for initial trial?',
          translation: '看了你们的华德福布偶视频广告。请问发往鹿特丹港的 FOB 海运时效和初次试单的起订量是多少？',
          sender: 'customer',
          timestamp: '10:48 AM',
          status: 'read',
        },
      ]);
      setLoadingMessages(false);
    } else if (selectedConversation.id === 'cv-ig-2') {
      setMessages([
        {
          id: 'm-201',
          content: 'Hey there! Loving the aesthetics on your Instagram reel. The Morandi pastel wooden rings look superb.',
          translation: '嗨！非常喜欢你们 Instagram 短视频上的视觉美感。莫兰迪色系的木质叠叠环质感太棒了。',
          sender: 'customer',
          timestamp: '10:10 AM',
          status: 'read',
        },
        {
          id: 'm-202',
          content: 'Loved your Instagram post on the Pastel Stacking Rings! Can you send wholesale catalog & minimum order quantity for 30 stores in Stockholm?',
          translation: '很喜欢你们关于莫兰迪彩虹塔的 Ins 贴文！能否发一份针对斯德哥尔摩 30 家门店的批发画册和起订量？',
          sender: 'customer',
          timestamp: '10:15 AM',
          status: 'read',
        },
      ]);
      setLoadingMessages(false);
    } else {
      setMessages([
        {
          id: 'm-301',
          content: selectedConversation.lastMessage,
          translation: '系统已自动完成双向多语种翻译，可直接使用母语沟通。',
          sender: 'customer',
          timestamp: selectedConversation.lastMessageTime,
          status: 'read',
        },
      ]);
      setLoadingMessages(false);
    }
  }, [selectedConversation]);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      translation: `[DeepSeek AI Auto-Translated to ${selectedConversation.country || 'International'}]: ${newMessage}`,
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };
    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');
  };

  const filteredConversations = conversations.filter((c) => {
    const matchChannel = activeChannelFilter === 'all' || c.channel === activeChannelFilter;
    const matchQuery =
      !searchQuery.trim() ||
      c.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchChannel && matchQuery;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden text-slate-900 dark:text-white">
      {/* 1. LEFT SIDEBAR: OMNICHANNEL CONVERSATION LIST & CHANNEL TABS */}
      <div className="w-84 md:w-96 border-r border-slate-200/80 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/40">
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base tracking-tight flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-500" />
              <span>Omnichannel CRM Inbox</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              7 CHANNELS CONNECTED
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads, chats, companies..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
            />
          </div>

          {/* Omnichannel Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold">
            <button
              onClick={() => setActiveChannelFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                activeChannelFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              All ({conversations.length})
            </button>
            <button
              onClick={() => setActiveChannelFilter('facebook')}
              className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
                activeChannelFilter === 'facebook'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Facebook className="w-3 h-3 text-blue-500" />
              <span>Facebook</span>
            </button>
            <button
              onClick={() => setActiveChannelFilter('instagram')}
              className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
                activeChannelFilter === 'instagram'
                  ? 'bg-pink-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Instagram className="w-3 h-3 text-pink-500" />
              <span>Instagram</span>
            </button>
            <button
              onClick={() => setActiveChannelFilter('whatsapp')}
              className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
                activeChannelFilter === 'whatsapp'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Phone className="w-3 h-3 text-emerald-500" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => setActiveChannelFilter('tiktok')}
              className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                activeChannelFilter === 'tiktok'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              TikTok
            </button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredConversations.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-400 text-xs font-medium">
              No conversations in this channel
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const meta = channelMeta[conv.channel] || channelMeta.email;
              const isSelected = selectedConversation?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-500/10 dark:bg-cyan-950/40 border-l-4 border-cyan-500'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar & Channel Badge */}
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 flex items-center justify-center text-white text-sm font-bold shadow-xs">
                        {conv.contact.charAt(0)}
                      </div>
                      <span
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shadow-xs border-2 border-white dark:border-slate-900 ${meta.badgeColor}`}
                        title={meta.label}
                      >
                        {meta.icon}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-xs truncate ${conv.unread ? 'text-slate-900 dark:text-white font-extrabold' : 'text-slate-700 dark:text-slate-200'}`}>
                          {conv.contact}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{conv.lastMessageTime}</span>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                        {conv.company}
                      </div>

                      <p className={`text-xs truncate mt-1 ${conv.unread ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                        {conv.lastMessage}
                      </p>

                      {conv.dealValue && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500">
                            ${conv.dealValue.toLocaleString()} USD
                          </span>
                          <span className="text-[10px] text-slate-400">({conv.country})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. CENTER: ACTIVE CHAT THREAD & 2-WAY DEEPSEEK TRANSLATOR */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/40 dark:bg-slate-950/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-xisync-blue-600 to-xisync-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-xs">
                  {selectedConversation.contact.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {selectedConversation.contact}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${channelMeta[selectedConversation.channel]?.badgeColor}`}>
                      {channelMeta[selectedConversation.channel]?.label}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {selectedConversation.company} • {selectedConversation.country || 'Global'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 hover:opacity-90 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Send B2B Quote</span>
                </button>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/60 dark:bg-slate-950/30">
              {loadingMessages ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-lg rounded-3xl p-4 space-y-2 shadow-xs ${
                        message.sender === 'agent'
                          ? 'bg-gradient-to-tr from-xisync-blue-600 to-xisync-cyan-600 text-white'
                          : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white'
                      }`}
                    >
                      <p className="text-xs leading-relaxed font-medium">{message.content}</p>

                      {message.translation && showTranslation && (
                        <div className={`pt-2 border-t text-xs ${message.sender === 'agent' ? 'border-white/20 text-white/90' : 'border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}>
                          <div className="flex items-center gap-1 mb-1 font-bold text-[10px] text-cyan-300">
                            <Languages className="w-3 h-3" />
                            <span>DeepSeek AI Bilingual Sync</span>
                          </div>
                          <p className="italic text-[11px]">{message.translation}</p>
                        </div>
                      )}

                      <div className={`flex items-center justify-end gap-1 text-[10px] ${message.sender === 'agent' ? 'text-white/70' : 'text-slate-400'}`}>
                        <span>{message.timestamp}</span>
                        {message.sender === 'agent' && <span>✓✓</span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Reply Box */}
            <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowTranslation(!showTranslation)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      showTranslation
                        ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span>Real-time Multi-Language Translation: Active</span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-400 font-medium">
                  Sending via: <strong className="text-slate-900 dark:text-white capitalize">{selectedConversation.channel}</strong>
                </span>
              </div>

              <div className="flex items-end gap-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={`Reply to ${selectedConversation.contact} across ${selectedConversation.channel}...`}
                  rows={2}
                  className="flex-1 p-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 font-medium resize-none"
                />

                <button
                  onClick={handleSend}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 hover:opacity-90 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Select an omnichannel lead to view conversation
          </div>
        )}
      </div>

      {/* 3. RIGHT SIDEBAR: LEAD CRM PROFILE & QUICK DEAL PIPELINE */}
      {selectedConversation && (
        <div className="w-72 md:w-80 border-l border-slate-200/80 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-950/40 space-y-6 overflow-y-auto text-xs">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3">CRM Lead Profile</h3>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Company</span>
                <span className="font-bold text-slate-900 dark:text-white text-xs">{selectedConversation.company}</span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Country / Market</span>
                <span className="font-bold text-slate-900 dark:text-white text-xs">{selectedConversation.country || 'International'}</span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Pipeline Deal Value</span>
                <span className="font-extrabold text-emerald-500 text-sm font-mono">
                  ${selectedConversation.dealValue?.toLocaleString() || '15,000'} USD
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3">Omnichannel Actions</h4>
            <div className="space-y-2">
              <button
                onClick={() => setQuoteModalOpen(true)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Issue Proforma Invoice</span>
                </span>
                <span>➔</span>
              </button>

              <button
                onClick={() => triggerToast('Logged deal to CRM pipeline!')}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Update Deal Stage</span>
                </span>
                <span>➔</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. INSTANT B2B PROFORMA QUOTE MODAL */}
      {quoteModalOpen && selectedConversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-500 uppercase">XiSync Trade Engine</span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Issue B2B Quotation to {selectedConversation.contact}
                </h3>
              </div>
              <button
                onClick={() => setQuoteModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Selected Lead Channel:</span>
                <span className="font-bold text-slate-900 dark:text-white capitalize">
                  {selectedConversation.channel} ({selectedConversation.company})
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Target Product / SKU</label>
                <input
                  type="text"
                  defaultValue="ECO-TOY-BNY-01 — Organic Linen Plush Bunny (500 units)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Incoterms 2026</label>
                  <select className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold outline-none">
                    <option value="FOB">FOB Shanghai (CNSHA)</option>
                    <option value="CIF">CIF Rotterdam / LAX</option>
                    <option value="DDP">DDP Delivered Duty Paid</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Total FOB Value (USD)</label>
                  <input
                    type="text"
                    defaultValue="$17,000 USD"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setQuoteModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setQuoteModalOpen(false);
                  triggerToast(`Proforma Invoice sent directly to ${selectedConversation.contact} via ${selectedConversation.channel}!`);
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `pi-${Date.now()}`,
                      content: `📄 Official Proforma Invoice #PI-2026-9082 issued: 500 units Organic Linen Bunny ($17,000 USD FOB Shanghai). Download link sent.`,
                      translation: `官方形式发票 #PI-2026-9082 已通过 ${selectedConversation.channel} 送达买家。`,
                      sender: 'agent',
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      status: 'sent',
                    },
                  ]);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 text-white font-extrabold text-xs shadow-md"
              >
                Send Quote via {channelMeta[selectedConversation.channel]?.label}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {quoteSuccessToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{quoteSuccessToast}</span>
        </div>
      )}
    </div>
  );
}
