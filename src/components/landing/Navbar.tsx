import { motion, AnimatePresence } from "motion/react";
import {
  Moon,
  Sun,
  ChevronDown,
  Image,
  Video,
  Music,
  FileText,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
const tools = [
  {
    title: "Image Converter",
    description: "Convert image files",
    icon: Image,
    href: "/image-converter",
  },
  {
    title: "Video Converter",
    description: "Convert video files",
    icon: Video,
    href: "/video-converter",
  },
  {
    title: "Audio Converter",
    description: "Convert audio files",
    icon: Music,
    href: "/audio-converter",
  },
  {
    title: "Document Converter",
    description: "Convert document files",
    icon: FileText,
    href: "/document-converter",
  },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openTools = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }

    setIsToolsOpen(true);
  };

const closeTools = () => {
  closeTimeout.current = setTimeout(() => {
    setIsToolsOpen(false);
  }, 200);
};

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center px-6">
        {/* Logo */}
<Link
  to="/"
  className="shrink-0 -ml-14 translate-y-[4px]"
>
  <img
    src="/navfoto.png"
    alt="ConverterTrue"
    className="h-56 w-auto object-contain"
    draggable={false}
  />
</Link>

        {/* Tools */}
        <div
  className="relative hidden flex-1 justify-center md:flex -translate-x-24"
  onMouseEnter={openTools}
  onMouseLeave={closeTools}
>
          <button
            className={`
              flex items-center gap-1.5
              rounded-full
              border border-border/70
              bg-surface/60
              px-5 py-2
              text-[14px] font-medium tracking-tight text-foreground
              transition-all duration-200
              hover:bg-accent
            
            `}
          >
            Tools

            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isToolsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Mega Menu */}
         <AnimatePresence>
  {isToolsOpen && (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.18 }}
              className="
                absolute
                top-full
                left-1/2
                -translate-x-1/2
                pt-3
                w-[560px]
              "
            >
              <div
                className="
                  rounded-2xl
                  border border-border/70
                  bg-background/95
                  backdrop-blur-xl
                  shadow-2xl
                  p-3
                "
              >
                <div className="grid grid-cols-2 gap-2">
               {tools.map((tool) => {
  const Icon = tool.icon;

  return (
    <Link
  key={tool.title}
  to={tool.href}
      className="
        group
        cursor-pointer
        flex items-center
        gap-3
        rounded-xl
        p-4
        text-left
        transition-all
        hover:bg-primary/10
      "
    >
      <div
        className="
          flex h-10 w-10
          shrink-0
          items-center justify-center
          rounded-xl
          bg-primary/10
          text-primary
          transition
          group-hover:bg-primary/15
        "
      >
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p className="text-sm font-medium text-foreground">
          {tool.title}
        </p>

        <p className="mt-0.5 text-xs text-muted-foreground">
          {tool.description}
        </p>
      </div>
    </Link>
  );
})}
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>

       {/* Theme */}
<div className="ml-auto">
  <button
    onClick={toggle}
    aria-label="Toggle theme"
    className="w-9 h-9 grid place-items-center rounded-full border border-border/70 bg-surface/60 hover:bg-accent transition"
  >
    {theme === "dark" ? (
      <Sun className="w-4 h-4" />
    ) : (
      <Moon className="w-4 h-4" />
    )}
  </button>
</div>
      </div>
    </motion.header>
  );
}