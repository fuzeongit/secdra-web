<template>
  <span>
    <transition
      name="fade" enter-active-class="fadeIn short-duration" leave-active-class="fadeOut short-duration"
      @after-enter="handleAfterEnter"
      @after-leave="handleAfterLeave">
      <div
        class="card"
        ref="popper"
        v-show="showPopper"
        :style="{ width: width + 'px' }"
        role="tooltip"
      >
        <slot></slot>
      </div>
    </transition>
    <slot name="reference"></slot>
  </span>
</template>
<script>
  import Popper from "../../../assets/script/mixin/popper"
  import {on, off, addClass, removeClass} from '../../../assets/script/util/domUtil';

  export default {
    componentName: "Popper",
    mixins: [Popper],

    props: {
      trigger: {
        type: String,
        default: 'click',
        validator: value => ['click', 'focus', 'hover', 'manual'].indexOf(value) > -1
      },
      openDelay: {
        type: Number,
        default: 0
      },
      reference: {},
      width: {},
      visibleArrow: {
        default: true
      },
      arrowOffset: {
        type: Number,
        default: 0
      }
    },

    watch: {
      showPopper(val) {
        val ? this.$emit('show') : this.$emit('hide');
      }
    },

    mounted() {
      let reference = this.referenceElm = this.reference || this.$refs.reference;
      const popper = this.popper || this.$refs.popper;

      if (!reference && this.$slots.reference && this.$slots.reference[0]) {
        reference = this.referenceElm = this.$slots.reference[0].elm;
      }

      if (this.trigger === 'click') {
        on(reference, 'click', this.doToggle);
        on(document, 'click', this.handleDocumentClick);
      } else if (this.trigger === 'hover') {
        on(reference, 'mouseenter', this.handleMouseEnter);
        on(popper, 'mouseenter', this.handleMouseEnter);
        on(reference, 'mouseleave', this.handleMouseLeave);
        on(popper, 'mouseleave', this.handleMouseLeave);
      } else if (this.trigger === 'focus') {
        if (reference.querySelector('input, textarea')) {
          on(reference, 'focusin', this.doShow);
          on(reference, 'focusout', this.doClose);
        } else {
          on(reference, 'mousedown', this.doShow);
          on(reference, 'mouseup', this.doClose);
        }
      }
    },

    methods: {
      doToggle() {
        this.showPopper = !this.showPopper;
      },
      doShow() {
        this.showPopper = true;
      },
      doClose() {
        this.showPopper = false;
      },
      handleFocus() {
        addClass(this.referenceElm, 'focusing');
        if (this.trigger !== 'manual') this.showPopper = true;
      },
      handleClick() {
        removeClass(this.referenceElm, 'focusing');
      },
      handleBlur() {
        removeClass(this.referenceElm, 'focusing');
        if (this.trigger !== 'manual') this.showPopper = false;
      },
      handleMouseEnter() {
        clearTimeout(this._timer);
        if (this.openDelay) {
          this._timer = setTimeout(() => {
            this.showPopper = true;
          }, this.openDelay);
        } else {
          this.showPopper = true;
        }
      },
      handleKeydown(ev) {
        if (ev.keyCode === 27 && this.trigger !== 'manual') { // esc
          this.doClose();
        }
      },
      handleMouseLeave() {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
          this.showPopper = false;
        }, 200);
      },
      handleDocumentClick(e) {
        let reference = this.reference || this.$refs.reference;
        const popper = this.popper || this.$refs.popper;

        if (!reference && this.$slots.reference && this.$slots.reference[0]) {
          reference = this.referenceElm = this.$slots.reference[0].elm;
        }
        if (!this.$el ||
          !reference ||
          this.$el.contains(e.target) ||
          reference.contains(e.target) ||
          !popper ||
          popper.contains(e.target)) return;
        this.showPopper = false;
      },
      handleAfterEnter() {
        this.$emit('after-enter');
      },
      handleAfterLeave() {
        this.$emit('after-leave');
        this.doDestroy();
      }
    },

    destroyed() {
      const reference = this.reference;
      off(reference, 'click', this.doToggle);
      off(reference, 'mouseup', this.doClose);
      off(reference, 'mousedown', this.doShow);
      off(reference, 'focusin', this.doShow);
      off(reference, 'focusout', this.doClose);
      off(reference, 'mousedown', this.doShow);
      off(reference, 'mouseup', this.doClose);
      off(reference, 'mouseleave', this.handleMouseLeave);
      off(reference, 'mouseenter', this.handleMouseEnter);
      off(document, 'click', this.handleDocumentClick);
    }
  };
</script>
