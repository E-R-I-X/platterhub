import { Skeleton } from "@/components/shared/skeleton"

export default function CalendarLoading() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <div className="rounded-xl border border-border bg-white p-5">
        <Skeleton className="mb-5 h-8 w-40" />
        <Skeleton className="h-[420px] w-full rounded-xl" />
      </div>
      <div className="rounded-xl border border-border bg-white p-5">
        <Skeleton className="mb-4 h-6 w-36" />
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
