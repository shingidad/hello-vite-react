# [느린게 싫다면-03] React + Mobx 를 활용해 VirtualList 만들기



Web에서는 흔히 `VirtualList` 라고 부르며, 안드로이드에서는 [RecyclerView](https://developer.android.com/guide/topics/ui/layout/recyclerview?hl=ko), `Recycle ListView` 라고 한다.

왜 이런 `VirutalList` 등을 사용해야 하는지는 브라우저에 동작 방법을 이해하고 있다면, 쉽게 알 수 있습니다.([NAVER D2](https://d2.naver.com/helloworld/59361) 참고!)



만약 Scroll에 Row에 해당되는 Dom이 20,000개 정도라면, 이걸 단순 화면에 for...문으로 그리면 정말 말도 안돼며,
최적화 한다고 500개씩 로드 했다(Lazy) 하더라도 그건 초기 그리는 속도만 향상될 뿐이지, 전체적인 성능에는 큰 도움이 되지 않습니다.



**오늘은 Mobx 를 사용해서 이런 VirtualList 를 간단하게 만들어 보겠습니다.**



> Mobx와 Redux를 고민하는 분들이 가끔있는데, 서로 충돌하는 라이브러리도 아니며, 프로젝트에 맞게 사용하면 좋을 것 같습니다.
> 전 scenario 해당 되는 부분은 Redux, interactive에 해당되는 부분은 Mobx로 주로 개발합니다.



## 개발

간단한 개념을 위해서 만든 프로젝트이기에 여러 상황에 대해서는 처리 안했으며, 최대한 직관적으로만 작성했습니다.



```shell
yarn add mobx mobx-react styled-components
```



### 1. Store 생성

`src/Components/VirtualList/src/VirtualListStore.ts`

```typescript
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

```





### 2. Item / Body

`src/Components/VirtualList/src/VirtualListBody.tsx`

```tsx
import isEqual from 'fast-deep-equal';
import { observer } from 'mobx-react';
import React, { HTMLProps, useMemo } from 'react';
import styled from 'styled-components';
import { useVirtualListSelector } from './VirtualListStore';

interface RowItemProps
  extends Pick<HTMLProps<HTMLDivElement>, 'children' | 'className'> {
  rowHeight: number;
  index?: number;
}

const RowItem = styled(({ className, children }: RowItemProps) => {
  return <div className={className}>{children}</div>;
})`
  position: absolute;
  z-index: -1;
  left: 0;
  width: 100%;
  overflow: hidden;
  top: ${({ rowHeight, index = 0 }) => rowHeight * index}px;
  height: ${(props) => props.rowHeight}px;
  display: ${({ index = -1 }) => (index > -1 ? 'block' : 'none')};
`;

interface VirtualListItemProps {
  index: number;
  renderRow: (index: number) => React.ReactNode;
}

const VirtualListItem = observer((props: VirtualListItemProps) => {
  const { index, renderRow } = props;
  const { rowHeight, indexMap } = useVirtualListSelector();
  const data = indexMap.get(index);
  return (
    <RowItem rowHeight={rowHeight} index={data}>
      {typeof data === 'number' && renderRow(data)}
    </RowItem>
  );
});

interface ScrollBodyProps
  extends Pick<HTMLProps<HTMLDivElement>, 'children' | 'className'> {
  height: number;
}

const ScrollBody = styled(({ children, className }: ScrollBodyProps) => (
  <div className={className}>{children}</div>
))`
  position: relative;
  left: 0;
  top: 0;
  right: 0;
  height: ${({ height }) => height}px;
`;

interface VirtualListBodyProps
  extends Pick<VirtualListItemProps, 'renderRow'> {}

const VirtualListBody: React.FC<VirtualListBodyProps> = observer((props) => {
  const { renderRow } = props;
  const { visibleRowCount, totalRow: dataCount, rowHeight } = useVirtualListSelector();

  const bodyHeight = useMemo(
    () => dataCount * rowHeight,
    [rowHeight, dataCount]
  );

  return (
    <ScrollBody height={bodyHeight}>
      {Array.from({ length: visibleRowCount }, (_, i) => (
        <VirtualListItem key={i} index={i} renderRow={renderRow} />
      ))}
    </ScrollBody>
  );
});

export default React.memo(VirtualListBody, isEqual);

```







### 3. Container 

`src/Components/VirtualList/src/VirtualList.tsx`

```tsx
import isEqual from 'fast-deep-equal';
import React, { ComponentProps, useEffect, useRef } from 'react';
import styled from 'styled-components';
import VirtualListBody from './VirtualListBody';
import { VirtualListProvider, VirtualListStore } from './VirtualListStore';

interface VirtualListProps
  extends Pick<ComponentProps<typeof VirtualListBody>, 'renderRow'>,
    Pick<VirtualListStore, 'rowHeight' | 'totalRow'> {}

const RootContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const VirtualList: React.FC<VirtualListProps> = (props) => {
  const { rowHeight, totalRow, renderRow } = props;
  const refStore = useRef(new VirtualListStore());
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const { clientHeight } = ref.current;
    refStore.current.height = clientHeight;
    refStore.current.rowHeight = rowHeight;
  }, [rowHeight]);

  useEffect(() => {
    refStore.current.totalRow = totalRow;
  }, [totalRow]);

  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      refStore.current.scrollTop = e.currentTarget.scrollTop;
    },
    [refStore.current]
  );

  return (
    <VirtualListProvider value={refStore.current}>
      <RootContainer ref={ref} onScroll={handleScroll}>
        <VirtualListBody renderRow={renderRow} />
      </RootContainer>
    </VirtualListProvider>
  );
};

export default React.memo(VirtualList, isEqual);

```



### 4. 내보내기

`src/Components/VirtualList/index.ts`

```typescript
export { default as VirtualList } from './src/VirtualList';
```



`src/Components/index.ts`

```typescript
export * from './VirtualList';
```



### 5. 사용해보기

`src/Pages/src/AboutPage.tsx`

```tsx
// src/Pages/src/AboutPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { VirtualList } from '~/Components/VirtualList';

const ListContainer = styled.div`
  width: 360px;
  height: 500px;
`;

const randomColor = () =>
  '#' + Math.round(Math.random() * 0xffffff).toString(16);

const Item = styled.div`
  height: 100px;
  width: 100%;
  font-size: 48px;
  font-weight: bold;
`;

const AboutPage = () => {
  const [list, setList] = useState(Array.from({ length: 65000 }, (_, i) => i));

  const handleClick = () => {
    setList((beforeList) => {
      return [...beforeList, beforeList.length];
    });
  };

  return (
    <div>
      <button onClick={handleClick}>add row</button>
      <ListContainer>
        <VirtualList
          rowHeight={100}
          totalRow={list.length}
          renderRow={(index) => {
            return (
              <Item style={{ backgroundColor: randomColor() }}>{index}</Item>
            );
          }}
        />
      </ListContainer>
    </div>
  );
};

export default AboutPage;

```



65,000개 아이템을 그리더라도 실제 화면에는 6개에 Row만 존재해, 성능이 많이 개선됩니다.
