export default function About() {
  return (
    <div className="flex flex-col w-full">
      <section className="max-w-5xl mx-auto px-gutter pt-space-2xl pb-space-xl text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-space-xs px-space-md py-space-2xs rounded-full bg-surface-container-low shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          <span className="font-mono-metric text-mono-metric tracking-wider uppercase text-primary font-semibold">The Local-First Metasearch Architecture</span>
        </div>
        <h1 className="mt-space-lg font-display text-display text-on-surface max-w-3xl tracking-tight leading-tight">
          Reclaiming the Web Through <span className="text-primary font-bold">Local-First</span> Discovery
        </h1>
        <p className="mt-space-md font-body-lg text-body-lg text-on-surface-variant max-w-2xl text-center leading-relaxed">
          PrivSearch is a modern, self-hosted metasearch daemon designed to eliminate telemetry, behavioral profiling, and algorithmic curation bubbles from your everyday information retrieval.
        </p>

        <div className="mt-space-xl grid grid-cols-2 md:grid-cols-4 gap-space-md w-full max-w-3xl">
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col items-center justify-center">
            <span className="font-mono-code text-headline-sm text-primary font-bold">0 ms</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-space-2xs">Logging Latency</span>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col items-center justify-center">
            <span className="font-mono-code text-headline-sm text-on-surface font-bold">70+</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-space-2xs">Dispatched Engines</span>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col items-center justify-center">
            <span className="font-mono-code text-headline-sm text-primary font-bold">100%</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-space-2xs">Client Sandbox</span>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col items-center justify-center">
            <span className="font-mono-code text-headline-sm text-on-surface font-bold">AGPLv3</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-space-2xs">Copyleft License</span>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-gutter py-space-xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between transition-all duration-150 hover:shadow-md">
            <div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-space-md">
                <span className="material-symbols-outlined text-[24px]">hub</span>
              </div>
              <span className="font-mono-metric text-mono-metric text-primary font-medium">PILLAR 01 // DAEMON</span>
              <h3 className="font-headline-md text-headline-md text-on-surface mt-space-xs">What is PrivSearch?</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
                An autonomous metasearch proxy running strictly on your local host (e.g. <code className="bg-surface-container-low text-primary px-space-2xs py-0.5 rounded font-mono-metric text-mono-metric">127.0.0.1</code>) or private homelab server.
              </p>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between transition-all duration-150 hover:shadow-md">
            <div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-space-md">
                <span className="material-symbols-outlined text-[24px]">dataset</span>
              </div>
              <span className="font-mono-metric text-mono-metric text-primary font-medium">PILLAR 02 // ENGINE</span>
              <h3 className="font-headline-md text-headline-md text-on-surface mt-space-xs">SearXNG-Powered Core</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
                Built on top of the battle-tested, open-source SearXNG routing core. It queries over 70 decentralized engines simultaneously, scrubbing tracking parameters.
              </p>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between transition-all duration-150 hover:shadow-md">
            <div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary mb-space-md">
                <span className="material-symbols-outlined text-[24px]">terminal</span>
              </div>
              <span className="font-mono-metric text-mono-metric text-primary font-medium">PILLAR 03 // PERSISTENCE</span>
              <h3 className="font-headline-md text-headline-md text-on-surface mt-space-xs">Local-First By Design</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
                No remote relational databases, no user authentication barriers, and zero analytics beacons. Configuration tokens reside purely within your client browser's IndexedDB.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
