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
