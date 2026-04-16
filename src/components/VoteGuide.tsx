import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'giftrank_vote_guide_seen';

export default function VoteGuide() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setShow(true);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, '1');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mx-4 mb-3 bg-primary/10 rounded-xl px-4 py-3 flex items-center justify-between"
        >
          <span className="text-sm text-primary font-medium">
            🤍를 눌러 투표하세요 💛
          </span>
          <button
            onClick={dismiss}
            className="text-xs text-muted-foreground ml-2 shrink-0"
          >
            확인
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
