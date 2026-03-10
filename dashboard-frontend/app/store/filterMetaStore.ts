 import {create} from "zustand"

interface FilterMetaState {
  categories: Category[]
  brands: Brand[]
  setCategories: (categories: Category[]) => void
  setBrands: (brands: Brand[]) => void
}
export interface Category{
        id:string , 
        name:string
        slug:string
    }
  export  interface Brand{
        id:string , 
    name:string
    slug:string
 }
export const useFilterMetaStore = create<FilterMetaState>((set) => ({
  categories: [],
  brands: [],
  setCategories: (categories) => set({ categories }),
  setBrands: (brands) => set({ brands }),
}))
