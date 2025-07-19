"use client";
import { Editor } from "@tinymce/tinymce-react";
import MediaModal from "./MediaModal";
import { useDispatch } from "react-redux";
import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import { RefObject, useRef } from "react";
import { Editor as TinyMCEEditor } from "tinymce";
import { TMedia } from "@/types/commonTypes";

type TinyFilePickerCallback = (url: string, meta?: { title?: string }) => void;

const plugins = [
  "advlist",
  "autolink",
  "autosave",
  "charmap",
  "code",
  "codesample",
  "directionality",
  "emoticons",
  "fullscreen",
  "help",
  "image",
  "insertdatetime",
  "link",
  "lists",
  "media",
  "nonbreaking",
  "pagebreak",
  "preview",
  "searchreplace",
  "table",
  "textcolor",
  "visualblocks",
  "visualchars",
  "wordcount",
];

const toolbar =
  "undo redo | blocks styles | " +
  "bold italic underline strikethrough | forecolor backcolor | " +
  "alignleft aligncenter alignright alignjustify | " +
  "bullist numlist outdent indent | " +
  "link image media table | " +
  "charmap emoticons | " +
  "fullscreen preview | " +
  "a11ycheck addcomment showcomments | " +
  "insertdatetime | " +
  "searchreplace";

const menubar = "file edit view insert format";

const content_css = ["/css/editor.css"];

const textcolor_map = [
  "000000",
  "Black",
  "993300",
  "Burnt orange",
  "333300",
  "Dark olive",
  "003300",
  "Dark green",
  "003366",
  "Dark azure",
  "000080",
  "Navy Blue",
  "333399",
  "Indigo",
  "333333",
  "Very dark gray",
  "800000",
  "Dark red",
  "FF6600",
  "Orange",
  "808000",
  "Dark yellow",
  "008000",
  "Green",
  "008080",
  "Teal",
  "0000FF",
  "Blue",
  "666699",
  "Grayish blue",
  "808080",
  "Gray",
  "FF0000",
  "Red",
  "FF9900",
  "Amber",
  "99FF00",
  "Light green",
  "339966",
  "Medium green",
  "33CCCC",
  "Light blue",
  "3366FF",
  "Sky blue",
  "800080",
  "Purple",
  "999999",
  "Medium gray",
  "FF00FF",
  "Magenta",
  "FFCC00",
  "Gold",
  "FFFF00",
  "Yellow",
  "00FF00",
  "Lime",
  "00FFFF",
  "Aqua",
  "00CCFF",
  "Electric blue",
  "993366",
  "Red violet",
  "FFFFFF",
  "White",
];

const style_formats = [
  { title: "14px", inline: "span", classes: "wt_fs-xs" },
  { title: "16px", inline: "span", classes: "wt_fs-sm" },
  { title: "18px", inline: "span", classes: "wt_fs-base" },
  { title: "20px", inline: "span", classes: "wt_fs-md" },
  { title: "22px", inline: "span", classes: "wt_fs-lg" },
  { title: "25px", inline: "span", classes: "wt_fs-xl" },
  { title: "30px", inline: "span", classes: "wt_fs-2xl" },
  { title: "35px", inline: "span", classes: "wt_fs-3xl" },
  { title: "40px", inline: "span", classes: "wt_fs-4xl" },
  { title: "60px", inline: "span", classes: "wt_fs-5xl" },
  { title: "72px", inline: "span", classes: "wt_fs-6xl" },
  { title: "100px", inline: "span", classes: "wt_fs-7xl" },
];

const textcolor_cols = 8;

// container starts
interface EditorContainerProps {
  editorRef: RefObject<TinyMCEEditor | null>;
}

const EditorContainer = ({ editorRef }: EditorContainerProps) => {
  // hooks
  const dispatch = useDispatch();

  // ref
  const pickerResolveRef = useRef<TinyFilePickerCallback | null>(null);

  // handlers
  const handleSelect = (imgData: TMedia) => {
    pickerResolveRef.current?.(imgData.secure_url, { title: "Content image" });
    dispatch(toggleModal(null));
  };

  // config
  const tinymceConfig = {
    height: 500,
    plugins,
    toolbar,
    menubar,
    statusbar: true,
    content_css,
    textcolor_map,
    preview_styles: "font-family font-weight",
    textcolor_cols,
    style_formats,
    style_formats_merge: false,
    autoresize_bottom_margin: 16,
    autoresize_overflow_padding: 0,

    // Optional: Quickbars for contextual toolbars
    quickbars_selection_toolbar: "bold italic | quicklink blockquote",
    quickbars_insert_toolbar: "image media codesample",
    quickbars_image_toolbar: "imageoptions",

    // Optional: Image plugin settings
    image_advtab: true,
    image_caption: true,
    image_title: true,
    image_description: true,

    // customize media select
    file_picker_types: "image media",
    // file_picker_callback: (cb:any, value, meta) => {
    file_picker_callback: (cb: any) => {
      dispatch(toggleModal("OPEN_EDITOR_MEDIA_MODAL"));

      // store the callback to call later.
      pickerResolveRef.current = (url, { title = "" } = {}) =>
        cb(url, { title });
    },
    paste_auto_cleanup_on_paste: true,
    paste_remove_styles: true,

    /* optional: prevent TinyMCE’s default image upload POST */
    images_upload_handler: () => new Promise<string>(() => {}), // no‑op
  };

  return (
    <>
      <div className="w-full my-10">
        <Editor
          onInit={(_, editor) => (editorRef.current = editor)}
          apiKey="yo7qusvretankfcx2rp14sl6z5jcppo8i1yzsvukjbugbb3r"
          init={tinymceConfig}
          initialValue="Start typing here."
        />
      </div>
      <MediaModal activeKey="OPEN_EDITOR_MEDIA_MODAL" cb={handleSelect} />
    </>
  );
};

EditorContainer.displayName = "editorContainer";

export default EditorContainer;
