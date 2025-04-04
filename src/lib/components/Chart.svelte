<script lang="ts">
  import f3 from "family-chart";
  import { onMount, onDestroy } from "svelte";
  import FamilyTreeForm from "$lib/components/FamilyTreeForm.svelte";
  import "$lib/components/family-chart.css";
  import type { Store } from "$lib/types/types";
  import { chartData } from "$lib/familydata";

  import type {
    CardDimensions,
    CardEditParam,
    CardNode,
    DisplayFunction,
    FamilyMember,
  } from "$lib/types/types";

  let data: FamilyMember[] = $chartData;
  let showForm = false;
  let currentFamilyMember: FamilyMember = null;
  let addRelationMember: FamilyMember = null;
  let addRelationType: string = null;
  let storeRef: Store = null;
  let postSubmitRef: (props?: { delete?: boolean }) => void;

  $: $chartData = data;

  const store: Store = f3.createStore({
    data,
    node_separation: 250,
    level_separation: 150,
  });

  function cardEditForm({
    datum,
    store,
    postSubmit,
  }: {
    datum: FamilyMember;
    store: Store;
    postSubmit: (props?: { delete?: boolean }) => void;
    toAdd: boolean;
  }) {
    addRelationMember;
    addRelationType;
    currentFamilyMember = datum;
    storeRef = store;
    showForm = true;
    postSubmitRef = postSubmit;
  }

  function addForm({
    datum,
    store,
    postSubmit,
    rel_datum,
    rel_type,
  }: {
    datum: FamilyMember;
    store: Store;
    postSubmit: (props?: { delete?: boolean }) => void;
    rel_datum: FamilyMember;
    rel_type: string;
  }) {
    currentFamilyMember = datum;
    addRelationMember = rel_datum;
    addRelationType = rel_type;
    storeRef = store;
    showForm = true;
    postSubmitRef = postSubmit;
  }

  function postSubmit(props?: { delete?: boolean }): void {
    if (currentFamilyMember && storeRef) {
      postSubmitRef(props);
    }
    addRelationMember = null;
    addRelationType = null;
    console.log(data);
  }

  function cardDisplay(): DisplayFunction[] {
    const nick = (item: CardNode) => {
      if (item.data.nickname) {
        return `(${item.data.nickname})`;
      }
      return "";
    };

    const d1: DisplayFunction = (item: CardNode) =>
      `${item.data.firstname || ""} ${item.data.lastname || ""}`;
    const d2: DisplayFunction = (item: CardNode) =>
      `${nick(item)} ${item.data.birthday || ""}`;

    return [d1, d2];
  }
  const card_display: DisplayFunction[] = cardDisplay();

  const card_dim: CardDimensions = {
    w: 230,
    h: 80,
    text_x: 75,
    text_y: 15,
    img_w: 60,
    img_h: 60,
    img_x: 5,
    img_y: 5,
  };

  const card_edit: CardEditParam[] = [
    { type: "text", placeholder: "first name", key: "first name" },
    { type: "text", placeholder: "last name", key: "last name" },
    { type: "text", placeholder: "birthday", key: "birthday" },
    { type: "text", placeholder: "avatar", key: "avatar" },
  ];

  // Subscribe to chartData store and update the chart whenever it changes
  let unsubscribe: () => void;

  onMount(() => {
    unsubscribe = chartData.subscribe((updatedData) => {
      data = updatedData;
      store.update.data(data);
      store.update.tree({ initial: true });
    });

    const cont: any = document.querySelector("#FamilyChart");
    const view: any = f3.d3AnimationView({
      store,
      cont,
      card_edit,
    });
    const addRelative: Function = f3.handlers.AddRelative({
      store,
      cont,
      card_dim,
      cardEditForm: (props) => addForm(props),
      labels: { mother: "Add mother" },
    });
    const Card = f3.elements.Card({
      store,
      svg: view.svg,
      card_dim,
      cardEditForm,
      addRelative,
      card_display,
      mini_tree: true,
      link_break: false,
    });
    view.setCard(Card);
    store.setOnUpdate((props: any) => view.update(props || {}));
    store.update.tree({ initial: true });
  });
  // Cleanup the subscription when the component is destroyed
  onDestroy(() => {
    unsubscribe;
  });
</script>

<div id="FamilyChart" class="f3"></div>

<FamilyTreeForm
  bind:showModal={showForm}
  familyMember={currentFamilyMember}
  store={storeRef}
  {addRelationMember}
  {addRelationType}
  {postSubmit}
  closeModal={() => {
    showForm = false;
  }}
/>

<style>
  #FamilyChart {
    height: 100%;
    max-height: 100%;
    width: 100%;
    max-width: 100%;
    margin: 0px;
    position: relative;
  }
</style>
