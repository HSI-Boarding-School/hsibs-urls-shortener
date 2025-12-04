'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { copyToClipboard } from '@/lib/utils'

interface CopyButtonProps {
  text: string
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Button
      type="button"
      onClick={handleCopy}
      variant="outline"
      className="min-w-[100px]"
    >
      {copied ? (
        <>
          <span className="mr-2">✅</span>
          Copied!
        </>
      ) : (
        <>
          <span className="mr-2">📋</span>
          Copy
        </>
      )}
    </Button>
  )
}