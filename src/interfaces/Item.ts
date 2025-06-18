export interface ItemGetOut {
    id: string,
    order: number,
    text: string,
    isSelected: boolean
}
export interface ItemUpdIn {
    id: string,
    isSelected: boolean
}
export interface MoveUpdIn {
    prevInd: number,
    newInd: number,
}