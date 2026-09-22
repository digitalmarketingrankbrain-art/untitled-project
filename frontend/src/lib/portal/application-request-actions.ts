"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { BackendUnavailableError } from "@/lib/rpc-client";
import { notifyAllAdmins } from "@/lib/notify-admins";
import {
  submitApplicationRequest,
  approveApplicationRequest,
  rejectApplicationRequest,
  type ApplicationRequestInput,
  type ReviewResult,
} from "./application-requests-data";

const UNAVAILABLE = "We can't reach our servers right now. Please try again in a few minutes.";

/** Public: the Application Request Form on /apply. No login required, so it's rate-limited per IP. */
export async function submitApplicationRequestAction(
  input: ApplicationRequestInput,
): Promise<{ ok: true; referenceId: string } | { ok: false; error: string }> {
  try {
    const ip = await getClientIp();
    if (!checkRateLimit(`application-request:${ip}`, 5, 60 * 60 * 1000).allowed) {
      return { ok: false, error: "Too many submissions from this network. Please try again later." };
    }
    const result = await submitApplicationRequest(input);
    if (result.ok) {
      // The request is already saved at this point — a notify failure shouldn't make a
      // successful submission look like it failed to the applicant.
      notifyAllAdmins({ type: "applicationrequest.submitted", relatedType: "ApplicationRequest", relatedId: result.id }).catch(
        (notifyErr) => console.error("[submitApplicationRequestAction] notifyAllAdmins failed", notifyErr),
      );
    }
    return result;
  } catch (err) {
    console.error("[submitApplicationRequestAction]", err);
    if (err instanceof BackendUnavailableError) return { ok: false, error: UNAVAILABLE };
    return { ok: false, error: "Something went wrong submitting your request. Please try again." };
  }
}

async function requireAdminUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Not authorised.");
  return session.user.id;
}

export async function approveApplicationRequestAction(id: string): Promise<ReviewResult> {
  try {
    const result = await approveApplicationRequest(await requireAdminUserId(), id);
    revalidatePath("/admin/application-requests");
    return result;
  } catch (err) {
    console.error("[approveApplicationRequestAction]", err);
    return { ok: false, error: err instanceof BackendUnavailableError ? UNAVAILABLE : "Could not approve this request." };
  }
}

export async function rejectApplicationRequestAction(id: string, reason: string): Promise<ReviewResult> {
  try {
    const result = await rejectApplicationRequest(await requireAdminUserId(), id, reason);
    revalidatePath("/admin/application-requests");
    return result;
  } catch (err) {
    console.error("[rejectApplicationRequestAction]", err);
    return { ok: false, error: err instanceof BackendUnavailableError ? UNAVAILABLE : "Could not reject this request." };
  }
}
