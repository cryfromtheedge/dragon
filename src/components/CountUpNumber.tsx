import { animate, useMotionValue, useTransform, motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';

interface Props {
  value: number;
  formatter: (value: number) => string;
}

export function CountUpNumber({ value, formatter }: Props) {
  const motionValue = useMotionValue(0);
  const reduced = useReducedMotion();
  const rounded = useTransform(motionValue, (latest) => formatter(latest));

  useEffect(() => {
    if (reduced) {
      motionValue.set(value);
      return;
    }

    const controls = animate(motionValue, value, { duration: 0.7, ease: 'easeOut' });
    return () => controls.stop();
  }, [motionValue, reduced, value]);

  return <motion.span>{rounded}</motion.span>;
}
