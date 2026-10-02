@let content = $content();
@let difficult = content.labels | findTextInAPattern: 'd:';
@let colorDifficult = difficult | findTextColor;
@let reward = $reward();

<cb-card-primary
  [config]="{
    variant: 'card-product',
    typeIcon: 'icon',
    icon: '',
    classColorBorder: colorDifficult || 'status-info-1',
    borderColor: true,
    infoAccount: {
      title: content.title,
      subtitle: 'Proyecto: ' + (content.projectName ?? 'N/A'),
      titleTypographyClass: '',
      subtitleTypographyClass: '',
      textOneTypographyClass: '',
      textTwoTypographyClass: '',
      textThreeTypographyClass: '',
      textOne: 'Creado: ' + (content.createdAt | date: 'dd/MM/yyyy hh:mm a'),
      textTwo: 'Estado: ' + content.state
    },
    componentStatus: {
      type: 'only',
      color: colorDifficult || 'status-info-3',
      border: 'center',
      text: difficult || 'Activa'
    },
    componentTagOne: {
      componentId: 'tag-1',
      textElement: 'Tomar',
      typeTag: 'button',
      widthBehavior: 'hug'
    }
  }">

  <!-- Contenido proyectado para la recompensa -->
  <section class="bc-p-2 bc-flex bc-gap-2 bc-align-items-center">
    @if (reward.faIcon; as faIcon) {
      <fa-icon [icon]="faIcon" class="reward-fa-icon"></fa-icon>
    } @else if (reward.nvIcon; as nvIcon) {
      <nv-icon
        [class]="nvIcon"
        [size]="reward.isVoluntary ? iconSizes.VOLUNTARY : iconSizes.DEFAULT">
      </nv-icon>
    }

    <div class="nv-display-flex nv-flex-direction-column">
      <span class="bc-opensans-font-style-2-semibold bc-text-brand-primary-00">
        {{ reward.label }}
      </span>

      @if (reward.isVoluntary) {
        <span class="bc-opensans-font-style-2-regular bc-text-brand-primary-00">
          (contribución voluntaria)
        </span>
      }
    </div>
  </section>

</cb-card-primary>




@let content = $content();
@let difficult = content.labels | findTextInAPattern: 'd:';
@let colorDifficult = difficult | findTextColor;
@let reward = $reward();

<cb-card-primary
  [config]="{
    variant: 'card-product',
    typeIcon: 'icon',
    icon: reward.nvIcon ?? '',
    classColorBorder: colorDifficult || 'status-info-1',
    borderColor: true,
    infoAccount: {
      title: content.title,
      subtitle: 'Proyecto: ' + (content.projectName ?? 'N/A'),
      titleTypographyClass: '',
      subtitleTypographyClass: '',
      textOneTypographyClass: '',
      textTwoTypographyClass: '',
      textThreeTypographyClass: '',
      textOne: 'Recompensa: ' + reward.label + (reward.isVoluntary ? ' (voluntaria)' : ''),
      textTwo: 'Creado: ' + (content.createdAt | date: 'dd/MM/yyyy hh:mm a')
    },
    componentStatus: {
      type: 'only',
      color: colorDifficult || 'status-info-3',
      border: 'center',
      text: difficult || 'Sin dificultad'
    },
    componentTagOne: {
      componentId: 'tag-1',
      textElement: 'Tomar',
      typeTag: 'button',
      widthBehavior: 'hug'
    }
  }">
</cb-card-primary>