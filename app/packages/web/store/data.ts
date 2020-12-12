import { observable } from "mobx";
import { CharImages, Points } from ".";
import { Map, List } from "immutable";
import { ErrorStore } from "./error";
import { RootApi } from "@charpoints/api";
import { LoadingStore } from "./loading";
import { State as ImageState } from "@charpoints/core/charImage"
import { MemoryRouter } from "react-router";
import dayjs from "dayjs";

export type DataStore = {
  state: State;
  fetchCharImages: (payload: { ids?: string[] }) => Promise<void>;
  deleteChartImage: (id: string) => Promise<void>;
  init: () => Promise<void>;
};
type State = {
  charImages: CharImages;
};
const State = (): State => {
  return {
    charImages: Map(),
  };
};
export const DataStore = (args: {
  api: RootApi;
  loading: LoadingStore;
  error: ErrorStore;
}): DataStore => {
  const { api, loading, error } = args;
  const state = observable(State());

  const fetchCharImages = async (payload: {
    ids?: string[];
    state?: ImageState;
  }): Promise<void> => {
    const rows = await api.charImage.filter(payload);
    if (rows instanceof Error) {
      return;
    }
    const reqs = rows.map((x) => api.charImage.find({ id: x.id }));
    await loading.auto(async () => {
      for (const req of reqs) {
        const row = await req;
        if (row instanceof Error) {
          error.notify(row);
          continue;
        }
        state.charImages = state.charImages.set(row.id, row);
      }
    });
  };

  const deleteChartImage = async (id: string): Promise<void> => {
    const { charImages } = state;
    const err = await api.charImage.delete({ id });
    if (err instanceof Error) {
      return;
    }
    state.charImages = charImages.delete(id);
  };

  const init = async () => {
    await loading.auto(async () => {
      await fetchCharImages({state:ImageState.Todo});
    });
  };
  return {
    state,
    fetchCharImages,
    deleteChartImage,
    init,
  };
};
