import FilterMetaProvider  from '@/components/dashboard/product/FilterMetaProvider'
export default async function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/product/filters/meta`,
    { cache: "force-cache" }
  )

  const filtersMeta = await response.json()

  return (
    <FilterMetaProvider data={filtersMeta.data}>
      {children}
    </FilterMetaProvider>
  )
}