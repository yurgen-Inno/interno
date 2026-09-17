import { FormControl } from '@angular/forms';

export interface IDocumentationResource {
  organization: string;
  repositoryName: string;
  name: string;
  description?: string;
  url?: string;
  lastSyncedAt?: string;
}

export interface IRowDocument extends IDocumentationResource {
  id?: string;
  title?: string;
  region?: string;
  created?: Date;
  modified?: Date;
  lastSyncedAtFormatted?: string;
  menu?: unknown[];
}

export interface IEventSelectDocument {
  optionSelected: string;
  optionSeleted?: string;
  rowData: IRowDocument;
}

export interface IPaginatorV2ChangeEvent {
  id: string;
  currentPage: number;
  itemsPerPage: number;
  nextPage: boolean;
  previousPage: boolean;
  noMoreRecords?: () => void;
}

export interface IResourceForm {
  organization: FormControl<string>;
  repositoryName: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
  url: FormControl<string>;
}