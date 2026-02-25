import { memo } from "react";
import Lottie from "react-lottie-player";
import { useCachedData } from "@/shared/hooks/use-cached-data";
import { cn } from "@/shared/lib/cn";

interface CachedLottieProps {
  animationUrl: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

export const CachedLottie = memo(
  ({
    animationUrl,
    loop = false,
    autoplay = true,
    className,
  }: CachedLottieProps) => {
    const animation = useCachedData(animationUrl);
    return animation ? (
      <Lottie
        play={autoplay}
        loop={loop}
        className={cn("size-28", className)}
        animationData={animation}
      />
    ) : (
      <div className={cn("size-28", className)} />
    );
  }
);

CachedLottie.displayName = "CachedLottie";
