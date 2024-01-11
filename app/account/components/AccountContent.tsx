"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useUser } from "@/hooks/useUser";
import { postData } from "@/libs/helpers";
import useSubscribeModal from "@/hooks/useSubscribeModal";
import Button from "@/components/Button";

const AccountContent = () => {
  const router = useRouter();
  const { onOpen } = useSubscribeModal();
  const { isLoading, user, subscription } = useUser();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  const redirectToCustomerPortal = useCallback(async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: "/api/create-portal-link",
      });
      window.location.assign(url);
    } catch (error) {
      toast.error((error as Error)?.message);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  return (
    <div className="mb-7 px-6">
      {!subscription && (
        <div className="flex flex-col gap-y-4">
          <p>No active plan.</p>
          <Button onClick={onOpen} className="w-[300px]">
            Subscribe
          </Button>
        </div>
      )}
      {subscription && (
        <div className="flex flex-col gap-y-4">
          <p>
            You are currently on the <b>{subscription?.prices?.products?.name}</b> plan
          </p>
          <Button
            className="w-[300px]"
            disabled={loading || isLoading}
            onClick={redirectToCustomerPortal}
          >
            Open customer portal
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccountContent;
