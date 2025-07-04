// hooks/use-tiptap-editor.ts
import { useEditor, EditorOptions } from '@tiptap/react'

export const useTiptapEditor = (options: Partial<EditorOptions>) => {
  return useEditor(options)
}
