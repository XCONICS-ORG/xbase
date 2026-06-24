import type { Meta, StoryObj } from "@storybook/react";
import {
  GoogleMapPicker,
  type GoogleMapPickerProps,
  type GoogleMapPickerValue,
} from "@xbase/design-system/components/modules/featured";
import { useState } from "react";

const meta: Meta<typeof GoogleMapPicker> = {
  title: "Modules/Featured/GoogleMapPicker",
  component: GoogleMapPicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    address: "New Town, Kolkata, West Bengal, India",
    latitude: 22.5909,
    longitude: 88.4404,
    variant: "basic",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function GoogleMapPickerStory(args: GoogleMapPickerProps) {
  const initialLatitude =
    args.latitude === undefined || args.latitude === null
      ? null
      : Number(args.latitude);
  const initialLongitude =
    args.longitude === undefined || args.longitude === null
      ? null
      : Number(args.longitude);
  const [value, setValue] = useState<GoogleMapPickerValue | null>(
    initialLatitude !== null && initialLongitude !== null
      ? {
          address: args.address,
          latitude: initialLatitude,
          longitude: initialLongitude,
        }
      : null
  );

  return (
    <div className="w-[min(860px,calc(100vw-2rem))]">
      <GoogleMapPicker
        {...args}
        address={value?.address ?? args.address}
        latitude={value?.latitude ?? args.latitude}
        longitude={value?.longitude ?? args.longitude}
        onChange={setValue}
      />
    </div>
  );
}

export const Basic: Story = {
  args: {
    address: "New Town, Kolkata, West Bengal, India",
    latitude: 22.5909,
    longitude: 88.4404,
    variant: "basic",
  },
  render: (args) => <GoogleMapPickerStory {...args} />,
};

export const Visgl: Story = {
  args: {
    address: "New Town, Kolkata, West Bengal, India",
    latitude: 22.5909,
    longitude: 88.4404,
    variant: "visgl",
  },
  render: (args) => <GoogleMapPickerStory {...args} />,
};
