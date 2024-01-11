import { Song } from "@/types";
import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";
import { useCallback } from "react";

const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  const { onOpen: onAuthModalOpen } = useAuthModal();
  const { user } = useUser();

  const onPlay = useCallback((id: string) => {
    if (!user) {
      return onAuthModalOpen();
    }

    player.setId(id);
    player.setIds(songs.map((song) => song.id));
  }, [user, onAuthModalOpen, player]);

  return onPlay;
};

export default useOnPlay;
