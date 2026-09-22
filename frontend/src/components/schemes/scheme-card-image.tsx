"use client";

import React from "react";
import {
  Award,
  Leaf,
  HardHat,
  Zap,
  Activity,
  Apple,
  Shield,
  Server,
  RefreshCw,
  Building2,
  Lock,
  GraduationCap,
  Car,
  Truck,
  Scale,
  Globe2,
  Building,
  Anchor,
  Cpu,
  FileCheck2,
  ShieldAlert,
} from "lucide-react";

interface SchemeImageProps {
  slug: string;
  title: string;
  image?: string;
}

const SCHEME_CONFIGS: Record<
  string,
  {
    bgGradient: string;
    accentColor: string;
    glowColor: string;
    badgeBg: string;
    icon: React.ElementType;
    tag: string;
    code: string;
    photoUrl: string;
  }
> = {
  iso9001: {
    bgGradient: "from-slate-900 via-slate-800 to-blue-900",
    accentColor: "#38bdf8",
    glowColor: "#0284c7",
    badgeBg: "#0284c7",
    icon: Award,
    tag: "QUALITY MANAGEMENT",
    code: "ISO 9001",
    photoUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop",
  },
  iso14001: {
    bgGradient: "from-emerald-950 via-slate-900 to-emerald-900",
    accentColor: "#34d399",
    glowColor: "#059669",
    badgeBg: "#059669",
    icon: Leaf,
    tag: "ENVIRONMENTAL",
    code: "ISO 14001",
    photoUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop",
  },
  iso45001: {
    bgGradient: "from-amber-950 via-slate-900 to-orange-950",
    accentColor: "#fbbf24",
    glowColor: "#d97706",
    badgeBg: "#d97706",
    icon: HardHat,
    tag: "HEALTH & SAFETY",
    code: "ISO 45001",
    photoUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop",
  },
  iso50001: {
    bgGradient: "from-yellow-950 via-slate-900 to-amber-900",
    accentColor: "#facc15",
    glowColor: "#ca8a04",
    badgeBg: "#ca8a04",
    icon: Zap,
    tag: "ENERGY MANAGEMENT",
    code: "ISO 50001",
    photoUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop",
  },
  iso13485: {
    bgGradient: "from-cyan-950 via-slate-900 to-teal-900",
    accentColor: "#22d3ee",
    glowColor: "#0891b2",
    badgeBg: "#0891b2",
    icon: Activity,
    tag: "MEDICAL DEVICES",
    code: "ISO 13485",
    photoUrl: "https://images.unsplash.com/photo-1583912267670-657592e5c6fd?w=600&auto=format&fit=crop",
  },
  iso22000: {
    bgGradient: "from-lime-950 via-slate-900 to-green-900",
    accentColor: "#a3e635",
    glowColor: "#65a30d",
    badgeBg: "#65a30d",
    icon: Apple,
    tag: "FOOD SAFETY",
    code: "ISO 22000",
    photoUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop",
  },
  iso27001: {
    bgGradient: "from-indigo-950 via-slate-900 to-blue-950",
    accentColor: "#818cf8",
    glowColor: "#4f46e5",
    badgeBg: "#4f46e5",
    icon: Shield,
    tag: "INFO SECURITY",
    code: "ISO 27001",
    photoUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop",
  },
  iso20000: {
    bgGradient: "from-blue-950 via-slate-900 to-sky-950",
    accentColor: "#60a5fa",
    glowColor: "#2563eb",
    badgeBg: "#2563eb",
    icon: Server,
    tag: "IT SERVICE",
    code: "ISO 20000",
    photoUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop",
  },
  iso22301: {
    bgGradient: "from-purple-950 via-slate-900 to-indigo-950",
    accentColor: "#c084fc",
    glowColor: "#9333ea",
    badgeBg: "#9333ea",
    icon: RefreshCw,
    tag: "BUSINESS CONTINUITY",
    code: "ISO 22301",
    photoUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop",
  },
  iso55001: {
    bgGradient: "from-slate-950 via-slate-900 to-zinc-900",
    accentColor: "#a1a1aa",
    glowColor: "#52525b",
    badgeBg: "#52525b",
    icon: Building2,
    tag: "ASSET MANAGEMENT",
    code: "ISO 55001",
    photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop",
  },
  iso27701: {
    bgGradient: "from-violet-950 via-slate-900 to-fuchsia-950",
    accentColor: "#e879f9",
    glowColor: "#c026d3",
    badgeBg: "#c026d3",
    icon: Lock,
    tag: "PRIVACY INFO",
    code: "ISO 27701",
    photoUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&auto=format&fit=crop",
  },
  iso21001: {
    bgGradient: "from-sky-950 via-slate-900 to-blue-900",
    accentColor: "#38bdf8",
    glowColor: "#0284c7",
    badgeBg: "#0284c7",
    icon: GraduationCap,
    tag: "EDUCATIONAL",
    code: "ISO 21001",
    photoUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop",
  },
  iso39001: {
    bgGradient: "from-orange-950 via-slate-900 to-red-950",
    accentColor: "#fb923c",
    glowColor: "#ea580c",
    badgeBg: "#ea580c",
    icon: Car,
    tag: "ROAD TRAFFIC SAFETY",
    code: "ISO 39001",
    photoUrl: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop",
  },
  iso28000: {
    bgGradient: "from-slate-950 via-slate-900 to-blue-950",
    accentColor: "#94a3b8",
    glowColor: "#475569",
    badgeBg: "#475569",
    icon: Truck,
    tag: "SUPPLY CHAIN SECURITY",
    code: "ISO 28000",
    photoUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop",
  },
  iso37001: {
    bgGradient: "from-rose-950 via-slate-900 to-red-950",
    accentColor: "#fb7185",
    glowColor: "#e11d48",
    badgeBg: "#e11d48",
    icon: Scale,
    tag: "ANTI-BRIBERY",
    code: "ISO 37001",
    photoUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop",
  },
  iso20121: {
    bgGradient: "from-teal-950 via-slate-900 to-emerald-950",
    accentColor: "#2dd4bf",
    glowColor: "#0d9488",
    badgeBg: "#0d9488",
    icon: Globe2,
    tag: "EVENT SUSTAINABILITY",
    code: "ISO 20121",
    photoUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop",
  },
  iso41001: {
    bgGradient: "from-blue-950 via-slate-900 to-slate-950",
    accentColor: "#38bdf8",
    glowColor: "#0284c7",
    badgeBg: "#0284c7",
    icon: Building,
    tag: "FACILITY MANAGEMENT",
    code: "ISO 41001",
    photoUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop",
  },
  iso30000: {
    bgGradient: "from-sky-950 via-slate-900 to-indigo-950",
    accentColor: "#38bdf8",
    glowColor: "#0369a1",
    badgeBg: "#0369a1",
    icon: Anchor,
    tag: "SHIP RECYCLING",
    code: "ISO 30000",
    photoUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&auto=format&fit=crop",
  },
  iso42001: {
    bgGradient: "from-violet-950 via-slate-900 to-purple-950",
    accentColor: "#a855f7",
    glowColor: "#7e22ce",
    badgeBg: "#7e22ce",
    icon: Cpu,
    tag: "ARTIFICIAL INTELLIGENCE",
    code: "ISO/IEC 42001",
    photoUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop",
  },
  iso37301: {
    bgGradient: "from-slate-900 via-slate-900 to-blue-950",
    accentColor: "#60a5fa",
    glowColor: "#1d4ed8",
    badgeBg: "#1d4ed8",
    icon: FileCheck2,
    tag: "COMPLIANCE MANAGEMENT",
    code: "ISO 37301",
    photoUrl: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=600&auto=format&fit=crop",
  },
  iso18788: {
    bgGradient: "from-zinc-950 via-slate-900 to-slate-950",
    accentColor: "#94a3b8",
    glowColor: "#334155",
    badgeBg: "#334155",
    icon: ShieldAlert,
    tag: "PRIVATE SECURITY",
    code: "ISO 18788",
    photoUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop",
  },
};

export default function SchemeCardImage({ slug, title, image }: SchemeImageProps) {
  const [imgError, setImgError] = React.useState(false);

  const config = (SCHEME_CONFIGS[slug] ?? SCHEME_CONFIGS.iso9001)!;
  const Icon = config.icon;

  if (image && !imgError) {
    return (
      <div className="relative h-44 w-full overflow-hidden bg-slate-900 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span
            className="rounded px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm"
            style={{ backgroundColor: config.badgeBg }}
          >
            {config.code}
          </span>
          <div className="flex size-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white">
            <Icon className="size-4" />
          </div>
        </div>
      </div>
    );
  }

  // High resolution visual SVG Artwork render fallback guaranteed to display
  return (
    <div
      className={`relative h-44 w-full overflow-hidden bg-gradient-to-br ${config.bgGradient} p-4 flex flex-col justify-between group`}
    >
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      {/* Glow Blur Effect */}
      <div
        className="absolute -right-10 -top-10 size-36 rounded-full opacity-30 blur-2xl transition-all duration-500 group-hover:scale-125"
        style={{ backgroundColor: config.glowColor }}
      />

      {/* Top Row Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <span
          className="rounded px-2.5 py-1 text-[10px] font-extrabold tracking-widest text-white shadow"
          style={{ backgroundColor: config.badgeBg }}
        >
          {config.tag}
        </span>
        <span className="text-[11px] font-bold text-slate-300 tracking-wider">
          {config.code}
        </span>
      </div>

      {/* Center Icon Illustration */}
      <div className="relative z-10 flex items-center justify-center my-auto">
        <div
          className="flex size-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300"
          style={{ color: config.accentColor }}
        >
          <Icon className="size-7 stroke-[2.2]" />
        </div>
      </div>

      {/* Bottom Title Text */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2">
        <span className="text-[11px] font-semibold text-slate-300 line-clamp-1">
          {title}
        </span>
        <span
          className="text-[10px] font-bold uppercase tracking-wider"
          style={{ color: config.accentColor }}
        >
          SCHEME
        </span>
      </div>
    </div>
  );
}
