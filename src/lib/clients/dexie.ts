import Dexie, { type EntityTable } from 'dexie';
import { lf } from '$lib/clients/localfiles';

export interface Photo {
	id: number;
	created: string;
}

export interface Sentence {
	id: number;
	text: string;
}

export interface Artist {
	id: number;
	name: string;
	description: string;
	short_description: string;
	category: string;
	region: string;
	start_year: string;
	end_year: string;
}

export interface Art {
	id: number;
	artist_id: number;
	title: string;
	category: string;
}

export interface Event {
	id: number;
	title: string;
	date: string;
	summary: string;
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
			photos: '++id, created', // primary key "id" (for the runtime!)
			sentences: '++id, text', // primary key "id" (for the runtime!)
			artists: '++id, name, description, short_description, category, region, start_year, end_year', // primary key "id" (for the runtime!)
			arts: '++id, artist_id, title, category', // primary key "id" (for the runtime!)
			events: '++id, title, date, summary' // primary key "id" (for the runtime!)
		});

		this.on('populate', () => {
			console.log('populating!!');
		});
	}

	async getRandomSentence() {
		const record = await this.sentences
			.orderBy('id')
			.offset(Math.floor(Math.random() * (await this.sentences.count())))
			.limit(1)
			.first();

		if (!record) return;
		const file = await lf.getFile('sentences', `${record.id}.png`);
		const image = URL.createObjectURL(file);

		return { ...record, image };
	}

	async getRandomPhoto() {
		const record = await this.photos
			.orderBy('id')
			.offset(Math.floor(Math.random() * (await this.photos.count())))
			.limit(1)
			.first();

		console.log('getting random photo', record);

		if (!record) return;

		const file = await lf.getFile('slideshow', `${record.id}.png`);
		const image = URL.createObjectURL(file);

		return { ...record, image };
	}

	async getRandomEvent() {
		const record = await this.events
			.orderBy('id')
			//TODO UPDATE THIS
			.offset(Math.floor(Math.random() * (await this.events.count())))
			.limit(1)
			.first();

		if (!record) return null;
		const file = await lf.getFile('events', `${record.id}.png`);
		const image = URL.createObjectURL(file);

		return { ...record, image };
	}

	async getRandomArt() {
		console.log('getting random art');

		const art = (await this.arts
			.orderBy('id')
			.offset(Math.floor(Math.random() * (await this.arts.count())))
			.limit(1)
			.first()) as Art & { base64: string };

		const artist = (
			art && art.artist_id ? await this.artists.get({ id: art?.artist_id }) : {}
		) as Artist;

		const artFile = await lf.getFile('art', `${art.id}.png`);
		const artistFile = await lf.getFile('artists', `${artist.id}.png`);

		const artImage = URL.createObjectURL(artFile);
		const artistImage = URL.createObjectURL(artistFile);

		return { art, artist, artImage, artistImage };
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
