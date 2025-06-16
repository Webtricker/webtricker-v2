import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
// import UploadFile from "./components/UploadFile";
import Editor from "@/sharedComponets/ui/editor/Editor";
import Button from "@/sharedComponets/ui/buttons/Button";

{/* <div className="w-full py-20 flex flex-col items-center justify-center ">
  <UploadFile />
</div> */}
export default function TestPage() {
  return (
    <div className="w-full min-h-screen pt-20 mt-20">
      <Container>
        <Editor>
          <Button label="Save" className="!py-2.5" />
        </Editor>
      </Container>
    </div>
  );
}
