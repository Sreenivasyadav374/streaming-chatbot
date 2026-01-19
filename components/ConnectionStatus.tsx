import { ConnectionStatus as Status } from '@/types/chat';
import { Wifi, WifiOff, AlertCircle, Loader2 } from 'lucide-react';

interface ConnectionStatusProps {
  status: Status;
}

export default function ConnectionStatus({ status }: ConnectionStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: Wifi,
          text: 'Connected',
          className: 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400',
        };
      case 'streaming':
        return {
          icon: Loader2,
          text: 'AI is typing...',
          className: 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400',
          animate: true,
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Error',
          className: 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400',
        };
      case 'disconnected':
        return {
          icon: WifiOff,
          text: 'Disconnected',
          className: 'text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium ${config.className}`}
    >
      <Icon className={`w-3.5 h-3.5 ${config.animate ? 'animate-spin' : ''}`} />
      <span>{config.text}</span>
    </div>
  );
}
