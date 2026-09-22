"use client";

import * as React from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { addLocationAction } from "@/lib/portal/cab-info-actions";
import type { LocationEntry } from "@/lib/portal/cab-info-data";

const LOCATION_TYPE_LABEL: Record<LocationEntry["locationType"], string> = {
  HEAD_OFFICE: "Key Location (Head Office)",
  KEY_LOCATION: "Key Location",
  OTHER: "Others",
};

const EMPTY_FORM = { contactPerson: "", mobile: "", address: "", city: "", state: "", country: "", postalCode: "", locationType: "OTHER" as const };

function CabLocations({ organisationName, locations }: { organisationName: string; locations: LocationEntry[] }) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState(EMPTY_FORM);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleAdd() {
    setSaving(true);
    const result = await addLocationAction(form);
    setSaving(false);
    if (result.ok) {
      toast({ tone: "success", title: "Location added." });
      setForm(EMPTY_FORM);
      setOpen(false);
    } else {
      toast({ tone: "error", title: result.error ?? "Couldn't add location.", persistent: true });
    }
  }

  const columns: DataTableColumn<LocationEntry>[] = [
    { key: "cabName", header: "CAB Name", render: () => organisationName },
    { key: "contactPerson", header: "Contact Person", render: (l) => l.contactPerson ?? "—" },
    { key: "mobile", header: "Mobile No.", mono: true, render: (l) => l.mobile ?? "—" },
    { key: "address", header: "Address", render: (l) => l.address },
    { key: "city", header: "City", render: (l) => l.city ?? "—" },
    { key: "state", header: "State", render: (l) => l.state ?? "—" },
    { key: "country", header: "Country", render: (l) => l.country ?? "—" },
    { key: "postalCode", header: "Postal Code", mono: true, render: (l) => l.postalCode ?? "—" },
    { key: "locationType", header: "Location Type", render: (l) => LOCATION_TYPE_LABEL[l.locationType] },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={() => setOpen(true)}>
          Add Location
        </Button>
      </div>

      {locations.length === 0 ? (
        <EmptyState title="No locations added yet." description="Add your head office and any additional locations." />
      ) : (
        <DataTable columns={columns} rows={locations} getRowKey={(l) => l.id} />
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Location"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} loading={saving} disabled={!form.address.trim()}>
              Add Location
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <FormField label="Contact person" htmlFor="loc-contact">
            <Input id="loc-contact" value={form.contactPerson} onChange={(e) => set("contactPerson", e.target.value)} />
          </FormField>
          <FormField label="Mobile no." htmlFor="loc-mobile">
            <Input id="loc-mobile" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} />
          </FormField>
          <FormField label="Address" htmlFor="loc-address" required>
            <Input id="loc-address" value={form.address} onChange={(e) => set("address", e.target.value)} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="City" htmlFor="loc-city">
              <Input id="loc-city" value={form.city} onChange={(e) => set("city", e.target.value)} />
            </FormField>
            <FormField label="State" htmlFor="loc-state">
              <Input id="loc-state" value={form.state} onChange={(e) => set("state", e.target.value)} />
            </FormField>
            <FormField label="Country" htmlFor="loc-country">
              <Input id="loc-country" value={form.country} onChange={(e) => set("country", e.target.value)} />
            </FormField>
            <FormField label="Postal code" htmlFor="loc-postal">
              <Input id="loc-postal" value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} />
            </FormField>
          </div>
          <FormField label="Location type" htmlFor="loc-type">
            <Select id="loc-type" value={form.locationType} onChange={(e) => set("locationType", e.target.value)}>
              <option value="HEAD_OFFICE">Key Location (Head Office)</option>
              <option value="KEY_LOCATION">Key Location</option>
              <option value="OTHER">Others</option>
            </Select>
          </FormField>
        </div>
      </Modal>
    </div>
  );
}

export { CabLocations };
