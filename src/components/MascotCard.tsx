import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  totalSaved: number;
  gap: number;
}

export function MascotCard({ totalSaved, gap }: Props) {
  const reduced = useReducedMotion();

  const state =
    gap <= 0
      ? { emoji: '🐱🎉', message: 'META ATINGIDA! VOCÊ É INCRÍVEL!' }
      : totalSaved > 0
        ? { emoji: '🐱🎉', message: 'No caminho certo para o SPA! Continue!' }
        : { emoji: '😿💧', message: 'Gatinho triste... vamos economizar?' };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-zinc-900 p-6 text-white shadow-lg">
      <h2 className="text-sm uppercase tracking-widest text-zinc-300">Mascote financeiro</h2>
      <div className="mt-4 flex items-center gap-4">
        <motion.div
          animate={reduced ? undefined : { rotate: [0, -5, 5, 0], y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 2.8 }}
          className="text-5xl"
        >
          {state.emoji}
        </motion.div>
        <p className="text-lg font-semibold">{state.message}</p>
      </div>

      {gap <= 0 && (
        <div className="pointer-events-none absolute inset-0 opacity-40">
          {[...Array(16)].map((_, index) => (
            <motion.span
              key={index}
              className="absolute h-2 w-2 rounded-full bg-yellow-300"
              style={{ left: `${(index * 13) % 100}%`, top: `${(index * 7) % 100}%` }}
              animate={reduced ? undefined : { y: [-10, 20], opacity: [0, 1, 0] }}
              transition={{ duration: 1.4, delay: index * 0.06, repeat: Infinity }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
