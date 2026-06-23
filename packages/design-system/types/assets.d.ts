declare module "*.png" {
  import type { StaticImageData } from "next/image";

  const source: StaticImageData;
  export default source;
}

declare module "*.svg" {
  import type { StaticImageData } from "next/image";

  const source: StaticImageData;
  export default source;
}
