"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionContext } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";

import { Song } from "@/types";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface LikeButtonProps {
  songId: Song["id"];
}

const LikeButton: FC<LikeButtonProps> = ({ songId }) => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();
  const { onOpen: onAuthModalOpen } = useAuthModal();
  const { user } = useUser();

  const [isLiked, setIsLiked] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    const { data, error } = await supabaseClient
      .from("liked_songs")
      .select("*")
      .eq("user_id", user.id)
      .eq("song_id", songId)
      .single();

    if (!error && data) {
      setIsLiked(true);
    }
  }, [user, supabaseClient, songId]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songId, supabaseClient, user?.id]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = useCallback(async () => {
    if (!user) {
      return onAuthModalOpen();
    }

    if (isLiked) {
      const { error } = await supabaseClient
        .from("liked_songs")
        .delete()
        .eq("user_id", user?.id)
        .eq("song_id", songId);

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(false);
      }
    } else {
      const { error } = await supabaseClient.from("liked_songs").insert({
        song_id: songId,
        user_id: user?.id,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(true);
        toast.success("Liked!");
      }
    }

    router.refresh();
  }, [
    user,
    onAuthModalOpen,
    isLiked,
    setIsLiked,
    supabaseClient,
    router,
    songId,
  ]);

  return (
    <button
      className="
        hover:opacity-75
        transition
      "
      onClick={handleLike}
    >
      <Icon color={isLiked ? "#22c55e" : "white"} size={25} />
    </button>
  );
};

export default LikeButton;
