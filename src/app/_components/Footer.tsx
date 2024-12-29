import React from "react";

const Footer = () => {
  return (
    <footer className="max-w-container mx-auto w-full px-4 sm:px-6 lg:px-8">
      <div className="border-t border-slate-900/5 py-10">
        <div className="flex w-full items-center justify-center">
          <img className="mr-2 h-5 w-auto text-slate-900" src="/logo.svg" />
          <p className="font-bold">Codex</p>
        </div>
        <p className="mt-5 text-center text-sm leading-6 text-slate-500">
          © 2024 Codex Labs Inc. All rights reserved.
        </p>
        <div className="mt-8 flex items-center justify-center space-x-4 text-sm font-semibold leading-6 text-slate-700">
          <a href="/privacy-policy">Privacy policy</a>
          <div className="h-4 w-px bg-slate-500/20"></div>
          <a href="/changelog">Changelog</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
