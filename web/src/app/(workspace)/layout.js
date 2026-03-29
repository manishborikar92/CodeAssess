import Script from "next/script";

export default function WorkspaceLayout({ children }) {
  return (
    <>
      {children}
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.27.3/full/pyodide.js"
        strategy="afterInteractive"
      />
    </>
  );
}
