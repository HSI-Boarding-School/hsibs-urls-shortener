import { serverError } from "@/lib/api-utils"
import { db } from "@/lib/db"
import { sanitizeInput } from "@/lib/utils"
import { notFound, redirect } from "next/navigation"

interface Props {
  params: {
    shortCode: string
  }
}

export default async function RedirectPage({params}: Props) {
  try {
    const shortCode = sanitizeInput(params.shortCode)

    // find url in database 
    const url = await db.urls.findByShortCode(shortCode)

    if (!url) {
      notFound()
    }

    // increment click counter (fire and forget)
    db.urls.incrementClick(url.id).catch(err => {
      console.error('Failed to increment clicks', err)
    })

    // redirect to original url
    redirect(url.original_url)
  } catch (error) {
    console.error('Redirect error', error)
    notFound()
  }
}