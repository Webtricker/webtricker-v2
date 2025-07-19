"use client";
import { useLazyGetLogosQuery } from "@/redux/features/logos/logosApiSlice";
import {
  setAllLogos,
  setSiteLogoFetchingError,
  SiteLogoState,
  updateIsSitelogoLoading,
} from "@/redux/features/logos/siteLogoSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function LoadSiteLogos() {
  const dispatch = useDispatch();
  const [getLogos] = useLazyGetLogosQuery({});

  // effect
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const result = await getLogos({}).unwrap();
        if (result?.success && result?.data) {
          const { darkLargeLogo, defaultLogos, lightLargeLogo, smallLogo } =
            result.data as SiteLogoState;
          dispatch(
            setAllLogos({
              lightLargeLogo,
              darkLargeLogo,
              smallLogo,
              defaultLogos,
            })
          );
        } else {
          throw new Error("Something went wrong");
        }
      } catch (error) {
        console.log(error);
        dispatch(setSiteLogoFetchingError(true));
      } finally {
        dispatch(updateIsSitelogoLoading(false));
      }
    };

    loadLogo();
  }, [getLogos,dispatch]);
  return <></>;
}
