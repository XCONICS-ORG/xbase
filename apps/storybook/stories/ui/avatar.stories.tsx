import type { Meta, StoryObj } from "@storybook/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@turtle/design-system/components/ui/avatar";
import { generateAvatarDataUri } from "@turtle/utility/generators/avatar";

const people = [
  "Suman Kumar",
  "Mira Shah",
  "Alex Morgan",
  "Priya Nair",
  "Noah Patel",
];

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export const Default: Story = {
  render: () => {
    const name = "Suman Kumar";

    return (
      <Avatar>
        <AvatarImage
          alt={name}
          src={generateAvatarDataUri({
            name,
            style: "initials",
          })}
        />
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
    );
  },
};

export const DiceBearStyles: Story = {
  render: () => {
    const name = "Suman Kumar";
    const styles = ["initials", "lorelei", "notionists", "shapes"] as const;

    return (
      <div className="flex items-center gap-3">
        {styles.map((style) => (
          <Avatar className="size-12" key={style}>
            <AvatarImage
              alt={`${name} ${style}`}
              src={generateAvatarDataUri({
                name,
                style,
              })}
            />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    );
  },
};

export const FromNames: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {people.map((name) => (
        <Avatar className="size-10" key={name}>
          <AvatarImage
            alt={name}
            src={generateAvatarDataUri({
              name,
              options: {
                backgroundColor: ["b6e3f4", "c0aede", "ffd5dc", "ffdfbf"],
              },
              style: "initials",
            })}
          />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};

export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage alt="Broken avatar" src="/missing-avatar.png" />
      <AvatarFallback>SK</AvatarFallback>
    </Avatar>
  ),
};
