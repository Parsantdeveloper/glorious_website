import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
export default async function ProflileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    
     const data = await fetch("http://localhost:4000/api/user/me",{
        cache: "no-store", // ensures fresh data on every request
    credentials: "include", // if using cookies
    headers:await headers()
     });
     const session = await data.json();
     console.log(session)
  if(!session){
        redirect('/');
  }
  return (
   <div>
    
       {children}

    </div>   
  );
}
