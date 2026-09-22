import { AdminAccreditationRecordsTable } from "@/components/portal/admin-accreditation-records-table";
import { listAccreditationRecords } from "@/lib/portal/accreditation-record-data";

export default async function AdminAccreditationRecordsPage() {
  const records = await listAccreditationRecords();
  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Accreditation Records</h1>
      <div className="mt-6">
        <AdminAccreditationRecordsTable records={records} />
      </div>
    </div>
  );
}
