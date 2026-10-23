import type { EntitlementModel } from "../auth/core/_models";

export type MediaAllowance = {
  images: number | null;
  videos: number | null;
  imagesConfigured: boolean;
  videosConfigured: boolean;
  imagesIncluded: boolean;
  videoIncluded: boolean;
  planName: string;
  reels: number | null;
  reelsIncluded: boolean;
  reelsConfigured: boolean;
};

export const mediaAllowance = (entitlements?: EntitlementModel): MediaAllowance => {
  const image = entitlements?.features?.maximum_images;
  const video = entitlements?.features?.maximum_videos;
  const upload = entitlements?.features?.video_upload;
  const reels = entitlements?.features?.reels;
  const planActive = entitlements ? entitlements.active : true;
  return {
    images: entitlements?.limits?.images ?? null,
    videos: entitlements?.limits?.videos ?? null,
    imagesConfigured: Boolean(image?.configured),
    videosConfigured: Boolean(video?.configured),
    imagesIncluded: planActive && (image?.configured ? Boolean(image.enabled) : true),
    videoIncluded: planActive && (upload?.configured ? Boolean(upload.enabled) : true),
    planName: entitlements?.plan?.name ?? "current",
    reels: entitlements?.limits?.reels ?? null,
    reelsConfigured: Boolean(reels?.configured),
    reelsIncluded: planActive && (reels?.configured ? Boolean(reels.enabled) : true),
  };
};
