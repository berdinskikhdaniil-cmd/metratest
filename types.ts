export enum ViewState {
  HOME = 'HOME',
  DESCRIPTION = 'DESCRIPTION',
  FURNITURE = 'FURNITURE',
  FLOOR_PLAN = 'FLOOR_PLAN'
}

export interface GeneratedImageResult {
  imageUrl: string;
}

export interface DescriptionResult {
  text: string;
}