import CategoryCarousel from "../client/category-carousel"

export default async  function CategoryCarouselSSR() {
    let data=[] ; 
    try {
        let res:any = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
        })
        res = await res.json()
        data=res.data;
        console.log("Fetched categories:", data)
    } catch (error) {
        console.error("Error fetching categories:", error)
    }
    return(
       <div>
        <CategoryCarousel data={data} />
       </div>
    )
}