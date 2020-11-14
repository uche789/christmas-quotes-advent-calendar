const card = {
  props: {
    card: {
      type: Object,
    },
  },
  computed: {
    src() {
      if (!this.card.isSeen) return

      return `images/${this.card.icon}.png`
    },
    alt() {
      return this.card.icon
    },
  },
  template: `
  <div class="card" :class="{'is-seen': !card.isSeen}">
    <img v-if="src" :src="src" :alt="gloves">
    <p v-if="card.isSeen"><slot></slot></p>
    <span v-if="!card.isSeen">{{card.day}}</span>
  </div>
  `,
}

const app = {
  components: {
    card,
  },
  data: () => ({
    date: '2020',
    cards: [],
    quotes: [],
    ready: false,
  }),
  async beforeMount() {
    const params = window.location.search.includes('fake=true') ? '?fake=true' : ''
    try {
      const response = await fetch('/cards' + params)
      this.cards = await response.json()
      if (this.cards.length > 0) this.ready = true
    } catch (error) {
      console.error(error)
    }
  },
}

Vue.createApp(app).mount('#app')