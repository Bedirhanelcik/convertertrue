import { motion } from "motion/react";
import { UploadCard } from "./UploadCard";


interface HeroProps {
  acceptedType: string;
  onFilesSelected: (files: File[]) => void;
  title?: string;
  description?: string;
}

export function Hero({
  acceptedType,
  onFilesSelected,
  title = "Convert Any File",
  description = "Fast, secure and free file conversions supporting hundreds of formats — right in your browser.",
}: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 [background:var(--gradient-hero)]" />
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[520px] opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 pt-16 md:pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/70 px-3 py-1 text-xs text-muted-foreground mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            200+ formats supported
          </div>
  <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-[1.02]">
  {title}
</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
  {description}
</p>
        </motion.div>

      <div className="mt-8 flex justify-center">
  <div className="w-full max-w-4xl">
    <UploadCard
  acceptedType={acceptedType}
  onFilesSelected={onFilesSelected}
/>
  </div>
</div>
      </div>
    </section>
  );
}