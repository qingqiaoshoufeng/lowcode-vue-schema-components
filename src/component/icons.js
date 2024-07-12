import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'AIcon',
  props: {
    type: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 20,
    },
    color: {
      type: String,
    },
  },
  render() {
    const style = {
      fontSize: this.size + 'px',
      color: this.color,
    };
    const icons = window.CASTLE_LowCode_LocalComponents
    return h(icons[this.type], { style, twoToneColor: this.color })
  },
})