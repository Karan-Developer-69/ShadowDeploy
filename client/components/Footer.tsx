import { GitCompare } from "lucide-react";
import React from "react";

const Footer = () : React.ReactNode => {
  return <footer className="py-12 bg-black border-t border-zinc-900 text-zinc-500 text-sm">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
         <GitCompare className="w-5 h-5" />
         <span className="font-bold text-zinc-300">ShadowDeploy</span>
      </div>
      <div className="flex gap-6">
        <a href="#" className="hover:text-white">Documentation</a>
        <a href="#" className="hover:text-white">GitHub</a>
        <a href="#" className="hover:text-white">Twitter</a>
      </div>
      <div>
        © 2024 ShadowDeploy Inc. All rights reserved.
      </div>
    </div>
  </footer>
}

export default Footer;