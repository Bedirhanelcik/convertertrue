import { motion } from "motion/react";
import { FileText, Image as ImageIcon, Film, ArrowRight, Check } from "lucide-react";

const rows = [
  { from: "PDF", to: "DOCX", icon: FileText, tint: "text-rose-400", progress: 100, status: "done" },
  { from: "PNG", to: "WEBP", icon: ImageIcon, tint: "text-sky-400", progress: 68, status: "converting" },
  { from: "MP4", to: "MP3", icon: Film, tint: "text-violet-400", progress: 22, status: "queued" },
];

export function ConverterPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative rounded-3xl border border-border/70 bg-surface/70 backdrop-blur-sm p-5 shadow-[var(--shadow-soft)] overflow-hidden"
    >
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="flex items-center justify-between px-1 pb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">converter.queue</span>
      </div>

      <div className="space-y-2.5">
        {rows.map((r, i) => (
          <motion.div
            key={r.from + r.to}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.35 + i * 0.1 }}
            className="flex items-center gap-4 rounded-2xl bg-background/70 border border-border/60 p-3.5"
          >
            <div className={"w-10 h-10 rounded-xl bg-muted grid place-items-center " + r.tint}>
              <r.icon className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-mono font-medium">{r.from}</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-mono font-medium">{r.to}</span>
              </div>
              <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.progress}%` }}
                  transition={{ duration: 1.1, delay: 0.5 + i * 0.15, ease: "easeOut" }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </div>
            <div className="text-[11px] font-mono text-muted-foreground w-14 text-right">
              {r.status === "done" ? (
                <span className="inline-flex items-center gap-1 text-primary">
                  <Check className="w-3 h-3" /> done
                </span>
              ) : (
                `${r.progress}%`
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}