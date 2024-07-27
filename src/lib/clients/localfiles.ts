import { get, set } from 'idb-keyval';

class LocalFiles {
	public handle: FileSystemDirectoryHandle | null;

	constructor() {
		this.handle = null;
	}

	async init(force = false) {
		if (force) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			this.handle = await (window as any).showDirectoryPicker({ mode: 'readwrite' });
			await set('localFolder', this.handle);
		} else {
			this.handle =
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(await get('localFolder')) || (await (window as any).showDirectoryPicker());
		}
		return this.handle;
	}

	async getFile(folder: string, filename: string) {
		await this.init();
		const folderHandle = await this.handle?.getDirectoryHandle(folder);
		const fileHandle = await folderHandle?.getFileHandle(filename);
		const file = await fileHandle?.getFile();

		return file as File;
	}

	async saveBase64File(folder: string, filename: string, base64: string) {
		await this.init();
		if (!this.handle) return;

		const folderHandle = await this.handle.getDirectoryHandle(folder, { create: true });

		//if the file already exists, return null
		try {
			await folderHandle.getFileHandle(filename + '.png');
			return null;
		} catch {
			//if the file does not exist, create

			const buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
			const fileHandle = await folderHandle.getFileHandle(filename + '.png', {
				create: true
			});
			const writable = await fileHandle.createWritable();
			await writable.write(buffer);
			await writable.close();
		}
	}

	async getMaxFileName(folder: string) {
		await this.init();
		if (!this.handle) return -1;

		const folderHandle = await this.handle.getDirectoryHandle(folder);
		const entries = [];

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		for await (const entry of (folderHandle as any).values()) {
			entries.push(entry);
		}

		return entries.length - 1;
	}
}

export const lf = new LocalFiles();
