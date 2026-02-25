import { hapticFeedback } from "@tma.js/sdk-react";
import { forwardRef, memo } from "react";
import { Link } from "react-router-dom";

type SvgComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface NavigationItemProps {
  href: string;
  title: string;
  isActive: boolean;
  icon: SvgComponent;
  activeIcon: SvgComponent;
}

export const NavigationItem = memo(
  forwardRef<HTMLDivElement, NavigationItemProps>(
    ({ href, title, isActive, icon: Icon, activeIcon: ActiveIcon }, ref) => {
      return (
        <div ref={ref} className="relative w-full">
          <Link
            to={href}
            className="relative flex flex-col justify-between rounded-full py-2 w-full"
            style={{ color: isActive ? "#0a84ff" : "#636366" }}
            onClick={() => hapticFeedback.selectionChanged()}
          >
            <div className="relative z-10 flex flex-col items-center justify-center gap-[5px]">
              {isActive ? (
                <ActiveIcon width={20} height={20} />
              ) : (
                <Icon width={20} height={20} />
              )}
              <span className="text-[11px] font-medium">{title}</span>
            </div>
          </Link>
        </div>
      );
    }
  )
);

NavigationItem.displayName = "NavigationItem";
