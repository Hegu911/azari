'use client';

import { motion } from 'framer-motion';

interface FragranceNotesProps {
  topNotes?: string;
  middleNotes?: string;
  baseNotes?: string;
}

export default function FragranceNotes({ topNotes, middleNotes, baseNotes }: FragranceNotesProps) {
  const notes = [
    { label: 'Üst Notlar', value: topNotes, color: 'from-amber-400/20 to-amber-600/20', border: 'border-amber-500/30', delay: 0 },
    { label: 'Orta Notlar', value: middleNotes, color: 'from-rose-400/20 to-rose-600/20', border: 'border-rose-500/30', delay: 0.15 },
    { label: 'Alt Notlar', value: baseNotes, color: 'from-purple-400/20 to-purple-600/20', border: 'border-purple-500/30', delay: 0.3 },
  ];

  return (
    <div className="space-y-6">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-lg font-light text-charcoal tracking-wide"
      >
        Ətir Notları
      </motion.h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {notes.map((note) => (
          <motion.div
            key={note.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: note.delay }}
            className={`relative overflow-hidden rounded-2xl border ${note.border} bg-gradient-to-br ${note.color} p-6 backdrop-blur-sm`}
          >
            <p className="text-charcoal/40 text-xs tracking-wider uppercase mb-2">{note.label}</p>
            <p className="text-charcoal/80 text-sm leading-relaxed">{note.value || '—'}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        {notes.map((note, i) => (
          <div key={note.label} className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${
              i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-rose-400' : 'bg-purple-400'
            }`} />
            <span className="text-[10px] text-charcoal/30 uppercase tracking-wider">{note.label}</span>
            {i < notes.length - 1 && <span className="text-charcoal/10 mx-1">&mdash;</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
