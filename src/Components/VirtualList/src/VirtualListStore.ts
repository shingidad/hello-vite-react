import { action, autorun, computed, makeObservable, observable } from 'mobx';
import React from 'react';

const nonNan = (num: number): number => (isNaN(num) ? 0 : num);

const createNumList = (count: number, startIndex: number = 0) =>
  Array.from({ length: count }, (_, i) => i + startIndex);

export class VirtualListStore {
  /**
   * Dom에 높이
   */
  @observable
  public height: number = 0;

  /**
   * 줄 높이
   */
  @observable
  public rowHeight: number = 0;

  /**
   * Scrop Top(Y)
   */
  @observable
  public scrollTop: number = 0;

  /**
   * Row 최대 갯수
   */
  @observable
  public totalRow: number = 0;

  /**
   * Index 를 답는 Map
   */
  @observable
  public indexMap: Map<number, number> = new Map();

  /**
   * 화면에 보여지는 row에 갯수
   */
  @computed
  public get visibleRowCount() {
    if (this.rowHeight === 0 || this.height === 0) {
      return 0;
    }
    const count = this.height / this.rowHeight;
    if (isNaN(count) || count === 0) {
      return 0;
    }
    return Math.ceil(count) + 1;
  }

  @computed
  public get lastIndex() {
    return Math.max(this.totalRow - this.visibleRowCount, 0);
  }

  @computed
  public get index() {
    const nextIndex = Math.floor(this.scrollTop / this.rowHeight);

    return nextIndex >= this.lastIndex ? this.lastIndex : nextIndex;
  }

  @observable
  public indexList: number[] = [];

  constructor() {
    makeObservable(this);
    autorun(() => {
      const gap = this.visibleRowCount;
      const index = this.index;

      const beforeRowIndex = Math.floor(index / gap);
      const colIndex = Math.floor(index % gap);

      const afterRowIndex =
        colIndex === 0 ? beforeRowIndex : beforeRowIndex + 1;
      const leftIndex = afterRowIndex * gap;
      const LeftEndIndex = leftIndex + colIndex;
      const rightIndex = nonNan(beforeRowIndex * gap + colIndex);
      const rightEndIndex = nonNan(
        rightIndex + (gap - (LeftEndIndex - leftIndex))
      );

      this.setIndexList([
        ...createNumList(LeftEndIndex - leftIndex, leftIndex),
        ...createNumList(rightEndIndex - rightIndex, rightIndex),
      ]);
    });
  }

  @action
  private setIndexList(nextIndexList: number[]) {
    nextIndexList.forEach((value, index) => {
      this.indexMap.set(index, value);
    });
  }
}

const VirtualListContext = React.createContext<VirtualListStore>(
  new VirtualListStore()
);

export const VirtualListProvider = VirtualListContext.Provider;

export const useVirtualListSelector = () =>
  React.useContext(VirtualListContext);
