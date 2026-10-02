<section class="bc-p-2 bc-flex bc-gap-2 bc-align-items-center">
  @if ($reward().faIcon; as faIcon) {
    <fa-icon 
      [icon]="faIcon" 
      style="display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; font-size: 18px; line-height: 1; flex-shrink: 0;">
    </fa-icon>
  } @else if ($reward().nvIcon; as nvIcon) {
    <nv-icon
      [class]="nvIcon"
      [size]="$reward().isVoluntary ? 'md' : 'sm'">
    </nv-icon>
  }

  <div class="nv-display-flex nv-flex-direction-column">
    <span class="bc-opensans-font-style-2-semibold bc-text-brand-primary-00">
      {{ $reward().label }}
    </span>

    @if ($reward().isVoluntary) {
      <span class="bc-opensans-font-style-2-regular bc-text-brand-primary-00">
        (contribución voluntaria)
      </span>
    }
  </div>
</section>