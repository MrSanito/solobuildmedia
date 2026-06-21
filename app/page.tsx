"use client"


import React from "react";
import Image from "next/image";

import {
  FileText,
  PenSquare,
  LayoutGrid,
  PlayCircle,
  Image as ImageIcon,
  PersonStanding,
  AudioWaveform,
  Users,
  RotateCw,
  Flag,

  AlertTriangle,
  ChevronRight,
  Play,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

/* ----------------------------- Types ----------------------------- */

type StepStatus = "Complete" | "In Progress" | "Waiting";

interface PipelineStep {
  num: number;
  label: string;
  status: StepStatus;
  icon: React.ElementType;
}

type RowTone = "green" | "red" | "blue" | "gray" | "yellow";

interface ClientDataRow {
  item: string;
  requestedOn: string;
  status: string;
  tone: RowTone;
}

interface ApprovalRow {
  deliverable: string;
  sentOn: string;
  status: string;
  tone: RowTone;
}

interface RevisionRow {
  id: string;
  deliverable: string;
  raisedBy: string;
  status: string;
  tone: RowTone;
}

interface Deliverable {
  name: string;
  kind: "pdf" | "ai" | "mp4";
}

/* ----------------------------- Data ----------------------------- */

const PIPELINE_STEPS: PipelineStep[] = [
  { num: 1, label: "Brief", status: "Complete", icon: FileText },
  { num: 2, label: "Script", status: "Complete", icon: PenSquare },
  { num: 3, label: "Storyboard", status: "In Progress", icon: LayoutGrid },
  { num: 4, label: "Animatic", status: "Waiting", icon: PlayCircle },
  { num: 5, label: "Asset Design", status: "Waiting", icon: ImageIcon },
  { num: 6, label: "Animation", status: "Waiting", icon: PersonStanding },
  { num: 7, label: "Sound Design", status: "Waiting", icon: AudioWaveform },
  { num: 8, label: "Client Review", status: "Waiting", icon: Users },
  { num: 9, label: "Revisions", status: "Waiting", icon: RotateCw },
  { num: 10, label: "Final Delivery", status: "Waiting", icon: Flag },
];

const CLIENT_DATA: ClientDataRow[] = [
  { item: "Logo Files", requestedOn: "15 Jun 2024", status: "Received", tone: "green" },
  { item: "Brand Guidelines", requestedOn: "15 Jun 2024", status: "Pending", tone: "red" },
  { item: "Product Images", requestedOn: "16 Jun 2024", status: "Pending", tone: "red" },
  { item: "Voice Reference", requestedOn: "16 Jun 2024", status: "Received", tone: "green" },
  { item: "Target Audience Info", requestedOn: "17 Jun 2024", status: "Received", tone: "green" },
];

const APPROVALS: ApprovalRow[] = [
  { deliverable: "Script V1", sentOn: "15 Jun 2024", status: "Approved", tone: "green" },
  { deliverable: "Storyboard V1", sentOn: "-", status: "Not Sent", tone: "gray" },
  { deliverable: "Animatic V1", sentOn: "-", status: "Not Sent", tone: "gray" },
  { deliverable: "Character Design V1", sentOn: "-", status: "Not Sent", tone: "gray" },
  { deliverable: "Final Animation V1", sentOn: "-", status: "Not Sent", tone: "gray" },
];

const DELIVERABLES: Deliverable[] = [
  { name: "Brief.pdf", kind: "pdf" },
  { name: "Script_v1.pdf", kind: "pdf" },
  { name: "Storyboard_v1.pdf", kind: "pdf" },
  { name: "Character_Sheet.ai", kind: "ai" },
  { name: "Animatic_v1.mp4", kind: "mp4" },
  { name: "Final_Render.mp4", kind: "mp4" },
];

const REVISIONS: RevisionRow[] = [
  { id: "REV-001", deliverable: "Script", raisedBy: "Client", status: "Complete", tone: "green" },
  { id: "REV-002", deliverable: "Storyboard", raisedBy: "Client", status: "Open", tone: "yellow" },
  { id: "REV-003", deliverable: "Animatic", raisedBy: "Client", status: "Not Started", tone: "gray" },
];

const BLOCKERS: string[] = [
  "Waiting for brand guidelines.",
  "Waiting for product images.",
];

/* ----------------------------- Helpers ----------------------------- */

const TONE_BADGE: Record<RowTone, string> = {
  green: "bg-emerald-500/10 text-emerald-400",
  red: "bg-red-500/10 text-red-400",
  blue: "bg-blue-500/10 text-blue-400",
  gray: "bg-white/10 text-white/50",
  yellow: "bg-amber-500/10 text-amber-400",
};

function StatusBadge({ tone, children }: { tone: RowTone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-block rounded-md px-2.5 py-1 text-xs font-medium ${TONE_BADGE[tone]}`}
    >
      {children}
    </span>
  );
}

function SectionCard({
  title,
  rightSlot,
  children,
  className = "",
}: {
  title: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-wide text-white">{title}</h2>
        {rightSlot}
      </div>
      {children}
    </div>
  );
}

function Table({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b border-white/10 bg-white/5">
          {headers.map((h) => (
            <th
              key={h}
              className="px-3 py-2 text-xs font-semibold text-white/40"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

function DeliverableIcon({ kind }: { kind: Deliverable["kind"] }) {
  if (kind === "pdf") {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-red-500">
        <FileText className="h-5 w-5 text-white" />
      </div>
    );
  }
  if (kind === "ai") {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-orange-500">
        <span className="text-xs font-bold text-white">Ai</span>
      </div>
    );
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-indigo-700">
      <Play className="h-4 w-4 fill-white text-white" />
    </div>
  );
}

/* ----------------------------- Pipeline Step ----------------------------- */

function PipelineStepView({ step, isLast }: { step: PipelineStep; isLast: boolean }) {
  const Icon = step.icon;

  const ring =
    step.status === "Complete"
      ? "border-emerald-500 text-emerald-400"
      : step.status === "In Progress"
      ? "border-blue-500 text-blue-400"
      : "border-white/20 text-white/30";

  const circleBg =
    step.status === "Complete"
      ? "bg-emerald-500/10"
      : step.status === "In Progress"
      ? "bg-blue-500/10"
      : "bg-white/5";

  const numberStyle =
    step.status === "Complete"
      ? "border-emerald-500 text-emerald-400"
      : step.status === "In Progress"
      ? "border-blue-500 text-blue-400"
      : "border-white/20 text-white/30";

  const labelStyle =
    step.status === "In Progress" ? "text-blue-400" : "text-white";

  const badgeTone: RowTone =
    step.status === "Complete" ? "green" : step.status === "In Progress" ? "blue" : "gray";

  return (
    <div className="flex flex-1 items-center">
      <div className="flex flex-1 flex-col items-center gap-2 px-1">
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold ${numberStyle}`}
        >
          {step.num}
        </span>
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full border-2 ${ring} ${circleBg}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <span className={`text-sm font-semibold ${labelStyle}`}>{step.label}</span>
        <StatusBadge tone={badgeTone}>{step.status}</StatusBadge>
      </div>
      {!isLast && (
        <ChevronRight className="mx-1 h-4 w-4 flex-shrink-0 text-white/20" />
      )}
    </div>
  );
}

/* ----------------------------- Main Component ----------------------------- */

export default function ProductionDashboard() {
  // const { user, isLoading, logout } = useAuth();
  // const router = useRouter();

  // React.useEffect(() => {
  //   if (!isLoading && !user) {
  //     router.push("/login");
  //   }
  // }, [user, isLoading, router]);

  // if (isLoading || !user) {
  //   return (
  //     <div className="min-h-screen w-full flex items-center justify-center bg-slate-950">
  //       <div className="text-white/50 animate-pulse">Loading dashboard...</div>
  //     </div>
  //   );
  // }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Slate-950 base */}
      <div className="absolute inset-0 bg-slate-950" />
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />

      <div className="relative z-10 mx-auto flex max-w-[1550px] flex-col gap-5 p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-8 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm px-6 py-5">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="SoloBuild Media"
              width={180}
              height={180}
              className="h-20 w-auto object-contain"
              priority
            />
          </div>

          <div className="h-10 w-px bg-white/10" />

          <div>
            <p className="text-sm text-white/80">
              <span className="font-semibold">Project: </span>
              <span className="font-bold text-violet-400">The Reaper's Dreamwalk</span>
            </p>
          </div>

          <div className="h-10 w-px bg-white/10" />

          <div>
            <p className="text-sm text-white/80">
              <span className="font-semibold">Client: </span>ABC Studios
            </p>
          </div>

          <div className="h-10 w-px bg-white/10" />

          <div>
            <p className="text-sm text-white/80">
              <span className="font-semibold">Start Date: </span>12 Jun 2024
            </p>
          </div>

          <div className="h-10 w-px bg-white/10" />

          <div>
            <p className="text-sm text-white/80">
              <span className="font-semibold">Delivery Date: </span>28 Jul 2024
            </p>
          </div>

          <div className="h-10 w-px bg-white/10" />

          <div>
            <p className="text-sm text-white/80">
              <span className="font-semibold">Current Milestone: </span>
              <span className="font-bold text-violet-400">Storyboard</span>
            </p>
          </div>

          {/* <div className="ml-auto">
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div> */}
        </div>

        {/* Production Pipeline */}
        <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-5">
          <h2 className="mb-5 text-sm font-bold tracking-wide text-white">
            PRODUCTION PIPELINE
          </h2>
          <div className="flex items-start">
            {PIPELINE_STEPS.map((step, i) => (
              <PipelineStepView
                key={step.num}
                step={step}
                isLast={i === PIPELINE_STEPS.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Three column row */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Client Data Pending */}
          <SectionCard
            title="CLIENT DATA PENDING"
            rightSlot={<StatusBadge tone="red">2 Pending Items</StatusBadge>}
          >
            <Table headers={["Item Required", "Requested On", "Status"]}>
              {CLIENT_DATA.map((row) => (
                <tr key={row.item} className="border-b border-white/5 last:border-0">
                  <td className="px-3 py-3 text-sm text-white">{row.item}</td>
                  <td className="px-3 py-3 text-sm text-white/50">{row.requestedOn}</td>
                  <td className="px-3 py-3">
                    <StatusBadge tone={row.tone}>{row.status}</StatusBadge>
                  </td>
                </tr>
              ))}
            </Table>
          </SectionCard>

          {/* Approvals */}
          <SectionCard title="APPROVALS">
            <Table headers={["Deliverable", "Sent On", "Status"]}>
              {APPROVALS.map((row) => (
                <tr key={row.deliverable} className="border-b border-white/5 last:border-0">
                  <td className="px-3 py-3 text-sm text-white">{row.deliverable}</td>
                  <td className="px-3 py-3 text-sm text-white/50">{row.sentOn}</td>
                  <td className="px-3 py-3">
                    <StatusBadge tone={row.tone}>{row.status}</StatusBadge>
                  </td>
                </tr>
              ))}
            </Table>
          </SectionCard>

          {/* Deliverables */}
          <SectionCard title="DELIVERABLES">
            <div className="grid grid-cols-3 gap-4">
              {DELIVERABLES.map((d) => (
                <div key={d.name} className="flex flex-col gap-2">
                  <DeliverableIcon kind={d.kind} />
                  <p className="text-sm font-medium leading-tight text-white">
                    {d.name}
                  </p>
                  <p className="text-xs">
                    <a href="#" className="text-blue-400 hover:underline">
                      View
                    </a>{" "}
                    <span className="text-white/30">/</span>{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Download
                    </a>
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Bottom row: Revisions + Blockers */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SectionCard title="REVISIONS">
            <Table headers={["Revision ID", "Deliverable", "Raised By", "Status"]}>
              {REVISIONS.map((row) => (
                <tr key={row.id} className="border-b border-white/5 last:border-0">
                  <td className="px-3 py-3 text-sm text-white">{row.id}</td>
                  <td className="px-3 py-3 text-sm text-white">{row.deliverable}</td>
                  <td className="px-3 py-3 text-sm text-white/50">{row.raisedBy}</td>
                  <td className="px-3 py-3">
                    <StatusBadge tone={row.tone}>{row.status}</StatusBadge>
                  </td>
                </tr>
              ))}
            </Table>
          </SectionCard>

          <SectionCard title="BLOCKERS">
            <div className="flex items-start gap-3 rounded-lg bg-red-500/10 p-5">
              <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-red-400" />
              <ul className="list-disc space-y-1.5 pl-4 text-sm text-white/80">
                {BLOCKERS.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
