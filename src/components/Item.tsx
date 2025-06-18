import clsx from 'clsx'; 
import { forwardRef, type HTMLAttributes } from 'react';
import type { ItemGetOut } from '../interfaces/Item';
import Checkbox from './input/Checkbox';
import { checkItem } from '../api/functions';

type ItemProps = HTMLAttributes<HTMLDivElement> & {
    item: ItemGetOut;
    onChangeItem?: (item: ItemGetOut) => void
    withOpacity?: boolean;
    isDragging?: boolean;
    isOverlay?: boolean
};

const Item = forwardRef<HTMLDivElement, ItemProps>(({isDragging, isOverlay, style, ...props }, ref) => {

    const handleCheckItem = (checked: boolean) => {
        props.onChangeItem?.({...props.item, isSelected: checked})
        checkItem(props.item.id, {id: props.item.id, isSelected: checked}, ()=> {})
    }

    return <div 
			ref={ref} 
			className={
				clsx(
					(
						isDragging 
						? 'cursor-grabbing text-white' 
						: 'cursor-grab text-white' 
					)
				, 
                isDragging && !isOverlay && 'opacity-0',
				`
                border-gray-400 border
				rounded-lg shadow-sm cursor-pointer  
				text-center flex justify-center gap-4 items-center
				h-24
				select-none
				y-50`,
                'w-[500px] max-h-[64px] p-5 rounded-2xl text-black ', isOverlay ? 'bg-cyan-900':'bg-cyan-700 '
			)}
			style={{
				...style,
			}}
		{...props}>
                <Checkbox checked={props.item.isSelected} onCheckedChange={handleCheckItem}/>
                {props.item.text}
		</div>;
});

// 👇️ set display name (Fixes TypeScript issue)
Item.displayName = 'Item';

export default Item;