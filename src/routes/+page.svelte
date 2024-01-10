<script lang="ts">
    import FamilyChart from "family-chart";
    import { onMount, onDestroy } from "svelte";

    let chart;

    onMount(() => {
        console.log("Creating family chart");
        chart = new FamilyChart({
            container: "#chart",
            data: {
                name: "John Doe",
                children: [
                    {
                        name: "Jane Doe",
                        children: [
                            { name: "Alice Doe" },
                            { name: "Bob Doe" },
                            { name: "Charlie Doe" },
                        ],
                    },
                    {
                        name: "Jim Doe",
                        children: [{ name: "David Doe" }, { name: "Eve Doe" }],
                    },
                ],
            },
        });
    });
</script>

<h1>Welcome to SvelteKit</h1>
<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>

<div id="chart"></div>
