export default function Privacy() {
  return (
    <div className="flex flex-col w-full">
      <section className="max-w-6xl mx-auto px-gutter pt-space-xl pb-space-2xl flex flex-col items-center text-center">
        <div className="relative mb-space-base flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-surface-container-low shadow-sm flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
          </div>
        </div>
        <h1 className="font-display text-display text-on-surface tracking-tight max-w-2xl font-bold">
          Our Privacy Architecture
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-sm max-w-xl">
          We don't ask you to trust our promises. We invite you to verify our code. Every transaction runs locally, scrubs outbound footprints, and drops memory on complete.
        </p>

        <div className="mt-space-lg w-full max-w-3xl bg-surface-container-lowest shadow-sm rounded-xl p-space-sm flex flex-col sm:flex-row items-center justify-between gap-space-sm text-left">
          <div className="flex items-center gap-space-sm px-space-sm py-space-xs w-full sm:w-auto">
            <span className="material-symbols-outlined text-primary text-[20px]">sanitizer</span>
            <div>
              <div className="font-label-sm text-label-sm uppercase text-secondary">Audit Status</div>
              <div className="font-mono-metric text-mono-metric font-semibold text-on-surface">100% Client-Scrubbed</div>
            </div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-surface-container-high"></div>
          <div className="flex items-center gap-space-sm px-space-sm py-space-xs w-full sm:w-auto">
            <span className="material-symbols-outlined text-primary text-[20px]">sensors_off</span>
            <div>
              <div className="font-label-sm text-label-sm uppercase text-secondary">Upstream Telemetry</div>
              <div className="font-mono-metric text-mono-metric font-semibold text-primary">ZERO (Disabled)</div>
            </div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-surface-container-high"></div>
          <div className="flex items-center gap-space-sm px-space-sm py-space-xs w-full sm:w-auto">
            <span className="material-symbols-outlined text-primary text-[20px]">memory</span>
            <div>
              <div className="font-label-sm text-label-sm uppercase text-secondary">State Persistence</div>
              <div className="font-mono-metric text-mono-metric font-semibold text-on-surface">RAM Ephemeral / No DB</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-gutter py-space-xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-base">
          <div className="bg-surface-container-lowest p-space-base rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-mono-metric text-mono-metric text-primary bg-surface-container-low px-space-xs py-space-2xs rounded">SPEC-001</span>
                <span className="material-symbols-outlined text-primary text-[24px]">no_accounts</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Local Execution & Zero Accounts</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
                PrivSearch requires no registration, generates no session tokens, and maintains no database schema.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-base rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-mono-metric text-mono-metric text-primary bg-surface-container-low px-space-xs py-space-2xs rounded">SPEC-002</span>
                <span className="material-symbols-outlined text-primary text-[24px]">delete_sweep</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Ephemeral Processing</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
                Query strings are held exclusively in process volatile RAM.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-base rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-mono-metric text-mono-metric text-primary bg-surface-container-low px-space-xs py-space-2xs rounded">SPEC-003</span>
                <span className="material-symbols-outlined text-primary text-[24px]">filter_alt</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Outbound Header Stripping</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
                The instance aggressively strips User-Agent, Referer, and Cookies. Upstream engines see only generic requests.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
