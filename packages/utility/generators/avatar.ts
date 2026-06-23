import {
  adventurer,
  avataaars,
  bottts,
  funEmoji,
  identicon,
  initials,
  lorelei,
  notionists,
  shapes,
  thumbs,
} from "@dicebear/collection";
import { createAvatar, type Options, type Style } from "@dicebear/core";

const avatarStyles = {
  adventurer: adventurer as Style<Record<string, unknown>>,
  avataaars: avataaars as Style<Record<string, unknown>>,
  bottts: bottts as Style<Record<string, unknown>>,
  funEmoji: funEmoji as Style<Record<string, unknown>>,
  identicon: identicon as Style<Record<string, unknown>>,
  initials: initials as Style<Record<string, unknown>>,
  lorelei: lorelei as Style<Record<string, unknown>>,
  notionists: notionists as Style<Record<string, unknown>>,
  shapes: shapes as Style<Record<string, unknown>>,
  thumbs: thumbs as Style<Record<string, unknown>>,
};

export type AvatarStyleName = keyof typeof avatarStyles;
export type AvatarOptions = Partial<Options> & Record<string, unknown>;

export const avatarStyleNames = Object.keys(avatarStyles) as AvatarStyleName[];

export interface GenerateAvatarOptions {
  name: string;
  options?: AvatarOptions;
  size?: number;
  style?: AvatarStyleName;
}

function getStyle(style: AvatarStyleName) {
  return avatarStyles[style];
}

export function generateAvatar({
  name,
  options,
  size = 128,
  style = "initials",
}: GenerateAvatarOptions) {
  return createAvatar(getStyle(style), {
    seed: name,
    size,
    ...options,
  });
}

export function generateAvatarSvg(options: GenerateAvatarOptions) {
  return generateAvatar(options).toString();
}

export function generateAvatarDataUri(options: GenerateAvatarOptions) {
  return generateAvatar(options).toDataUri();
}
