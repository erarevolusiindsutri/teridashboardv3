import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore } from '../store';

export function AIReport() {
  const { selectedUnit, unitData } = useDashboardStore();
  const [report, setReport] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (selectedUnit) {
      const data = unitData[selectedUnit];
      const trendText = data.trend > 0 ? 'increase' : 'decrease';
      const trendValue = Math.abs(data.trend * 100).toFixed(1);
      
      let analysisText = '';
      switch (selectedUnit) {
        case 'service':
          analysisText = `Customer Service Report: ${data.value} complaints received today, showing a ${trendValue}% ${trendText} from yesterday. `;
          if (data.value > 20) {
            analysisText += 'High complaint volume detected. Immediate attention recommended.';
          } else if (data.value > 10) {
            analysisText += 'Moderate complaint volume. Monitor situation.';
          } else {
            analysisText += 'Low complaint volume. Good service performance.';
          }
          break;
        case 'stock':
          analysisText = `Inventory Status: ${data.value}% efficiency rate with a ${trendValue}% ${trendText} in stock optimization.`;
          break;
        case 'sales':
          analysisText = `Sales Performance: ${data.value}% target achievement with a ${trendValue}% ${trendText} in revenue.`;
          break;
      }
      
      setReport(`${analysisText} Last updated: ${new Date(data.lastUpdated).toLocaleTimeString()}`);
    } else {
      setReport('System Overview: Select a unit for detailed analysis. Customer service monitoring active.');
    }
  }, [selectedUnit, unitData]);

  useEffect(() => {
    setIsTyping(true);
    setDisplayText('');
    let index = 0;
    const interval = setInterval(() => {
      if (index < report.length) {
        setDisplayText((prev) => prev + report.charAt(index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [report]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-12 left-1/2 transform -translate-x-1/2 text-center max-w-[90vw] px-4"
      >
        <motion.p 
          className="text-white/90 text-sm md:text-lg font-light tracking-wide"
          style={{ textShadow: '0 0 10px rgba(255,255,255,0.5)' }}
        >
          {displayText}
          {isTyping && <span className="animate-pulse">|</span>}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}