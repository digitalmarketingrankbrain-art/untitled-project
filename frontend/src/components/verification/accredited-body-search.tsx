"use client";

import React, { useState } from "react";
import { ExternalLink } from "lucide-react";
import { CertificateModal, type CertificateData } from "./certificate-modal";

export interface AccreditedBodyRecord {
  id: string;
  cabName: string;
  address: string;
  contactPerson: string;
  status: "Valid" | "Suspended" | "Withdrawn";
  country: string;
  accreditationNumber: string;
  scope: string;
  issueDate: string;
  expiryDate: string;
}

const ACCREDITED_BODIES_MOCK: AccreditedBodyRecord[] = [
  {
    id: "1",
    cabName: "Quality Control Certification (QC)",
    address: "2060, 2nd Floor, Aman Market, RKBM House, Narela Mandi, Delhi-110 040, India",
    contactPerson: "Sh. R. K. Verma",
    status: "Valid",
    country: "India",
    accreditationNumber: "SAAF-CAB-IN-9001",
    scope: "Quality Management Systems (ISO 9001:2015), Environmental Management Systems (ISO 14001:2015)",
    issueDate: "15-Jan-2022",
    expiryDate: "14-Jan-2027",
  },
  {
    id: "2",
    cabName: "A CUBE TIC LIMITED TRADING AS ACT & A CUBE",
    address: "Suite 405, Apex Tower, Business Bay, Dubai, United Arab Emirates",
    contactPerson: "Mr. Ahmad Al-Maktoum",
    status: "Valid",
    country: "United Arab Emirates",
    accreditationNumber: "SAAF-CAB-UAE-17020",
    scope: "Inspection Bodies (ISO/IEC 17020:2012) - Industrial Engineering & Pressure Equipment Inspection",
    issueDate: "10-Mar-2021",
    expiryDate: "09-Mar-2026",
  },
  {
    id: "3",
    cabName: "A-MARK RATINGS PRIVATE LIMITED",
    address: "Plot 42, Sector 18, Commercial Complex, Gurugram, Haryana-122015, India",
    contactPerson: "Ms. Sunita Sharma",
    status: "Valid",
    country: "India",
    accreditationNumber: "SAAF-CAB-IN-27001",
    scope: "Information Security Management Systems (ISO/IEC 27001:2022)",
    issueDate: "01-Jun-2023",
    expiryDate: "31-May-2028",
  },
  {
    id: "4",
    cabName: "ABSOLUTE QUALITY CERTIFICATION PRIVATE LIMITED",
    address: "Building 12, Tech Park Avenue, Bengaluru, Karnataka-560100, India",
    contactPerson: "Mr. Rajesh Kumar",
    status: "Valid",
    country: "India",
    accreditationNumber: "SAAF-CAB-IN-22000",
    scope: "Food Safety Management Systems (ISO 22000:2018)",
    issueDate: "18-Sep-2020",
    expiryDate: "17-Sep-2025",
  },
  {
    id: "5",
    cabName: "ACCREDIFY GLOBAL LLC",
    address: "1209 Orange Street, Wilmington, DE 19801, United States",
    contactPerson: "John H. Miller",
    status: "Valid",
    country: "United States",
    accreditationNumber: "SAAF-CAB-US-17024",
    scope: "Personnel Certification Bodies (ISO/IEC 17024:2012) - Lead Auditors & Quality Inspectors",
    issueDate: "05-Nov-2022",
    expiryDate: "04-Nov-2027",
  },
];

export function AccreditedBodySearch() {
  const [searchName, setSearchName] = useState("qcc");
  const [searchCountry, setSearchCountry] = useState("India");
  const [hasSearched, setHasSearched] = useState(true);
  const [results, setResults] = useState<AccreditedBodyRecord[]>(ACCREDITED_BODIES_MOCK);
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const query = searchName.trim().toLowerCase();
    const countryQuery = searchCountry.trim().toLowerCase();

    const filtered = ACCREDITED_BODIES_MOCK.filter((item) => {
      const matchName = !query || item.cabName.toLowerCase().includes(query) || item.accreditationNumber.toLowerCase().includes(query);
      const matchCountry = !countryQuery || countryQuery === "all" || item.country.toLowerCase() === countryQuery;
      return matchName && matchCountry;
    });

    setResults(filtered);
  };

  const handleViewCert = (item: AccreditedBodyRecord) => {
    setSelectedCert({
      title: item.cabName,
      cabName: item.cabName,
      accreditationNumber: item.accreditationNumber,
      address: item.address,
      contactPerson: item.contactPerson,
      scope: item.scope,
      issueDate: item.issueDate,
      expiryDate: item.expiryDate,
      status: item.status,
      type: "CAB",
    });
  };

  return (
    <div className="space-y-8">
      {/* Search Container */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
          Accredited Body
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
          If you wish to check out the name of an Accredited Body to verify the accreditation criteria (Management System Standard / Product Certification / Personal Certification / Rating ), You may search as below:
        </p>

        {/* Stacked Table Search Form Matching Screenshot 2 */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs">
            <div className="bg-slate-50/70 px-4 py-2.5 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-700">Search data like</span>
            </div>

            <div className="divide-y divide-slate-200">
              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center p-3 gap-2 sm:gap-4">
                <label className="sm:col-span-3 text-xs font-medium text-slate-700 px-2">
                  Name
                </label>
                <div className="sm:col-span-9">
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Enter CAB Name or keyword..."
                    className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Country Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center p-3 gap-2 sm:gap-4">
                <label className="sm:col-span-3 text-xs font-medium text-slate-700 px-2">
                  Country
                </label>
                <div className="sm:col-span-9">
                  <select
                    value={searchCountry}
                    onChange={(e) => setSearchCountry(e.target.value)}
                    className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="all">All Countries</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Nepal">Nepal</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button Matching Screenshot 2 */}
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded bg-[#006699] px-6 py-2 text-xs font-bold text-white shadow hover:bg-[#005580] transition-colors"
          >
            submit
          </button>
        </form>
      </div>

      {/* Results Table Section Matching Screenshot 1 */}
      {hasSearched && (
        <div className="space-y-3 pt-4">
          <h3 className="text-base font-bold text-slate-900">
            Accredited Body Results
          </h3>

          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-blue-900 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 sm:px-6 w-1/4 border-r border-slate-200 text-[#006699]">CAB NAME</th>
                  <th className="py-3 px-4 sm:px-6 w-2/5 border-r border-slate-200 text-[#006699]">ADDRESS</th>
                  <th className="py-3 px-4 sm:px-6 w-1/6 border-r border-slate-200 text-[#006699]">CONTACT PERSON</th>
                  <th className="py-3 px-4 sm:px-6 border-r border-slate-200 text-[#006699]">STATUS</th>
                  <th className="py-3 px-4 sm:px-6 text-[#006699]">VIEW CERTIFICATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {results.length > 0 ? (
                  results.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-medium text-slate-800 border-r border-slate-100 align-top">
                        {item.cabName}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-600 border-r border-slate-100 align-top leading-relaxed">
                        {item.address}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-800 font-medium border-r border-slate-100 align-top">
                        {item.contactPerson}
                      </td>
                      <td className="py-4 px-4 sm:px-6 border-r border-slate-100 align-top">
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 align-top">
                        <button
                          onClick={() => handleViewCert(item)}
                          className="font-semibold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                        >
                          <span>Click Me</span>
                          <ExternalLink className="size-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-slate-500">
                      No Accredited Body matching your search criteria was found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        data={selectedCert}
      />
    </div>
  );
}
