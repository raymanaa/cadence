import { CallsIndex } from "@/components/calls-index";
import { CALLS } from "@/lib/calls";

export default function AppHome() {
  return <CallsIndex calls={CALLS} />;
}
