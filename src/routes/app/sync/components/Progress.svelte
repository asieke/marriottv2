<script lang="ts">
	export let progress = 0;
</script>

<div class="w-full py-4">
	<div class="w-full h-12 bg-slate-200 rounded-lg relative">
		<div class="absolute right-4 top-0 h-12 flex items-center">
			{isNaN(progress) ? 0 : progress}%
		</div>
		<div
			class="h-12 bg-blue-400 rounded-lg"
			style={`width: ${isNaN(progress) ? 0 : progress}%`}
		></div>
	</div>
</div>
