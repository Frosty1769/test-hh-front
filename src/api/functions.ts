import type { ResponseContainer } from "../interfaces/Base";
import type { ItemGetOut, ItemUpdIn, MoveUpdIn } from "../interfaces/Item";
import { getFullPath, getParamsString } from "../utils/path";
import { MAIN_URL, Path, requestGet, requestPost } from "./requester";

export function getItems(
	page: number,
	search: string = '',
	callback: (resp: ResponseContainer<ItemGetOut[]>) => void
) {
	requestGet<ResponseContainer<ItemGetOut[]>>(
		getFullPath(Path.Item, Path.All + getParamsString(page ? `page=${page}` : "", search ? `search=${search}` : "")),
		callback
	);
}
export function checkItem(
	id: string,
    item: ItemUpdIn,
	callback: (resp: ResponseContainer<null>) => void
) {
	requestPost<ResponseContainer<null>>(
		getFullPath(Path.Item, Path.Select, id),
        item,
		callback
	);
}

export function moveItem(
    data: MoveUpdIn,
	callback: (resp: ResponseContainer<null>) => void
) {
	requestPost<ResponseContainer<null>>(
		getFullPath(Path.Item, Path.Move),
        data,
		callback
	);
}