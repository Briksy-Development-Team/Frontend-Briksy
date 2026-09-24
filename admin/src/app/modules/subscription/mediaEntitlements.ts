import type { EntitlementModel } from "../auth/core/_models";

export type MediaAllowance = {
  images: number | null;
  videos: number | null;
  imagesConfigured: boolean;
  videosConfigured: boolean;
  videoIncluded: boolean;
  planName: string;
};

export const mediaAllowance = (entitlements?: EntitlementModel): MediaAllowance => {
  const image = entitlements?.features?.maximum_images;
  const video = entitlements?.features?.maximum_videos;
  const upload = entitlements?.features?.video_upload;
  return {
    images: entitlements?.limits?.images ?? null,
    videos: entitlements?.limits?.videos ?? null,
    imagesConfigured: Boolean(image?.configured),
    videosConfigured: Boolean(video?.configured),
    videoIncluded: upload?.configured ? Boolean(upload.enabled) : true,
    planName: entitlements?.plan?.name ?? "current",
  };
};
