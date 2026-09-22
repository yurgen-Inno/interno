@if (resourceGetAllAuthors.value(); as author) {
  <nv-card-container
    typology="spaced"
    variation="elevated"
    ariaLabel="Seniority del desarrollador"
  >
    <nv-card-item
      label="Posición"
      [value]="author.position.toString()"
      itemLabel="Posición"
      handlePosition="right"
    >
      <div slot="content" class="card-content">
        <div class="card-content__text">
          <span class="card-content__title">Posición Actual</span>
          <span class="card-content__subtitle">Lugar en el ranking general</span>
        </div>
        <span class="card-content__tag card-content__tag--position">
          #{{ author.position }}
        </span>
      </div>
    </nv-card-item>

    <nv-card-item
      label="Nivel"
      [value]="author.level"
      itemLabel="Nivel"
      handlePosition="right"
    >
      <div slot="content" class="card-content">
        <div class="card-content__text">
          <span class="card-content__title">Nivel de Seniority</span>
          <span class="card-content__subtitle">Clasificación profesional</span>
        </div>
        <span class="card-content__tag card-content__tag--level">
          {{ author.level }}
        </span>
      </div>
    </nv-card-item>

    <nv-card-item
      label="Puntaje"
      [value]="author.score.toString()"
      itemLabel="Puntaje"
      handlePosition="right"
    >
      <div slot="content" class="card-content">
        <div class="card-content__text">
          <span class="card-content__title">Puntaje Total</span>
          <span class="card-content__subtitle">Score acumulado</span>
        </div>
        <span class="card-content__tag card-content__tag--score">
          {{ author.score }} pts
        </span>
      </div>
    </nv-card-item>
  </nv-card-container>
}