"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const slides = [
  { src: "/images/uasl/slide-1.jpg", alt: "UASL assessment and certification services" },
  { src: "/images/uasl/slide-2.jpg", alt: "Management system assessment in the workplace" },
  { src: "/images/uasl/slide-3.jpg", alt: "Industrial inspection and quality assurance" },
  { src: "/images/uasl/slide-4.jpg", alt: "Professional conformity assessment" },
];
export function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const slide = slides[active] ?? slides[0]!;
  useEffect(() => {
    if (paused || hovered || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive(i => (i + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [paused, hovered]);
  function move(direction: number) { setPaused(true); setActive(i => (i + direction + slides.length) % slides.length); }
  return <section className="reference-container reference-hero" aria-label="UASL services">
    <div className="reference-hero-copy">
      <p className="reference-eyebrow">UNITED ASSESSMENT SERVICES LIMITED</p>
      <h1>Confidence in every assessment.</h1>
      <p>Independent accreditation for certification, inspection and conformity assessment bodies worldwide.</p>
      <div className="reference-hero-actions"><a href="/apply">Start an application</a><a href="/certifiedorganization">Verify an organisation <span>↗</span></a></div>
    </div>
    <div className="reference-slider" aria-roledescription="carousel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setPaused(true)}>
      <Image src={slide.src} alt={slide.alt} width={900} height={244} priority sizes="(max-width: 767px) 92vw, 1100px" />
      <button className="slider-arrow slider-previous" aria-label="Previous slide" onClick={() => move(-1)}><ChevronLeft /></button>
      <button className="slider-arrow slider-next" aria-label="Next slide" onClick={() => move(1)}><ChevronRight /></button>
      <div className="slider-controls">
        {slides.map((slide, i) => <button key={slide.src} aria-label={`Show slide ${i + 1}`} aria-pressed={active === i} onClick={() => { setActive(i); setPaused(true); }} className={active === i ? "active" : ""} />)}
        <button className="slider-pause" aria-label={paused ? "Play slideshow" : "Pause slideshow"} onClick={() => setPaused(value => !value)}>{paused ? <Play size={12} /> : <Pause size={12} />}</button>
      </div>
    </div>
  </section>;
}
