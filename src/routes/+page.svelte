<script lang="ts">
  import f3 from "family-chart";
  import { onMount, onDestroy } from "svelte";
  import data from "./initialdata.json";
  import FamilyTreeForm from "./FamilyTreeForm.svelte";

  import type {
    CardDimensions,
    CardEditParam,
    CardNode,
    DisplayFunction,
    FamilyMember,
  } from "$lib/types/types";

  let showForm = false;
  let currentFamilyMember: FamilyMember = null;
  let storeRef: any = null;

  function cardEditForm(props: { datum: any; store: any; postSubmit: any }) {
    currentFamilyMember = props.datum;
    storeRef = props.store;
    const postSubmitOriginal = props.postSubmit;

    showForm = true;

    // Return the form control functions
    return {
      close: () => {
        showForm = false;
      },
      postSubmit: (props?: { delete?: boolean }) => {
        showForm = false;
        postSubmitOriginal(props);
      },
    };
  }

  function showAddRelative({ d }) {
    console.log("showAddRelative", d);
  }

  function cardDisplay(): DisplayFunction[] {
    const d1: DisplayFunction = (item: CardNode) =>
      `${item.data.firstname || ""} ${item.data.lastname || ""}`;
    const d2: DisplayFunction = (item: CardNode) =>
      `${item.data.birthday || ""}`;

    // d1.create_form = "{firstname} {lastname}";
    // d2.create_form = "{birthday}";

    return [d1, d2];
  }
  const card_display: DisplayFunction[] = cardDisplay();

  const card_dim: CardDimensions = {
    w: 220,
    h: 70,
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

  onMount(() => {
    console.log(data);
    const cont: any = document.querySelector("#FamilyChart");
    const store: any = f3.createStore({
      data,
      node_separation: 250,
      level_separation: 150,
    });
    const view: any = f3.d3AnimationView({
      store,
      cont,
      card_edit,
    });
    const addRelative: Function = f3.handlers.AddRelative({
      store,
      cont,
      card_dim,
      cardEditForm,
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
</script>

<div id="FamilyChart" class="f3"></div>

<FamilyTreeForm
  bind:showModal={showForm}
  familyMember={currentFamilyMember}
  postSubmit={(props) => {
    if (currentFamilyMember && storeRef) {
      storeRef.update.tree();
    }
  }}
  closeModal={() => {
    showForm = false;
  }}
/>

<style>
  #FamilyChart {
    height: calc(100vh - 80px);
    width: 100%;
    max-width: 100%;
    margin: auto;
    position: relative;
  }
</style>
