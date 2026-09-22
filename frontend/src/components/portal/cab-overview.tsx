import { Accordion } from "@/components/ui/accordion";
import { countryName } from "@/lib/countries";
import type { CabDetails, SchemeEntry } from "@/lib/portal/cab-info-data";

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 px-3 rounded-lg hover:bg-slate-50/80 transition-colors">
      <span className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <span className="text-right font-sans text-xs sm:text-sm font-semibold text-slate-800">{value || "—"}</span>
    </div>
  );
}

function SchemesPanel({ title, schemes, emptyLabel }: { title: string; schemes: SchemeEntry[]; emptyLabel: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-3.5 flex items-center justify-between">
        <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-800">{title}</h3>
        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200/60">
          {schemes.length}
        </span>
      </div>
      <div className="p-4">
        {schemes.length === 0 ? (
          <p className="py-6 text-center font-sans text-xs text-slate-400 font-medium">{emptyLabel}</p>
        ) : (
          <Accordion
            items={schemes.map((s) => ({
              id: s.slug,
              question: s.name,
              answer: s.standardReference ?? "No standard reference on file.",
            }))}
          />
        )}
      </div>
    </div>
  );
}

function CountriesPanel({ title, codes, emptyLabel }: { title: string; codes: string[]; emptyLabel: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-3.5 flex items-center justify-between">
        <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-800">{title}</h3>
        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200/60">
          {codes.length}
        </span>
      </div>
      <div className="p-5">
        {codes.length === 0 ? (
          <p className="py-4 text-center font-sans text-xs text-slate-400 font-medium">{emptyLabel}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {codes.map(countryName).sort().map((country) => (
              <span key={country} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 border border-slate-200/80 hover:bg-slate-200/60 transition-colors">
                <span className="size-1.5 rounded-full bg-blue-600" />
                {country}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CabOverview({
  details,
  appliedSchemes,
  awardedSchemes,
  appliedCountries,
  approvedCountries,
}: {
  details: CabDetails;
  appliedSchemes: SchemeEntry[];
  awardedSchemes: SchemeEntry[];
  appliedCountries: string[];
  approvedCountries: string[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
          <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-3.5">
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-800">CAB Registration Details</h3>
          </div>
          <div className="divide-y divide-slate-100 p-3">
            <DetailRow label="Full Name" value={[details.contactFirstName, details.contactLastName].filter(Boolean).join(" ")} />
            <DetailRow label="Company Name" value={details.displayName} />
            <DetailRow label="CAB Identifier" value={<span className="font-mono font-bold text-blue-700">{details.cabNumber}</span>} />
            <DetailRow label="Short Code" value={<span className="font-mono">{details.shortCode}</span>} />
            <DetailRow label="Contact Phone" value={details.contactPhone} />
            <DetailRow
              label="Official Website"
              value={
                details.website ? (
                  <a href={details.website} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline font-medium">
                    {details.website}
                  </a>
                ) : null
              }
            />
            <DetailRow label="Country of Registry" value={details.country} />
            <DetailRow label="Head Office Address" value={[details.address, details.city, details.state, details.country].filter(Boolean).join(", ")} />
            <DetailRow label="Managing Director" value={details.director} />
            <DetailRow label="Certification Manager" value={details.certificationManager} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <SchemesPanel title="Applied Schemes & Technical Scopes" schemes={appliedSchemes} emptyLabel="No applied schemes." />
          <SchemesPanel title="Awarded Schemes & Accredited Scopes" schemes={awardedSchemes} emptyLabel="No awarded schemes on record." />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CountriesPanel title="Operating Countries (Applied)" codes={appliedCountries} emptyLabel="No applied operating countries." />
        <CountriesPanel title="Approved Operating Regions" codes={approvedCountries} emptyLabel="No approved operating regions." />
      </div>
    </div>
  );
}

export { CabOverview };
