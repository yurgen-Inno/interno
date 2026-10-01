.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
  margin-top: 16px;
  margin-bottom: 24px;

  &__item {
    position: relative;
    display: flex;
    width: 100%;
    background-color: #ffffff;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      cursor: pointer;
    }

    // Barra vertical lateral izquierda
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background-color: #4a90e2; // Color de acento por defecto
      z-index: 2;
    }

    cb-card-primary {
      width: 100%;
      background: transparent;
      border: none;
    }
  }
}