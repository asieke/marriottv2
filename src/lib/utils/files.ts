import { get } from 'idb-keyval';

export const downloadBase64File = async (folder: string, filename: string, file: string) => {
	const localHandle = await get('localFolder');
	if (!localHandle) return;

	const folderHandle = await localHandle.getDirectoryHandle(folder, { create: true });

	const buffer = Uint8Array.from(atob(file), (c) => c.charCodeAt(0));
	const fileHandle = await folderHandle.getFileHandle(filename + '.png', {
		create: true
	});
	const writable = await fileHandle.createWritable();
	await writable.write(buffer);
	await writable.close();
};
