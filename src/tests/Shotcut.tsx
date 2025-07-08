import { RootState } from '@/redux/store'
import Image from 'next/image';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import bannerImg from "@/assets/"

export default function Shotcut() {

  // data-prevent-body-trigger
  const dispatch = useDispatch();
    const EXPAND  = useSelector((state:RootState) => state.modyfier.EXPAND)
    // const {authAccessToken} = useSelector((state:RootState) => state.authInfo)
    console.log(EXPAND,dispatch);

    const handler = ()=>{}
    handler()
  return (
    <div>

<div className="grid dark:bg-[#1c1d1e] grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.25)] dark:shadow-[0px_1px_4px_0px_rgba(255,255,255,0.2)]">
  <Image src="/public/images/services/service-marketing-white-icon.png" width={300} height={400} alt="" />
</div>

    </div>
  )
}

//  ===== section padding
// py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18

// const handleClose = ()=>{}

// load data
  // useEffect(() => {
  //    const loadData = async ()=>{
  //      const res = await ().unwrap()
  //    }
  //    loadData()
  //  }, [])


// slider
{/* <SliderWrapper slideCount={3}>
   <SliderContainer>
      <div className="w-full h-64 flex items-center justify-center bg-red-500 text-white text-xl font-bold">
        Slide 1
      </div>
      <div className="w-full h-64 flex items-center justify-center bg-blue-500 text-white text-xl font-bold">
        Slide 2
      </div>
      <div className="w-full h-64 flex items-center justify-center bg-green-500 text-white text-xl font-bold">
        Slide 3
      </div>
    </SliderContainer>
    </SliderWrapper> */}



    // export const  InstraIcon = ({className=''}:{className?:string})=> {
      //     <svg className={className}
    //   return (
    
    //   )
    // }

    

    /*
    <Image src="" width={} height={} alt="" />
    */

    // components


    // useEffect(()=>{},[])


    /*
     color loading spinner
     <LoadingSpinner
                    totalVisuals={3}
                    containerClass="w-6  h-8"
                    squareClasses={["bg-[#6C63FF]", "bg-[#6C63FF]", "bg-[#6C63FF]"]}
                  />
    */ 


                  // ====== socket trigger event from front-end
                  //  if (!activityInfo?._id) {
                  //       // something wrong setting activity info
                  //       toast.error("internal server error");
                  //       return;
                  //     }
                  //     console.log("clicked ", socket);
                  //     if (socket) {
                  //       socket.emit("createGroup", {
                  //         activityId: activityInfo?._id,
                  //       });
                  //     } else {
                  //       toast.error("internal server error");
                  //       // TOOD: have to create rest api to create new group
                  //     }


                  // receive event in useEffect
                  //  useEffect(() => {
                  //     if (!socket) return;
                  //     socket.on("joinRequestSent", async (activity) => {
                  //       dispatch(deleteSearchedActivities(activity.activityId));
                  //       toast.success("Request sent");
                  //     });
                  
                  //     // Clean up when component unmounts or socket changes
                  //     return () => {
                  //       socket.off("joinRequestSent", () => {});
                  //     };
                  //   }, [socket]);


                      // authenticate user
                      // try {
                      // await dbConnect();
                      //     await verifyAdmin(req);
                      // } catch (error) {
                      //     return NextResponse.json({ success: false, message: (error as Error).message }, { status: 401 });
                      // }






                      /*
                      urls 
                      https://res.cloudinary.com/dirjayri8/image/upload/v1748526122/zfmkx1ssrfbtsiibeeze.png
                      https://res.cloudinary.com/dirjayri8/raw/upload/v1748532597/k0tyb0wshuc3ei0oqvae.svg
                      https://res.cloudinary.com/dirjayri8/raw/upload/v1748532597/r2rg0cgdr3xa8e8bctbw.svg
                      */ 

                      <div className="w-full flex grow">
        <div className="w-full flex flex-col max-w-14 border-r border-slate-400 py-5 pr-4">
          <button onClick={() => setActiveTab("img")} className="mb-5">
            <GalleryIcon
              className={`w-10 h-10 ${
                activeTab === "img" ? "text-blue-600" : "hover:text-black"
              }`}
            />
          </button>
          <button onClick={() => setActiveTab("video")} className="">
            <VideoIcon
              className={`w-10 h-10 ${
                activeTab === "video" ? "text-blue-600" : "hover:text-black"
              }`}
            />
          </button>
        </div>
        <div
          onWheel={stopScrollPropagation}
          className="w-full overflow-y-scroll max-h-[60vh] bg-red-200"
        >
          {/* <div className=" grow grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4"> */}
          <div className="w-full">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis
              maiores ullam eius voluptas dignissimos quis. Eos in debitis at
              vitae quis illo iusto laboriosam? Eos quas pariatur quisquam ipsa
              hic corrupti magnam omnis nihil asperiores officiis accusamus
              commodi illo, culpa reprehenderit animi natus molestias ducimus
              delectus. Sint dignissimos tempora delectus expedita ea
              necessitatibus commodi a non impedit inventore, ratione aut. Eum
              atque sunt nesciunt porro suscipit autem dolorem, quaerat fugit
              placeat sit modi in ab praesentium quos nam explicabo quia id
              recusandae minus corrupti. Excepturi nesciunt dolor necessitatibus
              voluptate nobis. Unde voluptate, nam iusto consequatur at,
              mollitia, adipisci sunt cum incidunt odio repudiandae modi odit
              rerum accusantium dicta nobis fuga possimus tempora optio. Non
              nisi possimus, odio dicta molestiae ut ullam. Aspernatur impedit,
              repellat, recusandae ullam tempora distinctio porro officia odit
              facilis beatae ducimus, est laudantium. Eum, illo eos. Inventore
              commodi amet, quos laborum minima ullam excepturi deleniti
              veritatis unde voluptates nam libero vel, sequi fugit blanditiis
              fugiat cupiditate quibusdam eaque sed tempore voluptatem numquam
              natus. Quibusdam animi nobis laborum? Alias nisi perspiciatis
              similique magnam, dolorem cum aliquam omnis enim accusantium
              delectus iste eaque voluptate adipisci beatae ex! Quaerat fugit
              nesciunt accusantium dolorum natus quos dignissimos. Minima
              repellendus quas soluta iure nesciunt autem velit laboriosam, esse
              consequuntur atque inventore sint maiores eos praesentium maxime
              modi eius illum, quod neque dignissimos similique? Neque quibusdam
              a, possimus exercitationem fuga provident dolore dolorem sit ipsam
              molestiae facere voluptas fugiat et, nam aspernatur ea aperiam
              expedita excepturi non minima totam quam? Iure tempora esse qui
              quos voluptatum! Blanditiis iure amet cumque eius eos aut
              temporibus praesentium! Praesentium impedit recusandae quae
              doloribus nulla quos? Aliquid a autem modi libero corporis. Eum,
              quos expedita? Voluptatem quo maxime dolore aut nisi ducimus
              dolorum eius, et quibusdam, ipsa doloremque illum dolor, dolorem
              beatae neque pariatur corporis veniam. Mollitia soluta molestiae
              molestias, quaerat ipsum qui sequi pariatur fugit rem beatae
              aliquam explicabo debitis magni eveniet! Corrupti, error impedit
              in minima ipsa, sequi minus rerum voluptatem eveniet consequatur
              facilis, rem quia eos optio debitis cumque repellendus itaque?
              Repellat voluptate unde eius odio itaque velit veniam! Eos nostrum
              saepe minima ratione nulla itaque, accusamus beatae laborum
              cupiditate, quo doloremque magni illo labore quidem quia
              reprehenderit odio unde? Fugiat a voluptatum cumque, dolore
              deserunt ab maxime eum minus repellendus ducimus error at rem
              alias accusamus sapiente sed dicta sit ipsam pariatur possimus
              dignissimos ut quia consectetur. Nostrum cumque quo quae
              perspiciatis quasi explicabo beatae assumenda vero optio
              consequatur atque dicta soluta aperiam inventore repellat pariatur
              labore enim odit fugiat incidunt deleniti, earum, esse voluptate
              illo. Provident culpa voluptatibus, cumque explicabo amet aliquam
              modi atque iusto ratione eos vero quaerat, unde hic sit neque
              expedita libero qui! Totam quae, soluta nulla impedit doloremque,
              animi quo iusto pariatur sapiente, sequi culpa assumenda quos vero
              reiciendis illo dolorum nobis architecto suscipit laudantium
              inventore id temporibus cupiditate. Eius nulla deleniti temporibus
              recusandae laboriosam molestiae blanditiis sint nesciunt officiis,
              labore veritatis quaerat eum consectetur dolor provident neque
              ducimus minima placeat beatae sapiente enim odit nostrum,
              repellendus culpa.
            </p>
            {/* {activeTab === "img" ? (
            <>
              <MediaImages cb={() => {}} />
            </>
          ) : (
            <>
              <p>Media videos</p>
            </>
          )} */}
            {/* {
            demoMedia
                    .filter((item) => item.type === "image")
                    .map((img) => (
                      <button className="w-full overflow-hidden h-auto" key={img._id}>
                        <Image
                          className="w-full h-auto"
                          src={img.url}
                          width={200}
                          height={200}
                          alt={`Media ${img._id}`}
                        />
                      </button>
                    ))
          } */}
          </div>
        </div>
        {/* <button onClick={handleClick}>select</button> */}
      </div>