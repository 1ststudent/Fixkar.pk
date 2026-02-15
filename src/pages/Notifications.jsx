import { useNotifications } from '../hooks/useNotifications';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Notifications() {
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Notifications</h1>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No notifications yet.</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg shadow-sm border ${
                  notif.read
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}
                onClick={() => !notif.read && markAsRead(notif.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    {notif.type === 'new_quote' && (
                      <p className="text-gray-800 dark:text-gray-200">
                        <span className="font-semibold">{notif.expertName}</span> submitted a quote for your problem{' '}
                        <Link to={`/my-submissions/${notif.problemId}/quotes`} className="text-blue-600 hover:underline">
                          {notif.problemTitle}
                        </Link>
                      </p>
                    )}
                    {notif.type === 'quote_accepted' && (
                      <p className="text-gray-800 dark:text-gray-200">
                        Your quote for{' '}
                        <Link to={`/my-submissions/${notif.problemId}/quotes`} className="text-blue-600 hover:underline">
                          {notif.problemTitle}
                        </Link>{' '}
                        was accepted.
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {notif.createdAt?.toLocaleString()}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">New</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}