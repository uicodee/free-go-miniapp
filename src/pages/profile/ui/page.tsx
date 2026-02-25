import { useState } from "react";
import {
  List,
  Section,
  Cell,
  Avatar,
  Button,
  Snackbar,
  Title,
  Text,
  Caption,
} from "@telegram-apps/telegram-ui";
import {
  hapticFeedback,
  initData,
  openTelegramLink,
  retrieveRawInitData,
} from "@tma.js/sdk-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getMe } from "@/shared/api/generated/me/me";

const formatDate = (date: Date) =>
  date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const Page = () => {
  const initDataRaw = retrieveRawInitData();
  const { data: me } = useSuspenseQuery({
    queryKey: ["me"],
    queryFn: () =>
      getMe().meControllerGetMe({
        headers: { Authorization: initDataRaw },
      }),
  });
  const referralLink = `https://t.me/freego_bot?start=${me.referral_code}`;

  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    hapticFeedback.impactOccurred("light");
    setSnackbarVisible(true);
  };

  const handleShare = () => {
    hapticFeedback.impactOccurred("light");
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("Free Go orqali bepul Pro obuna oling!")}`;
    openTelegramLink(shareUrl);
  };

  return (
    <>
      <List>
        {/* Header */}
        <div className="flex flex-col items-center pt-6 pb-4 gap-3">
          <Avatar
            size={96}
            src={initData.user()?.photo_url}
            acronym={me.first_name[0]}
          />
          <div className="text-center">
            <Title level="3" weight="2">
              {me.first_name}
            </Title>
            <Text style={{ color: "var(--tg-theme-hint-color)" }}>
              {me.username}
            </Text>
          </div>
        </div>

        {/* Basic info */}
        <Section className="rounded-section" header="Ma'lumotlar">
          <Cell
            before={<span className="text-xl">📅</span>}
            description="Ro'yxatdan o'tgan sana"
            multiline
            after={
              <Caption style={{ color: "var(--tg-theme-hint-color)" }}>
                {formatDate(new Date(me.created_at))}
              </Caption>
            }
          >
            A'zo bo'lgan
          </Cell>
          <Cell
            before={<span className="text-xl">⚡️</span>}
            description="Obuna holati"
            after={
              <Caption
                style={{
                  color: me.is_pro
                    ? "var(--tg-theme-accent-text-color)"
                    : "var(--tg-theme-hint-color)",
                }}
              >
                {me.is_pro ? "Faol" : "Faol emas"}
              </Caption>
            }
          >
            Pro obuna
          </Cell>
          <Cell
            before={<span className="text-xl">👥</span>}
            description="Taklif qilingan do'stlar"
            after={
              <Caption style={{ color: "var(--tg-theme-hint-color)" }}>
                {me.referral_count} ta
              </Caption>
            }
          >
            Referallar
          </Cell>
        </Section>

        {/* Referral */}
        <Section className="rounded-section" header="Referal havola">
          <Cell
            before={<span className="text-xl">🔗</span>}
            description={referralLink}
            multiline
          >
            Sizning havolangiz
          </Cell>
        </Section>

        <div className="flex gap-2 px-4">
          <Button size="m" stretched onClick={handleCopy}>
            Nusxalash
          </Button>
          <Button size="m" stretched mode="bezeled" onClick={handleShare}>
            📤 Ulashish
          </Button>
        </div>
      </List>

      {snackbarVisible && (
        <Snackbar
          before={<span className="text-xl">✅</span>}
          duration={2500}
          onClose={() => setSnackbarVisible(false)}
        >
          Havola nusxalandi
        </Snackbar>
      )}
    </>
  );
};
