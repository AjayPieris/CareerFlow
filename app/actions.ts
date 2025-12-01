"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server"; // <--- Import Auth

// --- JOB ACTIONS ---

export async function addJob(formData: FormData) {
  const { userId } = await auth(); // Get the logged-in user
  if (!userId) throw new Error("Unauthorized");

  const title = String(formData.get("title") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const location = String(formData.get("location") || "Remote").trim();

  await prisma.job.create({
    data: {
      userId, // <--- Save the User ID
      title,
      company,
      location,
      status: "Wishlist",
    },
  });

  revalidatePath("/");
}

export async function deleteJob(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const jobId = formData.get("id") as string;

  // Verify this job belongs to the user before deleting
  await prisma.job.deleteMany({
    where: { 
      id: jobId,
      userId: userId, // <--- Safety Check!
    },
  });

  revalidatePath("/");
}

export async function updateStatus(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const jobId = formData.get("id") as string;
  const newStatus = formData.get("status") as string;

  await prisma.job.updateMany({
    where: { 
      id: jobId,
      userId: userId, // <--- Safety Check!
    },
    data: { status: newStatus },
  });

  revalidatePath("/");
}

export async function generateCoverLetter(prevState: any, formData: FormData) {
  const company = formData.get("company") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  // 1. Initialize Gemini
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { success: false, letter: "Missing GEMINI_API_KEY. Add it to your .env and restart the dev server." };
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // 2. The Prompt (Instructions for the AI)
  const prompt = `
    Write a professional cover letter for a ${title} position at ${company}.
    
    Here is the job description:
    ${description}
    
    Keep it concise, professional, and enthusiastic. 
    Focus on why I am a good fit for software engineering roles.
    Do not include placeholders like "[Your Name]"—just write the body paragraphs.
  `;

  try {
    // 3. Call the API
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return { success: true, letter: text };
  } catch (error: any) {
    const message = (error?.message || error?.toString?.() || "Unknown error") as string;
    return { success: false, letter: `Gemini error: ${message}` };
  }
}