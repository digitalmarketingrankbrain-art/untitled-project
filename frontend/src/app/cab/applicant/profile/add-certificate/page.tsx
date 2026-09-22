import { auth } from "@/auth";
import { getCabDetails } from "@/lib/portal/cab-info-data";
import { AddCertificateForm } from "@/components/portal/add-certificate-form";

export default async function AddCertificatePage() {
  const session = await auth();
  const userId = session!.user.id;
  const cabDetails = await getCabDetails(userId);

  return (
    <div className="px-6 py-8">
      <AddCertificateForm cabDetails={cabDetails} />
    </div>
  );
}
