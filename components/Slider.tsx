"use client";

import * as RadixSlider from "@radix-ui/react-slider";
import { FC, useCallback } from "react";

interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
}

const Slider: FC<SliderProps> = ({ onChange, value = 1 }) => {
  const handleChange = useCallback(
    (newValue: number[]) => {
      onChange?.(newValue[0]);
    },
    [onChange]
  );

  return (
    <RadixSlider.Root
      className="
        relative
        flex
        items-center
        select-none
        touch-none
        w-full
        h-10
      "
      defaultValue={[1]}
      value={[value]}
      onValueChange={handleChange}
      max={1}
      step={0.1}
      aria-label="volume"
    >
      <RadixSlider.Track
        className="
          bg-neutral-600
          relative
          grow
          rounded-full
          h-[3px]
        "
      >
        <RadixSlider.Range 
          className="
            absolute
            bg-white
            rounded-full
            h-full
          "
        />
      </RadixSlider.Track>
    </RadixSlider.Root>
  );
};

export default Slider;
