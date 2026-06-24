import type { Meta, StoryObj } from "@storybook/react";
import { SkeletonWrapper } from "@xbase/design-system/components/modules/skeleton";
import type { ComponentProps } from "react";

type SkeletonBones = NonNullable<
  ComponentProps<typeof SkeletonWrapper>["initialBones"]
>;

const profileCardBones: SkeletonBones = {
  name: "storybook-profile-card",
  viewportWidth: 360,
  width: 360,
  height: 156,
  bones: [
    [4.44, 16, 11.12, 40, "50%"],
    [18.89, 18, 36.67, 14, 4],
    [18.89, 40, 56.67, 12, 4],
    [4.44, 76, 91.12, 12, 4],
    [4.44, 98, 78.89, 12, 4],
    [4.44, 124, 24.45, 24, 6],
    [31.11, 124, 28.89, 24, 6],
  ],
};

const articleCardBones: SkeletonBones = {
  name: "storybook-article-card",
  viewportWidth: 360,
  width: 360,
  height: 236,
  bones: [
    [0, 0, 100, 236, 8, true],
    [4.44, 16, 91.12, 112, 6],
    [4.44, 148, 52.23, 16, 4],
    [4.44, 174, 87.78, 12, 4],
    [4.44, 196, 72.23, 12, 4],
  ],
};

const wrapperClassName = "w-[360px]";
const cardWrapperClassName = "w-[360px] rounded-lg border";

const meta: Meta<typeof SkeletonWrapper> = {
  title: "Modules/Skeleton/Wrapper",
  component: SkeletonWrapper,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    loading: true,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;
type SkeletonWrapperProps = ComponentProps<typeof SkeletonWrapper>;

type SkeletonPreviewProps = SkeletonWrapperProps & {
  children: SkeletonWrapperProps["children"];
};

function SkeletonPreview({
  children,
  className = wrapperClassName,
  ...props
}: SkeletonPreviewProps) {
  return (
    <SkeletonWrapper className={className} {...props}>
      {children}
    </SkeletonWrapper>
  );
}

function ProfileCard() {
  return (
    <article className="w-[360px] rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-muted" />
        <div className="grid gap-1.5">
          <h3 className="font-medium text-sm">Suman Mondal</h3>
          <p className="text-muted-foreground text-xs">Workspace owner</p>
        </div>
      </div>
      <p className="mt-4 text-muted-foreground text-sm">
        Reviewing workspace access, member permissions, and active sessions.
      </p>
      <div className="mt-4 flex gap-2">
        <span className="rounded-md border px-3 py-1 text-xs">Review</span>
        <span className="rounded-md border px-3 py-1 text-xs">Message</span>
      </div>
    </article>
  );
}

function ArticleCard() {
  return (
    <article className="w-[360px] rounded-lg border p-4">
      <div className="h-28 rounded-md bg-muted" />
      <h3 className="mt-5 font-medium text-base">System activity report</h3>
      <p className="mt-3 text-muted-foreground text-sm">
        A compact card layout that uses captured bones for media and text.
      </p>
    </article>
  );
}

export const Preview: Story = {
  name: "Preview",
  render: (args) => (
    <SkeletonPreview
      {...args}
      boneClassName="rounded-md"
      initialBones={articleCardBones}
    >
      <ArticleCard />
    </SkeletonPreview>
  ),
};

export const ProfileLoading: Story = {
  render: (args) => {
    const className = args.loading === false ? wrapperClassName : cardWrapperClassName;

    return (
      <SkeletonPreview
        {...args}
        className={className}
        initialBones={profileCardBones}
      >
        <ProfileCard />
      </SkeletonPreview>
    );
  },
};

export const Loaded: Story = {
  args: {
    loading: false,
  },
  render: (args) => (
    <SkeletonPreview {...args} initialBones={profileCardBones}>
      <ProfileCard />
    </SkeletonPreview>
  ),
};
