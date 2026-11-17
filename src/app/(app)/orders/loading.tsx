import { PageHeaderSkeleton, TableSkeleton } from "@/components/shared/skeleton"

export default function OrdersLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="h-28 animate-pulse rounded-xl bg-muted" />
      <TableSkeleton rows={6} />
    </div>
  )
}
