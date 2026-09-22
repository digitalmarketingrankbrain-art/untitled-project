"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CabBasicDetailsForm } from "./cab-basic-details-form";
import { CabLocations } from "./cab-locations";
import { CountryPicker } from "./country-picker";
import { countryName } from "@/lib/countries";
import type { CabDetails, LocationEntry } from "@/lib/portal/cab-info-data";

const SUB_TABS = ["Basic Details", "Location", "Applied Countries", "Approved Countries"] as const;
type SubTab = (typeof SUB_TABS)[number];

function CabInfoTabs({
  details,
  locations,
  appliedCountries,
  approvedCountries,
}: {
  details: CabDetails;
  locations: LocationEntry[];
  appliedCountries: string[];
  approvedCountries: string[];
}) {
  const [tab, setTab] = React.useState<SubTab>("Basic Details");

  return (
    <div>
      <div role="tablist" className="mb-6 flex flex-wrap gap-1 rounded-lg bg-background-portal p-1">
        {SUB_TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-[6px] px-3 py-1.5 font-sans text-sm font-medium transition-colors",
              tab === t ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Basic Details" && <CabBasicDetailsForm details={details} />}
      {tab === "Location" && <CabLocations organisationName={details.displayName} locations={locations} />}
      {tab === "Applied Countries" && <CountryPicker initialSelected={appliedCountries} />}
      {tab === "Approved Countries" && (
        <div>
          {approvedCountries.length === 0 ? (
            <p className="font-sans text-sm text-text-muted">No Approved Countries</p>
          ) : (
            <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
              {approvedCountries.map((code) => (
                <li key={code} className="rounded-[6px] px-2 py-1.5 font-sans text-sm text-text">
                  {countryName(code)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export { CabInfoTabs };
