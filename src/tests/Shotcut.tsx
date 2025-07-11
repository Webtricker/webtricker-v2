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



  // useEffect(() => {
  //   const loadData = async()=>{
  //     try {
  //       const res = await loadMedia({ type: "image" }).unwrap()
  //     console.log(res, ' res from the load data')
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   loadData()
  // }, [loadMedia])


                      /*
                      urls 
                      https://res.cloudinary.com/dirjayri8/image/upload/v1748526122/zfmkx1ssrfbtsiibeeze.png
                      https://res.cloudinary.com/dirjayri8/raw/upload/v1748532597/k0tyb0wshuc3ei0oqvae.svg
                      https://res.cloudinary.com/dirjayri8/raw/upload/v1748532597/r2rg0cgdr3xa8e8bctbw.svg
                      */ 