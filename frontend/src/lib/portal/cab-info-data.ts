import { rpc } from "@/lib/rpc-client";

/** Thin proxy over backend/src/data/cab-info-data.ts — see applicant-data.ts's header comment for why. */

export interface CabDetails {
  organisationId: string;
  legalName: string;
  displayName: string;
  shortCode: string | null;
  cabNumber: string | null;
  website: string | null;
  director: string | null;
  certificationManager: string | null;
  registrationNumber: string | null;
  address: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  contactFirstName: string | null;
  contactLastName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  dateOfEstablishment: string | null;
  alreadyAccreditedElsewhere: boolean;
  alreadyAccreditedDetails: string | null;
}

export interface SchemeEntry {
  slug: string;
  name: string;
  standardReference: string | null;
}

export interface LocationEntry {
  id: string;
  contactPerson: string | null;
  mobile: string | null;
  address: string;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  locationType: "HEAD_OFFICE" | "KEY_LOCATION" | "OTHER";
}

export interface TeamMemberEntry {
  id: string;
  userId: string;
  name: string;
  email: string;
  title: string | null;
  membershipRole: "PRIMARY_CONTACT" | "MEMBER";
  status: "ACTIVE" | "SUSPENDED" | "LOCKED";
}

export interface CountryLists {
  applied: string[];
  approved: string[];
}

export interface AddTeamMemberInput {
  name: string;
  email: string;
  title: string;
  membershipRole: "PRIMARY_CONTACT" | "MEMBER";
}

const MODULE = "cab-info-data";

export function getCabDetails(userId: string): Promise<CabDetails> {
  return rpc(MODULE, "getCabDetails", [userId]);
}

export function updateCabBasicDetails(
  userId: string,
  data: Partial<Omit<CabDetails, "organisationId" | "cabNumber">>,
): Promise<void> {
  return rpc(MODULE, "updateCabBasicDetails", [userId, data]);
}

export function getAppliedSchemes(userId: string): Promise<SchemeEntry[]> {
  return rpc(MODULE, "getAppliedSchemes", [userId]);
}

export function getAwardedSchemes(userId: string): Promise<SchemeEntry[]> {
  return rpc(MODULE, "getAwardedSchemes", [userId]);
}

export function getLocations(userId: string): Promise<LocationEntry[]> {
  return rpc(MODULE, "getLocations", [userId]);
}

export function addLocation(userId: string, data: Omit<LocationEntry, "id">): Promise<void> {
  return rpc(MODULE, "addLocation", [userId, data]);
}

export function getCountryLists(userId: string): Promise<CountryLists> {
  return rpc(MODULE, "getCountryLists", [userId]);
}

export function setAppliedCountries(userId: string, countryCodes: string[]): Promise<void> {
  return rpc(MODULE, "setAppliedCountries", [userId, countryCodes]);
}

export function addTeamMember(
  requestingUserId: string,
  input: AddTeamMemberInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  return rpc(MODULE, "addTeamMember", [requestingUserId, input]);
}

export function getTeamMembers(userId: string): Promise<TeamMemberEntry[]> {
  return rpc(MODULE, "getTeamMembers", [userId]);
}

export function getPrimaryContactUserId(organisationId: string): Promise<string | null> {
  return rpc(MODULE, "getPrimaryContactUserId", [organisationId]);
}

export interface AssignedAssessorEntry {
  id: string;
  assessorName: string;
  assessorEmail: string;
  applicationReference: string;
  programName: string;
  assignmentStatus: string;
  assignedByName: string;
  assignedAt: string;
}

export function getAssignedAssessors(userId: string): Promise<AssignedAssessorEntry[]> {
  return rpc(MODULE, "getAssignedAssessors", [userId]);
}
