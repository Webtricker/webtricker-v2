"use client";

import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";
import { Button } from "./ui";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const toolbarClass =
  "grid h-9 min-h-0 w-9 place-items-center rounded-md border border-zinc-200 bg-white p-0 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900";

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageTitle, setImageTitle] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] px-3 py-3 text-sm outline-none prose prose-zinc max-w-none dark:prose-invert",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor || editor.getHTML() === value) return;
    editor.commands.setContent(value || "", { emitUpdate: false });
  }, [editor, value]);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  };

  const insertImage = () => {
    if (!imageUrl) return;

    editor
      .chain()
      .focus()
      .setImage({ src: imageUrl, alt: imageAlt, title: imageTitle })
      .run();
    setImageDialogOpen(false);
    setImageUrl("");
    setImageAlt("");
    setImageTitle("");
  };

  return (
    <div className="grid gap-2">
      {/* Editor container with sticky toolbar */}
      <div className="overflow-hidden rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        {/* Sticky toolbar */}
        <div className="sticky top-40 z-10 flex flex-wrap gap-1.5 border-b border-zinc-200 bg-white/95 p-2 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/95">
          <button type="button" title="Paragraph" className={toolbarClass} onClick={() => editor.chain().focus().setParagraph().run()}>
            P
          </button>
          <button type="button" title="Heading 2" className={toolbarClass} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            H2
          </button>
          <button type="button" title="Heading 3" className={toolbarClass} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            H3
          </button>
          <button type="button" title="Heading 4" className={toolbarClass} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>
            H4
          </button>
          <button type="button" title="Heading 5" className={toolbarClass} onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}>
            H5
          </button>
          <button type="button" title="Heading 6" className={toolbarClass} onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}>
            H6
          </button>
          <span className="mx-0.5 h-9 w-px self-stretch bg-zinc-200 dark:bg-zinc-800" />
          <button type="button" title="Bold" className={toolbarClass} onClick={() => editor.chain().focus().toggleBold().run()}>
            B
          </button>
          <button type="button" title="Italic" className={toolbarClass} onClick={() => editor.chain().focus().toggleItalic().run()}>
            I
          </button>
          <button type="button" title="Strikethrough" className={toolbarClass} onClick={() => editor.chain().focus().toggleStrike().run()}>
            S
          </button>
          <span className="mx-0.5 h-9 w-px self-stretch bg-zinc-200 dark:bg-zinc-800" />
          <button type="button" title="Bullet list" className={toolbarClass} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            UL
          </button>
          <button type="button" title="Numbered list" className={toolbarClass} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            OL
          </button>
          <span className="mx-0.5 h-9 w-px self-stretch bg-zinc-200 dark:bg-zinc-800" />
          <button type="button" title="Link" className={toolbarClass} onClick={setLink}>
            #
          </button>
          <button type="button" title="Image" className={toolbarClass} onClick={() => setImageDialogOpen(true)}>
            Img
          </button>
          <span className="mx-0.5 h-9 w-px self-stretch bg-zinc-200 dark:bg-zinc-800" />
          <button type="button" title="Undo" className={toolbarClass} onClick={() => editor.chain().focus().undo().run()}>
            ↩
          </button>
          <button type="button" title="Redo" className={toolbarClass} onClick={() => editor.chain().focus().redo().run()}>
            ↪
          </button>
        </div>

        {/* Editor content */}
        <EditorContent editor={editor} />
      </div>

      {imageDialogOpen && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/50 px-4">
          <div className="w-full max-w-xl rounded-lg border border-zinc-200 bg-white p-5 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold">Insert Image</h2>
            <div className="mt-4">
              <ImageUploader
                value={imageUrl}
                onChange={setImageUrl}
                altText={imageAlt}
                onAltTextChange={setImageAlt}
                titleText={imageTitle}
                onTitleTextChange={setImageTitle}
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setImageDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={insertImage} disabled={!imageUrl || !imageAlt}>
                Insert
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
