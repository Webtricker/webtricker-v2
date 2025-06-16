import React, { ReactNode } from 'react'

export default function Editor({children}:{children:ReactNode}) {
//     function convertHtmlToJson(html: string) {
//   const container = document.createElement('div');
//   container.innerHTML = html;

//   const blocks: any[] = [];

//   for (const node of Array.from(container.childNodes)) {
//     if (node.nodeType !== 1) continue; // Only process elements

//     const tag = node.nodeName.toLowerCase();

//     if (/^h[1-6]$/.test(tag)) {
//       const level = parseInt(tag[1]);
//       blocks.push({
//         type: 'heading',
//         level,
//         children: getInlineChildren(node)
//       });
//     } else if (tag === 'p') {
//       blocks.push({
//         type: 'paragraph',
//         children: getInlineChildren(node)
//       });
//     }
//   }

//   return blocks;

//   function getInlineChildren(el: Element) {
//     const inline: any[] = [];
//     for (const child of Array.from(el.childNodes)) {
//       if (child.nodeType === 3) {
//         const text = child.textContent?.trim();
//         if (text) {
//           inline.push({ type: 'text', text });
//         }
//       } else if (child.nodeName === 'BR') {
//         inline.push({ type: 'br' });
//       }
//     }
//     return inline;
//   }
// }

  return (
    <>
    <div contentEditable={true} className="focus:border-red-400 w-full p-4 border border-red-300 min-h-[600px] rounded-[10px]">

    </div>
    <div className="w-full border border-red-300 py-10 flex items-center justify-center  rounded-[10px] mt-5 ">
      {children}
    </div>
    </>
  )
}
