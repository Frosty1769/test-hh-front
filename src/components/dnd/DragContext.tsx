import { closestCenter, DndContext, DragOverlay, MouseSensor, rectIntersection, TouchSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Item from "../Item";
import React, { useCallback, useEffect, useState, type Dispatch, type FC, type SetStateAction } from "react";
import type { ItemGetOut } from "../../interfaces/Item";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import SortableItem from "./SortableItem";
import { moveItem } from "../../api/functions";
import { FixedSizeList } from "react-window";
import { Virtuoso } from "react-virtuoso";

interface Props {
    items: ItemGetOut[]
    setItems: Dispatch<SetStateAction<ItemGetOut[]>>
    onScroll: ()=>void
    onSearchDebounced: (search: string) => void
}

const DragContext = (props: Props) => {
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const [items, setItems] = useState<ItemGetOut[]>(props.items);
    const [search, setSearch] = useState<string>('');


    const sensors = useSensors(
        useSensor(TouchSensor, { activationConstraint: { distance: 8 } }),
        useSensor(MouseSensor, { activationConstraint: { distance: 8 } })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveIndex(items.findIndex((item) => item.id === event.active.id));
        console.log(items.findIndex((item) => item.id === event.active.id))
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over?.id);
            setItems(
                (its) => arrayMove(its, oldIndex, newIndex)
            );
            moveItem({ prevInd: oldIndex, newInd: newIndex }, () => {})
        }
        setActiveIndex(-1);
    }
    const handleDragCancel = useCallback(() => {
        setActiveIndex(-1);
    }, []);

    useEffect(() => {
        setItems([...props.items])
    }, [props.items])

    useEffect(() => {
        const getData = setTimeout(() => {
            props.onSearchDebounced(search);
        }, 100);

        return () => clearTimeout(getData);
    }, [search]);

    return (
        <>
            <div className="h-[100px] w-full flex justify-center border-b border-amber-100 py-5">
                <span className="flex justify-center  border rounded-2xl border-cyan-900  overflow-hidden">
                    <span className="w-[300px]">
                        <input className="px-4 w-full h-full focus-visible:outline-none" 
                            onChange={(e)=>setSearch(e.target.value)}
                        />
                    </span>
                    <button className="!bg-cyan-900 w-14 rounded-2xl focus:!outline-none focus-visible:!outline-none">
                        🔍
                    </button>
                </span>
            </div>
            <DndContext
                key={'1awdawdawd'}
                sensors={sensors}
                collisionDetection={rectIntersection}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <SortableContext key={"12"} items={items} strategy={verticalListSortingStrategy}>
                    <Virtuoso
                        style={{ height: window.innerHeight-100, width: '100%'}} // Явно задаём ширину
                        className="flex flex-col gap-5"
                        components={{
                            Item: ({ children, ...props }) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        width: '100%', // Фиксим нулевую ширину
                                        overflow: 'visible' // Важно для корректного отображения при перетаскивании
                                    }}
                                >
                                    {children}
                                </div>
                            ),
                            List: React.forwardRef(({ style, children }, ref) => (
                                <div ref={ref} style={{ ...style, width: '100%' }}>
                                    {children}
                                </div>
                            ))
                        }}
                        endReached={props.onScroll}
                        totalCount={items.length}
                        itemContent={(index) => (
                            <SortableItem
                                draggable={!search}
                                index={index}
                                key={items[index].id}
                                id={items[index].id}
                                item={items[index]}
                                items={items}
                                onChangeItem={(it) => setItems([...items.slice(0, index), it, ...items.slice(index + 1)])}
                                isDragging={activeIndex !== -1 ? items[activeIndex].id === items[index].id : false}
                            />
                        )}
                    />
                </SortableContext>

                {activeIndex !== -1 && <DragOverlay>
                    <div className="flex p-1 justify-center">
                        <Item
                            isOverlay
                            isDragging
                            item={items[activeIndex]}
                        />
                    </div>
                </DragOverlay>}
            </DndContext>
        </>
    );
};

export default DragContext