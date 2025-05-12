import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const colors = {
  deepGreen: '#1a2c2e',
  darkGreen: '#27393a',
  forestGreen: '#2b4244',
  seaGreen: '#325153',
  tealGreen: '#3a6567',
  slateGreen: '#4b8081',
  grayishTeal: '#659c9c',
  lightTeal: '#8dbbba',
  paleTeal: '#b8d7d5',
  mintCream: '#dcebea',
  offWhite: '#f4f9f9'
};

const DownloadLoader = ({ progress = 0, isVisible = false }) => {
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const loaderVariants = {
    hidden: { 
      opacity: 0,
      y: -20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: 0.1
      }
    }
  };

  const circleVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    },
    rotate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="download-loader-overlay"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto'
          }}
        >
          <motion.div 
            className="download-loader-content"
            variants={loaderVariants}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              background: colors.offWhite,
              borderRadius: '12px',
              maxWidth: '300px',
              width: '100%',
              zIndex: 9999,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
            }}
          >
            {/* Animated circles */}
            <div style={{ 
              position: 'relative', 
              width: '80px', 
              height: '80px', 
              marginBottom: '1.5rem' 
            }}>
              <motion.div
                variants={circleVariants}
                animate="pulse"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: `3px solid ${colors.lightTeal}`,
                  boxSizing: 'border-box'
                }}
              />
              
              <motion.div
                variants={circleVariants}
                style={{
                  position: 'absolute',
                  width: '60%',
                  height: '60%',
                  top: '20%',
                  left: '20%',
                  borderRadius: '50%',
                  border: `3px solid ${colors.tealGreen}`,
                  boxSizing: 'border-box'
                }}
              />
              
              <motion.div
                variants={circleVariants}
                animate="rotate"
                style={{
                  position: 'absolute',
                  width: '30%',
                  height: '30%',
                  top: '35%',
                  left: '35%',
                  borderRadius: '50%',
                  backgroundColor: colors.slateGreen
                }}
              />
            </div>

            {/* Progress text */}
            <motion.p 
              style={{ 
                color: colors.darkGreen, 
                marginBottom: '1rem',
                fontWeight: '500',
                textAlign: 'center'
              }}
            >
              {progress < 100 ? 'Preparing your receipt...' : 'Finalizing download...'}
            </motion.p>

            {/* Progress bar */}
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: colors.mintCream,
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}>
              <motion.div 
                initial={{ width: '0%' }}
                animate={{ 
                  width: `${progress}%`,
                  transition: { duration: 0.8, ease: 'easeOut' }
                }}
                style={{
                  height: '100%',
                  backgroundColor: colors.seaGreen,
                  borderRadius: '4px'
                }}
              />
            </div>

            {/* Percentage */}
            <motion.p 
              style={{ 
                color: colors.grayishTeal,
                fontSize: '0.9rem',
                textAlign: 'center'
              }}
              animate={{
                scale: [1, 1.05, 1],
                transition: { repeat: Infinity, duration: 1.5 }
              }}
            >
              {Math.round(progress)}% complete
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DownloadLoader;