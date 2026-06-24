// biome-ignore lint/performance/noBarrelFile: Next route wrapper for the shared bucket handler.
export {
  streamUploadObject as GET,
  streamUploadObject as HEAD,
} from "@xbase/bucket/next";
