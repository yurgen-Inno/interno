const matchKey = this.normalizeMatchKey(rawReward);
    const rewardInfo = catalog.get(matchKey) ?? this.findByTokens(catalog, matchKey);
    
    // Obtenemos el icon raw
    const rawIcon = (rewardInfo?.icon ?? matchKey).trim().toLowerCase();
    
    // Clave limpia sin 'icon-'
    const cleanKey = rawIcon.replace(/^icon-/, '');

    // Buscamos el icono de FontAwesome en cualquiera de las posibles variantes:
    // matchKey ("aws", "github") o cleanKey ("amazonaws", "github", "microsoftazure")
    const faIcon = 
      BRAND_FA_ICONS[matchKey] ?? 
      BRAND_FA_ICONS[cleanKey] ??
      (cleanKey === 'amazonaws' ? BRAND_FA_ICONS['aws'] : undefined) ??
      (cleanKey === 'microsoftazure' ? BRAND_FA_ICONS['azure'] : undefined);

    // 1. Si existe en FontAwesome (ASEGÚRATE DE USAR 'faIcon' o 'faIcon', el que tengas en el HTML)
    if (faIcon) {
      return {
        label: this.formatLabel(rawReward),
        isVoluntary: false,
        faIcon: faIcon, // Si en tu HTML usas faIcon, pon faIcon aquí también
      };
    }

    // 2. Si es icono interno del Design System (nv-icon)
    const nvIconName = rawIcon.startsWith(REWARD_CONFIG.ICON_PREFIX)
      ? rawIcon
      : `${REWARD_CONFIG.ICON_PREFIX}${rawIcon}`;

    return {
      label: this.formatLabel(rawReward),
      isVoluntary: false,
      nvIcon: nvIconName || REWARD_CONFIG.DEFAULT_ICON,
    };




    <section class="bc-p-2 bc-flex bc-gap-2 bc-align-items-center">
  @if ($reward().faIcon; as faIcon) {
    <fa-icon [icon]="faIcon" class="bc-text-lg"></fa-icon>
  } @else if ($reward().nvIcon; as nvIcon) {
    <nv-icon
      [class]="nvIcon"
      [size]="$reward().isVoluntary ? 'md' : 'sm'">
    </nv-icon>
  }