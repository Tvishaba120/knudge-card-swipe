import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, Calendar, Sparkles, MessageSquare, Clock, Rss, Camera, User } from 'lucide-react';
import { ContactItem } from '@/components/ContactItem';
import { Avatar } from '@/components/Avatar';
import { PlatformBadge } from '@/components/PlatformBadge';
import { Button } from '@/components/ui/button';
import { TopBar } from '@/components/TopBar';
import { mockContacts, circles, Contact } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

// Platform options for new contacts
const platformOptions = [
  { id: 'whatsapp', label: 'WhatsApp', color: 'bg-[#25D366]' },
  { id: 'linkedin', label: 'LinkedIn', color: 'bg-[#0A66C2]' },
  { id: 'email', label: 'Email', color: 'bg-gray-500' },
  { id: 'signal', label: 'Signal', color: 'bg-[#3A76F0]' },
  { id: 'telegram', label: 'Telegram', color: 'bg-[#26A5E4]' },
];

// Mock recent conversations
const mockConversations = [
  { id: 'conv1', message: 'Hey, great meeting you at the conference!', timestamp: '2 days ago', isSent: true },
  { id: 'conv2', message: 'Thanks! Would love to discuss the partnership further.', timestamp: '2 days ago', isSent: false },
  { id: 'conv3', message: 'Absolutely, let me send over some details.', timestamp: '1 day ago', isSent: true },
];

// Mock contact feeds - use supported platform types
const mockContactFeeds = [
  { id: 'feed1', title: 'Shared an article about AI trends', platform: 'linkedin' as const, timestamp: '5 hours ago' },
  { id: 'feed2', title: 'Posted a video: "Future of Tech"', platform: 'youtube' as const, timestamp: '1 day ago' },
  { id: 'feed3', title: 'Commented on your post', platform: 'linkedin' as const, timestamp: '2 days ago' },
];

export default function Contacts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    title: '',
    company: '',
    platforms: [] as string[],
  });
  const { toast } = useToast();

  const filteredContacts = mockContacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || 
      (activeFilter === 'VIP' && contact.isVIP) ||
      contact.circle === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background pb-24 pt-20">
      <TopBar title="Contacts" />

      <main className="px-4 py-4 space-y-4">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </motion.div>

        {/* Filter Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2"
        >
          {circles.map((circle) => (
            <button
              key={circle}
              onClick={() => setActiveFilter(circle)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === circle
                  ? 'gradient-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              {circle}
            </button>
          ))}
        </motion.div>

        {/* Contacts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-2"
        >
          {filteredContacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              onClick={() => setSelectedContact(contact)}
            />
          ))}

          {filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No contacts found</p>
            </div>
          )}
        </motion.div>
      </main>

      {/* Add Contact FAB */}
      <button 
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-24 right-4 h-14 w-14 rounded-full gradient-primary shadow-glow flex items-center justify-center hover:scale-105 transition-transform"
      >
        <Plus className="h-6 w-6 text-primary-foreground" />
      </button>

      {/* Create Contact Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm overflow-y-auto"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-card rounded-3xl shadow-elevated w-full max-w-lg mx-auto mt-[10vh] mb-24 overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-muted flex items-center justify-center z-10"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">Create New Contact</h2>
              </div>

              {/* Form */}
              <div className="px-6 py-6 space-y-5">
                {/* Profile Picture Placeholder */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-cyan-400/20 flex items-center justify-center">
                      {newContact.name ? (
                        <span className="text-2xl font-bold text-foreground">
                          {newContact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                      ) : (
                        <User className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center border-2 border-card">
                      <Camera className="h-4 w-4 text-primary-foreground" />
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Name *</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={newContact.phone}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={newContact.email}
                    onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                {/* Title & Company */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Title</label>
                    <input
                      type="text"
                      placeholder="Job title"
                      value={newContact.title}
                      onChange={(e) => setNewContact(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Company</label>
                    <input
                      type="text"
                      placeholder="Company"
                      value={newContact.company}
                      onChange={(e) => setNewContact(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                {/* Platform Tags */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Platforms</label>
                  <div className="flex flex-wrap gap-2">
                    {platformOptions.map((platform) => {
                      const isSelected = newContact.platforms.includes(platform.id);
                      return (
                        <button
                          key={platform.id}
                          onClick={() => {
                            setNewContact(prev => ({
                              ...prev,
                              platforms: isSelected
                                ? prev.platforms.filter(p => p !== platform.id)
                                : [...prev.platforms, platform.id]
                            }));
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                            isSelected
                              ? `${platform.color} text-white`
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {platform.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 gradient-primary text-primary-foreground border-0"
                  onClick={() => {
                    if (!newContact.name.trim()) {
                      toast({ description: "Please enter a name", variant: "destructive" });
                      return;
                    }
                    toast({ description: `${newContact.name} added to contacts!` });
                    setNewContact({ name: '', phone: '', email: '', title: '', company: '', platforms: [] });
                    setShowCreateModal(false);
                  }}
                >
                  Create Contact
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Detail Modal - Positioned at top */}
      <AnimatePresence>
        {selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedContact(null)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-card rounded-3xl shadow-elevated w-full max-w-lg mx-auto mt-[5vh] mb-24 overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedContact(null)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-muted flex items-center justify-center z-10"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* Content */}
              <div className="px-6 py-6">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar initials={selectedContact.avatar} size="xl" isVIP={selectedContact.isVIP} />
                  <h2 className="text-xl font-bold text-foreground mt-4">{selectedContact.name}</h2>
                  <p className="text-muted-foreground">
                    {selectedContact.title} {selectedContact.company && `at ${selectedContact.company}`}
                  </p>
                  
                  {/* Platforms */}
                  <div className="flex items-center gap-2 mt-4">
                    {selectedContact.platforms.map((platform) => (
                      <PlatformBadge key={platform} platform={platform} size="md" showLabel />
                    ))}
                  </div>
                </div>

                {/* AI Summary */}
                <div className="bg-primary/5 rounded-2xl p-4 mb-4 border border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">AI Summary</span>
                  </div>
                  <p className="text-sm text-foreground">
                    {selectedContact.isVIP 
                      ? 'VIP contact with high engagement history. Known for quick responses and strategic partnerships. Consider scheduling quarterly check-ins.'
                      : 'Regular contact with moderate engagement. Last interaction was positive. Good candidate for collaborative opportunities.'}
                  </p>
                </div>

                {/* Last Contact */}
                <div className="bg-muted/50 rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last contacted</span>
                    <span className="text-sm font-medium text-foreground">{selectedContact.lastContacted}</span>
                  </div>
                </div>

                {/* Recent Conversations - Timeline style */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Recent Conversations</span>
                    <span className="text-xs text-muted-foreground">(Last 10)</span>
                  </div>
                  <div className="relative pl-4 border-l-2 border-primary/20 space-y-3 max-h-48 overflow-y-auto">
                    {mockConversations.map((conv, index) => (
                      <div key={conv.id} className="relative">
                        <div className={`absolute -left-[21px] top-2 h-3 w-3 rounded-full border-2 ${
                          conv.isSent ? 'bg-primary border-primary' : 'bg-secondary border-secondary'
                        }`} />
                        <div className={`p-3 rounded-xl text-sm ${
                          conv.isSent 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'bg-muted/50 border border-border'
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium ${conv.isSent ? 'text-primary' : 'text-muted-foreground'}`}>
                              {conv.isSent ? 'You' : selectedContact.name.split(' ')[0]}
                            </span>
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                          </div>
                          <p className="text-foreground">{conv.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact's Feeds - Card grid */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Rss className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-semibold text-foreground">Their Feeds</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {mockContactFeeds.map((feed) => (
                      <div
                        key={feed.id}
                        className="p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            <PlatformBadge platform={feed.platform as any} size="md" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground line-clamp-2">{feed.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{feed.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button className="flex-1 gradient-primary text-primary-foreground border-0">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}