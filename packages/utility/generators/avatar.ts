import { Avatar, Style, type StyleDefinition } from "@dicebear/core";
import adventurerDefinition from "@dicebear/styles/adventurer.json";
import avataaarsDefinition from "@dicebear/styles/avataaars.json";
import botttsDefinition from "@dicebear/styles/bottts.json";
import funEmojiDefinition from "@dicebear/styles/fun-emoji.json";
import identiconDefinition from "@dicebear/styles/identicon.json";
import initialsDefinition from "@dicebear/styles/initials.json";
import loreleiDefinition from "@dicebear/styles/lorelei.json";
import notionistsDefinition from "@dicebear/styles/notionists.json";
import shapeGridDefinition from "@dicebear/styles/shape-grid.json";
import thumbsDefinition from "@dicebear/styles/thumbs.json";

const avatarStyles = {
  adventurer: new Style(adventurerDefinition as StyleDefinition),
  avataaars: new Style(avataaarsDefinition as StyleDefinition),
  bottts: new Style(botttsDefinition as StyleDefinition),
  funEmoji: new Style(funEmojiDefinition as StyleDefinition),
  identicon: new Style(identiconDefinition as StyleDefinition),
  initials: new Style(initialsDefinition as StyleDefinition),
  lorelei: new Style(loreleiDefinition as StyleDefinition),
  notionists: new Style(notionistsDefinition as StyleDefinition),
  shapegrid: new Style(shapeGridDefinition as StyleDefinition),
  thumbs: new Style(thumbsDefinition as StyleDefinition),
};

export type AvatarStyleName = keyof typeof avatarStyles;
export type AvatarOptions = Record<string, unknown>;

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
  return new Avatar(getStyle(style), {
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
