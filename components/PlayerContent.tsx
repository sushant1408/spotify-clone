"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerXMark, HiSpeakerWave } from "react-icons/hi2";
import useSound from "use-sound";

import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = useCallback(() => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }

    player.setId(nextSong);
  }, [player]);

  const onPlayPrev = useCallback(() => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const prevSong = player.ids[currentIndex - 1];

    if (!prevSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(prevSong);
  }, []);

  const [play, { pause, sound }] = useSound(songUrl, {
    volume: volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
      onPlayNext();
    },
    onpause: () => setIsPlaying(false),
    format: ["mp3"],
  });

  useEffect(() => {
    sound?.play();

    return () => {
      sound?.unload();
    };
  }, [sound]);

  const handlePlay = useCallback(() => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  }, [isPlaying, play, pause]);

  const toggelMute = useCallback(() => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  }, [volume, setVolume]);

  return (
    <div
      className="
        grid
        grid-cols-2
        md:grid-cols-3
        h-full
      "
    >
      <div
        className="
          flex
          w-full
          justify-start
        "
      >
        <div className="flex items-center gap-x-4">
          <MediaItem data={song} onClick={() => {}} />
          <LikeButton songId={song.id} />
        </div>
      </div>

      <div
        className="
          flex
          md:hidden
          col-auto
          w-full
          justify-end
          items-center
        "
      >
        <div
          onClick={handlePlay}
          className="
            h-10
            w-10
            flex
            items-center
            justify-center
            rounded-full
            bg-white
            p-1
            cursor-pointer
          "
        >
          <Icon className="text-black" size={30} />
        </div>
      </div>

      <div
        className="
          hidden
          h-full
          md:flex
          items-center
          justify-center
          w-full
          max-w-[722px]
          gap-x-6
        "
      >
        <AiFillStepBackward
          size={30}
          className="
            text-neutral-400
            cursor-pointer
            hover:text-white
            transition
          "
          onClick={onPlayPrev}
        />
        <div
          onClick={handlePlay}
          className="
            flex
            items-center
            justify-center
            rounded-full
            h-10
            w-10
            bg-white
            p-1
            cursor-pointer
          "
        >
          <Icon className="text-black" size={30} />
        </div>
        <AiFillStepForward
          size={30}
          className="
            text-neutral-400
            cursor-pointer
            hover:text-white
            transition
          "
          onClick={onPlayNext}
        />
      </div>

      <div
        className="
          hidden
          md:flex
          w-full
          justify-end
          pr-2
        "
      >
        <div
          className="
            flex
            items-center
            gap-x-2
            w-[120px]
          "
        >
          <VolumeIcon
            size={30}
            onClick={toggelMute}
            className="cursor-pointer"
          />
          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
