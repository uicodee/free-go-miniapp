import { getLeaderboard } from "@/shared/api/generated/leaderboard/leaderboard";
import { CachedLottie } from "@/widgets/cached-lottie";
import { useSuspenseQuery } from "@tanstack/react-query";
import { List, Section, Cell } from "@telegram-apps/telegram-ui";
import { retrieveRawInitData } from "@tma.js/sdk-react";

const TROPHY_URL =
  "https://s3.twcstorage.ru/46378e65-51be011d-2e82-4849-b980-9061e94764c7/temp/Comp%201%20(1).json";

const rankEmoji: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export const Page = () => {
  const initDataRaw = retrieveRawInitData();
  const { data: leaderboard } = useSuspenseQuery({
    queryKey: ["leaderboard"],
    queryFn: () =>
      getLeaderboard().leaderboardControllerGetLeaderboard(
        { limit: 20 },
        { headers: { Authorization: initDataRaw } }
      ),
  });
  return (
    <div style={{ color: "var(--tg-theme-text-color)" }}>
      <div className="flex flex-col items-center pt-6 pb-2">
        <CachedLottie
          animationUrl={TROPHY_URL}
          loop
          autoplay
          className="size-36"
        />
        <h1 className="text-2xl font-bold mt-2">Reyting</h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--tg-theme-hint-color)" }}
        >
          Bu haftaning eng yaxshi o'yinchilari
        </p>
      </div>

      <List>
        <Section className="rounded-section" header="O'rinlar">
          {leaderboard.map((user) => (
            <Cell
              key={user.rank}
              description={user.username ? user.username : ""}
              before={
                <span className="text-lg w-8 text-center">
                  {rankEmoji[user.rank] ?? `${user.rank}`}
                </span>
              }
              after={
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--tg-theme-accent-text-color)" }}
                >
                  {user.referral_count.toLocaleString()} ta
                </span>
              }
            >
              {user.first_name} {user.last_name}
            </Cell>
          ))}
        </Section>
      </List>
    </div>
  );
};
