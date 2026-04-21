import { notFound } from "next/navigation";
import { CallReader } from "@/components/call-reader";
import { CALLS, getCall } from "@/lib/calls";

export function generateStaticParams() {
  return CALLS.map((c) => ({ callId: c.slug }));
}

export const dynamicParams = false;

export default async function CallPage({
  params,
}: {
  params: Promise<{ callId: string }>;
}) {
  const { callId } = await params;
  const call = getCall(callId);
  if (!call) notFound();
  return <CallReader call={call} />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ callId: string }>;
}) {
  const { callId } = await params;
  const call = getCall(callId);
  if (!call) return { title: "Call · Cadence" };
  return {
    title: `${call.company} · ${call.id.toUpperCase()} · Cadence`,
    description: call.summary,
  };
}
