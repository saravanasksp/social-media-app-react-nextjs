"use client";

import { useOptimistic, useTransition } from "react";
import { toggleFollowAction } from "@/app/actions";
import { Icon } from "./icons";

type Props = {
  targetUserId: number;
  initialFollowing: boolean;
  size?: "sm" | "md";
  fullWidth?: boolean;
};

export function FollowButton({ targetUserId, initialFollowing, size = "md", fullWidth }: Props) {
  const [following, setFollowing] = useOptimistic(
    initialFollowing,
    (_current: boolean, next: boolean) => next,
  );
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      setFollowing(!following);
      await toggleFollowAction(targetUserId);
    });
  }

  const base =
    size === "sm"
      ? "rounded-lg px-2.5 py-1 text-[11px] font-semibold"
      : "rounded-xl px-4 py-2 text-[13px] font-semibold";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={following}
      disabled={pending}
      className={`${base} ${fullWidth ? "w-full" : ""} inline-flex items-center justify-center gap-1.5 transition ${
        following
          ? "border border-line bg-white text-ink hover:border-brand/40 hover:text-brand"
          : "border border-transparent bg-brand text-white hover:bg-brand-dark"
      } disabled:opacity-70`}
    >
      {following ? (
        <>
          <Icon name="check" size={size === "sm" ? 12 : 14} />
          Following
        </>
      ) : (
        "Follow"
      )}
    </button>
  );
}
