export { ErrorKind } from "./error";
import { Image } from "./image";
import { Point } from "./point";
import { Box } from "./box";
import { CropFn } from "./transform"

export type ImageStore = {
  filter: (payload: {
    ids?: string[];
    hasBox?: boolean;
    hasPoint?: boolean;
  }) => Promise<Image[] | Error>;
  find: (payload: { id?: string, hasData?: boolean }) => Promise<Image | undefined | Error>;
  update: (payload: Image) => Promise<void | Error>;
  has: (payload:{id?:string}) => Promise<boolean | Error>;
  insert: (payload: Image) => Promise<void | Error>;
  delete: (payload: { id?: string }) => Promise<void | Error>;
  replace: (payload: Image) => Promise<void | Error>;
  clear: () => Promise<void | Error>;
};

export type PointStore = {
  filter: (payload: {
    imageId?: string;
  }) => Promise<Point[] | Error>;
  load: (payload: Point[]) => Promise<void | Error>;
  delete: (payload: {
    imageId?: string;
  }) => Promise<void | Error>;
  clear: () => Promise<void | Error>;
};

export type BoxStore = {
  filter: (payload: {
    imageId?: string;
  }) => Promise<Box[] | Error>;
  load: (payload: Box[]) => Promise<void | Error>;
  delete: (payload: {
    imageId?: string;
  }) => Promise<void | Error>;
  clear: () => Promise<void | Error>;
};

export type Lock = {
  auto: <T>(fn: () => Promise<T>) => Promise<T>;
};

export type Store = {
  image: ImageStore;
  point: PointStore;
  box: BoxStore;
  crop: CropFn
};
