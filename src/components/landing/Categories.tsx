import { motion } from "motion/react";
import { useNavigate } from "@tanstack/react-router";
import {
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Sparkles,
} from "lucide-react";

const categories = [
  {
    label: "Documents",
    icon: FileText,
    path: "/document-converter",
    items: [
      "PDF → DOCX",
      "DOCX → PDF",
      "PPTX → PDF",
      "XLSX → PDF",
    ],
  },
  {
    label: "Images",
    icon: ImageIcon,
    path: "/image-converter",
    items: [
      "PNG → JPG",
      "JPG → PNG",
      "PNG → WEBP",
      "WEBP → PNG",
    ],
  },
  {
    label: "Video",
    icon: Film,
    path: "/video-converter",
    items: [
      "MP4 → WEBM",
      "WEBM → MP4",
      "MP4 → MOV",
      "MOV → MP4",
    ],
  },
  {
    label: "Audio",
    icon: Music,
    path: "/audio-converter",
    items: [
      "MP4 → MP3",
      "MP3 → WAV",
      "WAV → MP3",
      "FLAC → MP3",
    ],
  },
  {
    label: "Features",
    icon: Sparkles,
    path: null,
    items: [
      "File Preview",
      "Custom Quality",
      "File Compression",
      "Conversion History",
    ],
  },
];

export function Categories() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-7xl px-6 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between gap-6 mb-10"
      >
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-primary/80 mb-3">
            Categories
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            All your conversions, one workspace.
          </h2>
        </div>

        <p className="hidden md:block max-w-sm text-sm text-muted-foreground">
          Explore our available conversion tools and choose the format you need.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {categories.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.45,
              delay: i * 0.06,
            }}
            whileHover={c.path ? { y: -4 } : undefined}
            onClick={() => {
              if (c.path) {
                navigate({
                  to: c.path,
                });
              }
            }}
            className={`group relative rounded-2xl border border-border/70 bg-surface/60 p-5 transition-all shadow-[var(--shadow-soft)] ${
              c.path
                ? "cursor-pointer hover:border-primary/40 hover:bg-surface hover:shadow-[var(--shadow-glow)]"
                : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 ring-1 ring-primary/25 text-primary grid place-items-center transition group-hover:bg-primary/15">
                <c.icon
                  className="w-4.5 h-4.5"
                  strokeWidth={2}
                />
              </div>

              <h3 className="font-medium tracking-tight">
                {c.label}
              </h3>
            </div>

            <ul className="space-y-1.5">
              {c.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center rounded-lg px-2 py-2 text-[13px] font-mono text-muted-foreground"
                >
                  {c.label === "Features" && (
                    <span className="mr-2 text-primary">
                      ✓
                    </span>
                  )}

                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}