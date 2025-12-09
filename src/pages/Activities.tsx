import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ActivityItem } from '@/components/ActivityItem';
import { mockActivities, Activity } from '@/data/mockData';

// Generate more activities for infinite scroll simulation
const generateMoreActivities = (startIndex: number, count: number): Activity[] => {
  const types: Activity['type'][] = ['sent', 'received', 'reminder', 'connected'];
  const contacts = ['Sarah Chen', 'John Investor', 'Emily Rodriguez', 'Michael Chang', 'Lisa Park', 'David Kim'];
  const platforms = ['WhatsApp', 'LinkedIn', 'Signal', 'Email'];
  const messages = [
    'Sent follow-up message',
    'Replied to your message',
    'Reminder for quarterly update',
    'Successfully synced contacts',
    'Congratulated on achievement',
    'Discussed new opportunity',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `gen_${startIndex + i}`,
    type: types[Math.floor(Math.random() * types.length)],
    contact: contacts[Math.floor(Math.random() * contacts.length)],
    platform: platforms[Math.floor(Math.random() * platforms.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    timestamp: `${Math.floor(Math.random() * 24) + 1} hours ago`,
  }));
};

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newActivities = generateMoreActivities(activities.length, 10);
    setActivities((prev) => [...prev, ...newActivities]);
    
    // Stop after 50 total activities for demo
    if (activities.length >= 40) {
      setHasMore(false);
    }
    
    setIsLoading(false);
  }, [activities.length, isLoading, hasMore]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center px-4 h-16">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <span className="flex-1 text-center font-semibold text-foreground">All Activities</span>
          <div className="w-16" />
        </div>
      </header>

      <main className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-2xl border border-border divide-y divide-border"
        >
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index < 10 ? index * 0.05 : 0 }}
              className="px-4"
            >
              <ActivityItem activity={activity} />
            </motion.div>
          ))}
        </motion.div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        )}

        {/* End message */}
        {!hasMore && (
          <p className="text-center text-muted-foreground py-8 text-sm">
            You've reached the end of your activity history
          </p>
        )}
      </main>
    </div>
  );
}