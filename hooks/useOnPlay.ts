import { Song } from "@/types";
import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";
import { useCallback } from "react";
import useSubscribeModal from "./useSubscribeModal";

const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  const { onOpen: onAuthModalOpen } = useAuthModal();
  const { onOpen: onSubscribeModalOpen } = useSubscribeModal();
  const { user, subscription } = useUser();

  const onPlay = useCallback(
    (id: string) => {
      if (!user) {
        return onAuthModalOpen();
      }

      if (!subscription) {
        return onSubscribeModalOpen();
      }

      player.setId(id);
      player.setIds(songs.map((song) => song.id));
    },
    [user, onAuthModalOpen, player, subscription, onSubscribeModalOpen]
  );

  return onPlay;
};

export default useOnPlay;
