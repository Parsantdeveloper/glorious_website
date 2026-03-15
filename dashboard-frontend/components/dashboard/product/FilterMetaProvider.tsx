"use client"

import { useEffect } from "react"
import { useFilterMetaStore } from "@/app/store/filterMetaStore"

 interface FilterMetaProviderProps {
    
    data:{
        categories: Cateogry[]|null
    brands: Brand[]|null
    }
    children: React.ReactNode
 }
 interface Cateogry{
    id:string , 
    name:string
    slug:string
 }
 interface Brand{
    id:string , 
    name:string
    slug:string
 }

export default function FilterMetaProvider({ data, children }: FilterMetaProviderProps) {
  const setCategories = useFilterMetaStore((s) => s.setCategories)
  const setBrands = useFilterMetaStore((s) => s.setBrands)

  useEffect(() => {
    setCategories(data.categories||[])
    setBrands(data.brands||[])
  }, [data])

  return children
}