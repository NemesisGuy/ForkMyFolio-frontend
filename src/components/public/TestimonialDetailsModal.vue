<template>
  <div ref="modalRef" aria-hidden="true" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div v-if="testimonial" class="modal-content glass-modal">
        <div class="modal-header">
          <h5 class="modal-title">
            Testimonial from {{ testimonial.authorName }}
          </h5>
          <!-- FIX: Removed btn-close-white. The default btn-close is theme-aware and will be visible in both light and dark modes. -->
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
        </div>
        <div class="modal-body text-center p-4 p-md-5">
          <i class="bi bi-quote display-1 text-primary opacity-25"></i>
          <figure class="mt-3">
            <blockquote class="blockquote">
              <p class="fs-4 fst-italic">"{{ testimonial.quote }}"</p>
            </blockquote>
            <figcaption class="blockquote-footer mt-3">
              <strong class="d-block fs-5">{{ testimonial.authorName }}</strong>
              <cite v-if="testimonial.authorTitle" :title="testimonial.authorTitle">{{
                  testimonial.authorTitle
                }}</cite>
            </figcaption>
          </figure>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-secondary" data-bs-dismiss="modal" type="button">Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';
import {Modal} from 'bootstrap';

const props = defineProps(/** @props */ {
  /**
   * The testimonial object to display. The modal is shown when this prop is not null.
   * @type {object|null}
   */
  testimonial: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(/** @emits */ {
  'close': null, // Emitted when the modal is closed, signaling the parent to nullify the prop.
});

const modalRef = ref(null);
let modalInstance = null;

onMounted(() => {
  if (modalRef.value) {
    modalInstance = new Modal(modalRef.value);
    // FIX: Use 'hide.bs.modal' to fire the close event earlier, preventing a focus race condition.
    modalRef.value.addEventListener('hide.bs.modal', () => emit('close'));
  }
});

watch(() => props.testimonial, (newTestimonial) => {
  newTestimonial ? modalInstance?.show() : modalInstance?.hide();
});
</script>