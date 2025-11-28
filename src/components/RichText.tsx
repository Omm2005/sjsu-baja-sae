import React from 'react'
import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export default function RichText({ content }: { content: SerializedEditorState }) {
  return (
    <div className="prose prose-neutral prose-headings:scroll-mt-20 max-w-none dark:prose-invert">
      <PayloadRichText data={content} />
    </div>
  )
}
