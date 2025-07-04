"use client";
import { Editor } from "@tinymce/tinymce-react";
import MediaModal from "./MediaModal";
import { useDispatch } from "react-redux";
import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import { useRef } from "react";
import Button from "../buttons/Button";
import { toast } from "react-toastify";

type TinyFilePickerCallback = (url: string, meta?: { title?: string }) => void;

// config variables
// const plugins = [
//   "textcolor",
//   "anchor",
//   "autolink",
//   "charmap",
//   "codesample",
//   "emoticons",
//   "image",
//   "link",
//   "lists",
//   "media",
//   "searchreplace",
//   "visualblocks",
//   "wordcount",
//   "code",
// ];

const  plugins = [
      'advlist', 'autolink', 'autosave', 'charmap', 'code', 'codesample',
      'directionality', 'emoticons', 'fullscreen', 'help', 'image', 'insertdatetime',
      'link', 'lists', 'media', 'nonbreaking', 'pagebreak', 'preview', 'quickbars',
      'searchreplace', 'table', 'textcolor', 'visualblocks', 'visualchars', 'wordcount'
    ];

// const toolbar =
//   "blocks fontsize | bold italic underline strikethrough code forecolor backcolor | link image media mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap";

const  toolbar = 'undo redo | blocks fontfamily fontsize | ' +
             'bold italic underline strikethrough | forecolor backcolor | ' +
             'alignleft aligncenter alignright alignjustify | ' +
             'bullist numlist outdent indent | ' +
             'link image media table | ' +
             'charmap emoticons codesample | ' +
             'fullscreen preview print | ' +
             'a11ycheck addcomment showcomments | ' + // a11ycheck, addcomment, showcomments are also free
             'insertdatetime nonbreaking pagebreak | ' +
             'searchreplace visualblocks visualchars | help';

const menubar = 'file edit view insert format table';

 const content_css = [
      '//fonts.googleapis.com/css?family=Open+Sans', // Example: Google Font
      '//www.tiny.cloud/css/codepen.min.css' // Example: TinyMCE's default content styles
  
    ];

const textcolor_map = [
      "000000", "Black", "993300", "Burnt orange", "333300", "Dark olive",
      "003300", "Dark green", "003366", "Dark azure", "000080", "Navy Blue",
      "333399", "Indigo", "333333", "Very dark gray", "800000", "Dark red",
      "FF6600", "Orange", "808000", "Dark yellow", "008000", "Green",
      "008080", "Teal", "0000FF", "Blue", "666699", "Grayish blue",
      "808080", "Gray", "FF0000", "Red", "FF9900", "Amber", "99FF00", "Light green",
      "339966", "Medium green", "33CCCC", "Light blue", "3366FF", "Sky blue",
      "800080", "Purple", "999999", "Medium gray", "FF00FF", "Magenta",
      "FFCC00", "Gold", "FFFF00", "Yellow", "00FF00", "Lime", "00FFFF", "Aqua",
      "00CCFF", "Electric blue", "993366", "Red violet", "FFFFFF", "White"
    ];

const textcolor_cols = 8;

export default function EditorContainer() {
  // hooks
  const dispatch = useDispatch();

  // ref
  const pickerResolveRef = useRef<TinyFilePickerCallback | null>(null);
  const editorRef = useRef<any>(null);

  // handlers
  const handleSelect = (fileUrl: string, title: string) => {
    console.log(fileUrl, " file url");
    console.log(title, " title");
    console.log(pickerResolveRef, " picker resolve function");
    pickerResolveRef.current?.(fileUrl, { title });
  };

  const handleSave = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent(), " content from editor");
    }
    // console.log(editorRef.current);
    toast.success("btn clicked");
  };

  // config
  const tinymceConfig = {
    height: 500,
    plugins,
    toolbar,
    menubar,
    statusbar:true,
    content_css,
    textcolor_map,
    textcolor_cols,
     autoresize_bottom_margin: 16,
    autoresize_overflow_padding: 0,

     // Optional: Quickbars for contextual toolbars
    quickbars_selection_toolbar: 'bold italic | quicklink blockquote',
    quickbars_insert_toolbar: 'image media codesample',
    quickbars_image_toolbar: 'imageoptions',

     // Optional: Image plugin settings
    image_advtab: true,
    image_caption: true,
    image_title: true,
    image_description: true,

    // customize media select
    file_picker_types: "image media",
    file_picker_callback: (cb:any, value, meta) => {
      dispatch(toggleModal("OPEN_MEDIA_MODAL"));

      // store the callback to call later.
      pickerResolveRef.current = (url, { title = "" } = {}) =>
        cb(url, { title });
    },
    paste_auto_cleanup_on_paste: true,
    paste_remove_styles: true,

    /* optional: prevent TinyMCE’s default image upload POST */
    images_upload_handler: () => new Promise(() => {}), // no‑op
  };

  return (
    <>
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        apiKey="yo7qusvretankfcx2rp14sl6z5jcppo8i1yzsvukjbugbb3r"
        init={tinymceConfig}
        initialValue="Start typing here."
      />
      <div className="w-full mt-5 md:mt-10">
        <Button className="!py-2.5" label="Save" cb={handleSave} />
      </div>

      <MediaModal cb={handleSelect} />
    </>
  );
}
