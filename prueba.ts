import { Component, input, output } from '@angular/core';
import { BcTableOptionMenu } from '@bancolombia/design-system-behaviors';
import { BcPaginatorV2Module } from '@bancolombia/design-system-web/bc-paginator-v2';
import { BcTableModule } from '@bancolombia/design-system-web/bc-table';
import { BcTooltipModule } from '@bancolombia/design-system-web/bc-tooltip';
import {
  IDropdownOptionEvent,
  IEventSelectDocument,
  IRowDocument,
  ITableDocuments,
} from '@core/models/documents.model';

@Component({
  selector: 'app-list-all-documents',
  standalone: true,
  imports: [BcTableModule, BcTooltipModule, BcPaginatorV2Module],
  templateUrl: './list-all-documents.component.html',
  styleUrl: './list-all-documents.component.scss',
})
export class ListAllDocumentsComponent {
  readonly $data = input.required<IRowDocument[]>();
  readonly $cellOptions = input.required<BcTableOptionMenu[]>();

  readonly $optionSelect = output<ITableDocuments>();

  public onOptionSelected(
    event: IDropdownOptionEvent | string,
    row: IRowDocument
  ): void {
    const rawOption = typeof event === 'string'
      ? event
      : event?.optionSeleted ?? event?.optionSelected ?? event?.id ?? event?.value ?? '';

    const optionPayload: IEventSelectDocument = {
      optionSeleted: rawOption.toUpperCase(),
      rowData: row,
    };

    this.$optionSelect.emit({
      option: optionPayload,
      row,
    });
  }
}



-------


<div class="bc-row">
  @defer (on viewport; prefetch on idle) {
    <bc-table-container
      class="bc-col-12"
      [dataTable]="$data()"
      [cellOptions]="$cellOptions()"
    >
      <bc-table-header title="Dashboards disponibles">
        <em
          class="bc-icon"
          bc-tooltip
          [bcTooltipPosition]="'left'"
          [bcTooltipText]="'Aquí puedes ver y gestionar los dashboards disponibles en las regiones a las que tienes acceso. Puedes crear o eliminar dashboards según tus permisos.'"
        >
          info-circle
        </em>
      </bc-table-header>

      <bc-table-content>
        <table
          caption="tabla"
          bc-table
          [selection]="'false'"
          [sort]="'true'"
          [pairPaginators]="'false'"
          [dropdownHtml]="'true'"
        >
          <thead>
            <tr>
              <th scope="row" bc-cell scope="col">Repositorio</th>
              <th scope="row" bc-cell scope="col" [fixed]="'true'">Nombre visible</th>
              <th scope="row" bc-cell scope="col">Organización</th>
              <th scope="row" bc-cell scope="col">URL</th>
              <th scope="row" bc-cell scope="col">Última sincronización</th>
              <th scope="row" bc-cell scope="col" type="action"></th>
            </tr>
          </thead>

          <tbody>
            @for (row of $data(); track row.organization + '/' + row.repositoryName) {
              <tr>
                <td bc-cell>
                  <strong>{{ row.repositoryName }}</strong>
                </td>
                <td bc-cell>
                  <span class="cell-truncate" [title]="row.name">{{ row.name }}</span>
                </td>
                <td bc-cell>
                  {{ row.organization }}
                </td>
                <td bc-cell>
                  @if (row.url) {
                    <a [href]="row.url" target="_blank" rel="noopener noreferrer" class="bc-link">
                      Ver repositorio
                    </a>
                  } @else {
                    <span class="bc-text-muted">-</span>
                  }
                </td>
                <td bc-cell>
                  <span class="cell-truncate" [title]="row.lastSyncedAtFormatted">
                    {{ row.lastSyncedAtFormatted }}
                  </span>
                </td>
                <td bc-cell type="action">
                  <bc-table-dropdown
                    [row]="row"
                    [alternativeOptionId]="true"
                    [options]="row.menu || []"
                    (onChange)="onOptionSelected($event, row)"
                  ></bc-table-dropdown>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </bc-table-content>
    </bc-table-container>
  } @placeholder {
    <div class="bc-col-12 bc-p-4">
      <div style="height: 400px; width: 100%; background: rgba(128, 128, 128, 0.1); border-radius: 3px;"></div>
    </div>
  } @loading (after 100ms; minimum 500ms) {
    <div class="bc-col-12 bc-p-4">
      <div style="height: 400px; width: 100%; background: rgba(128, 128, 128, 0.1); border-radius: 3px; animation: pulse 1.5s infinite;"></div>
    </div>
  }
</div>


-------------


import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { Subject, takeUntil } from 'rxjs';

import { BcTableOptionMenu } from '@bancolombia/design-system-behaviors';
import { PERMISSION_DOCUMENTS_CREATE } from '@core/constants/permission-list.constant';
import {
  MODAL_CONFIRM_DELETE_DOCUMENT,
  TABLE_DOCUMENT_OPTIONS,
  TABLE_OPTIONS_DOCUMENTS,
} from '@core/constants/table-documents.contant';
import {
  EResourceViewMode,
  IDocumentationResource,
  IRowDocument,
  ITableDocuments,
} from '@core/models/documents.model';
import { EEventSelectItem } from '@core/models/table-dashboard.model';
import { TContextualPermission } from '@core/models/permissions-engine.model';
import { DocumentationService } from '@core/services/documentation/services/documentation.service';
import { EventsService } from '@core/services/events/events.service';
import { GlobalStoreService } from '@shared/store/global-store.service';
import { PermissionsEngine } from '@shared/utils/permissions-engine/permissions-engine';
import {
  ButtonComponent,
  ModalComponent,
  ModalConfig,
} from 'web-components-lib';

import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { SkeletonGridComponent } from '@shared/components/skeleton-grid/skeleton-grid.component';
import { ListAllDocumentsComponent } from '@features/admin/components/list-all-documents/list-all-documents.component';

@Component({
  selector: 'app-list-documents',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ListAllDocumentsComponent,
    ButtonComponent,
    ModalComponent,
    SkeletonGridComponent,
    ErrorStateComponent,
  ],
  templateUrl: './list-documents.component.html',
  styleUrl: './list-documents.component.scss',
})
export class ListDocumentsComponent implements OnInit, OnDestroy {
  private static readonly ROUTE_CREATE = '/admin/create-document';
  private static readonly ROUTE_DASHBOARD = '/dashboard';
  private static readonly BUTTON_ACCEPT = 'accept';
  private static readonly MODAL_CLOSE_CANCEL = 'button-cancel';
  private static readonly MODAL_CLOSE_ACCEPT = 'button-accept';
  private static readonly EVENT_VIEW_SESSION = 'documents_management_view';
  private static readonly STORE_PERMISSIONS_KEY = 'PERMISSIONS';

  private static readonly PARAM_ORG = 'org';
  private static readonly PARAM_REPO = 'repo';
  private static readonly PARAM_MODE = 'mode';

  private readonly _router = inject(Router);
  private readonly _eventsService = inject(EventsService);
  private readonly _docService = inject(DocumentationService);
  private readonly _globalStoreService = inject(GlobalStoreService);
  private readonly _destroy$ = new Subject<void>();

  public readonly modal = viewChild<ModalComponent>('modal');
  public readonly $documentToDelete = signal<IDocumentationResource | null>(null);

  public readonly $cellOptions = signal<BcTableOptionMenu[]>(TABLE_DOCUMENT_OPTIONS);

  public readonly $modalInformation = signal<Partial<ModalConfig>>(
    MODAL_CONFIRM_DELETE_DOCUMENT
  );

  public readonly resourceDocuments = rxResource({
    stream: () => this._docService.getResources(),
    defaultValue: [] as IDocumentationResource[],
  });

  public readonly $permissionCreate = computed<boolean>(() => {
    const userPermissions =
      (this._globalStoreService.selector(ListDocumentsComponent.STORE_PERMISSIONS_KEY)() as TContextualPermission[]) ?? [];

    if (!userPermissions.length) {
      return true;
    }

    return PermissionsEngine.evaluate(PERMISSION_DOCUMENTS_CREATE, userPermissions);
  });

  public readonly $documentsViewModels = computed<IRowDocument[]>(() => {
    return this.resourceDocuments.value().map((data: IDocumentationResource) => {
      const formattedDate = data.lastSyncedAt
        ? new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(data.lastSyncedAt))
        : 'Sin sincronizar';

      return {
        id: `${data.organization}/${data.repositoryName}`,
        title: data.name ?? data.repositoryName,
        region: data.organization,
        created: data.lastSyncedAt ? new Date(data.lastSyncedAt) : new Date(),
        modified: data.lastSyncedAt ? new Date(data.lastSyncedAt) : new Date(),
        organization: data.organization,
        repositoryName: data.repositoryName,
        name: data.name,
        description: data.description,
        url: data.url,
        lastSyncedAt: data.lastSyncedAt,
        lastSyncedAtFormatted: formattedDate,
        menu: TABLE_OPTIONS_DOCUMENTS,
      };
    });
  });

  ngOnInit(): void {
    this._eventsService
      .sendEvent(ListDocumentsComponent.EVENT_VIEW_SESSION, { start_session: new Date().toISOString() })
      ?.pipe(takeUntil(this._destroy$))
      .subscribe();
  }

  public onTableOptionSelect(event: ITableDocuments): void {
    const rawOption = event?.option?.optionSeleted ?? '';
    const selectedOption = rawOption.toUpperCase();
    const row = event?.row;

    if (!row || !selectedOption) {
      return;
    }

    if (selectedOption === EEventSelectItem.OPT2 || selectedOption === 'OPT2') {
      this.promptDeleteModal(row);
      return;
    }

    if (selectedOption === EEventSelectItem.OPT1 || selectedOption === 'OPT1') {
      this.navigateWithMode(row, EResourceViewMode.VIEW);
      return;
    }

    if (selectedOption === EEventSelectItem.OPT3 || selectedOption === 'OPT3') {
      this.navigateWithMode(row, EResourceViewMode.EDIT);
      return;
    }
  }

  private promptDeleteModal(row: IRowDocument): void {
    const resource: IDocumentationResource = {
      organization: row.organization ?? '',
      repositoryName: row.repositoryName ?? '',
      name: row.name,
      description: row.description,
      url: row.url,
      lastSyncedAt: row.lastSyncedAt ?? null,
    };

    this.$documentToDelete.set(resource);
    this.$modalInformation.update((prev) => ({
      ...prev,
      paragraph: `¿Estás seguro de que deseas eliminar el recurso "${resource.repositoryName}"?`,
    }));
    this.modal()?.showModal();
  }

  private navigateWithMode(row: IRowDocument, mode: EResourceViewMode): void {
    this._router.navigate([ListDocumentsComponent.ROUTE_CREATE], {
      queryParams: {
        [ListDocumentsComponent.PARAM_ORG]: row.organization,
        [ListDocumentsComponent.PARAM_REPO]: row.repositoryName,
        [ListDocumentsComponent.PARAM_MODE]: mode,
      },
    });
  }

  public handleModalAction(buttonId: string): void {
    if (buttonId !== ListDocumentsComponent.BUTTON_ACCEPT) {
      this.modal()?.handleClose(ListDocumentsComponent.MODAL_CLOSE_CANCEL);
      return;
    }

    const currentDoc = this.$documentToDelete();
    if (!currentDoc) {
      return;
    }

    this._docService
      .deleteResource(currentDoc.organization, currentDoc.repositoryName)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: () => {
          this.resourceDocuments.reload();
          this.modal()?.handleClose(ListDocumentsComponent.MODAL_CLOSE_ACCEPT);
        },
      });
  }

  public goToCreateNewDocument(): void {
    this._router.navigate([ListDocumentsComponent.ROUTE_CREATE]);
  }

  public goBack(): void {
    this._router.navigate([ListDocumentsComponent.ROUTE_DASHBOARD]);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}


----------------

<section class="bc-container bc-mt-5">
  <app-page-header
    [$title]="'Recursos de Documentación'"
    [$subtitle]="'Configuración de repositorios fuente'"
    [$backRoute]="'/dashboard'"
    [$actionLabel]="'Agregar nuevo recurso'"
    [$permissionButton]="$permissionCreate()"
    (actionClick)="goToCreateNewDocument()"
  />

  @if (resourceDocuments.isLoading()) {
    <app-skeleton-grid [$count]="'1'" [$type]="'square'" [$width]="'1200'" [$height]="'800'" />
  } @else if (resourceDocuments.error()) {
    <app-error-state [$message]="'No se obtuvieron los recursos de documentación'" (retry)="resourceDocuments.reload()" />
  } @else if (resourceDocuments.value().length > 0) {
    <app-list-all-documents
      [$data]="$documentsViewModels()"
      [$cellOptions]="$cellOptions()"
      ($optionSelect)="onTableOptionSelect($event)"
    />
  } @else {
    <div class="bc-row bc-justify-content-center bc-align-items-center bc-flex-column bc-gap-4 bc-py-5">
      <em class="bc-icon">empty</em>
      <h2>No hay recursos registrados</h2>
      <p>No se encontraron repositorios de documentación configurados.</p>

      <nv-button
        typeButton="primary"
        sizeButton="small"
        width="hug"
        routerLink="/admin/create-document"
      >
        Crear tu primer recurso
      </nv-button>
    </div>
  }
</section>

<nv-modal
  #modal
  [backdropClose]="'true'"
  [modalConfig]="$modalInformation()"
  (buttonSelect)="handleModalAction($event)"
>
  <div modalContent>
    <p>{{ $modalInformation().paragraph }}</p>
  </div>
</nv-modal>
