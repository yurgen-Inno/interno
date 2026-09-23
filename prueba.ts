public resourceGetAllAuthors = rxResource({
  params: () => ({
    email: this.$email(),
    ...this.$filters(),
  }),
  stream: ({ params }) => {
    const { email, ...filters } = params;
    return this._seniorityServices.getAllDevelopers(email, filters);
  },
  defaultValue: {
    count: 0,
    page: 0,
    size: 15,
    results: [],
  } as IDevelopers,
});



@if (resourceGetAllAuthors.isLoading()) {
  <ng-container [ngTemplateOutlet]="tableSkeleton" />
} @else if (resourceGetAllAuthors.error()) {
  <section class="bc-mt-4 bc-row">
    <div class="bc-col-12">
      <app-error-state
        [$type]="'error'"
        [$title]="'No pudimos cargar los autores'"
        [$message]="'Ocurrió un error al obtener la lista de autores. Intenta de nuevo.'"
        ($retry)="resourceGetAllAuthors.reload()"
      />
    </div>
  </section>
} @else {
  <section class="bc-mt-4 bc-row">
    <bc-table-container class="bc-col-12" [dataTable]="$data()" [cellOptions]="$cellOptions()">
      <bc-table-header title="Ranking de Seniority">
        <small>Aquí puedes comparar</small>
      </bc-table-header>

      <bc-table-content>
        <table caption="tabla" bc-table [selection]="false" [sort]="true" [pairPaginators]="false" [dropdownHtml]="true">
          <thead>
            <tr>
              <th scope="col" bc-cell>Posición</th>
              <th scope="col" bc-cell>Nombre</th>
              <th scope="col" bc-cell [fixed]="true">Rol</th>
              <th scope="col" bc-cell>Nivel</th>
              <th scope="col" bc-cell>Puntaje</th>
              <th scope="col" bc-cell type="action">Acción</th>
            </tr>
          </thead>
          <tbody>
            @for (row of $data(); track row.position) {
              <tr>
                <td bc-cell>{{ row.position }}</td>
                <td bc-cell>{{ row.nombreCompleto }}</td>
                <td bc-cell>{{ row.rol }}</td>
                <td bc-cell>{{ row.level }}</td>
                <td bc-cell>{{ row.score }}</td>
                <td bc-cell type="action" style="width: 200px">
                  <nv-button
                    typeButton="ghost"
                    sizeButton="small"
                    (click)="viewProjects(row.nombreCompleto)"
                  >
                    <nv-icon fontIcon="icon-view"></nv-icon>
                    Ver proyectos
                  </nv-button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </bc-table-content>
    </bc-table-container>
  </section>
}