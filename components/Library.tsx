"use client";

import { FC, useCallback } from "react";
import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";
import { Song } from "@/types";
import MediaItem from "./MediaItem";
import useOnPlay from "@/hooks/useOnPlay";

interface LibraryProps {
  songs: Song[];
}

const Library: FC<LibraryProps> = ({ songs }) => {
  const { onOpen: onAuthModalOpen } = useAuthModal();
  const { onOpen: onUploadModalOpen } = useUploadModal();
  const { user } = useUser();

  const onPlay = useOnPlay(songs);

  const onClick = useCallback(() => {
    if (!user) {
      return onAuthModalOpen();
    }

    return onUploadModalOpen();
  }, [user, onAuthModalOpen, onUploadModalOpen]);

  return (
    <div className="flex flex-col">
      <div
        className="
          flex
          items-center
          justify-between
          px-5
          pt-4
        "
      >
        <div
          className="
            inline-flex
            items-center
            gap-x-2
          "
        >
          <TbPlaylist size={26} className="text-neutral-400" />
          <p
            className="
              text-neutral-400
              font-medium
              text-md
            "
          >
            Your Library
          </p>
        </div>
        <AiOutlinePlus
          onClick={onClick}
          size={20}
          className="
            text-neutral-400 
            cursor-pointer 
            hover:text-white 
            transition
          "
        />
      </div>
      <div
        className="
          flex
          flex-col
          gap-y-2
          mt-4
          px-3
        "
      >
        {songs.map((song) => (
          <MediaItem
            data={song}
            key={song.id}
            onClick={(id: Song["id"]) => onPlay(id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Library;
