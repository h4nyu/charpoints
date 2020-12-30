import { Lock, ErrorKind, Store } from ".";
import { Point } from "./point";
import { Box } from "./box";
import { v4 as uuid } from "uuid";

export enum State {
  Done = "Done",
  Todo = "Todo",
}

export type Image = {
  id: string; // Uuid
  data?: string; // base64 encoded string
  weight: number;
  boxCount: number;
  pointCount: number;
  state: State;
  loss?: number;
  createdAt: Date;
  updatedAt: Date;
};

export const Image = (): Image => {
  return {
    id: uuid(),
    state: State.Todo,
    boxCount: 0,
    pointCount: 0,
    weight: 1.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export type FilterPayload = {
  ids?: string[];
  state?: State;
};

export type CreatePayload = {
  data: string; //base64
};

export type UpdatePayload = {
  id: string;
  state: State;
  data?: string;
};
export type DeletePayload = {
  id: string;
};
export type FindPayload = {
  id: string;
};
export type Service = {
  create: (payload: CreatePayload) => Promise<string | Error>;
  delete: (payload: DeletePayload) => Promise<string | Error>;
  update: (payload: UpdatePayload) => Promise<string | Error>;
  find: (payload: FindPayload) => Promise<Image | Error>;
  filter: (payload: FilterPayload) => Promise<Image[] | Error>;
};

export const Service = (args: { store: Store; lock: Lock }): Service => {
  const { store, lock } = args;
  const filter = async (payload: FilterPayload) => {
    return await store.image.filter(payload);
  };
  const find = async (payload: FindPayload) => {
    const image = await store.image.find(payload);
    if (image instanceof Error) {
      return image;
    }
    if (image === undefined) {
      return new Error(ErrorKind.ImageNotFound);
    }
    return image;
  };

  const create = async (payload: CreatePayload) => {
    return await lock.auto(async () => {
      const { data } = payload;
      const row = {
        ...Image(),
        data,
      };
      const err = await store.image.insert(row);
      if (err instanceof Error) {
        return err;
      }
      return row.id;
    });
  };

  const update = async (payload: UpdatePayload) => {
    return await lock.auto(async () => {
      const { id, data } = payload;
      const row = await store.image.find({ id });
      if (row instanceof Error) {
        return row;
      }
      if (row === undefined) {
        return new Error(ErrorKind.ImageNotFound);
      }
      const next = {
        ...row,
        data: data || row.data,
        state: payload.state,
        updateAt: new Date(),
      };
      const err = await store.image.update(next);
      if (err instanceof Error) {
        return err;
      }
      return id;
    });
  };

  const delete_ = async (payload: DeletePayload) => {
    return await lock.auto(async () => {
      const { id } = payload;
      const row = await store.image.find({ id });
      if (row instanceof Error) {
        return row;
      }
      if (row === undefined) {
        return new Error(ErrorKind.ImageNotFound);
      }
      let err = await store.image.delete({ id });
      if (err instanceof Error) {
        return err;
      }
      err = await store.point.delete({ imageId: id });
      if (err instanceof Error) { return err; }
      err = await store.box.delete({ imageId: id });
      if (err instanceof Error) { return err; }
      return id;
    });
  };

  return {
    filter,
    update,
    delete: delete_,
    create,
    find,
  };
};