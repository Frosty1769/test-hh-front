import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ItemGetOut } from "../../interfaces/Item";
import Item from "../Item";
import { memo } from "react";

interface Props {
    id: string
    index: number
    item: ItemGetOut
    items: ItemGetOut[]
    onChangeItem: (item: ItemGetOut) => void
    isDragging: boolean
    draggable: boolean
}

const SortableItem = memo(({ id, item, ...props }: Props) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id, disabled: !props.draggable });
  
    const itemStyle = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 1 : 0,
      opacity: isDragging ? 0.8 : 1,
    };
  
    return (
      <div ref={setNodeRef} className="flex p-1 justify-center" style={itemStyle} {...attributes} {...listeners}
      data-index={props.index}
      >
        <Item
            ref={setNodeRef}
            {...props}
            item={item}
            isOverlay={false}
            isDragging={props.isDragging}
            aria-describedby="Draggable Item"
        />
      </div>
    );
  });


export default SortableItem;