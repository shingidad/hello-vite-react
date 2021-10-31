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
