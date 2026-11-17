import { PageHeaderSkeleton, TableSkeleton } from "@/components/shared/skeleton"

export default function CustomersLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <TableSkeleton rows={7} />
    </div>
  )
}
