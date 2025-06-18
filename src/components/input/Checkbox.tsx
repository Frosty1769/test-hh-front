import clsx from 'clsx';

interface IProps {
    checked: boolean
    onCheckedChange: (cheked: boolean) => void
}

const Checkbox = (props: IProps) => {
    return (
        <div
            onClick={()=>props.onCheckedChange(!props.checked)}
            className={clsx(
            'flex justify-center items-center select-none w-5 h-5 rounded-lg border border-gray-60 text-white text-[10px]', 
            props.checked ? "bg-green-400" : "bg-white"
        )}
        >
            ✔  
        </div>
    )
}

export default Checkbox;