@if (resourceGetAllAuthors.value(); as author) {
  <nv-card - container
  typology = "spaced"
  variation = "elevated"
  ariaLabel = "Seniority del desarrollador"
    >
    <!--Card de Posición-- >
      <nv-card - item
  itemLabel = "Posición"
  handlePosition = "right"
    >
    <div slot="content" class="card-content" >
      <div class="card-content__text" >
        <span class="card-content__title" > Posición Actual </span>
          < span class="card-content__subtitle" > Lugar en el ranking general </span>
            </div>
            < span class="card-content__tag card-content__tag--position" >
          #{ { author.position } }
  </span>
    </div>
    </nv-card-item>

    < !--Card de Nivel-- >
      <nv-card - item
  itemLabel = "Nivel"
  handlePosition = "right"
    >
    <div slot="content" class="card-content" >
      <div class="card-content__text" >
        <span class="card-content__title" > Nivel de Seniority </span>
          < span class="card-content__subtitle" > Clasificación profesional </span>
            </div>
            < span class="card-content__tag card-content__tag--level" >
              {{ author.level }
}
</span>
  </div>
  </nv-card-item>

  < !--Card de Puntaje-- >
    <nv-card - item
itemLabel = "Puntaje"
handlePosition = "right"
  >
  <div slot="content" class="card-content" >
    <div class="card-content__text" >
      <span class="card-content__title" > Puntaje Total </span>
        < span class="card-content__subtitle" > Score acumulado </span>
          </div>
          < span class="card-content__tag card-content__tag--score" >
            {{ author.score }} pts
              </span>
              </div>
              </nv-card-item>
              </nv-card-container>
}


.card - content {
  display: flex;
  align - items: center;
  justify - content: space - between;
  width: 100 %;
  padding: 8px 0;

  & __text {
    display: flex;
    flex - direction: column;
    gap: 4px;
  }

  & __title {
    font - size: 1rem;
    font - weight: 600;
    color: #2b2f38;
  }

  & __subtitle {
    font - size: 0.85rem;
    color: #8c93a0;
  }

  & __tag {
    padding: 4px 12px;
    border - radius: 12px;
    font - size: 0.8rem;
    font - weight: 600;
    line - height: 1;

    & --position {
      background - color: #eaf3ff;
      color: #1e62d0;
    }

    & --level {
      background - color: #f5f1fa;
      color: #6e3aa7;
    }

    & --score {
      background - color: #fdf5e8;
      color: #b7791f;
    }
  }
}