import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import {
  Send,
  Paperclip,
  Languages,
  CheckCircle2,
  Clock,
} from 'lucide-react';

type Message = {
  id: string;
  content: string;
  translation?: string;
  sender: 'customer' | 'supplier';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
};

const sampleMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! I wanted to follow up on my recent order ORD-2024-002. When can we expect the shipment to depart?',
    sender: 'customer',
    timestamp: '10:30 AM',
    status: 'read',
  },
  {
    id: '2',
    content: '您好！您的订单 ORD-2024-002 已经准备就绪，将于明天（1月15日）从上海港发出。预计2月5日到达洛杉矶。',
    translation: 'Hello! Your order ORD-2024-002 is ready and will depart from Shanghai port tomorrow (January 15th). Expected arrival in Los Angeles is February 5th.',
    sender: 'supplier',
    timestamp: '10:35 AM',
    status: 'read',
  },
  {
    id: '3',
    content: 'Great, thank you! Can you also send me the packing list and commercial invoice?',
    sender: 'customer',
    timestamp: '10:38 AM',
    status: 'read',
  },
  {
    id: '4',
    content: '当然可以！我已经将装箱单和商业发票上传到您的文档中心。您可以随时下载。如果需要其他文件，请告诉我。',
    translation: 'Of course! I have uploaded the packing list and commercial invoice to your document center. You can download them anytime. Let me know if you need any other documents.',
    sender: 'supplier',
    timestamp: '10:42 AM',
    status: 'read',
  },
  {
    id: '5',
    content: 'Perfect! I see the documents now. One more question - will you be providing the Certificate of Origin as well?',
    sender: 'customer',
    timestamp: '10:45 AM',
    status: 'delivered',
  },
];

export function PortalMessages() {
  const [messages] = useState<Message[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showTranslation, setShowTranslation] = useState(true);

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
              <div className="text-sm text-gray-500">Shenzhen Electronics Co.</div>
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
        <div className="text-center py-2">
          <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">Today</span>
        </div>

        {messages.map((message) => (
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
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-3">
          <div className="flex-1 bg-gray-100 rounded-xl px-4 py-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
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
          <Button icon={<Send className="w-4 h-4" />}>Send</Button>
        </div>
      </div>
    </div>
  );
}
