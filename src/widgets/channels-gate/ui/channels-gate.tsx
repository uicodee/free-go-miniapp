import { useState } from "react";
import {
  Modal,
  Button,
  List,
  Section,
  Cell,
  Title,
  Text,
} from "@telegram-apps/telegram-ui";
import {
  openTelegramLink,
  hapticFeedback,
  retrieveRawInitData,
} from "@tma.js/sdk-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getChannels } from "@/shared/api/generated/channels/channels";
import type { ChannelDto } from "@/shared/api/model";
import ExportIcon from "@/assets/export.svg?react";

interface ChannelsGateProps {
  children: React.ReactNode;
}

export const ChannelsGate = ({ children }: ChannelsGateProps) => {
  const initDataRaw = retrieveRawInitData();
  const queryClient = useQueryClient();
  const [checking, setChecking] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["channels-status"],
    queryFn: () =>
      getChannels().channelsControllerGetStatus({
        headers: { Authorization: initDataRaw },
      }),
    refetchOnWindowFocus: false,
  });

  const handleCheck = async () => {
    hapticFeedback.impactOccurred("medium");
    setChecking(true);
    await queryClient.refetchQueries({ queryKey: ["channels-status"] });
    setChecking(false);
  };

  const handleOpenChannel = (channel: ChannelDto) => {
    hapticFeedback.impactOccurred("light");
    openTelegramLink(channel.url);
  };

  if (isLoading) return null;

  const isBlocked = data !== undefined && !data.subscribed;
  const missing = data?.missing ?? [];

  return (
    <>
      {children}
      <Modal
        open={isBlocked}
        onOpenChange={() => {}}
        dismissible={false}
        header={
          <Modal.Header>
            <Title level="3" weight="2">
              Kanalga obuna bo'ling
            </Title>
          </Modal.Header>
        }
      >
        <List>
          <div className="px-4 pb-3">
            <Text style={{ color: "var(--tg-theme-hint-color)" }}>
              Ilovadan foydalanish uchun quyidagi kanallarga obuna bo'ling:
            </Text>
          </div>

          <Section>
            {missing.map((channel) => (
              <Cell
                key={channel.channel_id}
                before={<span className="text-2xl">📢</span>}
                after={
                  <ExportIcon
                    width={20}
                    height={20}
                    style={{ color: "var(--tg-theme-accent-text-color)" }}
                  />
                }
                onClick={() => handleOpenChannel(channel)}
              >
                {channel.title}
              </Cell>
            ))}
          </Section>

          <div className="px-4 pt-3 pb-6">
            <Button
              size="l"
              stretched
              loading={checking}
              onClick={handleCheck}
              className="rounded-full!"
            >
              Obunani tekshirish
            </Button>
          </div>
        </List>
      </Modal>
    </>
  );
};
