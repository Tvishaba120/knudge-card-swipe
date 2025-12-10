import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Chrome, Linkedin, Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OnboardingLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<'google' | 'linkedin' | null>(null);

  const handleLogin = async (provider: 'google' | 'linkedin') => {
    setLoading(provider);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    navigate('/onboarding/goal');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-purple-500 to-secondary relative overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 bg-white/5 rounded-3xl"
            initial={{ 
              x: Math.random() * 400 - 200, 
              y: Math.random() * 400 - 200,
              rotate: Math.random() * 45,
            }}
            animate={{ 
              x: [null, Math.random() * 100 - 50],
              y: [null, Math.random() * 100 - 50],
              rotate: [null, Math.random() * 30 - 15],
            }}
            transition={{ 
              duration: 8 + i * 2, 
              repeat: Infinity, 
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 15}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-6 text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 mx-auto mb-8 rounded-2xl gradient-primary flex items-center justify-center shadow-lg"
        >
          <Zap className="h-8 w-8 text-white" />
        </motion.div>

        {/* Headlines */}
        <h1 className="text-4xl font-bold text-white mb-2">
          Stop drowning in messages.
        </h1>
        <p className="text-xl text-white/90 mb-12">
          Start Knudging.
        </p>

        {/* Auth buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => handleLogin('google')}
            disabled={loading !== null}
            className="w-full h-14 rounded-xl font-semibold text-base bg-white text-gray-900 hover:bg-gray-50 flex items-center justify-center gap-3"
          >
            {loading === 'google' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Chrome className="h-5 w-5" />
                Continue with Google
              </>
            )}
          </Button>

          <Button
            onClick={() => handleLogin('linkedin')}
            disabled={loading !== null}
            className="w-full h-14 rounded-xl font-semibold text-base bg-[#0A66C2] text-white hover:bg-[#084d94] flex items-center justify-center gap-3"
          >
            {loading === 'linkedin' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Linkedin className="h-5 w-5" />
                Continue with LinkedIn
              </>
            )}
          </Button>
        </div>

        {/* Bottom text */}
        <p className="text-sm text-white/70 mt-8">
          No credit card required
        </p>
      </motion.div>
    </div>
  );
}
