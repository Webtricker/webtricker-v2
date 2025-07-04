import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
// import UploadFile from "./components/UploadFile";
import EditorContainer from "@/sharedComponets/ui/editor/EditorContainer";
// import { EditorContent, useEditor, JSONContent } from '@tiptap/react'
// import StarterKit from '@tiptap/starter-kit'
// import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

{/* <div className="w-full py-20 flex flex-col items-center justify-center ">
  <UploadFile />
</div> */}
export default function TestPage() {
//   const editor = useTiptapEditor({
//   extensions: [StarterKit],
//   content: '<p>Write your blog here...</p>',
// })
  return (
    <div className="w-full min-h-screen pt-20 mt-5 flex flex-col">
      <Container className="flex flex-col grow">
         <EditorContainer />
      </Container>
    </div>
  );
}
