import Dexie, { type EntityTable } from 'dexie';

export interface Photo {
	id: number;
	created: string;
	base64: string;
}

export interface Sentence {
	id: number;
	text: string;
	base64: string;
}

export interface Artist {
	id: number;
	name: string | null;
	description: string | null;
	short_description: string | null;
	category: string | null;
	region: string | null;
	start_year: string | null;
	end_year: string | null;
	base64: string | null;
}

export interface Art {
	id: number;
	artist_id: number;
	title: string;
	category: string | null;
	base64: string;
}

export interface Event {
	id: number;
	title: string;
	date: string;
	summary: string;
	facts: string[];
	questions: string[];
	base64: string;
}

export class MySubClassedDexie extends Dexie {
	photos!: EntityTable<Photo, 'id'>;
	sentences!: EntityTable<Sentence, 'id'>;
	artists!: EntityTable<Artist, 'id'>;
	arts!: EntityTable<Art, 'id'>;
	events!: EntityTable<Event, 'id'>;

	constructor() {
		super('LocalDB');
		this.version(1).stores({
			photos: '++id, base64, created', // primary key "id" (for the runtime!)
			sentences: '++id, base64, text', // primary key "id" (for the runtime!)
			artists:
				'++id, base64, name, description, short_description, category, region, start_year, end_year', // primary key "id" (for the runtime!)
			arts: '++id, base64, artist_id, title, category', // primary key "id" (for the runtime!)
			events: '++id, base64, title, date, summary' // primary key "id" (for the runtime!)
		});
	}

	async getRandomSentence() {
		const record = await this.sentences
			.orderBy('id')
			.offset(Math.floor(Math.random() * (await this.sentences.count())))
			.limit(1)
			.first();

		return record ? { ...record, base64: 'data:image/png;base64,' + record.base64 } : null;
	}

	async getRandomPhoto() {
		const record = await this.photos
			.orderBy('id')
			.offset(Math.floor(Math.random() * (await this.photos.count())))
			.limit(1)
			.first();

		return record
			? {
					...record,
					created: record.created.substring(0, 10),
					base64: 'data:image/png;base64,' + record.base64
				}
			: null;
	}

	async getRandomEvent() {
		const record = await this.events
			.orderBy('id')
			.offset(Math.floor(Math.random() * (await this.events.count())))
			.limit(1)
			.first();

		return record ? { ...record, base64: 'data:image/png;base64,' + record.base64 } : null;
	}

	async getRandomArt() {
		console.log('getting random art');

		const art = (await this.arts
			.orderBy('id')
			.offset(Math.floor(Math.random() * (await this.arts.count())))
			.limit(1)
			.first()) as Art;

		const artist = (await this.artists.get({ id: art?.artist_id })) as Artist;

		return {
			art: { ...art, base64: 'data:image/png;base64,' + art.base64 },
			artist: { ...artist, base64: 'data:image/png;base64,' + artist.base64 }
		};
	}

	async getRandomArtist() {
		const record = await this.artists
			.orderBy('id')
			.offset(Math.floor(Math.random() * (await this.artists.count())))
			.limit(1)
			.first();
		return record;
	}

	async getArtistsCount() {
		//get the unique artist_id count in the arts table
		//there may be 50,000 records in arts, I just want a count of unique artist_ids
		const artists: Record<number, number> = {};
		await this.arts.each((art) => {
			artists[art.artist_id] = artists[art.artist_id] ? artists[art.artist_id] + 1 : 1;
		});
		return artists;
	}

	//get statistics
	async getStats() {
		const [sentenceCount, photoCount] = await Promise.all([
			this.sentences.count(),
			this.photos.count()
		]);
		return { sentenceCount, photoCount };
	}
}

export const db = new MySubClassedDexie();
