import CategoryPageClient from '@/components/admin/categories/category-client'

export default async  function Page() {
   
    let data = [];
    try {
      let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      let json = await res.json();
      data=json.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
    }

  return <CategoryPageClient initialCategories={data} />
}
