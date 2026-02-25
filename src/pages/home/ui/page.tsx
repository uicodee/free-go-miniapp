import { useState, useCallback } from "react";
import {
  List,
  Section,
  Cell,
  Button,
  Title,
  Text,
  Caption,
  Snackbar,
} from "@telegram-apps/telegram-ui";
import { CachedLottie } from "@/widgets/cached-lottie";
import {
  hapticFeedback,
  openLink,
  openTelegramLink,
  retrieveRawInitData,
} from "@tma.js/sdk-react";
import ExportIcon from "@/assets/export.svg?react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getPro } from "@/shared/api/generated/pro/pro";

const STAR_URL =
  "https://s3.twcstorage.ru/46378e65-51be011d-2e82-4849-b980-9061e94764c7/temp/!!!star%20(1).json";

const formatDate = (date: Date) =>
  date.toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatDateShort = (date: Date) =>
  date.toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "long",
  });

export const Page = () => {
  const initDataRaw = retrieveRawInitData();
  const queryClient = useQueryClient();
  const [snackbar, setSnackbar] = useState<"success" | "error" | null>(null);

  const { data: pro } = useSuspenseQuery({
    queryKey: ["pro-status"],
    queryFn: () =>
      getPro().proControllerGetProStatus({
        headers: { Authorization: initDataRaw },
      }),
  });

  const claimMutation = useMutation({
    mutationFn: () =>
      getPro().proControllerClaimPro({
        headers: { Authorization: initDataRaw },
      }),
    onSuccess: () => {
      hapticFeedback.notificationOccurred("success");
      queryClient.invalidateQueries({ queryKey: ["pro-status"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setSnackbar("success");
    },
    onError: () => {
      hapticFeedback.notificationOccurred("error");
      setSnackbar("error");
    },
  });

  const handleActivate = useCallback(() => {
    if (pro.pro_url) openLink(pro.pro_url);
    hapticFeedback.impactOccurred("medium");
    claimMutation.mutate();
  }, [pro.pro_url, claimMutation]);

  const slotsLeft = pro.total_slots - pro.taken_slots;

  return (
    <>
      <List>
        {pro.is_active ? (
          <>
            <div className="flex flex-col items-center pt-6 pb-4">
              <CachedLottie
                animationUrl={STAR_URL}
                loop
                autoplay
                className="size-36"
              />
              <div className="mt-4 text-center">
                <Title level="3" weight="2">
                  Pro obuna faol ⚡️
                </Title>
                <Text style={{ color: "var(--tg-theme-hint-color)" }}>
                  {pro.active_until
                    ? `${formatDate(new Date(pro.active_until))} gacha faol`
                    : ""}
                </Text>
              </div>
            </div>

            <Section className="rounded-section">
              <Cell
                before={<span className="text-xl">⚡️</span>}
                after={
                  <Caption
                    style={{ color: "var(--tg-theme-accent-text-color)" }}
                  >
                    Faol
                  </Caption>
                }
                description={
                  pro.active_until
                    ? `${formatDate(new Date(pro.active_until))} gacha`
                    : ""
                }
              >
                Pro obuna
              </Cell>
            </Section>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center pt-6 pb-4">
              <CachedLottie
                animationUrl={STAR_URL}
                loop
                autoplay
                className="size-36"
              />
              <div className="mt-4 text-center">
                <Title level="3" weight="2">
                  Pro obunani oling
                </Title>
              </div>
            </div>

            <Section className="rounded-section" header="Mavjudlik">
              <Cell
                before={<span className="text-xl">🎁</span>}
                after={
                  <Caption style={{ color: "var(--tg-theme-hint-color)" }}>
                    {formatDateShort(new Date(pro.promo_ends_at))}
                  </Caption>
                }
                description="Pro obunani bepul tarqatish"
                multiline
              >
                Aksiya amal qiladi
              </Cell>
              <Cell
                before={<span className="text-xl">📅</span>}
                after={
                  <Caption style={{ color: "var(--tg-theme-hint-color)" }}>
                    {pro.pro_days} kun
                  </Caption>
                }
                description="Obuna faollashtirilgandan keyin"
                multiline
              >
                Obuna muddati
              </Cell>
              <Cell
                before={<span className="text-xl">🪑</span>}
                after={
                  <Caption
                    style={{
                      color:
                        slotsLeft <= 20
                          ? "var(--tg-theme-destructive-text-color)"
                          : "var(--tg-theme-hint-color)",
                    }}
                  >
                    {slotsLeft} / {pro.total_slots}
                  </Caption>
                }
                description={
                  <div className="w-full mt-1.5">
                    <div
                      className="w-full rounded-full h-1.5"
                      style={{ background: "rgba(255,255,255,0.1)" }}
                    >
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${(slotsLeft / pro.total_slots) * 100}%`,
                          background:
                            slotsLeft <= 20
                              ? "var(--tg-theme-destructive-text-color)"
                              : "var(--tg-theme-accent-text-color)",
                        }}
                      />
                    </div>
                  </div>
                }
                multiline
              >
                Bo'sh joylar
              </Cell>
            </Section>

            <Button
              size="m"
              stretched
              loading={claimMutation.isPending}
              onClick={handleActivate}
            >
              Obunani faollashtirish
            </Button>
          </>
        )}

        <Section
          className="rounded-section"
          header="Shuningdek foydali bo'lishi mumkin"
        >
          <Cell
            before={<span className="text-xl">🎬</span>}
            after={
              <ExportIcon
                width={20}
                height={20}
                style={{ color: "var(--tg-theme-hint-color)" }}
              />
            }
            description="Professional video muharrir"
            multiline
            onClick={() => openTelegramLink("https://t.me/FreeGo_uz/36")}
          >
            CapCut Pro sotib olish
          </Cell>
          <Cell
            before={<span className="text-xl">🤖</span>}
            after={
              <ExportIcon
                width={20}
                height={20}
                style={{ color: "var(--tg-theme-hint-color)" }}
              />
            }
            description="OpenAI'ning kuchli AI-yordamchisi"
            multiline
            onClick={() => openTelegramLink("https://t.me/FreeGo_uz/36")}
          >
            ChatGPT Plus sotib olish
          </Cell>
        </Section>
      </List>

      {snackbar === "success" && (
        <Snackbar
          before={<span className="text-xl">⚡️</span>}
          duration={3000}
          onClose={() => setSnackbar(null)}
        >
          Pro obuna faollashtirildi!
        </Snackbar>
      )}
      {snackbar === "error" && (
        <Snackbar
          before={<span className="text-xl">❌</span>}
          duration={3000}
          onClose={() => setSnackbar(null)}
        >
          Xatolik yuz berdi. Qayta urinib ko'ring.
        </Snackbar>
      )}
    </>
  );
};
