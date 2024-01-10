<script lang="ts">
    import f3 from "family-chart";
    import { onMount, onDestroy } from "svelte";
    import data from "$lib/data/data.json";

    onMount(() => {
        console.log(data);
        const store = f3.createStore({
            data,
            node_separation: 250,
            level_separation: 150,
        });
        const view = f3.d3AnimationView({
            store,
            cont: document.querySelector("#FamilyChart"),
        });
        const Card = f3.elements.Card({
            store,
            svg: view.svg,
            card_dim: {
                w: 220,
                h: 70,
                text_x: 75,
                text_y: 15,
                img_w: 60,
                img_h: 60,
                img_x: 5,
                img_y: 5,
            },
            card_display: [
                (d: { data: { label: any } }) => d.data.label || "",
                (d: { data: { desc: any } }) => d.data.desc || "",
            ],
            mini_tree: true,
            link_break: false,
        });
        view.setCard(Card);
        store.setOnUpdate((props: any) => view.update(props || {}));
        store.update.tree({ initial: true });
    });
</script>

<h1>Welcome to SvelteKit</h1>
<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
<div id="FamilyChart"></div>

<style>
    #FamilyChart {
        height: 800px;
        max-height: calc(100vh - 80px);
        width: 1000px;
        max-width: 100%;
        margin: auto;
        position: relative;
    }
</style>
