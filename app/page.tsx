import { JobCard } from "./components/JobCard";
import { addJob } from "./actions";
import prisma from "@/lib/prisma";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Job } from "@prisma/client";

export default async function Home() {
  // 1. Auth Check
  const { userId } = await auth();
  if (!userId) return <div className="p-10">Sign in to view this page</div>;

  // 2. Fetch Jobs (Only for this user)
  const jobs = await prisma.job.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' }
  });

 // 2. Add ": Job" to the filter arguments
  const wishlist = jobs.filter((job: Job) => job.status === "Wishlist");
  const applied = jobs.filter((job: Job) => job.status === "Applied");
  const interview = jobs.filter((job: Job) => job.status === "Interview");

  return (
    <main className="p-8 h-screen bg-gray-50 text-gray-900">
      
      {/* --- UNIFIED HEADER --- */}
      <div className="flex justify-between items-center mb-8">
          
          {/* Left Side: User Profile + Title */}
          <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">CareerFlow</h1>
                <p className="text-gray-500 text-sm">Track your applications</p>
              </div>
          </div>
        
          {/* Right Side: Add Job Form */}
          <form action={addJob} className="flex gap-2">
            <input name="title" placeholder="Job Title" className="border p-2 rounded text-black text-sm" required />
            <input name="company" placeholder="Company" className="border p-2 rounded text-black text-sm" required />
            <input name="location" value="Remote" type="hidden" />
            <button type="submit" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 text-sm mr-10">
                + Add
            </button>
            <UserButton /> 
        </form>
      </div>

      {/* --- THE BOARD --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[80vh]">
        
        {/* COLUMN 1: WISHLIST */}
        <div className="bg-gray-100 p-4 rounded-xl flex flex-col overflow-y-auto">
            <h2 className="font-semibold mb-4 text-gray-700">🎯 Wishlist ({wishlist.length})</h2>
            {wishlist.map((job) => (
              <JobCard 
                key={job.id} 
                id={job.id} 
                title={job.title} 
                company={job.company} 
                type={job.location} 
                date={job.createdAt.toLocaleDateString()} 
                status={job.status}
              />
            ))}
             {wishlist.length === 0 && <p className="text-gray-400 text-sm mt-4 text-center">No jobs yet.</p>}
        </div>

        {/* COLUMN 2: APPLIED */}
        <div className="bg-gray-100 p-4 rounded-xl flex flex-col overflow-y-auto">
            <h2 className="font-semibold mb-4 text-blue-600">🚀 Applied ({applied.length})</h2>
            {applied.map((job) => (
              <JobCard 
                key={job.id} 
                id={job.id} 
                title={job.title} 
                company={job.company} 
                type={job.location} 
                date={job.createdAt.toLocaleDateString()} 
                status={job.status}
              />
            ))}
        </div>

        {/* COLUMN 3: INTERVIEW */}
        <div className="bg-gray-100 p-4 rounded-xl flex flex-col overflow-y-auto">
            <h2 className="font-semibold mb-4 text-purple-600">🗣️ Interview ({interview.length})</h2>
            {interview.map((job) => (
              <JobCard 
                key={job.id} 
                id={job.id} 
                title={job.title} 
                company={job.company} 
                type={job.location} 
                date={job.createdAt.toLocaleDateString()} 
                status={job.status}
              />
            ))}
        </div>

      </div>
    </main>
  );
}