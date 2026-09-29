import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const LOGO_URL = "https://media.base44.com/images/public/6887c5e144c3e560dc989c1b/162de9e10_Gemini_Generated_Image_9q32a79q32a79q32.png";

export default function CyberDojoLogo() {
  return (
    <Link
      to={createPageUrl("Portfolio")}
      className="flex-shrink-0 flex items-center gap-3 group"
      onClick={() => window.scrollTo(0, 0)}
    >
      <div className="logo-glow-wrap">
        <img
          src={LOGO_URL}
          alt="Cyber Dojo Sensei"
          className="w-11 h-11 object-contain logo-pulse"
        />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-lg font-extrabold text-primary tracking-tight">CYBER DOJO</span>
        <span className="text-[10px] font-medium text-foreground/60 tracking-[0.3em] mt-0.5">SENSEI</span>
      </div>
    </Link>
  );
}