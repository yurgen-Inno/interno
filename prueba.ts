.dashboard-filters {
  display: flex;
  flex-direction: row;
  align-items: flex-start; /* Alinea todas las cajas por el borde superior */
  gap: 16px;
  width: 100%;

  &__field {
    display: flex;
    flex-direction: column;

    &--search {
      flex: 1 1 200px;
    }

    &--select {
      flex: 1 1 240px;
    }

    &--date {
      flex: 0 0 auto;
    }
  }

  &__actions {
    display: flex;
    align-items: flex-start;
    /* Si los inputs tienen label o padding superior y el botón queda desfasado: */
    margin-top: 0; 
  }
}