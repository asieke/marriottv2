<script lang="ts">
	import { onMount } from 'svelte';
	import axios from 'axios';

	async function getRandomHistoryArticle() {
		const categoryMembersUrl =
			'https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:History&cmlimit=max&format=json&origin=*';
		const articleUrl =
			'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=true&format=json&origin=*&titles=';

		try {
			// Fetch the list of articles in the history category
			let response = await fetch(categoryMembersUrl);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			let data = await response.json();
			const articles = data.query.categorymembers;

			// Ensure there are articles in the category
			if (articles.length === 0) {
				throw new Error('No articles found in the History category.');
			}

			// Select a random article from the list
			const randomArticle = articles[Math.floor(Math.random() * articles.length)];
			const articleTitle = randomArticle.title;

			// Fetch the full text of the selected article
			response = await fetch(articleUrl + encodeURIComponent(articleTitle));

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			data = await response.json();
			const pages = data.query.pages;
			const pageId = Object.keys(pages)[0];
			const fullText = pages[pageId].extract;

			console.log(fullText);

			return fullText;
		} catch (error) {
			console.error('Error fetching the article:', error);
			return 'Failed to fetch the article. Please try again.';
		}
	}
</script>

<button on:click={getRandomHistoryArticle}>Get Random History Article</button>
