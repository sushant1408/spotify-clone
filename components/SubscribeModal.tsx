"use client";

import { FC, useCallback, useState } from "react";
import toast from "react-hot-toast";

import { Price, ProductWithPrice } from "@/types";
import { useUser } from "@/hooks/useUser";
import { postData } from "@/libs/helpers";
import { getStripe } from "@/libs/stripeClient";
import Modal from "./Modal";
import Button from "./Button";
import useSubscribeModal from "@/hooks/useSubscribeModal";

interface SubscribeModalProps {
  products: ProductWithPrice[];
}

const formatPrice = (price: Price) => {
  const priceString = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format((price?.unit_amount || 0) / 100);

  return priceString;
};

const SubscribeModal: FC<SubscribeModalProps> = ({ products }) => {
  const { isOpen, onClose } = useSubscribeModal();
  const { user, isLoading, subscription } = useUser();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const handleCheckout = useCallback(
    async (price: Price) => {
      setPriceIdLoading(price.id);

      if (!user) {
        setPriceIdLoading(undefined);
        return toast.error("Must be logged in");
      }

      if (subscription) {
        setPriceIdLoading(undefined);
        return toast("Already subscribed");
      }

      try {
        const { sessionId } = await postData({
          url: "/api/create-checkout-session",
          data: { price },
        });
        const stripe = await getStripe();
        stripe?.redirectToCheckout({ sessionId });
      } catch (error) {
        toast.error((error as Error)?.message);
      } finally {
        setPriceIdLoading(undefined);
      }
    },
    [setPriceIdLoading, user, subscription, postData, getStripe]
  );

  const onChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose();
      }
    },
    [onClose]
  );

  let content = <div className="text-center">No products available.</div>;

  if (products.length) {
    content = (
      <div>
        {products.map((product) => {
          if (!product.prices?.length) {
            return <div key={product.id}>No prices available.</div>;
          }

          return product.prices.map((price) => (
            <Button
              key={price.id}
              disabled={isLoading || price.id === priceIdLoading}
              onClick={() => handleCheckout(price)}
              className="mb-2"
            >
              {`Subscribe to ${product.name} for ${formatPrice(price)}/${
                price.interval
              }`}
            </Button>
          ));
        })}
      </div>
    );
  }

  if (subscription) {
    content = <div className="text-center">Already subscribed</div>;
  }

  return (
    <Modal
      title="Only for premium users"
      description="Listen to music with Spotify Clone"
      isOpen={isOpen}
      onChange={onChange}
    >
      {content}
    </Modal>
  );
};

export default SubscribeModal;
